import os
import sys
import traceback
import logging
import asyncio
import json 

# This ensures that the logger configured in main.py is used
logger = logging.getLogger(__name__)

# Add the parent directory to the path to allow for correct imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Scraper.forum_scraper import scrape_forum_data
from Scraper.annual_report_scraper import scrape_annual_report_text
from Scraper.concall_scraper import scrape_concall_transcripts
from Preprocessing.forum_preprocess import preprocess_forum_data
from Preprocessing.annual_preprocess import preprocess_annual_report
from Preprocessing.concall_preprocess import preprocess_concall_transcripts
from Enhanced_preprocessing.enhance_forum import enhance_forum_data
from Enhanced_preprocessing.enhance_annual import enhance_annual_data
from Enhanced_preprocessing.enhance_concall import enhance_concall_data
from Pdf_report_maker.section_generator import ReportSectionGenerator
from Pdf_report_maker.assemble_pdf import BrokerageReportAssembler
from Auth.supabase_utils import upload_pdf_to_supabase, get_signed_url

def create_chunks(data, chunk_size=2500, overlap=300):
    """Creates overlapping chunks from a long text."""
    if isinstance(data, dict):
        text = json.dumps(data)
    else:
        text = data

    if not text:
        return []
    
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
        if end >= len(text):
            break
    return chunks

async def generate_stock_report(stock_name: str, user_id: int):
    """
    Asynchronous function to perform the entire report generation process.
    It now handles PDF creation, upload, URL signing, and cleanup internally.
    Returns a dictionary with the final signed URL and filename.
    """
    local_pdf_path = None  # Ensure this is defined for the finally block
    try:
        logger.info(f"BACKGROUND TASK STARTED: Report generation for '{stock_name}' for user_id '{user_id}'.")

        # Initialize variables
        enhanced_forum = "No forum data found for this company."
        enhanced_annual = "No annual report data found for this company."
        enhanced_concall = "No concall transcript data found for this company."

# --- Step 1: Forum Post data ---
        try:
            logger.info(f"Step 1: Scraping forum data for {stock_name}...")
            forum_raw = await asyncio.to_thread(scrape_forum_data, stock_name)
            
            if forum_raw and len(forum_raw) > 0:
                logger.info(f"Forum data scraped successfully: {len(forum_raw)} posts")
                forum_preprocessed = preprocess_forum_data([{'Stock Name': stock_name, 'Posts': forum_raw}])
                
                # Convert preprocessed data to a single string for chunking
                forum_text = json.dumps(forum_preprocessed)
                forum_chunks = create_chunks(forum_text)
                logger.info(f"📊 Created {len(forum_chunks)} forum chunks for processing.")
                
                summarized_chunks = []
                for i, chunk in enumerate(forum_chunks):
                    logger.info(f"🔄 Processing forum chunk {i+1}/{len(forum_chunks)}...")
                    # Pass the text chunk to the enhancer
                    chunk_result = await asyncio.to_thread(enhance_forum_data, chunk, stock_name)
                    summarized_chunks.append(chunk_result)
                
                logger.info("✅ All forum chunks processed. Consolidating results...")
                enhanced_forum = "[" + ",".join(filter(None, summarized_chunks)) + "]"
            else:
                logger.warning(f"No forum data found for {stock_name}")
        except Exception:
            logger.error(f"Error in forum processing for {stock_name}:", exc_info=True)


# --- Step 2: Annual Report data ---
        enhanced_annual = None 
        try:
            logger.info(f"Step 2: Scraping annual report for {stock_name}...")
            annual_raw = await asyncio.to_thread(scrape_annual_report_text, stock_name)
            if annual_raw:
                logger.info(f"Annual report scraped successfully: {len(annual_raw)} sections")
                annual_text = " ".join([text for _, text in annual_raw])
                annual_preprocessed = preprocess_annual_report(annual_text)
                logger.info("Chunking annual report for batch processing...")
                report_chunks = create_chunks(annual_preprocessed)
                logger.info(f"📊 Created {len(report_chunks)} chunks for processing.")
                
                summarized_chunks = []
                for i, chunk in enumerate(report_chunks):
                    logger.info(f"🔄 Processing chunk {i+1}/{len(report_chunks)}...")
                    chunk_result = await asyncio.to_thread(enhance_annual_data, chunk, stock_name)
                    summarized_chunks.append(chunk_result)
                
                logger.info("✅ All chunks processed. Consolidating results...")
                enhanced_annual = "[" + ",".join(filter(None, summarized_chunks)) + "]"
            else:
                logger.warning(f"No annual report data found for {stock_name}")

        except Exception:
            logger.error(f"Error in annual report processing for {stock_name}:", exc_info=True)


# --- Step 3: Concall Transcript data ---
        try:
            logger.info(f"Step 3: Scraping concall transcripts for {stock_name}...")
            concall_raw = await asyncio.to_thread(scrape_concall_transcripts, stock_name)
            
            if concall_raw and len(concall_raw) > 0:
                logger.info(f"Concall transcripts scraped successfully: {len(concall_raw)} transcripts")
                concall_text = " ".join([transcript.get("text", "") for transcript in concall_raw])
                _, _, concall_preprocessed = preprocess_concall_transcripts(concall_text)

                concall_chunks = create_chunks(concall_preprocessed)
                logger.info(f"📊 Created {len(concall_chunks)} concall chunks for processing.")

                summarized_chunks = []
                for i, chunk in enumerate(concall_chunks):
                    logger.info(f"🔄 Processing concall chunk {i+1}/{len(concall_chunks)}...")
                    # Pass the text chunk to the enhancer
                    chunk_result = await asyncio.to_thread(enhance_concall_data, chunk, stock_name)
                    summarized_chunks.append(chunk_result)

                logger.info("✅ All concall chunks processed. Consolidating results...")
                enhanced_concall = "[" + ",".join(filter(None, summarized_chunks)) + "]"
            else:
                logger.warning(f"No concall transcript data found for {stock_name}")
        except Exception:
            logger.error(f"Error in concall transcript processing for {stock_name}:", exc_info=True)

        # --- Step 4 & 5: Generate Sections and Assemble PDF ---
        logger.info("Step 4: Generating report sections...")
        
        try:
            generator = ReportSectionGenerator(enhanced_concall, enhanced_forum, enhanced_annual)
            sections = generator.generate_all_sections()

            # Check if any section returned an error string or is empty
            for section_name, content in sections.items():
                if not content or "Error processing" in str(content):
                    raise Exception(f"Failed to generate content for section: {section_name}")

            logger.info("Report sections generated successfully.")

            # --- Step 5  ---
            logger.info("Step 5: Assembling PDF report...")
            assembler = BrokerageReportAssembler(stock_name)
            
            # 5a. Generate the PDF locally
            local_pdf_path = assembler.generate_pdf(sections)
            if not local_pdf_path or not os.path.exists(local_pdf_path):
                raise Exception("PDF generation failed: No local file was created.")
            
            # 5b. Upload to Supabase
            filename = os.path.basename(local_pdf_path)
            storage_path = f"reports/{filename}"
            uploaded_path = upload_pdf_to_supabase(local_pdf_path, dest_path=storage_path)
            if not uploaded_path:
                raise Exception("Failed to upload PDF to Supabase.")
            
            # 5c. Get the signed URL
            signed_url = get_signed_url(uploaded_path)
            if not signed_url:
                raise Exception("Failed to create a signed URL for the report.")
                
            logger.info(f"BACKGROUND TASK COMPLETED for {stock_name}. Signed URL: {signed_url}")
            
            return {
                "msg": "PDF report generated successfully",
                "signed_url": signed_url,
                "storage_path": uploaded_path,
                "filename": filename
            }

        except Exception as e:
            # If any AI call fails and raises an error, we catch it here.
            logger.error(f"Failed during section generation or PDF assembly: {e}", exc_info=True)
            # Re-raise the exception to ensure the main background task fails.
            raise e

    except Exception as e:
        logger.error(f"--- CRITICAL FAILURE IN BACKGROUND TASK for {stock_name} ---", exc_info=True)
        # Return None or raise to indicate failure to the background task manager
        return None
        
    finally:
        # 5d. Clean up the local file regardless of success or failure
        if local_pdf_path and os.path.exists(local_pdf_path):
            try:
                os.remove(local_pdf_path)
                logger.info(f"[PDF] Cleaned up local file: {local_pdf_path}")
            except Exception as e:
                logger.error(f"Failed to clean up local file {local_pdf_path}: {e}")





















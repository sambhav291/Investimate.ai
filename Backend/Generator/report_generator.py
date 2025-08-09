import os
import sys
import traceback
import logging
import asyncio

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
        # try:
        #     logger.info(f"Step 1: Scraping forum data for {stock_name}...")
        #     forum_raw = await asyncio.to_thread(scrape_forum_data, stock_name)
            
        #     if forum_raw and len(forum_raw) > 0:
        #         logger.info(f"Forum data scraped successfully: {len(forum_raw)} posts")
        #         forum_preprocessed = preprocess_forum_data([{'Stock Name': stock_name, 'Posts': forum_raw}])
        #         enhanced_forum = enhance_forum_data(forum_preprocessed, stock_name)
        #     else:
        #         logger.warning(f"No forum data found for {stock_name}")
        # except Exception:
        #     logger.error(f"Error in forum processing for {stock_name}:")
        #     logger.error(traceback.format_exc())

        # --- Step 2: Annual Report data ---
        try:
            logger.info(f"Step 2: Scraping annual report for {stock_name}...")
            annual_raw = await asyncio.to_thread(scrape_annual_report_text, stock_name)
            if annual_raw:
                logger.info(f"Annual report scraped successfully: {len(annual_raw)} sections")
                annual_text = " ".join([text for _, text in annual_raw])
                annual_preprocessed = preprocess_annual_report(annual_text)
                enhanced_annual = enhance_annual_data(annual_preprocessed, stock_name)
            else:
                logger.warning(f"No annual report data found for {stock_name}")
        except Exception:
            logger.error(f"Error in annual report processing for {stock_name}:", exc_info=True)


        # --- Step 3: Concall Transcript data ---
        #
        # try:
        #     logger.info(f"Step 3: Scraping concall transcripts for {stock_name}...")
        #     concall_raw = await asyncio.to_thread(scrape_concall_transcripts, stock_name)
            
        #     if concall_raw and len(concall_raw) > 0:
        #         logger.info(f"Concall transcripts scraped successfully: {len(concall_raw)} transcripts")
        #         concall_text = " ".join([transcript.get("text", "") for transcript in concall_raw])
        #         _, _, concall_preprocessed = preprocess_concall_transcripts(concall_text)
        #         enhanced_concall = enhance_concall_data(concall_preprocessed, stock_name)
        #     else:
        #         logger.warning(f"No concall transcript data found for {stock_name}")
        # except Exception:
        #     logger.error(f"Error in concall transcript processing for {stock_name}:")
        #     logger.error(traceback.format_exc())

        # --- Step 4: Generate report sections ---
        logger.info("Step 4: Generating report sections...")
        generator = ReportSectionGenerator(enhanced_concall, enhanced_forum, enhanced_annual)
        sections = generator.generate_all_sections()
        if not sections:
            raise Exception("Failed to generate report sections.")
        logger.info("Report sections generated successfully.")

        # --- Step 5: Assemble, Upload, and Finalize PDF ---
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
        
        # Return a dictionary with all necessary info for the frontend
        return {
            "msg": "PDF report generated successfully",
            "signed_url": signed_url,
            "storage_path": uploaded_path,
            "filename": filename
        }

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


























# import os
# import sys
# import traceback

# from fastapi import HTTPException

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# from Scraper.forum_scraper import scrape_forum_data
# from Scraper.annual_report_scraper import scrape_annual_report_text
# from Scraper.concall_scraper import scrape_concall_transcripts
# from Preprocessing.forum_preprocess import preprocess_forum_data
# from Preprocessing.annual_preprocess import preprocess_annual_report
# from Preprocessing.concall_preprocess import preprocess_concall_transcripts
# from Enhanced_preprocessing.enhance_forum import enhance_forum_data
# from Enhanced_preprocessing.enhance_annual import enhance_annual_data
# from Enhanced_preprocessing.enhance_concall import enhance_concall_data
# from Pdf_report_maker.section_generator import ReportSectionGenerator
# from Pdf_report_maker.assemble_pdf import BrokerageReportAssembler

# def generate_stock_report(stock_name: str):
#     try:
#         print(f"Processing request for stock: {stock_name}")
        
#         # Initialize variables to avoid UnboundLocalError
#         enhanced_forum = "No forum data found for this company."
#         enhanced_annual = "No annual report data found for this company."
#         enhanced_concall = "No concall transcript data found for this company."
        
#         # Step 1: Forum Post data
#         try:
#             print(f"🔍 Scraping forum data for {stock_name}...")
#             forum_raw = scrape_forum_data(stock_name)
            
#             if forum_raw and len(forum_raw) > 0:
#                 print(f"✅ Forum data scraped successfully: {len(forum_raw)} posts")
#                 forum_preprocessed = preprocess_forum_data([{
#                     'Stock Name': stock_name,
#                     'Posts': forum_raw
#                 }])
#                 enhanced_forum = enhance_forum_data(forum_preprocessed, stock_name)
#             else:
#                 print(f"⚠️ No forum data found for {stock_name}")
#         except Exception as e:
#             print(f"❌ Error in forum processing: {str(e)}")
#             traceback.print_exc()

#         # Step 2: Annual Report data
#         try:
#             print(f"🔍 Scraping annual report for {stock_name}...")
#             annual_raw = scrape_annual_report_text(stock_name)
            
#             if annual_raw and len(annual_raw) > 0:
#                 print(f"✅ Annual report scraped successfully: {len(annual_raw)} sections")
#                 annual_text = " ".join([text for _, text in annual_raw])
#                 annual_preprocessed = preprocess_annual_report(annual_text)
#                 enhanced_annual = enhance_annual_data(annual_preprocessed, stock_name)
#             else:
#                 print(f"⚠️ No annual report data found for {stock_name}")
#         except Exception as e:
#             print(f"❌ Error in annual report processing: {str(e)}")
#             traceback.print_exc()

#         # Step 3: Concall Transcript data
#         try:
#             print(f"🔍 Scraping concall transcripts for {stock_name}...")
#             concall_raw = scrape_concall_transcripts(stock_name)
            
#             if concall_raw and len(concall_raw) > 0:
#                 print(f"✅ Concall transcripts scraped successfully: {len(concall_raw)} transcripts")
#                 concall_text = " ".join([transcript.get("text", "") for transcript in concall_raw])
#                 _, _, concall_preprocessed = preprocess_concall_transcripts(concall_text)
#                 enhanced_concall = enhance_concall_data(concall_preprocessed, stock_name)
#             else:
#                 print(f"⚠️ No concall transcript data found for {stock_name}")
#         except Exception as e:
#             print(f"❌ Error in concall transcript processing: {str(e)}")
#             traceback.print_exc()

#         # Step 4: Generate report sections
#         try:
#             print(f"📄 Generating report sections...")
#             generator = ReportSectionGenerator(enhanced_concall, enhanced_forum, enhanced_annual)
#             sections = generator.generate_all_sections()
#             print(f"✅ Report sections generated successfully")
#         except Exception as e:
#             print(f"❌ Error generating report sections: {str(e)}")
#             traceback.print_exc()
#             raise HTTPException(status_code=500, detail=f"Failed to generate report sections: {str(e)}")

#         # Step 5: Assemble and generate PDF
#         try:
#             print(f"🔧 Assembling PDF report...")
#             assembler = BrokerageReportAssembler(stock_name)
#             pdf_path = assembler.generate_pdf(sections)
#             if not pdf_path:
#                 raise HTTPException(status_code=500, detail="PDF generation failed: No path returned.")
#             print(f"✅ PDF report generated successfully: {pdf_path}")
#             return pdf_path, os.path.basename(pdf_path)
#         except Exception as e:
#             print(f"❌ Error generating PDF: {str(e)}")
#             traceback.print_exc()
#             raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

#     except HTTPException:
#         # Re-raise HTTPExceptions as-is
#         raise
#     except Exception as e:
#         print(f"❌ CRITICAL ERROR: {str(e)}")
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Critical error in stock report generation: {str(e)}")













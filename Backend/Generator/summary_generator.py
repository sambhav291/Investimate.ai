

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
from Ai_engine.forum_summarizer import summarize_forum_data
from Ai_engine.annual_report_summarizer import summarize_annual_report_sections
from Ai_engine.concall_summarizer import summarize_concall_transcripts
from Ai_engine.combine_summaries import generate_combined_summary


# Note: This function is now async to properly work with FastAPI's background tasks
async def generate_stock_summary(stock_name: str, user_id: int):
    """
    Asynchronous function to perform the entire summary generation process.
    It's wrapped in a try-except block to catch and log any exceptions
    that occur during the background task execution.
    """
    try:
        logger.info(f"BACKGROUND TASK STARTED: Summary generation for '{stock_name}' for user_id '{user_id}'.")

        forum_summary = "No forum data available."
        annual_summary = "No annual report data available."
        concall_summary = "No concall transcript data available."

        # --- Step 1: Forum Summary ---
        try:
            logger.info(f"Step 1: Scraping forum data for {stock_name}...")
            forum_raw = await asyncio.to_thread(scrape_forum_data, stock_name)
            
            if forum_raw and len(forum_raw) > 0:
                logger.info(f"Forum data scraped successfully: {len(forum_raw)} posts")
                forum_preprocessed = preprocess_forum_data([{'Stock Name': stock_name, 'Posts': forum_raw}])
                
                if forum_preprocessed and len(forum_preprocessed) > 0:
                    forum_summary = summarize_forum_data(forum_preprocessed) or "Forum data processed but no summary generated."
                else:
                    forum_summary = "No relevant forum posts found after preprocessing."
            else:
                forum_summary = "No forum data found for this company."
        except Exception:
            logger.error(f"Error in forum processing for {stock_name}:")
            logger.error(traceback.format_exc())
            forum_summary = "An error occurred while processing forum data."

        # --- Step 2: Annual Report Summary ---
        try:
            logger.info(f"Step 2: Scraping annual report for {stock_name}...")
            annual_raw = await asyncio.to_thread(scrape_annual_report_text, stock_name)
            
            if annual_raw and len(annual_raw) > 0:
                logger.info(f"Annual report scraped successfully: {len(annual_raw)} sections")
                annual_text = " ".join([text for _, text in annual_raw])
                annual_preprocessed = preprocess_annual_report(annual_text)
                
                if annual_preprocessed:
                    annual_summary = summarize_annual_report_sections(stock_name, annual_preprocessed) or "Annual report processed but no summary generated."
                else:
                    annual_summary = "No relevant content found in annual report after preprocessing."
            else:
                annual_summary = "No annual report data found for this company."
        except Exception:
            logger.error(f"Error in annual report processing for {stock_name}:")
            logger.error(traceback.format_exc())
            annual_summary = "An error occurred while processing the annual report."

        # --- Step 3: Concall Summary ---
        try:
            logger.info(f"Step 3: Scraping concall transcripts for {stock_name}...")
            concall_raw = await asyncio.to_thread(scrape_concall_transcripts, stock_name)
            
            if concall_raw and len(concall_raw) > 0:
                logger.info(f"Concall transcripts scraped successfully: {len(concall_raw)} transcripts")
                concall_text = " ".join([transcript.get("text", "") for transcript in concall_raw])
                _, _, concall_preprocessed = preprocess_concall_transcripts(concall_text)
                
                if concall_preprocessed and len(concall_preprocessed) > 0:
                    concall_summary = summarize_concall_transcripts(concall_preprocessed) or "Concall transcript processed but no summary generated."
                else:
                    concall_summary = "No relevant content found in concall transcript after preprocessing."
            else:
                concall_summary = "No concall transcript data found for this company."
        except Exception:
            logger.error(f"Error in concall transcript processing for {stock_name}:")
            logger.error(traceback.format_exc())
            concall_summary = "An error occurred while processing concall transcripts."

        # --- Step 4: Combined Summary ---
        try:
            logger.info("Step 4: Generating combined summary...")
            combined_summary = generate_combined_summary(
                forum_summary,
                annual_summary,
                concall_summary,
                stock_name
            )
            logger.info("Combined summary generated successfully.")
        except Exception:
            logger.error(f"Error generating combined summary for {stock_name}:")
            logger.error(traceback.format_exc())
            combined_summary = "An error occurred while generating the combined summary."
        
        logger.info(f"BACKGROUND TASK COMPLETED for {stock_name}. Results should be saved.")

        # The return value of a background task is not sent to the client,
        # but it's good practice to return the result for potential future use.
        return {
            "forum_summary": forum_summary,
            "annual_report_summary": annual_summary,
            "concall_summary": concall_summary,
            "combined_summary": combined_summary
        }

    except Exception:
        # This is the most important part: it will catch any unexpected crash
        # in the entire background process and log it.
        logger.error(f"--- CRITICAL FAILURE IN BACKGROUND TASK for {stock_name} ---")
        logger.error(traceback.format_exc())
        # You might want to update the database here to indicate that the task failed.









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
# from Ai_engine.forum_summarizer import summarize_forum_data
# from Ai_engine.annual_report_summarizer import summarize_annual_report_sections
# from Ai_engine.concall_summarizer import summarize_concall_transcripts
# from Ai_engine.combine_summaries import generate_combined_summary


# def generate_stock_summary(stock_name: str):
#     try:
#         forum_summary = "No forum data available."
#         annual_summary = "No annual report data available."
#         concall_summary = "No concall transcript data available."
        
#         print(f"Processing request for stock: {stock_name}")
        
#         # Step 1: Forum Summary - with proper error handling
#         try:
#             print(f"🔍 Scraping forum data for {stock_name}...")
#             forum_raw = scrape_forum_data(stock_name)
            
#             if forum_raw and len(forum_raw) > 0:
#                 print(f"✅ Forum data scraped successfully: {len(forum_raw)} posts")
#                 forum_preprocessed = preprocess_forum_data([{
#                     'Stock Name': stock_name,
#                     'Posts': forum_raw
#                 }])
                
#                 if forum_preprocessed and len(forum_preprocessed) > 0:
#                     forum_summary = summarize_forum_data(forum_preprocessed) or "Forum data processed but no summary generated."
#                 else:
#                     forum_summary = "No relevant forum posts found after preprocessing."
#             else:
#                 forum_summary = "No forum data found for this company."
#         except Exception as e:
#             print(f"❌ Error in forum processing: {str(e)}")
#             forum_summary = f"Error processing forum data: {str(e)[:100]}..."
#             traceback.print_exc()



#         # Step 3: Concall Summary - with proper error handling
#         try:
#             print(f"🔍 Scraping concall transcripts for {stock_name}...")
#             concall_raw = scrape_concall_transcripts(stock_name)
            
#             if concall_raw and len(concall_raw) > 0:
#                 print(f"✅ Concall transcripts scraped successfully: {len(concall_raw)} transcripts")
#                 # Extract text from the concall data
#                 concall_text = " ".join([transcript.get("text", "") for transcript in concall_raw])
#                 _, _, concall_preprocessed = preprocess_concall_transcripts(concall_text)
                
#                 if concall_preprocessed and len(concall_preprocessed) > 0:
#                     concall_summary = summarize_concall_transcripts(concall_preprocessed) or "Concall transcript processed but no summary generated."
#                 else:
#                     concall_summary = "No relevant content found in concall transcript after preprocessing."
#             else:
#                 concall_summary = "No concall transcript data found for this company."
#         except Exception as e:
#             print(f"❌ Error in concall transcript processing: {str(e)}")
#             concall_summary = f"Error processing concall transcript data: {str(e)[:100]}..."
#             traceback.print_exc()

#         # Step 2: Annual Report Summary - with proper error handling
#         try:
#             print(f"🔍 Scraping annual report for {stock_name}...")
#             annual_raw = scrape_annual_report_text(stock_name)
            
#             if annual_raw and len(annual_raw) > 0:
#                 print(f"✅ Annual report scraped successfully: {len(annual_raw)} sections")
#                 # Extract text from the tuple format (filename, text)
#                 annual_text = " ".join([text for _, text in annual_raw])
#                 annual_preprocessed = preprocess_annual_report(annual_text)
                
#                 if annual_preprocessed:
#                     annual_summary = summarize_annual_report_sections(stock_name, annual_preprocessed) or "Annual report processed but no summary generated."
#                 else:
#                     annual_summary = "No relevant content found in annual report after preprocessing."
#             else:
#                 annual_summary = "No annual report data found for this company."
#         except Exception as e:
#             print(f"❌ Error in annual report processing: {str(e)}")
#             annual_summary = f"Error processing annual report data: {str(e)[:100]}..."
#             traceback.print_exc()

#         # Step 4: Combined Summary - with proper error handling
#         try:
#             print("🔄 Generating combined summary...")
#             combined_summary = generate_combined_summary(
#                 forum_summary,
#                 annual_summary,
#                 concall_summary,
#                 stock_name
#             )
#             print("✅ Combined summary generated successfully")
#         except Exception as e:
#             print(f"❌ Error generating combined summary: {str(e)}")
#             combined_summary = f"Error generating combined summary: {str(e)}"
#             traceback.print_exc()

#         return {
#             "forum_summary": forum_summary,
#             "annual_report_summary": annual_summary,
#             "concall_summary": concall_summary,
#             "combined_summary": combined_summary
#         }

#     except Exception as e:
#         print(f"❌ CRITICAL ERROR: {str(e)}")
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=str(e))

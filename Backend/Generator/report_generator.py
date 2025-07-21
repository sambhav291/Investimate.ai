

import os
import sys
import traceback

from fastapi import HTTPException

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from Scraper.forum_scraper import scrape_forum_data
from Scraper.annual_report_scraper import REDACTED-GOOGLE-CLIENT-SECRETt
from Scraper.concall_scraper import REDACTED-GOOGLE-CLIENT-SECRETts
from Preprocessing.forum_preprocess import preprocess_forum_data
from Preprocessing.annual_preprocess import REDACTED-GOOGLE-CLIENT-SECRET
from Preprocessing.concall_preprocess import REDACTED-GOOGLE-CLIENT-SECRETcripts
from Enhanced_preprocessing.enhance_forum import enhance_forum_data
from Enhanced_preprocessing.enhance_annual import enhance_annual_data
from Enhanced_preprocessing.enhance_concall import enhance_concall_data
from Pdf_report_maker.section_generator import ReportSectionGenerator
from Pdf_report_maker.assemble_pdf import REDACTED-GOOGLE-CLIENT-SECRET

def generate_stock_report(stock_name: str):
    try:
        print(f"Processing request for stock: {stock_name}")
        
        # Initialize variables to avoid UnboundLocalError
        enhanced_forum = "No forum data found for this company."
        enhanced_annual = "No annual report data found for this company."
        enhanced_concall = "No concall transcript data found for this company."
        
        # Step 1: Forum Post data
        try:
            print(f"🔍 Scraping forum data for {stock_name}...")
            forum_raw = scrape_forum_data(stock_name)
            
            if forum_raw and len(forum_raw) > 0:
                print(f"✅ Forum data scraped successfully: {len(forum_raw)} posts")
                forum_preprocessed = preprocess_forum_data([{
                    'Stock Name': stock_name,
                    'Posts': forum_raw
                }])
                enhanced_forum = enhance_forum_data(forum_preprocessed, stock_name)
            else:
                print(f"⚠️ No forum data found for {stock_name}")
        except Exception as e:
            print(f"❌ Error in forum processing: {str(e)}")
            traceback.print_exc()

        # Step 2: Annual Report data
        try:
            print(f"🔍 Scraping annual report for {stock_name}...")
            annual_raw = REDACTED-GOOGLE-CLIENT-SECRETt(stock_name)
            
            if annual_raw and len(annual_raw) > 0:
                print(f"✅ Annual report scraped successfully: {len(annual_raw)} sections")
                annual_text = " ".join([text for _, text in annual_raw])
                annual_preprocessed = REDACTED-GOOGLE-CLIENT-SECRET(annual_text)
                enhanced_annual = enhance_annual_data(annual_preprocessed, stock_name)
            else:
                print(f"⚠️ No annual report data found for {stock_name}")
        except Exception as e:
            print(f"❌ Error in annual report processing: {str(e)}")
            traceback.print_exc()

        # Step 3: Concall Transcript data
        try:
            print(f"🔍 Scraping concall transcripts for {stock_name}...")
            concall_raw = REDACTED-GOOGLE-CLIENT-SECRETts(stock_name)
            
            if concall_raw and len(concall_raw) > 0:
                print(f"✅ Concall transcripts scraped successfully: {len(concall_raw)} transcripts")
                concall_text = " ".join([transcript.get("text", "") for transcript in concall_raw])
                _, _, concall_preprocessed = REDACTED-GOOGLE-CLIENT-SECRETcripts(concall_text)
                enhanced_concall = enhance_concall_data(concall_preprocessed, stock_name)
            else:
                print(f"⚠️ No concall transcript data found for {stock_name}")
        except Exception as e:
            print(f"❌ Error in concall transcript processing: {str(e)}")
            traceback.print_exc()

        # Step 4: Generate report sections
        try:
            print(f"📄 Generating report sections...")
            generator = ReportSectionGenerator(enhanced_concall, enhanced_forum, enhanced_annual)
            sections = generator.generate_all_sections()
            print(f"✅ Report sections generated successfully")
        except Exception as e:
            print(f"❌ Error generating report sections: {str(e)}")
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Failed to generate report sections: {str(e)}")

        # Step 5: Assemble and generate PDF
        try:
            print(f"🔧 Assembling PDF report...")
            assembler = REDACTED-GOOGLE-CLIENT-SECRET(stock_name)
            success, pdf_path = assembler.generate_pdf(sections)
            if not success:
                raise HTTPException(status_code=500, detail=f"PDF generation failed: {pdf_path}")
            print(f"✅ PDF report generated successfully: {pdf_path}")
            return pdf_path, os.path.basename(pdf_path)
        except Exception as e:
            print(f"❌ Error generating PDF: {str(e)}")
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

    except HTTPException:
        # Re-raise HTTPExceptions as-is
        raise
    except Exception as e:
        print(f"❌ CRITICAL ERROR: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Critical error in stock report generation: {str(e)}")










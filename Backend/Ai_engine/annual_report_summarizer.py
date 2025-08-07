import os
import sys
import logging

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import free summarizer
from Ai_engine.free_summarizer import summarize_annual_report_sections

logger = logging.getLogger(__name__)

def summarize_annual_report_sections_legacy(company_name, section_data: dict, max_chunks_per_batch=5):
    """
    Legacy function that now uses free summarizer
    """
    return summarize_annual_report_sections(company_name, section_data)



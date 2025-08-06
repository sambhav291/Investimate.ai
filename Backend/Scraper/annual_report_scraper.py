import logging
import os
import tempfile
import fitz
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import time
import random

# --- Basic Configuration ---
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- More Realistic Browser Headers ---
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.google.com/"
}

# --- Create a single session object to persist cookies ---
SESSION = requests.Session()
SESSION.headers.update(HEADERS)

def get_company_url_from_screener(company_name: str) -> str | None:
    """Finds the company's page URL using the screener.in search API."""
    try:
        logger.info("Establishing session with screener.in homepage...")
        SESSION.get("https://www.screener.in/", timeout=15)
        time.sleep(random.uniform(0.5, 1.0))

        search_api_url = f"https://www.screener.in/api/company/search/?q={company_name}"
        logger.info(f"Calling Screener search API: {search_api_url}")
        response = SESSION.get(search_api_url, timeout=10)
        response.raise_for_status()
        search_results = response.json()
        
        if not search_results:
            logger.warning(f"Screener API returned no results for '{company_name}'")
            return None
            
        company_slug = search_results[0]['url']
        return urljoin("https://www.screener.in/", company_slug)
        
    except requests.RequestException as e:
        logger.error(f"API call to Screener failed for '{company_name}': {e}")
        return None

def download_and_extract_pdf(pdf_url: str) -> tuple[str, str] | None:
    """
    Downloads a PDF, extracts its text content, and implements a retry mechanism.
    """
    logger.info(f"📥 Downloading PDF from: {pdf_url}")
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            # Add a small random delay before each attempt
            time.sleep(random.uniform(1.0, 3.0))
            
            # Use a longer timeout and stream the response
            response = SESSION.get(pdf_url, stream=True, timeout=60) # Increased timeout to 60 seconds
            response.raise_for_status()

            # Process the PDF from the stream
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
                for chunk in response.iter_content(chunk_size=8192):
                    temp_pdf.write(chunk)
                temp_pdf_path = temp_pdf.name

            text = ""
            with fitz.open(temp_pdf_path) as doc:
                text = "".join(page.get_text() for page in doc)
            os.unlink(temp_pdf_path)

            if len(text.strip()) > 100:
                return (os.path.basename(pdf_url), text)
            
            logger.warning(f"Extracted text from {pdf_url} is too short, considering it empty.")
            return None

        except requests.exceptions.RequestException as e:
            logger.warning(f"Attempt {attempt + 1} of {max_retries} failed for {pdf_url}: {e}")
            if attempt + 1 == max_retries:
                logger.error(f"All download attempts failed for {pdf_url}.")
                return None
            time.sleep(5 * (attempt + 1)) # Wait longer before the next retry (5s, 10s)
            
        except Exception as e:
            logger.error(f"A non-network error occurred while processing PDF from {pdf_url}: {e}", exc_info=True)
            # Clean up temp file if it exists
            if 'temp_pdf_path' in locals() and os.path.exists(temp_pdf_path):
                os.unlink(temp_pdf_path)
            return None
            
    return None

def scrape_annual_report_text(company_name: str):
    logger.info(f"🔍 Starting robust annual report scrape for '{company_name}'...")
    company_url = get_company_url_from_screener(company_name)
    if not company_url:
        return []

    try:
        time.sleep(random.uniform(0.5, 1.5))
        response = SESSION.get(company_url, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        report_links = []
        
        # 1. First, try to find links with "Financial Year"
        report_links = soup.find_all('a', string=lambda text: text and "Financial Year" in text)
        if report_links:
            logger.info(f"📄 Found {len(report_links)} links with 'Financial Year'")
        
        # 2. If that fails, try finding links with "Annual Report"
        if not report_links:
            report_links = soup.select("#documents a:-soup-contains('Annual Report')")
            if report_links:
                logger.info(f"📄 Found {len(report_links)} links with 'Annual Report'")

        # 3. As a last resort, find all PDF links on the page
        if not report_links:
            all_links = soup.find_all('a', href=True)
            report_links = [link for link in all_links if ".pdf" in link['href'].lower()]
            if report_links:
                logger.info(f"📄 Found {len(report_links)} possible PDF links as a fallback")

        if not report_links:
            logger.warning(f"⚠️ No annual reports found for {company_name} after trying all methods.")
            return []

        # We only need the most recent report, so we process the first link found.
        most_recent_link = report_links[0]
        pdf_url = urljoin(company_url, most_recent_link['href'])
        logger.info(f"Found most recent annual report PDF link: {pdf_url}")

        report_data = download_and_extract_pdf(pdf_url)
        
        if report_data:
            logger.info(f"✅ Success: Scraped annual report for {company_name}")
            return [report_data]
        return []

    except Exception as e:
        logger.error(f"❌ Error scraping page for {company_name}: {e}")
        return []




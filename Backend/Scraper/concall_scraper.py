import logging
import os
import tempfile
import fitz  # PyMuPDF
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

def download_and_extract_pdf(pdf_url: str) -> dict | None:
    """Downloads a PDF, extracts its text, and returns a dictionary."""
    logger.info(f"📥 Downloading PDF from: {pdf_url}")
    try:
        time.sleep(random.uniform(1.0, 2.0))
        response = SESSION.get(pdf_url, stream=True, timeout=30)
        response.raise_for_status()

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            for chunk in response.iter_content(chunk_size=8192):
                temp_pdf.write(chunk)
            temp_pdf_path = temp_pdf.name

        text = ""
        with fitz.open(temp_pdf_path) as doc:
            text = "".join(page.get_text() for page in doc)
        os.unlink(temp_pdf_path)

        if len(text.strip()) > 100:
            filename = os.path.basename(pdf_url)
            return {"filename": filename, "url": pdf_url, "text": text}
        return None
            
    except Exception as e:
        logger.error(f"Failed to process PDF from {pdf_url}: {e}")
        return None

def scrape_concall_transcripts(company_name: str):
    """
    Main function to scrape concall transcripts for a given company.
    This version uses requests but faithfully replicates the original link finding logic.
    """
    logger.info(f"🔍 Starting robust concall transcript scrape for '{company_name}'...")
    company_url = get_company_url_from_screener(company_name)
    if not company_url:
        return []

    try:
        time.sleep(random.uniform(0.5, 1.5))
        response = SESSION.get(company_url, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # =====================================================================
        # --- ✅ FAITHFULLY RECREATING YOUR ORIGINAL ROBUST SELECTOR LOGIC ---
        # =====================================================================
        
        concall_links = []
        
        # Method 1: Find links inside a dedicated "concalls" section
        selectors = ["#concalls", ".concalls-section", "[id*='concall']", "[class*='concall']"]
        for selector in selectors:
            sections = soup.select(selector)
            for section in sections:
                links = section.find_all('a', href=True)
                if links:
                    logger.info(f"Found {len(links)} links using selector: {selector}")
                    concall_links.extend(links)
        
        # Method 2: If the above fails, find links with specific text
        if not concall_links:
            logger.info("Method 1 failed, trying Method 2: Searching for links by text...")
            links = soup.find_all("a", href=True)
            for link in links:
                link_text = link.text.lower()
                link_href = link.get('href', '').lower()
                if ('concall' in link_text or 'transcript' in link_text or 
                    'concall' in link_href or 'transcript' in link_href):
                    concall_links.append(link)
            if concall_links:
                logger.info(f"Found {len(concall_links)} links by searching text/href content.")

        # De-duplicate the results based on the href URL
        unique_links = []
        seen_hrefs = set()
        for link in concall_links:
            href = link.get('href', '')
            if href and href not in seen_hrefs and href.lower().endswith('.pdf'):
                unique_links.append(link)
                seen_hrefs.add(href)
        
        if not unique_links:
            logger.warning(f"⚠️ After all methods, no unique concall PDF links were found for {company_name}")
            return []
            
        logger.info(f"📄 Found {len(unique_links)} unique concall transcript links.")
        
        all_transcripts = []
        # Process the most recent 2 transcripts, as per your original logic
        for link in unique_links[:2]:
            pdf_url = urljoin(company_url, link['href'])
            transcript_data = download_and_extract_pdf(pdf_url)
            if transcript_data:
                all_transcripts.append(transcript_data)
        
        logger.info(f"✅ Successfully extracted {len(all_transcripts)} transcripts for {company_name}")
        return all_transcripts

    except Exception as e:
        logger.error(f"❌ An unexpected error occurred during scraping for {company_name}: {e}")
        return []








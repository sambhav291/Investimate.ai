import logging
import os
import tempfile
import fitz  # PyMuPDF
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# --- Basic Configuration ---
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Mimic a real browser to avoid being blocked ---
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
}

def get_company_url_from_screener(company_name: str) -> str | None:
    """
    Finds the company's page URL by using the screener.in search API.
    This replicates the "click the first suggestion" logic to handle typos.
    """
    # This is the API endpoint the website's search bar calls
    search_api_url = f"https://www.screener.in/api/company/search/?q={company_name}"
    logger.info(f"Calling Screener search API: {search_api_url}")
    
    try:
        response = requests.get(search_api_url, headers=HEADERS, timeout=10)
        response.raise_for_status()  # Raises an exception for bad status codes (4xx or 5xx)
        search_results = response.json()
        
        if not search_results:
            logger.warning(f"Screener API returned no results for '{company_name}'")
            return None
            
        # This is the crucial step: we take the first result from the API response.
        company_slug = search_results[0]['url']
        company_page_url = urljoin("https://www.screener.in/", company_slug)
        
        logger.info(f"Found company page for '{company_name}': {company_page_url}")
        return company_page_url
        
    except requests.RequestException as e:
        logger.error(f"Failed to call Screener search API for '{company_name}': {e}")
        return None

def download_and_extract_pdf(pdf_url: str) -> tuple[str, str] | None:
    """Downloads a PDF from a URL and extracts its text content."""
    logger.info(f"📥 Downloading PDF from: {pdf_url}")
    try:
        response = requests.get(pdf_url, headers=HEADERS, stream=True, timeout=30)
        response.raise_for_status()

        # Use a temporary file to avoid saving to disk permanently
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            for chunk in response.iter_content(chunk_size=8192):
                temp_pdf.write(chunk)
            temp_pdf_path = temp_pdf.name

        # Extract text using PyMuPDF
        text = ""
        with fitz.open(temp_pdf_path) as doc:
            for page in doc:
                text += page.get_text()
        
        os.unlink(temp_pdf_path) # Clean up the temporary file

        if len(text.strip()) > 100:
            filename = os.path.basename(pdf_url)
            logger.info(f"✅ Successfully extracted text from {filename}")
            return (filename, text)
        else:
            logger.warning(f"⚠️ Extracted text from {pdf_url} was too short, might not be a valid report.")
            return None
            
    except Exception as e:
        logger.error(f"Failed to process PDF from {pdf_url}: {e}")
        return None

def scrape_annual_report_text(company_name: str):
    """
    Main function to scrape annual report text for a given company.
    This version is fully based on the requests library.
    """
    logger.info(f"🔍 Starting lightweight annual report scrape for '{company_name}'...")
    
    # 1. Find the correct company page URL, handling typos.
    company_url = get_company_url_from_screener(company_name)
    if not company_url:
        logger.error(f"Could not find a valid company page for '{company_name}'. Aborting.")
        return []

    try:
        # 2. Get the HTML of the company page.
        response = requests.get(company_url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # 3. Find the annual report link. This selector is more specific and robust.
        # It looks for an <a> tag inside the element with id="documents" that contains the text "Annual Report".
        annual_report_link = soup.select_one("#documents a:-soup-contains('Annual Report')")
        
        if not annual_report_link or not annual_report_link.get('href'):
            logger.warning(f"No link containing 'Annual Report' found on the page for {company_name}")
            return []

        pdf_url = urljoin(company_url, annual_report_link['href'])
        logger.info(f"Found annual report PDF link: {pdf_url}")

        # 4. Download the PDF and extract text.
        report_data = download_and_extract_pdf(pdf_url)
        
        if report_data:
            return [report_data]
        return []

    except Exception as e:
        logger.error(f"❌ An unexpected error occurred during scraping for {company_name}: {e}")
        return []



# import logging
# import os
# import tempfile
# import time
# import json
# import re
# import fitz 
# import requests
# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.common.exceptions import TimeoutException, ElementNotInteractableException, NoSuchElementException
# from webdriver_manager.chrome import ChromeDriverManager

# logging.basicConfig(level=logging.INFO, 
#                     format='%(asctime)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# class StockDataScraper:
#     def __init__(self, headless=True):
#         self.temp_dir = tempfile.mkdtemp()
#         self.chrome_options = Options()
#         if headless:
#             self.chrome_options.add_argument("--headless=new")
#         self.chrome_options.add_argument("--window-size=1920,1080")
#         self.chrome_options.add_argument("--start-maximized")
#         self.chrome_options.add_argument("--disable-gpu")
#         self.chrome_options.add_argument("--no-sandbox")
#         self.chrome_options.add_argument("--disable-dev-shm-usage") # Important for stability in containers
#         self.chrome_options.add_argument("--disable-blink-features=AutomationControlled")
#         self.chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36")
#         self.chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
#         self.chrome_options.add_experimental_option("useAutomationExtension", False)
#         self.chrome_options.add_experimental_option("prefs", {
#             "download.default_directory": self.temp_dir,
#             "download.prompt_for_download": False,
#             "download.directory_upgrade": True,
#             "plugins.always_open_pdf_externally": True,  
#             "browser.helperApps.neverAsk.saveToDisk": "application/pdf"
#         })
   
#         self.chrome_options.binary_location = "/usr/bin/chromium"
        
#         self.driver = None
#         self.output_dir = "stock_data"
        
#         if not os.path.exists(self.output_dir):
#             os.makedirs(self.output_dir)
    
#     def __enter__(self):
#         try:
#             self.driver = webdriver.Chrome(options=self.chrome_options)
#             return self
#         except Exception as e:
#             logger.error(f"Failed to initialize WebDriver: {e}")
#             raise

#     def __exit__(self, exc_type, exc_val, exc_tb):
#         if self.driver:
#             logger.info("Closing browser")
#             self.driver.quit()
    
#     def get_company_data_via_search(self, company_name):
#         try:
#             self.driver.get("https://www.screener.in/")
#             WebDriverWait(self.driver, 5).until(
#                 EC.presence_of_element_located((By.TAG_NAME, "body"))
#             )
#             time.sleep(2)
#             search_box = self._find_search_box()
            
#             if not search_box:
#                 return False
#             if not self._enter_company_name(search_box, company_name):
#                 return False

#             return self._click_search_result(company_name)
            
#         except Exception as e:
#             logger.error(f"Error during search: {e}", exc_info=True)
#             return False
    
#     def _find_search_box(self):
#         logger.info("Trying to find any input field that looks like a search box")
#         try:
#             all_inputs = self.driver.find_elements(By.TAG_NAME, "input")
#             logger.info(f"Found {len(all_inputs)} input elements")
            
#             for input_elem in all_inputs:
#                 try:
#                     elem_type = input_elem.get_attribute("type") or ""
#                     elem_placeholder = input_elem.get_attribute("placeholder") or ""
#                     is_search_input = (
#                         "search" in elem_type.lower() or 
#                         "search" in elem_placeholder.lower() or
#                         "company" in elem_placeholder.lower()
#                     )
#                     if is_search_input and input_elem.is_displayed():
#                         logger.info(f"Found potential search input: {input_elem.get_attribute('outerHTML')}")
#                         return input_elem
#                 except Exception:
#                     continue
                
#         except Exception as e:
#             logger.error(f"Error looking for alternative search inputs: {e}")
        
#         return None
    
#     def _enter_company_name(self, search_box, company_name):
#         self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", search_box)
#         time.sleep(1)
#         try:
#             search_box.click()
#             logger.info("Search box clicked")
#         except Exception as e:
#             logger.info(f"Direct click failed: {e}")
#         time.sleep(1)
#         try:
#             search_box.clear()
#             search_box.send_keys(company_name)
#             logger.info("Entered company name")
#             return True
#         except Exception as e:
#             logger.info(f"Failed to enter company name: {e}")
#             return False
    
#     def _click_search_result(self, company_name):
#         try:
#             WebDriverWait(self.driver, 2).until(
#                 EC.presence_of_element_located((By.CSS_SELECTOR, "ul.dropdown-content li"))
#             )

#             suggestions = WebDriverWait(self.driver, 2).until(
#                 lambda d: [
#                     li for li in d.find_elements(By.CSS_SELECTOR, "ul.dropdown-content li")
#                     if li.text.strip() != "" and "Search everywhere" not in li.text
#                 ]
#             )

#             if suggestions:
#                 first_text = suggestions[0].text.strip()
#                 try:
#                     suggestions[0].click()
#                 except Exception as e:
#                     logger.warning(f"Standard click failed: {e}, using JavaScript.")
#                     self.driver.execute_script("arguments[0].click();", suggestions[0])
#                 WebDriverWait(self.driver, 10).until(
#                     lambda d: "/company/" in d.current_url or first_text.lower() in d.title.lower()
#                 )
#                 return True
#             else:
#                 logger.warning("No valid dropdown suggestions found.")
#                 return False

#         except Exception as e:
#             logger.error(f"Error during dropdown suggestion click: {e}")
#             return False
    
#     def get_stock_data(self, company_identifier):
#         if self.get_company_data_via_search(company_identifier):
#             return self.extract_company_data(company_identifier)
#         return []
    
#     def extract_company_data(self, company_identifier):
#         try:
#             self._all_texts = []

#             report_links = WebDriverWait(self.driver, 5).until(
#                 EC.presence_of_all_elements_located((By.PARTIAL_LINK_TEXT, "Financial Year"))
#             )
#             logger.info(f"📄 Found {len(report_links)} annual reports")
    
#             if not report_links:
#                 logger.info("Trying alternative methods to find annual reports")
#                 try:
#                     report_links = WebDriverWait(self.driver, 3).until(
#                         EC.presence_of_all_elements_located((By.PARTIAL_LINK_TEXT, "Annual Report"))
#                     )
#                     logger.info(f"📄 Found {len(report_links)} reports with 'Annual Report' text")
#                 except TimeoutException:
#                     all_links = self.driver.find_elements(By.TAG_NAME, "a")
#                     report_links = [link for link in all_links if link.get_attribute("href") and "pdf" in link.get_attribute("href").lower()]
#                     logger.info(f"📄 Found {len(report_links)} possible PDF links")
                    
#             if not report_links:
#                 logger.warning(f"⚠️ No annual reports found for {company_identifier}")
#                 return []

#             process_links = report_links[:min(1, len(report_links))]
            
#             for i, link in enumerate(process_links):
#                 try:
#                     href = link.get_attribute("href")
#                     if not href or not href.strip():
#                         logger.warning(f"Skipping link {i+1} - empty href attribute")
#                         continue
                    
#                     logger.info(f"Processing link {i+1}: {href}")
    
#                     for f in os.listdir(self.temp_dir):
#                         try:
#                             os.remove(os.path.join(self.temp_dir, f))
#                         except Exception as e:
#                             logger.warning(f"Could not remove file {f}: {e}")
   
#                     success = self._direct_pdf_download(href, i)
    
#                     if success:
#                         logger.info(f"Successfully downloaded and processed report {i+1}")
#                         continue
    
#                     if not success:
#                         logger.info(f"Direct download failed, trying browser-based approach for link {i+1}")

#                         self.driver.execute_script("window.open(arguments[0]);", href)

#                         original_window = self.driver.current_window_handle

#                         for window_handle in self.driver.window_handles:
#                             if window_handle != original_window:
#                                 self.driver.switch_to.window(window_handle)
#                                 break
                        
#                         try:
#                             WebDriverWait(self.driver, 10).until(
#                                 EC.presence_of_element_located((By.TAG_NAME, "body"))
#                             )
 
#                             current_url = self.driver.current_url
#                             if current_url.lower().endswith('.pdf'):
#                                 logger.info(f"Current URL is a PDF: {current_url}")
#                                 success = self._direct_pdf_download(current_url, i)
#                             else:
#                                 try:
#                                     pdf_links = WebDriverWait(self.driver, 5).until(
#                                         lambda d: [a for a in d.find_elements(By.TAG_NAME, "a") 
#                                                     if a.get_attribute("href") and a.get_attribute("href").lower().endswith('.pdf')]
#                                     )
#                                     if pdf_links:
#                                         logger.info(f"Found {len(pdf_links)} PDF links on the page")
#                                         pdf_href = pdf_links[0].get_attribute("href")
#                                         success = self._direct_pdf_download(pdf_href, i)
#                                     else:
#                                         logger.warning("No PDF links found on the page")
#                                 except Exception as e:
#                                     logger.warning(f"Error finding PDF links: {e}")
                        
#                         except Exception as e:
#                             logger.error(f"Error processing page: {e}", exc_info=True)
                        
#                         finally:
#                             try:
#                                 self.driver.close()
#                                 self.driver.switch_to.window(original_window)
#                             except Exception as e:
#                                 logger.error(f"Error closing browser tab: {e}")
#                                 if self.driver.window_handles:
#                                     self.driver.switch_to.window(self.driver.window_handles[0])
#                             time.sleep(1)
                
#                 except Exception as e:
#                     logger.error(f"Error processing link {i+1}: {e}", exc_info=True)
#                     if len(self.driver.window_handles) > 1:
#                         try:
#                             self.driver.switch_to.window(self.driver.window_handles[0])
#                         except:
#                             pass
            
#             if self._all_texts:
#                 logger.info(f"Found {len(self._all_texts)} reports with text content")
#                 return self._all_texts
#             else:
#                 logger.warning("No texts were extracted from any reports")
#                 return []
            
#         except Exception as e:
#             logger.error(f"Error extracting company data: {e}", exc_info=True)
#             return []


#     def _direct_pdf_download(self, url, report_index):
#         try:
#             logger.info(f"📥 Trying direct download for report {report_index+1}: {url}")
            
#             headers = {
#                 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
#             }
            
#             response = requests.get(url, headers=headers, stream=True, timeout=30)
            
#             # Some PDFs might not have the correct Content-Type header, so we'll check status code only
#             if response.status_code == 200:
#                 # Save the PDF to the temp directory
#                 filename = f"report_{report_index+1}.pdf"
#                 filepath = os.path.join(self.temp_dir, filename)
                
#                 with open(filepath, 'wb') as f:
#                     for chunk in response.iter_content(chunk_size=8192):
#                         if chunk:
#                             f.write(chunk)
                
#                 logger.info(f"✅ Successfully downloaded PDF directly: {filename}")
   
#                 try:
#                     doc = fitz.open(filepath)
#                     text = ""
#                     for page in doc:
#                         text += page.get_text()
#                     doc.close()
                    
#                     report_file = os.path.join(self.output_dir, f"{report_index+1}_{filename.replace('.pdf', '.txt')}")
#                     with open(report_file, 'w', encoding='utf-8') as f:
#                         f.write(text)
#                     logger.info(f"✅ Extracted text from {filename} ")
        
#                     if hasattr(self, '_all_texts'):
#                         self._all_texts.append((filename, text))
#                     else:
#                         self._all_texts = [(filename, text)]
                        
#                 except Exception as e:
#                     logger.error(f"Error processing PDF {filename}: {e}")
                
#                 return True
#             else:
#                 logger.warning(f"⚠️ Failed to download PDF directly. Status code: {response.status_code}")
#                 return False
                    
#         except Exception as e:
#             logger.error(f"Error during direct PDF download: {e}")
#             return False

# def scrape_annual_report_text(company):
#     logger.info(f"🔍 Scraping stock data for {company}...")
    
#     try:
#         with StockDataScraper(headless=True) as scraper:
#             data = scraper.get_stock_data(company)
            
#             if data:
#                 logger.info(f"✅ Successfully extracted data for {company}")
#                 return data
#             else:
#                 logger.info(f"❌ Failed to extract data for {company}")
#     except Exception as e:
#         logger.error(f"❌ Error during scraping: {e}")

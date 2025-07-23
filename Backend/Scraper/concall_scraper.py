import logging
import os
import tempfile
import time
import fitz  # PyMuPDF
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, ElementNotInteractableException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from urllib.parse import urljoin

logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ConcallTranscriptScraper:
    def __init__(self, headless=True):
        self.temp_dir = tempfile.mkdtemp()
        logger.info(f"Created temporary directory: {self.temp_dir}")
        
        self.output_dir = "transcripts"
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
            logger.info(f"Created output directory: {self.output_dir}")

        self.chrome_options = Options()
        if headless:
            self.chrome_options.add_argument("--headless=new")
        self.chrome_options.add_argument("--window-size=1920,1080")
        self.chrome_options.add_argument("--start-maximized")
        self.chrome_options.add_argument("--disable-gpu")
        self.chrome_options.add_argument("--no-sandbox")
        self.chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        self.chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36")
        self.chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        self.chrome_options.add_experimental_option("useAutomationExtension", False)
        self.chrome_options.add_experimental_option("prefs", {
            "download.default_directory": self.temp_dir,
            "download.prompt_for_download": False,
            "download.directory_upgrade": True,
            "plugins.always_open_pdf_externally": True,  
            "browser.helperApps.neverAsk.saveToDisk": "application/pdf"
        })
        
        self.driver = None
        self._all_transcripts = []
    
    def __enter__(self):
        try:
            self.driver = webdriver.Chrome(
                service=Service(ChromeDriverManager().install()), 
                options=self.chrome_options
            )
            return self
        except Exception as e:
            logger.error(f"Failed to initialize WebDriver: {e}")
            raise
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.driver:
            logger.info("Closing browser")
            self.driver.quit()
    
    def get_company_data_via_search(self, company_name):
        try:
            self.driver.get("https://www.screener.in/")
            WebDriverWait(self.driver, 5).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            time.sleep(2)
            search_box = self._find_search_box()
            
            if not search_box:
                return False
            if not self._enter_company_name(search_box, company_name):
                return False

            return self._click_search_result(company_name)
            
        except Exception as e:
            logger.error(f"Error during search: {e}", exc_info=True)
            return False
    
    def _find_search_box(self):
        logger.info("Trying to find any input field that looks like a search box")
        try:
            all_inputs = self.driver.find_elements(By.TAG_NAME, "input")
            logger.info(f"Found {len(all_inputs)} input elements")
            
            for input_elem in all_inputs:
                try:
                    elem_type = input_elem.get_attribute("type") or ""
                    elem_placeholder = input_elem.get_attribute("placeholder") or ""
                    is_search_input = (
                        "search" in elem_type.lower() or 
                        "search" in elem_placeholder.lower() or
                        "company" in elem_placeholder.lower()
                    )
                    if is_search_input and input_elem.is_displayed():
                        logger.info(f"Found potential search input: {input_elem.get_attribute('outerHTML')}")
                        return input_elem
                except Exception:
                    continue
                
        except Exception as e:
            logger.error(f"Error looking for alternative search inputs: {e}")
        
        return None
    
    def _enter_company_name(self, search_box, company_name):
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", search_box)
        time.sleep(1)
        try:
            search_box.click()
            logger.info("Search box clicked")
        except Exception as e:
            logger.info(f"Direct click failed: {e}")
        time.sleep(1)
        try:
            search_box.clear()
            search_box.send_keys(company_name)
            logger.info("Entered company name")
            return True
        except Exception as e:
            logger.info(f"Failed to enter company name: {e}")
            return False
    
    def _click_search_result(self, company_name):
        try:
            WebDriverWait(self.driver, 2).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "ul.dropdown-content li"))
            )

            suggestions = WebDriverWait(self.driver, 2).until(
                lambda d: [
                    li for li in d.find_elements(By.CSS_SELECTOR, "ul.dropdown-content li")
                    if li.text.strip() != "" and "Search everywhere" not in li.text
                ]
            )
            if suggestions:
                first_text = suggestions[0].text.strip()
                try:
                    suggestions[0].click()
                except Exception as e:
                    logger.warning(f"Standard click failed: {e}, using JavaScript.")
                    self.driver.execute_script("arguments[0].click();", suggestions[0])
                WebDriverWait(self.driver, 10).until(
                    lambda d: "/company/" in d.current_url or first_text.lower() in d.title.lower()
                )
                # current_url = self.driver.current_url
                # if not "consolidated" in current_url:
                #     consolidated_url = current_url
                #     if not consolidated_url.endswith('/'):
                #         consolidated_url += '/'
                #     consolidated_url += "consolidated/"
                #     logger.info(f"Navigating to consolidated view: {consolidated_url}")
                #     self.driver.get(consolidated_url)
                #     time.sleep(2)
                return True
            else:
                logger.warning("No valid dropdown suggestions found.")
                return False

        except Exception as e:
            logger.error(f"Error during dropdown suggestion click: {e}")
            return False
    
    def scrape_concall_transcripts(self, company_name):
        if not self.get_company_data_via_search(company_name):
            logger.error(f"Failed to navigate to company page for {company_name}")
            return []
        
        return self.extract_concall_transcripts(company_name)
    
    def extract_concall_transcripts(self, company_name):
        try:
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            time.sleep(2)
            try:
                selectors = [
                    "#concalls", 
                    ".concalls-section", 
                    "div[id*='concall']", 
                    "div[class*='concall']",
                    "h2:contains('Concall'), h3:contains('Concall'), h4:contains('Concall')"
                ] 
                concall_section_found = False
                for selector in selectors:
                    try:
                        elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                        if elements:
                            logger.info(f"Found concall section with selector: {selector}")
                            concall_section_found = True
                            break
                    except:
                        continue
                
                if not concall_section_found:
                    # If we can't find the section directly, look for links with "concall" in text
                    concall_links = self.driver.find_elements(By.XPATH, "//a[contains(translate(text(), 'CONCALL', 'concall'), 'concall') or contains(@href, 'concall')]")
                    if concall_links:
                        logger.info(f"Found {len(concall_links)} concall links by text content")
                        concall_section_found = True
                
                if not concall_section_found:
                    # Last resort: look for any PDF links
                    pdf_links = self.driver.find_elements(By.XPATH, "//a[contains(@href, '.pdf')]")
                    if pdf_links:
                        logger.info(f"Found {len(pdf_links)} PDF links as last resort")
                        concall_section_found = True
                
                if not concall_section_found:
                    logger.warning("No concall section found on the page")
                    return []
            
            except Exception as e:
                logger.error(f"Error finding concall section: {e}")
                return []
            
            # Get the page source for BeautifulSoup parsing
            page_source = self.driver.page_source
            soup = BeautifulSoup(page_source, 'html.parser')
            
            # Find all concall links using various selectors
            concall_links = []
            
            # Method 1: Links with class="concall-link"
            links = soup.find_all("a", class_="concall-link", href=True)
            concall_links.extend(links)
            
            # Method 2: Links inside concalls section
            concall_sections = soup.select("#concalls, .concalls-section, [id*='concall'], [class*='concall']")
            for section in concall_sections:
                links = section.find_all("a", href=True)
                concall_links.extend(links)
            
            # Method 3: Links with "concall" in text or href
            links = soup.find_all("a", href=True)
            for link in links:
                if ('concall' in link.text.lower() or 
                    'concall' in link.get('href', '').lower() or 
                    'transcript' in link.text.lower() or 
                    'transcript' in link.get('href', '').lower()):
                    concall_links.append(link)
            
            # Remove duplicates
            unique_links = []
            seen_hrefs = set()
            for link in concall_links:
                href = link.get('href', '')
                if href and href not in seen_hrefs and href.endswith('.pdf'):
                    unique_links.append(link)
                    seen_hrefs.add(href)
            
            concall_links = unique_links
            
            if not concall_links:
                logger.warning(f"⚠️ No concall links found for {company_name}")
                return []
                
            logger.info(f"📄 Found {len(concall_links)} concall transcripts")
            
            # Only process the most recent 2 transcripts if many are available
            process_links = concall_links[:min(2, len(concall_links))]
            
            for i, link in enumerate(process_links):
                href = link.get('href')
                if href and href.endswith(".pdf"):
                    company_url = self.driver.current_url
                    full_url = urljoin(company_url, href)
                    logger.info(f"Processing link {i+1}: {full_url}")
                    
                    # Clear temp directory before each download
                    for f in os.listdir(self.temp_dir):
                        try:
                            os.remove(os.path.join(self.temp_dir, f))
                        except Exception as e:
                            logger.warning(f"Could not remove file {f}: {e}")
                    
                    # Try direct download first
                    success = self._direct_pdf_download(full_url, i)
                    
                    if not success:
                        logger.info(f"Direct download failed, trying browser-based approach for link {i+1}")
                        self._browser_based_pdf_download(full_url, i)
            
            if self._all_transcripts:
                logger.info(f"Found {len(self._all_transcripts)} transcripts with text content")
                return self._all_transcripts
            else:
                logger.warning("No texts were extracted from any transcripts")
                return []
            
        except Exception as e:
            logger.error(f"Error extracting concall transcripts: {e}", exc_info=True)
            return []

    def _direct_pdf_download(self, url, transcript_index):
        """Try to download PDF directly using requests"""
        try:
            logger.info(f"📥 Trying direct download for transcript {transcript_index+1}: {url}")
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5"
            }
            
            response = requests.get(url, headers=headers, stream=True, timeout=30)
            
            # Some PDFs might not have the correct Content-Type header, so we'll check status code only
            if response.status_code == 200:
                # Save the PDF to the temp directory
                filename = f"transcript_{transcript_index+1}.pdf"
                filepath = os.path.join(self.temp_dir, filename)
                
                with open(filepath, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                
                logger.info(f"✅ Successfully downloaded PDF directly: {filename}")
   
                try:
                    doc = fitz.open(filepath)
                    text = ""
                    for page in doc:
                        text += page.get_text()
                    doc.close()
                    
                    # Only add if we extracted meaningful text
                    if len(text.strip()) > 100:
                        transcript_file = os.path.join(self.output_dir, f"{transcript_index+1}_{filename.replace('.pdf', '.txt')}")
                        with open(transcript_file, 'w', encoding='utf-8') as f:
                            f.write(text)
                        logger.info(f"✅ Extracted text from {filename}")
               
                        self._all_transcripts.append({
                            "filename": filename,
                            "url": url,
                            "text": text
                        })
                    else:
                        logger.warning(f"⚠️ Extracted text too short from {filename}, might not be a valid transcript")
                        
                except Exception as e:
                    logger.error(f"Error processing PDF {filename}: {e}")
                    return False
                
                return True
            else:
                logger.warning(f"⚠️ Failed to download PDF directly. Status code: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error during direct PDF download: {e}")
            return False
    
    def _browser_based_pdf_download(self, url, transcript_index):
        """Try to download PDF using browser approach"""
        try:
            original_window = self.driver.current_window_handle
            
            # Open link in new tab
            self.driver.execute_script("window.open(arguments[0]);", url)
            
            # Switch to new tab
            for window_handle in self.driver.window_handles:
                if window_handle != original_window:
                    self.driver.switch_to.window(window_handle)
                    break
            
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Check if current URL is PDF
            current_url = self.driver.current_url
            if current_url.lower().endswith('.pdf'):
                logger.info(f"Current URL is a PDF: {current_url}")
                self._direct_pdf_download(current_url, transcript_index)
            else:
                # Try to find PDF links on the page
                try:
                    pdf_links = WebDriverWait(self.driver, 5).until(
                        lambda d: [a for a in d.find_elements(By.TAG_NAME, "a") 
                                if a.get_attribute("href") and a.get_attribute("href").lower().endswith('.pdf')]
                    )
                    if pdf_links:
                        logger.info(f"Found {len(pdf_links)} PDF links on the page")
                        pdf_href = pdf_links[0].get_attribute("href")
                        self._direct_pdf_download(pdf_href, transcript_index)
                    else:
                        logger.warning("No PDF links found on the page")
                except Exception as e:
                    logger.warning(f"Error finding PDF links: {e}")
            
            # Close tab and switch back to original
            self.driver.close()
            self.driver.switch_to.window(original_window)
            time.sleep(1)
            return True
            
        except Exception as e:
            logger.error(f"Error during browser-based PDF download: {e}", exc_info=True)
            try:
                if self.driver.window_handles:
                    self.driver.switch_to.window(self.driver.window_handles[0])
            except:
                pass
            return False

def scrape_concall_transcripts(company_name): 
    logger.info(f"🔍 Scraping concall transcripts for {company_name}...")
    
    try:
        with ConcallTranscriptScraper(headless=False) as scraper:
            transcripts = scraper.scrape_concall_transcripts(company_name)
            
            if transcripts:
                logger.info(f"✅ Successfully extracted {len(transcripts)} transcripts for {company_name}")
                # print(f"{transcripts}")
                return transcripts
            else:
                logger.warning(f"❌ Failed to extract any transcripts for {company_name}")
                return []
    except Exception as e:
        logger.error(f"❌ Error during scraping: {e}")
        return []


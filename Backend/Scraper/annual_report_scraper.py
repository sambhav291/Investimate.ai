import logging
import os
import tempfile
import time
import json
import re
import fitz 
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, ElementNotInteractableException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager

logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class StockDataScraper:
    def __init__(self, headless=False):
        self.temp_dir = tempfile.mkdtemp()
        self.chrome_options = Options()
        if headless:
            self.chrome_options.add_argument("--headless")
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
        self.output_dir = "stock_data"
        
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
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
        # logger.info("Looking for search box")
        # selectors = [
        #     {"method": By.CSS_SELECTOR, "value": 'input[aria-label="Search for a company"]'},
        #     {"method": By.CSS_SELECTOR, "value": "input[data-company-search='true']"},
        #     {"method": By.CSS_SELECTOR, "value": "input[placeholder='Search for a company']"},
        #     {"method": By.XPATH, "value": "//input[@placeholder='Search for a company']"},
        #     {"method": By.CSS_SELECTOR, "value": "input[type='search']"},
        #     {"method": By.XPATH, "value": "//input[@type='search']"}
        # ]
        # for selector in selectors:
        #     try:
        #         logger.info(f"Trying selector: {selector['value']}")
        #         search_box = WebDriverWait(self.driver, 5).until(
        #             EC.element_to_be_clickable((selector["method"], selector["value"]))
        #         )
        #         logger.info(f"Found search box: {search_box.get_attribute('outerHTML')}")
        #         return search_box
        #     except TimeoutException:
        #         continue
        
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
                return True
            else:
                logger.warning("No valid dropdown suggestions found.")
                return False

        except Exception as e:
            logger.error(f"Error during dropdown suggestion click: {e}")
            return False
    
    def get_stock_data(self, company_identifier):
        if self.get_company_data_via_search(company_identifier):
            return self.extract_company_data(company_identifier)
        return []
    
    def extract_company_data(self, company_identifier):
        try:
            self._all_texts = []

            report_links = WebDriverWait(self.driver, 5).until(
                EC.presence_of_all_elements_located((By.PARTIAL_LINK_TEXT, "Financial Year"))
            )
            logger.info(f"📄 Found {len(report_links)} annual reports")
    
            if not report_links:
                logger.info("Trying alternative methods to find annual reports")
                try:
                    report_links = WebDriverWait(self.driver, 3).until(
                        EC.presence_of_all_elements_located((By.PARTIAL_LINK_TEXT, "Annual Report"))
                    )
                    logger.info(f"📄 Found {len(report_links)} reports with 'Annual Report' text")
                except TimeoutException:
                    all_links = self.driver.find_elements(By.TAG_NAME, "a")
                    report_links = [link for link in all_links if link.get_attribute("href") and "pdf" in link.get_attribute("href").lower()]
                    logger.info(f"📄 Found {len(report_links)} possible PDF links")
                    
            if not report_links:
                logger.warning(f"⚠️ No annual reports found for {company_identifier}")
                return []

            process_links = report_links[:min(1, len(report_links))]
            
            for i, link in enumerate(process_links):
                try:
                    href = link.get_attribute("href")
                    if not href or not href.strip():
                        logger.warning(f"Skipping link {i+1} - empty href attribute")
                        continue
                    
                    logger.info(f"Processing link {i+1}: {href}")
      
                    for f in os.listdir(self.temp_dir):
                        try:
                            os.remove(os.path.join(self.temp_dir, f))
                        except Exception as e:
                            logger.warning(f"Could not remove file {f}: {e}")
   
                    success = self._direct_pdf_download(href, i)
    
                    if success:
                        logger.info(f"Successfully downloaded and processed report {i+1}")
                        continue
        
                    if not success:
                        logger.info(f"Direct download failed, trying browser-based approach for link {i+1}")

                        self.driver.execute_script("window.open(arguments[0]);", href)

                        original_window = self.driver.current_window_handle

                        for window_handle in self.driver.window_handles:
                            if window_handle != original_window:
                                self.driver.switch_to.window(window_handle)
                                break
                        
                        try:
                            WebDriverWait(self.driver, 10).until(
                                EC.presence_of_element_located((By.TAG_NAME, "body"))
                            )
  
                            current_url = self.driver.current_url
                            if current_url.lower().endswith('.pdf'):
                                logger.info(f"Current URL is a PDF: {current_url}")
                                success = self._direct_pdf_download(current_url, i)
                            else:
                                try:
                                    pdf_links = WebDriverWait(self.driver, 5).until(
                                        lambda d: [a for a in d.find_elements(By.TAG_NAME, "a") 
                                                if a.get_attribute("href") and a.get_attribute("href").lower().endswith('.pdf')]
                                    )
                                    if pdf_links:
                                        logger.info(f"Found {len(pdf_links)} PDF links on the page")
                                        pdf_href = pdf_links[0].get_attribute("href")
                                        success = self._direct_pdf_download(pdf_href, i)
                                    else:
                                        logger.warning("No PDF links found on the page")
                                except Exception as e:
                                    logger.warning(f"Error finding PDF links: {e}")
                        
                        except Exception as e:
                            logger.error(f"Error processing page: {e}", exc_info=True)
                        
                        finally:
                            try:
                                self.driver.close()
                                self.driver.switch_to.window(original_window)
                            except Exception as e:
                                logger.error(f"Error closing browser tab: {e}")
                                if self.driver.window_handles:
                                    self.driver.switch_to.window(self.driver.window_handles[0])
                            time.sleep(1)
                
                except Exception as e:
                    logger.error(f"Error processing link {i+1}: {e}", exc_info=True)
                    if len(self.driver.window_handles) > 1:
                        try:
                            self.driver.switch_to.window(self.driver.window_handles[0])
                        except:
                            pass
            
            if self._all_texts:
                logger.info(f"Found {len(self._all_texts)} reports with text content")
                # data_file = os.path.join(self.output_dir, f"{company_identifier}_data.json")
                # data = [{"filename": filename, "text": text} for filename, text in self._all_texts]
                # with open(data_file, 'w', encoding='utf-8') as f:
                #     json.dump(data, f, ensure_ascii=False, indent=2)
                # logger.info(f"✅ Saved combined data to {data_file}")
                return self._all_texts
            else:
                logger.warning("No texts were extracted from any reports")
                return []
            
        except Exception as e:
            logger.error(f"Error extracting company data: {e}", exc_info=True)
            return []


    def _direct_pdf_download(self, url, report_index):
        try:
            logger.info(f"📥 Trying direct download for report {report_index+1}: {url}")
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
            }
            
            response = requests.get(url, headers=headers, stream=True, timeout=30)
            
            # Some PDFs might not have the correct Content-Type header, so we'll check status code only
            if response.status_code == 200:
                # Save the PDF to the temp directory
                filename = f"report_{report_index+1}.pdf"
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
                    
                    report_file = os.path.join(self.output_dir, f"{report_index+1}_{filename.replace('.pdf', '.txt')}")
                    with open(report_file, 'w', encoding='utf-8') as f:
                        f.write(text)
                    logger.info(f"✅ Extracted text from {filename} ")
               
                    if hasattr(self, '_all_texts'):
                        self._all_texts.append((filename, text))
                    else:
                        self._all_texts = [(filename, text)]
                        
                except Exception as e:
                    logger.error(f"Error processing PDF {filename}: {e}")
                
                return True
            else:
                logger.warning(f"⚠️ Failed to download PDF directly. Status code: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error during direct PDF download: {e}")
            return False

def scrape_annual_report_text(company):
    logger.info(f"🔍 Scraping stock data for {company}...")
    
    try:
        with StockDataScraper(headless=False) as scraper:
            data = scraper.get_stock_data(company)
            
            if data:
                logger.info(f"✅ Successfully extracted data for {company}")
                return data
            else:
                logger.info(f"❌ Failed to extract data for {company}")
    except Exception as e:
        logger.error(f"❌ Error during scraping: {e}")


        #__________________________________________________________________________________________________________________















# import os
# import time
# import fitz  # PyMuPDF
# import tempfile
# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.common.exceptions import TimeoutException, NoSuchElementException

# def scrape_annual_report_text(company_name):
#     """Scrape annual reports with improved error handling and logging"""
#     with tempfile.TemporaryDirectory() as DOWNLOAD_DIR:
#         service = Service(r"C:\Program Files\chromedriver-win64\chromedriver.exe")
#         chrome_options = Options()
#         chrome_options.add_experimental_option("prefs", {
#             "download.default_directory": DOWNLOAD_DIR,
#             "download.prompt_for_download": False,
#             "plugins.always_open_pdf_externally": True
#         })
#         chrome_options.add_argument("--headless=new")
#         # Disable GPU to avoid some common headless Chrome issues
#         chrome_options.add_argument("--disable-gpu")
#         # Disable dev-shm usage
#         chrome_options.add_argument("--disable-dev-shm-usage")
#         # No sandbox for headless operation
#         chrome_options.add_argument("--no-sandbox")
        
#         driver = webdriver.Chrome(service=service, options=chrome_options)
#         wait = WebDriverWait(driver, 20)
        
#         try:
#             # Step 1: Open Screener and search
#             driver.get("https://www.screener.in/")
#             search_box = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'input[aria-label="Search for a company"]')))
#             search_box.send_keys(company_name)
#             search_box.submit()
            
#             try:
#                 # Wait for the first search result
#                 first_result = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".search-result a")))
#                 company_url = first_result.get_attribute('href') + "consolidated/"
#                 print(f"✅ Found company URL: {company_url}")
#             except TimeoutException:
#                 print(f"⚠️ No search results found for {company_name}")
#                 driver.quit()
#                 return []
            
#             # Step 2: Navigate to consolidated page
#             driver.get(company_url)
            
#             # Step 3: Find all annual report links with improved error handling
#             try:
#                 report_links = wait.until(EC.presence_of_all_elements_located((By.PARTIAL_LINK_TEXT, "Financial Year")))
#                 print(f"📄 Found {len(report_links)} annual reports")
#             except TimeoutException:
#                 print(f"⚠️ No annual reports found on {company_url}")
#                 driver.quit()
#                 return []
            
#             all_texts = []
            
#             # Only process the most recent 2 reports if many are available
#             process_links = report_links[:min(2, len(report_links))]
            
#             for i, link in enumerate(process_links):
#                 href = link.get_attribute("href")
#                 driver.execute_script("window.open(arguments[0]);", href)
#                 driver.switch_to.window(driver.window_handles[1])
                
#                 # Clear previous downloads
#                 for f in os.listdir(DOWNLOAD_DIR):
#                     os.remove(os.path.join(DOWNLOAD_DIR, f))
                
#                 print(f"📥 Downloading report {i + 1}...")
                
#                 # Allow more time for PDF download
#                 if wait_for_pdf(DOWNLOAD_DIR, timeout=60):
#                     filename, text = get_latest_pdf_text(DOWNLOAD_DIR)
#                     if filename and text:
#                         all_texts.append((filename, text))
#                         print(f"✅ Successfully processed report: {filename}")
#                         os.remove(os.path.join(DOWNLOAD_DIR, filename))
#                     else:
#                         print(f"⚠️ Failed to extract text from report {i + 1}")
#                 else:
#                     print(f"⚠️ Failed to download report {i + 1} - timeout")
                
#                 driver.close()
#                 driver.switch_to.window(driver.window_handles[0])
#                 time.sleep(1)
            
#             driver.quit()
#             return all_texts
        
#         except Exception as e:
#             print(f"❌ Error occurred during annual report scraping: {str(e)}")
#             driver.quit()
#             return []

# def wait_for_pdf(download_dir, timeout=60):
#     start_time = time.time()
#     while time.time() - start_time < timeout:
#         for filename in os.listdir(download_dir):
#             if filename.endswith(".pdf") and not filename.endswith(".crdownload"):
#                 # Give it a moment to complete writing
#                 time.sleep(2)
#                 return True
#         time.sleep(1)
#     return False

# def get_latest_pdf_text(folder):
#     try:
#         files = [f for f in os.listdir(folder) if f.endswith('.pdf')]
#         if not files:
#             return None, None
        
#         latest_pdf = max(files, key=lambda f: os.path.getctime(os.path.join(folder, f)))
#         path = os.path.join(folder, latest_pdf)
        
#         # Add error handling for PDF parsing
#         try:
#             doc = fitz.open(path)
#             text = ""
#             for page in doc:
#                 text += page.get_text()
#             doc.close()
#             return latest_pdf, text
#         except Exception as e:
#             print(f"Error extracting text from PDF {latest_pdf}: {str(e)}")
#             return latest_pdf, ""
#     except Exception as e:
#         print(f"Error getting latest PDF: {str(e)}")
#         return None, None



#__________________________________________________________________________________________________________________________________________




# import os
# import time
# import fitz  # PyMuPDF
# import tempfile
# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC

# def scrape_annual_report_text(company_name):
#     with tempfile.TemporaryDirectory() as DOWNLOAD_DIR:
#         service = Service(r"C:\Program Files\chromedriver-win64\chromedriver.exe")

#         chrome_options = Options()
#         chrome_options.add_experimental_option("prefs", {
#             "download.default_directory": DOWNLOAD_DIR,
#             "download.prompt_for_download": False,
#             "plugins.always_open_pdf_externally": True
#         })
#         chrome_options.add_argument("--headless=new")

#         driver = webdriver.Chrome(service=service, options=chrome_options)
#         wait = WebDriverWait(driver, 20)

#         try:
#             # Step 1: Open Screener and search
#             driver.get("https://www.screener.in/")
#             search_box = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'input[aria-label="Search for a company"]')))
#             search_box.send_keys(company_name)
#             search_box.submit()

#             # Wait for the first search result
#             first_result = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".search-result a")))
#             company_url = first_result.get_attribute('href') + "consolidated/"
#             print(f"✅ Found company URL: {company_url}")

#             # Step 2: Navigate to consolidated page
#             driver.get(company_url)

#             # Step 3: Find all annual report links
#             report_links = wait.until(EC.presence_of_all_elements_located((By.PARTIAL_LINK_TEXT, "Financial Year")))
#             print(f"📄 Found {len(report_links)} annual reports")

#             all_texts = []

#             for i, link in enumerate(report_links):
#                 href = link.get_attribute("href")
#                 driver.execute_script("window.open(arguments[0]);", href)
#                 driver.switch_to.window(driver.window_handles[1])

#                 # Clear previous downloads
#                 for f in os.listdir(DOWNLOAD_DIR):
#                     os.remove(os.path.join(DOWNLOAD_DIR, f))

#                 print(f"📥 Downloading report {i + 1}...")

#                 if wait_for_pdf(DOWNLOAD_DIR):
#                     filename, text = get_latest_pdf_text(DOWNLOAD_DIR)
#                     if filename and text:
#                         all_texts.append((filename, text))
#                         os.remove(os.path.join(DOWNLOAD_DIR, filename))
#                 else:
#                     print(f"⚠️ Failed to download report {i + 1}")

#                 driver.close()
#                 driver.switch_to.window(driver.window_handles[0])
#                 time.sleep(1)

#             driver.quit()
#             return all_texts

#         except Exception as e:
#             driver.quit()
#             print(f"❌ Error occurred: {e}")
#             return None

# def wait_for_pdf(download_dir, timeout=30):
#     start_time = time.time()
#     while time.time() - start_time < timeout:
#         for filename in os.listdir(download_dir):
#             if filename.endswith(".pdf") and not filename.endswith(".crdownload"):
#                 return True
#         time.sleep(1)
#     return False

# def get_latest_pdf_text(folder):
#     files = [f for f in os.listdir(folder) if f.endswith('.pdf')]
#     if not files:
#         return None, None
#     latest_pdf = max(files, key=lambda f: os.path.getctime(os.path.join(folder, f)))
#     path = os.path.join(folder, latest_pdf)
#     doc = fitz.open(path)
#     text = ""
#     for page in doc:
#         text += page.get_text()
#     doc.close()
#     return latest_pdf, text

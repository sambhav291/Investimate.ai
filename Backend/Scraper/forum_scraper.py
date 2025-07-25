
import time
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager 
import certifi
import json

def get_valuepickr_thread_url(company_name):
    
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")  # Added for stability
    chrome_options.add_argument("--disable-extensions")     # Added for performance
    chrome_options.add_argument("--disable-logging")        # Reduce console noise
    chrome_options.add_argument("--log-level=3")           # Suppress INFO messages

    # service = Service(ChromeDriverManager().install())  
    chrome_options.binary_location = "/usr/bin/chromium-browser"

    # driver = webdriver.Chrome(service=service, options=chrome_options)
    driver = webdriver.Chrome(options=chrome_options)   

    try:
        search_url = f"https://forum.valuepickr.com/search?q={company_name}"
        print(f"🔍 Searching for {company_name} at: {search_url}")
        driver.get(search_url)
        time.sleep(3)

        # Find the first search result link
        result_links = driver.find_elements(By.CSS_SELECTOR, "a.search-link")
        if not result_links:
            print(f"⚠️ No search results found for: {company_name}")
            return None
            
        for link in result_links:
            href = link.get_attribute("href")
            if "/t/" in href:
                print(f"✅ Found thread URL: {href}")
                return href
                
        print("⚠️ No thread found for:", company_name)
        return None

    except Exception as e:
        print(f"❌ Error during search: {e}")
        return None
    finally:
        driver.quit()

def scrape_valuepickr_posts(url):
    try:
        api_url = url.rstrip('/') + ".json"
        print(f"🔍 Fetching posts from: {api_url}")
        
        response = requests.get(
            api_url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",  # Updated Chrome version
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
                "Referer": "https://www.google.com/",
                "Connection": "keep-alive",
            },
            timeout=15,  # Increased timeout
            verify=certifi.where()
        )
        response.raise_for_status()
        data = response.json()

        extracted_posts = []
        posts = data.get("post_stream", {}).get("posts", [])
        
        if not posts:
            print("⚠️ No posts found in the thread")
            return []
            
        for post in posts:
            cooked_html = post.get("cooked", "")
            if not cooked_html:
                continue
                
            soup = BeautifulSoup(cooked_html, 'html.parser')
            text = soup.get_text(separator=' ', strip=True)
            
            # Filter out very short posts and common forum noise
            if len(text) > 50 and not text.lower().startswith(('thanks', 'thank you', '+1', 'agreed')):
                extracted_posts.append(text)

        print(f"✅ Extracted {len(extracted_posts)} meaningful posts")
        return extracted_posts

    except requests.exceptions.RequestException as e:
        print(f"❌ Network error scraping forum data from {url}: {e}")
        return []
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error for {url}: {e}")
        return []
    except Exception as e:
        print(f"❌ Unexpected error scraping forum data from {url}: {e}")
        return []

def scrape_forum_data(company_name):
    """Main function to scrape forum data for a company"""
    print(f"🔍 Starting forum data scraping for: {company_name}")
    
    thread_url = get_valuepickr_thread_url(company_name)
    if not thread_url:
        print(f"❌ Could not find a thread for {company_name}")
        return []

    print(f"🔍 Scraping posts for: {company_name}")
    posts = scrape_valuepickr_posts(thread_url)
    
    if posts:
        print(f"✅ Successfully scraped {len(posts)} posts for {company_name}")
    else:
        print(f"⚠️ No posts found for {company_name}")
        
    return posts

















import os
import ssl
import certifi

# Clear any problematic SSL environment variables
os.environ.pop('SSL_CERT_FILE', None)
os.environ.pop('REQUESTS_CA_BUNDLE', None)
os.environ.pop('CURL_CA_BUNDLE', None)

import json
import re
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

# Load FinBERT pretrained model
tokenizer = AutoTokenizer.from_pretrained("yiyanghkust/finbert-tone")
model = AutoModelForSequenceClassification.from_pretrained("yiyanghkust/finbert-tone")

DEFAULT_KEYWORDS = [
    "valuation", "management", "risk", "moat", "market", "revenue", "profit", "loss",
    "guidance", "demand", "supply", "pricing", "competition", "capex", "growth",
    "margins", "expenses", "ebitda", "cash flow", "dividend", "forecast", "future",
    "performance", "business model", "customer", "cost", "economy", "industry",
    "investment", "order book", "sustainability", "patent", "innovation", "regulatory"
]

def analyze_sentiment_finbert(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length = 512)
    outputs = model(**inputs)
    probs = F.softmax(outputs.logits, dim=1)
    labels = ["Negative", "Neutral", "Positive"]
    sentiment = labels[probs.argmax()]
    return sentiment


def load_forum_posts(path):
    with open(path, 'r', encoding="utf-8") as f:
        return json.load(f)


def clean_text(text):
    text = text.lower() 
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'http\S+|www\S+', '', text)
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def get_matched_keywords(text, keyword_list):
    return [k for k in keyword_list if k in text]

def preprocess_forum_data(data, keyword_list=None):
    keyword_list = keyword_list or DEFAULT_KEYWORDS
    keyword_list = [k.lower() for k in keyword_list]

    filtered_cleaned = []
    for company in data:
        stock_name = company.get("Stock Name", "Unknown")
        posts = company.get("Posts", [])
        for post in posts:
            cleaned = clean_text(post)
            matched = [k for k in keyword_list if k in cleaned]
            if matched:
                sentiment = analyze_sentiment_finbert(cleaned)
                filtered_cleaned.append({
                    "stock_name": stock_name,
                    "post_text": cleaned,
                    "matched_keywords": matched,
                    "sentiment": sentiment
                })
    return filtered_cleaned

def main():
    with open('./Scraper/files/scraped_data.json', 'r', encoding = "utf-8") as f:
        content = json.load(f)
        return( preprocess_forum_data(content) )
        

       


    
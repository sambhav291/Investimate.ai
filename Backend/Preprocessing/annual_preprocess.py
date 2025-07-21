import re
import logging
import hashlib
from collections import Counter
from transformers import AutoTokenizer, REDACTED-GOOGLE-CLIENT-SECRETsification
import torch
import torch.nn.functional as F

# Logging Configuration
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load FinBERT model
logger.info("Loading FinBERT tokenizer and model...")
tokenizer = AutoTokenizer.from_pretrained("yiyanghkust/finbert-tone")
model = REDACTED-GOOGLE-CLIENT-SECRETsification.from_pretrained("yiyanghkust/finbert-tone")
logger.info("Model and tokenizer loaded successfully.")

DEFAULT_KEYWORDS = [
    "valuation", "management", "risk", "moat", "market", "revenue", "profit", "loss",
    "guidance", "demand", "supply", "pricing", "competition", "capex", "growth",
    "margins", "expenses", "ebitda", "cash flow", "dividend", "forecast", "future",
    "performance", "business model", "customer", "cost", "economy", "industry",
    "investment", "order book", "sustainability", "patent", "innovation", "regulatory"
]

LABELS = ["Negative", "Neutral", "Positive"]

def chunk_text(text, max_tokens=512):
    tokens = tokenizer.tokenize(text)
    chunks = [' '.join(tokens[i:i+max_tokens]) for i in range(0, len(tokens), max_tokens)]
    return [tokenizer.REDACTED-GOOGLE-CLIENT-SECRET(tokenizer.tokenize(chunk)) for chunk in chunks]

def REDACTED-GOOGLE-CLIENT-SECRETt(text):
    """Analyze sentiment with better error handling and length limits"""
    try:
        # Limit text length for sentiment analysis
        if len(text) > 10000:  # Limit to ~2500 tokens
            text = text[:10000]
            
        chunks = chunk_text(text, max_tokens=512)
        sentiments = []

        for chunk in chunks:
            if not chunk.strip():  # Skip empty chunks
                continue
                
            inputs = tokenizer(chunk, return_tensors="pt", truncation=True, max_length=512)
            outputs = model(**inputs)
            probs = F.softmax(outputs.logits, dim=1)
            sentiment = LABELS[probs.argmax()]
            sentiments.append(sentiment)

        if not sentiments:
            return "Neutral"

        # Majority vote
        sentiment_counts = Counter(sentiments)
        return sentiment_counts.most_common(1)[0][0]
    
    except Exception as e:
        logger.warning(f"Sentiment analysis failed: {e}")
        return "Neutral"

def REDACTED-GOOGLE-CLIENT-SECRET(text, keyword_list=None):
    logger.info("Starting preprocessing of the annual report.")
    
    keyword_list = keyword_list or DEFAULT_KEYWORDS
    keyword_list = [k.lower() for k in keyword_list]

    # Clean up line breaks and whitespaces
    text = text.replace('\n', ' ').replace('\r', '')
    text = re.sub(r"\s+", " ", text)

    # === Reduce max character limit to prevent token overflow ===
    max_chars = 30000  # Reduced from 55000 to prevent token issues
    if len(text) > max_chars:
        logger.warning(f"Report text is too long ({len(text)} chars), truncating to {max_chars} chars.")
        text = text[:max_chars]
    # === End of truncation block ===

    heading_patterns = [
        r'corporate snapshot',
        r'key highlights',
        r'operational performance scorecard',
        r'spirit of .*?',
        r'growth journey|growth catalysts',
        r'eagle vision',
        r'cfo.*?review',
        r'sustainability review',
        r'value creation.*?',
        r'manufacturing excellence',
        r'technological edge',
        r'environment.*?governance',
        r'corporate information',
        r'directors["\"]? report.*?(management discussion)?',
        r'management discussion.*?analysis',
        r'corporate governance',
        r'business responsibility.*?',
        r'financial statements',
        r'standalone',
        r'consolidated',
        r'notice',
        r'registration form'
    ]
    combined_pattern = r'(' + '|'.join(heading_patterns) + r')'

    matches = list(re.finditer(combined_pattern, text, flags=re.IGNORECASE))
    logger.info(f"Found {len(matches)} section headings in the report.")

    if not matches:
        logger.info("No headings matched, analyzing the full report as one section.")
        content = text.strip()
        
        # Limit content size for single section
        if len(content) > 5000:  # Limit large single sections
            content = content[:5000]
            logger.warning("Single section too large, truncated to 5000 chars")
            
        matched = [k for k in keyword_list if k in content.lower()]
        sentiment = REDACTED-GOOGLE-CLIENT-SECRETt(content)
        return {'Full Report': {'content': content, 'matched_keywords': matched, 'sentiment': sentiment}}

    sections = {}
    seen_hashes = set()

    for idx, match in enumerate(matches):
        title = match.group().strip()
        start = match.start()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
        content = text[start:end].strip()

        # Limit individual section size to prevent token overflow
        max_section_chars = 3000  # Limit each section
        if len(content) > max_section_chars:
            logger.info(f"Section '{title}' too long ({len(content)} chars), truncating to {max_section_chars}")
            content = content[:max_section_chars]

        # Skip very small sections (likely headers only)
        if len(content.strip()) < 100:
            logger.info(f"Skipping small section: {title}")
            continue

        # Deduplicate by title + content hash
        section_id = title.lower() + hashlib.md5(content.encode()).hexdigest()
        if section_id in seen_hashes:
            logger.info(f"Duplicate section '{title}' skipped.")
            continue
        seen_hashes.add(section_id)

        matched = [k for k in keyword_list if k in content.lower()]
        sentiment = REDACTED-GOOGLE-CLIENT-SECRETt(content)

        logger.info(f"Processed section: {title} | Sentiment: {sentiment} | Matched keywords: {len(matched)} | Size: {len(content)} chars")

        sections[title] = {
            'content': content,
            'matched_keywords': matched,
            'sentiment': sentiment
        }

        # Limit total number of sections to prevent overwhelming the summarizer
        if len(sections) >= 15:
            logger.warning("Reached maximum number of sections (15), stopping processing")
            break

    logger.info(f"Finished processing {len(sections)} unique sections.")
    return sections
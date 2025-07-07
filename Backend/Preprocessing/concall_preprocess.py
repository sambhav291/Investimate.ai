# import re
# import warnings
# from collections import defaultdict, Counter
# import string

# # Enhanced preprocessing with better pattern matching for any company
# def preprocess_earnings_transcript(raw_text, company_name=None, min_content_length=20):
#     """
#     General purpose earnings call transcript preprocessor that works for any company
    
#     Args:
#         raw_text (str): Raw transcript text
#         company_name (str, optional): Company name for context
#         min_content_length (int): Minimum content length to consider valid
    
#     Returns:
#         dict: Processed transcript data
#     """
    
#     if not raw_text or len(raw_text.strip()) < 100:
#         return {"error": "Insufficient transcript content", "dialogues": [], "summary": {}}
    
#     # Clean and normalize text
#     text = clean_raw_text(raw_text)
#     print(f"Cleaned text length: {len(text)} characters")
    
#     # Extract meaningful content sections
#     sections = extract_content_sections(text)
#     print(f"Identified sections: {list(sections.keys())}")
    
#     # Extract dialogues using multiple strategies
#     dialogues = extract_dialogues_multi_strategy(text, min_content_length)
#     print(f"Extracted {len(dialogues)} dialogue segments")
    
#     # If few dialogues extracted, try alternative approach
#     if len(dialogues) < 3:
#         print("Few dialogues found, trying paragraph-based extraction...")
#         dialogues = extract_paragraphs_as_content(text, min_content_length)
#         print(f"Alternative extraction yielded {len(dialogues)} content segments")
    
#     # Extract key financial mentions and topics
#     financial_data = extract_financial_mentions(text)
#     key_topics = extract_key_topics(text)
    
#     # Create summary
#     summary = create_transcript_summary(dialogues, financial_data, key_topics, company_name)
    
#     return {
#         "dialogues": dialogues,
#         "sections": sections,
#         "financial_data": financial_data,
#         "key_topics": key_topics,
#         "summary": summary,
#         "raw_stats": {
#             "total_words": len(text.split()),
#             "total_dialogues": len(dialogues),
#             "unique_speakers": len(set(d.get('speaker', 'Unknown') for d in dialogues))
#         }
#     }

# def clean_raw_text(text):
#     """Clean and normalize raw transcript text"""
    
#     # Remove PDF artifacts and formatting issues
#     text = re.sub(r'(?:Page \d+|www\.[\w\.]+|http[s]?://[\w\.\/]+)', '', text)
#     text = re.sub(r'(?:Tel:|Phone:|Email:|Fax:).*?(?:\n|$)', '', text)
#     text = re.sub(r'\b(?:CIN No\.|Reg\. Office:).*?(?:\n|$)', '', text)
    
#     # Clean special characters but keep important punctuation
#     text = re.sub(r'[^\w\s\.\,\;\:\?\!\-\'\"\(\)\%\$₹]', ' ', text)
    
#     # Normalize whitespace
#     text = re.sub(r'\s+', ' ', text)
#     text = re.sub(r'\n\s*\n', '\n', text)
    
#     return text.strip()

# def extract_content_sections(text):
#     """Extract different sections of the transcript"""
    
#     sections = {}
    
#     # Common section markers
#     section_patterns = {
#         'management_discussion': r'(?:Management.*?Discussion|Prepared Remarks|Management Commentary).*?(?=Q&A|Question|$)',
#         'qa_session': r'(?:Q&A|Question.*?Answer|Questions.*?Answers).*?$',
#         'financial_highlights': r'(?:Financial.*?Highlights|Results|Performance).*?(?=Q&A|Management|$)',
#         'outlook': r'(?:Outlook|Guidance|Forward.*?Looking|Future.*?Plans).*?(?=Q&A|Question|$)'
#     }
    
#     for section_name, pattern in section_patterns.items():
#         match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
#         if match:
#             content = match.group(0).strip()
#             if len(content) > 100:  # Only keep substantial sections
#                 sections[section_name] = content[:2000]  # Limit length
    
#     return sections

# def extract_dialogues_multi_strategy(text, min_length):
#     """Extract dialogues using multiple strategies"""
    
#     dialogues = []
    
#     # Strategy 1: Standard "Speaker: Content" format
#     dialogues.extend(extract_standard_speaker_format(text, min_length))
    
#     # Strategy 2: Questions and answers pattern
#     if len(dialogues) < 5:
#         dialogues.extend(extract_qa_pattern(text, min_length))
    
#     # Strategy 3: Paragraph-based extraction for unstructured content
#     if len(dialogues) < 3:
#         dialogues.extend(extract_content_paragraphs(text, min_length))
    
#     # Remove duplicates and clean
#     dialogues = remove_duplicate_dialogues(dialogues)
    
#     return dialogues

# def extract_standard_speaker_format(text, min_length):
#     """Extract content using standard Speaker: Content format"""
    
#     dialogues = []
    
#     # Common speaker indicators
#     speaker_indicators = [
#         r'(?:Mr\.|Ms\.|Dr\.)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*',
#         r'(?:CEO|CFO|Chairman|President|Director|Manager|Analyst|Moderator|Operator)',
#         r'[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?',
#         r'Management|Company|Participant',
#     ]
    
#     # Build comprehensive speaker pattern
#     speaker_pattern = '|'.join(f'(?:{pattern})' for pattern in speaker_indicators)
    
#     # Extract using speaker: content pattern
#     pattern = rf'({speaker_pattern})[\s]*:[\s]*(.*?)(?=(?:{speaker_pattern})[\s]*:|$)'
#     matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)
    
#     for speaker, content in matches:
#         cleaned_content = clean_dialogue_content(content)
#         if len(cleaned_content) >= min_length:
#             dialogues.append({
#                 'speaker': clean_speaker_name(speaker),
#                 'content': cleaned_content,
#                 'type': 'dialogue',
#                 'word_count': len(cleaned_content.split())
#             })
    
#     return dialogues

# def extract_qa_pattern(text, min_length):
#     """Extract Q&A pattern content"""
    
#     dialogues = []
    
#     # Look for question-answer patterns
#     qa_patterns = [
#         r'(?:Question|Q)[\s]*:[\s]*(.*?)(?:Answer|A)[\s]*:[\s]*(.*?)(?=(?:Question|Q)[\s]*:|$)',
#         r'(?:Analyst|Participant)[\s]*:[\s]*(.*?)(?:Management|Company)[\s]*:[\s]*(.*?)(?=(?:Analyst|Participant)[\s]*:|$)'
#     ]
    
#     for pattern in qa_patterns:
#         matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)
#         for question, answer in matches:
#             q_cleaned = clean_dialogue_content(question)
#             a_cleaned = clean_dialogue_content(answer)
            
#             if len(q_cleaned) >= min_length:
#                 dialogues.append({
#                     'speaker': 'Analyst/Participant',
#                     'content': q_cleaned,
#                     'type': 'question',
#                     'word_count': len(q_cleaned.split())
#                 })
            
#             if len(a_cleaned) >= min_length:
#                 dialogues.append({
#                     'speaker': 'Management',
#                     'content': a_cleaned,
#                     'type': 'answer',
#                     'word_count': len(a_cleaned.split())
#                 })
    
#     return dialogues

# def extract_content_paragraphs(text, min_length):
#     """Extract meaningful content paragraphs when structured dialogue isn't found"""
    
#     dialogues = []
    
#     # Split into paragraphs
#     paragraphs = [p.strip() for p in text.split('\n') if p.strip()]
    
#     # Filter and classify paragraphs
#     for para in paragraphs:
#         cleaned = clean_dialogue_content(para)
#         if len(cleaned) >= min_length and is_meaningful_content(cleaned):
            
#             # Try to infer speaker/type
#             speaker, content_type = infer_speaker_type(cleaned)
            
#             dialogues.append({
#                 'speaker': speaker,
#                 'content': cleaned,
#                 'type': content_type,
#                 'word_count': len(cleaned.split())
#             })
    
#     return dialogues

# def extract_paragraphs_as_content(text, min_length):
#     """Alternative method to extract content as paragraphs"""
    
#     content_segments = []
    
#     # Split text into meaningful chunks
#     chunks = re.split(r'\n\s*\n|\.\s{2,}', text)
    
#     for i, chunk in enumerate(chunks):
#         cleaned = clean_dialogue_content(chunk)
#         if len(cleaned) >= min_length and is_meaningful_content(cleaned):
            
#             # Classify the content type
#             if any(keyword in cleaned.lower() for keyword in ['revenue', 'profit', 'loss', 'growth', 'margin']):
#                 content_type = 'financial_discussion'
#             elif any(keyword in cleaned.lower() for keyword in ['thank', 'question', 'ask']):
#                 content_type = 'interaction'
#             else:
#                 content_type = 'business_discussion'
            
#             content_segments.append({
#                 'speaker': f'Content_Segment_{i+1}',
#                 'content': cleaned,
#                 'type': content_type,
#                 'word_count': len(cleaned.split())
#             })
    
#     return content_segments

# def clean_dialogue_content(content):
#     """Clean individual dialogue content"""
#     if not content:
#         return ""
    
#     # Remove common artifacts
#     content = re.sub(r'\b(?:Page \d+|Slide \d+|Figure \d+)\b', '', content)
#     content = re.sub(r'\b(?:Tel|Phone|Email|Website)[:.].*?(?:\s|$)', '', content)
#     content = re.sub(r'\b\d{10,}\b', '', content)  # Remove long numbers (likely phone numbers)
    
#     # Clean excessive punctuation
#     content = re.sub(r'[.,;]{2,}', '.', content)
#     content = re.sub(r'\s+', ' ', content)
    
#     return content.strip()

# def clean_speaker_name(speaker):
#     """Clean and normalize speaker names"""
#     if not speaker:
#         return "Unknown"
    
#     # Remove titles and clean
#     speaker = re.sub(r'\b(?:Mr\.|Ms\.|Dr\.)\s*', '', speaker)
#     speaker = re.sub(r'\s+', ' ', speaker).strip()
    
#     # Capitalize properly
#     if speaker.isupper() or speaker.islower():
#         speaker = speaker.title()
    
#     return speaker if speaker else "Unknown"

# def infer_speaker_type(content):
#     """Infer speaker and content type from content"""
    
#     content_lower = content.lower()
    
#     # Management indicators
#     if any(word in content_lower for word in ['we are', 'our company', 'we have', 'our strategy']):
#         return 'Management', 'management_statement'
    
#     # Question indicators
#     elif any(word in content_lower for word in ['what is', 'how do', 'can you', 'could you']):
#         return 'Analyst', 'question'
    
#     # Financial discussion
#     elif any(word in content_lower for word in ['revenue', 'ebitda', 'margin', 'growth', 'profit']):
#         return 'Management', 'financial_discussion'
    
#     else:
#         return 'Participant', 'general_discussion'

# def is_meaningful_content(text):
#     """Check if text contains meaningful content"""
    
#     # Skip if mostly numbers or contact info
#     if re.search(r'\b\d{4,}\b.*\b\d{4,}\b', text):  # Multiple long numbers
#         return False
    
#     # Skip if mostly email/website patterns
#     if text.count('@') > 0 or text.count('www.') > 0:
#         return False
    
#     # Skip if too repetitive
#     words = text.lower().split()
#     if len(set(words)) < len(words) * 0.5:  # Less than 50% unique words
#         return False
    
#     # Must contain some business/financial terms
#     business_terms = ['company', 'business', 'revenue', 'growth', 'market', 'performance', 
#                      'results', 'quarter', 'year', 'investment', 'strategy', 'customer']
    
#     return any(term in text.lower() for term in business_terms)

# def remove_duplicate_dialogues(dialogues):
#     """Remove duplicate dialogues"""
    
#     seen_content = set()
#     unique_dialogues = []
    
#     for dialogue in dialogues:
#         # Create a hash of the content
#         content_hash = hash(dialogue['content'][:100])  # Use first 100 chars
        
#         if content_hash not in seen_content:
#             seen_content.add(content_hash)
#             unique_dialogues.append(dialogue)
    
#     return unique_dialogues

# def extract_financial_mentions(text):
#     """Extract financial numbers and metrics"""
    
#     financial_data = {}
    
#     # Revenue patterns
#     revenue_matches = re.findall(r'revenue.*?(?:₹|Rs\.?\s*|USD?\s*)?(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:crore|million|billion)', text, re.IGNORECASE)
#     if revenue_matches:
#         financial_data['revenue_mentions'] = revenue_matches
    
#     # Profit/Loss patterns
#     profit_matches = re.findall(r'(?:profit|loss|PAT|EBITDA).*?(?:₹|Rs\.?\s*|USD?\s*)?(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:crore|million|billion)', text, re.IGNORECASE)
#     if profit_matches:
#         financial_data['profit_loss_mentions'] = profit_matches
    
#     # Growth percentages
#     growth_matches = re.findall(r'(?:growth|increase|decrease).*?(\d+(?:\.\d+)?)\s*%', text, re.IGNORECASE)
#     if growth_matches:
#         financial_data['growth_percentages'] = growth_matches
    
#     # Margin mentions
#     margin_matches = re.findall(r'margin.*?(\d+(?:\.\d+)?)\s*%', text, re.IGNORECASE)
#     if margin_matches:
#         financial_data['margin_percentages'] = margin_matches
    
#     return financial_data

# def extract_key_topics(text):
#     """Extract key business topics discussed"""
    
#     # Business topic keywords
#     topic_keywords = {
#         'growth': ['growth', 'expansion', 'scaling', 'increase'],
#         'market': ['market', 'competition', 'industry', 'sector'],
#         'strategy': ['strategy', 'plan', 'initiative', 'focus'],
#         'performance': ['performance', 'results', 'achievement', 'success'],
#         'challenges': ['challenge', 'difficulty', 'pressure', 'issue'],
#         'innovation': ['innovation', 'technology', 'digital', 'new product'],
#         'investment': ['investment', 'capex', 'spending', 'allocation'],
#         'outlook': ['outlook', 'guidance', 'forecast', 'expectation']
#     }
    
#     topics_found = {}
#     text_lower = text.lower()
    
#     for topic, keywords in topic_keywords.items():
#         mentions = sum(text_lower.count(keyword) for keyword in keywords)
#         if mentions > 0:
#             topics_found[topic] = mentions
    
#     # Sort by frequency
#     return dict(sorted(topics_found.items(), key=lambda x: x[1], reverse=True))

# def create_transcript_summary(dialogues, financial_data, key_topics, company_name):
#     """Create a summary of the transcript analysis"""
    
#     summary = {
#         'company': company_name or 'Unknown',
#         'total_content_segments': len(dialogues),
#         'total_words': sum(d.get('word_count', 0) for d in dialogues),
#         'speakers_identified': len(set(d.get('speaker', 'Unknown') for d in dialogues)),
#         'content_types': Counter(d.get('type', 'unknown') for d in dialogues),
#         'top_topics': dict(list(key_topics.items())[:5]) if key_topics else {},
#         'has_financial_data': bool(financial_data),
#         'ready_for_analysis': len(dialogues) > 0 and any(len(d.get('content', '')) > 50 for d in dialogues)
#     }
    
#     return summary

# # Usage example
# def process_earnings_call(transcript_text, company_name=None):
#     """
#     Main function to process earnings call transcript
    
#     Usage:
#         result = process_earnings_call(your_transcript_text, "Company Name")
        
#         # Access processed data
#         dialogues = result['dialogues']
#         for dialogue in dialogues:
#             print(f"{dialogue['speaker']}: {dialogue['content'][:100]}...")
#     """
    
#     print(f"Processing earnings call transcript for {company_name or 'Unknown Company'}...")
    
#     result = preprocess_earnings_transcript(transcript_text, company_name)
    
#     print("\n=== PROCESSING SUMMARY ===")
#     print(f"Company: {result['summary']['company']}")
#     print(f"Content segments extracted: {result['summary']['total_content_segments']}")
#     print(f"Total words processed: {result['summary']['total_words']}")
#     print(f"Speakers identified: {result['summary']['speakers_identified']}")
#     print(f"Ready for analysis: {result['summary']['ready_for_analysis']}")
    
#     if result['summary']['top_topics']:
#         print(f"Top topics: {list(result['summary']['top_topics'].keys())[:3]}")
    
#     return result







#____________________________________________________________________________________________________________________________






import re
from collections import defaultdict
import torch
import torch.nn.functional as F
import warnings

# Load FinBERT in a more robust way
def get_finbert_model():
    try:
        from transformers import AutoTokenizer, AutoModelForSequenceClassification
        tokenizer = AutoTokenizer.from_pretrained("yiyanghkust/finbert-tone")
        model = AutoModelForSequenceClassification.from_pretrained("yiyanghkust/finbert-tone")
        return tokenizer, model
    except Exception as e:
        warnings.warn(f"Could not load FinBERT model: {e}")
        return None, None

# Initialize models at module level but handle failures gracefully
tokenizer, model = get_finbert_model()

DEFAULT_KEYWORDS = [
    "valuation", "management", "risk", "moat", "market", "revenue", "profit", "loss",
    "guidance", "demand", "supply", "pricing", "competition", "capex", "growth",
    "margins", "expenses", "ebitda", "cash flow", "dividend", "forecast", "future",
    "performance", "business model", "customer", "cost", "economy", "industry",
    "investment", "order book", "sustainability", "patent", "innovation", "regulatory"
]

def analyze_sentiment_finbert(text):
    # Fall back to neutral if no models are available
    if tokenizer is None or model is None:
        return "Neutral"
        
    try:
        # Truncate text to avoid overflow and improve processing speed
        text = text[:400] if len(text) > 400 else text
        
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=400)
        with torch.no_grad():  # Prevent gradient calculation for inference
            outputs = model(**inputs)
        probs = F.softmax(outputs.logits, dim=1)
        labels = ["Negative", "Neutral", "Positive"]
        sentiment = labels[probs.argmax().item()]
        return sentiment
    except Exception as e:
        warnings.warn(f"Error in sentiment analysis: {e}")
        return "Neutral"  # Default to neutral on error

def detect_transcript_format(text):
    """
    Detects the format of the transcript to apply appropriate extraction strategy
    """
    # Check for standard "Speaker: Text" format
    standard_pattern = r'([A-Z][a-zA-Z\s\.\-]+):\s'
    standard_matches = re.findall(standard_pattern, text)
    
    # Check for timestamps in the format [HH:MM:SS]
    timestamp_pattern = r'\[\d{2}:\d{2}:\d{2}\]'
    has_timestamps = bool(re.search(timestamp_pattern, text))
    
    # Check for bullet points or dashes that might indicate speakers
    bullet_pattern = r'(?:^|\n)(?:•|-|–)\s*([A-Z][a-zA-Z\s\.]+)(?:\s*[-:–])'
    bullet_matches = re.findall(bullet_pattern, text)
    
    # Detection logic
    if len(standard_matches) > 10:
        return "standard"
    elif has_timestamps:
        return "timestamped"
    elif len(bullet_matches) > 5:
        return "bulleted"
    else:
        return "unknown"

def extract_speaker_names(text):
    """
    Extract potential speaker names from the transcript to build a custom speaker pattern
    """
    # Common titles and roles
    titles = [
        r'CEO', r'CFO', r'CTO', r'COO', r'CMO', r'Chairman', r'President', 
        r'Founder', r'Director', r'VP', r'Officer', r'Analyst', r'Operator',
        r'Manager', r'Head', r'Chief', r'Executive', r'Moderator'
    ]
    
    # Look for common patterns indicating speakers
    name_patterns = [
        # Standard format: Name: Text
        r'([A-Z][a-zA-Z\.\-]+(?: [A-Z][a-zA-Z\.\-]+){1,3}):', 
        
        # Role-based identifiers
        r'(' + '|'.join(titles) + r')\s+([A-Z][a-zA-Z\.\-]+(?: [A-Z][a-zA-Z\.\-]+){1,2})',
        
        # Name followed by role in parentheses
        r'([A-Z][a-zA-Z\.\-]+(?: [A-Z][a-zA-Z\.\-]+){1,2})\s+\((' + '|'.join(titles) + r')\)',
        
        # Name speaking actions
        r'([A-Z][a-zA-Z\.\-]+(?: [A-Z][a-zA-Z\.\-]+){1,2})(?: begins| continues| speaks| answers)'
    ]
    
    potential_speakers = []
    for pattern in name_patterns:
        matches = re.findall(pattern, text)
        if isinstance(matches[0], tuple) if matches else False:
            # Handle tuples in the results (for patterns with multiple capture groups)
            for match_groups in matches:
                potential_speakers.extend([g for g in match_groups if g and len(g) > 3])
        else:
            potential_speakers.extend([m for m in matches if m and len(m) > 3])
    
    # Filter out duplicates and short matches
    potential_speakers = list(set([s.strip() for s in potential_speakers if len(s.strip()) > 3]))
    
    return potential_speakers

def preprocess_concall_transcripts(transcript_text, keyword_list=None):
    """
    Enhanced transcript preprocessor that adapts to different transcript formats with token management
    """
    # Handle empty input
    if not transcript_text or not isinstance(transcript_text, str):
        warnings.warn("Empty or invalid transcript text")
        return "", {}, []
        
    keyword_list = keyword_list or DEFAULT_KEYWORDS
    keyword_list = [k.lower() for k in keyword_list]

    # === Limit input size to prevent token overflow ===
    max_chars = 25000  # Reduced to prevent token issues
    if len(transcript_text) > max_chars:
        print(f"⚠️ Transcript too long ({len(transcript_text)} chars), truncating to {max_chars} chars.")
        transcript_text = transcript_text[:max_chars]
    # === End of truncation block ===

    # Clean up text
    text = re.sub(r'\s+', ' ', transcript_text)
    
    # Normalize various section headers
    text = re.sub(
        r'\b(Q&A|Q and A|Question and Answer|Question & Answer|Interactive Q&A)\b',
        'Q&A Session', text, flags=re.IGNORECASE
    )
    
    # Section handling
    sections = re.split(r'\n\s*(?:PRESENTATION|Q&A SESSION|QUESTIONS AND ANSWERS|QUESTION AND ANSWER SESSION)\s*\n', 
                        text, flags=re.IGNORECASE)
    
    # Detect format and extract potential speakers
    format_type = detect_transcript_format(text)
    potential_speakers = extract_speaker_names(text)
    
    # Build speaker detection patterns based on format and potential speakers
    speaker_tags = [
        r'Management', r'Moderator', r'CEO', r'CFO', r'CTO', r'COO', r'CMO',
        r'Chairman', r'President', r'Founder', r'Co[- ]Founder', r'Vice President', r'VP',
        r'Director', r'Executive', r'Analyst', r'Host', r'Operator',
    ]
    
    # Add name patterns
    name_patterns = [
        r'[A-Z][a-z]+ [A-Z][a-z]+', 
        r'[A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+',
        r'[A-Z][a-z]+-[A-Z][a-z]+ [A-Z][a-z]+', 
        r'[A-Z]+ [A-Z]+'
    ]
    
    # Add extracted potential speakers as exact matches
    for speaker in potential_speakers:
        # Escape special regex characters in speaker names
        escaped_speaker = re.escape(speaker)
        speaker_tags.insert(0, escaped_speaker)
    
    # Combine patterns based on detected format
    if format_type == "standard":
        speaker_pattern = '|'.join(speaker_tags + name_patterns)
        dialogue_pattern = rf'(({speaker_pattern})):\s*(.*?)(?=(?:{speaker_pattern}:|$))'
    elif format_type == "timestamped":
        speaker_pattern = '|'.join(speaker_tags + name_patterns)
        dialogue_pattern = rf'(?:\[\d{{2}}:\d{{2}}:\d{{2}}\])?\s*(({speaker_pattern}))[:\s]+(.*?)(?=(?:\[\d{{2}}:\d{{2}}:\d{{2}}\]|{speaker_pattern}:|$))'
    elif format_type == "bulleted":
        speaker_pattern = '|'.join(speaker_tags + name_patterns)
        dialogue_pattern = rf'(?:^|\n)(?:•|-|–)\s*(({speaker_pattern}))\s*[-:–]\s*(.*?)(?=(?:^|\n)(?:•|-|–)|$)'
    else:
        # Fallback for unknown formats - try multiple approaches
        speaker_pattern = '|'.join(speaker_tags + name_patterns)
        dialogue_pattern = rf'(({speaker_pattern}))[\:\s]+(.*?)(?=(?:{speaker_pattern}[\:\s]|$))'
    
    # Try to extract dialogues with error handling
    raw_matches = []
    
    try:
        # Try with standard pattern first
        raw_matches = re.findall(dialogue_pattern, text, re.DOTALL)
        
        # If few matches, try alternative patterns
        if len(raw_matches) < 5:
            # Try paragraph-based extraction
            para_pattern = r'(?:^|\n\n)([A-Z][a-zA-Z\s\.\-]+)[\:\s]+(.*?)(?=(?:^|\n\n)[A-Z]|$)'
            alt_matches = re.findall(para_pattern, text, re.DOTALL)
            if len(alt_matches) > len(raw_matches):
                raw_matches = [(m[0], m[0], m[1]) for m in alt_matches]  # Adjust format to match expected structure
            
            # If still few matches, try line-by-line approach
            if len(raw_matches) < 5:
                lines = text.split('\n')
                current_speaker = None
                current_content = []
                
                for line in lines:
                    speaker_match = re.match(rf'^({speaker_pattern})[\:\s]+(.*)$', line)
                    if speaker_match:
                        # Save previous speaker's content if exists
                        if current_speaker and current_content:
                            raw_matches.append((current_speaker, current_speaker, ' '.join(current_content)))
                            current_content = []
                        # Set new speaker
                        current_speaker = speaker_match.group(1)
                        current_content.append(speaker_match.group(2))
                    elif current_speaker and line.strip():
                        # Continue previous speaker's content
                        current_content.append(line.strip())
                
                # Add the last speaker's content
                if current_speaker and current_content:
                    raw_matches.append((current_speaker, current_speaker, ' '.join(current_content)))
    except Exception as e:
        warnings.warn(f"Error in regex pattern matching: {e}")
        raw_matches = []

    cleaned_dialogues = []
    for match in raw_matches:
        try:
            if len(match) >= 3:  # Ensure we have enough elements in the match tuple
                speaker = match[0]
                utterance = match[2]
                
                # Clean utterance text
                cleaned = re.sub(r'[^\w\s\.,:%₹$\-\'\"]', '', utterance)
                cleaned = re.sub(r'\s+', ' ', cleaned).strip()
                
                # Skip if too short or likely not actual content
                if len(cleaned) < 10 or cleaned.isdigit():
                    continue
                
                # === Limit individual dialogue length ===
                max_dialogue_chars = 2000  # Limit each dialogue
                if len(cleaned) > max_dialogue_chars:
                    cleaned = cleaned[:max_dialogue_chars]
                    print(f"⚠️ Truncated long dialogue from {speaker}")
                # === End dialogue length limit ===
                
                # Extract matching keywords (limit keyword search to first 500 chars for efficiency)
                search_text = cleaned[:500].lower()
                matched = [k for k in keyword_list if k in search_text]
                
                # Analyze sentiment (on limited text for efficiency)
                sentiment = analyze_sentiment_finbert(cleaned[:400])
                
                # Only add if there's substantial content
                if len(cleaned.split()) > 5:
                    cleaned_dialogues.append({
                        'speaker': speaker.strip(),
                        'content': cleaned,
                        'matched_keywords': matched,
                        'sentiment': sentiment
                    })
                    
                # === Limit total number of dialogues ===
                if len(cleaned_dialogues) >= 30:  # Limit to prevent token overflow
                    print("⚠️ Reached maximum dialogue limit (30), stopping processing")
                    break
                # === End dialogue count limit ===
                    
        except Exception as e:
            warnings.warn(f"Error processing dialogue: {e}")
            continue

    # Create full text and speaker dictionary
    full_cleaned_text = ' '.join(d.get('content', '') for d in cleaned_dialogues)
    speaker_dict = defaultdict(str)
    for d in cleaned_dialogues:
        speaker_dict[d['speaker']] += d.get('content', '') + ' '

    # Print diagnostic information
    print(f"📊 Transcript format detected: {format_type}")
    print(f"👥 Potential speakers identified: {len(potential_speakers)}")
    print(f"💬 Total dialogues extracted: {len(cleaned_dialogues)}")
    print(f"🎤 Speakers in final output: {len(speaker_dict)}")
    print(f"📝 Total content length: {len(full_cleaned_text)} characters")

    return full_cleaned_text, speaker_dict, cleaned_dialogues


def extract_transcript_sections(text):
    """
    Extracts and classifies different sections of a transcript
    (e.g., introduction, presentation, Q&A)
    """
    sections = {}
    
    # Try to identify introduction/opening
    intro_patterns = [
        r'(?:Good morning|Good afternoon|Good evening|Welcome).*?(?=\n\n)',
        r'(?:Operator|Moderator).*?(?=\n\n)',
        r'(?:Introduction|Opening Remarks).*?(?=\n\n)'
    ]
    
    for pattern in intro_patterns:
        intro_match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        if intro_match:
            sections['introduction'] = intro_match.group(0)
            break
    
    # Try to identify presentation section
    presentation_match = re.search(
        r'(?:PRESENTATION|PREPARED REMARKS).*?(?:Q&A|QUESTION|$)', 
        text, 
        re.DOTALL | re.IGNORECASE
    )
    if presentation_match:
        sections['presentation'] = presentation_match.group(0)
    
    # Try to identify Q&A section
    qa_match = re.search(
        r'(?:Q&A|QUESTION AND ANSWER|Q AND A).*?$', 
        text, 
        re.DOTALL | re.IGNORECASE
    )
    if qa_match:
        sections['qa'] = qa_match.group(0)
    
    return sections









# import re
# from collections import defaultdict
# import torch
# import torch.nn.functional as F
# import warnings

# # Load FinBERT in a more robust way
# def get_finbert_model():
#     try:
#         from transformers import AutoTokenizer, AutoModelForSequenceClassification
#         tokenizer = AutoTokenizer.from_pretrained("yiyanghkust/finbert-tone")
#         model = AutoModelForSequenceClassification.from_pretrained("yiyanghkust/finbert-tone")
#         return tokenizer, model
#     except Exception as e:
#         warnings.warn(f"Could not load FinBERT model: {e}")
#         return None, None

# # Initialize models at module level but handle failures gracefully
# tokenizer, model = get_finbert_model()

# DEFAULT_KEYWORDS = [
#     "valuation", "management", "risk", "moat", "market", "revenue", "profit", "loss",
#     "guidance", "demand", "supply", "pricing", "competition", "capex", "growth",
#     "margins", "expenses", "ebitda", "cash flow", "dividend", "forecast", "future",
#     "performance", "business model", "customer", "cost", "economy", "industry",
#     "investment", "order book", "sustainability", "patent", "innovation", "regulatory"
# ]

# def analyze_sentiment_finbert(text):
#     # Fall back to neutral if no models are available
#     if tokenizer is None or model is None:
#         return "Neutral"
        
#     try:
#         # Truncate text to avoid overflow
#         text = text[:512] if len(text) > 512 else text
        
#         inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
#         with torch.no_grad():  # Prevent gradient calculation for inference
#             outputs = model(**inputs)
#         probs = F.softmax(outputs.logits, dim=1)
#         labels = ["Negative", "Neutral", "Positive"]
#         sentiment = labels[probs.argmax().item()]
#         return sentiment
#     except Exception as e:
#         warnings.warn(f"Error in sentiment analysis: {e}")
#         return "Neutral"  # Default to neutral on error

# def detect_transcript_format(text):
#     """
#     Detects the format of the transcript to apply appropriate extraction strategy
#     """
#     # Check for standard "Speaker: Text" format
#     standard_pattern = r'([A-Z][a-zA-Z\s\.\-]+):\s'
#     standard_matches = re.findall(standard_pattern, text)
    
#     # Check for timestamps in the format [HH:MM:SS]
#     timestamp_pattern = r'\[\d{2}:\d{2}:\d{2}\]'
#     has_timestamps = bool(re.search(timestamp_pattern, text))
    
#     # Check for bullet points or dashes that might indicate speakers
#     bullet_pattern = r'(?:^|\n)(?:•|-|–)\s*([A-Z][a-zA-Z\s\.]+)(?:\s*[-:–])'
#     bullet_matches = re.findall(bullet_pattern, text)
    
#     # Detection logic
#     if len(standard_matches) > 10:
#         return "standard"
#     elif has_timestamps:
#         return "timestamped"
#     elif len(bullet_matches) > 5:
#         return "bulleted"
#     else:
#         return "unknown"

# def extract_speaker_names(text):
#     """
#     Extract potential speaker names from the transcript to build a custom speaker pattern
#     """
#     # Common titles and roles
#     titles = [
#         r'CEO', r'CFO', r'CTO', r'COO', r'CMO', r'Chairman', r'President', 
#         r'Founder', r'Director', r'VP', r'Officer', r'Analyst', r'Operator',
#         r'Manager', r'Head', r'Chief', r'Executive', r'Moderator'
#     ]
    
#     # Look for common patterns indicating speakers
#     name_patterns = [
#         # Standard format: Name: Text
#         r'([A-Z][a-zA-Z\.\-]+(?: [A-Z][a-zA-Z\.\-]+){1,3}):', 
        
#         # Role-based identifiers
#         r'(' + '|'.join(titles) + r')\s+([A-Z][a-zA-Z\.\-]+(?: [A-Z][a-zA-Z\.\-]+){1,2})',
        
#         # Name followed by role in parentheses
#         r'([A-Z][a-zA-Z\.\-]+(?: [A-Z][a-zA-Z\.\-]+){1,2})\s+\((' + '|'.join(titles) + r')\)',
        
#         # Name speaking actions
#         r'([A-Z][a-zA-Z\.\-]+(?: [A-Z][a-zA-Z\.\-]+){1,2})(?: begins| continues| speaks| answers)'
#     ]
    
#     potential_speakers = []
#     for pattern in name_patterns:
#         matches = re.findall(pattern, text)
#         if isinstance(matches[0], tuple) if matches else False:
#             # Handle tuples in the results (for patterns with multiple capture groups)
#             for match_groups in matches:
#                 potential_speakers.extend([g for g in match_groups if g and len(g) > 3])
#         else:
#             potential_speakers.extend([m for m in matches if m and len(m) > 3])
    
#     # Filter out duplicates and short matches
#     potential_speakers = list(set([s.strip() for s in potential_speakers if len(s.strip()) > 3]))
    
#     return potential_speakers

# def preprocess_concall_transcripts(transcript_text, keyword_list=None):
#     """
#     Enhanced transcript preprocessor that adapts to different transcript formats
#     """
#     # Handle empty input
#     if not transcript_text or not isinstance(transcript_text, str):
#         warnings.warn("Empty or invalid transcript text")
#         return "", {}, []
        
#     keyword_list = keyword_list or DEFAULT_KEYWORDS
#     keyword_list = [k.lower() for k in keyword_list]

#     # Clean up text
#     text = re.sub(r'\s+', ' ', transcript_text)
    
#     # Normalize various section headers
#     text = re.sub(
#         r'\b(Q&A|Q and A|Question and Answer|Question & Answer|Interactive Q&A)\b',
#         'Q&A Session', text, flags=re.IGNORECASE
#     )
    
#     # Section handling
#     sections = re.split(r'\n\s*(?:PRESENTATION|Q&A SESSION|QUESTIONS AND ANSWERS|QUESTION AND ANSWER SESSION)\s*\n', 
#                         text, flags=re.IGNORECASE)
    
#     # Detect format and extract potential speakers
#     format_type = detect_transcript_format(text)
#     potential_speakers = extract_speaker_names(text)
    
#     # Build speaker detection patterns based on format and potential speakers
#     speaker_tags = [
#         r'Management', r'Moderator', r'CEO', r'CFO', r'CTO', r'COO', r'CMO',
#         r'Chairman', r'President', r'Founder', r'Co[- ]Founder', r'Vice President', r'VP',
#         r'Director', r'Executive', r'Analyst', r'Host', r'Operator',
#     ]
    
#     # Add name patterns
#     name_patterns = [
#         r'[A-Z][a-z]+ [A-Z][a-z]+', 
#         r'[A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+',
#         r'[A-Z][a-z]+-[A-Z][a-z]+ [A-Z][a-z]+', 
#         r'[A-Z]+ [A-Z]+'
#     ]
    
#     # Add extracted potential speakers as exact matches
#     for speaker in potential_speakers:
#         # Escape special regex characters in speaker names
#         escaped_speaker = re.escape(speaker)
#         speaker_tags.insert(0, escaped_speaker)
    
#     # Combine patterns based on detected format
#     if format_type == "standard":
#         speaker_pattern = '|'.join(speaker_tags + name_patterns)
#         dialogue_pattern = rf'(({speaker_pattern})):\s*(.*?)(?=(?:{speaker_pattern}:|$))'
#     elif format_type == "timestamped":
#         speaker_pattern = '|'.join(speaker_tags + name_patterns)
#         dialogue_pattern = rf'(?:\[\d{{2}}:\d{{2}}:\d{{2}}\])?\s*(({speaker_pattern}))[:\s]+(.*?)(?=(?:\[\d{{2}}:\d{{2}}:\d{{2}}\]|{speaker_pattern}:|$))'
#     elif format_type == "bulleted":
#         speaker_pattern = '|'.join(speaker_tags + name_patterns)
#         dialogue_pattern = rf'(?:^|\n)(?:•|-|–)\s*(({speaker_pattern}))\s*[-:–]\s*(.*?)(?=(?:^|\n)(?:•|-|–)|$)'
#     else:
#         # Fallback for unknown formats - try multiple approaches
#         speaker_pattern = '|'.join(speaker_tags + name_patterns)
#         dialogue_pattern = rf'(({speaker_pattern}))[\:\s]+(.*?)(?=(?:{speaker_pattern}[\:\s]|$))'
    
#     # Try to extract dialogues with error handling
#     raw_matches = []
    
#     try:
#         # Try with standard pattern first
#         raw_matches = re.findall(dialogue_pattern, text, re.DOTALL)
        
#         # If few matches, try alternative patterns
#         if len(raw_matches) < 5:
#             # Try paragraph-based extraction
#             para_pattern = r'(?:^|\n\n)([A-Z][a-zA-Z\s\.\-]+)[\:\s]+(.*?)(?=(?:^|\n\n)[A-Z]|$)'
#             alt_matches = re.findall(para_pattern, text, re.DOTALL)
#             if len(alt_matches) > len(raw_matches):
#                 raw_matches = [(m[0], m[0], m[1]) for m in alt_matches]  # Adjust format to match expected structure
            
#             # If still few matches, try line-by-line approach
#             if len(raw_matches) < 5:
#                 lines = text.split('\n')
#                 current_speaker = None
#                 current_content = []
                
#                 for line in lines:
#                     speaker_match = re.match(rf'^({speaker_pattern})[\:\s]+(.*)$', line)
#                     if speaker_match:
#                         # Save previous speaker's content if exists
#                         if current_speaker and current_content:
#                             raw_matches.append((current_speaker, current_speaker, ' '.join(current_content)))
#                             current_content = []
#                         # Set new speaker
#                         current_speaker = speaker_match.group(1)
#                         current_content.append(speaker_match.group(2))
#                     elif current_speaker and line.strip():
#                         # Continue previous speaker's content
#                         current_content.append(line.strip())
                
#                 # Add the last speaker's content
#                 if current_speaker and current_content:
#                     raw_matches.append((current_speaker, current_speaker, ' '.join(current_content)))
#     except Exception as e:
#         warnings.warn(f"Error in regex pattern matching: {e}")
#         raw_matches = []

#     cleaned_dialogues = []
#     for match in raw_matches:
#         try:
#             if len(match) >= 3:  # Ensure we have enough elements in the match tuple
#                 speaker = match[0]
#                 utterance = match[2]
                
#                 # Clean utterance text
#                 cleaned = re.sub(r'[^\w\s\.,:%₹$\-\'\"]', '', utterance)
#                 cleaned = re.sub(r'\s+', ' ', cleaned).strip()
                
#                 # Skip if too short or likely not actual content
#                 if len(cleaned) < 5 or cleaned.isdigit():
#                     continue
                
#                 # Extract matching keywords
#                 matched = [k for k in keyword_list if k in cleaned.lower()]
                
#                 # Analyze sentiment
#                 sentiment = analyze_sentiment_finbert(cleaned)
                
#                 # Only add if there's substantial content
#                 if len(cleaned.split()) > 3:
#                     cleaned_dialogues.append({
#                         'speaker': speaker.strip(),
#                         'content': cleaned,
#                         'matched_keywords': matched,
#                         'sentiment': sentiment
#                     })
#         except Exception as e:
#             warnings.warn(f"Error processing dialogue: {e}")
#             continue

#     # Create full text and speaker dictionary
#     full_cleaned_text = ' '.join(d.get('content', '') for d in cleaned_dialogues)
#     speaker_dict = defaultdict(str)
#     for d in cleaned_dialogues:
#         speaker_dict[d['speaker']] += d.get('content', '') + ' '

#     # Print diagnostic information
#     print(f"Transcript format detected: {format_type}")
#     print(f"Potential speakers identified: {len(potential_speakers)}")
#     print(f"Total dialogues extracted: {len(cleaned_dialogues)}")
#     print(f"Speakers in final output: {len(speaker_dict)}")

#     return full_cleaned_text, speaker_dict, cleaned_dialogues


# def extract_transcript_sections(text):
#     """
#     Extracts and classifies different sections of a transcript
#     (e.g., introduction, presentation, Q&A)
#     """
#     sections = {}
    
#     # Try to identify introduction/opening
#     intro_patterns = [
#         r'(?:Good morning|Good afternoon|Good evening|Welcome).*?(?=\n\n)',
#         r'(?:Operator|Moderator).*?(?=\n\n)',
#         r'(?:Introduction|Opening Remarks).*?(?=\n\n)'
#     ]
    
#     for pattern in intro_patterns:
#         intro_match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
#         if intro_match:
#             sections['introduction'] = intro_match.group(0)
#             break
    
#     # Try to identify presentation section
#     presentation_match = re.search(
#         r'(?:PRESENTATION|PREPARED REMARKS).*?(?:Q&A|QUESTION|$)', 
#         text, 
#         re.DOTALL | re.IGNORECASE
#     )
#     if presentation_match:
#         sections['presentation'] = presentation_match.group(0)
    
#     # Try to identify Q&A section
#     qa_match = re.search(
#         r'(?:Q&A|QUESTION AND ANSWER|Q AND A).*?$', 
#         text, 
#         re.DOTALL | re.IGNORECASE
#     )
#     if qa_match:
#         sections['qa'] = qa_match.group(0)
    
#     return sections


















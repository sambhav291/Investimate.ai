
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





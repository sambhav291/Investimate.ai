import os
import sys
from openai import OpenAI  # Using OpenRouter-compatible client

# Add parent directory to path to import keys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from secdat import openrouter_key  # Make sure this is correctly set

# Configure OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=openrouter_key
)

# Optional: You may need to install `tiktoken` if tokenizer isn't available via OpenRouter
try:
    import tiktoken
    tokenizer = tiktoken.get_encoding("cl100k_base")
except ImportError:
    tokenizer = None
    print("⚠️ Tokenizer not found. Install tiktoken for optimal token truncation.")

def count_tokens(text: str) -> int:
    """Count tokens in text"""
    if tokenizer:
        return len(tokenizer.encode(text))
    else:
        # Rough estimation: 1 token ≈ 4 characters
        return len(text) // 4

def truncate_token_length(text: str, max_tokens: int = 12000):
    """Truncate text to fit within token limit with safety margin"""
    if tokenizer:
        try:
            tokens = tokenizer.encode(text)
            if len(tokens) <= max_tokens:
                return text
            truncated_tokens = tokens[:max_tokens]
            return tokenizer.decode(truncated_tokens)
        except Exception as e:
            print(f"⚠️ Token truncation failed: {e}")
            # Fallback to character-based truncation
            return text[:max_tokens * 3]  # Rough estimate
    else:
        # Fallback if tokenizer not available (rough estimate)
        return text[:max_tokens * 3]

def chunk_dialogue(entry, max_len=600):
    """Create smaller chunks to ensure token limits"""
    chunks = []
    content = entry['content']
    for i in range(0, len(content), max_len):
        chunk = {
            'speaker': entry['speaker'],
            'content': content[i:i + max_len],
            'matched_keywords': entry['matched_keywords'],
            'sentiment': entry['sentiment']
        }
        chunks.append(chunk)
    return chunks

def batch_dialogues(dialogues, max_batch_size=8):
    """Split dialogues into smaller batches"""
    for i in range(0, len(dialogues), max_batch_size):
        yield dialogues[i:i + max_batch_size]

def create_safe_batch_prompt(batch_dialogues: list) -> str:
    """Create a batch prompt that safely fits within token limits"""
    
    base_prompt = """
You are a financial analyst.

Below is a section of a cleaned and structured transcript from a company's earnings conference call. Each entry includes a speaker's dialogue, matched financial keywords, and sentiment:

"""
    
    instruction = """

Your tasks:
1. Identify and group the discussions based on **financial trends** or **business themes** (such as revenue, margins, growth, risk, guidance, demand, expenses, capex, innovation, etc.).
2. Provide a **trend-wise summary** of this section — 1-3 lines per trend/topic.
3. Note the **overall sentiment** of this section based on the dialogue sentiments.
4. Highlight **key positive or negative points** if applicable.

Return the output in this format:

Trend-wise Summary:
- [Trend 1: Topic name]
  [Summary of what was discussed related to this topic]
- [Trend 2: Topic name]
  [Summary...]

Section Sentiment: [Positive/Negative/Neutral]

Key Points:
- [Point 1]
- [Point 2]
"""
    
    # Calculate available tokens for content
    base_tokens = count_tokens(base_prompt + instruction)
    available_tokens = 12000 - base_tokens  # Leave safety margin
    
    transcript_entries = ""
    current_tokens = 0
    
    for dialogue in batch_dialogues:
        entry_text = (
            f"- Speaker: {dialogue['speaker']}\n"
            f"  Keywords: {', '.join(dialogue['matched_keywords'])}\n"
            f"  Sentiment: {dialogue['sentiment']}\n"
            f"  Content: {dialogue['content']}\n\n"
        )
        
        entry_tokens = count_tokens(entry_text)
        
        if current_tokens + entry_tokens > available_tokens:
            # Truncate this entry to fit
            remaining_tokens = available_tokens - current_tokens
            if remaining_tokens > 100:  # Only add if meaningful space left
                truncated_entry = truncate_token_length(entry_text, remaining_tokens)
                transcript_entries += truncated_entry
            break
        
        transcript_entries += entry_text
        current_tokens += entry_tokens
    
    return base_prompt + f"Transcript Entries:\n{transcript_entries}" + instruction

def summarize_concall_transcripts(processed_dialogues):
    if not processed_dialogues:
        print("⚠️ No dialogue data to summarize.")
        return None

    print(f"📊 Processing {len(processed_dialogues)} dialogues...")

    # Step 1: Chunk long dialogues and limit content size
    expanded_dialogues = []
    for entry in processed_dialogues:
        # Limit individual dialogue length
        if len(entry['content']) > 1500:
            entry['content'] = entry['content'][:1500]
            print(f"⚠️ Truncated long dialogue from {entry['speaker']}")
        
        if len(entry['content']) > 600:
            expanded_dialogues.extend(chunk_dialogue(entry, max_len=600))
        else:
            expanded_dialogues.append(entry)
    
    print(f"📈 Expanded to {len(expanded_dialogues)} dialogue chunks")
    for i in expanded_dialogues:
        print(f"  - {i['speaker']}: {len(i['content'])} chars, Sentiment: {i['sentiment']}")

    # Step 2: Process in batches to avoid token overflow
    batch_summaries = []
    
    for batch_idx, batch in enumerate(batch_dialogues(expanded_dialogues, max_batch_size=8)):
        print(f"🔄 Processing batch {batch_idx + 1}...")
        
        # Create token-safe batch prompt
        batch_prompt = create_safe_batch_prompt(batch)
        
        # Double-check token count
        token_count = count_tokens(batch_prompt)
        if token_count > 15000:  # Safety check
            print(f"⚠️ Batch prompt still too long ({token_count} tokens), further truncating...")
            batch_prompt = truncate_token_length(batch_prompt, 12000)

        try:
            response = client.chat.completions.create(
                model="deepseek/deepseek-r1:free",
                messages=[{"role": "user", "content": batch_prompt}],
                extra_headers={
                    "HTTP-Referer": "http://localhost",
                    "X-Title": "Concall Batch Summarizer"
                }
            )
            batch_summaries.append(response.choices[0].message.content.strip())
            print(f"✅ Batch {batch_idx + 1} processed successfully")
            
        except Exception as batch_error:
            print(f"❌ Error processing batch {batch_idx + 1}: {batch_error}")
            # Continue with other batches
            continue

    if not batch_summaries:
        return "❌ No batches were successfully processed"

    # Step 3: Create final consolidated summary
    print("🔄 Creating final consolidated summary...")
    
    # If only one batch, return it directly
    if len(batch_summaries) == 1:
        return batch_summaries[0]
    
    # For multiple batches, create consolidated summary
    final_intro = """
You are a financial analyst.

Below are summaries from different sections of a company's earnings conference call:

"""

    final_instruction = """

Create a comprehensive, structured summary with the following format:

## Company Overview
- Provide a brief introduction to the company, its market position, and core business
- Mention notable attributes like management, brand recognition, product range, and geographic presence
- Include any unique selling propositions or competitive advantages mentioned

## Financial Performance
- Highlight the key reporting periods covered in the presentation
- Summarize the most important financial metrics (revenue, profit, margins, growth rates)
- Note any significant year-over-year or quarter-over-quarter changes
- Include debt levels and capital structure insights if mentioned

## Business Segments
- Break down the company's main business segments or revenue streams
- For each segment, provide details on performance, growth, and strategic focus
- Include geographic or product-based segmentation as applicable

## Strategy and Outlook
- Outline the company's stated growth strategy and future plans
- Include any guidance provided for upcoming periods
- Mention planned investments, expansions, or new initiatives
- Note any risks or challenges acknowledged by management

## Market Dynamics
- Summarize industry trends and market conditions discussed
- Include competitive positioning if mentioned
- Note any market opportunities or headwinds highlighted

## Overall Tone
- Provide the overall sentiment of the conference call

Your summary should be factual, well-organized, and highlight the most business-critical information from the presentation.
"""

    # Calculate available space for batch summaries
    base_tokens = count_tokens(final_intro + final_instruction)
    available_tokens = 12000 - base_tokens
    
    # Truncate batch summaries to fit
    joined_summaries = "\n\n".join(batch_summaries)
    truncated_summaries = truncate_token_length(joined_summaries, available_tokens)

    final_prompt = final_intro + truncated_summaries + final_instruction
    
    # Final safety check
    final_token_count = count_tokens(final_prompt)
    if final_token_count > 15000:
        final_prompt = truncate_token_length(final_prompt, 12000)

    # Step 4: Generate final summary using OpenRouter
    try:
        response = client.chat.completions.create(
            model="deepseek/deepseek-r1:free",
            messages=[{"role": "user", "content": final_prompt}],
            extra_headers={
                "HTTP-Referer": "http://localhost",
                "X-Title": "Concall Final Summarizer"
            }
        )
        print("✅ Final concall summary generated successfully")
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"❌ Full error details: {e}")
        return f"❌ Error generating final summary: {str(e)}"







# import os
# import sys
# import google.generativeai as genai

# # Add parent directory to path to import gemini_key
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# from secdat import gemini_key

# # Configure Gemini API
# genai.configure(api_key=gemini_key)

# def chunk_dialogue(entry, max_len=800):
#     chunks = []
#     content = entry['content']
#     for i in range(0, len(content), max_len):
#         chunk = {
#             'speaker': entry['speaker'],
#             'content': content[i:i + max_len],
#             'matched_keywords': entry['matched_keywords'],
#             'sentiment': entry['sentiment']
#         }
#         chunks.append(chunk)
#     return chunks

# def batch_dialogues(dialogues, max_batch_size=8):
#     for i in range(0, len(dialogues), max_batch_size):
#         yield dialogues[i:i + max_batch_size]

# def REDACTED-GOOGLE-CLIENT-SECRETripts(processed_dialogues):
#     if not processed_dialogues:
#         print("⚠️ No dialogue data to summarize.")
#         return None

#     print(f"📊 Processing {len(processed_dialogues)} dialogues...")

#     # Step 1: Chunk long dialogues and limit content size
#     expanded_dialogues = []
#     for entry in processed_dialogues:
#         if len(entry['content']) > 1500:
#             entry['content'] = entry['content'][:1500]
#             print(f"⚠️ Truncated long dialogue from {entry['speaker']}")

#         if len(entry['content']) > 800:
#             expanded_dialogues.extend(chunk_dialogue(entry, max_len=800))
#         else:
#             expanded_dialogues.append(entry)

#     print(f"📈 Expanded to {len(expanded_dialogues)} dialogue chunks")

#     batch_summaries = []
#     model = genai.GenerativeModel(model_name='models/gemini-1.5-pro-latest')

#     for batch_idx, batch in enumerate(batch_dialogues(expanded_dialogues, max_batch_size=8)):
#         print(f"🔄 Processing batch {batch_idx + 1}...")

#         batch_entries = ""
#         for d in batch:
#             batch_entries += (
#                 f"- Speaker: {d['speaker']}\n"
#                 f"  Keywords: {', '.join(d['matched_keywords'])}\n"
#                 f"  Sentiment: {d['sentiment']}\n"
#                 f"  Content: {d['content']}\n\n"
#             )

#         prompt = f"""
# You are a financial analyst.

# Below is a section of a cleaned and structured transcript from a company's earnings conference call. Each entry includes a speaker's dialogue, matched financial keywords, and sentiment:

# Transcript Entries:
# {batch_entries}

# Your tasks:
# 1. Identify and group the discussions based on **financial trends** or **business themes** (such as revenue, margins, growth, risk, guidance, demand, expenses, capex, innovation, etc.).
# 2. Provide a **trend-wise summary** of this section — 1-3 lines per trend/topic.
# 3. Note the **overall sentiment** of this section based on the dialogue sentiments.
# 4. Highlight **key positive or negative points** if applicable.

# Return the output in this format:

# Trend-wise Summary:
# - [Trend 1: Topic name]
#   [Summary of what was discussed related to this topic]
# - [Trend 2: Topic name]
#   [Summary...]

# Section Sentiment: [Positive/Negative/Neutral]

# Key Points:
# - [Point 1]
# - [Point 2]
# """

#         try:
#             response = model.generate_content(prompt)
#             batch_summaries.append(response.text.strip())
#             print(f"✅ Batch {batch_idx + 1} processed successfully")
#         except Exception as batch_error:
#             print(f"❌ Error processing batch {batch_idx + 1}: {batch_error}")
#             continue

#     if not batch_summaries:
#         return "❌ No batches were successfully processed"

#     print("🔄 Creating final consolidated summary...")

#     final_intro = """
# You are a financial analyst.

# Below are summaries from different sections of a company's earnings conference call:

# """

#     final_instruction = """
# Create a comprehensive, structured summary with the following format:

# ## Company Overview
# - Provide a brief introduction to the company, its market position, and core business
# - Mention notable attributes like management, brand recognition, product range, and geographic presence
# - Include any unique selling propositions or competitive advantages mentioned

# ## Financial Performance
# - Highlight the key reporting periods covered in the presentation
# - Summarize the most important financial metrics (revenue, profit, margins, growth rates)
# - Note any significant year-over-year or quarter-over-quarter changes
# - Include debt levels and capital structure insights if mentioned

# ## Business Segments
# - Break down the company's main business segments or revenue streams
# - For each segment, provide details on performance, growth, and strategic focus
# - Include geographic or product-based segmentation as applicable

# ## Strategy and Outlook
# - Outline the company's stated growth strategy and future plans
# - Include any guidance provided for upcoming periods
# - Mention planned investments, expansions, or new initiatives
# - Note any risks or challenges acknowledged by management

# ## Market Dynamics
# - Summarize industry trends and market conditions discussed
# - Include competitive positioning if mentioned
# - Note any market opportunities or headwinds highlighted

# ## Overall Tone
# - Provide the overall sentiment of the conference call
# """

#     joined_summaries = "\n\n".join(batch_summaries)
#     final_prompt = final_intro + joined_summaries + final_instruction

#     try:
#         response = model.generate_content(final_prompt)
#         print("✅ Final concall summary generated successfully")
#         return response.text.strip()
#     except Exception as e:
#         print(f"❌ Error generating final summary: {e}")
#         return f"❌ Error generating final summary: {str(e)}"



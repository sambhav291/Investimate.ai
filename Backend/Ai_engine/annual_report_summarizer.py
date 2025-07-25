import os
import sys
import pandas as pd
from openai import OpenAI  # via OpenRouter

# Add parent directory to path to import keys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from secdat import openrouter_key  # Make sure you have this key

# Configure OpenRouter client
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

def truncate_token_length(prompt: str, max_tokens: int = 12000):
    """Truncate text to fit within token limit with safety margin"""
    if tokenizer:
        try:
            tokens = tokenizer.encode(prompt)
            if len(tokens) <= max_tokens:
                return prompt
            truncated_tokens = tokens[:max_tokens]
            return tokenizer.decode(truncated_tokens)
        except Exception as e:
            print(f"⚠️ Token truncation failed: {e}")
            # Fallback to character-based truncation
            return prompt[:max_tokens * 3]  # Rough estimate
    else:
        # Fallback if tokenizer not available (rough estimate)
        return prompt[:max_tokens * 3]

def chunk_text(text, max_length=800):
    """Create smaller chunks to ensure they fit within token limits"""
    return [text[i:i + max_length] for i in range(0, len(text), max_length)]

def batch_chunks(lst, batch_size):
    for i in range(0, len(lst), batch_size):
        yield lst[i:i + batch_size]

def create_safe_batch_prompt(company_name: str, batch_entries: list) -> str:
    """Create a batch prompt that safely fits within token limits"""
    
    base_prompt = f"""
You are a financial analyst.

Below are extracted and preprocessed sections from the annual report of '{company_name}'.

"""
    
    instruction = """

Instructions:
- Provide a concise summary (3–5 bullets) of this batch.
- Mention major financial or strategic points.
- Use keywords where possible.
- End with the overall sentiment of this batch (Positive/Negative/Neutral).
"""
    
    # Calculate available tokens for content
    base_tokens = count_tokens(base_prompt + instruction)
    available_tokens = 12000 - base_tokens  # Leave safety margin
    
    sections_text = ""
    current_tokens = 0
    
    for entry in batch_entries:
        section_content = (
            f"\n### {entry['title']}\n"
            f"Content:\n{entry['chunk']}\n"
            f"Sentiment: {entry['sentiment']}\n"
            f"Keywords: {', '.join(entry['keywords'])}\n"
        )
        
        section_tokens = count_tokens(section_content)
        
        if current_tokens + section_tokens > available_tokens:
            # Truncate this section to fit
            remaining_tokens = available_tokens - current_tokens
            if remaining_tokens > 100:  # Only add if meaningful space left
                truncated_content = truncate_token_length(section_content, remaining_tokens)
                sections_text += truncated_content
            break
        
        sections_text += section_content
        current_tokens += section_tokens
    
    return base_prompt + sections_text + instruction

def summarize_annual_report_sections(company_name, section_data: dict, max_chunks_per_batch=5):
    """Summarize annual report sections with proper token management"""
    
    if not section_data:
        return f"⚠️ No data available for company: {company_name}"

    try:
        all_chunks = []

        # Create smaller chunks with token awareness
        for title, info in section_data.items():
            content = info.get("content", "").strip()
            sentiment = info.get("sentiment", "Neutral")
            matched_keywords = info.get("matched_keywords", [])

            # Truncate very long content first
            if count_tokens(content) > 2000:
                content = truncate_token_length(content, 2000)

            content_chunks = chunk_text(content, 800)  # Smaller chunks
            for idx, chunk in enumerate(content_chunks):
                chunk_title = f"{title} (Part {idx + 1})" if len(content_chunks) > 1 else title
                all_chunks.append({
                    "title": chunk_title,
                    "chunk": chunk,
                    "sentiment": sentiment,
                    "keywords": matched_keywords
                })

        print(f"📊 Created {len(all_chunks)} chunks for processing")
        batch_summaries = []

        # Process in smaller batches
        for batch_idx, batch in enumerate(batch_chunks(all_chunks, max_chunks_per_batch)):
            print(f"🔄 Processing batch {batch_idx + 1}...")
            
            # Create token-safe batch prompt
            batch_prompt = create_safe_batch_prompt(company_name, batch)
            
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
                        "X-Title": "Investimate AI"
                    }
                )
                batch_summaries.append(response.choices[0].message.content.strip())
                print(f"✅ Batch {batch_idx + 1} processed successfully")
                
            except Exception as batch_error:
                print(f"❌ Error processing batch {batch_idx + 1}: {batch_error}")
                # Continue with other batches
                continue

        if not batch_summaries:
            return f"❌ No batches were successfully processed for {company_name}"

        # Create final summary with strict token management
        print("🔄 Creating final consolidated summary...")
        
        combined_intro = f"""
You are a financial analyst.

Below are summaries generated from different batches of an annual report for '{company_name}':

"""

        instruction = """

Now, write a final consolidated summary in the following format:

Summary:
- [Bullet 1]
- ...
- [Bullet 5–7]

Overall Sentiment: [Positive/Negative/Neutral]

Key Themes:
- [Theme 1]
- [Theme 2]
- ...
"""

        # Calculate available space for summaries
        base_tokens = count_tokens(combined_intro + instruction)
        available_tokens = 12000 - base_tokens
        
        # Truncate batch summaries to fit
        joined_summaries = "\n\n".join(batch_summaries)
        truncated_summaries = truncate_token_length(joined_summaries, available_tokens)

        final_prompt = combined_intro + truncated_summaries + instruction
        
        # Final safety check
        final_token_count = count_tokens(final_prompt)
        if final_token_count > 15000:
            final_prompt = truncate_token_length(final_prompt, 12000)

        final_response = client.chat.completions.create(
            model="deepseek/deepseek-r1:free",
            messages=[{"role": "user", "content": final_prompt}],
            extra_headers={
                "HTTP-Referer": "http://localhost",
                "X-Title": "Annual Report Final Summary"
            }
        )

        print("✅ Final summary generated successfully")
        return final_response.choices[0].message.content.strip()

    except Exception as e:
        print(f"❌ Full error details: {e}")
        return f"❌ Error summarizing annual report for {company_name}: {str(e)}"





# import os
# import sys
# import google.generativeai as genai

# # Add parent directory to path to import gemini_key
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# from secdat import gemini_key

# # Configure Gemini API
# genai.configure(api_key=gemini_key)

# def chunk_text(text, max_length=1000):
#     return [text[i:i + max_length] for i in range(0, len(text), max_length)]

# def batch_chunks(lst, batch_size):
#     for i in range(0, len(lst), batch_size):
#         yield lst[i:i + batch_size]

# def REDACTED-GOOGLE-CLIENT-SECRETsections(company_name, section_data: dict, max_chunks_per_batch=8):
#     if not section_data:
#         return f"⚠️ No data available for company: {company_name}"

#     try:
#         all_chunks = []

#         # Step 1: Chunk content
#         for title, info in section_data.items():
#             content = info.get("content", "").strip()
#             sentiment = info.get("sentiment", "Neutral")
#             matched_keywords = info.get("matched_keywords", [])

#             content_chunks = chunk_text(content, 1000)
#             for idx, chunk in enumerate(content_chunks):
#                 chunk_title = f"{title} (Part {idx + 1})" if len(content_chunks) > 1 else title
#                 all_chunks.append({
#                     "title": chunk_title,
#                     "chunk": chunk,
#                     "sentiment": sentiment,
#                     "keywords": matched_keywords
#                 })

#         model = genai.GenerativeModel(model_name='models/gemini-1.5-pro-latest')
#         batch_summaries = []

#         # Step 2: Process batches
#         for batch in batch_chunks(all_chunks, max_chunks_per_batch):
#             sections_text = ""
#             for entry in batch:
#                 sections_text += (
#                     f"\n### {entry['title']}\n"
#                     f"Content:\n{entry['chunk']}\n"
#                     f"Sentiment: {entry['sentiment']}\n"
#                     f"Keywords: {', '.join(entry['keywords'])}\n"
#                 )

#             batch_prompt = f"""
# You are a financial analyst.

# Below are extracted and preprocessed sections from the annual report of '{company_name}':

# {sections_text}

# Instructions:
# - Provide a concise summary (3–5 bullets) of this batch.
# - Mention major financial or strategic points.
# - Use keywords where possible.
# - End with the overall sentiment of this batch (Positive/Negative/Neutral).
# """
#             response = model.generate_content(batch_prompt)
#             batch_summaries.append(response.text.strip())

#         # Step 3: Final Consolidated Summary
#         combined_prompt = f"""
# You are a financial analyst.

# Below are summaries generated from different batches of an annual report for '{company_name}':

# {chr(10).join(batch_summaries)}

# Now, write a final consolidated summary in the following format:

# Summary:
# - [Bullet 1]
# - ...
# - [Bullet 5–7]

# Overall Sentiment: [Positive/Negative/Neutral]

# Key Themes:
# - [Theme 1]
# - [Theme 2]
# - ...
# """

#         final_response = model.generate_content(combined_prompt)
#         return final_response.text.strip()

#     except Exception as e:
#         return f"❌ Error summarizing annual report for {company_name}: {e}"



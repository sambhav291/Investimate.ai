import os
import sys
import logging

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import free summarizer
from Ai_engine.free_summarizer import summarize_concall_transcripts

logger = logging.getLogger(__name__)

def summarize_concall_transcripts_legacy(processed_dialogues):
    """
    Legacy function that now uses free summarizer
    """
    return summarize_concall_transcripts(processed_dialogues)







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



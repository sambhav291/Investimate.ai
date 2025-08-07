import os
import sys
import logging

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import free summarizer
from Ai_engine.free_summarizer import generate_combined_summary

logger = logging.getLogger(__name__)

def generate_combined_summary_legacy(forum_summary, annual_summary, concall_summary, company_name):
    """
    Legacy function that now uses free summarizer
    """
    return generate_combined_summary(forum_summary, annual_summary, concall_summary, company_name)






# import google.generativeai as genai
# from secdat import gemini_key

# # Configure Gemini
# genai.configure(api_key=gemini_key)

# def REDACTED-GOOGLE-CLIENT-SECRETy(forum_summary, annual_summary, concall_summary, company_name):
#     prompt = f"""
# You are a senior financial analyst.

# You are given three types of summaries about the company '{company_name}':

# ---
# 📢 Forum Summary:
# {forum_summary}

# 📄 Annual Report Summary:
# {annual_summary}

# 📞 Earnings Concall Summary:
# {concall_summary}
# ---

# Your tasks:
# 1. Combine the three sources into a **single concise investor summary** in 5–7 bullet points.
# 2. Identify and state the **overall investment tone** (Positive / Neutral / Negative), taking into account all three sources.
# 3. Highlight 3–5 key **risks or opportunities** discussed across the summaries.
# 4. Emphasize any **gap between market perception and management guidance**, if it appears in the data.

# Format your response like this:

# 📌 Combined Summary:
# - Bullet 1
# - Bullet 2
# - ...
# - Bullet 7

# 📊 Overall Investment Tone: [Positive / Neutral / Negative]

# ⚠️ Risks/Opportunities:
# - Risk or Opportunity 1
# - Risk or Opportunity 2
# - ...
# """

#     try:
#         model = genai.GenerativeModel(model_name='models/gemini-1.5-pro-latest')
#         response = model.generate_content(prompt)
#         return response.text.strip()
#     except Exception as e:
#         return f"❌ Error generating combined summary: {e}"




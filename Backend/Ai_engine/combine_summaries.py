from openai import OpenAI
from secdat import openrouter_key

# Configure OpenRouter client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=openrouter_key
)

def generate_combined_summary(forum_summary, annual_summary, concall_summary, company_name):
    prompt = f"""
You are a senior financial analyst.

You are given three types of summaries about '{company_name}':
---
📢 Forum Summary:
{forum_summary}

📄 Annual Report Summary:
{annual_summary}

📞 Earnings Concall Summary:
{concall_summary}
---

Your tasks:
1. Combine the three sources into a **single concise investor summary** in 5–7 bullet points.
2. Identify and state the **overall investment tone** (Positive/Neutral/Negative), taking into account all three.
3. Highlight 3–5 key **risks or opportunities** discussed across sources.
4. Emphasize any **market perception vs management guidance** gaps, if noticeable.

Return in this format:

📌 Combined Summary:
- Bullet 1
- Bullet 2
...

📊 Overall Investment Tone: [Positive/Negative/Neutral]

⚠️ Risks/Opportunities:
- Point 1
- Point 2
- ...
    """

    try:
        response = client.chat.completions.create(
            model="deepseek/deepseek-r1:free",  # Change as needed
            messages=[{"role": "user", "content": prompt}],
            extra_headers={
                "HTTP-Referer": "http://localhost",
                "X-Title": "Combined Summary Generator"
            }
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"❌ Error generating combined summary: {e}"






# import google.generativeai as genai
# from secdat import gemini_key

# # Configure Gemini
# genai.configure(api_key=gemini_key)

# def generate_combined_summary(forum_summary, annual_summary, concall_summary, company_name):
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




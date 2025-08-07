import sys
import os
import pandas as pd
import logging

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import free summarizer
from Ai_engine.free_summarizer import summarize_forum_data

logger = logging.getLogger(__name__)

def summarize_forum_data_legacy(processed_list):
    """
    Legacy function that now uses free summarizer
    """
    return summarize_forum_data(processed_list)
    processed_df = pd.DataFrame(processed_list)

    if not processed_df.empty:
        # Use free summarizer
        return summarize_forum_data(processed_list)
    else:
        logger.warning("⚠️ No relevant posts found after preprocessing.")
        return "No forum data available for analysis."









# import sys
# import os
# import pandas as pd
# import google.generativeai as genai

# # Add parent directory to path to import gemini_key
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# from secdat import gemini_key

# # Configure Gemini
# genai.configure(api_key=gemini_key)

# def summarize_forum_data(processed_list):
#     processed_df = pd.DataFrame(processed_list)

#     if processed_df.empty:
#         print("⚠️ No relevant posts found after preprocessing.")
#         return None

#     try:
#         stock_name = processed_df.iloc[0]['stock_name']
#         posts = processed_df['post_text'].tolist()
#         sentiments = processed_df['sentiment'].tolist()

#         # Construct formatted post list
#         formatted_posts = "\n".join(
#             [f"{idx+1}. {text.strip()}" for idx, text in enumerate(posts)]
#         )

#         formatted_sentiments = ", ".join(sentiments)

#         # 🧠 Enhanced prompt
#         prompt = f"""
# You are a financial analyst analyzing public sentiment from retail investor forums.

# Stock: '{stock_name}'

# Below are user posts extracted from popular forums:
# {formatted_posts}

# Each post also includes a sentiment label. The labels (in order) are:
# {formatted_sentiments}

# Your task is to:
# 1. Summarize the **overall tone and discussion** in 5–7 well-formed sentences.
# 2. Clearly state the **overall public sentiment** as one of: Positive / Neutral / Negative — based on sentiment labels and post tone.
# 3. Highlight **3 key concerns or positive points** raised frequently by users.

# Return your response in the following format:

# 📌 Summary:
# - [Sentence 1]
# - ...
# - [Sentence 5–7]

# 📊 Overall Public Sentiment: [Positive / Negative / Neutral]

# 💬 Key Points:
# - [Insight 1]
# - [Insight 2]
# - [Insight 3]
#         """

#         # Generate using Gemini
#         model = genai.GenerativeModel(model_name='models/gemini-1.5-pro-latest')
#         response = model.generate_content(prompt)

#         return response.text.strip()

#     except Exception as e:
#         return f"❌ Error processing {stock_name}: {e}"













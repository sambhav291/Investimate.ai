import sys
import os
import pandas as pd
from openai import OpenAI  # openrouter
import time
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from secdat import openrouter_key  # make sure this contains your OpenRouter API key

# Initialize OpenRouter-compatible client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=openrouter_key,
)

def summarize_forum_data(processed_list):
    processed_df = pd.DataFrame(processed_list)

    if not processed_df.empty:
        stock_name = processed_df.iloc[0]['stock_name']
        posts = processed_df['post_text'].tolist()
        sentiments = processed_df['sentiment'].tolist()

        prompt = f"""
You are a financial analyst.

Here are some forum posts about the stock '{stock_name}':
{posts}

The sentiment labels for each post are: {sentiments}

Your task:
- Summarize the overall discussion in 5-7 sentences.
- Provide an overall public sentiment (Positive, Negative, or Neutral) based on the majority of the sentiments and tone of posts.
- Highlight any major concerns or positives mentioned by users.

Return the output as:

Summary:
[Your summary here]

Overall Public Sentiment: [Positive/Negative/Neutral]

Key Points:
- [Point 1]
- [Point 2]
- [Point 3]
        """

        try:
            response = client.chat.completions.create(
                model="deepseek/deepseek-r1:free",
                messages=[
                    {"role": "system", "content": "You are a helpful financial analyst."},
                    {"role": "user", "content": prompt}
                ],
                extra_headers={
                    "HTTP-Referer": "https://your-portfolio-site.com",  # Optional
                    "X-Title": "REDACTED-GOOGLE-CLIENT-SECRET"  # Optional
                },
                extra_body={}
            )

            result = response.choices[0].message.content
            return result

        except Exception as e:
            return f"Error processing {stock_name}: {e}"
    else:
        print("⚠️ No relevant posts found after preprocessing.")
        return None









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













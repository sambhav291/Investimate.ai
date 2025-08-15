import json
import sys
import os
import re
from openai import OpenAI
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from secdat import openrouter_key 

def sanitize_text_for_ai(text: str) -> str:
    """
    Removes problematic characters from text before sending to an AI API.
    """
    if not isinstance(text, str):
        return ""
    return re.sub(r'[^\x20-\x7E\t\n\r]+', ' ', text)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=openrouter_key,
)

def enhance_forum_data(basic_forum_data, stock_name):

    safe_data = sanitize_text_for_ai(basic_forum_data)

    enhancement_prompt = f"""
    You are a senior financial analyst specializing in social sentiment analysis. Analyze this forum discussion data for {stock_name} and extract investment-relevant insights.

    INPUT DATA: {safe_data}
    
    Return ONLY a valid JSON object (no additional text) with these sections:
    
    {{
        "sentiment_analysis": {{
            "overall_sentiment": "Bullish/Bearish/Neutral",
            "bullish_percentage": 0,
            "bearish_percentage": 0,
            "neutral_percentage": 0,
            "sentiment_trends": ["trend descriptions over time"],
            "key_sentiment_drivers": ["main factors driving sentiment"]
        }},
        "investor_concerns": {{
            "top_concerns": ["most frequently mentioned concerns"],
            "recurring_themes": ["themes that appear repeatedly"],
            "new_concerns": ["recently emerged concerns"],
            "resolved_concerns": ["concerns that seem to be resolved"]
        }},
        "price_targets": {{
            "mentioned_targets": ["specific price targets with context"],
            "average_target": 0,
            "target_range": {{"low": 0, "high": 0}},
            "target_rationale": ["reasoning behind price targets"]
        }},
        "retail_vs_institutional": {{
            "retail_sentiment": "Bullish/Bearish/Neutral",
            "institutional_views": "summary of institutional perspective",
            "divergence_areas": ["areas where retail and institutional views differ"]
        }},
        "market_perception": {{
            "company_reputation": "summary of company reputation",
            "management_credibility": "High/Medium/Low",
            "growth_expectations": ["expectations for company growth"],
            "risk_perception": ["perceived risks discussed"]
        }},
        "social_momentum": {{
            "discussion_volume": "High/Medium/Low",
            "engagement_quality": "High/Medium/Low",
            "trending_topics": ["hot topics being discussed"],
            "influential_opinions": ["notable opinions from influential users"],
            "viral_content": ["posts or comments that gained significant traction"]
        }},
        "REDACTED-GOOGLE-CLIENT-SECRETons": {{
            "REDACTED-GOOGLE-CLIENT-SECRETs": ["mentioned support/resistance levels"],
            "chart_patterns": ["technical patterns discussed"],
            "indicator_signals": ["technical indicators mentioned"]
        }},
        "news_reaction": {{
            "recent_news_impact": ["how recent news affected sentiment"],
            "rumor_mill": ["rumors or speculation being discussed"],
            "catalyst_expectations": ["expected catalysts mentioned by users"]
        }}
    }}
    
    Rules:
    1. Calculate percentages that add up to 100% (bullish + bearish + neutral = 100)
    2. Include specific quotes when relevant (use quotation marks)
    3. If no price targets mentioned, set average_target to 0
    4. Focus on investment-relevant discussions only
    5. Distinguish between factual information and speculation
    6. Return valid JSON only - no additional commentary
    """
    try:
        response = client.chat.completions.create(
            model="deepseek/deepseek-r1:free",
            messages=[
                {"role": "system", "content": "You are a senior financial analyst specializing in social sentiment analysis and forum discussion interpretation. Return only valid JSON without any additional text or commentary."},
                {"role": "user", "content": enhancement_prompt}
            ],
            temperature=0.3,
            max_tokens=4000,
            extra_headers={
                "HTTP-Referer": "https://your-portfolio-site.com", 
                "X-Title": "REDACTED-GOOGLE-CLIENT-SECRET" 
            },
            extra_body={}
        )

        result = response.choices[0].message.content
        if result.startswith('```json'):
            result = result[7:]  
        if result.endswith('```'):
            result = result[:-3]  
        return result.strip()

    except Exception as e:
        print(f"CRITICAL: AI call failed in enhance_forum_data: {e}")
        raise
    
def generate_response(basic_forum_data, stock_name):
    enhanced_data = enhance_forum_data(basic_forum_data, stock_name)
    return json.loads(enhanced_data)


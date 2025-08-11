import json
import sys
import os
from openai import OpenAI
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from secdat import openrouter_key 

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=openrouter_key,
)


def enhance_concall_data(basic_concall_data, stock_name):
    
    enhancement_prompt = f"""
    You are a senior financial analyst. Analyze this earnings call data for {stock_name} and extract structured insights for investment analysis.
    
    INPUT DATA: {json.dumps(basic_concall_data, indent=2)}
    
    Extract and return ONLY a valid JSON object (no additional text) with these sections:
    
    {{
        "financial_metrics": {{
            "revenue_figures": ["specific revenue numbers with context"],
            "profitability_metrics": ["margins, EBITDA, net profit with percentages"],
            "guidance_provided": ["forward-looking statements with timeframes"],
            "working_capital_data": ["cash, inventory, receivables data"],
            "capex_commitments": ["capital expenditure plans with amounts"]
        }},
        "business_developments": {{
            "operational_updates": ["production, capacity, efficiency updates"],
            "capacity_utilization": ["utilization rates and expansion plans"],
            "new_projects": ["upcoming projects with timelines and investments"],
            "incidents_issues": ["any operational challenges or disruptions"],
            "customer_updates": ["new customers, contracts, market expansion"]
        }},
        "management_tone": {{
            "confidence_level": "High/Medium/Low",
            "transparency_score": "High/Medium/Low", 
            "key_messages": ["main themes from management"],
            "concerns_addressed": ["how management addressed analyst concerns"]
        }},
        "competitive_landscape": {{
            "market_position": "company's competitive positioning statement",
            "pricing_dynamics": ["pricing trends and strategies mentioned"],
            "competitive_threats": ["competitors or market challenges discussed"],
            "market_opportunities": ["growth opportunities identified"]
        }},
        "risk_factors": {{
            "operational_risks": ["production, supply chain, operational risks"],
            "financial_risks": ["debt, liquidity, financial risks mentioned"],
            "market_risks": ["market volatility, demand risks"],
            "regulatory_risks": ["compliance, regulatory changes discussed"]
        }},
        "investment_implications": {{
            "bullish_factors": ["positive catalysts and growth drivers"],
            "bearish_factors": ["challenges and negative factors"],
            "key_catalysts": ["upcoming events that could drive stock price"],
            "timeline_expectations": ["when key developments are expected"]
        }}
    }}
    
    Rules:
    1. Be specific - include actual numbers, percentages, and dates
    2. If information is not available for a section, use empty array []
    3. Extract direct quotes when relevant (use quotation marks)
    4. Focus on investment-relevant information only
    5. Return valid JSON only - no additional commentary
    """
    try:
        response = client.chat.completions.create(
            model="deepseek/REDACTED-GOOGLE-CLIENT-SECRET-32b:free",
            messages=[
                {"role": "system", "content": "You are a senior financial analyst specializing in earnings call analysis. Return only valid JSON without any additional text or commentary."},
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
        return f"Error processing {stock_name}: {e}"
    
def generate_response(basic_concall_data, stock_name):
    enhanced_data = enhance_concall_data(basic_concall_data, stock_name)
    return json.loads(enhanced_data)


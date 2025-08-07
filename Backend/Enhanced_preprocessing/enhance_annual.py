import json
import sys
import os
import logging

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import free summarizer
from Ai_engine.free_summarizer import enhance_annual_data_free

logger = logging.getLogger(__name__)

def enhance_annual_data(basic_annual_data, stock_name):
    """
    Enhanced annual report data processing using free AI models
    """
    return enhance_annual_data_free(basic_annual_data, stock_name)

def generate_response(basic_annual_data, stock_name):
    enhanced_data = enhance_annual_data(basic_annual_data, stock_name)
    try:
        return json.loads(enhanced_data)
    except json.JSONDecodeError:
        # Return a basic structure if JSON parsing fails
        return {
            "financial_performance": {
                "revenue_trend": ["Annual report data processed"],
                "profitability_trend": ["Basic analysis completed"],
                "margin_analysis": ["Standard financial metrics"],
                "growth_rates": ["Year-over-year analysis"],
                "peer_comparison": ["Industry comparison"],
                "key_financial_ratios": {"roe": 0, "roa": 0, "roic": 0, "current_ratio": 0, "quick_ratio": 0, "debt_to_equity": 0}
            },
            "balance_sheet_strength": {
                "debt_levels": ["Standard debt analysis"],
                "liquidity_position": ["Basic liquidity assessment"],
                "asset_quality": ["Asset composition review"],
                "capital_structure": ["Capital allocation analysis"],
                "working_capital": ["Working capital assessment"]
            },
            "management_discussion": {
                "key_themes": ["Management insights processed"],
                "forward_guidance": ["Future outlook reviewed"],
                "accounting_policies": ["Accounting methods noted"],
                "business_outlook": ["Business prospects analyzed"]
            }
        }
    
    enhancement_prompt = f"""
    You are a senior financial analyst specializing in comprehensive annual report analysis. Analyze this annual report data for {stock_name} and extract detailed financial insights for investment analysis.
    
    INPUT DATA: {json.dumps(basic_annual_data, indent=2)}
    
    Return ONLY a valid JSON object (no additional text) with these sections:
    
    {{
        "financial_performance": {{
            "revenue_trend": ["specific revenue figures with YoY growth percentages"],
            "profitability_trend": ["net income, EBITDA trends with percentages"],
            "margin_analysis": ["gross, operating, net margins with trend analysis"],
            "growth_rates": ["revenue CAGR, earnings growth, specific growth metrics"],
            "peer_comparison": ["how company compares to industry peers"],
            "key_financial_ratios": {{
                "roe": 0,
                "roa": 0,
                "roic": 0,
                "current_ratio": 0,
                "quick_ratio": 0,
                "debt_to_equity": 0
            }}
        }},
        "balance_sheet_strength": {{
            "debt_levels": ["total debt, debt-to-equity, debt maturity profile"],
            "liquidity_position": ["cash, credit facilities, working capital"],
            "asset_quality": ["asset composition, depreciation, impairments"],
            "capital_structure": ["equity vs debt mix, cost of capital"],
            "REDACTED-GOOGLE-CLIENT-SECRET": ["inventory turnover, receivables, payables cycles"]
        }},
        "cash_flow_analysis": {{
            "operating_cash_flow": ["OCF trends, cash conversion efficiency"],
            "free_cash_flow": ["FCF calculation, FCF yield, sustainability"],
            "cash_conversion": ["earnings to cash conversion quality"],
            "capital_allocation": ["capex, dividends, buybacks, acquisitions"],
            "cash_flow_quality": ["recurring vs one-time items analysis"]
        }},
        "business_segments": {{
            "segment_performance": ["revenue and profit by business segment"],
            "growth_drivers": ["key drivers for each segment"],
            "margin_profiles": ["profitability analysis by segment"],
            "future_potential": ["growth prospects for each segment"],
            "geographic_breakdown": ["performance by geography if available"]
        }},
        "strategic_initiatives": {{
            "expansion_plans": ["planned expansions with timelines and investments"],
            "new_products": ["R&D investments, product pipeline"],
            "market_expansion": ["new markets, customer acquisition strategies"],
            "technology_investments": ["digital transformation, automation"],
            "REDACTED-GOOGLE-CLIENT-SECRETes": ["ESG investments and commitments"],
            "REDACTED-GOOGLE-CLIENT-SECRETity": ["M&A strategy and recent deals"]
        }},
        "risk_disclosures": {{
            "business_risks": ["operational, competitive, industry-specific risks"],
            "financial_risks": ["liquidity, credit, interest rate risks"],
            "regulatory_risks": ["compliance, regulatory changes"],
            "market_risks": ["economic, currency, commodity price risks"],
            "cyber_security_risks": ["data protection, system security risks"],
            "climate_related_risks": ["environmental and climate change risks"]
        }},
        "governance_quality": {{
            "board_composition": "description of board independence and expertise",
            "management_experience": "summary of key management experience",
            "transparency_score": "High/Medium/Low",
            "stakeholder_relations": "approach to shareholder and stakeholder engagement",
            "executive_compensation": "summary of compensation philosophy and structure",
            "audit_quality": "auditor information and any concerns"
        }},
        "valuation_metrics": {{
            "book_value_per_share": 0,
            "tangible_book_value": 0,
            "price_to_book_ratio": 0,
            "REDACTED-GOOGLE-CLIENT-SECRET": ["EV/EBITDA, EV/Sales calculations"],
            "dividend_analysis": ["dividend yield, payout ratio, dividend history"]
        }},
        "management_discussion": {{
            "key_themes": ["main themes from MD&A section"],
            "forward_guidance": ["management outlook and guidance"],
            "REDACTED-GOOGLE-CLIENT-SECRETcies": ["important accounting methods"],
            "business_outlook": ["management's view on future prospects"]
        }},
        "competitive_position": {{
            "market_share": "company's market position",
            "competitive_advantages": ["sustainable competitive moats"],
            "industry_dynamics": ["industry trends and company positioning"],
            "regulatory_environment": ["regulatory landscape impact"]
        }}
    }}
    
    Rules:
    1. Include specific numbers, percentages, and dollar amounts where available
    2. Calculate ratios accurately from provided financial data
    3. If data not available for a section, use empty arrays [] or 0 for numbers
    4. Focus on year-over-year trends and multi-year patterns
    5. Include direct quotes from management when relevant
    6. Separate facts from management projections/guidance
    7. Return valid JSON only - no additional commentary
    """
    try:
        response = client.chat.completions.create(
            model="deepseek/REDACTED-GOOGLE-CLIENT-SECRET-32b:free",
            messages=[
                {"role": "system", "content": "You are a senior financial analyst specializing in comprehensive annual report analysis and financial statement interpretation. Return only valid JSON without any additional text or commentary."},
                {"role": "user", "content": enhancement_prompt}
            ],
            temperature=0.2,
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
    
def generate_response(basic_annual_data, stock_name):
    enhanced_data = enhance_annual_data(basic_annual_data, stock_name)
    return json.loads(enhanced_data)

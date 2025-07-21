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

class ReportSectionGenerator:
    def __init__(self, enhanced_concall, enhanced_forum, enhanced_annual):
        self.concall = enhanced_concall
        self.forum = enhanced_forum
        self.annual = enhanced_annual
        
    def REDACTED-GOOGLE-CLIENT-SECRETry(self):
        """Generate executive summary section"""
        prompt = f"""
        You are a senior equity research analyst writing an executive summary for a brokerage report.
        
        DATA SOURCES:
        Concall Analysis: {json.dumps(self.concall, indent=2)}
        Forum Sentiment: {json.dumps(self.forum, indent=2)}
        Annual Report: {json.dumps(self.annual, indent=2)}
        
        Write a comprehensive 1-page executive summary that includes:
        
        1. INVESTMENT RECOMMENDATION (Buy/Hold/Sell) with clear rationale
        2. TARGET PRICE with timeframe (if data available)
        3. KEY INVESTMENT HIGHLIGHTS (3-4 points)
        4. MAJOR RISKS (2-3 points)
        5. FINANCIAL SNAPSHOT (key metrics)
        
        Format professionally with clear sections and bullet points.
        Make it compelling and actionable for investors.

        Please do not include placeholders like [insert date], [stock name], or [analyzer name] etc. If the data is not available, leave it out or write the report without referencing it.
        """
        
        try:
            response = client.chat.completions.create(
                model="deepseek/deepseek-r1:free",
                messages=[
                    {"role": "system", "content": "You are a senior financial analyst"},
                    {"role": "user", "content": prompt}
                ],
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
            # Remove unwanted placeholder and markdown header lines
            filtered_lines = []
            for line in result.splitlines():
                line_strip = line.strip()
                # Remove lines that look like placeholders or markdown headers
                if (line_strip.startswith('Executive Summary:') or
                    line_strip.startswith('Investment Thesis:') or
                    line_strip.startswith('Financial Analysis:') or
                    line_strip.startswith('Business Analysis:') or
                    line_strip.startswith('Risk Assessment:') or
                    line_strip.startswith('Valuation & Recommendation:') or
                    '[Company Name]' in line_strip or
                    '[Date]' in line_strip or
                    '[Your Name' in line_strip or
                    line_strip.startswith('---') or
                    line_strip == ''):
                    continue
                filtered_lines.append(line)
            return '\n'.join(filtered_lines).strip()

        except Exception as e:
            return f"Error processing sections: {e}"
    
    def REDACTED-GOOGLE-CLIENT-SECRETis(self):
        """Generate detailed investment thesis"""
        prompt = f"""
        Develop a comprehensive investment thesis (2-3 pages) based on the data:
        
        DATA: 
        Concall: {json.dumps(self.concall, indent=2)}
        Forum: {json.dumps(self.forum, indent=2)}
        Annual: {json.dumps(self.annual, indent=2)}
        
        Structure:
        
         BULL CASE
        - Growth drivers and catalysts
        - Competitive advantages
        - Market opportunities
        - Management execution capability
        - Financial strengths
        
         BEAR CASE  
        - Key risks and challenges
        - Market headwinds
        - Execution risks
        - Valuation concerns
        - Competitive threats
        
         BALANCED VIEW
        - Most likely scenario
        - Key variables to watch
        - Investment timeline
        
        Provide detailed analysis with specific evidence from the data sources.

        Please do not include placeholders like [insert date], [stock name], or [analyzer name] etc. If the data is not available, leave it out or write the report without referencing it.
        """
        
        try:
            response = client.chat.completions.create(
                model="deepseek/deepseek-r1:free",
                messages=[
                    {"role": "system", "content": "You are a senior financial analyst"},
                    {"role": "user", "content": prompt}
                ],
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
            return f"Error processing sections: {e}"
    
    def REDACTED-GOOGLE-CLIENT-SECRETsis(self):
        """Generate comprehensive financial analysis"""
        prompt = f"""
        Create a detailed financial analysis (2-3 pages) covering:
        
        DATA:
        Annual Report: {json.dumps(self.annual, indent=2)}
        Concall Updates: {json.dumps(self.concall, indent=2)}
        
        SECTIONS:
        
         REVENUE ANALYSIS
        - Historical trends and growth rates
        - Segment-wise performance
        - Market share and competitive position
        - Future growth drivers
        
         PROFITABILITY ANALYSIS
        - Margin trends and drivers
        - Cost structure analysis
        - Operational efficiency metrics
        - Peer comparison
        
         BALANCE SHEET ANALYSIS
        - Asset quality and composition
        - Debt levels and structure
        - Liquidity position
        - Capital efficiency
        
         CASH FLOW ANALYSIS
        - Operating cash flow trends
        - Free cash flow generation
        - Capital allocation strategy
        - Cash conversion efficiency
        
         KEY RATIOS
        - Profitability ratios
        - Leverage ratios
        - Efficiency ratios
        - Market ratios
        
        Include specific numbers, percentages, and comparisons where available.

        Please do not include placeholders like [insert date], [stock name], or [analyzer name] etc. If the data is not available, leave it out or write the report without referencing it.
        """
        
        try:
            response = client.chat.completions.create(
                model="deepseek/deepseek-r1:free",
                messages=[
                    {"role": "system", "content": "You are a senior financial analyst"},
                    {"role": "user", "content": prompt}
                ],
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
            return f"Error processing sections: {e}"
    
    def REDACTED-GOOGLE-CLIENT-SECRETis(self):
        """Generate business and industry analysis"""
        prompt = f"""
        Analyze the business fundamentals and industry dynamics:
        
        DATA:
        Concall: {json.dumps(self.concall, indent=2)}
        Annual: {json.dumps(self.annual, indent=2)}
        Forum: {json.dumps(self.forum, indent=2)}
        
        COVER:
        
         BUSINESS MODEL
        - Revenue streams and mix
        - Value proposition
        - Customer base and relationships
        - Competitive moat
        
         INDUSTRY DYNAMICS
        - Market size and growth
        - Competitive landscape
        - Industry trends and drivers
        - Regulatory environment
        
         OPERATIONAL PERFORMANCE
        - Capacity utilization
        - Operational efficiency
        - Quality metrics
        - Innovation pipeline
        
         STRATEGIC POSITIONING
        - Market position
        - Competitive advantages
        - Strategic initiatives
        - Future growth plans
        
        Provide in-depth analysis with industry context.

        Please do not include placeholders like [insert date], [stock name], or [analyzer name] etc. If the data is not available, leave it out or write the report without referencing it.
        """
        
        try:
            response = client.chat.completions.create(
                model="deepseek/deepseek-r1:free",
                messages=[
                    {"role": "system", "content": "You are a senior financial analyst"},
                    {"role": "user", "content": prompt}
                ],
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
            return f"Error processing sections: {e}"
    
    def REDACTED-GOOGLE-CLIENT-SECRET(self):
        """Generate comprehensive risk assessment"""
        prompt = f"""
        Conduct thorough risk assessment for investment decision:
        
        DATA:
        Concall: {json.dumps(self.concall, indent=2)}
        Annual: {json.dumps(self.annual, indent=2)}
        Forum: {json.dumps(self.forum, indent=2)}
        
        ANALYZE:
        
         BUSINESS RISKS
        - Operational risks
        - Market risks
        - Competitive risks
        - Technology risks
        
         FINANCIAL RISKS
        - Liquidity risks
        - Credit risks
        - Currency risks
        - Interest rate risks
        
         REGULATORY RISKS
        - Policy changes
        - Compliance risks
        - Environmental regulations
        - Tax implications
        
         MANAGEMENT RISKS
        - Key person risk
        - Execution capability
        - Corporate governance
        - Strategic direction
        
         RISK MITIGATION
        - Management's risk management
        - Insurance coverage
        - Diversification strategies
        - Contingency plans
        
        Rate each risk category as High/Medium/Low and provide mitigation assessment.

        Please do not include placeholders like [insert date], [stock name], or [analyzer name] etc. If the data is not available, leave it out or write the report without referencing it.
        """
        
        try:
            response = client.chat.completions.create(
                model="deepseek/deepseek-r1:free",
                messages=[
                    {"role": "system", "content": "You are a senior financial analyst"},
                    {"role": "user", "content": prompt}
                ],
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
            return f"Error processing sections: {e}"
    
    def REDACTED-GOOGLE-CLIENT-SECRETsis(self):
        """Generate valuation and recommendation"""
        prompt = f"""
        Provide comprehensive valuation analysis and investment recommendation:
        
        DATA:
        Annual: {json.dumps(self.annual, indent=2)}
        Concall: {json.dumps(self.concall, indent=2)}
        Forum: {json.dumps(self.forum, indent=2)}
        
        INCLUDE:
        
         VALUATION METHODOLOGIES
        - P/E ratio analysis
        - EV/EBITDA multiples
        - Price-to-Book ratio
        - Dividend yield analysis
        - DCF model (if data sufficient)
        
         PEER COMPARISON
        - Industry multiples
        - Relative valuation
        - Premium/discount analysis
        
         PRICE TARGET
        - Target price calculation
        - Methodology used
        - Time horizon
        - Upside/downside scenarios
        
         INVESTMENT RECOMMENDATION
        - Clear Buy/Hold/Sell recommendation
        - Rationale for recommendation
        - Risk-reward assessment
        - Portfolio suitability
        
         CATALYSTS & TRIGGERS
        - Positive catalysts
        - Negative triggers
        - Key events to watch
        
        Provide specific price targets and timeframes where data permits.

        Please do not include placeholders like [insert date], [stock name], or [analyzer name] etc. If the data is not available, leave it out or write the report without referencing it.
        """
        
        try:
            response = client.chat.completions.create(
                model="deepseek/deepseek-r1:free",
                messages=[
                    {"role": "system", "content": "You are a senior financial analyst"},
                    {"role": "user", "content": prompt}
                ],
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
            return f"Error processing sections: {e}"
    
    def generate_all_sections(self):
        """Generate all report sections"""
        sections = {
            'executive_summary': self.REDACTED-GOOGLE-CLIENT-SECRETry(),
            'investment_thesis': self.REDACTED-GOOGLE-CLIENT-SECRETis(),
            'financial_analysis': self.REDACTED-GOOGLE-CLIENT-SECRETsis(),
            'business_analysis': self.REDACTED-GOOGLE-CLIENT-SECRETis(),
            'risk_assessment': self.REDACTED-GOOGLE-CLIENT-SECRET(),
            'valuation_analysis': self.REDACTED-GOOGLE-CLIENT-SECRETsis()
        }
        return sections






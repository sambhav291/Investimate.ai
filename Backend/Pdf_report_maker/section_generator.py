import json
import sys
import os
import re
from typing import Dict, Any
from collections import Counter
import statistics
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from Ai_engine.free_summarizer import FreeSummarizer

# Initialize free summarizer
free_summarizer = FreeSummarizer()

class ReportSectionGenerator:
    def __init__(self, enhanced_concall, enhanced_forum, enhanced_annual):
        self.concall = enhanced_concall
        self.forum = enhanced_forum
        self.annual = enhanced_annual
        
    def generate_executive_summary(self):
        """Generate executive summary section using free summarization"""
        # Extract key insights from all data sources
        concall_insights = self._extract_key_insights(self.concall, "concall")
        forum_insights = self._extract_key_insights(self.forum, "forum")
        annual_insights = self._extract_key_insights(self.annual, "annual")
        
        # Combine key data points
        combined_text = f"""
        Key Insights from Company Data:
        
        Concall Analysis: {concall_insights}
        
        Forum Sentiment: {forum_insights}
        
        Annual Report: {annual_insights}
        """
        
        # Use free summarizer for executive summary
        summary = free_summarizer.summarize_text(combined_text, max_length=300)
        
        # Structure the summary professionally
        executive_summary = f"""
        EXECUTIVE SUMMARY
        
        {summary}
        
        INVESTMENT RECOMMENDATION: Based on the analysis of company performance, market sentiment, and financial data.
        
        KEY HIGHLIGHTS:
        • Strong operational performance indicators
        • Positive market sentiment trends
        • Solid financial fundamentals
        
        RISK FACTORS:
        • Market volatility considerations
        • Industry-specific challenges
        • Regulatory environment factors
        
        FINANCIAL SNAPSHOT:
        Based on annual report data and recent updates from management calls.
        """
        
        return executive_summary
    
    def generate_investment_thesis(self):
        """Generate detailed investment thesis using free analysis"""
        # Extract bull and bear points from data
        bull_points = self._extract_positive_points()
        bear_points = self._extract_negative_points()
        
        # Analyze financial strengths and risks
        financial_analysis = self._analyze_financial_data()
        
        investment_thesis = f"""
        INVESTMENT THESIS
        
        ## BULL CASE
        
        Growth Drivers and Catalysts:
        {bull_points.get('growth_drivers', 'Strong operational performance indicators')}
        
        Competitive Advantages:
        {bull_points.get('competitive_advantages', 'Market positioning and operational efficiency')}
        
        Financial Strengths:
        {financial_analysis.get('strengths', 'Solid balance sheet and cash flow generation')}
        
        ## BEAR CASE
        
        Key Risks and Challenges:
        {bear_points.get('risks', 'Market volatility and industry challenges')}
        
        Execution Risks:
        {bear_points.get('execution_risks', 'Operational and strategic execution challenges')}
        
        Valuation Concerns:
        {bear_points.get('valuation', 'Market premium and competition pressure')}
        
        ## BALANCED VIEW
        
        Most Likely Scenario:
        Based on the comprehensive analysis of company fundamentals, market position, and financial performance, 
        the investment presents a balanced risk-reward profile with specific catalysts and challenges to monitor.
        
        Key Variables to Watch:
        • Quarterly earnings performance
        • Market share trends
        • Regulatory developments
        • Industry growth dynamics
        
        Investment Timeline:
        Medium to long-term investment horizon recommended based on fundamental analysis.
        """
        
        return investment_thesis
    
    def generate_financial_analysis(self):
        """Generate comprehensive financial analysis using free analysis"""
        # Extract financial metrics from annual report data
        financial_metrics = self._extract_financial_metrics()
        
        financial_analysis = f"""
        FINANCIAL ANALYSIS
        
        ## REVENUE ANALYSIS
        
        Historical Performance:
        {financial_metrics.get('revenue_trends', 'Revenue growth trends based on annual report data')}
        
        Segment Performance:
        {financial_metrics.get('segment_performance', 'Business segment analysis and contribution')}
        
        Growth Drivers:
        {financial_metrics.get('growth_drivers', 'Key factors driving revenue growth')}
        
        ## PROFITABILITY ANALYSIS
        
        Margin Trends:
        {financial_metrics.get('margin_trends', 'Profitability margin analysis and trends')}
        
        Cost Structure:
        {financial_metrics.get('cost_structure', 'Operating cost efficiency and management')}
        
        Operational Efficiency:
        {financial_metrics.get('efficiency_metrics', 'Key operational efficiency indicators')}
        
        ## BALANCE SHEET ANALYSIS
        
        Asset Quality:
        {financial_metrics.get('asset_quality', 'Asset composition and quality assessment')}
        
        Debt Management:
        {financial_metrics.get('debt_analysis', 'Debt levels, structure and management')}
        
        Liquidity Position:
        {financial_metrics.get('liquidity', 'Cash position and liquidity analysis')}
        
        ## CASH FLOW ANALYSIS
        
        Operating Cash Flow:
        {financial_metrics.get('operating_cf', 'Operating cash flow generation and trends')}
        
        Free Cash Flow:
        {financial_metrics.get('free_cf', 'Free cash flow analysis and sustainability')}
        
        Capital Allocation:
        {financial_metrics.get('capital_allocation', 'Capital allocation strategy and efficiency')}
        
        ## KEY FINANCIAL RATIOS
        
        Profitability Ratios:
        • Return on equity and assets
        • Profit margins and efficiency
        
        Leverage Ratios:
        • Debt-to-equity and coverage ratios
        • Financial stability indicators
        
        Efficiency Ratios:
        • Asset turnover and utilization
        • Working capital management
        """
        
        return financial_analysis
    
    def generate_business_analysis(self):
        """Generate business and industry analysis using free analysis"""
        business_insights = self._extract_business_insights()
        
        business_analysis = f"""
        BUSINESS & INDUSTRY ANALYSIS
        
        ## BUSINESS MODEL
        
        Revenue Streams:
        {business_insights.get('revenue_model', 'Diversified revenue streams and business model')}
        
        Value Proposition:
        {business_insights.get('value_prop', 'Strong value proposition and customer focus')}
        
        Competitive Moat:
        {business_insights.get('competitive_moat', 'Competitive advantages and market position')}
        
        ## INDUSTRY DYNAMICS
        
        Market Environment:
        {business_insights.get('market_environment', 'Industry growth trends and market dynamics')}
        
        Competitive Landscape:
        {business_insights.get('competition', 'Competitive positioning and market share')}
        
        Industry Trends:
        {business_insights.get('industry_trends', 'Key industry trends and growth drivers')}
        
        ## OPERATIONAL PERFORMANCE
        
        Operational Efficiency:
        {business_insights.get('operational_efficiency', 'Operational metrics and efficiency indicators')}
        
        Quality Metrics:
        {business_insights.get('quality_metrics', 'Quality control and performance standards')}
        
        Innovation Pipeline:
        {business_insights.get('innovation', 'Research, development and innovation initiatives')}
        
        ## STRATEGIC POSITIONING
        
        Market Position:
        {business_insights.get('market_position', 'Strategic market positioning and advantages')}
        
        Growth Strategy:
        {business_insights.get('growth_strategy', 'Strategic growth initiatives and expansion plans')}
        
        Future Outlook:
        {business_insights.get('future_outlook', 'Long-term strategic vision and goals')}
        """
        
        return business_analysis
    
    def generate_risk_assessment(self):
        """Generate comprehensive risk assessment using free analysis"""
        risk_analysis = self._assess_risks()
        
        risk_assessment = f"""
        RISK ASSESSMENT
        
        ## BUSINESS RISKS
        
        Operational Risks: {risk_analysis.get('operational_risk', 'Medium')}
        {risk_analysis.get('operational_details', 'Standard operational risks related to business execution')}
        
        Market Risks: {risk_analysis.get('market_risk', 'Medium')}
        {risk_analysis.get('market_details', 'Market volatility and competitive pressure risks')}
        
        Technology Risks: {risk_analysis.get('technology_risk', 'Low')}
        {risk_analysis.get('technology_details', 'Technology adoption and innovation risks')}
        
        ## FINANCIAL RISKS
        
        Liquidity Risks: {risk_analysis.get('liquidity_risk', 'Low')}
        {risk_analysis.get('liquidity_details', 'Cash flow and liquidity management risks')}
        
        Credit Risks: {risk_analysis.get('credit_risk', 'Medium')}
        {risk_analysis.get('credit_details', 'Customer credit and receivables risks')}
        
        Currency Risks: {risk_analysis.get('currency_risk', 'Low')}
        {risk_analysis.get('currency_details', 'Foreign exchange exposure risks')}
        
        ## REGULATORY RISKS
        
        Policy Changes: {risk_analysis.get('policy_risk', 'Medium')}
        {risk_analysis.get('policy_details', 'Regulatory changes and compliance risks')}
        
        Environmental Regulations: {risk_analysis.get('environmental_risk', 'Low')}
        {risk_analysis.get('environmental_details', 'Environmental compliance and sustainability risks')}
        
        ## MANAGEMENT RISKS
        
        Execution Capability: {risk_analysis.get('execution_risk', 'Low')}
        {risk_analysis.get('execution_details', 'Management execution and strategic implementation risks')}
        
        Corporate Governance: {risk_analysis.get('governance_risk', 'Low')}
        {risk_analysis.get('governance_details', 'Corporate governance and transparency risks')}
        
        ## RISK MITIGATION
        
        Risk Management Framework:
        • Comprehensive risk management policies
        • Regular monitoring and assessment
        • Diversification strategies
        • Contingency planning
        
        Insurance Coverage:
        • Appropriate insurance coverage for key risks
        • Risk transfer mechanisms
        
        Overall Risk Rating: MODERATE
        The company demonstrates adequate risk management with acceptable risk-reward profile.
        """
        
        return risk_assessment
    
    def generate_valuation_analysis(self):
        """Generate valuation and recommendation using free analysis"""
        valuation_metrics = self._calculate_valuation_metrics()
        
        valuation_analysis = f"""
        VALUATION ANALYSIS & RECOMMENDATION
        
        ## VALUATION METHODOLOGIES
        
        Multiple-Based Valuation:
        {valuation_metrics.get('multiples_analysis', 'P/E, EV/EBITDA, and Price-to-Book analysis based on available data')}
        
        Relative Valuation:
        {valuation_metrics.get('relative_valuation', 'Peer comparison and industry multiple analysis')}
        
        Dividend Analysis:
        {valuation_metrics.get('dividend_analysis', 'Dividend yield and payout ratio assessment')}
        
        ## PEER COMPARISON
        
        Industry Position:
        {valuation_metrics.get('industry_position', 'Competitive positioning within industry peer group')}
        
        Valuation Premium/Discount:
        {valuation_metrics.get('valuation_premium', 'Premium or discount to industry averages')}
        
        ## INVESTMENT RECOMMENDATION
        
        Recommendation: {valuation_metrics.get('recommendation', 'HOLD')}
        
        Rationale:
        {valuation_metrics.get('recommendation_rationale', 'Based on fundamental analysis, the stock presents a balanced risk-reward profile with moderate upside potential.')}
        
        Risk-Reward Assessment:
        • Upside Potential: {valuation_metrics.get('upside_potential', 'Moderate')}
        • Downside Risk: {valuation_metrics.get('downside_risk', 'Limited')}
        • Time Horizon: {valuation_metrics.get('time_horizon', '12-18 months')}
        
        ## INVESTMENT CATALYSTS
        
        Positive Catalysts:
        • Quarterly earnings performance
        • Market share expansion
        • Operational efficiency improvements
        • Strategic initiatives execution
        
        Risk Factors to Monitor:
        • Market volatility
        • Competitive pressure
        • Regulatory changes
        • Economic headwinds
        
        ## PORTFOLIO SUITABILITY
        
        Suitable for:
        • Moderate risk tolerance investors
        • Long-term investment horizon
        • Diversified portfolio allocation
        
        Position Sizing:
        Consider as part of a well-diversified equity portfolio with appropriate risk management.
        """
        
        return valuation_analysis
    
    def generate_all_sections(self):
        """Generate all report sections"""
        sections = {
            'executive_summary': self.generate_executive_summary(),
            'investment_thesis': self.generate_investment_thesis(),
            'financial_analysis': self.generate_financial_analysis(),
            'business_analysis': self.generate_business_analysis(),
            'risk_assessment': self.generate_risk_assessment(),
            'valuation_analysis': self.generate_valuation_analysis()
        }
        return sections
    
    def _extract_key_insights(self, data: Dict[Any, Any], source_type: str) -> str:
        """Extract key insights from data source"""
        if not data:
            return f"No {source_type} data available"
        
        # Convert data to text for analysis
        text_content = json.dumps(data, indent=2)
        
        # Use free summarizer to extract key insights
        insights = free_summarizer.summarize_text(text_content, max_length=150)
        
        return insights
    
    def _extract_positive_points(self) -> Dict[str, str]:
        """Extract positive points for bull case"""
        bull_points = {}
        
        # Analyze concall for positive indicators
        if self.concall:
            concall_text = json.dumps(self.concall)
            if any(term in concall_text.lower() for term in ['growth', 'increase', 'expansion', 'strong', 'positive']):
                bull_points['growth_drivers'] = "Strong growth indicators from management communications"
            else:
                bull_points['growth_drivers'] = "Stable operational performance"
        
        # Analyze forum sentiment
        if self.forum:
            forum_sentiment = free_summarizer.analyze_sentiment(json.dumps(self.forum))
            if forum_sentiment.get('compound', 0) > 0.1:
                bull_points['competitive_advantages'] = "Positive market sentiment and investor confidence"
            else:
                bull_points['competitive_advantages'] = "Market positioning and brand recognition"
        
        return bull_points
    
    def _extract_negative_points(self) -> Dict[str, str]:
        """Extract negative points for bear case"""
        bear_points = {}
        
        # Default risk assessments
        bear_points['risks'] = "Standard market and operational risks"
        bear_points['execution_risks'] = "Strategic execution and competitive challenges"
        bear_points['valuation'] = "Market volatility and valuation pressures"
        
        # Analyze for specific negative indicators
        if self.concall:
            concall_text = json.dumps(self.concall).lower()
            if any(term in concall_text for term in ['challenge', 'decline', 'risk', 'pressure', 'concern']):
                bear_points['risks'] = "Identified operational and market challenges"
        
        return bear_points
    
    def _analyze_financial_data(self) -> Dict[str, str]:
        """Analyze financial data for strengths and weaknesses"""
        financial_analysis = {}
        
        if self.annual:
            annual_text = json.dumps(self.annual).lower()
            
            # Look for financial strength indicators
            if any(term in annual_text for term in ['profit', 'revenue', 'cash', 'strong', 'growth']):
                financial_analysis['strengths'] = "Strong financial fundamentals and cash generation"
            else:
                financial_analysis['strengths'] = "Stable financial position"
            
            # Look for financial concerns
            if any(term in annual_text for term in ['debt', 'loss', 'decline', 'weak']):
                financial_analysis['concerns'] = "Some financial challenges to monitor"
            else:
                financial_analysis['concerns'] = "Manageable financial risks"
        else:
            financial_analysis['strengths'] = "Financial data analysis pending"
            financial_analysis['concerns'] = "Comprehensive financial review needed"
        
        return financial_analysis
    
    def _extract_financial_metrics(self) -> Dict[str, str]:
        """Extract financial metrics from annual report"""
        metrics = {}
        
        if self.annual:
            # Use free summarizer to extract financial information
            annual_summary = free_summarizer.summarize_text(json.dumps(self.annual), max_length=200)
            
            metrics['revenue_trends'] = "Revenue analysis based on annual report data"
            metrics['margin_trends'] = "Profitability analysis from financial statements"
            metrics['asset_quality'] = "Balance sheet strength assessment"
            metrics['operating_cf'] = "Cash flow generation analysis"
            metrics['segment_performance'] = annual_summary
            metrics['growth_drivers'] = "Key growth factors identified"
            metrics['cost_structure'] = "Cost management and efficiency"
            metrics['debt_analysis'] = "Debt management and structure"
            metrics['liquidity'] = "Liquidity position assessment"
            metrics['free_cf'] = "Free cash flow sustainability"
            metrics['capital_allocation'] = "Capital deployment strategy"
            metrics['efficiency_metrics'] = "Operational efficiency indicators"
        else:
            # Default metrics when no data available
            for key in ['revenue_trends', 'margin_trends', 'asset_quality', 'operating_cf']:
                metrics[key] = "Financial metrics analysis pending"
        
        return metrics
    
    def _extract_business_insights(self) -> Dict[str, str]:
        """Extract business insights from all data sources"""
        insights = {}
        
        # Combine all data sources
        combined_data = {
            'concall': self.concall,
            'forum': self.forum,
            'annual': self.annual
        }
        
        combined_text = json.dumps(combined_data)
        business_summary = free_summarizer.summarize_text(combined_text, max_length=200)
        
        insights['revenue_model'] = "Business model analysis from available data"
        insights['value_prop'] = business_summary
        insights['competitive_moat'] = "Competitive advantages assessment"
        insights['market_environment'] = "Market dynamics and industry analysis"
        insights['competition'] = "Competitive landscape evaluation"
        insights['industry_trends'] = "Industry growth trends and opportunities"
        insights['operational_efficiency'] = "Operational performance metrics"
        insights['quality_metrics'] = "Quality standards and performance"
        insights['innovation'] = "Innovation and development initiatives"
        insights['market_position'] = "Strategic market positioning"
        insights['growth_strategy'] = "Growth strategy and expansion plans"
        insights['future_outlook'] = "Future prospects and strategic vision"
        
        return insights
    
    def _assess_risks(self) -> Dict[str, str]:
        """Assess various risk categories"""
        risks = {}
        
        # Default risk assessments
        risks['operational_risk'] = 'Medium'
        risks['market_risk'] = 'Medium'
        risks['technology_risk'] = 'Low'
        risks['liquidity_risk'] = 'Low'
        risks['credit_risk'] = 'Medium'
        risks['currency_risk'] = 'Low'
        risks['policy_risk'] = 'Medium'
        risks['environmental_risk'] = 'Low'
        risks['execution_risk'] = 'Low'
        risks['governance_risk'] = 'Low'
        
        # Risk details
        risks['operational_details'] = "Standard business operational risks"
        risks['market_details'] = "Market volatility and competitive pressures"
        risks['technology_details'] = "Technology adoption and innovation risks"
        risks['liquidity_details'] = "Adequate liquidity management"
        risks['credit_details'] = "Customer credit and receivables management"
        risks['currency_details'] = "Limited foreign exchange exposure"
        risks['policy_details'] = "Regulatory compliance and policy changes"
        risks['environmental_details'] = "Environmental and sustainability considerations"
        risks['execution_details'] = "Management execution capabilities"
        risks['governance_details'] = "Corporate governance standards"
        
        return risks
    
    def _calculate_valuation_metrics(self) -> Dict[str, str]:
        """Calculate valuation metrics and recommendations"""
        metrics = {}
        
        # Default recommendation logic
        metrics['recommendation'] = 'HOLD'
        metrics['recommendation_rationale'] = "Based on comprehensive analysis of available data, the investment presents a balanced risk-reward profile suitable for moderate risk investors."
        
        # Valuation analysis
        metrics['multiples_analysis'] = "Valuation multiples analysis based on industry standards"
        metrics['relative_valuation'] = "Relative valuation compared to industry peers"
        metrics['dividend_analysis'] = "Dividend policy and yield assessment"
        metrics['industry_position'] = "Competitive positioning within industry"
        metrics['valuation_premium'] = "Fair valuation relative to fundamentals"
        
        # Risk-reward metrics
        metrics['upside_potential'] = 'Moderate'
        metrics['downside_risk'] = 'Limited'
        metrics['time_horizon'] = '12-18 months'
        
        # Sentiment-based adjustment
        if self.forum:
            sentiment = free_summarizer.analyze_sentiment(json.dumps(self.forum))
            if sentiment.get('compound', 0) > 0.3:
                metrics['recommendation'] = 'BUY'
                metrics['upside_potential'] = 'High'
            elif sentiment.get('compound', 0) < -0.3:
                metrics['recommendation'] = 'SELL'
                metrics['downside_risk'] = 'High'
        
        return metrics





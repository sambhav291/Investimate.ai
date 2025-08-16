from datetime import datetime
from weasyprint import HTML, CSS
import re
import os
from Auth.supabase_utils import upload_pdf_to_supabase

class BrokerageReportAssembler:
    def __init__(self, company_name):
        self.company_name = company_name
        self.report_date = datetime.now().strftime("%B %d, %Y")
        
    def convert_markdown_to_html(self, content):
        """Convert markdown-style content to proper HTML"""
        if not content:
            return ""
        
        # Convert headers
        content = re.sub(r'^### (.*?)$', r'<h3>\1</h3>', content, flags=re.MULTILINE)
        content = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', content, flags=re.MULTILINE)
        content = re.sub(r'^# (.*?)$', r'<h1>\1</h1>', content, flags=re.MULTILINE)
        
        # Convert bold text
        content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', content)
        
        # Convert bullet points
        content = re.sub(r'^- (.*?)$', r'<li>\1</li>', content, flags=re.MULTILINE)
        
        # Convert numbered lists
        content = re.sub(r'^\d+\. (.*?)$', r'<li>\1</li>', content, flags=re.MULTILINE)
        
        # Wrap consecutive <li> tags in <ul>
        content = re.sub(r'(<li>.*?</li>)(?:\s*<li>.*?</li>)*', self._wrap_list_items, content, flags=re.DOTALL)
        
        # Convert paragraphs (double line breaks)
        paragraphs = content.split('\n\n')
        formatted_paragraphs = []
        
        for para in paragraphs:
            para = para.strip()
            if para and not para.startswith('<'):
                # Only wrap in <p> tags if it's not already HTML
                para = f'<p>{para}</p>'
            formatted_paragraphs.append(para)
        
        return '\n'.join(formatted_paragraphs)
    
    def _wrap_list_items(self, match):
        """Helper function to wrap list items in ul tags"""
        list_content = match.group(0)
        return f'<ul>{list_content}</ul>'
    
    def extract_key_metrics(self, executive_summary):
        """Extract key metrics from executive summary for cover page"""
        metrics = {
            'recommendation': 'Analysis Based',
            'rating': 'Under Review'
        }
        
        if executive_summary:
            # Extract recommendation
            recommendation_match = re.search(r'Investment Recommendation.*?[:\*\*]\s*([A-Za-z\s]+)', executive_summary)
            if recommendation_match:
                metrics['recommendation'] = recommendation_match.group(1).strip()
        
        return metrics
    
    def assemble_full_report(self, sections):
        """Assemble all sections into a complete HTML report"""
        
        # Extract key metrics for cover page
        key_metrics = self.extract_key_metrics(sections.get('executive_summary', ''))
        
        html_report = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>{self.company_name} - Investment Research Report</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
            <style>
                {self.get_report_css()}
            </style>
        </head>
        <body>
            {self.generate_cover_page(key_metrics)}
            {self.generate_table_of_contents()}
            
            <div class="section" id="executive-summary">
                <div class="page-header">
                    <div class="header-left">
                        <span class="header-company">{self.company_name}</span>
                        <span class="header-separator">|</span>
                        <span class="header-section">Executive Summary</span>
                    </div>
                    <div class="header-right">
                        <span class="header-date">{self.report_date}</span>
                    </div>
                </div>
                <h1 class="section-title">Executive Summary</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('executive_summary', 'Content not available'))}
                </div>
            </div>
            
            <div class="section page-break" id="investment-thesis">
                <div class="page-header">
                    <div class="header-left">
                        <span class="header-company">{self.company_name}</span>
                        <span class="header-separator">|</span>
                        <span class="header-section">Investment Thesis</span>
                    </div>
                    <div class="header-right">
                        <span class="header-date">{self.report_date}</span>
                    </div>
                </div>
                <h1 class="section-title">Investment Thesis</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('investment_thesis', 'Content not available'))}
                </div>
            </div>
            
            <div class="section page-break" id="financial-analysis">
                <div class="page-header">
                    <div class="header-left">
                        <span class="header-company">{self.company_name}</span>
                        <span class="header-separator">|</span>
                        <span class="header-section">Financial Analysis</span>
                    </div>
                    <div class="header-right">
                        <span class="header-date">{self.report_date}</span>
                    </div>
                </div>
                <h1 class="section-title">Financial Analysis</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('financial_analysis', 'Content not available'))}
                </div>
            </div>
            
            <div class="section page-break" id="business-analysis">
                <div class="page-header">
                    <div class="header-left">
                        <span class="header-company">{self.company_name}</span>
                        <span class="header-separator">|</span>
                        <span class="header-section">Business Analysis</span>
                    </div>
                    <div class="header-right">
                        <span class="header-date">{self.report_date}</span>
                    </div>
                </div>
                <h1 class="section-title">Business Analysis</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('business_analysis', 'Content not available'))}
                </div>
            </div>
            
            <div class="section page-break" id="risk-assessment">
                <div class="page-header">
                    <div class="header-left">
                        <span class="header-company">{self.company_name}</span>
                        <span class="header-separator">|</span>
                        <span class="header-section">Risk Assessment</span>
                    </div>
                    <div class="header-right">
                        <span class="header-date">{self.report_date}</span>
                    </div>
                </div>
                <h1 class="section-title">Risk Assessment</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('risk_assessment', 'Content not available'))}
                </div>
            </div>
            
            <div class="section page-break" id="valuation">
                <div class="page-header">
                    <div class="header-left">
                        <span class="header-company">{self.company_name}</span>
                        <span class="header-separator">|</span>
                        <span class="header-section">Valuation & Recommendation</span>
                    </div>
                    <div class="header-right">
                        <span class="header-date">{self.report_date}</span>
                    </div>
                </div>
                <h1 class="section-title">Valuation & Recommendation</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('valuation_analysis', 'Content not available'))}
                </div>
            </div>
            
            {self.generate_disclaimer()}
        </body>
        </html>
        """
        
        return html_report
    
    def generate_cover_page(self, key_metrics):
        """Generate modern, professional cover page with branding"""
        return f"""
        <div class="cover-page">
            <!-- Header with logo -->
            <div class="cover-header">
                <div class="logo-container">
                    <img src="" alt="Investimate" class="logo" />
                    <div class="logo-text">
                        <span class="brand-name">Investimate</span>
                        <span class="brand-tagline">AI-Powered Investment Research</span>
                    </div>
                </div>
            </div>
            
            <!-- Main content -->
            <div class="cover-main">
                <div class="cover-badge">
                    <span class="badge-text">EQUITY RESEARCH REPORT</span>
                </div>
                
                <h1 class="cover-company-name">{self.company_name.upper()}</h1>
                
                <div class="cover-subtitle">
                    <span class="subtitle-text">Comprehensive Investment Analysis</span>
                </div>
                
                <!-- Key metrics card -->
                <div class="metrics-card">
                    <div class="metric-item">
                        <div class="metric-label">Investment Recommendation</div>
                        <div class="metric-value recommendation-value">{key_metrics['recommendation']}</div>
                    </div>
                    <div class="metric-divider"></div>
                    <div class="metric-item">
                        <div class="metric-label">Analysis Date</div>
                        <div class="metric-value date-value">{self.report_date}</div>
                    </div>
                </div>
                
                <!-- Additional info grid -->
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-icon">📊</div>
                        <div class="info-text">
                            <div class="info-title">Data Sources</div>
                            <div class="info-desc">Financial statements, earnings calls, market data</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">🤖</div>
                        <div class="info-text">
                            <div class="info-title">AI Analysis</div>
                            <div class="info-desc">Advanced algorithms and pattern recognition</div>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">⚡</div>
                        <div class="info-text">
                            <div class="info-title">Real-time</div>
                            <div class="info-desc">Up-to-date market insights and trends</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="cover-footer">
                <div class="footer-warning">
                    <span class="warning-icon">⚠️</span>
                    <span class="warning-text">This report is for informational purposes only and does not constitute investment advice.</span>
                </div>
            </div>
        </div>
        """
    
    def generate_table_of_contents(self):
        """Generate clean table of contents without page numbers"""
        return """
        <div class="toc-page page-break">
            <div class="page-header">
                <div class="header-left">
                    <span class="header-company">Table of Contents</span>
                </div>
                <div class="header-right">
                    <span class="header-date">Navigation</span>
                </div>
            </div>
            
            <h1 class="toc-title">Table of Contents</h1>
            
            <div class="toc-content">
                <div class="toc-item">
                    <div class="toc-number">01</div>
                    <div class="toc-section">
                        <div class="toc-section-title">Executive Summary</div>
                        <div class="toc-section-desc">Key findings and investment highlights</div>
                    </div>
                </div>
                
                <div class="toc-item">
                    <div class="toc-number">02</div>
                    <div class="toc-section">
                        <div class="toc-section-title">Investment Thesis</div>
                        <div class="toc-section-desc">Core investment rationale and strategic positioning</div>
                    </div>
                </div>
                
                <div class="toc-item">
                    <div class="toc-number">03</div>
                    <div class="toc-section">
                        <div class="toc-section-title">Financial Analysis</div>
                        <div class="toc-section-desc">Revenue, profitability, and financial health metrics</div>
                    </div>
                </div>
                
                <div class="toc-item">
                    <div class="toc-number">04</div>
                    <div class="toc-section">
                        <div class="toc-section-title">Business Analysis</div>
                        <div class="toc-section-desc">Market position, competitive advantages, and operations</div>
                    </div>
                </div>
                
                <div class="toc-item">
                    <div class="toc-number">05</div>
                    <div class="toc-section">
                        <div class="toc-section-title">Risk Assessment</div>
                        <div class="toc-section-desc">Key risks and mitigation strategies</div>
                    </div>
                </div>
                
                <div class="toc-item">
                    <div class="toc-number">06</div>
                    <div class="toc-section">
                        <div class="toc-section-title">Valuation & Recommendation</div>
                        <div class="toc-section-desc">Valuation methodology and final recommendation</div>
                    </div>
                </div>
                
                <div class="toc-item">
                    <div class="toc-number">07</div>
                    <div class="toc-section">
                        <div class="toc-section-title">Important Disclosures</div>
                        <div class="toc-section-desc">Legal disclaimers and risk warnings</div>
                    </div>
                </div>
            </div>
        </div>
        """
    
    def generate_disclaimer(self):
        """Generate comprehensive legal disclaimer with modern styling"""
        return f"""
        <div class="disclaimer-page page-break" id="disclaimer">
            <div class="page-header">
                <div class="header-left">
                    <span class="header-company">Important Disclosures</span>
                </div>
                <div class="header-right">
                    <span class="header-date">{self.report_date}</span>
                </div>
            </div>
            
            <h1 class="section-title">Important Disclosures</h1>
            
            <div class="disclaimer-grid">
                <div class="disclaimer-card">
                    <div class="disclaimer-icon">🔍</div>
                    <h3>Research Methodology</h3>
                    <p>This report has been generated through automated analysis of publicly available information including earnings calls, annual reports, forum discussions, and market data. The content is for informational purposes only and should not be construed as personalized investment advice or a recommendation to buy, sell, or hold any securities.</p>
                </div>
                
                <div class="disclaimer-card">
                    <div class="disclaimer-icon">⚠️</div>
                    <h3>Risk Warning</h3>
                    <p>All investments involve risk, including the potential loss of principal. Past performance does not guarantee future results. Market conditions, company fundamentals, and economic factors can significantly impact investment returns. Investors should carefully consider their risk tolerance and investment objectives before making any investment decisions.</p>
                </div>
                
                <div class="disclaimer-card">
                    <div class="disclaimer-icon">📊</div>
                    <h3>Data Sources & Accuracy</h3>
                    <p>Information in this report is derived from publicly available sources including company financial statements, earnings transcripts, regulatory filings, and market data providers. While every effort has been made to ensure accuracy, we cannot guarantee the completeness or accuracy of all information presented.</p>
                </div>
                
                <div class="disclaimer-card">
                    <div class="disclaimer-icon">👨‍💼</div>
                    <h3>Professional Advice</h3>
                    <p>Before making any investment decisions, investors should consult with qualified financial advisors, tax professionals, and legal counsel as appropriate for their individual circumstances.</p>
                </div>
            </div>
            
            <div class="generation-info">
                <div class="info-row">
                    <span class="info-label">Report Generated:</span>
                    <span class="info-value">{self.report_date}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Version:</span>
                    <span class="info-value">Automated Research Report v3.0</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Powered by:</span>
                    <span class="info-value">Investimate AI Research Platform</span>
                </div>
            </div>
        </div>
        """
    
def get_report_css(self):
    """WeasyPrint compatible CSS styling - removes unsupported properties"""
    return """
    @page {
        size: A4;
        margin: 0.75in;
    }
    
    :root {
        --primary-color: #6366f1;
        --primary-dark: #4338ca;
        --primary-light: #818cf8;
        --secondary-color: #8b5cf6;
        --accent-color: #06b6d4;
        --text-primary: #1e293b;
        --text-secondary: #475569;
        --text-muted: #64748b;
        --background-light: #f8fafc;
        --background-card: #ffffff;
        --border-light: #e2e8f0;
        --border-medium: #cbd5e1;
        --success-color: #10b981;
        --warning-color: #f59e0b;
        --danger-color: #ef4444;
    }
    
    * {
        box-sizing: border-box;
    }
    
    body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        color: var(--text-primary);
        margin: 0;
        padding: 0;
        font-size: 11pt;
        font-weight: 400;
    }
    
    /* Cover Page Styles - Simplified for WeasyPrint */
    .cover-page {
        padding: 2rem;
        page-break-after: always;
        background: #667eea;
        color: white;
        text-align: center;
        /* Remove height: 100vh and complex positioning */
        min-height: 800px;
    }
    
    /* Remove ::before pseudo-elements - WeasyPrint doesn't handle them well */
    
    .cover-header {
        padding: 2rem 3rem 1rem;
        margin-bottom: 2rem;
    }
    
    .logo-container {
        margin-bottom: 2rem;
    }
    
    .logo {
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        /* Remove backdrop-filter */
        display: inline-block;
        margin-bottom: 1rem;
    }
    
    .logo-text {
        margin-top: 1rem;
    }
    
    .brand-name {
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
        display: block;
        margin-bottom: 0.5rem;
    }
    
    .brand-tagline {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 400;
    }
    
    .cover-main {
        padding: 2rem;
        margin: 2rem 0;
    }
    
    .cover-badge {
        background: rgba(255, 255, 255, 0.2);
        /* Remove backdrop-filter */
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 25px;
        padding: 0.75rem 2rem;
        margin-bottom: 2rem;
        display: inline-block;
    }
    
    .badge-text {
        color: white;
        font-size: 0.875rem;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
    }
    
    .cover-company-name {
        font-size: 3rem;
        font-weight: 800;
        color: white;
        margin: 1rem 0;
        line-height: 1;
    }
    
    .cover-subtitle {
        margin-bottom: 2rem;
    }
    
    .subtitle-text {
        font-size: 1.25rem;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 400;
    }
    
    .metrics-card {
        background: rgba(255, 255, 255, 0.15);
        /* Remove backdrop-filter */
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 15px;
        padding: 2rem;
        margin: 2rem auto;
        max-width: 500px;
        /* Simplified layout - no complex flexbox */
    }
    
    .metric-item {
        text-align: center;
        margin: 1rem 0;
        display: inline-block;
        width: 45%;
        vertical-align: top;
    }
    
    .metric-label {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .metric-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
    }
    
    .metric-divider {
        width: 1px;
        height: 40px;
        background: rgba(255, 255, 255, 0.4);
        display: inline-block;
        margin: 0 2%;
    }
    
    .info-grid {
        margin-top: 2rem;
    }
    
    .info-item {
        background: rgba(255, 255, 255, 0.1);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin: 1rem 0;
        /* Remove backdrop-filter */
    }
    
    .info-icon {
        font-size: 1.5rem;
        display: inline-block;
        margin-bottom: 0.5rem;
    }
    
    .info-title {
        font-weight: 600;
        color: white;
        margin-bottom: 0.25rem;
    }
    
    .info-desc {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.4;
    }
    
    .cover-footer {
        margin-top: 2rem;
        padding: 1rem;
    }
    
    .footer-warning {
        background: rgba(255, 255, 255, 0.15);
        /* Remove backdrop-filter */
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        padding: 1rem;
    }
    
    .warning-icon {
        font-size: 1.25rem;
        margin-right: 0.5rem;
    }
    
    .warning-text {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.4;
        display: inline;
    }
    
    /* Page Headers - Simplified */
    .page-header {
        padding: 0.75rem 0;
        margin-bottom: 2rem;
        border-bottom: 2px solid var(--border-light);
        font-size: 0.875rem;
    }
    
    .header-left {
        float: left;
    }
    
    .header-right {
        float: right;
    }
    
    .header-company {
        font-weight: 600;
        color: var(--primary-color);
    }
    
    .header-separator {
        color: var(--text-muted);
        margin: 0 0.5rem;
    }
    
    .header-section {
        color: var(--text-secondary);
    }
    
    /* Table of Contents - Simplified */
    .toc-page {
        padding: 2rem 0;
        page-break-after: always;
    }
    
    .toc-title {
        font-size: 2.5rem;
        color: var(--text-primary);
        margin-bottom: 3rem;
        text-align: center;
        font-weight: 700;
    }
    
    .toc-content {
        max-width: 700px;
        margin: 0 auto;
    }
    
    .toc-item {
        margin: 1.5rem 0;
        padding: 1.5rem;
        background: var(--background-card);
        border-radius: 8px;
        border: 1px solid var(--border-light);
        /* Remove complex shadows and transitions */
    }
    
    .toc-number {
        width: 40px;
        height: 40px;
        background: var(--primary-color);
        color: white;
        border-radius: 8px;
        display: inline-block;
        text-align: center;
        line-height: 40px;
        font-weight: 600;
        font-size: 1rem;
        float: left;
        margin-right: 1rem;
    }
    
    .toc-section {
        margin-left: 60px; /* Account for floated number */
    }
    
    .toc-section-title {
        font-weight: 600;
        color: var(--text-primary);
        font-size: 1.125rem;
        margin-bottom: 0.5rem;
    }
    
    .toc-section-desc {
        color: var(--text-secondary);
        font-size: 0.875rem;
        line-height: 1.4;
    }
    
    /* Section Styles - Simplified */
    .section {
        margin: 2rem 0;
        padding: 1rem 0;
        clear: both; /* Clear floats */
    }
    
    .section-title {
        font-size: 2.25rem;
        color: var(--primary-color);
        margin-bottom: 2rem;
        font-weight: 700;
        border-bottom: 4px solid var(--primary-color);
        padding-bottom: 0.5rem;
    }
    
    .content {
        line-height: 1.7;
        font-size: 11pt;
    }
    
    .content h1 {
        font-size: 1.75rem;
        color: var(--text-primary);
        margin: 2.5rem 0 1.5rem 0;
        font-weight: 600;
        border-left: 4px solid var(--primary-color);
        padding-left: 1rem;
    }
    
    .content h2 {
        font-size: 1.375rem;
        color: var(--text-primary);
        margin: 2rem 0 1rem 0;
        font-weight: 600;
    }
    
    .content h3 {
        font-size: 1.125rem;
        color: var(--text-primary);
        margin: 1.5rem 0 0.75rem 0;
        font-weight: 600;
    }
    
    .content p {
        margin: 1.25rem 0;
        text-align: justify;
        color: var(--text-primary);
        line-height: 1.7;
    }
    
    .content ul {
        margin: 1.5rem 0;
        padding-left: 1.5rem;
    }
    
    .content li {
        margin: 0.75rem 0;
        line-height: 1.6;
        list-style: disc;
        color: var(--text-primary);
    }
    
    .content strong {
        font-weight: 600;
        color: var(--text-primary);
    }
    
    /* Page Breaks */
    .page-break {
        page-break-before: always;
    }
    
    /* Tables - Simplified */
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 2rem 0;
        background: var(--background-card);
    }
    
    th, td {
        padding: 1rem;
        text-align: left;
        border: 1px solid var(--border-light);
    }
    
    th {
        background: var(--primary-color);
        color: white;
        font-weight: 600;
        font-size: 0.95rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    tr:nth-child(even) {
        background-color: var(--background-light);
    }
    
    /* Risk Indicators */
    .risk-high {
        color: var(--danger-color);
        font-weight: 600;
        background: rgba(239, 68, 68, 0.1);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
    }
    
    .risk-medium {
        color: var(--warning-color);
        font-weight: 600;
        background: rgba(245, 158, 11, 0.1);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
    }
    
    .risk-low {
        color: var(--success-color);
        font-weight: 600;
        background: rgba(16, 185, 129, 0.1);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
    }
    
    /* Disclaimer Page - Simplified */
    .disclaimer-page {
        padding: 2rem 0;
    }
    
    .disclaimer-grid {
        margin: 2rem 0;
    }
    
    .disclaimer-card {
        background: var(--background-card);
        border: 1px solid var(--border-light);
        border-radius: 8px;
        padding: 2rem;
        margin: 1rem 0;
        /* Remove complex shadows and transitions */
    }
    
    .disclaimer-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
        display: block;
    }
    
    .disclaimer-card h3 {
        color: var(--text-primary);
        margin: 0 0 1rem 0;
        font-weight: 600;
        font-size: 1.125rem;
    }
    
    .disclaimer-card p {
        margin: 0;
        line-height: 1.6;
        text-align: justify;
        color: var(--text-secondary);
    }
    
    .generation-info {
        margin-top: 3rem;
        padding: 2rem;
        background: var(--background-light);
        border: 1px solid var(--border-light);
        border-radius: 8px;
        text-align: center;
    }
    
    .info-row {
        margin: 0.75rem 0;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-light);
    }
    
    .info-row:last-child {
        border-bottom: none;
    }
    
    .info-label {
        font-weight: 500;
        color: var(--text-secondary);
        margin-right: 1rem;
    }
    
    .info-value {
        font-weight: 600;
        color: var(--text-primary);
    }
    
    /* Clear floats */
    .clearfix::after {
        content: "";
        display: table;
        clear: both;
    }
    """
    
    def generate_pdf(self, sections):
        """Generate PDF from assembled sections and return the local path."""
        output_path = None
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            # Use a temporary directory for local file creation
            output_dir = os.path.join(os.path.dirname(__file__), '..', 'reports')
            os.makedirs(output_dir, exist_ok=True)
            output_path = os.path.join(output_dir, f"{self.company_name.replace(' ', '_')}_report_{timestamp}.pdf")
            
            html_content = self.assemble_full_report(sections)
            print(f"[PDF] Assembled HTML content for {output_path}")

            HTML(string=html_content, base_url='.').write_pdf(
                output_path,
                stylesheets=[CSS(string=self.get_report_css())],
                presentational_hints=True
            )
            print(f"[PDF] PDF written to {output_path}")

            file_size = os.path.getsize(output_path)
            print(f"[PDF] Generated PDF size: {file_size} bytes")

            return output_path

        except Exception as e:
            print(f"[ERROR] PDF generation failed: {e}")
            import traceback; traceback.print_exc()
            # If there's an error, make sure to clean up any partially created file
            if output_path and os.path.exists(output_path):
                os.remove(output_path)
            return None








# from datetime import datetime
# from weasyprint import HTML, CSS
# import re
# import os
# from Auth.supabase_utils import upload_pdf_to_supabase

# class BrokerageReportAssembler:
#     def __init__(self, company_name):
#         self.company_name = company_name
#         self.report_date = datetime.now().strftime("%B %d, %Y")
        
#     def convert_markdown_to_html(self, content):
#         """Convert markdown-style content to proper HTML"""
#         if not content:
#             return ""
        
#         # Convert headers
#         content = re.sub(r'^### (.*?)$', r'<h3>\1</h3>', content, flags=re.MULTILINE)
#         content = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', content, flags=re.MULTILINE)
#         content = re.sub(r'^# (.*?)$', r'<h1>\1</h1>', content, flags=re.MULTILINE)
        
#         # Convert bold text
#         content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', content)
        
#         # Convert bullet points
#         content = re.sub(r'^- (.*?)$', r'<li>\1</li>', content, flags=re.MULTILINE)
        
#         # Convert numbered lists
#         content = re.sub(r'^\d+\. (.*?)$', r'<li>\1</li>', content, flags=re.MULTILINE)
        
#         # Wrap consecutive <li> tags in <ul>
#         content = re.sub(r'(<li>.*?</li>)(?:\s*<li>.*?</li>)*', self._wrap_list_items, content, flags=re.DOTALL)
        
#         # Convert paragraphs (double line breaks)
#         paragraphs = content.split('\n\n')
#         formatted_paragraphs = []
        
#         for para in paragraphs:
#             para = para.strip()
#             if para and not para.startswith('<'):
#                 # Only wrap in <p> tags if it's not already HTML
#                 para = f'<p>{para}</p>'
#             formatted_paragraphs.append(para)
        
#         return '\n'.join(formatted_paragraphs)
    
#     def _wrap_list_items(self, match):
#         """Helper function to wrap list items in ul tags"""
#         list_content = match.group(0)
#         return f'<ul>{list_content}</ul>'
    
#     def extract_key_metrics(self, executive_summary):
#         """Extract key metrics from executive summary for cover page"""
#         metrics = {
#             'recommendation': 'Analysis Based',
#             'target_price': 'TBD',
#             'rating': 'Under Review'
#         }
        
#         if executive_summary:
#             # Extract recommendation
#             recommendation_match = re.search(r'Investment Recommendation.*?[:\*\*]\s*([A-Za-z\s]+)', executive_summary)
#             if recommendation_match:
#                 metrics['recommendation'] = recommendation_match.group(1).strip()
            
#             # Extract target price
#             price_match = re.search(r'Target Price.*?Rs\s*([\d,.-]+)', executive_summary)
#             if price_match:
#                 metrics['target_price'] = f"Rs {price_match.group(1)}"
        
#         return metrics
    
#     def assemble_full_report(self, sections):
#         """Assemble all sections into a complete HTML report"""
        
#         # Extract key metrics for cover page
#         key_metrics = self.extract_key_metrics(sections.get('executive_summary', ''))
        
#         html_report = f"""
#         <!DOCTYPE html>
#         <html>
#         <head>
#             <meta charset="UTF-8">
#             <title>{self.company_name} - Investment Research Report</title>
#             <style>
#                 {self.get_report_css()}
#             </style>
#         </head>
#         <body>
#             {self.generate_cover_page(key_metrics)}
#             {self.generate_table_of_contents()}
            
#             <div class="section" id="executive-summary">
#                 <h1 class="section-title">Executive Summary</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('executive_summary', 'Content not available'))}
#                 </div>
#             </div>
            
#             <div class="section page-break" id="investment-thesis">
#                 <h1 class="section-title">Investment Thesis</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('investment_thesis', 'Content not available'))}
#                 </div>
#             </div>
            
#             <div class="section page-break" id="financial-analysis">
#                 <h1 class="section-title">Financial Analysis</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('financial_analysis', 'Content not available'))}
#                 </div>
#             </div>
            
#             <div class="section page-break" id="business-analysis">
#                 <h1 class="section-title">Business Analysis</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('business_analysis', 'Content not available'))}
#                 </div>
#             </div>
            
#             <div class="section page-break" id="risk-assessment">
#                 <h1 class="section-title">Risk Assessment</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('risk_assessment', 'Content not available'))}
#                 </div>
#             </div>
            
#             <div class="section page-break" id="valuation">
#                 <h1 class="section-title">Valuation & Recommendation</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('valuation_analysis', 'Content not available'))}
#                 </div>
#             </div>
            
#             {self.generate_disclaimer()}
#         </body>
#         </html>
#         """
        
#         return html_report
    
#     def generate_cover_page(self, key_metrics):
#         """Generate professional cover page with extracted metrics"""
#         return f"""
#         <div class="cover-page">
#             <div class="logo-section">
#                 <h1 class="company-name">{self.company_name}</h1>
#                 <h2 class="report-type">Equity Research Report</h2>
#             </div>
            
#             <div class="report-details">
#                 <div class="detail-row">
#                     <span class="label">Report Date:</span>
#                     <span class="value">{self.report_date}</span>
#                 </div>
#                 <div class="detail-row">
#                     <span class="label">Analyst:</span>
#                     <span class="value">AI Research Team</span>
#                 </div>
#             </div>
            
#             <div class="key-highlights">
#                 <div class="highlight-box recommendation-box">
#                     <h3>Investment Recommendation</h3>
#                     <div class="recommendation-value">{key_metrics['recommendation']}</div>
#                 </div>
                
#                 <div class="highlight-box target-box">
#                     <h3>Price Target</h3>
#                     <div class="target-value">{key_metrics['target_price']}</div>
#                 </div>
#             </div>
            
#             <div class="cover-footer">
#                 <p class="disclaimer-note">This report contains forward-looking statements and analysis based on available data.</p>
#             </div>
#         </div>
#         """
    
#     def generate_table_of_contents(self):
#         """Generate table of contents with proper page references"""
#         return """
#         <div class="toc-page page-break">
#             <h1 class="toc-title">Table of Contents</h1>
            
#             <div class="toc-content">
#                 <div class="toc-item">
#                     <span class="toc-section">Executive Summary</span>
#                     <span class="toc-dots">...............................</span>
#                     <span class="toc-page-num">3</span>
#                 </div>
                
#                 <div class="toc-item">
#                     <span class="toc-section">Investment Thesis</span>
#                     <span class="toc-dots">...............................</span>
#                     <span class="toc-page-num">5</span>
#                 </div>
                
#                 <div class="toc-item">
#                     <span class="toc-section">Financial Analysis</span>
#                     <span class="toc-dots">...............................</span>
#                     <span class="toc-page-num">8</span>
#                 </div>
                
#                 <div class="toc-item">
#                     <span class="toc-section">Business Analysis</span>
#                     <span class="toc-dots">...............................</span>
#                     <span class="toc-page-num">11</span>
#                 </div>
                
#                 <div class="toc-item">
#                     <span class="toc-section">Risk Assessment</span>
#                     <span class="toc-dots">...............................</span>
#                     <span class="toc-page-num">14</span>
#                 </div>
                
#                 <div class="toc-item">
#                     <span class="toc-section">Valuation & Recommendation</span>
#                     <span class="toc-dots">...............................</span>
#                     <span class="toc-page-num">17</span>
#                 </div>
                
#                 <div class="toc-item">
#                     <span class="toc-section">Important Disclosures</span>
#                     <span class="toc-dots">...............................</span>
#                     <span class="toc-page-num">19</span>
#                 </div>
#             </div>
#         </div>
#         """
    
#     def generate_disclaimer(self):
#         """Generate comprehensive legal disclaimer"""
#         return f"""
#         <div class="disclaimer-page page-break" id="disclaimer">
#             <h1 class="section-title">Important Disclosures</h1>
            
#             <div class="disclaimer-section">
#                 <h3>Research Disclaimer</h3>
#                 <p>This report has been generated through automated analysis of publicly available information including earnings calls, annual reports, forum discussions, and market data. The content is for informational purposes only and should not be construed as personalized investment advice or a recommendation to buy, sell, or hold any securities.</p>
#             </div>
            
#             <div class="disclaimer-section">
#                 <h3>Risk Warning</h3>
#                 <p>All investments involve risk, including the potential loss of principal. Past performance does not guarantee future results. Market conditions, company fundamentals, and economic factors can significantly impact investment returns. Investors should carefully consider their risk tolerance and investment objectives before making any investment decisions.</p>
#             </div>
            
#             <div class="disclaimer-section">
#                 <h3>Data Sources & Accuracy</h3>
#                 <p>Information in this report is derived from publicly available sources including company financial statements, earnings transcripts, regulatory filings, and market data providers. While every effort has been made to ensure accuracy, we cannot guarantee the completeness or accuracy of all information presented.</p>
#             </div>
            
#             <div class="disclaimer-section">
#                 <h3>Professional Advice</h3>
#                 <p>Before making any investment decisions, investors should consult with qualified financial advisors, tax professionals, and legal counsel as appropriate for their individual circumstances.</p>
#             </div>
            
#             <div class="generation-info">
#                 <p><strong>Report Generated:</strong> {self.report_date}</p>
#                 <p><strong>Version:</strong> Automated Research Report v2.0</p>
#             </div>
#         </div>
#         """
    
#     def get_report_css(self):
#         """Enhanced CSS styling for professional appearance"""
#         return """
#         @page {
#             size: A4;
#             margin: 0.75in;
#             @top-right {
#                 content: counter(page);
#                 font-size: 10pt;
#                 color: #666;
#             }
#         }
        
#         * {
#             box-sizing: border-box;
#         }
        
#         body {
#             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
#             line-height: 1.6;
#             color: #333;
#             margin: 0;
#             padding: 0;
#             font-size: 11pt;
#         }
        
#         /* Cover Page Styles */
#         .cover-page {
#             display: flex;
#             flex-direction: column;
#             justify-content: space-between;
#             height: 100vh;
#             padding: 2em;
#             text-align: center;
#             page-break-after: always;
#             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
#             color: white;
#         }
        
#         .logo-section {
#             margin-top: 20%;
#         }
        
#         .company-name {
#             font-size: 3em;
#             font-weight: 700;
#             margin-bottom: 0.2em;
#             text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
#         }
        
#         .report-type {
#             font-size: 1.5em;
#             font-weight: 300;
#             margin-bottom: 2em;
#             opacity: 0.9;
#         }
        
#         .report-details {
#             margin: 2em 0;
#         }
        
#         .detail-row {
#             display: flex;
#             justify-content: center;
#             margin: 0.5em 0;
#             font-size: 1.1em;
#         }
        
#         .label {
#             font-weight: 600;
#             margin-right: 1em;
#         }
        
#         .value {
#             font-weight: 300;
#         }
        
#         .key-highlights {
#             display: flex;
#             justify-content: space-around;
#             margin: 3em 0;
#         }
        
#         .highlight-box {
#             background: rgba(255, 255, 255, 0.1);
#             backdrop-filter: blur(10px);
#             border: 1px solid rgba(255, 255, 255, 0.2);
#             border-radius: 15px;
#             padding: 1.5em;
#             margin: 0 1em;
#             flex: 1;
#             box-shadow: 0 8px 32px rgba(0,0,0,0.1);
#         }
        
#         .highlight-box h3 {
#             margin: 0 0 0.5em 0;
#             font-size: 1em;
#             opacity: 0.8;
#         }
        
#         .recommendation-value, .target-value {
#             font-size: 1.3em;
#             font-weight: 600;
#         }
        
#         .cover-footer {
#             margin-top: auto;
#             opacity: 0.7;
#             font-size: 0.9em;
#         }
        
#         /* Table of Contents Styles */
#         .toc-page {
#             padding: 2em 0;
#             page-break-after: always;
#         }
        
#         .toc-title {
#             font-size: 2.2em;
#             color: #2c3e50;
#             margin-bottom: 2em;
#             text-align: center;
#             border-bottom: 3px solid #3498db;
#             padding-bottom: 0.5em;
#         }
        
#         .toc-content {
#             max-width: 600px;
#             margin: 0 auto;
#         }
        
#         .toc-item {
#             display: flex;
#             align-items: center;
#             margin: 1em 0;
#             font-size: 1.1em;
#             padding: 0.5em 0;
#         }
        
#         .toc-section {
#             font-weight: 600;
#             color: #2c3e50;
#         }
        
#         .toc-dots {
#             flex: 1;
#             margin: 0 1em;
#             color: #bdc3c7;
#             overflow: hidden;
#         }
        
#         .toc-page-num {
#             font-weight: 600;
#             color: #3498db;
#             min-width: 30px;
#             text-align: right;
#         }
        
#         /* Section Styles */
#         .section {
#             margin: 2em 0;
#             padding: 1em 0;
#         }
        
#         .section-title {
#             font-size: 2.2em;
#             color: #2c3e50;
#             margin-bottom: 1.5em;
#             padding-bottom: 0.5em;
#             border-bottom: 3px solid #3498db;
#             font-weight: 700;
#         }
        
#         .content {
#             line-height: 1.7;
#         }
        
#         .content h1 {
#             font-size: 1.8em;
#             color: #34495e;
#             margin: 2em 0 1em 0;
#             font-weight: 600;
#         }
        
#         .content h2 {
#             font-size: 1.4em;
#             color: #34495e;
#             margin: 1.5em 0 1em 0;
#             font-weight: 600;
#         }
        
#         .content h3 {
#             font-size: 1.2em;
#             color: #34495e;
#             margin: 1.2em 0 0.8em 0;
#             font-weight: 600;
#         }
        
#         .content p {
#             margin: 1em 0;
#             text-align: justify;
#         }
        
#         .content ul {
#             margin: 1em 0;
#             padding-left: 2em;
#         }
        
#         .content li {
#             margin: 0.5em 0;
#             line-height: 1.6;
#         }
        
#         .content strong {
#             font-weight: 700;
#             color: #2c3e50;
#         }
        
#         /* Page Breaks */
#         .page-break {
#             page-break-before: always;
#         }
        
#         /* Tables */
#         table {
#             width: 100%;
#             border-collapse: collapse;
#             margin: 2em 0;
#             box-shadow: 0 2px 8px rgba(0,0,0,0.1);
#         }
        
#         th, td {
#             border: 1px solid #e1e8ed;
#             padding: 0.8em;
#             text-align: left;
#         }
        
#         th {
#             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
#             color: white;
#             font-weight: 600;
#             font-size: 0.95em;
#         }
        
#         tr:nth-child(even) {
#             background-color: #f8f9fa;
#         }
        
#         /* Special Elements */
#         .highlight {
#             background: linear-gradient(135deg, #fff3e0, #ffe0b3);
#             border-left: 4px solid #ff9800;
#             padding: 1.5em;
#             margin: 2em 0;
#             border-radius: 0 8px 8px 0;
#             box-shadow: 0 2px 8px rgba(0,0,0,0.1);
#         }
        
#         .risk-high {
#             color: #e74c3c;
#             font-weight: 700;
#         }
        
#         .risk-medium {
#             color: #f39c12;
#             font-weight: 700;
#         }
        
#         .risk-low {
#             color: #27ae60;
#             font-weight: 700;
#         }
        
#         /* Disclaimer Page */
#         .disclaimer-page {
#             padding: 2em 0;
#         }
        
#         .disclaimer-section {
#             margin: 2em 0;
#             padding: 1.5em;
#             background-color: #f8f9fa;
#             border-radius: 8px;
#             border-left: 4px solid #6c757d;
#         }
        
#         .disclaimer-section h3 {
#             color: #495057;
#             margin-top: 0;
#             font-weight: 600;
#         }
        
#         .disclaimer-section p {
#             margin-bottom: 0;
#             line-height: 1.6;
#             text-align: justify;
#         }
        
#         .generation-info {
#             margin-top: 3em;
#             padding: 1em;
#             background-color: #e9ecef;
#             border-radius: 5px;
#             text-align: center;
#             font-size: 0.95em;
#             color: #6c757d;
#         }
        
#         .generation-info p {
#             margin: 0.5em 0;
#         }
#         """
    
#     def generate_pdf(self, sections):
#         """Generate PDF from assembled sections and return the local path."""
#         output_path = None
#         try:
#             timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
#             # Use a temporary directory for local file creation
#             output_dir = os.path.join(os.path.dirname(__file__), '..', 'reports')
#             os.makedirs(output_dir, exist_ok=True)
#             output_path = os.path.join(output_dir, f"{self.company_name.replace(' ', '_')}_report_{timestamp}.pdf")
            
#             html_content = self.assemble_full_report(sections)
#             print(f"[PDF] Assembled HTML content for {output_path}")

#             HTML(string=html_content, base_url='.').write_pdf(
#                 output_path,
#                 stylesheets=[CSS(string=self.get_report_css())],
#                 presentational_hints=True
#             )
#             print(f"[PDF] PDF written to {output_path}")

#             file_size = os.path.getsize(output_path)
#             print(f"[PDF] Generated PDF size: {file_size} bytes")

#             return output_path

#         except Exception as e:
#             print(f"[ERROR] PDF generation failed: {e}")
#             import traceback; traceback.print_exc()
#             # If there's an error, make sure to clean up any partially created file
#             if output_path and os.path.exists(output_path):
#                 os.remove(output_path)
#             return None
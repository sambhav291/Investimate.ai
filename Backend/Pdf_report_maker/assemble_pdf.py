from datetime import datetime
from weasyprint import HTML, CSS
import re
import os
import traceback
from Auth.supabase_utils import upload_pdf_to_supabase

class REDACTED-GOOGLE-CLIENT-SECRET:
    def __init__(self, company_name):
        self.company_name = company_name
        self.report_date = datetime.now().strftime("%B %d, %Y")
        
    def REDACTED-GOOGLE-CLIENT-SECRET(self, content):
        """Convert markdown-style content to proper HTML with enhanced formatting"""
        if not content:
            return ""
        
        import re
        
        # First, normalize line endings
        content = content.replace('\r\n', '\n')
        
        # Preserve paragraph breaks before other processing
        content = content.replace('\n\n', '<div class="paragraph-break"></div>')
        
        # Clean up any stray markdown symbols first
        content = self.clean_markdown_symbols(content)
        
        # Convert headers with proper hierarchy - more aggressive to catch all variants
        content = re.sub(r'^###\s*(.*?)$', r'<h3 class="content-h3">\1</h3>', content, flags=re.MULTILINE)
        content = re.sub(r'^##\s*(.*?)$', r'<h2 class="content-h2">\1</h2>', content, flags=re.MULTILINE)
        content = re.sub(r'^#\s*(.*?)$', r'<h1 class="content-h1">\1</h1>', content, flags=re.MULTILINE)
        # Extra pass for headers with no space
        content = re.sub(r'^###([^\s#].*?)$', r'<h3 class="content-h3">\1</h3>', content, flags=re.MULTILINE)
        content = re.sub(r'^##([^\s#].*?)$', r'<h2 class="content-h2">\1</h2>', content, flags=re.MULTILINE)
        content = re.sub(r'^#([^\s#].*?)$', r'<h1 class="content-h1">\1</h1>', content, flags=re.MULTILINE)
        
        # Convert bold text with proper class
        content = re.sub(r'\*\*(.*?)\*\*', r'<strong class="highlight-text">\1</strong>', content)
        content = re.sub(r'__(.*?)__', r'<strong class="highlight-text">\1</strong>', content)
        
        # Convert italic text
        content = re.sub(r'\*(.*?)\*', r'<em class="italic-text">\1</em>', content)
        content = re.sub(r'_(.*?)_', r'<em class="italic-text">\1</em>', content)
        
        # Convert code blocks
        content = re.sub(r'```(.*?)```', r'<div class="code-block">\1</div>', content, flags=re.DOTALL)
        content = re.sub(r'`(.*?)`', r'<code class="inline-code">\1</code>', content)
        
        # Convert bullet points with enhanced styling
        content = re.sub(r'^[\-\*\+]\s+(.*?)$', r'<li class="bullet-item">\1</li>', content, flags=re.MULTILINE)
        
        # Convert numbered lists
        content = re.sub(r'^\d+\.\s+(.*?)$', r'<li class="numbered-item">\1</li>', content, flags=re.MULTILINE)
        
        # Wrap consecutive <li> tags in appropriate lists
        content = re.sub(r'(<li class="bullet-item">.*?</li>)(?:\s*<li class="bullet-item">.*?</li>)*', 
                        lambda m: f'<ul class="bullet-list">{m.group(0)}</ul>', content, flags=re.DOTALL)
        content = re.sub(r'(<li class="numbered-item">.*?</li>)(?:\s*<li class="numbered-item">.*?</li>)*', 
                        lambda m: f'<ol class="numbered-list">{m.group(0)}</ol>', content, flags=re.DOTALL)
        
        # Convert blockquotes
        content = re.sub(r'^>\s+(.*?)$', r'<blockquote class="quote-block">\1</blockquote>', content, flags=re.MULTILINE)
        
        # Convert tables (basic support)
        content = self.convert_tables(content)
        
        # Restore paragraph breaks and properly format paragraphs
        paragraphs = content.split('<div class="paragraph-break"></div>')
        formatted_paragraphs = []
        
        for para in paragraphs:
            para = para.strip()
            if para:
                # Skip wrapping if already an HTML element
                if not (para.startswith('<') and any(para.startswith(f'<{tag}') for tag in ['h1', 'h2', 'h3', 'ul', 'ol', 'blockquote', 'table', 'div', 'p'])):
                    # Only wrap in <p> tags if it's not already HTML
                    para = f'<p class="content-paragraph">{para}</p>'
            formatted_paragraphs.append(para)
        
        # Add spacing between paragraphs
        result = '\n\n'.join(formatted_paragraphs)
        # Remove custom <br> insertion to avoid excessive gaps; rely on CSS for spacing
        return result
    
    def clean_markdown_symbols(self, content):
        """Clean up stray markdown symbols that weren't properly converted"""
        # Remove stray ## symbols
        content = re.sub(r'(?<!^)##(?!\s)', '', content, flags=re.MULTILINE)
        content = re.sub(r'^##\s*$', '', content, flags=re.MULTILINE)
        content = re.sub(r'(?<!^)#(?!\s)', '', content, flags=re.MULTILINE)
        content = re.sub(r'^#\s*$', '', content, flags=re.MULTILINE)
        
        # Remove stray ** symbols
        content = re.sub(r'(?<!\*)\*(?!\*)', '', content)
        content = re.sub(r'\*\*\s*\*\*', '', content)
        
        # Remove stray __ symbols
        content = re.sub(r'(?<!_)_(?!_)', '', content)
        content = re.sub(r'__\s*__', '', content)
        
        # Remove extra spaces and tabs globally (variable-width look-behind not allowed)
        content = re.sub(r'[ \t]+', ' ', content)
        
        return content
    
    def convert_tables(self, content):
        """Convert markdown tables to HTML"""
        # Basic table conversion
        table_pattern = r'^\|(.+)\|\s*\n\|[-\s\|:]+\|\s*\n((?:\|.+\|\s*\n?)+)'
        
        def table_replacer(match):
            header = match.group(1)
            rows = match.group(2)
            
            # Convert header
            header_cells = [cell.strip() for cell in header.split('|') if cell.strip()]
            header_html = '<tr>' + ''.join(f'<th>{cell}</th>' for cell in header_cells) + '</tr>'
            
            # Convert rows
            rows_html = ''
            for row in rows.strip().split('\n'):
                if row.strip():
                    cells = [cell.strip() for cell in row.split('|') if cell.strip()]
                    if cells:
                        rows_html += '<tr>' + ''.join(f'<td>{cell}</td>' for cell in cells) + '</tr>'
            
            return f'<table class="data-table"><thead>{header_html}</thead><tbody>{rows_html}</tbody></table>'
        
        return re.sub(table_pattern, table_replacer, content, flags=re.MULTILINE)
    
    def extract_key_metrics(self, executive_summary):
        """Extract key metrics from executive summary for cover page"""
        metrics = {
            'recommendation': 'Analysis Based',
            'target_price': 'TBD',
            'rating': 'Under Review',
            'risk_level': 'Medium'
        }
        
        if executive_summary:
            # Clean the summary first
            clean_summary = self.clean_markdown_symbols(executive_summary)
            
            # Extract recommendation
            recommendation_patterns = [
                r'Investment Recommendation[:\*\s]*([A-Za-z\s]+)',
                r'Recommendation[:\*\s]*([A-Za-z\s]+)',
                r'Rating[:\*\s]*([A-Za-z\s]+)'
            ]
            
            for pattern in recommendation_patterns:
                match = re.search(pattern, clean_summary, re.IGNORECASE)
                if match:
                    metrics['recommendation'] = match.group(1).strip()
                    break
            
            # Extract target price
            price_patterns = [
                r'Target Price[:\*\s]*Rs\s*([\d,.-]+)',
                r'Price Target[:\*\s]*Rs\s*([\d,.-]+)',
                r'Fair Value[:\*\s]*Rs\s*([\d,.-]+)'
            ]
            
            for pattern in price_patterns:
                match = re.search(pattern, clean_summary, re.IGNORECASE)
                if match:
                    metrics['target_price'] = f"₹{match.group(1)}"
                    break
            
            # Extract risk level
            if re.search(r'high risk|risky|volatile', clean_summary, re.IGNORECASE):
                metrics['risk_level'] = 'High'
            elif re.search(r'low risk|stable|conservative', clean_summary, re.IGNORECASE):
                metrics['risk_level'] = 'Low'
        
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
            <style>
                {self.get_report_css()}
            </style>
        </head>
        <body>
            {self.generate_cover_page(key_metrics)}
            {self.REDACTED-GOOGLE-CLIENT-SECRETts()}
            
            <div class="section" id="executive-summary">
                <div class="section-header">
                    <h1 class="section-title">Executive Summary</h1>
                </div>
                {self.REDACTED-GOOGLE-CLIENT-SECRET(sections.get('executive_summary', 'Content not available'))}
            </div>
            
            <div class="section page-break" id="investment-thesis">
                <div class="section-header">
                    <h1 class="section-title">Investment Thesis</h1>
                </div>
                {self.REDACTED-GOOGLE-CLIENT-SECRET(sections.get('investment_thesis', 'Content not available'))}
            </div>
            
            <div class="section page-break" id="financial-analysis">
                <div class="section-header">
                    <h1 class="section-title">Financial Analysis</h1>
                </div>
                {self.REDACTED-GOOGLE-CLIENT-SECRET(sections.get('financial_analysis', 'Content not available'))}
            </div>
            
            <div class="section page-break" id="business-analysis">
                <div class="section-header">
                    <h1 class="section-title">Business Analysis</h1>
                </div>
                {self.REDACTED-GOOGLE-CLIENT-SECRET(sections.get('business_analysis', 'Content not available'))}
            </div>
            
            <div class="section page-break" id="risk-assessment">
                <div class="section-header">
                    <h1 class="section-title">Risk Assessment</h1>
                </div>
                {self.REDACTED-GOOGLE-CLIENT-SECRET(sections.get('risk_assessment', 'Content not available'))}
            </div>
            
            <div class="section page-break" id="valuation">
                <div class="section-header">
                    <h1 class="section-title">Valuation & Recommendation</h1>
                </div>
                {self.REDACTED-GOOGLE-CLIENT-SECRET(sections.get('valuation_analysis', 'Content not available'))}
            </div>
            
            {self.generate_disclaimer()}
        </body>
        </html>
        """
        
        return html_report
    
    def generate_cover_page(self, key_metrics):
        """Generate futuristic cover page matching website theme"""
        return f"""
        <div class="cover-page">
            <div class="cover-background">
                <div class="gradient-orb orb-1"></div>
                <div class="gradient-orb orb-2"></div>
                <div class="gradient-orb orb-3"></div>
                <div class="grid-overlay"></div>
            </div>
            
            <div class="cover-content">
                <div class="logo-section">
                    <div class="brand-logo">
                        <span class="logo-text">Investimate</span>
                        <span class="logo-ai">.ai</span>
                    </div>
                    <div class="ai-badge">AI-Powered Research</div>
                </div>
                
                <div class="company-section">
                    <h1 class="company-name">{self.company_name.upper()}</h1>
                    <h2 class="report-type">Equity Research Report</h2>
                    <div class="report-date">{self.report_date}</div>
                </div>
                
                <div class="metrics-grid">
                    <div class="metric-card recommendation-card">
                        <div class="metric-icon">🎯</div>
                        <div class="metric-label">Investment Recommendation</div>
                        <div class="metric-value recommendation-value">{key_metrics['recommendation']}</div>
                    </div>
                    
                    <div class="metric-card target-card">
                        <div class="metric-icon">💰</div>
                        <div class="metric-label">Price Target</div>
                        <div class="metric-value target-value">{key_metrics['target_price']}</div>
                    </div>
                    
                    <div class="metric-card risk-card">
                        <div class="metric-icon">⚠️</div>
                        <div class="metric-label">Risk Level</div>
                        <div class="metric-value risk-value risk-{key_metrics['risk_level'].lower()}">{key_metrics['risk_level']}</div>
                    </div>
                </div>
                
                <div class="cover-footer">
                    <div class="tech-badge">
                        <span class="tech-icon">🤖</span>
                        <span>Generated by Advanced AI Analysis</span>
                    </div>
                    <div class="disclaimer-note">This report contains forward-looking statements based on available data analysis</div>
                </div>
            </div>
        </div>
        """
    
    def REDACTED-GOOGLE-CLIENT-SECRETts(self):
        return """
        <div class="toc-page page-break">
            <h1 class="toc-title">Table of Contents</h1>
            <div class="toc-content">
                <div class="toc-item">
                    <span class="toc-section">Executive Summary</span>
                </div>
                <div class="toc-item">
                    <span class="toc-section">Investment Thesis</span>
                </div>
                <div class="toc-item">
                    <span class="toc-section">Financial Analysis</span>
                </div>
                <div class="toc-item">
                    <span class="toc-section">Business Analysis</span>
                </div>
                <div class="toc-item">
                    <span class="toc-section">Risk Assessment</span>
                </div>
                <div class="toc-item">
                    <span class="toc-section">Valuation & Recommendation</span>
                </div>
                <div class="toc-item">
                    <span class="toc-section">Important Disclosures</span>
                </div>
            </div>
        </div>
        """
    
    def generate_disclaimer(self):
        """Generate professional disclaimer"""
        return f"""
        <div class="disclaimer-page page-break" id="disclaimer">
            <div class="disclaimer-header">
                <h1 class="section-title">Important Disclosures</h1>
            </div>
            
            <div class="disclaimer-section">
                <h3>AI-Generated Research</h3>
                <p>This report has been generated through advanced AI analysis of publicly available information including earnings calls, annual reports, forum discussions, and market data. The content is for informational purposes only and should not be construed as personalized investment advice.</p>
            </div>
            
            <div class="disclaimer-section">
                <h3>Risk Warning</h3>
                <p>All investments involve risk, including potential loss of principal. Past performance does not guarantee future results. Market conditions, company fundamentals, and economic factors can significantly impact investment returns. Please consult qualified financial advisors before making investment decisions.</p>
            </div>
            
            <div class="disclaimer-section">
                <h3>Data Sources & Accuracy</h3>
                <p>Information is derived from publicly available sources including company financial statements, earnings transcripts, regulatory filings, and market data providers. While every effort has been made to ensure accuracy, we cannot guarantee completeness or accuracy of all information presented.</p>
            </div>
            
            <div class="disclaimer-section">
                <h3>Professional Advice</h3>
                <p>Before making any investment decisions, investors should consult with qualified financial advisors, tax professionals, and legal counsel as appropriate for their individual circumstances and risk tolerance.</p>
            </div>
            
            <div class="generation-info">
                <p><strong>Report Generated:</strong> {self.report_date}</p>
                <p><strong>Platform:</strong> Investimate.ai</p>
                <p><strong>Version:</strong> AI Research Report v3.0</p>
            </div>
        </div>
        """
    
    def get_report_css(self):
        """Enhanced CSS with futuristic design matching website theme"""
        try:
            # Sanitize company name to avoid CSS injection or encoding issues
            company_name_clean = re.sub(r'[^A-Za-z0-9\s\-_]', '', self.company_name)
            company_name_uppercase = company_name_clean.upper()
            
            css = f"""
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            @page {{
                size: A4;
                margin: 0.8in;
                @top-center {{
                    content: "{company_name_uppercase} - Equity Research Report";
                    font-size: 9pt;
                    color: #334155;
                    font-family: 'Inter', sans-serif;
                    font-style: italic;
                    font-weight: 600;
                }}
                @bottom-right {{
                    content: counter(page);
                    font-size: 10pt;
                    color: #64748b;
                    font-family: 'Inter', sans-serif;
                }}
                @bottom-left {{
                    content: "Investimate.ai";
                    font-size: 9pt;
                    color: #64748b;
                    font-family: 'Inter', sans-serif;
                }}
            }}
            
            * {{
                box-sizing: border-box;
            }}
            
            body {{
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #e2e8f0;
                margin: 0;
                padding: 0;
                font-size: 11pt;
                background: #0f172a;
                counter-reset: page;
            }}
            
            /* Cover Page Styles */
            .cover-page {{
                position: relative;
                height: 100vh;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%);
                overflow: hidden;
                page-break-after: always;
            }}
            
            .cover-background {{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
            }}
            
            .gradient-orb {{
                position: absolute;
                border-radius: 50%;
                filter: blur(80px);
                opacity: 0.6;
            }}
            
            .orb-1 {{
                width: 300px;
                height: 300px;
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                top: -100px;
                right: -100px;
            }}
            
            .orb-2 {{
                width: 250px;
                height: 250px;
                background: linear-gradient(135deg, #06b6d4, #3b82f6);
                bottom: -50px;
                left: -50px;
            }}
            
            .orb-3 {{
                width: 200px;
                height: 200px;
                background: linear-gradient(135deg, #8b5cf6, #ec4899);
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }}
            
            .grid-overlay {{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
                background-size: 50px 50px;
                opacity: 0.3;
            }}
            
            .cover-content {{
                position: relative;
                z-index: 2;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 3rem 2rem;
            }}
            
            .logo-section {{
                text-align: center;
                margin-bottom: 2rem;
            }}
            
            .brand-logo {{
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
            }}
            
            .logo-text {{
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }}
            
            .logo-ai {{
                color: #10b981;
            }}
            
            .ai-badge {{
                display: inline-block;
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.3);
                color: #10b981;
                padding: 0.5rem 1rem;
                border-radius: 25px;
                font-size: 0.9rem;
                font-weight: 500;
                backdrop-filter: blur(10px);
            }}
            
            .company-section {{
                text-align: center;
                margin: 2rem 0;
            }}
            
            .company-name {{
                font-size: 3.5rem;
                font-weight: 800;
                margin-bottom: 0.8rem;
                color: #ffffff;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                letter-spacing: 0.05em;
            }}
            
            .report-type {{
                font-size: 1.5rem;
                font-weight: 600;
                color: #e2e8f0;
                margin-bottom: 1.2rem;
            }}
            
            .report-date {{
                font-size: 1.1rem;
                color: #e2e8f0;
                font-weight: 500;
            }}
            
            .metrics-grid {{
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1.5rem;
                margin: 3rem 0;
            }}
            
            .metric-card {{
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 2rem 1.5rem;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }}
            
            .metric-icon {{
                font-size: 2rem;
                margin-bottom: 1rem;
            }}
            
            .metric-label {{
                font-size: 0.9rem;
                color: #94a3b8;
                margin-bottom: 0.5rem;
                font-weight: 500;
            }}
            
            .metric-value {{
                font-size: 1.4rem;
                font-weight: 700;
            }}
            
            .recommendation-value {{
                color: #3b82f6;
            }}
            
            .target-value {{
                color: #10b981;
            }}
            
            .risk-value {{
                font-weight: 700;
            }}
            
            .risk-high {{ color: #ef4444; }}
            .risk-medium {{ color: #f59e0b; }}
            .risk-low {{ color: #10b981; }}
            
            .cover-footer {{
                text-align: center;
                margin-top: auto;
            }}
            
            .tech-badge {{
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(139, 92, 246, 0.1);
                border: 1px solid rgba(139, 92, 246, 0.3);
                color: #a78bfa;
                padding: 0.75rem 1.5rem;
                border-radius: 25px;
                font-size: 0.95rem;
                font-weight: 500;
                backdrop-filter: blur(10px);
                margin-bottom: 1rem;
            }}
            
            .disclaimer-note {{
                font-size: 0.9rem;
                color: #64748b;
                max-width: 500px;
                margin: 0 auto;
            }}
            
            /* Table of Contents */
            .toc-page {{
                position: relative;
                min-height: 80vh;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                page-break-after: always;
                padding: 2rem;
            }}
            
            .toc-title {{
                font-size: 2.2rem;
                font-weight: 700;
                color: #ffffff;
                margin-bottom: 2.5rem;
                border-bottom: 3px solid #3b82f6;
                padding-bottom: 0.8rem;
            }}
            
            .toc-content {{
                max-width: 800px;
                margin: 0 auto;
            }}
            
            .toc-item {{
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.8rem 0;
                margin: 0.5rem 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                position: relative;
            }}
            
            .toc-left {{
                flex: 1;
            }}
            
            .toc-right {{
                margin-left: 1rem;
                position: relative;
            }}
            
            .toc-section {{
                font-size: 1.1rem;
                font-weight: 600;
                color: #e2e8f0;
                position: relative;
                z-index: 1;
            }}
            
            .toc-item::after {{
                content: "";
                position: absolute;
                bottom: 0.6rem;
                left: 0;
                right: 3.5rem;
                border-bottom: 1px dotted rgba(255, 255, 255, 0.2);
            }}
            
            /* Section Styles */
            .section {{
                position: relative;
                margin-bottom: 2rem;
                padding: 0 1rem;
            }}
            
            .section-header {{
                position: relative;
                margin-bottom: 2rem;
                border-bottom: 3px solid #3b82f6;
                padding-bottom: 0.8rem;
            }}
            
            .section-title {{
                font-size: 2rem;
                font-weight: 700;
                color: #ffffff;
                margin: 0;
            }}
            
            /* Content Typography */
            .content-h1 {{
                font-size: 1.8rem;
                color: #ffffff;
                margin: 2.5rem 0 1.2rem 0;
                font-weight: 700;
                border-bottom: 2px solid #3b82f6;
                padding-bottom: 0.5rem;
                clear: both;
            }}
            
            .content-h2 {{
                font-size: 1.5rem;
                color: #e2e8f0;
                margin: 2rem 0 1rem 0;
                font-weight: 600;
                border-left: 4px solid #3b82f6;
                padding-left: 1rem;
                clear: both;
            }}
            
            .content-h3 {{
                font-size: 1.3rem;
                color: #cbd5e1;
                margin: 1.8rem 0 0.8rem 0;
                font-weight: 600;
                clear: both;
            }}
            
            .content-paragraph {{
                color: #e2e8f0;
                margin: 1.2rem 0;
                line-height: 1.7;
                text-align: justify;
                padding: 0;
            }}
            
            .highlight-text {{
                font-weight: 700;
                color: #3b82f6;
                background: rgba(59, 130, 246, 0.1);
                padding: 0.2rem 0.4rem;
                border-radius: 6px;
            }}
            
            .italic-text {{
                font-style: italic;
                color: #94a3b8;
            }}
            
            .inline-code {{
                background: rgba(139, 92, 246, 0.1);
                color: #a78bfa;
                padding: 0.2rem 0.4rem;
                border-radius: 6px;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
            }}
            
            .code-block {{
                background: rgba(0, 0, 0, 0.3);
                color: #10b981;
                padding: 1rem;
                border-radius: 10px;
                margin: 1rem 0;
                font-family: 'Courier New', monospace;
                border: 1px solid rgba(16, 185, 129, 0.3);
                overflow-x: auto;
            }}
            
            .quote-block {{
                background: rgba(59, 130, 246, 0.1);
                border-left: 4px solid #3b82f6;
                padding: 1rem 1.5rem;
                margin: 1rem 0;
                border-radius: 0 10px 10px 0;
                font-style: italic;
                color: #94a3b8;
            }}
            
            /* Lists */
            .bullet-list {{
                margin: 1.5rem 0;
                padding-left: 1.2rem;
                list-style: none;
            }}
            
            .bullet-item {{
                position: relative;
                padding-left: 1.5rem;
                margin: 0.7rem 0;
                color: #e2e8f0;
                line-height: 1.6;
            }}
            
            .bullet-item::before {{
                content: '•';
                position: absolute;
                left: 0;
                top: 0.1em;
                color: #3b82f6;
                font-size: 1.2rem;
                font-weight: bold;
            }}
            
            .numbered-list {{
                margin: 1.5rem 0;
                padding-left: 1.5rem;
                counter-reset: item;
            }}
            
            .numbered-item {{
                position: relative;
                margin: 0.5rem 0;
                padding-left: 1.5rem;
                color: #e2e8f0;
                line-height: 1.6;
                counter-increment: item;
            }}
            
            .numbered-item::before {{
                content: counter(item) ".";
                position: absolute;
                left: -1rem;
                color: #3b82f6;
                font-weight: 600;
            }}
            
            /* Tables */
            .data-table {{
                width: 100%;
                border-collapse: collapse;
                margin: 2rem 0;
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }}
            
            .data-table th {{
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                color: white;
                padding: 1rem;
                font-weight: 600;
                text-align: left;
                font-size: 0.95rem;
            }}
            
            .data-table td {{
                padding: 1rem;
                color: #e2e8f0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }}
            
            .data-table tr:nth-child(even) {{
                background: rgba(255, 255, 255, 0.02);
            }}
            
            .data-table tr:hover {{
                background: rgba(59, 130, 246, 0.05);
            }}
            
            /* Page Breaks */
            .page-break {{
                page-break-before: always;
            }}
            
            /* Disclaimer Page */
            .disclaimer-page {{
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                padding: 2rem;
            }}
            
            .disclaimer-header {{
                margin-bottom: 2rem;
            }}
            
            .disclaimer-section {{
                margin: 1.5rem 0;
                padding: 1.2rem;
                background: rgba(255, 255, 255, 0.05);
                border-left: 4px solid #3b82f6;
                border-radius: 0 8px 8px 0;
            }}
            
            .disclaimer-section h3 {{
                font-size: 1.2rem;
                font-weight: 600;
                color: #e2e8f0;
                margin-top: 0;
                margin-bottom: 0.8rem;
            }}
            
            .disclaimer-section p {{
                color: #cbd5e1;
                line-height: 1.6;
                margin: 0;
                text-align: justify;
            }}
            
            .generation-info {{
                margin-top: 2.5rem;
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                text-align: center;
            }}
            
            .generation-info p {{
                margin: 0.5rem 0;
                color: #94a3b8;
            }}
            """
            
            print(f"[CSS] Generated CSS successfully for {self.company_name}")
            return css
            
        except Exception as e:
            print(f"[ERROR] Error generating CSS: {e}")
            traceback.print_exc()
            return ""

    def generate_pdf(self, sections, output_path=None):
        """Generate PDF from assembled sections with error handling"""
        try:
            print(f"[PDF] Starting PDF generation for {self.company_name}")
            print(f"[PDF] Sections received: {list(sections.keys()) if sections else 'None'}")

            # Validate input sections
            if not sections or not isinstance(sections, dict):
                error_msg = "Invalid or empty sections provided"
                print(f"[ERROR] {error_msg}")
                return (False, error_msg)

            if output_path is None:
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                output_dir = os.path.join(os.path.dirname(__file__), '..', 'reports')
                os.makedirs(output_dir, exist_ok=True)
                output_path = os.path.join(output_dir, f"{self.company_name.replace(' ', '_')}_report_{timestamp}.pdf")

            print(f"[PDF] Output path: {output_path}")

            # Test CSS generation first
            css_content = self.get_report_css()
            if not css_content:
                error_msg = "CSS generation failed"
                print(f"[ERROR] {error_msg}")
                return (False, error_msg)
            print(f"[PDF] CSS generated successfully ({len(css_content)} characters)")

            # Test HTML generation
            html_content = self.assemble_full_report(sections)
            if not html_content:
                error_msg = "HTML generation failed"
                print(f"[ERROR] {error_msg}")
                return (False, error_msg)
            print(f"[PDF] HTML assembled successfully ({len(html_content)} characters)")

            # Generate PDF
            try:
                HTML(string=html_content, base_url='.').write_pdf(
                    output_path,
                    stylesheets=[CSS(string=css_content)],
                    presentational_hints=True
                )
                print(f"[PDF] PDF written to {output_path}")
            except Exception as pdf_error:
                error_msg = f"WeasyPrint PDF generation failed: {pdf_error}"
                print(f"[ERROR] {error_msg}")
                return (False, error_msg)

            # Verify PDF was created
            if not os.path.exists(output_path):
                error_msg = f"PDF file was not created at {output_path}"
                print(f"[ERROR] {error_msg}")
                return (False, error_msg)

            # Check file size before upload
            file_size = os.path.getsize(output_path)
            print(f"[PDF] Generated PDF size: {file_size} bytes")

            if file_size == 0:
                error_msg = "Generated PDF file is empty"
                print(f"[ERROR] {error_msg}")
                return (False, error_msg)

            # Upload to Supabase
            try:
                storage_path = f"reports/{os.path.basename(output_path)}"
                upload_pdf_to_supabase(output_path, dest_path=storage_path)
                print(f"[Supabase] Uploaded PDF to: {storage_path}")
            except Exception as upload_error:
                error_msg = f"Supabase upload failed: {upload_error}"
                print(f"[ERROR] {error_msg}")
                # Clean up local file
                if os.path.exists(output_path):
                    os.remove(output_path)
                return (False, error_msg)

            # Clean up local file
            try:
                os.remove(output_path)
                print(f"[PDF] Local PDF deleted: {output_path}")
            except Exception as cleanup_error:
                print(f"[WARNING] Failed to delete local PDF: {cleanup_error}")

            return (True, storage_path)

        except Exception as e:
            error_msg = f"PDF generation/upload failed: {e}"
            print(f"[ERROR] {error_msg}")
            traceback.print_exc()
            return (False, error_msg)

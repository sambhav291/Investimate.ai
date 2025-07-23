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
            'target_price': 'TBD',
            'rating': 'Under Review'
        }
        
        if executive_summary:
            # Extract recommendation
            recommendation_match = re.search(r'Investment Recommendation.*?[:\*\*]\s*([A-Za-z\s]+)', executive_summary)
            if recommendation_match:
                metrics['recommendation'] = recommendation_match.group(1).strip()
            
            # Extract target price
            price_match = re.search(r'Target Price.*?Rs\s*([\d,.-]+)', executive_summary)
            if price_match:
                metrics['target_price'] = f"Rs {price_match.group(1)}"
        
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
            {self.generate_table_of_contents()}
            
            <div class="section" id="executive-summary">
                <h1 class="section-title">Executive Summary</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('executive_summary', 'Content not available'))}
                </div>
            </div>
            
            <div class="section page-break" id="investment-thesis">
                <h1 class="section-title">Investment Thesis</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('investment_thesis', 'Content not available'))}
                </div>
            </div>
            
            <div class="section page-break" id="financial-analysis">
                <h1 class="section-title">Financial Analysis</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('financial_analysis', 'Content not available'))}
                </div>
            </div>
            
            <div class="section page-break" id="business-analysis">
                <h1 class="section-title">Business Analysis</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('business_analysis', 'Content not available'))}
                </div>
            </div>
            
            <div class="section page-break" id="risk-assessment">
                <h1 class="section-title">Risk Assessment</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('risk_assessment', 'Content not available'))}
                </div>
            </div>
            
            <div class="section page-break" id="valuation">
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
        """Generate professional cover page with extracted metrics"""
        return f"""
        <div class="cover-page">
            <div class="logo-section">
                <h1 class="company-name">{self.company_name}</h1>
                <h2 class="report-type">Equity Research Report</h2>
            </div>
            
            <div class="report-details">
                <div class="detail-row">
                    <span class="label">Report Date:</span>
                    <span class="value">{self.report_date}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Analyst:</span>
                    <span class="value">AI Research Team</span>
                </div>
            </div>
            
            <div class="key-highlights">
                <div class="highlight-box recommendation-box">
                    <h3>Investment Recommendation</h3>
                    <div class="recommendation-value">{key_metrics['recommendation']}</div>
                </div>
                
                <div class="highlight-box target-box">
                    <h3>Price Target</h3>
                    <div class="target-value">{key_metrics['target_price']}</div>
                </div>
            </div>
            
            <div class="cover-footer">
                <p class="disclaimer-note">This report contains forward-looking statements and analysis based on available data.</p>
            </div>
        </div>
        """
    
    def generate_table_of_contents(self):
        """Generate table of contents with proper page references"""
        return """
        <div class="toc-page page-break">
            <h1 class="toc-title">Table of Contents</h1>
            
            <div class="toc-content">
                <div class="toc-item">
                    <span class="toc-section">Executive Summary</span>
                    <span class="toc-dots">...............................</span>
                    <span class="toc-page-num">3</span>
                </div>
                
                <div class="toc-item">
                    <span class="toc-section">Investment Thesis</span>
                    <span class="toc-dots">...............................</span>
                    <span class="toc-page-num">5</span>
                </div>
                
                <div class="toc-item">
                    <span class="toc-section">Financial Analysis</span>
                    <span class="toc-dots">...............................</span>
                    <span class="toc-page-num">8</span>
                </div>
                
                <div class="toc-item">
                    <span class="toc-section">Business Analysis</span>
                    <span class="toc-dots">...............................</span>
                    <span class="toc-page-num">11</span>
                </div>
                
                <div class="toc-item">
                    <span class="toc-section">Risk Assessment</span>
                    <span class="toc-dots">...............................</span>
                    <span class="toc-page-num">14</span>
                </div>
                
                <div class="toc-item">
                    <span class="toc-section">Valuation & Recommendation</span>
                    <span class="toc-dots">...............................</span>
                    <span class="toc-page-num">17</span>
                </div>
                
                <div class="toc-item">
                    <span class="toc-section">Important Disclosures</span>
                    <span class="toc-dots">...............................</span>
                    <span class="toc-page-num">19</span>
                </div>
            </div>
        </div>
        """
    
    def generate_disclaimer(self):
        """Generate comprehensive legal disclaimer"""
        return f"""
        <div class="disclaimer-page page-break" id="disclaimer">
            <h1 class="section-title">Important Disclosures</h1>
            
            <div class="disclaimer-section">
                <h3>Research Disclaimer</h3>
                <p>This report has been generated through automated analysis of publicly available information including earnings calls, annual reports, forum discussions, and market data. The content is for informational purposes only and should not be construed as personalized investment advice or a recommendation to buy, sell, or hold any securities.</p>
            </div>
            
            <div class="disclaimer-section">
                <h3>Risk Warning</h3>
                <p>All investments involve risk, including the potential loss of principal. Past performance does not guarantee future results. Market conditions, company fundamentals, and economic factors can significantly impact investment returns. Investors should carefully consider their risk tolerance and investment objectives before making any investment decisions.</p>
            </div>
            
            <div class="disclaimer-section">
                <h3>Data Sources & Accuracy</h3>
                <p>Information in this report is derived from publicly available sources including company financial statements, earnings transcripts, regulatory filings, and market data providers. While every effort has been made to ensure accuracy, we cannot guarantee the completeness or accuracy of all information presented.</p>
            </div>
            
            <div class="disclaimer-section">
                <h3>Professional Advice</h3>
                <p>Before making any investment decisions, investors should consult with qualified financial advisors, tax professionals, and legal counsel as appropriate for their individual circumstances.</p>
            </div>
            
            <div class="generation-info">
                <p><strong>Report Generated:</strong> {self.report_date}</p>
                <p><strong>Version:</strong> Automated Research Report v2.0</p>
            </div>
        </div>
        """
    
    def get_report_css(self):
        """Enhanced CSS styling for professional appearance"""
        return """
        @page {
            size: A4;
            margin: 0.75in;
            @top-right {
                content: counter(page);
                font-size: 10pt;
                color: #666;
            }
        }
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            font-size: 11pt;
        }
        
        /* Cover Page Styles */
        .cover-page {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100vh;
            padding: 2em;
            text-align: center;
            page-break-after: always;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .logo-section {
            margin-top: 20%;
        }
        
        .company-name {
            font-size: 3em;
            font-weight: 700;
            margin-bottom: 0.2em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .report-type {
            font-size: 1.5em;
            font-weight: 300;
            margin-bottom: 2em;
            opacity: 0.9;
        }
        
        .report-details {
            margin: 2em 0;
        }
        
        .detail-row {
            display: flex;
            justify-content: center;
            margin: 0.5em 0;
            font-size: 1.1em;
        }
        
        .label {
            font-weight: 600;
            margin-right: 1em;
        }
        
        .value {
            font-weight: 300;
        }
        
        .key-highlights {
            display: flex;
            justify-content: space-around;
            margin: 3em 0;
        }
        
        .highlight-box {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            padding: 1.5em;
            margin: 0 1em;
            flex: 1;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        
        .highlight-box h3 {
            margin: 0 0 0.5em 0;
            font-size: 1em;
            opacity: 0.8;
        }
        
        .recommendation-value, .target-value {
            font-size: 1.3em;
            font-weight: 600;
        }
        
        .cover-footer {
            margin-top: auto;
            opacity: 0.7;
            font-size: 0.9em;
        }
        
        /* Table of Contents Styles */
        .toc-page {
            padding: 2em 0;
            page-break-after: always;
        }
        
        .toc-title {
            font-size: 2.2em;
            color: #2c3e50;
            margin-bottom: 2em;
            text-align: center;
            border-bottom: 3px solid #3498db;
            padding-bottom: 0.5em;
        }
        
        .toc-content {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .toc-item {
            display: flex;
            align-items: center;
            margin: 1em 0;
            font-size: 1.1em;
            padding: 0.5em 0;
        }
        
        .toc-section {
            font-weight: 600;
            color: #2c3e50;
        }
        
        .toc-dots {
            flex: 1;
            margin: 0 1em;
            color: #bdc3c7;
            overflow: hidden;
        }
        
        .toc-page-num {
            font-weight: 600;
            color: #3498db;
            min-width: 30px;
            text-align: right;
        }
        
        /* Section Styles */
        .section {
            margin: 2em 0;
            padding: 1em 0;
        }
        
        .section-title {
            font-size: 2.2em;
            color: #2c3e50;
            margin-bottom: 1.5em;
            padding-bottom: 0.5em;
            border-bottom: 3px solid #3498db;
            font-weight: 700;
        }
        
        .content {
            line-height: 1.7;
        }
        
        .content h1 {
            font-size: 1.8em;
            color: #34495e;
            margin: 2em 0 1em 0;
            font-weight: 600;
        }
        
        .content h2 {
            font-size: 1.4em;
            color: #34495e;
            margin: 1.5em 0 1em 0;
            font-weight: 600;
        }
        
        .content h3 {
            font-size: 1.2em;
            color: #34495e;
            margin: 1.2em 0 0.8em 0;
            font-weight: 600;
        }
        
        .content p {
            margin: 1em 0;
            text-align: justify;
        }
        
        .content ul {
            margin: 1em 0;
            padding-left: 2em;
        }
        
        .content li {
            margin: 0.5em 0;
            line-height: 1.6;
        }
        
        .content strong {
            font-weight: 700;
            color: #2c3e50;
        }
        
        /* Page Breaks */
        .page-break {
            page-break-before: always;
        }
        
        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 2em 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        th, td {
            border: 1px solid #e1e8ed;
            padding: 0.8em;
            text-align: left;
        }
        
        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
            font-size: 0.95em;
        }
        
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        /* Special Elements */
        .highlight {
            background: linear-gradient(135deg, #fff3e0, #ffe0b3);
            border-left: 4px solid #ff9800;
            padding: 1.5em;
            margin: 2em 0;
            border-radius: 0 8px 8px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .risk-high {
            color: #e74c3c;
            font-weight: 700;
        }
        
        .risk-medium {
            color: #f39c12;
            font-weight: 700;
        }
        
        .risk-low {
            color: #27ae60;
            font-weight: 700;
        }
        
        /* Disclaimer Page */
        .disclaimer-page {
            padding: 2em 0;
        }
        
        .disclaimer-section {
            margin: 2em 0;
            padding: 1.5em;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #6c757d;
        }
        
        .disclaimer-section h3 {
            color: #495057;
            margin-top: 0;
            font-weight: 600;
        }
        
        .disclaimer-section p {
            margin-bottom: 0;
            line-height: 1.6;
            text-align: justify;
        }
        
        .generation-info {
            margin-top: 3em;
            padding: 1em;
            background-color: #e9ecef;
            border-radius: 5px;
            text-align: center;
            font-size: 0.95em;
            color: #6c757d;
        }
        
        .generation-info p {
            margin: 0.5em 0;
        }
        """
    
    def generate_pdf(self, sections, output_path=None):
        """Generate PDF from assembled sections with error handling"""
        
        if output_path is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            output_dir = os.path.join(os.path.dirname(__file__), '..', 'reports')
            os.makedirs(output_dir, exist_ok=True)
            output_path = os.path.join(output_dir, f"{self.company_name.replace(' ', '_')}_report_{timestamp}.pdf")
            try:
                html_content = self.assemble_full_report(sections)
                print(f"[PDF] Assembled HTML content for {output_path}")

                HTML(string=html_content, base_url='.').write_pdf(
                    output_path,
                    stylesheets=[CSS(string=self.get_report_css())],
                    presentational_hints=True
                )
                print(f"[PDF] PDF written to {output_path}")

                # Check file size before upload
                file_size = os.path.getsize(output_path)
                print(f"[PDF] Generated PDF size: {file_size} bytes")

                storage_path = f"reports/{os.path.basename(output_path)}"
                upload_pdf_to_supabase(output_path, dest_path=storage_path)
                print(f"[Supabase] Uploaded PDF to: {storage_path}")

                os.remove(output_path)
                print(f"[PDF] Local PDF deleted: {output_path}")

                return storage_path

            except Exception as e:
                print(f"[ERROR] PDF generation/upload failed: {e}")
                import traceback; traceback.print_exc()
                return None
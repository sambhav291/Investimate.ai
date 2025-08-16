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
        """Convert markdown-style content to proper HTML with better table and formatting support"""
        if not content:
            return ""
        
        # Clean up the content first
        content = content.strip()
        
        # Fix the "Prepared by" issue - replace with our signature
        content = re.sub(
            r'---\s*\*Prepared by:.*?\*',
            '<div class="section-footer">Prepared with Investimate.ai</div>',
            content,
            flags=re.IGNORECASE | re.DOTALL
        )
        
        # Convert headers
        content = re.sub(r'^### (.*?)$', r'<h3>\1</h3>', content, flags=re.MULTILINE)
        content = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', content, flags=re.MULTILINE)
        content = re.sub(r'^# (.*?)$', r'<h1>\1</h1>', content, flags=re.MULTILINE)
        
        # Fix bold text - handle both **text** and *text* formats
        content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', content)
        content = re.sub(r'(?<!\*)\*([^*\s][^*]*?[^*\s])\*(?!\*)', r'<strong>\1</strong>', content)
        
        # Handle tables - detect and convert markdown tables
        content = self._convert_tables(content)
        
        # Convert bullet points with better detection
        content = re.sub(r'^[\s]*[-•]\s+(.*?)$', r'<li>\1</li>', content, flags=re.MULTILINE)
        
        # Convert numbered lists
        content = re.sub(r'^[\s]*\d+\.\s+(.*?)$', r'<li>\1</li>', content, flags=re.MULTILINE)
        
        # Group consecutive list items
        content = self._group_list_items(content)
        
        # Convert paragraphs - but be careful with existing HTML
        content = self._convert_paragraphs(content)
        
        # Clean up extra whitespace
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
        
        return content

    def _convert_tables(self, content):
        """Convert markdown tables to proper HTML tables"""
        lines = content.split('\n')
        in_table = False
        table_lines = []
        result_lines = []
        
        for line in lines:
            # Check if this line looks like a table row
            if '|' in line and line.count('|') >= 2:
                if not in_table:
                    in_table = True
                    table_lines = []
                table_lines.append(line.strip())
            else:
                # If we were in a table, process it
                if in_table:
                    result_lines.extend(self._process_table(table_lines))
                    table_lines = []
                    in_table = False
                result_lines.append(line)
        
        # Handle table at end of content
        if in_table and table_lines:
            result_lines.extend(self._process_table(table_lines))
        
        return '\n'.join(result_lines)

    def _process_table(self, table_lines):
        """Process a group of table lines into proper HTML table"""
        if len(table_lines) < 2:
            return table_lines
        
        # Filter out separator lines (lines with mostly - and |)
        data_lines = []
        header_line = None
        
        for line in table_lines:
            if re.match(r'^[\s\|:\-]+$', line):
                continue  # Skip separator lines
            elif header_line is None:
                header_line = line
            else:
                data_lines.append(line)
        
        if not header_line:
            return table_lines
        
        # Parse header
        header_cells = [cell.strip() for cell in header_line.split('|') if cell.strip()]
        
        # Parse data rows
        rows = []
        for line in data_lines:
            cells = [cell.strip() for cell in line.split('|') if cell.strip()]
            if cells:  # Only add non-empty rows
                rows.append(cells)
        
        # Build HTML table
        if not header_cells or not rows:
            return table_lines
        
        html_lines = ['<table>']
        
        # Add header
        html_lines.append('<thead><tr>')
        for cell in header_cells:
            html_lines.append(f'<th>{cell}</th>')
        html_lines.append('</tr></thead>')
        
        # Add body
        html_lines.append('<tbody>')
        for row in rows:
            html_lines.append('<tr>')
            for i, cell in enumerate(row):
                if i < len(header_cells):  # Ensure we don't exceed column count
                    # Add styling for financial metrics
                    cell_class = ""
                    cell_clean = cell.replace('₹', '').replace(',', '').strip()
                    if re.match(r'^[\+\-]?[\d,]+\.?\d*%?$', cell_clean):
                        if cell.startswith('+') or (cell_clean.replace('%', '').replace(',', '').replace('.', '').replace('₹', '').replace(',', '').isdigit() and float(cell_clean.replace('%', '').replace(',', '').replace('₹', '').replace(',', '')) > 0):
                            cell_class = ' class="metric-positive"'
                        elif cell.startswith('-'):
                            cell_class = ' class="metric-negative"'
                    html_lines.append(f'<td{cell_class}>{cell}</td>')
            html_lines.append('</tr>')
        html_lines.append('</tbody>')
        
        html_lines.append('</table>')
        
        return html_lines

    def _group_list_items(self, content):
        """Group consecutive list items into proper ul/ol tags"""
        # Handle unordered lists
        content = re.sub(
            r'(<li>.*?</li>(?:\s*<li>.*?</li>)*)',
            lambda m: f'<ul>{m.group(1)}</ul>',
            content,
            flags=re.DOTALL
        )
        
        return content

    def _convert_paragraphs(self, content):
        """Convert double line breaks to paragraphs while preserving HTML structure"""
        # Split by double line breaks
        sections = re.split(r'\n\s*\n', content)
        formatted_sections = []
        
        for section in sections:
            section = section.strip()
            if not section:
                continue
                
            # Don't wrap if it's already HTML or a list
            if (section.startswith('<') and section.endswith('>')) or \
               '<li>' in section or '<table>' in section or \
               '<h1>' in section or '<h2>' in section or '<h3>' in section:
                formatted_sections.append(section)
            else:
                # Wrap in paragraph tags
                formatted_sections.append(f'<p>{section}</p>')
        
        return '\n\n'.join(formatted_sections)
    
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
        """Assemble all sections into a complete HTML report with improved formatting"""
        
        # Extract key metrics for cover page
        key_metrics = self.extract_key_metrics(sections.get('executive_summary', ''))
        
        html_report = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>{self.company_name.upper()} - Investment Research Report</title>
            <style>
                {self.get_report_css()}
            </style>
        </head>
        <body>
            {self.generate_cover_page(key_metrics)}
            {self.generate_table_of_contents()}
            
            <div class="section" id="executive-summary">
                <div class="page-header clearfix">
                    <div class="header-left">
                        <span class="header-company">{self.company_name.upper()}</span>
                        <span class="header-separator">|</span>
                        <span class="header-section">Executive Summary</span>
                    </div>
                </div>
                <h1 class="section-title">Executive Summary</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('executive_summary', 'Content not available'))}
                </div>
            </div>
            
            <div class="section page-break" id="investment-thesis">
                <div class="page-header clearfix">
                    <div class="header-left">
                        <span class="header-company">{self.company_name.upper()}</span>
                        <span class="header-separator">|</span>
                        <span class="header-section">Investment Thesis</span>
                    </div>
                </div>
                <h1 class="section-title">Investment Thesis</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('investment_thesis', 'Content not available'))}
                </div>
            </div>
            
            <div class="section page-break" id="financial-analysis">
                <div class="page-header clearfix">
                    <div class="header-left">
                        <span class="header-company">{self.company_name.upper()}</span>
                        <span class="header-separator">|</span>
                        <span class="header-section">Financial Analysis</span>
                    </div>
                </div>
                <h1 class="section-title">Financial Analysis</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('financial_analysis', 'Content not available'))}
                </div>
            </div>
            
            <div class="section page-break" id="business-analysis">
                <div class="page-header clearfix">
                    <div class="header-left">
                        <span class="header-company">{self.company_name.upper()}</span>
                        <span class="header-separator">|</span>
                        <span class="header-section">Business Analysis</span>
                    </div>
                </div>
                <h1 class="section-title">Business Analysis</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('business_analysis', 'Content not available'))}
                </div>
            </div>
            
            <div class="section page-break" id="risk-assessment">
                <div class="page-header clearfix">
                    <div class="header-left">
                        <span class="header-company">{self.company_name.upper()}</span>
                        <span class="header-separator">|</span>
                        <span class="header-section">Risk Assessment</span>
                    </div>
                </div>
                <h1 class="section-title">Risk Assessment</h1>
                <div class="content">
                    {self.convert_markdown_to_html(sections.get('risk_assessment', 'Content not available'))}
                </div>
            </div>
            
            <div class="section page-break" id="valuation">
                <div class="page-header clearfix">
                    <div class="header-left">
                        <span class="header-company">{self.company_name.upper()}</span>
                        <span class="header-separator">|</span>
                        <span class="header-section">Valuation & Recommendation</span>
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
        """Generate modern, professional cover page with improved layout"""
        return f"""
        <div class="cover-page">
            <!-- Enhanced Header with better logo placement -->
            <div class="cover-header">
                <div class="logo-container">
                    <div class="logo">💼</div>
                    <div class="logo-text">
                        <span class="brand-name">Investimate</span>
                        <span class="brand-tagline">AI-Powered Investment Research</span>
                    </div>
                </div>
            </div>
            
            <!-- Main content with improved typography -->
            <div class="cover-main">
                <div class="cover-badge">
                    <span class="badge-text">Equity Research Report</span>
                </div>
                
                <h1 class="cover-company-name">{self.company_name.upper()}</h1>
                
                <div class="cover-subtitle">
                    <span class="subtitle-text">Comprehensive Investment Analysis</span>
                </div>
                
                <!-- Analysis Date Card -->
                <div class="analysis-date">
                    <div class="date-label">Analysis Date</div>
                    <div class="date-value">{self.report_date}</div>
                </div>
                
                <!-- Feature grid using table layout for WeasyPrint -->
                <div class="feature-grid">
                    <div class="feature-row">
                        <div class="feature-item">
                            <div class="feature-icon">⚡</div>
                            <div class="feature-title">Real-time Analysis</div>
                            <div class="feature-desc">Up-to-date market insights and trends</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">🤖</div>
                            <div class="feature-title">AI-Powered</div>
                            <div class="feature-desc">Advanced algorithms and pattern recognition</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Enhanced Footer -->
            <div class="cover-footer">
                <div class="footer-warning">
                    <div class="warning-text">
                        <strong>⚠ Disclaimer:</strong> This report is for informational purposes only and does not constitute investment advice. 
                        Please consult with qualified financial advisors before making investment decisions.
                    </div>
                </div>
            </div>
        </div>
        """
    
    def generate_table_of_contents(self):
        """Generate enhanced table of contents"""
        return """
        <div class="toc-page page-break">
            <div class="page-header clearfix">
                <div class="header-left">
                    <span class="header-company">Table of Contents</span>
                </div>
            </div>
            
            <h1 class="toc-title">Table of Contents</h1>
            
            <div class="toc-content">
                <div class="toc-item">
                    <div class="toc-number">01</div>
                    <div class="toc-section">
                        <div class="toc-section-title">Executive Summary</div>
                        <div class="toc-section-desc">Key findings, investment highlights, and recommendation overview</div>
                    </div>
                </div>
                
                <div class="toc-item">
                    <div class="toc-number">02</div>
                    <div class="toc-section">
                        <div class="toc-section-title">Investment Thesis</div>
                        <div class="toc-section-desc">Core investment rationale, strategic positioning, and growth drivers</div>
                    </div>
                </div>
                
                <div class="toc-item">
                    <div class="toc-number">03</div>
                    <div class="toc-section">
                        <div class="toc-section-title">Financial Analysis</div>
                        <div class="toc-section-desc">Revenue trends, profitability metrics, and financial health assessment</div>
                    </div>
                </div>
                
                <div class="toc-item">
                    <div class="toc-number">04</div>
                    <div class="toc-section">
                        <div class="toc-section-title">Business Analysis</div>
                        <div class="toc-section-desc">Market position, competitive advantages, and operational excellence</div>
                    </div>
                </div>
                
                <div class="toc-item">
                    <div class="toc-number">05</div>
                    <div class="toc-section">
                        <div class="toc-section-title">Risk Assessment</div>
                        <div class="toc-section-desc">Key risks, mitigation strategies, and sensitivity analysis</div>
                    </div>
                </div>
                
                <div class="toc-item">
                    <div class="toc-number">06</div>
                    <div class="toc-section">
                        <div class="toc-section-title">Valuation & Recommendation</div>
                        <div class="toc-section-desc">Valuation methodology, price targets, and investment recommendation</div>
                    </div>
                </div>
            </div>
        </div>
        """
    
    def generate_disclaimer(self):
        """Generate comprehensive legal disclaimer with fixed layout for single page"""
        return f"""
        <div class="disclaimer-page page-break clearfix" id="disclaimer">
            <div class="page-header clearfix">
                <div class="header-left">
                    <span class="header-company">{self.company_name.upper()}</span>
                    <span class="header-separator">|</span>
                    <span class="header-section">Important Disclosures</span>
                </div>
            </div>
            
            <h1 class="section-title">Important Disclosures</h1>
            
            <div class="disclaimer-grid">
                <div class="disclaimer-card">
                    <div class="disclaimer-icon">📋</div>
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
                    <p>Before making any investment decisions, investors should consult with qualified financial advisors, tax professionals, and legal counsel as appropriate for their individual circumstances. This report should be used as one of many tools in your investment decision-making process.</p>
                </div>
            </div>
            
            <div class="generation-info">
                <div class="info-row">
                    <span class="info-label">Report Generated:</span>
                    <span class="info-value">{self.report_date}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Version:</span>
                    <span class="info-value">Automated Research Report v4.0</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Powered by:</span>
                    <span class="info-value">Investimate AI Research Platform</span>
                </div>
            </div>
        </div>
        """
    
    def get_report_css(self):
        """Modern, visually appealing CSS compatible with WeasyPrint"""
        return """
        @page {
            size: A4;
            margin: 0.75in;
            @top-right {
                content: "Page " counter(page);
                font-size: 9pt;
                color: #64748b;
                font-weight: 500;
            }
        }
        
        :root {
            --primary-color: #6366f1;
            --primary-dark: #4338ca;
            --primary-light: #a5b4fc;
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
            --gradient-start: #667eea;
            --gradient-end: #764ba2;
        }
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            margin: 0;
            padding: 0;
            font-size: 11pt;
            font-weight: 400;
        }
        
        /* Cover Page - Modern and Classy Design */
        .cover-page {
            padding: 0;
            page-break-after: always;
            background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
            color: white;
            min-height: 900px;
            position: relative;
        }
        
        /* Geometric pattern background */
        .cover-page::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%);
            background-size: 200px 200px, 300px 300px;
        }
        
        .cover-header {
            padding: 3rem 3rem 2rem;
            position: relative;
            z-index: 2;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .logo-container {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }
        
        .logo {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
        }
        
        .logo-text {
            flex: 1;
        }
        
        .brand-name {
            font-size: 2rem;
            font-weight: 800;
            color: white;
            display: block;
            margin-bottom: 0.25rem;
            letter-spacing: -0.5px;
        }
        
        .brand-tagline {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.85);
            font-weight: 400;
            letter-spacing: 0.5px;
        }
        
        .cover-main {
            padding: 4rem 3rem;
            text-align: center;
            position: relative;
            z-index: 2;
            flex: 1;
        }
        
        .cover-badge {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 50px;
            padding: 1rem 2.5rem;
            margin-bottom: 3rem;
            display: inline-block;
        }
        
        .badge-text {
            color: white;
            font-size: 0.875rem;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        
        .cover-company-name {
            font-size: 4.5rem;
            font-weight: 900;
            color: white;
            margin: 0 0 2rem 0;
            line-height: 0.85;
            letter-spacing: -2px;
            text-transform: uppercase;
        }
        
        .cover-subtitle {
            margin-bottom: 3rem;
        }
        
        .subtitle-text {
            font-size: 1.375rem;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 300;
            letter-spacing: 0.5px;
        }
        
        .analysis-date {
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 12px;
            padding: 1.5rem 2rem;
            margin: 2rem auto;
            max-width: 400px;
            text-align: center;
        }
        
        .date-label {
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .date-value {
            font-size: 1.25rem;
            font-weight: 600;
            color: white;
        }
        
        .feature-grid {
            margin: 3rem 0;
            display: table;
            width: 100%;
            table-layout: fixed;
        }
        
        .feature-row {
            display: table-row;
        }
        
        .feature-item {
            display: table-cell;
            padding: 1.5rem;
            text-align: center;
            vertical-align: middle;
            width: 50%;
        }
        
        .feature-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
            display: block;
        }
        
        .feature-title {
            font-weight: 600;
            color: white;
            margin-bottom: 0.5rem;
            font-size: 1.125rem;
        }
        
        .feature-desc {
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.4;
        }
        
        .cover-footer {
            padding: 2rem 3rem 3rem;
            position: relative;
            z-index: 2;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .footer-warning {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 12px;
            padding: 1.25rem 1.5rem;
            text-align: center;
        }
        
        .warning-text {
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.5;
        }
        
        /* Page Headers - Remove date, show page numbers */
        .page-header {
            padding: 0.75rem 0;
            margin-bottom: 2rem;
            border-bottom: 3px solid var(--primary-color);
            font-size: 0.875rem;
            position: relative;
            overflow: hidden;
        }
        
        .page-header::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            width: 60px;
            height: 3px;
            background: var(--secondary-color);
        }
        
        .header-left {
            float: left;
        }
        
        .header-company {
            font-weight: 700;
            color: var(--primary-color);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .header-separator {
            color: var(--text-muted);
            margin: 0 0.75rem;
        }
        
        .header-section {
            color: var(--text-secondary);
            font-weight: 500;
        }
        
        /* Table of Contents - Enhanced */
        .toc-page {
            padding: 3rem 0;
            page-break-after: always;
        }
        
        .toc-title {
            font-size: 3rem;
            color: var(--text-primary);
            margin-bottom: 3rem;
            text-align: center;
            font-weight: 800;
            position: relative;
        }
        
        .toc-title::after {
            content: '';
            position: absolute;
            bottom: -1rem;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border-radius: 2px;
        }
        
        .toc-content {
            max-width: 700px;
            margin: 0 auto;
        }
        
        .toc-item {
            margin: 1.5rem 0;
            padding: 2rem;
            background: var(--background-card);
            border-radius: 16px;
            border-left: 6px solid var(--primary-color);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            page-break-inside: avoid;
        }
        
        .toc-number {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            border-radius: 12px;
            display: inline-block;
            text-align: center;
            line-height: 50px;
            font-weight: 700;
            font-size: 1.125rem;
            float: left;
            margin-right: 1.5rem;
        }
        
        .toc-section {
            margin-left: 75px;
        }
        
        .toc-section-title {
            font-weight: 700;
            color: var(--text-primary);
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
        }
        
        .toc-section-desc {
            color: var(--text-secondary);
            font-size: 0.9rem;
            line-height: 1.5;
        }
        
        /* Section Styles - Enhanced */
        .section {
            margin: 3rem 0;
            padding: 1rem 0;
            clear: both;
        }
        
        .section-title {
            font-size: 2.75rem;
            color: var(--primary-color);
            margin-bottom: 2.5rem;
            font-weight: 800;
            position: relative;
            padding-bottom: 1rem;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 120px;
            height: 6px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border-radius: 3px;
        }
        
        .content {
            line-height: 1.8;
            font-size: 11.5pt;
        }
        
        .content h1 {
            font-size: 2rem;
            color: var(--text-primary);
            margin: 3rem 0 1.5rem 0;
            font-weight: 700;
            border-left: 6px solid var(--primary-color);
            padding-left: 1.5rem;
            page-break-after: avoid;
        }
        
        .content h2 {
            font-size: 1.5rem;
            color: var(--text-primary);
            margin: 2.5rem 0 1rem 0;
            font-weight: 600;
            page-break-after: avoid;
        }
        
        .content h3 {
            font-size: 1.25rem;
            color: var(--text-primary);
            margin: 2rem 0 0.75rem 0;
            font-weight: 600;
            page-break-after: avoid;
        }
        
        .content p {
            margin: 1.5rem 0;
            text-align: justify;
            color: var(--text-primary);
            line-height: 1.8;
        }
        
        .content ul {
            margin: 2rem 0;
            padding-left: 0;
        }
        
        .content li {
            margin: 1rem 0;
            line-height: 1.7;
            list-style: none;
            position: relative;
            padding-left: 2rem;
            color: var(--text-primary);
        }
        
        .content li::before {
            content: '●';
            color: var(--primary-color);
            font-size: 1.2em;
            position: absolute;
            left: 0;
            font-weight: bold;
        }
        
        .content strong {
            font-weight: 700;
            color: var(--text-primary);
        }
        
        /* Enhanced Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 2.5rem 0;
            background: var(--background-card);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            page-break-inside: avoid;
        }
        
        th, td {
            padding: 1.25rem 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border-light);
            vertical-align: top;
        }
        
        th {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            font-weight: 700;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        tr:nth-child(even) {
            background-color: var(--background-light);
        }
        
        tr:hover {
            background-color: rgba(99, 102, 241, 0.02);
        }
        
        td:first-child {
            font-weight: 600;
            color: var(--text-primary);
        }
        
        /* Financial metrics styling */
        .metric-positive {
            color: var(--success-color);
            font-weight: 600;
        }
        
        .metric-negative {
            color: var(--danger-color);
            font-weight: 600;
        }
        
        /* Page Breaks */
        .page-break {
            page-break-before: always;
        }
        
        /* Risk Indicators */
        .risk-high {
            color: var(--danger-color);
            font-weight: 700;
            background: rgba(239, 68, 68, 0.1);
            padding: 0.375rem 0.75rem;
            border-radius: 6px;
            border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .risk-medium {
            color: var(--warning-color);
            font-weight: 700;
            background: rgba(245, 158, 11, 0.1);
            padding: 0.375rem 0.75rem;
            border-radius: 6px;
            border: 1px solid rgba(245, 158, 11, 0.2);
        }
        
        .risk-low {
            color: var(--success-color);
            font-weight: 700;
            background: rgba(16, 185, 129, 0.1);
            padding: 0.375rem 0.75rem;
            border-radius: 6px;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        /* Enhanced callout boxes */
        .callout-box {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.05));
            border: 2px solid var(--primary-light);
            border-left: 6px solid var(--primary-color);
            border-radius: 12px;
            padding: 2rem;
            margin: 2rem 0;
            page-break-inside: avoid;
        }
        
        .callout-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        
        /* Disclaimer Page - Fixed Layout */
        .disclaimer-page {
            padding: 2rem 0;
            page-break-before: always;
        }
        
        .disclaimer-grid {
            margin: 2rem 0;
        }
        
        .disclaimer-card {
            background: var(--background-card);
            border: 2px solid var(--border-light);
            border-left: 6px solid var(--primary-color);
            border-radius: 12px;
            padding: 2rem;
            margin: 1.5rem 0;
            page-break-inside: avoid;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .disclaimer-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            display: block;
            color: var(--primary-color);
        }
        
        .disclaimer-card h3 {
            color: var(--text-primary);
            margin: 0 0 1rem 0;
            font-weight: 700;
            font-size: 1.25rem;
        }
        
        .disclaimer-card p {
            margin: 0;
            line-height: 1.7;
            text-align: justify;
            color: var(--text-secondary);
        }
        
        .generation-info {
            margin-top: 3rem;
            padding: 2rem;
            background: linear-gradient(135deg, var(--background-light), rgba(99, 102, 241, 0.03));
            border: 2px solid var(--border-light);
            border-radius: 16px;
            text-align: center;
        }
        
        .info-row {
            margin: 1rem 0;
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--border-light);
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .info-label {
            font-weight: 600;
            color: var(--text-secondary);
            margin-right: 1rem;
        }
        
        .info-value {
            font-weight: 700;
            color: var(--text-primary);
        }
        
        /* Prepared by signature */
        .section-footer {
            margin-top: 3rem;
            padding-top: 1rem;
            border-top: 2px solid var(--border-light);
            text-align: right;
            font-style: italic;
            color: var(--text-muted);
            font-size: 0.9rem;
        }
        
        /* Clear floats utility */
        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }
        
        /* Print optimizations */
        @media print {
            .cover-page {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
            
            .callout-box, .disclaimer-card, .toc-item {
                break-inside: avoid;
            }
            
            h1, h2, h3 {
                break-after: avoid;
            }
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
#             'rating': 'Under Review'
#         }
        
#         if executive_summary:
#             # Extract recommendation
#             recommendation_match = re.search(r'Investment Recommendation.*?[:\*\*]\s*([A-Za-z\s]+)', executive_summary)
#             if recommendation_match:
#                 metrics['recommendation'] = recommendation_match.group(1).strip()
        
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
#             <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
#             <style>
#                 {self.get_report_css()}
#             </style>
#         </head>
#         <body>
#             {self.generate_cover_page(key_metrics)}
#             {self.generate_table_of_contents()}
            
#             <div class="section" id="executive-summary">
#                 <div class="page-header">
#                     <div class="header-left">
#                         <span class="header-company">{self.company_name}</span>
#                         <span class="header-separator">|</span>
#                         <span class="header-section">Executive Summary</span>
#                     </div>
#                     <div class="header-right">
#                         <span class="header-date">{self.report_date}</span>
#                     </div>
#                 </div>
#                 <h1 class="section-title">Executive Summary</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('executive_summary', 'Content not available'))}
#                 </div>
#             </div>
            
#             <div class="section page-break" id="investment-thesis">
#                 <div class="page-header">
#                     <div class="header-left">
#                         <span class="header-company">{self.company_name}</span>
#                         <span class="header-separator">|</span>
#                         <span class="header-section">Investment Thesis</span>
#                     </div>
#                     <div class="header-right">
#                         <span class="header-date">{self.report_date}</span>
#                     </div>
#                 </div>
#                 <h1 class="section-title">Investment Thesis</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('investment_thesis', 'Content not available'))}
#                 </div>
#             </div>
            
#             <div class="section page-break" id="financial-analysis">
#                 <div class="page-header">
#                     <div class="header-left">
#                         <span class="header-company">{self.company_name}</span>
#                         <span class="header-separator">|</span>
#                         <span class="header-section">Financial Analysis</span>
#                     </div>
#                     <div class="header-right">
#                         <span class="header-date">{self.report_date}</span>
#                     </div>
#                 </div>
#                 <h1 class="section-title">Financial Analysis</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('financial_analysis', 'Content not available'))}
#                 </div>
#             </div>
            
#             <div class="section page-break" id="business-analysis">
#                 <div class="page-header">
#                     <div class="header-left">
#                         <span class="header-company">{self.company_name}</span>
#                         <span class="header-separator">|</span>
#                         <span class="header-section">Business Analysis</span>
#                     </div>
#                     <div class="header-right">
#                         <span class="header-date">{self.report_date}</span>
#                     </div>
#                 </div>
#                 <h1 class="section-title">Business Analysis</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('business_analysis', 'Content not available'))}
#                 </div>
#             </div>
            
#             <div class="section page-break" id="risk-assessment">
#                 <div class="page-header">
#                     <div class="header-left">
#                         <span class="header-company">{self.company_name}</span>
#                         <span class="header-separator">|</span>
#                         <span class="header-section">Risk Assessment</span>
#                     </div>
#                     <div class="header-right">
#                         <span class="header-date">{self.report_date}</span>
#                     </div>
#                 </div>
#                 <h1 class="section-title">Risk Assessment</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('risk_assessment', 'Content not available'))}
#                 </div>
#             </div>
            
#             <div class="section page-break" id="valuation">
#                 <div class="page-header">
#                     <div class="header-left">
#                         <span class="header-company">{self.company_name}</span>
#                         <span class="header-separator">|</span>
#                         <span class="header-section">Valuation & Recommendation</span>
#                     </div>
#                     <div class="header-right">
#                         <span class="header-date">{self.report_date}</span>
#                     </div>
#                 </div>
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
#         """Generate modern, professional cover page with branding"""
#         return f"""
#         <div class="cover-page">
#             <!-- Header with logo -->
#             <div class="cover-header">
#                 <div class="logo-container">
#                     <img src="https://investimate-ai-eight.vercel.app/Investimate%20logo.png" alt="Investimate" class="logo" />
#                     <div class="logo-text">
#                         <span class="brand-name">Investimate</span>
#                         <span class="brand-tagline">AI-Powered Investment Research</span>
#                     </div>
#                 </div>
#             </div>
            
#             <!-- Main content -->
#             <div class="cover-main">
#                 <div class="cover-badge">
#                     <span class="badge-text">EQUITY RESEARCH REPORT</span>
#                 </div>
                
#                 <h1 class="cover-company-name">{self.company_name.upper()}</h1>
                
#                 <div class="cover-subtitle">
#                     <span class="subtitle-text">Comprehensive Investment Analysis</span>
#                 </div>
                
#                 <!-- Key metrics card -->
#                 <div class="metrics-card">
#                     <div class="metric-item">
#                         <div class="metric-label">Investment Recommendation</div>
#                         <div class="metric-value recommendation-value">{key_metrics['recommendation']}</div>
#                     </div>
#                     <div class="metric-divider"></div>
#                     <div class="metric-item">
#                         <div class="metric-label">Analysis Date</div>
#                         <div class="metric-value date-value">{self.report_date}</div>
#                     </div>
#                 </div>
                
#                 <!-- Additional info grid -->
#                 <div class="info-grid">
#                     <div class="info-item">
#                         <div class="info-icon">📊</div>
#                         <div class="info-text">
#                             <div class="info-title">Data Sources</div>
#                             <div class="info-desc">Financial statements, earnings calls, market data</div>
#                         </div>
#                     </div>
#                     <div class="info-item">
#                         <div class="info-icon">🤖</div>
#                         <div class="info-text">
#                             <div class="info-title">AI Analysis</div>
#                             <div class="info-desc">Advanced algorithms and pattern recognition</div>
#                         </div>
#                     </div>
#                     <div class="info-item">
#                         <div class="info-icon">⚡</div>
#                         <div class="info-text">
#                             <div class="info-title">Real-time</div>
#                             <div class="info-desc">Up-to-date market insights and trends</div>
#                         </div>
#                     </div>
#                 </div>
#             </div>
            
#             <!-- Footer -->
#             <div class="cover-footer">
#                 <div class="footer-warning">
#                     <span class="warning-icon">⚠️</span>
#                     <span class="warning-text">This report is for informational purposes only and does not constitute investment advice.</span>
#                 </div>
#             </div>
#         </div>
#         """
    
#     def generate_table_of_contents(self):
#         """Generate clean table of contents without page numbers"""
#         return """
#         <div class="toc-page page-break">
#             <div class="page-header">
#                 <div class="header-left">
#                     <span class="header-company">Table of Contents</span>
#                 </div>
#                 <div class="header-right">
#                     <span class="header-date">Navigation</span>
#                 </div>
#             </div>
            
#             <h1 class="toc-title">Table of Contents</h1>
            
#             <div class="toc-content">
#                 <div class="toc-item">
#                     <div class="toc-number">01</div>
#                     <div class="toc-section">
#                         <div class="toc-section-title">Executive Summary</div>
#                         <div class="toc-section-desc">Key findings and investment highlights</div>
#                     </div>
#                 </div>
                
#                 <div class="toc-item">
#                     <div class="toc-number">02</div>
#                     <div class="toc-section">
#                         <div class="toc-section-title">Investment Thesis</div>
#                         <div class="toc-section-desc">Core investment rationale and strategic positioning</div>
#                     </div>
#                 </div>
                
#                 <div class="toc-item">
#                     <div class="toc-number">03</div>
#                     <div class="toc-section">
#                         <div class="toc-section-title">Financial Analysis</div>
#                         <div class="toc-section-desc">Revenue, profitability, and financial health metrics</div>
#                     </div>
#                 </div>
                
#                 <div class="toc-item">
#                     <div class="toc-number">04</div>
#                     <div class="toc-section">
#                         <div class="toc-section-title">Business Analysis</div>
#                         <div class="toc-section-desc">Market position, competitive advantages, and operations</div>
#                     </div>
#                 </div>
                
#                 <div class="toc-item">
#                     <div class="toc-number">05</div>
#                     <div class="toc-section">
#                         <div class="toc-section-title">Risk Assessment</div>
#                         <div class="toc-section-desc">Key risks and mitigation strategies</div>
#                     </div>
#                 </div>
                
#                 <div class="toc-item">
#                     <div class="toc-number">06</div>
#                     <div class="toc-section">
#                         <div class="toc-section-title">Valuation & Recommendation</div>
#                         <div class="toc-section-desc">Valuation methodology and final recommendation</div>
#                     </div>
#                 </div>
                
#                 <div class="toc-item">
#                     <div class="toc-number">07</div>
#                     <div class="toc-section">
#                         <div class="toc-section-title">Important Disclosures</div>
#                         <div class="toc-section-desc">Legal disclaimers and risk warnings</div>
#                     </div>
#                 </div>
#             </div>
#         </div>
#         """
    
#     def generate_disclaimer(self):
#         """Generate comprehensive legal disclaimer with modern styling"""
#         return f"""
#         <div class="disclaimer-page page-break" id="disclaimer">
#             <div class="page-header">
#                 <div class="header-left">
#                     <span class="header-company">Important Disclosures</span>
#                 </div>
#                 <div class="header-right">
#                     <span class="header-date">{self.report_date}</span>
#                 </div>
#             </div>
            
#             <h1 class="section-title">Important Disclosures</h1>
            
#             <div class="disclaimer-grid">
#                 <div class="disclaimer-card">
#                     <div class="disclaimer-icon">🔍</div>
#                     <h3>Research Methodology</h3>
#                     <p>This report has been generated through automated analysis of publicly available information including earnings calls, annual reports, forum discussions, and market data. The content is for informational purposes only and should not be construed as personalized investment advice or a recommendation to buy, sell, or hold any securities.</p>
#                 </div>
                
#                 <div class="disclaimer-card">
#                     <div class="disclaimer-icon">⚠️</div>
#                     <h3>Risk Warning</h3>
#                     <p>All investments involve risk, including the potential loss of principal. Past performance does not guarantee future results. Market conditions, company fundamentals, and economic factors can significantly impact investment returns. Investors should carefully consider their risk tolerance and investment objectives before making any investment decisions.</p>
#                 </div>
                
#                 <div class="disclaimer-card">
#                     <div class="disclaimer-icon">📊</div>
#                     <h3>Data Sources & Accuracy</h3>
#                     <p>Information in this report is derived from publicly available sources including company financial statements, earnings transcripts, regulatory filings, and market data providers. While every effort has been made to ensure accuracy, we cannot guarantee the completeness or accuracy of all information presented.</p>
#                 </div>
                
#                 <div class="disclaimer-card">
#                     <div class="disclaimer-icon">👨‍💼</div>
#                     <h3>Professional Advice</h3>
#                     <p>Before making any investment decisions, investors should consult with qualified financial advisors, tax professionals, and legal counsel as appropriate for their individual circumstances.</p>
#                 </div>
#             </div>
            
#             <div class="generation-info">
#                 <div class="info-row">
#                     <span class="info-label">Report Generated:</span>
#                     <span class="info-value">{self.report_date}</span>
#                 </div>
#                 <div class="info-row">
#                     <span class="info-label">Version:</span>
#                     <span class="info-value">Automated Research Report v3.0</span>
#                 </div>
#                 <div class="info-row">
#                     <span class="info-label">Powered by:</span>
#                     <span class="info-value">Investimate AI Research Platform</span>
#                 </div>
#             </div>
#         </div>
#         """
    
#     def get_report_css(self):
#         """WeasyPrint compatible CSS styling - removes unsupported properties"""
#         return """
#         @page {
#             size: A4;
#             margin: 0.75in;
#         }
        
#         :root {
#             --primary-color: #6366f1;
#             --primary-dark: #4338ca;
#             --primary-light: #818cf8;
#             --secondary-color: #8b5cf6;
#             --accent-color: #06b6d4;
#             --text-primary: #1e293b;
#             --text-secondary: #475569;
#             --text-muted: #64748b;
#             --background-light: #f8fafc;
#             --background-card: #ffffff;
#             --border-light: #e2e8f0;
#             --border-medium: #cbd5e1;
#             --success-color: #10b981;
#             --warning-color: #f59e0b;
#             --danger-color: #ef4444;
#         }
        
#         * {
#             box-sizing: border-box;
#         }
        
#         body {
#             font-family: 'Arial', sans-serif;
#             line-height: 1.6;
#             color: var(--text-primary);
#             margin: 0;
#             padding: 0;
#             font-size: 11pt;
#             font-weight: 400;
#         }
        
#         /* Cover Page Styles - Simplified for WeasyPrint */
#         .cover-page {
#             padding: 2rem;
#             page-break-after: always;
#             background: #667eea;
#             color: white;
#             text-align: center;
#             /* Remove height: 100vh and complex positioning */
#             min-height: 800px;
#         }
        
#         /* Remove ::before pseudo-elements - WeasyPrint doesn't handle them well */
        
#         .cover-header {
#             padding: 2rem 3rem 1rem;
#             margin-bottom: 2rem;
#         }
        
#         .logo-container {
#             margin-bottom: 2rem;
#         }
        
#         .logo {
#             width: 50px;
#             height: 50px;
#             background: rgba(255, 255, 255, 0.2);
#             border-radius: 8px;
#             border: 2px solid rgba(255, 255, 255, 0.3);
#             /* Remove backdrop-filter */
#             display: inline-block;
#             margin-bottom: 1rem;
#         }
        
#         .logo-text {
#             margin-top: 1rem;
#         }
        
#         .brand-name {
#             font-size: 1.5rem;
#             font-weight: 700;
#             color: white;
#             display: block;
#             margin-bottom: 0.5rem;
#         }
        
#         .brand-tagline {
#             font-size: 0.875rem;
#             color: rgba(255, 255, 255, 0.9);
#             font-weight: 400;
#         }
        
#         .cover-main {
#             padding: 2rem;
#             margin: 2rem 0;
#         }
        
#         .cover-badge {
#             background: rgba(255, 255, 255, 0.2);
#             /* Remove backdrop-filter */
#             border: 1px solid rgba(255, 255, 255, 0.3);
#             border-radius: 25px;
#             padding: 0.75rem 2rem;
#             margin-bottom: 2rem;
#             display: inline-block;
#         }
        
#         .badge-text {
#             color: white;
#             font-size: 0.875rem;
#             font-weight: 600;
#             letter-spacing: 1px;
#             text-transform: uppercase;
#         }
        
#         .cover-company-name {
#             font-size: 3rem;
#             font-weight: 800;
#             color: white;
#             margin: 1rem 0;
#             line-height: 1;
#         }
        
#         .cover-subtitle {
#             margin-bottom: 2rem;
#         }
        
#         .subtitle-text {
#             font-size: 1.25rem;
#             color: rgba(255, 255, 255, 0.9);
#             font-weight: 400;
#         }
        
#         .metrics-card {
#             background: rgba(255, 255, 255, 0.15);
#             /* Remove backdrop-filter */
#             border: 1px solid rgba(255, 255, 255, 0.3);
#             border-radius: 15px;
#             padding: 2rem;
#             margin: 2rem auto;
#             max-width: 500px;
#             /* Simplified layout - no complex flexbox */
#         }
        
#         .metric-item {
#             text-align: center;
#             margin: 1rem 0;
#             display: inline-block;
#             width: 45%;
#             vertical-align: top;
#         }
        
#         .metric-label {
#             font-size: 0.875rem;
#             color: rgba(255, 255, 255, 0.8);
#             margin-bottom: 0.5rem;
#             text-transform: uppercase;
#             letter-spacing: 0.5px;
#         }
        
#         .metric-value {
#             font-size: 1.5rem;
#             font-weight: 700;
#             color: white;
#         }
        
#         .metric-divider {
#             width: 1px;
#             height: 40px;
#             background: rgba(255, 255, 255, 0.4);
#             display: inline-block;
#             margin: 0 2%;
#         }
        
#         .info-grid {
#             margin-top: 2rem;
#         }
        
#         .info-item {
#             background: rgba(255, 255, 255, 0.1);
#             padding: 1.5rem;
#             border-radius: 12px;
#             border: 1px solid rgba(255, 255, 255, 0.2);
#             margin: 1rem 0;
#             /* Remove backdrop-filter */
#         }
        
#         .info-icon {
#             font-size: 1.5rem;
#             display: inline-block;
#             margin-bottom: 0.5rem;
#         }
        
#         .info-title {
#             font-weight: 600;
#             color: white;
#             margin-bottom: 0.25rem;
#         }
        
#         .info-desc {
#             font-size: 0.875rem;
#             color: rgba(255, 255, 255, 0.8);
#             line-height: 1.4;
#         }
        
#         .cover-footer {
#             margin-top: 2rem;
#             padding: 1rem;
#         }
        
#         .footer-warning {
#             background: rgba(255, 255, 255, 0.15);
#             /* Remove backdrop-filter */
#             border: 1px solid rgba(255, 255, 255, 0.3);
#             border-radius: 8px;
#             padding: 1rem;
#         }
        
#         .warning-icon {
#             font-size: 1.25rem;
#             margin-right: 0.5rem;
#         }
        
#         .warning-text {
#             font-size: 0.875rem;
#             color: rgba(255, 255, 255, 0.9);
#             line-height: 1.4;
#             display: inline;
#         }
        
#         /* Page Headers - Simplified */
#         .page-header {
#             padding: 0.75rem 0;
#             margin-bottom: 2rem;
#             border-bottom: 2px solid var(--border-light);
#             font-size: 0.875rem;
#         }
        
#         .header-left {
#             float: left;
#         }
        
#         .header-right {
#             float: right;
#         }
        
#         .header-company {
#             font-weight: 600;
#             color: var(--primary-color);
#         }
        
#         .header-separator {
#             color: var(--text-muted);
#             margin: 0 0.5rem;
#         }
        
#         .header-section {
#             color: var(--text-secondary);
#         }
        
#         /* Table of Contents - Simplified */
#         .toc-page {
#             padding: 2rem 0;
#             page-break-after: always;
#         }
        
#         .toc-title {
#             font-size: 2.5rem;
#             color: var(--text-primary);
#             margin-bottom: 3rem;
#             text-align: center;
#             font-weight: 700;
#         }
        
#         .toc-content {
#             max-width: 700px;
#             margin: 0 auto;
#         }
        
#         .toc-item {
#             margin: 1.5rem 0;
#             padding: 1.5rem;
#             background: var(--background-card);
#             border-radius: 8px;
#             border: 1px solid var(--border-light);
#             /* Remove complex shadows and transitions */
#         }
        
#         .toc-number {
#             width: 40px;
#             height: 40px;
#             background: var(--primary-color);
#             color: white;
#             border-radius: 8px;
#             display: inline-block;
#             text-align: center;
#             line-height: 40px;
#             font-weight: 600;
#             font-size: 1rem;
#             float: left;
#             margin-right: 1rem;
#         }
        
#         .toc-section {
#             margin-left: 60px; /* Account for floated number */
#         }
        
#         .toc-section-title {
#             font-weight: 600;
#             color: var(--text-primary);
#             font-size: 1.125rem;
#             margin-bottom: 0.5rem;
#         }
        
#         .toc-section-desc {
#             color: var(--text-secondary);
#             font-size: 0.875rem;
#             line-height: 1.4;
#         }
        
#         /* Section Styles - Simplified */
#         .section {
#             margin: 2rem 0;
#             padding: 1rem 0;
#             clear: both; /* Clear floats */
#         }
        
#         .section-title {
#             font-size: 2.25rem;
#             color: var(--primary-color);
#             margin-bottom: 2rem;
#             font-weight: 700;
#             border-bottom: 4px solid var(--primary-color);
#             padding-bottom: 0.5rem;
#         }
        
#         .content {
#             line-height: 1.7;
#             font-size: 11pt;
#         }
        
#         .content h1 {
#             font-size: 1.75rem;
#             color: var(--text-primary);
#             margin: 2.5rem 0 1.5rem 0;
#             font-weight: 600;
#             border-left: 4px solid var(--primary-color);
#             padding-left: 1rem;
#         }
        
#         .content h2 {
#             font-size: 1.375rem;
#             color: var(--text-primary);
#             margin: 2rem 0 1rem 0;
#             font-weight: 600;
#         }
        
#         .content h3 {
#             font-size: 1.125rem;
#             color: var(--text-primary);
#             margin: 1.5rem 0 0.75rem 0;
#             font-weight: 600;
#         }
        
#         .content p {
#             margin: 1.25rem 0;
#             text-align: justify;
#             color: var(--text-primary);
#             line-height: 1.7;
#         }
        
#         .content ul {
#             margin: 1.5rem 0;
#             padding-left: 1.5rem;
#         }
        
#         .content li {
#             margin: 0.75rem 0;
#             line-height: 1.6;
#             list-style: disc;
#             color: var(--text-primary);
#         }
        
#         .content strong {
#             font-weight: 600;
#             color: var(--text-primary);
#         }
        
#         /* Page Breaks */
#         .page-break {
#             page-break-before: always;
#         }
        
#         /* Tables - Simplified */
#         table {
#             width: 100%;
#             border-collapse: collapse;
#             margin: 2rem 0;
#             background: var(--background-card);
#         }
        
#         th, td {
#             padding: 1rem;
#             text-align: left;
#             border: 1px solid var(--border-light);
#         }
        
#         th {
#             background: var(--primary-color);
#             color: white;
#             font-weight: 600;
#             font-size: 0.95rem;
#             text-transform: uppercase;
#             letter-spacing: 0.5px;
#         }
        
#         tr:nth-child(even) {
#             background-color: var(--background-light);
#         }
        
#         /* Risk Indicators */
#         .risk-high {
#             color: var(--danger-color);
#             font-weight: 600;
#             background: rgba(239, 68, 68, 0.1);
#             padding: 0.25rem 0.5rem;
#             border-radius: 4px;
#         }
        
#         .risk-medium {
#             color: var(--warning-color);
#             font-weight: 600;
#             background: rgba(245, 158, 11, 0.1);
#             padding: 0.25rem 0.5rem;
#             border-radius: 4px;
#         }
        
#         .risk-low {
#             color: var(--success-color);
#             font-weight: 600;
#             background: rgba(16, 185, 129, 0.1);
#             padding: 0.25rem 0.5rem;
#             border-radius: 4px;
#         }
        
#         /* Disclaimer Page - Simplified */
#         .disclaimer-page {
#             padding: 2rem 0;
#         }
        
#         .disclaimer-grid {
#             margin: 2rem 0;
#         }
        
#         .disclaimer-card {
#             background: var(--background-card);
#             border: 1px solid var(--border-light);
#             border-radius: 8px;
#             padding: 2rem;
#             margin: 1rem 0;
#             /* Remove complex shadows and transitions */
#         }
        
#         .disclaimer-icon {
#             font-size: 2rem;
#             margin-bottom: 1rem;
#             display: block;
#         }
        
#         .disclaimer-card h3 {
#             color: var(--text-primary);
#             margin: 0 0 1rem 0;
#             font-weight: 600;
#             font-size: 1.125rem;
#         }
        
#         .disclaimer-card p {
#             margin: 0;
#             line-height: 1.6;
#             text-align: justify;
#             color: var(--text-secondary);
#         }
        
#         .generation-info {
#             margin-top: 3rem;
#             padding: 2rem;
#             background: var(--background-light);
#             border: 1px solid var(--border-light);
#             border-radius: 8px;
#             text-align: center;
#         }
        
#         .info-row {
#             margin: 0.75rem 0;
#             padding: 0.5rem 0;
#             border-bottom: 1px solid var(--border-light);
#         }
        
#         .info-row:last-child {
#             border-bottom: none;
#         }
        
#         .info-label {
#             font-weight: 500;
#             color: var(--text-secondary);
#             margin-right: 1rem;
#         }
        
#         .info-value {
#             font-weight: 600;
#             color: var(--text-primary);
#         }
        
#         /* Clear floats */
#         .clearfix::after {
#             content: "";
#             display: table;
#             clear: both;
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





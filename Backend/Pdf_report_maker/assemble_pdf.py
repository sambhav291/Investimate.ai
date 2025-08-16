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
    def clean_section_content(self, content, section_name):
        """Clean section content by removing template placeholders and redundant headers"""
        if not content:
            return content
        
        # Remove common template placeholders
        content = re.sub(r'Equity Research Executive Summary.*?Date:\s*\[Insert Date\]', '', content, flags=re.IGNORECASE | re.DOTALL)
        content = re.sub(r'Company:\s*\[Company Name\].*?\|.*?Date:\s*\[Insert Date\]', '', content, flags=re.IGNORECASE)
        content = re.sub(r'Company:\s*\[Company Name\]', '', content, flags=re.IGNORECASE)
        content = re.sub(r'Date:\s*\[Insert Date\]', '', content, flags=re.IGNORECASE)
        content = re.sub(r'Sector:\s*\[.*?\]', '', content, flags=re.IGNORECASE)
        
        # Remove redundant section headers that match the current section
        if section_name.lower() in content.lower():
            content = re.sub(rf'^.*?{re.escape(section_name)}.*?\n', '', content, flags=re.IGNORECASE | re.MULTILINE)
        
        # Clean up extra whitespace
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
        content = content.strip()
        
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
        """Generate modern, professional cover page with enhanced visual appeal"""
        return f"""
        <div class="cover-page">
            <!-- Top Brand Section -->
            <div class="brand-section">
                <img src="https://investimate-ai-eight.vercel.app/Investimate%20logo.png" alt="Investimate" class="brand-logo" />
                <div class="brand-text">
                    <span class="brand-name">Investimate.ai</span>
                    <span class="brand-tagline">AI-Powered Investment Research</span>
                </div>
            </div>
            
            <!-- Main Content Section -->
            <div class="cover-main-content">
                <!-- Report Badge -->
                <div class="report-badge">
                    <div class="badge-icon">₹</div>
                    <span class="badge-text">EQUITY RESEARCH REPORT</span>
                </div>
                
                <!-- Company Name with Accent -->
                <div class="company-section">
                    <div class="company-accent-line"></div>
                    <h1 class="company-name">{self.company_name.upper()}</h1>
                    <div class="company-accent-line"></div>
                </div>
                
                <!-- Key Metrics Combined -->
                <div class="metrics-combined">
                    <div class="combined-metric-card">
                        <div class="metric-row">
                            <div class="metric-content">
                                <div class="metric-label">Investment Outlook</div>
                                <div class="metric-value">{key_metrics['recommendation']}</div>
                            </div>
                        </div>
                        <div class="metric-divider-horizontal"></div>
                        <div class="metric-row">
                            <div class="metric-content">
                                <div class="metric-label">Analysis Date</div>
                                <div class="metric-value">{self.report_date}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Features Section -->
                <div class="features-section">
                    <div class="feature-item">
                        <div class="feature-icon">@</div>
                        <div class="feature-text">
                            <strong>AI Analysis</strong>
                            <span>Advanced pattern recognition</span>
                        </div>
                    </div>
                    <div class="feature-divider"></div>
                    <div class="feature-item">
                        <div class="feature-icon">⚡</div>
                        <div class="feature-text">
                            <strong>Real-time Data</strong>
                            <span>Latest market insights</span>
                        </div>
                    </div>
                    <div class="feature-divider"></div>
                    <div class="feature-item">
                        <div class="feature-icon">%</div>
                        <div class="feature-text">
                            <strong>Deep Research</strong>
                            <span>Comprehensive analysis</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Bottom Section -->
            <div class="cover-bottom">
                <!-- Analysis Stats -->
                <div class="stats-row">
                    <div class="stat-item">
                        <div class="stat-number">6</div>
                        <div class="stat-label">Analysis Sections</div>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <div class="stat-number">100+</div>
                        <div class="stat-label">Data Points</div>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <div class="stat-number">AI</div>
                        <div class="stat-label">Powered</div>
                    </div>
                </div>
                
                <!-- Disclaimer -->
                <div class="cover-disclaimer">
                    <div class="disclaimer-icon">⚠️</div>
                    <div class="disclaimer-text">
                        <strong>Important:</strong> This report is for informational purposes only. 
                        Please consult qualified financial advisors before making investment decisions.
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
        """Enhanced CSS with better visual design, optimized for single-page cover and proper content sizing"""
        return """
        @page {
            size: A4;
            margin: 0.6in;
            @top-right {
                content: "Page " counter(page);
                font-size: 8pt;
                color: #64748b;
                font-weight: 500;
            }
        }
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5;
            color: #1e293b;
            margin: 0;
            padding: 0;
            font-size: 10pt;
            font-weight: 400;
        }
        
        /* ==================== COVER PAGE - ENHANCED DESIGN ==================== */
        .cover-page {
            page-break-after: always;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1.5rem;
            min-height: 800px;
            max-height: 850px;
            overflow: hidden;
            position: relative;
        }
        
        /* Decorative background elements */
        .cover-page::before {
            content: '';
            position: absolute;
            top: -50px;
            right: -50px;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 50%;
            z-index: 1;
        }
        
        .cover-page::after {
            content: '';
            position: absolute;
            bottom: -30px;
            left: -30px;
            width: 150px;
            height: 150px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 50%;
            z-index: 1;
        }
        
        /* Brand Section */
        .brand-section {
            display: table;
            width: 100%;
            margin-bottom: 2rem;
            position: relative;
            z-index: 2;
        }
        
        .brand-logo {
            display: table-cell;
            width: 50px;
            height: 50px;
            vertical-align: middle;
        }       
        
        .brand-text {
            display: table-cell;
            vertical-align: middle;
            padding-left: 1.5rem;
        }
        
        .brand-name {
            display: block;
            font-size: 1.8rem;
            font-weight: 800;
            letter-spacing: 2px;
            margin-bottom: 0.25rem;
        }
        
        .brand-tagline {
            display: block;
            font-size: 0.9rem;
            opacity: 0.85;
            font-weight: 400;
            letter-spacing: 0.5px;
        }
        
        /* Main Content Section */
        .cover-main-content {
            text-align: center;
            margin: 2rem 0;
            position: relative;
            z-index: 2;
        }
        
        /* Report Badge */
        .report-badge {
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.25);
            border-radius: 25px;
            padding: 0.75rem 2rem;
            display: inline-block;
            margin-bottom: 2rem;
        }
        
        .badge-icon {
            display: inline-block;
            margin-right: 0.5rem;
            font-size: 1.1rem;
        }
        
        .badge-text {
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
        }
        
        /* Company Section */
        .company-section {
            margin: 2rem 0;
            position: relative;
        }
        
        .company-accent-line {
            height: 3px;
            width: 80px;
            background: rgba(255, 255, 255, 0.6);
            margin: 1rem auto;
            border-radius: 2px;
        }
        
        .company-name {
            font-size: 3.2rem;
            font-weight: 900;
            margin: 1rem 0;
            line-height: 0.9;
            letter-spacing: -1px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Metrics Combined */
        .metrics-combined {
            margin: 1.5rem 0;
            text-align: center;
        }

        .combined-metric-card {
            display: inline-block;
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 1.25rem;
            max-width: 400px;
        }

        .metric-row {
            display: table;
            width: 100%;
            margin: 0.5rem 0;
        }

        .metric-row .metric-icon {
            display: table-cell;
            width: 30px;
            font-size: 1.5rem;
            vertical-align: middle;
        }

        .metric-row .metric-content {
            display: table-cell;
            text-align: left;
            padding-left: 1rem;
            vertical-align: middle;
        }

        .metric-row .metric-label {
            font-size: 0.75rem;
            opacity: 0.85;
            margin-bottom: 0.25rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .metric-row .metric-value {
            font-size: 1rem;
            font-weight: 700;
        }

        .metric-divider-horizontal {
            height: 1px;
            background: rgba(255, 255, 255, 0.3);
            margin: 0.75rem 0;
        }
        
        /* Features Section */
        .features-section {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 15px;
            padding: 1.5rem;
            margin: 2rem 0;
            text-align: center;
        }
        
        .feature-item {
            display: inline-block;
            width: 30%;
            text-align: center;
            vertical-align: top;
        }
        
        .feature-divider {
            display: inline-block;
            width: 1px;
            height: 40px;
            background: rgba(255, 255, 255, 0.3);
            margin: 0 1.5%;
            vertical-align: middle;
        }
        
        .feature-icon {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        
        .feature-text strong {
            display: block;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        
        .feature-text span {
            font-size: 0.75rem;
            opacity: 0.8;
        }
        
        /* Cover Bottom Section */
        .cover-bottom {
            position: relative;
            z-index: 2;
            margin-top: 2rem;
        }
        
        /* Stats Row */
        .stats-row {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 1.25rem;
            margin-bottom: 1.5rem;
            text-align: center;
        }
        
        .stat-item {
            display: inline-block;
            width: 30%;
            text-align: center;
            vertical-align: top;
        }
        
        .stat-divider {
            display: inline-block;
            width: 1px;
            height: 30px;
            background: rgba(255, 255, 255, 0.3);
            margin: 0 1.5%;
            vertical-align: middle;
        }
        
        .stat-number {
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 0.25rem;
        }
        
        .stat-label {
            font-size: 0.75rem;
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* Cover Disclaimer */
        .cover-disclaimer {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            padding: 1rem 1.25rem;
            text-align: center;
        }
        
        .disclaimer-icon {
            display: inline-block;
            margin-right: 0.5rem;
            font-size: 1rem;
            vertical-align: middle;
        }
        
        .disclaimer-text {
            display: inline-block;
            font-size: 0.75rem;
            line-height: 1.4;
            opacity: 0.9;
            vertical-align: middle;
            max-width: 80%;
        }
        
        /* ==================== PAGE HEADERS - OPTIMIZED ==================== */
        .page-header {
            padding: 0.5rem 0;
            margin-bottom: 1.5rem;
            border-bottom: 2px solid #6366f1;
            font-size: 0.8rem;
            position: relative;
            overflow: hidden;
        }
        
        .page-header::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 50px;
            height: 2px;
            background: #8b5cf6;
        }
        
        .header-left {
            float: left;
        }
        
        .header-company {
            font-weight: 700;
            color: #6366f1;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .header-separator {
            color: #64748b;
            margin: 0 0.5rem;
        }
        
        .header-section {
            color: #475569;
            font-weight: 500;
        }
        
        /* ==================== TABLE OF CONTENTS - OPTIMIZED ==================== */
        .toc-page {
            padding: 2rem 0;
            page-break-after: always;
        }
        
        .toc-title {
            font-size: 2.2rem;
            color: #1e293b;
            margin-bottom: 2rem;
            text-align: center;
            font-weight: 800;
            position: relative;
        }
        
        .toc-title::after {
            content: '';
            position: absolute;
            bottom: -0.75rem;
            left: 50%;
            margin-left: -40px;
            width: 80px;
            height: 3px;
            background: #6366f1;
            border-radius: 2px;
        }
        
        .toc-content {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .toc-item {
            margin: 1rem 0;
            padding: 1.5rem;
            background: #ffffff;
            border-radius: 12px;
            border-left: 4px solid #6366f1;
            page-break-inside: avoid;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        
        .toc-number {
            width: 40px;
            height: 40px;
            background: #6366f1;
            color: white;
            border-radius: 10px;
            display: inline-block;
            text-align: center;
            line-height: 40px;
            font-weight: 700;
            font-size: 1rem;
            float: left;
            margin-right: 1rem;
        }
        
        .toc-section {
            margin-left: 55px;
        }
        
        .toc-section-title {
            font-weight: 700;
            color: #1e293b;
            font-size: 1.1rem;
            margin-bottom: 0.4rem;
        }
        
        .toc-section-desc {
            color: #475569;
            font-size: 0.85rem;
            line-height: 1.4;
        }
        
        /* ==================== SECTION STYLES - OPTIMIZED SIZE ==================== */
        .section {
            margin: 2rem 0;
            padding: 0.75rem 0;
            clear: both;
        }
        
        .section-title {
            font-size: 2rem;
            color: #6366f1;
            margin-bottom: 1.5rem;
            font-weight: 800;
            position: relative;
            padding-bottom: 0.75rem;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100px;
            height: 4px;
            background: #6366f1;
            border-radius: 2px;
        }
        
        .content {
            line-height: 1.6;
            font-size: 10pt;
        }
        
        .content h1 {
            font-size: 1.4rem;
            color: #1e293b;
            margin: 2rem 0 1rem 0;
            font-weight: 700;
            border-left: 4px solid #6366f1;
            padding-left: 1rem;
            page-break-after: avoid;
        }
        
        .content h2 {
            font-size: 1.2rem;
            color: #1e293b;
            margin: 1.5rem 0 0.75rem 0;
            font-weight: 600;
            page-break-after: avoid;
        }
        
        .content h3 {
            font-size: 1.1rem;
            color: #1e293b;
            margin: 1.25rem 0 0.5rem 0;
            font-weight: 600;
            page-break-after: avoid;
        }
        
        .content p {
            margin: 1rem 0;
            text-align: justify;
            color: #1e293b;
            line-height: 1.6;
        }
        
        .content ul {
            margin: 1.25rem 0;
            padding-left: 0;
        }
        
        .content li {
            margin: 0.75rem 0;
            line-height: 1.5;
            list-style: none;
            position: relative;
            padding-left: 1.5rem;
            color: #1e293b;
        }
        
        .content li::before {
            content: '●';
            color: #6366f1;
            font-size: 1rem;
            position: absolute;
            left: 0;
            font-weight: bold;
        }
        
        .content strong {
            font-weight: 700;
            color: #1e293b;
        }
        
        /* ==================== TABLES - OPTIMIZED ==================== */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            page-break-inside: avoid;
            font-size: 9pt;
        }
        
        th, td {
            padding: 0.75rem 0.5rem;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
        }
        
        th {
            background: #6366f1;
            color: white;
            font-weight: 700;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        tr:nth-child(even) {
            background-color: #f8fafc;
        }
        
        td:first-child {
            font-weight: 600;
            color: #1e293b;
        }
        
        /* Financial metrics styling */
        .metric-positive {
            color: #10b981;
            font-weight: 600;
        }
        
        .metric-negative {
            color: #ef4444;
            font-weight: 600;
        }
        
        /* ==================== PAGE BREAKS ==================== */
        .page-break {
            page-break-before: always;
        }
        
        /* ==================== RISK INDICATORS ==================== */
        .risk-high {
            color: #ef4444;
            font-weight: 700;
            background: rgba(239, 68, 68, 0.1);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .risk-medium {
            color: #f59e0b;
            font-weight: 700;
            background: rgba(245, 158, 11, 0.1);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            border: 1px solid rgba(245, 158, 11, 0.2);
        }
        
        .risk-low {
            color: #10b981;
            font-weight: 700;
            background: rgba(16, 185, 129, 0.1);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        /* ==================== CALLOUT BOXES ==================== */
        .callout-box {
            background: rgba(99, 102, 241, 0.06);
            border: 1px solid #a5b4fc;
            border-left: 4px solid #6366f1;
            border-radius: 8px;
            padding: 1.25rem;
            margin: 1.5rem 0;
            page-break-inside: avoid;
        }
        
        .callout-title {
            font-size: 1rem;
            font-weight: 700;
            color: #6366f1;
            margin-bottom: 0.75rem;
        }
        
        /* ==================== DISCLAIMER PAGE - OPTIMIZED ==================== */
        .disclaimer-page {
            padding: 1.5rem 0;
            page-break-before: always;
        }
        
        .disclaimer-grid {
            margin: 1.5rem 0;
        }
        
        .disclaimer-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #6366f1;
            border-radius: 8px;
            padding: 1.25rem;
            margin: 1rem 0;
            page-break-inside: avoid;
        }
        
        .disclaimer-icon {
            font-size: 1.5rem;
            margin-bottom: 0.75rem;
            display: block;
            color: #6366f1;
        }
        
        .disclaimer-card h3 {
            color: #1e293b;
            margin: 0 0 0.75rem 0;
            font-weight: 700;
            font-size: 1rem;
        }
        
        .disclaimer-card p {
            margin: 0;
            line-height: 1.5;
            text-align: justify;
            color: #475569;
            font-size: 9pt;
        }
        
        .generation-info {
            margin-top: 2rem;
            padding: 1.25rem;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            text-align: center;
        }
        
        .info-row {
            margin: 0.5rem 0;
            padding: 0.4rem 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .info-label {
            font-weight: 600;
            color: #475569;
            margin-right: 0.75rem;
            font-size: 9pt;
        }
        
        .info-value {
            font-weight: 700;
            color: #1e293b;
            font-size: 9pt;
        }
        
        /* ==================== PREPARED BY SIGNATURE ==================== */
        .section-footer {
            margin-top: 2rem;
            padding-top: 0.75rem;
            border-top: 1px solid #e2e8f0;
            text-align: right;
            font-style: italic;
            color: #64748b;
            font-size: 8pt;
        }
        
        /* ==================== CLEAR FLOATS UTILITY ==================== */
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
#         """Convert markdown-style content to proper HTML with better table and formatting support"""
#         if not content:
#             return ""
        
#         # Clean up the content first
#         content = content.strip()
        
#         # Fix the "Prepared by" issue - replace with our signature
#         content = re.sub(
#             r'---\s*\*Prepared by:.*?\*',
#             '<div class="section-footer">Prepared with Investimate.ai</div>',
#             content,
#             flags=re.IGNORECASE | re.DOTALL
#         )
        
#         # Convert headers
#         content = re.sub(r'^### (.*?)$', r'<h3>\1</h3>', content, flags=re.MULTILINE)
#         content = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', content, flags=re.MULTILINE)
#         content = re.sub(r'^# (.*?)$', r'<h1>\1</h1>', content, flags=re.MULTILINE)
        
#         # Fix bold text - handle both **text** and *text* formats
#         content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', content)
#         content = re.sub(r'(?<!\*)\*([^*\s][^*]*?[^*\s])\*(?!\*)', r'<strong>\1</strong>', content)
        
#         # Handle tables - detect and convert markdown tables
#         content = self._convert_tables(content)
        
#         # Convert bullet points with better detection
#         content = re.sub(r'^[\s]*[-•]\s+(.*?)$', r'<li>\1</li>', content, flags=re.MULTILINE)
        
#         # Convert numbered lists
#         content = re.sub(r'^[\s]*\d+\.\s+(.*?)$', r'<li>\1</li>', content, flags=re.MULTILINE)
        
#         # Group consecutive list items
#         content = self._group_list_items(content)
        
#         # Convert paragraphs - but be careful with existing HTML
#         content = self._convert_paragraphs(content)
        
#         # Clean up extra whitespace
#         content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
        
#         return content

#     def _convert_tables(self, content):
#         """Convert markdown tables to proper HTML tables"""
#         lines = content.split('\n')
#         in_table = False
#         table_lines = []
#         result_lines = []
        
#         for line in lines:
#             # Check if this line looks like a table row
#             if '|' in line and line.count('|') >= 2:
#                 if not in_table:
#                     in_table = True
#                     table_lines = []
#                 table_lines.append(line.strip())
#             else:
#                 # If we were in a table, process it
#                 if in_table:
#                     result_lines.extend(self._process_table(table_lines))
#                     table_lines = []
#                     in_table = False
#                 result_lines.append(line)
        
#         # Handle table at end of content
#         if in_table and table_lines:
#             result_lines.extend(self._process_table(table_lines))
        
#         return '\n'.join(result_lines)

#     def _process_table(self, table_lines):
#         """Process a group of table lines into proper HTML table"""
#         if len(table_lines) < 2:
#             return table_lines
        
#         # Filter out separator lines (lines with mostly - and |)
#         data_lines = []
#         header_line = None
        
#         for line in table_lines:
#             if re.match(r'^[\s\|:\-]+$', line):
#                 continue  # Skip separator lines
#             elif header_line is None:
#                 header_line = line
#             else:
#                 data_lines.append(line)
        
#         if not header_line:
#             return table_lines
        
#         # Parse header
#         header_cells = [cell.strip() for cell in header_line.split('|') if cell.strip()]
        
#         # Parse data rows
#         rows = []
#         for line in data_lines:
#             cells = [cell.strip() for cell in line.split('|') if cell.strip()]
#             if cells:  # Only add non-empty rows
#                 rows.append(cells)
        
#         # Build HTML table
#         if not header_cells or not rows:
#             return table_lines
        
#         html_lines = ['<table>']
        
#         # Add header
#         html_lines.append('<thead><tr>')
#         for cell in header_cells:
#             html_lines.append(f'<th>{cell}</th>')
#         html_lines.append('</tr></thead>')
        
#         # Add body
#         html_lines.append('<tbody>')
#         for row in rows:
#             html_lines.append('<tr>')
#             for i, cell in enumerate(row):
#                 if i < len(header_cells):  # Ensure we don't exceed column count
#                     # Add styling for financial metrics
#                     cell_class = ""
#                     cell_clean = cell.replace('₹', '').replace(',', '').strip()
#                     if re.match(r'^[\+\-]?[\d,]+\.?\d*%?$', cell_clean):
#                         if cell.startswith('+') or (cell_clean.replace('%', '').replace(',', '').replace('.', '').replace('₹', '').replace(',', '').isdigit() and float(cell_clean.replace('%', '').replace(',', '').replace('₹', '').replace(',', '')) > 0):
#                             cell_class = ' class="metric-positive"'
#                         elif cell.startswith('-'):
#                             cell_class = ' class="metric-negative"'
#                     html_lines.append(f'<td{cell_class}>{cell}</td>')
#             html_lines.append('</tr>')
#         html_lines.append('</tbody>')
        
#         html_lines.append('</table>')
        
#         return html_lines

#     def _group_list_items(self, content):
#         """Group consecutive list items into proper ul/ol tags"""
#         # Handle unordered lists
#         content = re.sub(
#             r'(<li>.*?</li>(?:\s*<li>.*?</li>)*)',
#             lambda m: f'<ul>{m.group(1)}</ul>',
#             content,
#             flags=re.DOTALL
#         )
        
#         return content

#     def _convert_paragraphs(self, content):
#         """Convert double line breaks to paragraphs while preserving HTML structure"""
#         # Split by double line breaks
#         sections = re.split(r'\n\s*\n', content)
#         formatted_sections = []
        
#         for section in sections:
#             section = section.strip()
#             if not section:
#                 continue
                
#             # Don't wrap if it's already HTML or a list
#             if (section.startswith('<') and section.endswith('>')) or \
#                '<li>' in section or '<table>' in section or \
#                '<h1>' in section or '<h2>' in section or '<h3>' in section:
#                 formatted_sections.append(section)
#             else:
#                 # Wrap in paragraph tags
#                 formatted_sections.append(f'<p>{section}</p>')
        
#         return '\n\n'.join(formatted_sections)
    
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
#         """Assemble all sections into a complete HTML report with improved formatting"""
        
#         # Extract key metrics for cover page
#         key_metrics = self.extract_key_metrics(sections.get('executive_summary', ''))
        
#         html_report = f"""
#         <!DOCTYPE html>
#         <html>
#         <head>
#             <meta charset="UTF-8">
#             <title>{self.company_name.upper()} - Investment Research Report</title>
#             <style>
#                 {self.get_report_css()}
#             </style>
#         </head>
#         <body>
#             {self.generate_cover_page(key_metrics)}
#             {self.generate_table_of_contents()}
            
#             <div class="section" id="executive-summary">
#                 <div class="page-header clearfix">
#                     <div class="header-left">
#                         <span class="header-company">{self.company_name.upper()}</span>
#                         <span class="header-separator">|</span>
#                         <span class="header-section">Executive Summary</span>
#                     </div>
#                 </div>
#                 <h1 class="section-title">Executive Summary</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('executive_summary', 'Content not available'))}
#                 </div>
#             </div>
            
#             <div class="section page-break" id="investment-thesis">
#                 <div class="page-header clearfix">
#                     <div class="header-left">
#                         <span class="header-company">{self.company_name.upper()}</span>
#                         <span class="header-separator">|</span>
#                         <span class="header-section">Investment Thesis</span>
#                     </div>
#                 </div>
#                 <h1 class="section-title">Investment Thesis</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('investment_thesis', 'Content not available'))}
#                 </div>
#             </div>
            
#             <div class="section page-break" id="financial-analysis">
#                 <div class="page-header clearfix">
#                     <div class="header-left">
#                         <span class="header-company">{self.company_name.upper()}</span>
#                         <span class="header-separator">|</span>
#                         <span class="header-section">Financial Analysis</span>
#                     </div>
#                 </div>
#                 <h1 class="section-title">Financial Analysis</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('financial_analysis', 'Content not available'))}
#                 </div>
#             </div>
            
#             <div class="section page-break" id="business-analysis">
#                 <div class="page-header clearfix">
#                     <div class="header-left">
#                         <span class="header-company">{self.company_name.upper()}</span>
#                         <span class="header-separator">|</span>
#                         <span class="header-section">Business Analysis</span>
#                     </div>
#                 </div>
#                 <h1 class="section-title">Business Analysis</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('business_analysis', 'Content not available'))}
#                 </div>
#             </div>
            
#             <div class="section page-break" id="risk-assessment">
#                 <div class="page-header clearfix">
#                     <div class="header-left">
#                         <span class="header-company">{self.company_name.upper()}</span>
#                         <span class="header-separator">|</span>
#                         <span class="header-section">Risk Assessment</span>
#                     </div>
#                 </div>
#                 <h1 class="section-title">Risk Assessment</h1>
#                 <div class="content">
#                     {self.convert_markdown_to_html(sections.get('risk_assessment', 'Content not available'))}
#                 </div>
#             </div>
            
#             <div class="section page-break" id="valuation">
#                 <div class="page-header clearfix">
#                     <div class="header-left">
#                         <span class="header-company">{self.company_name.upper()}</span>
#                         <span class="header-separator">|</span>
#                         <span class="header-section">Valuation & Recommendation</span>
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
#         """Generate modern, professional cover page with improved layout"""
#         return f"""
#         <div class="cover-page">
#             <!-- Enhanced Header with better logo placement -->
#             <div class="cover-header">
#                 <div class="logo-container">
#                     <div class="logo">💼</div>
#                     <div class="logo-text">
#                         <span class="brand-name">Investimate</span>
#                         <span class="brand-tagline">AI-Powered Investment Research</span>
#                     </div>
#                 </div>
#             </div>
            
#             <!-- Main content with improved typography -->
#             <div class="cover-main">
#                 <div class="cover-badge">
#                     <span class="badge-text">Equity Research Report</span>
#                 </div>
                
#                 <h1 class="cover-company-name">{self.company_name.upper()}</h1>
                
#                 <div class="cover-subtitle">
#                     <span class="subtitle-text">Comprehensive Investment Analysis</span>
#                 </div>
                
#                 <!-- Analysis Date Card -->
#                 <div class="analysis-date">
#                     <div class="date-label">Analysis Date</div>
#                     <div class="date-value">{self.report_date}</div>
#                 </div>
                
#                 <!-- Feature grid using table layout for WeasyPrint -->
#                 <div class="feature-grid">
#                     <div class="feature-row">
#                         <div class="feature-item">
#                             <div class="feature-icon">⚡</div>
#                             <div class="feature-title">Real-time Analysis</div>
#                             <div class="feature-desc">Up-to-date market insights and trends</div>
#                         </div>
#                         <div class="feature-item">
#                             <div class="feature-icon">🤖</div>
#                             <div class="feature-title">AI-Powered</div>
#                             <div class="feature-desc">Advanced algorithms and pattern recognition</div>
#                         </div>
#                     </div>
#                 </div>
#             </div>
            
#             <!-- Enhanced Footer -->
#             <div class="cover-footer">
#                 <div class="footer-warning">
#                     <div class="warning-text">
#                         <strong>⚠ Disclaimer:</strong> This report is for informational purposes only and does not constitute investment advice. 
#                         Please consult with qualified financial advisors before making investment decisions.
#                     </div>
#                 </div>
#             </div>
#         </div>
#         """
    
#     def generate_table_of_contents(self):
#         """Generate enhanced table of contents"""
#         return """
#         <div class="toc-page page-break">
#             <div class="page-header clearfix">
#                 <div class="header-left">
#                     <span class="header-company">Table of Contents</span>
#                 </div>
#             </div>
            
#             <h1 class="toc-title">Table of Contents</h1>
            
#             <div class="toc-content">
#                 <div class="toc-item">
#                     <div class="toc-number">01</div>
#                     <div class="toc-section">
#                         <div class="toc-section-title">Executive Summary</div>
#                         <div class="toc-section-desc">Key findings, investment highlights, and recommendation overview</div>
#                     </div>
#                 </div>
                
#                 <div class="toc-item">
#                     <div class="toc-number">02</div>
#                     <div class="toc-section">
#                         <div class="toc-section-title">Investment Thesis</div>
#                         <div class="toc-section-desc">Core investment rationale, strategic positioning, and growth drivers</div>
#                     </div>
#                 </div>
                
#                 <div class="toc-item">
#                     <div class="toc-number">03</div>
#                     <div class="toc-section">
#                         <div class="toc-section-title">Financial Analysis</div>
#                         <div class="toc-section-desc">Revenue trends, profitability metrics, and financial health assessment</div>
#                     </div>
#                 </div>
                
#                 <div class="toc-item">
#                     <div class="toc-number">04</div>
#                     <div class="toc-section">
#                         <div class="toc-section-title">Business Analysis</div>
#                         <div class="toc-section-desc">Market position, competitive advantages, and operational excellence</div>
#                     </div>
#                 </div>
                
#                 <div class="toc-item">
#                     <div class="toc-number">05</div>
#                     <div class="toc-section">
#                         <div class="toc-section-title">Risk Assessment</div>
#                         <div class="toc-section-desc">Key risks, mitigation strategies, and sensitivity analysis</div>
#                     </div>
#                 </div>
                
#                 <div class="toc-item">
#                     <div class="toc-number">06</div>
#                     <div class="toc-section">
#                         <div class="toc-section-title">Valuation & Recommendation</div>
#                         <div class="toc-section-desc">Valuation methodology, price targets, and investment recommendation</div>
#                     </div>
#                 </div>
#             </div>
#         </div>
#         """
    
#     def generate_disclaimer(self):
#         """Generate comprehensive legal disclaimer with fixed layout for single page"""
#         return f"""
#         <div class="disclaimer-page page-break clearfix" id="disclaimer">
#             <div class="page-header clearfix">
#                 <div class="header-left">
#                     <span class="header-company">{self.company_name.upper()}</span>
#                     <span class="header-separator">|</span>
#                     <span class="header-section">Important Disclosures</span>
#                 </div>
#             </div>
            
#             <h1 class="section-title">Important Disclosures</h1>
            
#             <div class="disclaimer-grid">
#                 <div class="disclaimer-card">
#                     <div class="disclaimer-icon">📋</div>
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
#                     <p>Before making any investment decisions, investors should consult with qualified financial advisors, tax professionals, and legal counsel as appropriate for their individual circumstances. This report should be used as one of many tools in your investment decision-making process.</p>
#                 </div>
#             </div>
            
#             <div class="generation-info">
#                 <div class="info-row">
#                     <span class="info-label">Report Generated:</span>
#                     <span class="info-value">{self.report_date}</span>
#                 </div>
#                 <div class="info-row">
#                     <span class="info-label">Version:</span>
#                     <span class="info-value">Automated Research Report v4.0</span>
#                 </div>
#                 <div class="info-row">
#                     <span class="info-label">Powered by:</span>
#                     <span class="info-value">Investimate AI Research Platform</span>
#                 </div>
#             </div>
#         </div>
#         """
    
#     def get_report_css(self):
#         """Modern, visually appealing CSS compatible with WeasyPrint"""
#         return """
#         @page {
#             size: A4;
#             margin: 0.75in;
#             @top-right {
#                 content: "Page " counter(page);
#                 font-size: 9pt;
#                 color: #64748b;
#                 font-weight: 500;
#             }
#         }
        
#         * {
#             box-sizing: border-box;
#         }
        
#         body {
#             font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
#             line-height: 1.6;
#             color: #1e293b;
#             margin: 0;
#             padding: 0;
#             font-size: 11pt;
#             font-weight: 400;
#         }
        
#         /* Cover Page - Simplified for WeasyPrint */
#         .cover-page {
#             padding: 0;
#             page-break-after: always;
#             background: #667eea;
#             color: white;
#             min-height: 900px;
#             position: relative;
#         }
        
#         .cover-header {
#             padding: 3rem 3rem 2rem;
#             position: relative;
#             z-index: 2;
#             border-bottom: 1px solid rgba(255, 255, 255, 0.2);
#         }
        
#         .logo-container {
#             text-align: center;
#         }
        
#         .logo {
#             width: 60px;
#             height: 60px;
#             background: rgba(255, 255, 255, 0.15);
#             border-radius: 16px;
#             border: 2px solid rgba(255, 255, 255, 0.3);
#             display: inline-block;
#             text-align: center;
#             line-height: 56px;
#             font-size: 24px;
#             font-weight: bold;
#             margin-bottom: 1rem;
#         }
        
#         .logo-text {
#             text-align: center;
#         }
        
#         .brand-name {
#             font-size: 2rem;
#             font-weight: 800;
#             color: white;
#             display: block;
#             margin-bottom: 0.25rem;
#             letter-spacing: -0.5px;
#         }
        
#         .brand-tagline {
#             font-size: 1rem;
#             color: rgba(255, 255, 255, 0.85);
#             font-weight: 400;
#             letter-spacing: 0.5px;
#         }
        
#         .cover-main {
#             padding: 4rem 3rem;
#             text-align: center;
#             position: relative;
#             z-index: 2;
#         }
        
#         .cover-badge {
#             background: rgba(255, 255, 255, 0.2);
#             border: 1px solid rgba(255, 255, 255, 0.3);
#             border-radius: 50px;
#             padding: 1rem 2.5rem;
#             margin-bottom: 3rem;
#             display: inline-block;
#         }
        
#         .badge-text {
#             color: white;
#             font-size: 0.875rem;
#             font-weight: 700;
#             letter-spacing: 2px;
#             text-transform: uppercase;
#         }
        
#         .cover-company-name {
#             font-size: 4.5rem;
#             font-weight: 900;
#             color: white;
#             margin: 0 0 2rem 0;
#             line-height: 0.85;
#             letter-spacing: -2px;
#             text-transform: uppercase;
#         }
        
#         .cover-subtitle {
#             margin-bottom: 3rem;
#         }
        
#         .subtitle-text {
#             font-size: 1.375rem;
#             color: rgba(255, 255, 255, 0.9);
#             font-weight: 300;
#             letter-spacing: 0.5px;
#         }
        
#         .analysis-date {
#             background: rgba(255, 255, 255, 0.15);
#             border: 1px solid rgba(255, 255, 255, 0.25);
#             border-radius: 12px;
#             padding: 1.5rem 2rem;
#             margin: 2rem auto;
#             max-width: 400px;
#             text-align: center;
#         }
        
#         .date-label {
#             font-size: 0.875rem;
#             color: rgba(255, 255, 255, 0.7);
#             margin-bottom: 0.5rem;
#             text-transform: uppercase;
#             letter-spacing: 1px;
#         }
        
#         .date-value {
#             font-size: 1.25rem;
#             font-weight: 600;
#             color: white;
#         }
        
#         .feature-grid {
#             margin: 3rem 0;
#         }
        
#         .feature-row {
#             text-align: center;
#         }
        
#         .feature-item {
#             display: inline-block;
#             padding: 1.5rem;
#             text-align: center;
#             vertical-align: top;
#             width: 45%;
#             margin: 0 2%;
#         }
        
#         .feature-icon {
#             font-size: 2rem;
#             margin-bottom: 1rem;
#             display: block;
#         }
        
#         .feature-title {
#             font-weight: 600;
#             color: white;
#             margin-bottom: 0.5rem;
#             font-size: 1.125rem;
#         }
        
#         .feature-desc {
#             font-size: 0.875rem;
#             color: rgba(255, 255, 255, 0.8);
#             line-height: 1.4;
#         }
        
#         .cover-footer {
#             padding: 2rem 3rem 3rem;
#             position: relative;
#             z-index: 2;
#             border-top: 1px solid rgba(255, 255, 255, 0.2);
#         }
        
#         .footer-warning {
#             background: rgba(255, 255, 255, 0.1);
#             border: 1px solid rgba(255, 255, 255, 0.25);
#             border-radius: 12px;
#             padding: 1.25rem 1.5rem;
#             text-align: center;
#         }
        
#         .warning-text {
#             font-size: 0.875rem;
#             color: rgba(255, 255, 255, 0.9);
#             line-height: 1.5;
#         }
        
#         /* Page Headers */
#         .page-header {
#             padding: 0.75rem 0;
#             margin-bottom: 2rem;
#             border-bottom: 3px solid #6366f1;
#             font-size: 0.875rem;
#             position: relative;
#             overflow: hidden;
#         }
        
#         .page-header::after {
#             content: '';
#             position: absolute;
#             bottom: -3px;
#             left: 0;
#             width: 60px;
#             height: 3px;
#             background: #8b5cf6;
#         }
        
#         .header-left {
#             float: left;
#         }
        
#         .header-company {
#             font-weight: 700;
#             color: #6366f1;
#             text-transform: uppercase;
#             letter-spacing: 0.5px;
#         }
        
#         .header-separator {
#             color: #64748b;
#             margin: 0 0.75rem;
#         }
        
#         .header-section {
#             color: #475569;
#             font-weight: 500;
#         }
        
#         /* Table of Contents */
#         .toc-page {
#             padding: 3rem 0;
#             page-break-after: always;
#         }
        
#         .toc-title {
#             font-size: 3rem;
#             color: #1e293b;
#             margin-bottom: 3rem;
#             text-align: center;
#             font-weight: 800;
#             position: relative;
#         }
        
#         .toc-title::after {
#             content: '';
#             position: absolute;
#             bottom: -1rem;
#             left: 50%;
#             margin-left: -50px;
#             width: 100px;
#             height: 4px;
#             background: #6366f1;
#             border-radius: 2px;
#         }
        
#         .toc-content {
#             max-width: 700px;
#             margin: 0 auto;
#         }
        
#         .toc-item {
#             margin: 1.5rem 0;
#             padding: 2rem;
#             background: #ffffff;
#             border-radius: 16px;
#             border-left: 6px solid #6366f1;
#             page-break-inside: avoid;
#         }
        
#         .toc-number {
#             width: 50px;
#             height: 50px;
#             background: #6366f1;
#             color: white;
#             border-radius: 12px;
#             display: inline-block;
#             text-align: center;
#             line-height: 50px;
#             font-weight: 700;
#             font-size: 1.125rem;
#             float: left;
#             margin-right: 1.5rem;
#         }
        
#         .toc-section {
#             margin-left: 75px;
#         }
        
#         .toc-section-title {
#             font-weight: 700;
#             color: #1e293b;
#             font-size: 1.25rem;
#             margin-bottom: 0.5rem;
#         }
        
#         .toc-section-desc {
#             color: #475569;
#             font-size: 0.9rem;
#             line-height: 1.5;
#         }
        
#         /* Section Styles */
#         .section {
#             margin: 3rem 0;
#             padding: 1rem 0;
#             clear: both;
#         }
        
#         .section-title {
#             font-size: 2.75rem;
#             color: #6366f1;
#             margin-bottom: 2.5rem;
#             font-weight: 800;
#             position: relative;
#             padding-bottom: 1rem;
#         }
        
#         .section-title::after {
#             content: '';
#             position: absolute;
#             bottom: 0;
#             left: 0;
#             width: 120px;
#             height: 6px;
#             background: #6366f1;
#             border-radius: 3px;
#         }
        
#         .content {
#             line-height: 1.8;
#             font-size: 11.5pt;
#         }
        
#         .content h1 {
#             font-size: 2rem;
#             color: #1e293b;
#             margin: 3rem 0 1.5rem 0;
#             font-weight: 700;
#             border-left: 6px solid #6366f1;
#             padding-left: 1.5rem;
#             page-break-after: avoid;
#         }
        
#         .content h2 {
#             font-size: 1.5rem;
#             color: #1e293b;
#             margin: 2.5rem 0 1rem 0;
#             font-weight: 600;
#             page-break-after: avoid;
#         }
        
#         .content h3 {
#             font-size: 1.25rem;
#             color: #1e293b;
#             margin: 2rem 0 0.75rem 0;
#             font-weight: 600;
#             page-break-after: avoid;
#         }
        
#         .content p {
#             margin: 1.5rem 0;
#             text-align: justify;
#             color: #1e293b;
#             line-height: 1.8;
#         }
        
#         .content ul {
#             margin: 2rem 0;
#             padding-left: 0;
#         }
        
#         .content li {
#             margin: 1rem 0;
#             line-height: 1.7;
#             list-style: none;
#             position: relative;
#             padding-left: 2rem;
#             color: #1e293b;
#         }
        
#         .content li::before {
#             content: '●';
#             color: #6366f1;
#             font-size: 1.2em;
#             position: absolute;
#             left: 0;
#             font-weight: bold;
#         }
        
#         .content strong {
#             font-weight: 700;
#             color: #1e293b;
#         }
        
#         /* Tables */
#         table {
#             width: 100%;
#             border-collapse: collapse;
#             margin: 2.5rem 0;
#             background: #ffffff;
#             border-radius: 12px;
#             overflow: hidden;
#             page-break-inside: avoid;
#         }
        
#         th, td {
#             padding: 1.25rem 1rem;
#             text-align: left;
#             border-bottom: 1px solid #e2e8f0;
#             vertical-align: top;
#         }
        
#         th {
#             background: #6366f1;
#             color: white;
#             font-weight: 700;
#             font-size: 0.9rem;
#             text-transform: uppercase;
#             letter-spacing: 0.5px;
#         }
        
#         tr:nth-child(even) {
#             background-color: #f8fafc;
#         }
        
#         td:first-child {
#             font-weight: 600;
#             color: #1e293b;
#         }
        
#         /* Financial metrics styling */
#         .metric-positive {
#             color: #10b981;
#             font-weight: 600;
#         }
        
#         .metric-negative {
#             color: #ef4444;
#             font-weight: 600;
#         }
        
#         /* Page Breaks */
#         .page-break {
#             page-break-before: always;
#         }
        
#         /* Risk Indicators */
#         .risk-high {
#             color: #ef4444;
#             font-weight: 700;
#             background: rgba(239, 68, 68, 0.1);
#             padding: 0.375rem 0.75rem;
#             border-radius: 6px;
#             border: 1px solid rgba(239, 68, 68, 0.2);
#         }
        
#         .risk-medium {
#             color: #f59e0b;
#             font-weight: 700;
#             background: rgba(245, 158, 11, 0.1);
#             padding: 0.375rem 0.75rem;
#             border-radius: 6px;
#             border: 1px solid rgba(245, 158, 11, 0.2);
#         }
        
#         .risk-low {
#             color: #10b981;
#             font-weight: 700;
#             background: rgba(16, 185, 129, 0.1);
#             padding: 0.375rem 0.75rem;
#             border-radius: 6px;
#             border: 1px solid rgba(16, 185, 129, 0.2);
#         }
        
#         /* Callout boxes */
#         .callout-box {
#             background: rgba(99, 102, 241, 0.08);
#             border: 2px solid #a5b4fc;
#             border-left: 6px solid #6366f1;
#             border-radius: 12px;
#             padding: 2rem;
#             margin: 2rem 0;
#             page-break-inside: avoid;
#         }
        
#         .callout-title {
#             font-size: 1.125rem;
#             font-weight: 700;
#             color: #6366f1;
#             margin-bottom: 1rem;
#         }
        
#         /* Disclaimer Page */
#         .disclaimer-page {
#             padding: 2rem 0;
#             page-break-before: always;
#         }
        
#         .disclaimer-grid {
#             margin: 2rem 0;
#         }
        
#         .disclaimer-card {
#             background: #ffffff;
#             border: 2px solid #e2e8f0;
#             border-left: 6px solid #6366f1;
#             border-radius: 12px;
#             padding: 2rem;
#             margin: 1.5rem 0;
#             page-break-inside: avoid;
#         }
        
#         .disclaimer-icon {
#             font-size: 2.5rem;
#             margin-bottom: 1rem;
#             display: block;
#             color: #6366f1;
#         }
        
#         .disclaimer-card h3 {
#             color: #1e293b;
#             margin: 0 0 1rem 0;
#             font-weight: 700;
#             font-size: 1.25rem;
#         }
        
#         .disclaimer-card p {
#             margin: 0;
#             line-height: 1.7;
#             text-align: justify;
#             color: #475569;
#         }
        
#         .generation-info {
#             margin-top: 3rem;
#             padding: 2rem;
#             background: #f8fafc;
#             border: 2px solid #e2e8f0;
#             border-radius: 16px;
#             text-align: center;
#         }
        
#         .info-row {
#             margin: 1rem 0;
#             padding: 0.75rem 0;
#             border-bottom: 1px solid #e2e8f0;
#         }
        
#         .info-row:last-child {
#             border-bottom: none;
#         }
        
#         .info-label {
#             font-weight: 600;
#             color: #475569;
#             margin-right: 1rem;
#         }
        
#         .info-value {
#             font-weight: 700;
#             color: #1e293b;
#         }
        
#         /* Prepared by signature */
#         .section-footer {
#             margin-top: 3rem;
#             padding-top: 1rem;
#             border-top: 2px solid #e2e8f0;
#             text-align: right;
#             font-style: italic;
#             color: #64748b;
#             font-size: 0.9rem;
#         }
        
#         /* Clear floats utility */
#         .clearfix::after {
#             content: "";
#             display: table;
#             clear: both;
#         }        """
    
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




























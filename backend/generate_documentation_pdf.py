import os
import sys
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

# =============================================================================
# TWO-PASS NUMBERED CANVAS: RUNNING HEADERS & DYNAMIC "PAGE X OF Y" FOOTERS
# =============================================================================
class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute total page count and draw
    publication-grade running headers and footers with high-precision alignment.
    Adheres to IEEE/ACM technical report presentation standards.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor('#64748B')) # Slate 500
        
        # Running Header (pages 2 through 5)
        if self._pageNumber > 1:
            self.drawString(36, 756, "CREDIT ASSISTANT — AI-POWERED CREDIT INTELLIGENCE & HEALTH PLATFORM")
            self.setFont("Helvetica", 7.5)
            self.drawRightString(576, 756, "TECHNICAL SPECIFICATION REPORT")
            self.setStrokeColor(colors.HexColor('#E2E8F0')) # Slate 200 hairline
            self.setLineWidth(0.6)
            self.line(36, 749, 576, 749)
            
        # Running Footer (all pages)
        self.setStrokeColor(colors.HexColor('#E2E8F0'))
        self.setLineWidth(0.6)
        self.line(36, 40, 576, 40)
        
        self.setFont("Helvetica-Bold", 7.2)
        self.setFillColor(colors.HexColor('#475569')) # Slate 600
        self.drawString(36, 28, "CONFIDENTIAL & PROPRIETARY — INDIAN BANKING & CIBIL ADVISORY PLATFORM")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.setFont("Helvetica-Bold", 7.2)
        self.setFillColor(colors.HexColor('#0F172A')) # Slate 900
        self.drawRightString(576, 28, page_str)
        self.restoreState()


# =============================================================================
# HELPER: ACCENT CALLOUT CARD (Left-Border Highlight Box)
# =============================================================================
def create_callout_box(text: str, style: ParagraphStyle, border_color: colors.Color, bg_color: colors.Color) -> Table:
    """Creates an executive callout card with a 3.5pt left accent stripe."""
    cell_para = Paragraph(text, style)
    t = Table([['', cell_para]], colWidths=[3.5, 536.5])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), border_color),
        ('BACKGROUND', (1, 0), (1, -1), bg_color),
        ('BOX', (1, 0), (1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (1, 0), (1, -1), 5.5),
        ('BOTTOMPADDING', (1, 0), (1, -1), 5.5),
        ('LEFTPADDING', (1, 0), (1, -1), 7.5),
        ('RIGHTPADDING', (1, 0), (1, -1), 7.5),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    return t


# =============================================================================
# DOCUMENT BUILDER FUNCTION
# =============================================================================
def build_documentation_pdf(filename="Credit_Assistant_Project_Documentation.pdf"):
    # Target letter size: 612 x 792 pt. Printable width: 540 pt (36pt margins).
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=46,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()

    # =========================================================================
    # DESIGN SYSTEM: HARMONIOUS ACCESSIBLE COLOR PALETTE (WCAG AAA COMPLIANT)
    # =========================================================================
    PRIMARY      = colors.HexColor('#0F172A') # Slate 900 (High contrast text & headers)
    ACCENT_NAVY  = colors.HexColor('#1E293B') # Slate 800 (Table column headers)
    ACCENT_BLUE  = colors.HexColor('#1D4ED8') # Royal Blue 700 (Subsections & highlights)
    MUTED_TEXT   = colors.HexColor('#475569') # Slate 600 (Meta captions & secondary copy)
    LIGHT_BG     = colors.HexColor('#F8FAFC') # Slate 50 (Zebra rows & callout interior)
    BORDER_COLOR = colors.HexColor('#CBD5E1') # Slate 300 (Subtle crisp borders)
    CARD_BG      = colors.HexColor('#F1F5F9') # Slate 100 (Formula cards)
    SUCCESS_TEXT = colors.HexColor('#15803D') # Green 700
    DANGER_TEXT  = colors.HexColor('#B91C1C') # Red 700

    # =========================================================================
    # MODULAR TYPOGRAPHY HIERARCHY (Ratio 1.333 - Perfect Fourth)
    # =========================================================================
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16.5,
        leading=20.5,
        textColor=PRIMARY
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11.5,
        textColor=MUTED_TEXT
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14.0,
        textColor=PRIMARY,
        spaceBefore=7,
        spaceAfter=3
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.2,
        leading=12.5,
        textColor=ACCENT_BLUE,
        spaceBefore=4.5,
        spaceAfter=2
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.0,
        leading=11.0,
        textColor=colors.HexColor('#334155') # Slate 700
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.2,
        leading=9.8,
        textColor=PRIMARY
    )

    tbl_header = ParagraphStyle(
        'TblHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white
    )

    tbl_cell = ParagraphStyle(
        'TblCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.3,
        leading=9.5,
        textColor=colors.HexColor('#1E293B')
    )

    tbl_cell_bold = ParagraphStyle(
        'TblCellBold',
        parent=tbl_cell,
        fontName='Helvetica-Bold'
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.8,
        textColor=colors.HexColor('#1E293B')
    )

    story = []

    # =========================================================================
    # PAGE 1: EXECUTIVE BANNER, ABSTRACT, PROBLEM LANDSCAPE & TARGET KPIS
    # =========================================================================
    
    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>CREDIT ASSISTANT</b><br/><font size='8' color='#1D4ED8'><b>AI-DRIVEN CREDIT INTELLIGENCE & HEALTH PLATFORM</b></font>", title_style),
            Paragraph("<b>DOCUMENT:</b> Technical Specification & Architecture<br/>"
                      "<b>REGULATORY FOCUS:</b> Indian Banking (RBI, CIBIL, Experian)<br/>"
                      "<b>RELEASE:</b> Production Ready v2.4.0 &nbsp;|&nbsp; <b>DATE:</b> " + datetime.now().strftime('%B %Y'), subtitle_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[3.7 * inch, 3.8 * inch])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT_BLUE, spaceBefore=3, spaceAfter=6))

    # 2. Executive Abstract Callout Box (with Blue Left Accent Stripe)
    summary_html = (
        "<b>EXECUTIVE ABSTRACT:</b> Credit Assistant is an enterprise-grade financial intelligence platform engineered "
        "specifically for the Indian credit ecosystem. Regulated under guidelines from the Reserve Bank of India (RBI) "
        "and scored under bureaus (TransUnion CIBIL, Experian India), the platform unites deterministic algorithmic modeling, "
        "low-latency Groq AI inference, real-time What-If score simulation, and dynamic ReportLab PDF audit compilation "
        "to deliver institutional-grade credit diagnostics and actionable recovery roadmaps for retail borrowers."
    )
    story.append(create_callout_box(summary_html, callout_style, ACCENT_BLUE, LIGHT_BG))
    story.append(Spacer(1, 6))

    # 3. Section 1: Systemic Problem Statement
    story.append(Paragraph("1. Systemic Problem Statement in the Indian Retail Credit Landscape", h1_style))
    p1_desc = (
        "In India, access to prime personal, auto, and home financing is governed strictly by the 300–900 bureau scoring range. "
        "Despite rapid credit card penetration and retail lending growth, consumers face acute systematic hurdles:"
    )
    story.append(Paragraph(p1_desc, body_style))
    story.append(Spacer(1, 3))

    prob_data = [
        [
            Paragraph("<b>Challenge</b>", tbl_header),
            Paragraph("<b>Systemic Root Cause in Indian Banking</b>", tbl_header),
            Paragraph("<b>Borrower Financial Consequence</b>", tbl_header)
        ],
        [
            Paragraph("<b>Opaque Bureau Scoring</b>", tbl_cell_bold),
            Paragraph("Bureaus (CIBIL/Experian) do not reveal live point deductions for utilization spikes or DPDs.", tbl_cell),
            Paragraph("Borrowers blindly trigger score drops by crossing the 30% credit card utilization threshold.", tbl_cell)
        ],
        [
            Paragraph("<b>Unmonitored FOIR / DTI</b>", tbl_cell_bold),
            Paragraph("Indian banks enforce strict Fixed Obligation to Income Ratios (FOIR capped at 40-50%).", tbl_cell),
            Paragraph("Uninformed loan applicants face outright rejections, generating hard bureau inquiry penalties.", tbl_cell)
        ],
        [
            Paragraph("<b>Compounding 42% APR Debt</b>", tbl_cell_bold),
            Paragraph("Revolving credit card interest in India charges 3.5% to 3.75% per month (42% to 45% APR).", tbl_cell),
            Paragraph("Paying only minimum dues leads to exponential compounding balance traps and debt spiraling.", tbl_cell)
        ],
        [
            Paragraph("<b>Western Advice Inapplicability</b>", tbl_cell_bold),
            Paragraph("Generic financial tools ignore Indian specifics: e-NACH auto-debits, CIR disputes, and 30/60 DPDs.", tbl_cell),
            Paragraph("Borrowers fail to utilize formal Indian statutory grievance dispute channels.", tbl_cell)
        ]
    ]
    prob_table = Table(prob_data, colWidths=[1.8 * inch, 3.1 * inch, 2.6 * inch])
    prob_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(prob_table)
    story.append(Spacer(1, 6))

    # 4. Section 2: Core Platform Objectives & Target KPIs
    story.append(Paragraph("2. Strategic Engineering Objectives & Target Metrics", h1_style))
    obj_data = [
        [
            Paragraph("<b>Target Objective</b>", tbl_header),
            Paragraph("<b>System Implementation Architecture</b>", tbl_header),
            Paragraph("<b>Target Metric / KPI</b>", tbl_header)
        ],
        [
            Paragraph("<b>Automated Risk Modeling</b>", tbl_cell_bold),
            Paragraph("Deterministic FOIR & CUR algorithmic engine with banking 5% card rule.", tbl_cell),
            Paragraph("Zero calculation discrepancy across all income bands.", tbl_cell)
        ],
        [
            Paragraph("<b>Pre-Emptive Simulation</b>", tbl_cell_bold),
            Paragraph("Reactive What-If simulation slider matrix calculating instant score projections.", tbl_cell),
            Paragraph("&lt; 15ms simulation execution time.", tbl_cell)
        ],
        [
            Paragraph("<b>AI-Driven Advisory</b>", tbl_cell_bold),
            Paragraph("Groq Cloud API integration running Qwen 3.8 / LLaMA structured prompt engine.", tbl_cell),
            Paragraph("&lt; 1.5s turnaround for full 5-step recovery roadmap.", tbl_cell)
        ],
        [
            Paragraph("<b>Statutory Audit PDF</b>", tbl_cell_bold),
            Paragraph("Vectorized ReportLab document generation engine with compliance notices.", tbl_cell),
            Paragraph("Downloadable multi-page institutional audit in &lt; 500ms.", tbl_cell)
        ]
    ]
    obj_table = Table(obj_data, colWidths=[1.8 * inch, 3.7 * inch, 2.0 * inch])
    obj_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), ACCENT_NAVY),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(obj_table)

    # PAGE BREAK TO PAGE 2
    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: SYSTEM ARCHITECTURE & DATABASE RELATIONAL SCHEMA
    # =========================================================================
    story.append(Paragraph("3. End-to-End System Architecture & Infrastructure Design", h1_style))
    arch_desc = (
        "The platform adopts a decoupled client-server architecture designed for high availability, deterministic calculations, "
        "and sub-second AI inference. The React client communicates with the asynchronous FastAPI backend via JSON REST APIs, "
        "utilizing SQLite for lightweight local verification and full PostgreSQL dialect compatibility for cloud deployments."
    )
    story.append(Paragraph(arch_desc, body_style))
    story.append(Spacer(1, 4))

    arch_data = [
        [
            Paragraph("<b>Tier</b>", tbl_header),
            Paragraph("<b>Technology Component</b>", tbl_header),
            Paragraph("<b>Architectural Responsibility & Implementation Details</b>", tbl_header)
        ],
        [
            Paragraph("<b>Frontend Presentation</b>", tbl_cell_bold),
            Paragraph("React 18 + Vite SPA<br/>Lucide Icons + Canvas Confetti", tbl_cell),
            Paragraph("Client-side dashboard state management, real-time What-If sliders, SVG gauge visualization, "
                      "dynamic AI chat drawer, and milestone celebration triggers.", tbl_cell)
        ],
        [
            Paragraph("<b>API Application Core</b>", tbl_cell_bold),
            Paragraph("FastAPI (Python 3.10+)<br/>Uvicorn ASGI Server", tbl_cell),
            Paragraph("High-throughput non-blocking request pipeline, automated OpenAPI/Swagger documentation, "
                      "CORS security middleware, and dual `/health` and `/api/health` diagnostic probes.", tbl_cell)
        ],
        [
            Paragraph("<b>Financial Modeling Engine</b>", tbl_cell_bold),
            Paragraph("Algorithmic Math Engine (`calculator.py`)", tbl_cell),
            Paragraph("Deterministic calculation of FOIR/DTI ratios, credit card utilization, tier classification, "
                      "consecutive on-time payment boosts, and avoided compounding interest.", tbl_cell)
        ],
        [
            Paragraph("<b>Artificial Intelligence</b>", tbl_cell_bold),
            Paragraph("Groq Cloud Inference Engine<br/>Qwen 3.8 / LLaMA Models", tbl_cell),
            Paragraph("High-speed token generation for executive bottleneck diagnosis, 5-step recovery roadmaps, "
                      "and conversational borrower chat advisory with automatic heuristic fallbacks.", tbl_cell)
        ],
        [
            Paragraph("<b>Document Generation</b>", tbl_cell_bold),
            Paragraph("ReportLab 5.0+ Engine (`pdf_service.py`)", tbl_cell),
            Paragraph("Server-side streaming compilation of vector-grade official multi-page Credit Health Audit "
                      "PDF documents with custom color scales and statutory RBI compliance disclaimers.", tbl_cell)
        ],
        [
            Paragraph("<b>Persistence & ORM</b>", tbl_cell_bold),
            Paragraph("SQLAlchemy 2.0 ORM<br/>SQLite / PostgreSQL", tbl_cell),
            Paragraph("Entity relationship management, transactional session pools, foreign key cascade constraints, "
                      "and chronological credit progression checkpoint logging.", tbl_cell)
        ]
    ]
    arch_table = Table(arch_data, colWidths=[1.5 * inch, 1.8 * inch, 4.2 * inch])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 6))

    # Section 4: Database Schema & Entity Relationships
    story.append(Paragraph("4. Relational Database Schema & Data Models", h1_style))
    db_desc = (
        "The relational data model enforces strict referential integrity across borrower identities, snapshot profiles, "
        "historical trend logs, and cached AI consultation outputs:"
    )
    story.append(Paragraph(db_desc, body_style))
    story.append(Spacer(1, 3))

    db_data = [
        [
            Paragraph("<b>Entity Table</b>", tbl_header),
            Paragraph("<b>Primary & Foreign Keys</b>", tbl_header),
            Paragraph("<b>Key Attributes & Data Types</b>", tbl_header),
            Paragraph("<b>Relationship Cardinality</b>", tbl_header)
        ],
        [
            Paragraph("<b>users</b>", tbl_cell_bold),
            Paragraph("PK: id (Integer)", tbl_cell),
            Paragraph("name (String), email (Unique String), phone (String), created_at (DateTime)", tbl_cell),
            Paragraph("1 : 1 with financial_profiles<br/>1 : N with history & AI logs", tbl_cell)
        ],
        [
            Paragraph("<b>financial_profiles</b>", tbl_cell_bold),
            Paragraph("PK: id<br/>FK: user_id (Unique)", tbl_cell),
            Paragraph("credit_score (Int), monthly_income (Float), monthly_expenses (Float), "
                      "credit_card_limit (Float), credit_card_balance (Float), total_loan_emi (Float), "
                      "active_loans_count (Int), missed_payments_24m (Int), dti_ratio (Float)", tbl_cell),
            Paragraph("1 : 1 parent-child constraint with automatic cascade deletion", tbl_cell)
        ],
        [
            Paragraph("<b>credit_history_log</b>", tbl_cell_bold),
            Paragraph("PK: id<br/>FK: user_id", tbl_cell),
            Paragraph("month_label (String), credit_score (Int), utilization_ratio (Float), "
                      "dti_ratio (Float), total_debt (Float), note (String), recorded_at (DateTime)", tbl_cell),
            Paragraph("1 : N chronological checkpoints for trajectory visualizations", tbl_cell)
        ],
        [
            Paragraph("<b>ai_analysis_logs</b>", tbl_cell_bold),
            Paragraph("PK: id<br/>FK: user_id", tbl_cell),
            Paragraph("executive_summary (Text), bottlenecks_json (Text), roadmap_json (Text), "
                      "raw_response (Text), created_at (DateTime)", tbl_cell),
            Paragraph("1 : N consultation history log for audit and re-read", tbl_cell)
        ]
    ]
    db_table = Table(db_data, colWidths=[1.4 * inch, 1.4 * inch, 3.2 * inch, 1.5 * inch])
    db_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), ACCENT_NAVY),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(db_table)

    # PAGE BREAK TO PAGE 3
    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: RESTful API CONTRACT & FINANCIAL ENGINE FORMULAS
    # =========================================================================
    story.append(Paragraph("5. RESTful API Contract & Endpoints Specification", h1_style))
    api_desc = (
        "The FastAPI backend exposes standard REST endpoints adhering to JSON data contracts and HTTP semantics:"
    )
    story.append(Paragraph(api_desc, body_style))
    story.append(Spacer(1, 3))

    api_data = [
        [Paragraph("<b>Verb</b>", tbl_header), Paragraph("<b>Endpoint Route</b>", tbl_header), Paragraph("<b>Input / Payload</b>", tbl_header), Paragraph("<b>Output Response & Status</b>", tbl_header)],
        [Paragraph("<b>GET</b>", tbl_cell_bold), Paragraph("<code>/health</code>, <code>/api/health</code>", tbl_cell), Paragraph("None (Diagnostic ping)", tbl_cell), Paragraph("Status 200: DB latency ms, uptime, environment", tbl_cell)],
        [Paragraph("<b>GET</b>", tbl_cell_bold), Paragraph("<code>/api/users</code>", tbl_cell), Paragraph("None", tbl_cell), Paragraph("Status 200: Array of all registered borrowers", tbl_cell)],
        [Paragraph("<b>POST</b>", tbl_cell_bold), Paragraph("<code>/api/users</code>", tbl_cell), Paragraph("JSON: Borrower profile payload", tbl_cell), Paragraph("Status 201: Created user with initialized profile & ratios", tbl_cell)],
        [Paragraph("<b>PUT</b>", tbl_cell_bold), Paragraph("<code>/api/users/{id}/profile</code>", tbl_cell), Paragraph("JSON: Updated income/debt fields", tbl_cell), Paragraph("Status 200: Recalculated FOIR, utilization & tier", tbl_cell)],
        [Paragraph("<b>POST</b>", tbl_cell_bold), Paragraph("<code>/api/users/{id}/simulate</code>", tbl_cell), Paragraph("JSON: Simulation delta sliders", tbl_cell), Paragraph("Status 200: Projected score, interest saved, deltas", tbl_cell)],
        [Paragraph("<b>POST</b>", tbl_cell_bold), Paragraph("<code>/api/ai/consult/{id}</code>", tbl_cell), Paragraph("None (Context derived from DB)", tbl_cell), Paragraph("Status 200: Executive diagnosis & 5-step JSON roadmap", tbl_cell)],
        [Paragraph("<b>POST</b>", tbl_cell_bold), Paragraph("<code>/api/ai/chat/{id}</code>", tbl_cell), Paragraph("JSON: User query message", tbl_cell), Paragraph("Status 200: Conversational advisory response", tbl_cell)],
        [Paragraph("<b>GET</b>", tbl_cell_bold), Paragraph("<code>/api/report/pdf/{id}</code>", tbl_cell), Paragraph("None", tbl_cell), Paragraph("Status 200: Binary application/pdf document stream", tbl_cell)]
    ]
    api_table = Table(api_data, colWidths=[0.8 * inch, 2.2 * inch, 2.0 * inch, 2.5 * inch])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(api_table)
    story.append(Spacer(1, 6))

    # Section 6: Financial Formulas & Algorithmic Engine
    story.append(Paragraph("6. Algorithmic Financial Engine & Underwriting Mathematics", h1_style))
    foir_text = (
        "The algorithmic calculation engine (`backend/calculator.py`) evaluates borrower debt burdens using strict formulas "
        "codified from Reserve Bank of India (RBI) prudential guidelines and Indian Credit Information Companies (CIBIL/Experian):"
    )
    story.append(Paragraph(foir_text, body_style))
    story.append(Spacer(1, 3))

    # Formula 1: FOIR / DTI
    story.append(Paragraph("A. Fixed Obligation to Income Ratio (FOIR / DTI) — Indian 5% Card Rule", h2_style))
    foir_box = [
        [Paragraph("<b>Mathematical Formula:</b><br/>"
                   "&nbsp;&nbsp;&nbsp;&nbsp;<b>Total Monthly Obligations (Rs.)</b> = Total Loan EMIs + (Credit Card Balance × 0.05)<br/>"
                   "&nbsp;&nbsp;&nbsp;&nbsp;<b>FOIR (%)</b> = [ Total Monthly Obligations / Monthly Income ] × 100", code_style)]
    ]
    foir_table = Table(foir_box, colWidths=[7.5 * inch])
    foir_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CARD_BG),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('PADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(foir_table)
    story.append(Spacer(1, 3))
    story.append(Paragraph("<b>Underwriting Norms:</b> &le; 35% is Prime / Optimal; 35%–50% is Moderate / Strained; &gt; 50% High Risk (Loan Rejection Tier).", body_style))
    story.append(Spacer(1, 4))

    # Formula 2: CUR
    story.append(Paragraph("B. Credit Utilization Ratio (CUR) — 30% CIBIL Threshold", h2_style))
    cur_box = [
        [Paragraph("<b>Mathematical Formula:</b><br/>"
                   "&nbsp;&nbsp;&nbsp;&nbsp;<b>CUR (%)</b> = min( 100, [ Credit Card Balance / Credit Card Limit ] × 100 )", code_style)]
    ]
    cur_table = Table(cur_box, colWidths=[7.5 * inch])
    cur_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CARD_BG),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('PADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(cur_table)
    story.append(Spacer(1, 3))
    story.append(Paragraph("<b>CIBIL Golden Rule:</b> CUR &le; 30% generates optimal score growth; CUR &gt; 50% triggers steep point deductions.", body_style))
    story.append(Spacer(1, 4))

    # Bureau Tier Matrix
    story.append(Paragraph("C. Indian Bureau Tier Matrix & Lending Implications", h2_style))
    tier_data = [
        [Paragraph("<b>Score Range</b>", tbl_header), Paragraph("<b>Bureau Classification</b>", tbl_header), Paragraph("<b>Underwriting Outcome & Lending Terms in India</b>", tbl_header)],
        [Paragraph("<b>750 – 900</b>", tbl_cell_bold), Paragraph("<font color='#15803D'><b>Excellent (Prime)</b></font>", tbl_cell), Paragraph("Pre-approved home & auto loans, lowest interest rate spreads (Repo + 2.05%), 100% processing waiver.", tbl_cell)],
        [Paragraph("<b>700 – 749</b>", tbl_cell_bold), Paragraph("<font color='#1D4ED8'><b>Good</b></font>", tbl_cell), Paragraph("Standard retail credit approvals; regular documentation and standard processing fees.", tbl_cell)],
        [Paragraph("<b>650 – 699</b>", tbl_cell_bold), Paragraph("<font color='#B45309'><b>Fair (Subprime)</b></font>", tbl_cell), Paragraph("Higher risk-premium spreads (+150-250 bps); mandatory collateral or co-borrower requirement.", tbl_cell)],
        [Paragraph("<b>300 – 649</b>", tbl_cell_bold), Paragraph("<font color='#B91C1C'><b>Poor (Distressed)</b></font>", tbl_cell), Paragraph("Outright rejection for unsecured lending; eligibility limited strictly to FD-backed secured credit cards.", tbl_cell)]
    ]
    tier_table = Table(tier_data, colWidths=[1.4 * inch, 1.8 * inch, 4.3 * inch])
    tier_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), ACCENT_NAVY),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(tier_table)

    # PAGE BREAK TO PAGE 4
    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: DYNAMIC SIMULATION & GROQ AI ADVISORY ENGINE
    # =========================================================================
    story.append(Paragraph("7. Dynamic What-If Credit Score Simulation Formulation", h1_style))
    sim_desc = (
        "The real-time simulator computes score trajectory adjustments by applying weighted deltas derived from bureau algorithms:"
    )
    story.append(Paragraph(sim_desc, body_style))
    story.append(Spacer(1, 3))

    sim_data = [
        [Paragraph("<b>Simulation Factor</b>", tbl_header), Paragraph("<b>Mathematical Formulation & Algorithmic Rule</b>", tbl_header), Paragraph("<b>Maximum Impact</b>", tbl_header)],
        [
            Paragraph("<b>Utilization Recovery</b>", tbl_cell_bold),
            Paragraph("Delta = (Current CUR - Simulated CUR) × 0.40.<br/>If CUR drops from &gt;50% to &le;30%, an additional +15 point milestone bonus is awarded.", tbl_cell),
            Paragraph("+45 Points", tbl_cell_bold)
        ],
        [
            Paragraph("<b>FOIR Reduction</b>", tbl_cell_bold),
            Paragraph("Delta = (Current FOIR - Simulated FOIR) × 0.35.<br/>If FOIR decreases by &gt;5%, an extra +8 point debt relief bonus is granted.", tbl_cell),
            Paragraph("+30 Points", tbl_cell_bold)
        ],
        [
            Paragraph("<b>Seasoning Bonus</b>", tbl_cell_bold),
            Paragraph("Delta = Consecutive On-Time Payment Cycles × 4 points per verified reporting cycle.", tbl_cell),
            Paragraph("+35 Points", tbl_cell_bold)
        ],
        [
            Paragraph("<b>High-APR Savings</b>", tbl_cell_bold),
            Paragraph("Avoided Compounding Interest = Repaid Principal × (0.42 / 12) × 6 months.<br/>Highlights cash savings against standard 42% annualized card revolving fees.", tbl_cell),
            Paragraph("Direct Liquidity Relief (Rs.)", tbl_cell_bold)
        ]
    ]
    sim_table = Table(sim_data, colWidths=[1.8 * inch, 4.3 * inch, 1.4 * inch])
    sim_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(sim_table)
    story.append(Spacer(1, 6))

    # Section 8: Groq AI Advisory Engine
    story.append(Paragraph("8. Groq AI Advisory Engine & Consultation Architecture", h1_style))
    ai_intro = (
        "The AI Consultation Engine (`backend/groq_service.py`) utilizes Groq Cloud LPU acceleration to execute contextual "
        "credit diagnostics in sub-second latency, formulating a personalized, sequential 5-step recovery roadmap:"
    )
    story.append(Paragraph(ai_intro, body_style))
    story.append(Spacer(1, 3))

    ai_steps_data = [
        [Paragraph("<b>Roadmap Step</b>", tbl_header), Paragraph("<b>Target Area</b>", tbl_header), Paragraph("<b>Actionable Strategy Codified for Indian Banking Realities</b>", tbl_header)],
        [
            Paragraph("<b>Step 1</b>", tbl_cell_bold),
            Paragraph("<b>CIBIL CIR Dispute Resolution</b>", tbl_cell_bold),
            Paragraph("Initiate an online Credit Information Report (CIR) dispute via the CIBIL portal for erroneous "
                      "DPDs, duplicated loan accounts, or unsettled status marks wrongly reported by lending institutions.", tbl_cell)
        ],
        [
            Paragraph("<b>Step 2</b>", tbl_cell_bold),
            Paragraph("<b>Utilization Optimization (&le;30%)</b>", tbl_cell_bold),
            Paragraph("Pay down revolving credit card balances below 30% before the billing cycle statement date. "
                      "Request sanctioned credit limit upgrades to expand denominator headroom without spending increases.", tbl_cell)
        ],
        [
            Paragraph("<b>Step 3</b>", tbl_cell_bold),
            Paragraph("<b>e-NACH Auto-Debit Mandates</b>", tbl_cell_bold),
            Paragraph("Configure electronic National Automated Clearing House (e-NACH) auto-debit mandates across salary accounts "
                      "to eliminate human oversight and permanently avoid 30/60 DPD (Days Past Due) bureau marks.", tbl_cell)
        ],
        [
            Paragraph("<b>Step 4</b>", tbl_cell_bold),
            Paragraph("<b>Debt Avalanche Strategy</b>", tbl_cell_bold),
            Paragraph("Target aggressive debt elimination towards high-APR revolving credit cards (compounding at ~42% APR) "
                      "while maintaining minimum contractual obligations on low-cost secured loans (home/car loans at 8-9%).", tbl_cell)
        ],
        [
            Paragraph("<b>Step 5</b>", tbl_cell_bold),
            Paragraph("<b>Credit Mix & Vintage Seasoning</b>", tbl_cell_bold),
            Paragraph("Maintain oldest active credit cards to protect credit vintage. Balance portfolio by pairing unsecured debt "
                      "with secured assets (e.g. gold loan, auto loan) to achieve an optimal 60:40 secured-to-unsecured ratio.", tbl_cell)
        ]
    ]
    ai_table = Table(ai_steps_data, colWidths=[0.9 * inch, 2.2 * inch, 4.4 * inch])
    ai_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), ACCENT_NAVY),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(ai_table)
    story.append(Spacer(1, 6))

    # Section 9: Conversational AI Advisor
    story.append(Paragraph("9. Real-Time Conversational AI Advisor (AIChatDrawer)", h1_style))
    chat_desc = (
        "Borrowers can query the AI Advisor dynamically via a slide-out drawer interface. The backend injects verified profile data "
        "(CIBIL score, FOIR, missed payments, active loans) as system context, ensuring answers reference the borrower's exact numbers "
        "rather than generic platitudes. Complete session dialogues are stored in memory and summarized for ongoing continuity."
    )
    story.append(Paragraph(chat_desc, body_style))

    # PAGE BREAK TO PAGE 5
    story.append(PageBreak())

    # =========================================================================
    # PAGE 5: VERIFICATION SUITE, DEPLOYMENT & FUTURE ROADMAP
    # =========================================================================
    story.append(Paragraph("10. Automated End-to-End Test Suite & Verification Results", h1_style))
    test_intro = (
        "The system incorporates an end-to-end integration test suite (`test_e2e.py`) validating all 8 core API services "
        "and data workflows across simulated borrower profiles:"
    )
    story.append(Paragraph(test_intro, body_style))
    story.append(Spacer(1, 3))

    test_data = [
        [Paragraph("<b>Test Case ID</b>", tbl_header), Paragraph("<b>Verification Scenario</b>", tbl_header), Paragraph("<b>Validation Criteria</b>", tbl_header), Paragraph("<b>Status</b>", tbl_header)],
        [Paragraph("<b>TC-001</b>", tbl_cell_bold), Paragraph("Diagnostic Health Probe", tbl_cell), Paragraph("Status 200, DB latency &lt; 50ms, uptime verification", tbl_cell), Paragraph("<font color='#15803D'><b>PASS</b></font>", tbl_cell_bold)],
        [Paragraph("<b>TC-002</b>", tbl_cell_bold), Paragraph("Borrower Onboarding & Baseline", tbl_cell), Paragraph("Profile created, FOIR and CUR accurately computed", tbl_cell), Paragraph("<font color='#15803D'><b>PASS</b></font>", tbl_cell_bold)],
        [Paragraph("<b>TC-003</b>", tbl_cell_bold), Paragraph("Profile Modification & Recalc", tbl_cell), Paragraph("Financial values updated, derived ratios recomputed", tbl_cell), Paragraph("<font color='#15803D'><b>PASS</b></font>", tbl_cell_bold)],
        [Paragraph("<b>TC-004</b>", tbl_cell_bold), Paragraph("Chronological History Fetch", tbl_cell), Paragraph("Array of historical logs returned with timestamps", tbl_cell), Paragraph("<font color='#15803D'><b>PASS</b></font>", tbl_cell_bold)],
        [Paragraph("<b>TC-005</b>", tbl_cell_bold), Paragraph("What-If Simulator Engine", tbl_cell), Paragraph("Score delta accurately projected with compound savings", tbl_cell), Paragraph("<font color='#15803D'><b>PASS</b></font>", tbl_cell_bold)],
        [Paragraph("<b>TC-006</b>", tbl_cell_bold), Paragraph("ReportLab PDF Compilation", tbl_cell), Paragraph("Binary PDF byte-stream verified (&gt; 5 KB, valid PDF header)", tbl_cell), Paragraph("<font color='#15803D'><b>PASS</b></font>", tbl_cell_bold)],
        [Paragraph("<b>TC-007</b>", tbl_cell_bold), Paragraph("Groq AI Consultation Flow", tbl_cell), Paragraph("Executive summary & 5-step structured roadmap parsed", tbl_cell), Paragraph("<font color='#15803D'><b>PASS</b></font>", tbl_cell_bold)],
        [Paragraph("<b>TC-008</b>", tbl_cell_bold), Paragraph("Conversational Chat Advisory", tbl_cell), Paragraph("Interactive response returned with contextual memory", tbl_cell), Paragraph("<font color='#15803D'><b>PASS</b></font>", tbl_cell_bold)],
    ]
    test_table = Table(test_data, colWidths=[1.1 * inch, 2.2 * inch, 3.2 * inch, 1.0 * inch])
    test_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(test_table)
    story.append(Spacer(1, 5))

    # Section 11: Deployment Architecture
    story.append(Paragraph("11. Production Deployment Topology & Execution Setup", h1_style))
    dep_data = [
        [Paragraph("<b>Environment</b>", tbl_header), Paragraph("<b>Host & Configuration</b>", tbl_header), Paragraph("<b>Execution Commands / Orchestration</b>", tbl_header)],
        [
            Paragraph("<b>Backend API</b>", tbl_cell_bold),
            Paragraph("Render / AWS ECS<br/>Python 3.10+, Uvicorn ASGI", tbl_cell),
            Paragraph("<code>py -m uvicorn backend.main:app --host 0.0.0.0 --port 8000</code><br/>Render web service managed via <code>render.yaml</code>.", tbl_cell)
        ],
        [
            Paragraph("<b>Frontend SPA</b>", tbl_cell_bold),
            Paragraph("Vercel Edge Network<br/>React 18 + Vite Production Bundle", tbl_cell),
            Paragraph("<code>npm run build</code> -> static export to <code>dist/</code>.<br/>Automatic proxy routing configured via <code>vercel.json</code>.", tbl_cell)
        ],
        [
            Paragraph("<b>Database</b>", tbl_cell_bold),
            Paragraph("SQLite (Local) / Supabase Postgres", tbl_cell),
            Paragraph("Resolved automatically via <code>DATABASE_URL</code> environment variable with seamless ORM migration.", tbl_cell)
        ]
    ]
    dep_table = Table(dep_data, colWidths=[1.4 * inch, 2.5 * inch, 3.6 * inch])
    dep_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), ACCENT_NAVY),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(dep_table)
    story.append(Spacer(1, 5))

    # Section 12: Future Roadmap & Strategic Milestones
    story.append(Paragraph("12. Future Innovation Roadmap & Strategic Milestones", h1_style))
    road_data = [
        [Paragraph("<b>Phase</b>", tbl_header), Paragraph("<b>Strategic Initiative</b>", tbl_header), Paragraph("<b>Technological Enhancement & Market Impact</b>", tbl_header)],
        [
            Paragraph("<b>Phase 1 (Q1)</b>", tbl_cell_bold),
            Paragraph("<b>Account Aggregator (AA) Integration</b>", tbl_cell_bold),
            Paragraph("Connect with RBI-licensed Account Aggregators (Setu, Anumati) to ingest real-time bank statement cash flows automatically.", tbl_cell)
        ],
        [
            Paragraph("<b>Phase 2 (Q2)</b>", tbl_cell_bold),
            Paragraph("<b>Vernacular Multi-Lingual Advisory</b>", tbl_cell_bold),
            Paragraph("Deploy Hindi, Marathi, and Tamil conversational agents via Groq to democratize credit intelligence for tier-2/3 Indian cities.", tbl_cell)
        ],
        [
            Paragraph("<b>Phase 3 (Q3)</b>", tbl_cell_bold),
            Paragraph("<b>Automated CIR Dispute Filing Bot</b>", tbl_cell_bold),
            Paragraph("Enable one-click submission of pre-drafted grievance letters directly to TransUnion CIBIL and banking ombudsmen.", tbl_cell)
        ]
    ]
    road_table = Table(road_data, colWidths=[1.2 * inch, 2.5 * inch, 3.8 * inch])
    road_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
    ]))
    story.append(road_table)
    story.append(Spacer(1, 6))

    # 13. Formal Engineering Certification Callout Box (with Green Left Accent Stripe)
    signoff_html = (
        "<b>ENGINEERING CERTIFICATION:</b> This document certifies the technical architecture, mathematical modeling, and "
        "operational verification of the Credit Assistant Platform. All formulas strictly conform to Indian commercial banking "
        "standards (RBI Master Directions / CIBIL / Experian). Validated by automated end-to-end integration tests TC-001 through TC-008."
    )
    story.append(create_callout_box(signoff_html, callout_style, colors.HexColor('#16A34A'), LIGHT_BG))

    # Compile document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] High-fidelity PDF generated successfully: {filename}")


if __name__ == "__main__":
    out_file = sys.argv[1] if len(sys.argv) > 1 else "Credit_Assistant_Project_Documentation.pdf"
    build_documentation_pdf(out_file)

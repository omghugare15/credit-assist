import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def clean_txt(val) -> str:
    if val is None:
        return ""
    return str(val).replace('₹', 'Rs. ').replace('’', "'").replace('“', '"').replace('”', '"')


def generate_credit_report_pdf(user_name: str, profile: dict, ai_analysis: dict) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom stylish typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A')
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#64748B')
    )

    heading2_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=10,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#334155')
    )

    badge_style = ParagraphStyle(
        'ScoreBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        alignment=1, # Center
        textColor=colors.HexColor('#059669') if profile.get('credit_score', 650) >= 750 else (
            colors.HexColor('#0284C7') if profile.get('credit_score', 650) >= 700 else (
                colors.HexColor('#D97706') if profile.get('credit_score', 650) >= 650 else colors.HexColor('#DC2626')
            )
        )
    )

    story = []

    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>CREDIT ASSISTANT</b><br/><font size='8' color='#64748B'>AI-POWERED FINANCIAL INTELLIGENCE PLATFORM (INDIA)</font>", title_style),
            Paragraph(f"<b>REPORT ID:</b> CA-{datetime.utcnow().strftime('%Y%m%d')}-{profile.get('user_id', 1):04d}<br/>"
                      f"<b>DATE:</b> {datetime.utcnow().strftime('%d %b %Y')}<br/>"
                      f"<b>BORROWER:</b> {user_name.upper()}", subtitle_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[4.0 * inch, 3.2 * inch])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284C7'), spaceBefore=4, spaceAfter=14))

    # 2. Executive Score Summary Card
    score = profile.get('credit_score', 650)
    tier = profile.get('tier', 'Fair')
    
    summary_card_data = [
        [
            Paragraph(f"<b>{score}</b><br/><font size='9' color='#475569'>CIBIL / EXPERIAN SCORE</font><br/><b><font size='10'>{tier.upper()} TIER</font></b>", badge_style),
            Paragraph(f"<b>EXECUTIVE ASSESSMENT:</b><br/>{clean_txt(ai_analysis.get('executive_summary', 'Financial assessment completed.'))}", body_style)
        ]
    ]
    summary_table = Table(summary_card_data, colWidths=[2.2 * inch, 5.0 * inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#E2E8F0')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 12))

    # 3. Core Financial Metrics Table
    story.append(Paragraph("1. FINANCIAL HEALTH METRICS & BENCHMARKS", heading2_style))
    
    metrics_data = [
        ["Metric", "User Value", "Indian Benchmark", "Status Assessment"],
        ["Credit Score", f"{score} / 900", "750+ for Prime Rates", f"{tier} Category"],
        ["Credit Utilization", f"{profile.get('utilization_ratio', 0)}%", "< 30% Recommended by RBI", "Optimal" if profile.get('utilization_ratio', 0) <= 30 else "High Risk"],
        ["Debt-to-Income (FOIR)", f"{profile.get('dti_ratio', 0)}%", "< 35% Preferred for Loans", "Healthy" if profile.get('dti_ratio', 0) <= 35 else "Elevated Debt"],
        ["Monthly Income", f"INR {profile.get('monthly_income', 0):,.2f}", "Verified Cash Flow", "Active Salaried/Business"],
        ["Monthly Debt EMIs", f"INR {profile.get('total_loan_emi', 0):,.2f}", "Across Active Loans", f"{profile.get('active_loans_count', 0)} Active Facility(s)"],
        ["Credit Card Balance", f"INR {profile.get('credit_card_balance', 0):,.2f}", f"Limit: INR {profile.get('credit_card_limit', 0):,.2f}", "Revolving Debt"],
        ["Missed Payments (24m)", f"{profile.get('missed_payments_24m', 0)} Instances", "0 Tolerance on CIBIL", "Clean Record" if profile.get('missed_payments_24m', 0) == 0 else "Bureau DPD Flag"]
    ]

    metrics_table = Table(metrics_data, colWidths=[2.1 * inch, 1.7 * inch, 1.8 * inch, 1.6 * inch])
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E293B')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('ALIGN', (1, 0), (2, -1), 'CENTER'),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(metrics_table)
    story.append(Spacer(1, 12))

    # 4. Critical Bottlenecks
    bottlenecks = ai_analysis.get('bottlenecks', [])
    if bottlenecks:
        story.append(Paragraph("2. IDENTIFIED FINANCIAL BOTTLENECKS", heading2_style))
        b_data = []
        for i, b in enumerate(bottlenecks, 1):
            b_data.append([
                Paragraph(f"<b>[FLAG {i}]</b>", ParagraphStyle('WarnTag', parent=body_style, fontName='Helvetica-Bold', textColor=colors.HexColor('#B91C1C'))),
                Paragraph(clean_txt(b), body_style)
            ])
        b_table = Table(b_data, colWidths=[0.8 * inch, 6.4 * inch])
        b_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#FEF2F2')),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#FECACA')),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('PADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(b_table)
        story.append(Spacer(1, 12))

    # 5. 5-Step Strategic Action Roadmap
    story.append(Paragraph("3. 5-STEP ACTIONABLE ROADMAP (INDIAN BANKING COMPLIANT)", heading2_style))
    roadmap = ai_analysis.get('roadmap', [])
    
    roadmap_rows = [
        ["#", "Phase & Timeline", "Action Item", "Projected Impact & Bureau Context"]
    ]

    for item in roadmap:
        step_num = item.get('step_number', 1)
        title = clean_txt(item.get('title', 'Action'))
        timeline = clean_txt(item.get('timeline', 'Phase'))
        action = clean_txt(item.get('action', ''))
        impact = clean_txt(item.get('impact', ''))
        context = clean_txt(item.get('indian_context', ''))

        roadmap_rows.append([
            f"{step_num}",
            Paragraph(f"<b>{title}</b><br/><font color='#64748B' size='7.5'>{timeline}</font>", body_style),
            Paragraph(action, body_style),
            Paragraph(f"<b>{impact}</b><br/><font color='#0284C7' size='7.5'><i>{context}</i></font>", body_style)
        ])

    roadmap_table = Table(roadmap_rows, colWidths=[0.35 * inch, 2.2 * inch, 2.4 * inch, 2.25 * inch])
    roadmap_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F766E')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F0FDFA')]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CCFBF1')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(roadmap_table)
    story.append(Spacer(1, 14))

    # 6. Regulatory & Compliance Notice
    disclaimer_text = (
        "<b>Notice & Compliance:</b> This credit assessment report is generated algorithmically and enhanced via Groq AI "
        "utilizing Indian financial framework parameters (TransUnion CIBIL, Experian India, RBI guidelines). "
        "Credit Assistant does not act as a credit bureau or lender. Financial decisions should be verified with licensed financial advisors."
    )
    story.append(Paragraph(disclaimer_text, ParagraphStyle('Disclaimer', parent=styles['Normal'], fontSize=7.5, leading=10, textColor=colors.HexColor('#94A3B8'))))

    doc.build(story)
    buffer.seek(0)
    return buffer

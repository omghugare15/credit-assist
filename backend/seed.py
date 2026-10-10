from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .models import User, FinancialProfile, CreditHistoryLog, AIAnalysisLog
from .calculator import calculate_dti, calculate_utilization, calculate_tier
import json

def seed_database(db: Session):
    existing = db.query(User).first()
    if existing:
        return

    # Seed User 1: Rahul Sharma (Scenario 1 & 2: Fair score with high utilization and debt)
    user1 = User(
        name="Rahul Sharma",
        email="rahul.sharma@example.in",
        phone="+91 98765 43210"
    )
    db.add(user1)
    db.flush()

    prof1 = FinancialProfile(
        user_id=user1.id,
        credit_score=648,
        monthly_income=85000.0,
        monthly_expenses=35000.0,
        credit_card_limit=150000.0,
        credit_card_balance=102000.0,
        total_loan_emi=28000.0,
        active_loans_count=2,
        missed_payments_24m=1,
        credit_age_years=3.5,
        dti_ratio=calculate_dti(85000.0, 28000.0, 102000.0),
        utilization_ratio=calculate_utilization(102000.0, 150000.0),
        tier="Fair"
    )
    db.add(prof1)

    # Historical logs for Rahul
    months = ["May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025"]
    scores = [620, 625, 630, 615, 638, 648]
    utils = [75.0, 74.0, 72.0, 80.0, 71.0, 68.0]
    dtis = [52.0, 51.0, 50.0, 53.0, 49.0, 39.0]
    for i in range(len(months)):
        log = CreditHistoryLog(
            user_id=user1.id,
            month_label=months[i],
            credit_score=scores[i],
            utilization_ratio=utils[i],
            dti_ratio=dtis[i],
            total_debt=130000.0 - (i * 2000),
            note="Monthly credit bureau sync",
            recorded_at=datetime.utcnow() - timedelta(days=(5 - i) * 30)
        )
        db.add(log)

    # Seed User 2: Priya Patel (Scenario 3: Good score, strong progress tracking)
    user2 = User(
        name="Priya Patel",
        email="priya.patel@example.in",
        phone="+91 98201 11223"
    )
    db.add(user2)
    db.flush()

    prof2 = FinancialProfile(
        user_id=user2.id,
        credit_score=742,
        monthly_income=125000.0,
        monthly_expenses=42000.0,
        credit_card_limit=300000.0,
        credit_card_balance=66000.0,
        total_loan_emi=25000.0,
        active_loans_count=1,
        missed_payments_24m=0,
        credit_age_years=6.0,
        dti_ratio=calculate_dti(125000.0, 25000.0, 66000.0),
        utilization_ratio=calculate_utilization(66000.0, 300000.0),
        tier="Good"
    )
    db.add(prof2)

    p_months = ["Jan 2025", "Mar 2025", "May 2025", "Jul 2025", "Sep 2025", "Oct 2025"]
    p_scores = [680, 695, 710, 722, 735, 742]
    p_utils = [38.0, 34.0, 30.0, 26.0, 24.0, 22.0]
    p_dtis = [32.0, 30.0, 28.0, 26.0, 24.0, 22.6]
    for i in range(len(p_months)):
        log = CreditHistoryLog(
            user_id=user2.id,
            month_label=p_months[i],
            credit_score=p_scores[i],
            utilization_ratio=p_utils[i],
            dti_ratio=p_dtis[i],
            total_debt=91000.0 - (i * 3000),
            note="Scheduled repayment milestone",
            recorded_at=datetime.utcnow() - timedelta(days=(5 - i) * 45)
        )
        db.add(log)

    # Seed User 3: Amit Verma (Scenario 4: Rebuilding score with high loan impact)
    user3 = User(
        name="Amit Verma",
        email="amit.verma@example.in",
        phone="+91 97110 99887"
    )
    db.add(user3)
    db.flush()

    prof3 = FinancialProfile(
        user_id=user3.id,
        credit_score=575,
        monthly_income=60000.0,
        monthly_expenses=26000.0,
        credit_card_limit=80000.0,
        credit_card_balance=62000.0,
        total_loan_emi=19000.0,
        active_loans_count=3,
        missed_payments_24m=2,
        credit_age_years=2.0,
        dti_ratio=calculate_dti(60000.0, 19000.0, 62000.0),
        utilization_ratio=calculate_utilization(62000.0, 80000.0),
        tier="Poor"
    )
    db.add(prof3)

    a_months = ["Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025"]
    a_scores = [550, 545, 560, 565, 575]
    a_utils = [88.0, 85.0, 82.0, 80.0, 77.5]
    a_dtis = [44.0, 45.0, 42.0, 41.0, 36.8]
    for i in range(len(a_months)):
        log = CreditHistoryLog(
            user_id=user3.id,
            month_label=a_months[i],
            credit_score=a_scores[i],
            utilization_ratio=a_utils[i],
            dti_ratio=a_dtis[i],
            total_debt=81000.0 - (i * 1500),
            note="Recovery action plan initiated",
            recorded_at=datetime.utcnow() - timedelta(days=(4 - i) * 30)
        )
        db.add(log)

    db.commit()

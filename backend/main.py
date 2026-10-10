from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from .database import engine, Base, get_db
from .models import User, FinancialProfile, CreditHistoryLog, AIAnalysisLog
from .schemas import (
    UserCreate, UserResponse, FinancialProfileUpdate, FinancialProfileResponse,
    HistoryLogItem, AIAnalysisResponse, AIChatRequest, AIChatResponse,
    SimulationRequest, SimulationResponse
)
from .calculator import calculate_dti, calculate_utilization, calculate_tier, run_score_simulation
from .groq_service import generate_ai_credit_consultation, chat_with_credit_advisor, get_fallback_consultation
from .pdf_service import generate_credit_report_pdf
from .seed import seed_database
import json

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Credit Assistant API",
    description="Full-stack AI-Driven Credit Intelligence & Health Platform for Indian Ecosystem",
    version="1.0.0"
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    db = next(get_db())
    try:
        seed_database(db)
    finally:
        db.close()


@app.get("/api/health")
def health():
    return {"status": "ok", "app": "Credit Assistant API", "version": "1.0.0"}


# --- USER MANAGEMENT & ONBOARDING (Scenario 1) ---

@app.get("/api/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@app.post("/api/users", response_model=UserResponse)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        return existing
    
    new_user = User(
        name=payload.name,
        email=payload.email,
        phone=payload.phone
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize default profile
    default_profile = FinancialProfile(
        user_id=new_user.id,
        credit_score=650,
        monthly_income=60000.0,
        monthly_expenses=25000.0,
        credit_card_limit=100000.0,
        credit_card_balance=45000.0,
        total_loan_emi=15000.0,
        active_loans_count=1,
        missed_payments_24m=0,
        credit_age_years=3.0,
        dti_ratio=calculate_dti(60000.0, 15000.0, 45000.0),
        utilization_ratio=calculate_utilization(45000.0, 100000.0),
        tier="Fair"
    )
    db.add(default_profile)

    # Initial history log
    initial_log = CreditHistoryLog(
        user_id=new_user.id,
        month_label=datetime.utcnow().strftime("%b %Y"),
        credit_score=650,
        utilization_ratio=45.0,
        dti_ratio=calculate_dti(60000.0, 15000.0, 45000.0),
        total_debt=60000.0,
        note="Initial onboarding registration"
    )
    db.add(initial_log)
    db.commit()

    return new_user


@app.get("/api/users/{user_id}/profile")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone
        },
        "profile": {
            "id": profile.id,
            "credit_score": profile.credit_score,
            "monthly_income": profile.monthly_income,
            "monthly_expenses": profile.monthly_expenses,
            "credit_card_limit": profile.credit_card_limit,
            "credit_card_balance": profile.credit_card_balance,
            "total_loan_emi": profile.total_loan_emi,
            "active_loans_count": profile.active_loans_count,
            "missed_payments_24m": profile.missed_payments_24m,
            "credit_age_years": profile.credit_age_years,
            "dti_ratio": profile.dti_ratio,
            "utilization_ratio": profile.utilization_ratio,
            "tier": profile.tier,
            "updated_at": profile.updated_at.isoformat() if profile.updated_at else None
        }
    }


# --- FINANCIAL DATA UPDATE & REAL-TIME MONITORING (Scenario 4) ---

@app.put("/api/users/{user_id}/profile")
def update_user_profile(user_id: int, payload: FinancialProfileUpdate, db: Session = Depends(get_db)):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    old_score = profile.credit_score
    old_utilization = profile.utilization_ratio
    old_dti = profile.dti_ratio

    # Update input attributes
    profile.credit_score = max(300, min(900, payload.credit_score))
    profile.monthly_income = max(1.0, payload.monthly_income)
    profile.monthly_expenses = payload.monthly_expenses
    profile.credit_card_limit = max(1.0, payload.credit_card_limit)
    profile.credit_card_balance = max(0.0, payload.credit_card_balance)
    profile.total_loan_emi = max(0.0, payload.total_loan_emi)
    profile.active_loans_count = payload.active_loans_count
    profile.missed_payments_24m = payload.missed_payments_24m
    profile.credit_age_years = payload.credit_age_years

    # Recalculate derived ratios
    profile.dti_ratio = calculate_dti(profile.monthly_income, profile.total_loan_emi, profile.credit_card_balance)
    profile.utilization_ratio = calculate_utilization(profile.credit_card_balance, profile.credit_card_limit)
    profile.tier = calculate_tier(profile.credit_score)
    profile.updated_at = datetime.utcnow()

    # Log improvement / change in credit history if modified
    score_delta = profile.credit_score - old_score
    month_str = datetime.utcnow().strftime("%b %Y")
    latest_log = db.query(CreditHistoryLog).filter(
        CreditHistoryLog.user_id == user_id
    ).order_by(CreditHistoryLog.recorded_at.desc()).first()

    # Add a history log to visualize the impact of changed habits (Scenario 3 & 4)
    if not latest_log or latest_log.credit_score != profile.credit_score or abs(latest_log.utilization_ratio - profile.utilization_ratio) > 1:
        new_log = CreditHistoryLog(
            user_id=user_id,
            month_label=month_str,
            credit_score=profile.credit_score,
            utilization_ratio=profile.utilization_ratio,
            dti_ratio=profile.dti_ratio,
            total_debt=profile.credit_card_balance + (profile.total_loan_emi * 12),
            note=f"Delta {score_delta:+d} pts | Util: {profile.utilization_ratio}%"
        )
        db.add(new_log)

    db.commit()

    return {
        "status": "updated",
        "profile": {
            "credit_score": profile.credit_score,
            "tier": profile.tier,
            "dti_ratio": profile.dti_ratio,
            "utilization_ratio": profile.utilization_ratio,
            "score_delta": score_delta,
            "utilization_delta": round(profile.utilization_ratio - old_utilization, 2),
            "dti_delta": round(profile.dti_ratio - old_dti, 2)
        }
    }


# --- PROGRESS TRACKING & HISTORY DATA (Scenario 3) ---

@app.get("/api/users/{user_id}/history", response_model=List[HistoryLogItem])
def get_user_history(user_id: int, db: Session = Depends(get_db)):
    logs = db.query(CreditHistoryLog).filter(
        CreditHistoryLog.user_id == user_id
    ).order_by(CreditHistoryLog.recorded_at.asc()).all()
    return logs


# --- WHAT-IF SIMULATION (Scenario 4) ---

@app.post("/api/users/{user_id}/simulate", response_model=SimulationResponse)
def simulate_score(user_id: int, payload: SimulationRequest, db: Session = Depends(get_db)):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    simulation_result = run_score_simulation(
        current_score=profile.credit_score,
        monthly_income=profile.monthly_income,
        current_card_balance=profile.credit_card_balance,
        card_limit=profile.credit_card_limit,
        current_emi=profile.total_loan_emi,
        missed_payments_24m=profile.missed_payments_24m,
        pay_card_amount=payload.pay_card_debt_amount,
        reduce_emi=payload.reduce_emi_amount,
        increase_card_limit=payload.increase_card_limit,
        on_time_months=payload.on_time_months,
        income_change=payload.income_change
    )
    return simulation_result


# --- AI CONSULTATION & CHAT (Scenario 2 - Groq API) ---

@app.post("/api/ai/consult/{user_id}", response_model=AIAnalysisResponse)
def trigger_ai_consultation(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile_dict = {
        "credit_score": profile.credit_score,
        "monthly_income": profile.monthly_income,
        "monthly_expenses": profile.monthly_expenses,
        "credit_card_limit": profile.credit_card_limit,
        "credit_card_balance": profile.credit_card_balance,
        "total_loan_emi": profile.total_loan_emi,
        "active_loans_count": profile.active_loans_count,
        "missed_payments_24m": profile.missed_payments_24m,
        "credit_age_years": profile.credit_age_years,
        "dti_ratio": profile.dti_ratio,
        "utilization_ratio": profile.utilization_ratio,
        "tier": profile.tier
    }

    ai_data = generate_ai_credit_consultation(profile_dict, user_name=user.name)

    # Persist AI consultation log
    analysis_record = AIAnalysisLog(
        user_id=user.id,
        executive_summary=ai_data.get("executive_summary", ""),
        bottlenecks_json=json.dumps(ai_data.get("bottlenecks", [])),
        roadmap_json=json.dumps(ai_data.get("roadmap", [])),
        raw_response=json.dumps(ai_data)
    )
    db.add(analysis_record)
    db.commit()

    return {
        "executive_summary": ai_data.get("executive_summary", ""),
        "score_tier": ai_data.get("score_tier", profile.tier),
        "score_analysis": ai_data.get("score_analysis", ""),
        "bottlenecks": ai_data.get("bottlenecks", []),
        "roadmap": ai_data.get("roadmap", []),
        "key_metrics_evaluation": ai_data.get("key_metrics_evaluation", {}),
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    }


@app.post("/api/ai/chat/{user_id}", response_model=AIChatResponse)
def chat_with_advisor_endpoint(user_id: int, payload: AIChatRequest, db: Session = Depends(get_db)):
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile_dict = {
        "credit_score": profile.credit_score,
        "monthly_income": profile.monthly_income,
        "monthly_expenses": profile.monthly_expenses,
        "credit_card_limit": profile.credit_card_limit,
        "credit_card_balance": profile.credit_card_balance,
        "total_loan_emi": profile.total_loan_emi,
        "active_loans_count": profile.active_loans_count,
        "missed_payments_24m": profile.missed_payments_24m,
        "credit_age_years": profile.credit_age_years,
        "dti_ratio": profile.dti_ratio,
        "utilization_ratio": profile.utilization_ratio,
        "tier": profile.tier
    }

    history = [msg.dict() for msg in (payload.chat_history or [])]
    reply = chat_with_credit_advisor(profile_dict, history, payload.message)
    return {"reply": reply}


# --- PDF REPORT GENERATION SERVICE (flow.png: ReportLab PDF) ---

@app.get("/api/report/pdf/{user_id}")
def download_credit_report_pdf(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile_dict = {
        "user_id": user.id,
        "credit_score": profile.credit_score,
        "monthly_income": profile.monthly_income,
        "monthly_expenses": profile.monthly_expenses,
        "credit_card_limit": profile.credit_card_limit,
        "credit_card_balance": profile.credit_card_balance,
        "total_loan_emi": profile.total_loan_emi,
        "active_loans_count": profile.active_loans_count,
        "missed_payments_24m": profile.missed_payments_24m,
        "credit_age_years": profile.credit_age_years,
        "dti_ratio": profile.dti_ratio,
        "utilization_ratio": profile.utilization_ratio,
        "tier": profile.tier
    }

    # Fetch latest AI analysis or generate fallback
    latest_ai = db.query(AIAnalysisLog).filter(
        AIAnalysisLog.user_id == user_id
    ).order_by(AIAnalysisLog.created_at.desc()).first()

    if latest_ai and latest_ai.raw_response:
        ai_data = json.loads(latest_ai.raw_response)
    else:
        ai_data = get_fallback_consultation(profile_dict, user.name)

    pdf_buffer = generate_credit_report_pdf(user.name, profile_dict, ai_data)

    filename = f"Credit_Assistant_Report_{user.name.replace(' ', '_')}_{datetime.utcnow().strftime('%Y%m%d')}.pdf"

    return Response(
        content=pdf_buffer.getvalue(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )


# Serve frontend static assets if built
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))


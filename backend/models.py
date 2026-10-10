from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("FinancialProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    history_logs = relationship("CreditHistoryLog", back_populates="user", cascade="all, delete-orphan", order_by="CreditHistoryLog.recorded_at")
    ai_analyses = relationship("AIAnalysisLog", back_populates="user", cascade="all, delete-orphan", order_by="AIAnalysisLog.created_at.desc()")


class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Financial metrics
    credit_score = Column(Integer, default=650) # 300 to 900
    monthly_income = Column(Float, default=75000.0) # INR
    monthly_expenses = Column(Float, default=30000.0) # INR
    credit_card_limit = Column(Float, default=150000.0) # INR
    credit_card_balance = Column(Float, default=75000.0) # INR
    total_loan_emi = Column(Float, default=20000.0) # INR
    active_loans_count = Column(Integer, default=2)
    missed_payments_24m = Column(Integer, default=1)
    credit_age_years = Column(Float, default=4.5)

    # Derived calculations
    dti_ratio = Column(Float, default=26.67) # (total_loan_emi + estimated cc min / income) * 100
    utilization_ratio = Column(Float, default=50.0) # (credit_card_balance / credit_card_limit) * 100
    tier = Column(String(50), default="Fair") # Poor, Fair, Good, Excellent
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class CreditHistoryLog(Base):
    __tablename__ = "credit_history_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    month_label = Column(String(30), nullable=False)
    credit_score = Column(Integer, nullable=False)
    utilization_ratio = Column(Float, nullable=False)
    dti_ratio = Column(Float, nullable=False)
    total_debt = Column(Float, default=0.0)
    note = Column(String(255), nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="history_logs")


class AIAnalysisLog(Base):
    __tablename__ = "ai_analysis_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    executive_summary = Column(Text, nullable=False)
    bottlenecks_json = Column(Text, nullable=False) # JSON array of strings
    roadmap_json = Column(Text, nullable=False) # JSON array of 5 steps
    raw_response = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="ai_analyses")

from typing import List, Optional
from pydantic import BaseModel

# Safe EmailStr with str fallback if email-validator is not yet installed
try:
    from pydantic import EmailStr
    class _EmailValidatorProbe(BaseModel):
        _probe: EmailStr
except Exception:
    EmailStr = str  # Fallback to standard string so server boots without crash

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class FinancialProfileBase(BaseModel):
    credit_score: int
    monthly_income: float
    monthly_expenses: float
    credit_card_limit: float
    credit_card_balance: float
    total_loan_emi: float
    active_loans_count: int
    missed_payments_24m: int
    credit_age_years: float

class FinancialProfileUpdate(FinancialProfileBase):
    pass

class FinancialProfileResponse(FinancialProfileBase):
    id: int
    user_id: int
    dti_ratio: float
    utilization_ratio: float
    tier: str
    class Config:
        from_attributes = True

class HistoryLogItem(BaseModel):
    id: int
    month_label: str
    credit_score: int
    utilization_ratio: float
    dti_ratio: float
    total_debt: float
    note: Optional[str] = None
    class Config:
        from_attributes = True

class RoadmapStep(BaseModel):
    step_number: int
    title: str
    timeline: str
    action: str
    impact: str
    indian_context: str

class AIAnalysisResponse(BaseModel):
    executive_summary: str
    score_tier: str
    score_analysis: str
    bottlenecks: List[str]
    roadmap: List[RoadmapStep]
    key_metrics_evaluation: dict
    timestamp: str

class AIChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str

class AIChatRequest(BaseModel):
    message: str
    chat_history: Optional[List[AIChatMessage]] = []

class AIChatResponse(BaseModel):
    reply: str

class SimulationRequest(BaseModel):
    pay_card_debt_amount: float = 0.0 # e.g. pay off ₹30,000 credit card
    reduce_emi_amount: float = 0.0 # e.g. close personal loan EMI ₹8,000
    increase_card_limit: float = 0.0 # e.g. bank increases limit by ₹50,000
    on_time_months: int = 6 # months of consistent on-time payments
    income_change: float = 0.0 # monthly salary raise

class SimulationResponse(BaseModel):
    current_score: int
    projected_score: int
    score_delta: int
    current_utilization: float
    simulated_utilization: float
    current_dti: float
    simulated_dti: float
    simulated_tier: str
    benefits: List[str]
    timeline_estimate: str

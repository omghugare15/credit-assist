import json
import logging
from typing import List, Dict, Any
from groq import Groq
from .config import GROQ_API_KEY, GROQ_MODEL

logger = logging.getLogger(__name__)

def get_groq_client():
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not set in environment or .env")
    return Groq(api_key=GROQ_API_KEY)


def generate_ai_credit_consultation(profile: Dict[str, Any], user_name: str = "User") -> Dict[str, Any]:
    """
    Invokes Groq AI to analyze user financial metrics and return a tailored
    5-step roadmap conforming to Indian banking norms.
    """
    client = get_groq_client()
    
    system_prompt = (
        "You are 'Credit Assistant AI', an elite Indian Banking & CIBIL/Credit Score Specialist. "
        "Your role is to analyze an Indian borrower's financial health, diagnose specific credit bottlenecks, "
        "and formulate a precise 5-step actionable roadmap tailored to Indian banking standards "
        "(CIBIL/Experian, RBI guidelines, NACH e-mandates, Indian bank debt consolidation, 30% utilization rule, FOIR caps). "
        "You MUST respond ONLY with a valid JSON object matching the required schema. Do NOT include markdown blocks or extra text."
    )

    user_prompt = f"""
    Analyze the credit profile for {user_name}:
    - Credit Score: {profile.get('credit_score')} / 900 (Tier: {profile.get('tier')})
    - Monthly Net Income: ₹{profile.get('monthly_income'):,.2f}
    - Monthly Expenses: ₹{profile.get('monthly_expenses'):,.2f}
    - Total Loan EMIs: ₹{profile.get('total_loan_emi'):,.2f} (Active loans: {profile.get('active_loans_count')})
    - Credit Card Balance: ₹{profile.get('credit_card_balance'):,.2f}
    - Total Credit Card Limit: ₹{profile.get('credit_card_limit'):,.2f}
    - Credit Card Utilization: {profile.get('utilization_ratio')}% (Ideal: <30%)
    - Debt-to-Income / FOIR Ratio: {profile.get('dti_ratio')}% (Ideal: <35%)
    - Missed Payments in 24 months: {profile.get('missed_payments_24m')}
    - Credit History Length: {profile.get('credit_age_years')} years

    Respond with this exact JSON structure:
    {{
      "executive_summary": "Comprehensive 3-4 sentence evaluation of financial health and borrowing capacity in India",
      "score_tier": "{profile.get('tier')}",
      "score_analysis": "Detailed rationale of factors influencing their CIBIL/credit rating",
      "bottlenecks": [
        "Bottleneck 1 with exact numbers",
        "Bottleneck 2 with exact numbers",
        "Bottleneck 3 with exact numbers"
      ],
      "roadmap": [
        {{
          "step_number": 1,
          "title": "Title of step",
          "timeline": "e.g. Month 1 (Immediate)",
          "action": "Specific concrete financial move",
          "impact": "Expected score and monetary benefit",
          "indian_context": "Reference to Indian banking practices, CIBIL, banks, or RBI guidelines"
        }},
        {{
          "step_number": 2,
          "title": "Title of step",
          "timeline": "e.g. Month 1 - 2",
          "action": "Specific concrete financial move",
          "impact": "Expected score and monetary benefit",
          "indian_context": "Reference to Indian banking practices"
        }},
        {{
          "step_number": 3,
          "title": "Title of step",
          "timeline": "e.g. Month 2 - 3",
          "action": "Specific concrete financial move",
          "impact": "Expected score and monetary benefit",
          "indian_context": "Reference to Indian banking practices"
        }},
        {{
          "step_number": 4,
          "title": "Title of step",
          "timeline": "e.g. Month 4 - 5",
          "action": "Specific concrete financial move",
          "impact": "Expected score and monetary benefit",
          "indian_context": "Reference to Indian banking practices"
        }},
        {{
          "step_number": 5,
          "title": "Title of step",
          "timeline": "e.g. Month 6+ (Long term)",
          "action": "Specific concrete financial move",
          "impact": "Expected score and monetary benefit",
          "indian_context": "Reference to Indian banking practices"
        }}
      ],
      "key_metrics_evaluation": {{
        "utilization_status": "Status rating (e.g., Critical, Moderate, Optimal)",
        "dti_status": "Status rating",
        "repayment_discipline": "Status rating",
        "approval_readiness": "Assessment for home loan or personal loan approval"
      }}
    }}
    """

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=1500
        )
        content = response.choices[0].message.content
        data = json.loads(content)
        return data
    except Exception as e:
        logger.error(f"Groq API consultation error: {e}")
        # Return high quality structured fallback adhering to Indian banking standards
        return get_fallback_consultation(profile, user_name)


def chat_with_credit_advisor(profile: Dict[str, Any], chat_history: List[Dict[str, str]], user_message: str) -> str:
    """
    Conversational assistant for user inquiries regarding credit score improvement,
    loans, CIBIL disputes, and Indian banking regulations.
    """
    client = get_groq_client()

    context_prompt = (
        f"You are the Lead Financial Strategist at Credit Assistant. "
        f"The user has a Credit Score of {profile.get('credit_score')} ({profile.get('tier')}), "
        f"Net Monthly Income of ₹{profile.get('monthly_income', 0):,.0f}, "
        f"Monthly Loan EMIs of ₹{profile.get('total_loan_emi', 0):,.0f}, "
        f"Credit Card Balance of ₹{profile.get('credit_card_balance', 0):,.0f} against a limit of ₹{profile.get('credit_card_limit', 0):,.0f} "
        f"(Utilization: {profile.get('utilization_ratio')}%), "
        f"FOIR / Debt-to-Income: {profile.get('dti_ratio')}%, and "
        f"{profile.get('missed_payments_24m', 0)} missed payments recorded in the last 24 months. "
        "Answer the user's question directly, empathetically, and accurately based on Indian banking standards "
        "(CIBIL, Experian, RBI guidelines, banks like SBI/HDFC/ICICI). "
        "Keep your response concise, structured with bullet points if helpful, and directly actionable."
    )

    messages = [{"role": "system", "content": context_prompt}]
    for msg in chat_history[-6:]:
        messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
    messages.append({"role": "user", "content": user_message})

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            temperature=0.5,
            max_tokens=700
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Groq Chat error: {e}")
        return (
            f"Based on your current credit score of {profile.get('credit_score')} and utilization of {profile.get('utilization_ratio')}%, "
            f"the most impactful step right now is lowering your outstanding credit card balance below 30% of your limit (₹{profile.get('credit_card_limit', 0) * 0.3:,.0f}). "
            f"Under Indian credit bureau reporting (CIBIL/Experian), keeping utilization low combined with 100% on-time EMI repayments through NACH mandate "
            f"typically yields an upward trajectory of 30-50 points within 3 billing cycles."
        )


def get_fallback_consultation(profile: Dict[str, Any], user_name: str) -> Dict[str, Any]:
    score = profile.get("credit_score", 650)
    tier = profile.get("tier", "Fair")
    util = profile.get("utilization_ratio", 50.0)
    dti = profile.get("dti_ratio", 35.0)

    bottlenecks = []
    if util > 30:
        bottlenecks.append(f"Credit card utilization is at {util}%, well above the RBI-recommended safe ceiling of 30%.")
    if dti > 40:
        bottlenecks.append(f"Debt-to-Income / FOIR is at {dti}%, which exceeds prime home loan eligibility limits.")
    if profile.get("missed_payments_24m", 0) > 0:
        bottlenecks.append(f"{profile.get('missed_payments_24m')} missed payment(s) are logged in bureau records, dragging down payment history score.")
    if not bottlenecks:
        bottlenecks.append("Credit mix is predominantly unsecured, needing balance to reach prime 800+ tier.")

    return {
        "executive_summary": f"{user_name}'s credit profile sits at {score} ({tier}). While foundational accounts are established, elevated utilization and debt ratios currently trigger cautionary flags for Indian Tier-1 lenders (HDFC, SBI, ICICI).",
        "score_tier": tier,
        "score_analysis": f"At {score}, your score falls in the {tier} band. Lenders evaluate you with moderate risk, resulting in higher interest rate spreads on unsecured loans and potential scrutiny on high-ticket loan approvals.",
        "bottlenecks": bottlenecks,
        "roadmap": [
          {
            "step_number": 1,
            "title": "Aggressive Card Balance Paydown (Debt Avalanche)",
            "timeline": "Month 1 (Immediate)",
            "action": f"Allocate surplus cash flow to reduce outstanding balance to under ₹{profile.get('credit_card_limit', 100000) * 0.3:,.0f}.",
            "impact": "Direct +25 to +40 point CIBIL recovery as credit utilization drops below 30%.",
            "indian_context": "Avoid minimum due trap: 42% APR compounding on Indian cards drains monthly liquidity."
          },
          {
            "step_number": 2,
            "title": "Request Credit Limit Enhancement",
            "timeline": "Month 1 - 2",
            "action": "Submit salary slips / ITR to your issuing bank requesting a 30-50% limit increase without opening new cards.",
            "impact": "Instantly expands denominator for utilization calculation, boosting score without spending cash.",
            "indian_context": "Indian banks routinely offer pre-approved limit hikes via NetBanking after 12 months of clean history."
          },
          {
            "step_number": 3,
            "title": "Bureau CIR Audit & Discrepancy Dispute",
            "timeline": "Month 2 - 3",
            "action": "Download official CIBIL and Experian CIRs to verify all closed accounts have received formal NOCs.",
            "impact": "Eliminates phantom dues and erroneous DPB (Days Past Due) tags that artificially depress scores.",
            "indian_context": "Under RBI guidelines, credit bureaus must resolve reported disputes within 30 days."
          },
          {
            "step_number": 4,
            "title": "Debt Consolidation via Low-Cost Personal Loan",
            "timeline": "Month 3 - 4",
            "action": "Consolidate revolving card balances into a structured 12-18 month EMI at 11-13% interest.",
            "impact": "Converts revolving debt into fixed installment debt, lowering FOIR perception.",
            "indian_context": "Indian public sector banks offer favorable balance transfer terms for salaried individuals."
          },
          {
            "step_number": 5,
            "title": "Automate Repayments via NACH e-Mandate",
            "timeline": "Month 5 - 6 (Ongoing)",
            "action": "Set up automated e-NACH mandates for all utility bills and loan EMIs on salary disbursement date.",
            "impact": "Maintains a flawless 100% on-time repayment history, cementing prime borrower status (750+).",
            "indian_context": "Ensures zero accidental bounces and establishes pristine repayment credentials across all four Indian bureaus."
          }
        ],
        "key_metrics_evaluation": {
          "utilization_status": "Needs Improvement" if util > 30 else "Optimal",
          "dti_status": "Elevated" if dti > 40 else "Healthy",
          "repayment_discipline": "Recovering" if profile.get("missed_payments_24m", 0) > 0 else "Strong",
          "approval_readiness": "Moderate (Eligible for standard loans; prime home loan rates unlock at 750+)"
        }
    }

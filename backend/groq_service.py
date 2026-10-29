import json
import logging
import re
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
    if not GROQ_API_KEY:
        return get_fallback_consultation(profile, user_name)

    try:
        client = get_groq_client()
    except Exception as e:
        logger.error(f"Groq client init error: {e}")
        return get_fallback_consultation(profile, user_name)
    
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


def get_conversational_reply(profile: Dict[str, Any], user_message: str) -> str:
    msg = (user_message or "").strip().lower()
    score = profile.get("credit_score", 650)
    tier = profile.get("tier", "Fair")
    util = float(profile.get("utilization_ratio", 40.0) or 0)
    bal = float(profile.get("credit_card_balance", 0) or 0)
    lim = float(profile.get("credit_card_limit", 150000) or 1)
    emi = float(profile.get("total_loan_emi", 0) or 0)
    inc = float(profile.get("monthly_income", 85000) or 1)
    foir = float(profile.get("dti_ratio", 25.0) or 0)
    miss = int(profile.get("missed_payments_24m", 0) or 0)
    safe_bal = lim * 0.3
    gap = max(0, 750 - score)

    # 1. Greetings & casual conversation
    if re.search(r"^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening)|yo|sup|greeting)\b", msg) or msg in ["hi", "hello", "hey", "hola", "test"]:
        return (
            f"Hello! I'm your Credit Assistant AI advisor.\n\n"
            f"I have your credit profile active: your CIBIL score is **{score}** ({tier} tier) with **{util:.1f}%** card utilization.\n\n"
            f"How can I assist you today? You can ask me:\n"
            f"- How do I boost my score to 750+ prime?\n"
            f"- How should I pay down my credit card balance?\n"
            f"- Will banks approve my loan with my current FOIR?\n"
            f"- How do I dispute an error or wrong DPD on my CIBIL report?"
        )

    # 2. Acknowledgements & Gratitude
    if re.search(r"^(thanks|thank you|thx|great|awesome|perfect|ok|okay|got it|cool)\b", msg):
        return (
            f"You're very welcome! Keeping your card utilization under 30% and paying bills on time will steadily build your score. "
            f"Feel free to ask whenever you have more questions about your loans, CIBIL, or banking rules!"
        )

    # 3. Who are you / Capabilities / Help
    if any(k in msg for k in ["who are you", "what can you do", "help", "about you", "what is this", "commands"]):
        return (
            f"I am your personal Indian Credit Intelligence Advisor.\n\n"
            f"Here is what I can help you with:\n"
            f"1. CIBIL Score Roadmap: Explain why your score is {score} and what to fix first.\n"
            f"2. Debt & Utilization Strategy: Optimize repayment to eliminate 42% APR revolving charges.\n"
            f"3. FOIR & Loan Approvals: Check whether Tier-1 banks (HDFC, SBI, ICICI) will approve you.\n"
            f"4. Disputes & NOCs: Guide you through RBI's 30-day mandate to fix erroneous bureau records.\n"
            f"5. e-NACH Mandates: Prevent damaging 30-day DPD marks on your credit history.\n\n"
            f"What would you like to check first?"
        )

    # 4. How to improve / reach 750 / roadmap
    if any(k in msg for k in ["improve", "boost", "increase", "750", "reach 750", "fix score", "roadmap", "plan", "how to"]):
        return (
            f"You are currently **{gap} points** away from prime 750+ rates. Here is your priority recovery plan:\n\n"
            f"1. **Lower Card Balance to Under ₹{safe_bal:,.0f}**: Your utilization is {util:.1f}%. Lowering it below 30% delivers the fastest +25 to +40 point jump within 1-2 billing cycles.\n"
            f"2. **Request Bank Credit Limit Hike**: Ask your card issuer for a 30-50% limit increase with salary slips — this drops utilization without spending cash.\n"
            f"3. **Automate with e-NACH**: Set up auto-debit for your card and EMI payments (₹{emi:,.0f}/month) to prevent 30-day DPD marks.\n"
            f"4. **Audit Closed Loans for NOCs**: Ensure zero-balance closed accounts aren't marked as 'Written Off' on CIBIL."
        )

    # 5. Utilization / card balance / credit card
    if any(k in msg for k in ["utiliz", "card balance", "card limit", "credit card", "credit limit", "minimum due", "debt"]):
        return (
            f"**Credit Card Utilization Breakdown:**\n\n"
            f"• **Current Limit**: ₹{lim:,.0f}\n"
            f"• **Balance Owed**: ₹{bal:,.0f} ({util:.1f}%)\n"
            f"• **RBI Recommended Ceiling (30%)**: ₹{safe_bal:,.0f}\n\n"
            f"⚠️ **Warning**: Paying only the minimum amount due triggers compounding revolving interest at ~42% APR on Indian credit cards. "
            f"Paying down ₹{max(0, bal - safe_bal):,.0f} will immediately bring your utilization into the safe green zone!"
        )

    # 6. FOIR / Loan approval / EMIs / salary
    if any(k in msg for k in ["foir", "dti", "loan", "emi", "salary", "income", "home loan", "personal loan", "car loan"]):
        status = "safe (inside limits)" if foir <= 40 else "elevated (above 40% cap)"
        return (
            f"**Fixed Obligation to Income Ratio (FOIR):**\n\n"
            f"• **Net Monthly Salary**: ₹{inc:,.0f}\n"
            f"• **Monthly Loan EMIs**: ₹{emi:,.0f}\n"
            f"• **Your Current FOIR**: **{foir:.1f}%** ({status})\n\n"
            f"Leading Indian banks (SBI, HDFC, ICICI, Axis) cap FOIR at **40% to 50%**. "
            + (f"Your FOIR is healthy and qualifies for competitive loan pricing." if foir <= 40 else f"Because your FOIR is above 40%, lenders may reject unsecured loans or charge risk premiums. Prepaying or consolidating personal loans will restore approval capacity.")
        )

    # 7. Missed payments / late / DPD
    if any(k in msg for k in ["miss", "late", "dpd", "default", "overdue", "nach", "mandate"]):
        return (
            f"**Payment History Analysis (35% Weight in CIBIL):**\n\n"
            f"You have **{miss} missed payment(s)** on record over the last 24 months.\n\n"
            f"• 30 and 60-day DPD (Days Past Due) entries are the most heavily penalized by bureau algorithms.\n"
            f"• **Solution**: Activate an **e-NACH auto-debit mandate** on your salary account. 6 to 12 months of flawless on-time repayments will re-establish prime credit standing."
        )

    # 8. Disputes / CIBIL report / Error / NOC
    if any(k in msg for k in ["dispute", "cibil report", "experian", "cir", "noc", "wrong", "settled", "written off", "fraud"]):
        return (
            f"**How to Dispute Erroneous Bureau Records (RBI 30-Day Mandate):**\n\n"
            f"1. **Pull CIR**: Download your full credit report from TransUnion CIBIL or Experian.\n"
            f"2. **Verify Account Status**: Make sure fully repaid loans have a formal No Objection Certificate (NOC) and aren't marked 'Settled'.\n"
            f"3. **File Dispute**: Submit an online dispute via the CIBIL Dispute Center with the Account Control Number.\n"
            f"4. **Statutory Timeline**: Under RBI Master Directions, credit institutions must resolve and correct disputes within 30 days or face monetary penalties."
        )

    # 9. Contextual helpful summary
    return (
        f"Based on your profile (CIBIL: **{score}**, Utilization: **{util:.1f}%**, FOIR: **{foir:.1f}%**):\n\n"
        f"The single most effective action right now is keeping your revolving card balance under ₹{safe_bal:,.0f} "
        f"and maintaining automated e-NACH payments.\n\n"
        f"Feel free to ask me about:\n"
        f"• How to negotiate a credit limit increase with your bank\n"
        f"• Getting a loan approved with your current FOIR\n"
        f"• How to remove wrongful bureau flags"
    )


def chat_with_credit_advisor(profile: Dict[str, Any], chat_history: List[Dict[str, str]], user_message: str) -> str:
    """
    Conversational assistant for user inquiries regarding credit score improvement,
    loans, CIBIL disputes, and Indian banking regulations.
    """
    if not GROQ_API_KEY:
        return get_conversational_reply(profile, user_message)

    try:
        client = get_groq_client()
    except Exception as e:
        logger.error(f"Groq client init error: {e}")
        return get_conversational_reply(profile, user_message)

    context_prompt = (
        f"You are 'Credit Assistant AI', an elite, friendly, and highly knowledgeable Indian Credit & Banking Specialist. "
        f"User Profile Overview: "
        f"- CIBIL/Credit Score: {profile.get('credit_score')} ({profile.get('tier')}), "
        f"- Net Monthly Income: ₹{profile.get('monthly_income', 0):,.0f}, "
        f"- Monthly Loan EMIs: ₹{profile.get('total_loan_emi', 0):,.0f}, "
        f"- Credit Card Balance: ₹{profile.get('credit_card_balance', 0):,.0f} / Limit: ₹{profile.get('credit_card_limit', 0):,.0f} "
        f"(Utilization: {profile.get('utilization_ratio')}%), "
        f"- FOIR (Debt-to-Income): {profile.get('dti_ratio')}%, "
        f"- Missed Payments in 24m: {profile.get('missed_payments_24m', 0)}. "
        f"\nCONVERSATION GUIDELINES:"
        f"1. If the user sends a greeting (e.g. 'hi', 'hello', 'hey', 'good morning'), greet them back warmly, briefly introduce yourself as their Credit Assistant advisor, reference their current score ({profile.get('credit_score')}), and invite their question. Do NOT output a generic unsolicited lecture."
        f"2. If the user asks a question, answer concisely, empathetically, and accurately based on Indian banking standards (RBI guidelines, CIBIL/Experian, banks like SBI, HDFC, ICICI, e-NACH, FOIR, 30% utilization)."
        f"3. Use clean markdown formatting (bullet points, bold highlights). Keep replies conversational, helpful, and under 150 words unless detail is requested."
    )

    messages = [{"role": "system", "content": context_prompt}]
    for msg in chat_history[-6:]:
        messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
    messages.append({"role": "user", "content": user_message})

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            temperature=0.6,
            max_tokens=650
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Groq Chat error: {e}")
        return get_conversational_reply(profile, user_message)



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

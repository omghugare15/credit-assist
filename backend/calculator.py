def calculate_tier(score: int) -> str:
    if score >= 750:
        return "Excellent"
    elif score >= 700:
        return "Good"
    elif score >= 650:
        return "Fair"
    else:
        return "Poor"

def calculate_dti(monthly_income: float, total_loan_emi: float, credit_card_balance: float = 0.0) -> float:
    if monthly_income <= 0:
        return 0.0
    # In Indian banking (FOIR), minimum card payment is typically 5% of outstanding balance
    min_card_payment = credit_card_balance * 0.05
    total_obligations = total_loan_emi + min_card_payment
    return round((total_obligations / monthly_income) * 100, 2)

def calculate_utilization(balance: float, limit: float) -> float:
    if limit <= 0:
        return 0.0
    return round(min(100.0, max(0.0, (balance / limit) * 100)), 2)

def run_score_simulation(
    current_score: int,
    monthly_income: float,
    current_card_balance: float,
    card_limit: float,
    current_emi: float,
    missed_payments_24m: int,
    pay_card_amount: float,
    reduce_emi: float,
    increase_card_limit: float,
    on_time_months: int,
    income_change: float
) -> dict:
    # 1. New card balance and limit
    new_card_balance = max(0.0, current_card_balance - pay_card_amount)
    new_card_limit = max(1000.0, card_limit + increase_card_limit)
    new_utilization = calculate_utilization(new_card_balance, new_card_limit)
    old_utilization = calculate_utilization(current_card_balance, card_limit)

    # 2. New EMI and Income
    new_emi = max(0.0, current_emi - reduce_emi)
    new_income = max(1000.0, monthly_income + income_change)
    new_dti = calculate_dti(new_income, new_emi, new_card_balance)
    old_dti = calculate_dti(monthly_income, current_emi, current_card_balance)

    # 3. Compute score delta based on Indian CIBIL weightage model:
    # Utilization weight (30% of score):
    # Dropping utilization from >50% to <30% gives huge boost
    util_improvement = old_utilization - new_utilization
    util_score_boost = 0
    if util_improvement > 0:
        if old_utilization > 50 and new_utilization <= 30:
            util_score_boost = int(util_improvement * 0.9) + 15
        elif new_utilization <= 10:
            util_score_boost = int(util_improvement * 0.8) + 10
        else:
            util_score_boost = int(util_improvement * 0.6)

    # DTI & EMI reduction effect (improves creditworthiness & credit mix)
    dti_boost = 0
    if old_dti - new_dti > 5:
        dti_boost = min(30, int((old_dti - new_dti) * 0.8))

    # On-time payment seasoning (Payment history is 35% of score)
    payment_boost = min(35, on_time_months * 4)

    total_boost = util_score_boost + dti_boost + payment_boost

    # Cap projected score to CIBIL max 900 and min 300
    projected_score = min(900, max(300, current_score + total_boost))
    score_delta = projected_score - current_score

    simulated_tier = calculate_tier(projected_score)

    benefits = []
    if new_utilization < 30 and old_utilization >= 30:
        benefits.append("Crossed the RBI & CIBIL 30% credit utilization golden threshold.")
    if new_dti < 35 and old_dti >= 35:
        benefits.append("FOIR dropped below 35%, qualifying you for lower interest rates on Indian Home Loans.")
    if projected_score >= 750 and current_score < 750:
        benefits.append("Entered 'Excellent' (750+) prime category with pre-approved loans and premium credit cards.")
    if pay_card_amount > 0:
        interest_saved = round(pay_card_amount * 0.42 / 12 * 6, 0) # ~42% APR standard for Indian cards
        benefits.append(f"Saved approx ₹{int(interest_saved):,} in high-interest compounding APR charges.")
    if not benefits:
        benefits.append("Positive trend established towards building an unblemished credit profile.")

    timeline = "2 - 3 billing cycles (approx 60-90 days for CIBIL & Experian bureau updates)"
    if on_time_months > 3:
        timeline = f"{on_time_months} months of continuous positive reporting"

    return {
        "current_score": current_score,
        "projected_score": projected_score,
        "score_delta": score_delta,
        "current_utilization": old_utilization,
        "simulated_utilization": new_utilization,
        "current_dti": old_dti,
        "simulated_dti": new_dti,
        "simulated_tier": simulated_tier,
        "benefits": benefits,
        "timeline_estimate": timeline
    }

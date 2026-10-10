import React, { useState, useEffect } from 'react';
import { Sliders, ArrowRight, Zap, CheckCircle, ShieldCheck, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SimulatorTab({ profile, onApplySimulation }) {
  if (!profile) return null;

  const currentScore = profile.credit_score || 650;
  const currentCardBal = profile.credit_card_balance || 50000;
  const currentCardLimit = profile.credit_card_limit || 150000;
  const currentEmi = profile.total_loan_emi || 20000;

  // Simulator State
  const [payCardAmount, setPayCardAmount] = useState(Math.min(currentCardBal, 30000));
  const [reduceEmi, setReduceEmi] = useState(0);
  const [increaseLimit, setIncreaseLimit] = useState(25000);
  const [onTimeMonths, setOnTimeMonths] = useState(6);
  const [isApplying, setIsApplying] = useState(false);

  // Simulation calculations (live client preview)
  const newCardBal = Math.max(0, currentCardBal - payCardAmount);
  const newCardLimit = currentCardLimit + increaseLimit;
  const newUtil = Math.round((newCardBal / newCardLimit) * 1000) / 10;
  const oldUtil = profile.utilization_ratio || 0;

  const newEmi = Math.max(0, currentEmi - reduceEmi);
  const minCardOld = currentCardBal * 0.05;
  const minCardNew = newCardBal * 0.05;
  const oldDti = Math.round(((currentEmi + minCardOld) / profile.monthly_income) * 1000) / 10;
  const newDti = Math.round(((newEmi + minCardNew) / profile.monthly_income) * 1000) / 10;

  // CIBIL weight simulation logic
  const utilImprovement = oldUtil - newUtil;
  let utilBoost = 0;
  if (utilImprovement > 0) {
    if (oldUtil > 50 && newUtil <= 30) {
      utilBoost = Math.round(utilImprovement * 0.9) + 14;
    } else if (newUtil <= 10) {
      utilBoost = Math.round(utilImprovement * 0.8) + 10;
    } else {
      utilBoost = Math.round(utilImprovement * 0.6);
    }
  }

  const dtiBoost = (oldDti - newDti > 4) ? Math.min(28, Math.round((oldDti - newDti) * 0.75)) : 0;
  const paymentBoost = Math.min(35, onTimeMonths * 4);
  const totalBoost = utilBoost + dtiBoost + paymentBoost;
  const projectedScore = Math.min(900, Math.max(300, currentScore + totalBoost));
  const scoreDelta = projectedScore - currentScore;

  const getSimulatedTier = (s) => {
    if (s >= 750) return 'Excellent (Prime)';
    if (s >= 700) return 'Good';
    if (s >= 650) return 'Fair';
    return 'Poor';
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await onApplySimulation({
        credit_score: projectedScore,
        credit_card_balance: newCardBal,
        credit_card_limit: newCardLimit,
        total_loan_emi: newEmi,
        monthly_income: profile.monthly_income,
        monthly_expenses: profile.monthly_expenses,
        active_loans_count: reduceEmi > 0 ? Math.max(0, profile.active_loans_count - 1) : profile.active_loans_count,
        missed_payments_24m: Math.max(0, profile.missed_payments_24m - 1),
        credit_age_years: profile.credit_age_years + (onTimeMonths / 12)
      });

      // Celebrate score upgrade with confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#6366f1', '#fbbf24']
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Simulation Header */}
      <div className="glass-panel" style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Sliders size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              CIBIL "What-If" Score Simulator
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Test how specific debt paydowns and limit enhancements instantly move your bureau score.
            </p>
          </div>
        </div>

        <button
          onClick={handleApply}
          disabled={isApplying || scoreDelta === 0}
          className="btn btn-primary"
          style={{ fontSize: '0.9rem', padding: '10px 20px' }}
        >
          <Sparkles size={16} />
          <span>{isApplying ? 'Applying...' : 'Apply Improvements to Profile'}</span>
        </button>
      </div>

      {/* Simulator Layout Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        {/* Controls Column */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            Financial Action Controls
          </h3>

          {/* Slider 1: Pay down credit card debt */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Pay Off Credit Card Debt</span>
              <span className="mono-num" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>
                ₹{payCardAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={currentCardBal}
              step={2000}
              value={payCardAmount}
              onChange={(e) => setPayCardAmount(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              <span>₹0</span>
              <span>Remaining Balance: ₹{newCardBal.toLocaleString('en-IN')}</span>
              <span>Full ₹{currentCardBal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Slider 2: Close Personal Loan / Reduce EMI */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Reduce Monthly Loan EMI (Close Loan)</span>
              <span className="mono-num" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>
                ₹{reduceEmi.toLocaleString('en-IN')}/mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={currentEmi}
              step={1000}
              value={reduceEmi}
              onChange={(e) => setReduceEmi(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              <span>₹0</span>
              <span>New Total EMI: ₹{newEmi.toLocaleString('en-IN')}/mo</span>
              <span>₹{currentEmi.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Slider 3: Enhance Card Limit */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Request Credit Limit Hike</span>
              <span className="mono-num" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#a78bfa' }}>
                +₹{increaseLimit.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={150000}
              step={5000}
              value={increaseLimit}
              onChange={(e) => setIncreaseLimit(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              <span>₹0</span>
              <span>New Limit: ₹{newCardLimit.toLocaleString('en-IN')}</span>
              <span>+₹1,50,000</span>
            </div>
          </div>

          {/* Slider 4: Consecutive On-Time Payments */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Consecutive On-Time Repayments</span>
              <span className="mono-num" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24' }}>
                {onTimeMonths} Months
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={24}
              step={1}
              value={onTimeMonths}
              onChange={(e) => setOnTimeMonths(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              <span>1 Month</span>
              <span>Continuous clean bureau reporting</span>
              <span>24 Months</span>
            </div>
          </div>
        </div>

        {/* Live Simulation Results Column */}
        <div className="glass-panel" style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(14, 20, 32, 0.95) 0%, rgba(18, 26, 44, 0.95) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Projected Bureau Outcome
              </span>
              <span className="badge badge-excellent">
                {getSimulatedTier(projectedScore)}
              </span>
            </div>

            {/* Score Comparison Display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Current Score</span>
                <div className="mono-num" style={{ fontSize: '2rem', fontWeight: 800, color: '#94a3b8' }}>
                  {currentScore}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ArrowRight size={24} color="#10b981" />
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#34d399',
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  marginTop: '4px'
                }}>
                  +{scoreDelta} PTS
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>Projected CIBIL</span>
                <div className="mono-num" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#34d399', textShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
                  {projectedScore}
                </div>
              </div>
            </div>

            {/* Delta Comparison Meters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Credit Utilization</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                  <span className="mono-num" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fb7185', textDecoration: 'line-through' }}>
                    {oldUtil}%
                  </span>
                  <span className="mono-num" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>
                    → {newUtil}%
                  </span>
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>FOIR / Debt-to-Income</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                  <span className="mono-num" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fbbf24', textDecoration: 'line-through' }}>
                    {oldDti}%
                  </span>
                  <span className="mono-num" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>
                    → {newDti}%
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Benefits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {newUtil <= 30 && oldUtil > 30 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#34d399' }}>
                  <CheckCircle size={15} color="#10b981" />
                  <span>Crossed the RBI & CIBIL 30% utilization golden threshold.</span>
                </div>
              )}
              {projectedScore >= 750 && currentScore < 750 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#38bdf8' }}>
                  <ShieldCheck size={15} color="#06b6d4" />
                  <span>Prime (750+) tier unlocks pre-approved Indian Home Loans & premium cards.</span>
                </div>
              )}
              {payCardAmount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#c7d2fe' }}>
                  <Flame size={15} color="#818cf8" />
                  <span>Saves ~₹{Math.round(payCardAmount * 0.42 / 12 * 6).toLocaleString('en-IN')} in 42% APR compounding interest.</span>
                </div>
              )}
            </div>
          </div>

          <div style={{
            fontSize: '0.76rem',
            color: 'var(--text-dim)',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Bureau reporting timeline:</span>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>2 - 3 billing cycles (60-90 days)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

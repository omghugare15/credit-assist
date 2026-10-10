import React from 'react';
import { CreditCard, PieChart, Landmark, History, AlertCircle, CheckCircle } from 'lucide-react';

export default function MetricCards({ profile }) {
  if (!profile) return null;

  const util = profile.utilization_ratio || 0;
  const dti = profile.dti_ratio || 0;
  const isUtilSafe = util <= 30;
  const isDtiSafe = dti <= 35;
  const missedCount = profile.missed_payments_24m || 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px'
    }}>
      {/* 1. Credit Utilization */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: isUtilSafe ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CreditCard size={18} color={isUtilSafe ? '#10b981' : '#f43f5e'} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Credit Utilization
              </span>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                RBI Threshold: &lt; 30%
              </div>
            </div>
          </div>
          <span className={`badge ${isUtilSafe ? 'badge-excellent' : 'badge-poor'}`}>
            {isUtilSafe ? 'Optimal' : 'High Risk'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="mono-num" style={{ fontSize: '1.8rem', fontWeight: 800, color: isUtilSafe ? '#34d399' : '#fb7185' }}>
            {util.toFixed(1)}%
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            ₹{profile.credit_card_balance?.toLocaleString('en-IN')} / ₹{profile.credit_card_limit?.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Progress Bar with 30% indicator */}
        <div style={{ position: 'relative', width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${Math.min(100, util)}%`,
            height: '100%',
            background: isUtilSafe ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #f59e0b, #f43f5e)',
            borderRadius: '4px',
            transition: 'width 0.5s ease'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          <span>0%</span>
          <span style={{ color: '#38bdf8' }}>30% Target</span>
          <span>100%</span>
        </div>
      </div>

      {/* 2. Debt-to-Income / FOIR */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: isDtiSafe ? 'rgba(6, 182, 212, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PieChart size={18} color={isDtiSafe ? '#06b6d4' : '#f59e0b'} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Debt-to-Income (FOIR)
              </span>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Bank Ceiling: &lt; 35-40%
              </div>
            </div>
          </div>
          <span className={`badge ${isDtiSafe ? 'badge-good' : 'badge-fair'}`}>
            {isDtiSafe ? 'Healthy' : 'Elevated'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="mono-num" style={{ fontSize: '1.8rem', fontWeight: 800, color: isDtiSafe ? '#38bdf8' : '#fbbf24' }}>
            {dti.toFixed(1)}%
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Income: ₹{profile.monthly_income?.toLocaleString('en-IN')}/mo
          </span>
        </div>

        <div style={{ position: 'relative', width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${Math.min(100, dti)}%`,
            height: '100%',
            background: isDtiSafe ? 'linear-gradient(90deg, #06b6d4, #38bdf8)' : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
            borderRadius: '4px',
            transition: 'width 0.5s ease'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          <span>0%</span>
          <span style={{ color: '#10b981' }}>35% Prime Cap</span>
          <span>70%+</span>
        </div>
      </div>

      {/* 3. Monthly Loan EMIs & Facilities */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Landmark size={18} color="#818cf8" />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Active Loan EMIs
              </span>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                {profile.active_loans_count} Active Debt Facility(s)
              </div>
            </div>
          </div>
          <span className="badge badge-good">
            {profile.credit_age_years} Yrs Age
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="mono-num" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c7d2fe' }}>
            ₹{profile.total_loan_emi?.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            per month
          </span>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }} />
          <span>Living Expenses: ₹{profile.monthly_expenses?.toLocaleString('en-IN')}/mo</span>
        </div>
      </div>

      {/* 4. Repayment Discipline & Bureau Track Record */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: missedCount === 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <History size={18} color={missedCount === 0 ? '#10b981' : '#f43f5e'} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Bureau Repayment Record
              </span>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Last 24 Months
              </div>
            </div>
          </div>
          <span className={`badge ${missedCount === 0 ? 'badge-excellent' : 'badge-poor'}`}>
            {missedCount === 0 ? 'Clean' : `${missedCount} Missed`}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="mono-num" style={{ fontSize: '1.8rem', fontWeight: 800, color: missedCount === 0 ? '#34d399' : '#fb7185' }}>
            {missedCount === 0 ? '100%' : `${(100 - (missedCount * 4.2)).toFixed(1)}%`}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            On-time compliance
          </span>
        </div>

        <div style={{ fontSize: '0.78rem', color: missedCount === 0 ? '#34d399' : '#fb7185', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {missedCount === 0 ? (
            <>
              <CheckCircle size={14} />
              <span>Zero DPD (Days Past Due) tags in CIBIL</span>
            </>
          ) : (
            <>
              <AlertCircle size={14} />
              <span>DPD flag dragging score down ~35-50 pts</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

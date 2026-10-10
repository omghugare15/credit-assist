import React, { useState, useEffect } from 'react';
import { X, Save, UserPlus, CheckCircle, Calculator } from 'lucide-react';

export default function UpdateProfileModal({ isOpen, onClose, profile, isNewUser, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    credit_score: 650,
    monthly_income: 75000,
    monthly_expenses: 30000,
    credit_card_limit: 150000,
    credit_card_balance: 60000,
    total_loan_emi: 20000,
    active_loans_count: 2,
    missed_payments_24m: 1,
    credit_age_years: 4.0
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile && !isNewUser) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        credit_score: profile.credit_score || 650,
        monthly_income: profile.monthly_income || 75000,
        monthly_expenses: profile.monthly_expenses || 30000,
        credit_card_limit: profile.credit_card_limit || 150000,
        credit_card_balance: profile.credit_card_balance || 60000,
        total_loan_emi: profile.total_loan_emi || 20000,
        active_loans_count: profile.active_loans_count || 1,
        missed_payments_24m: profile.missed_payments_24m ?? 0,
        credit_age_years: profile.credit_age_years || 3.0
      });
    } else if (isNewUser) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        credit_score: 670,
        monthly_income: 80000,
        monthly_expenses: 30000,
        credit_card_limit: 120000,
        credit_card_balance: 40000,
        total_loan_emi: 15000,
        active_loans_count: 1,
        missed_payments_24m: 0,
        credit_age_years: 3.5
      });
    }
  }, [profile, isNewUser, isOpen]);

  if (!isOpen) return null;

  // Real-time ratio calculations for modal preview
  const previewUtil = formData.credit_card_limit > 0
    ? Math.round((formData.credit_card_balance / formData.credit_card_limit) * 1000) / 10
    : 0;

  const minCardDue = formData.credit_card_balance * 0.05;
  const previewDti = formData.monthly_income > 0
    ? Math.round(((formData.total_loan_emi + minCardDue) / formData.monthly_income) * 1000) / 10
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData, isNewUser);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 110,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        background: '#0d1322',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              {isNewUser ? 'Register Borrower & Financial Assessment' : 'Update Financial & Credit Metrics'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '4px 0 0' }}>
              {isNewUser ? 'Scenario 1: Onboard user and persist to database' : 'Scenario 4: Recalculates DTI, utilization & CIBIL delta'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Real-time calculated indicators banner */}
        <div style={{
          padding: '12px 18px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={16} color="#10b981" />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real-Time Derived Ratios:</span>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ fontSize: '0.82rem' }}>
              Utilization: <b style={{ color: previewUtil <= 30 ? '#34d399' : '#fb7185' }}>{previewUtil}%</b>
            </span>
            <span style={{ fontSize: '0.82rem' }}>
              FOIR / DTI: <b style={{ color: previewDti <= 35 ? '#38bdf8' : '#fbbf24' }}>{previewDti}%</b>
            </span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {isNewUser && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Singhania"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="vikram@example.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
          )}

          {/* Credit Score & Income */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Current CIBIL Score (300 - 900)
              </label>
              <input
                type="number"
                min={300}
                max={900}
                required
                value={formData.credit_score}
                onChange={(e) => setFormData({ ...formData, credit_score: Number(e.target.value) })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Net Monthly Income (₹)
              </label>
              <input
                type="number"
                min={1000}
                required
                value={formData.monthly_income}
                onChange={(e) => setFormData({ ...formData, monthly_income: Number(e.target.value) })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Credit Card Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Credit Card Outstanding Balance (₹)
              </label>
              <input
                type="number"
                min={0}
                required
                value={formData.credit_card_balance}
                onChange={(e) => setFormData({ ...formData, credit_card_balance: Number(e.target.value) })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Total Credit Card Limit (₹)
              </label>
              <input
                type="number"
                min={1000}
                required
                value={formData.credit_card_limit}
                onChange={(e) => setFormData({ ...formData, credit_card_limit: Number(e.target.value) })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Loans & EMIs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Total Monthly Loan EMIs (₹)
              </label>
              <input
                type="number"
                min={0}
                required
                value={formData.total_loan_emi}
                onChange={(e) => setFormData({ ...formData, total_loan_emi: Number(e.target.value) })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Active Loans Count
              </label>
              <input
                type="number"
                min={0}
                max={20}
                required
                value={formData.active_loans_count}
                onChange={(e) => setFormData({ ...formData, active_loans_count: Number(e.target.value) })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Payments & Age */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Missed Payments (Last 24 Months)
              </label>
              <input
                type="number"
                min={0}
                max={24}
                required
                value={formData.missed_payments_24m}
                onChange={(e) => setFormData({ ...formData, missed_payments_24m: Number(e.target.value) })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Credit History Age (Years)
              </label>
              <input
                type="number"
                min={0.1}
                step={0.5}
                required
                value={formData.credit_age_years}
                onChange={(e) => setFormData({ ...formData, credit_age_years: Number(e.target.value) })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : (isNewUser ? 'Complete Onboarding' : 'Save & Recalculate')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

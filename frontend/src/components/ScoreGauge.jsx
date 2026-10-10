import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ScoreGauge({ profile, scoreDelta, onEditProfile }) {
  const score = profile?.credit_score || 650;
  const tier = profile?.tier || 'Fair';

  // Normalize score between 300 and 900 to an angle from -110 to +110 degrees
  const minScore = 300;
  const maxScore = 900;
  const clampedScore = Math.max(minScore, Math.min(maxScore, score));
  const percentage = (clampedScore - minScore) / (maxScore - minScore);
  const angle = -110 + percentage * 220; // -110 to +110

  // Tier info & styling
  const getTierDetails = (t, s) => {
    if (s >= 750) {
      return {
        label: 'Excellent (Prime Borrower)',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.35)',
        icon: CheckCircle2,
        desc: 'Unlocks lowest interest rates on Indian Home & Auto Loans from SBI, HDFC, ICICI.'
      };
    } else if (s >= 700) {
      return {
        label: 'Good (Low Risk)',
        color: '#06b6d4',
        bg: 'rgba(6, 182, 212, 0.15)',
        border: 'rgba(6, 182, 212, 0.35)',
        icon: TrendingUp,
        desc: 'Eligible for most retail credit products with favorable processing fees.'
      };
    } else if (s >= 650) {
      return {
        label: 'Fair (Moderate Inefficiency)',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.15)',
        border: 'rgba(245, 158, 11, 0.35)',
        icon: AlertTriangle,
        desc: 'Higher risk premium charged. Needs utilization reduction to cross prime threshold.'
      };
    } else {
      return {
        label: 'Poor (High Scrutiny)',
        color: '#f43f5e',
        bg: 'rgba(244, 63, 94, 0.15)',
        border: 'rgba(244, 63, 94, 0.35)',
        icon: ShieldAlert,
        desc: 'High probability of loan rejection. Credit builder roadmap strongly advised.'
      };
    }
  };

  const tierMeta = getTierDetails(tier, score);
  const TierIcon = tierMeta.icon;

  return (
    <div className="glass-panel glass-panel-glow" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle background radiant glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '320px',
        height: '240px',
        background: `radial-gradient(circle, ${tierMeta.color}25 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>CIBIL & Bureau Health Score</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '2px 0 0' }}>
            Real-time assessment calibrated for Indian banking standards
          </p>
        </div>
        <button
          onClick={onEditProfile}
          className="btn btn-secondary"
          style={{ fontSize: '0.75rem', padding: '6px 12px' }}
        >
          <span>Modify Metrics</span>
        </button>
      </div>

      {/* SVG Speedometer Gauge */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '320px', height: '190px', position: 'relative' }}>
          <svg viewBox="0 0 300 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="35%" stopColor="#f59e0b" />
                <stop offset="68%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Arc Track */}
            <path
              d="M 40 150 A 110 110 0 1 1 260 150"
              fill="none"
              stroke="#1e293b"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Glowing Gradient Colored Arc */}
            <path
              d="M 40 150 A 110 110 0 1 1 260 150"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="420"
              strokeDashoffset={420 - (percentage * 420)}
              filter="url(#glowEffect)"
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
            />

            {/* Score Benchmark tick labels */}
            <text x="35" y="172" fill="#64748b" fontSize="10" fontWeight="600" textAnchor="middle">300</text>
            <text x="90" y="80" fill="#94a3b8" fontSize="9" fontWeight="600" textAnchor="middle">650 Fair</text>
            <text x="150" y="32" fill="#94a3b8" fontSize="9" fontWeight="600" textAnchor="middle">700 Good</text>
            <text x="210" y="80" fill="#10b981" fontSize="9" fontWeight="700" textAnchor="middle">750+ Prime</text>
            <text x="265" y="172" fill="#64748b" fontSize="10" fontWeight="600" textAnchor="middle">900</text>

            {/* Rotating Center Needle */}
            <g transform={`translate(150, 150) rotate(${angle})`} style={{ transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              {/* Needle pointer */}
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-98"
                stroke={tierMeta.color}
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#glowEffect)"
              />
              <circle cx="0" cy="-98" r="4" fill="#ffffff" />
            </g>

            {/* Needle Pivot Hub */}
            <circle cx="150" cy="150" r="12" fill="#0f172a" stroke={tierMeta.color} strokeWidth="3" />
            <circle cx="150" cy="150" r="4" fill="#ffffff" />
          </svg>
        </div>

        {/* Big Animated Center Score Display */}
        <div style={{ textAlign: 'center', marginTop: '-20px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px' }}>
            <span className="mono-num" style={{
              fontSize: '3.6rem',
              fontWeight: 800,
              lineHeight: 1,
              color: '#ffffff',
              textShadow: `0 0 25px ${tierMeta.color}60`
            }}>
              {score}
            </span>
            <span style={{ fontSize: '1.1rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              / 900
            </span>
            {scoreDelta !== undefined && scoreDelta !== 0 && (
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: scoreDelta > 0 ? '#34d399' : '#fb7185',
                background: scoreDelta > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                padding: '2px 8px',
                borderRadius: '6px',
                marginLeft: '4px'
              }}>
                {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} PTS
              </span>
            )}
          </div>

          {/* Tier Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: tierMeta.bg,
            border: `1px solid ${tierMeta.border}`,
            padding: '5px 14px',
            borderRadius: '9999px',
            marginTop: '10px'
          }}>
            <TierIcon size={14} color={tierMeta.color} />
            <span style={{ color: tierMeta.color, fontSize: '0.8rem', fontWeight: 700 }}>
              {tierMeta.label}
            </span>
          </div>

          <p style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            maxWidth: '380px',
            margin: '10px auto 0',
            lineHeight: 1.4
          }}>
            {tierMeta.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

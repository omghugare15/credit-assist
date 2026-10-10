import React, { useState } from 'react';
import { TrendingUp, Award, Calendar, CheckCircle2, Layers } from 'lucide-react';

export default function ProgressHistoryTab({ historyLogs, profile }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!historyLogs || historyLogs.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '36px', textAlign: 'center' }}>
        <TrendingUp size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
        <h3 style={{ fontSize: '1.1rem' }}>No Historical Records Yet</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Update your financial profile or simulate changes to begin charting your CIBIL trajectory.
        </p>
      </div>
    );
  }

  // Calculate SVG coordinates for line chart
  const minScore = 500;
  const maxScore = 800;
  const chartWidth = 720;
  const chartHeight = 260;
  const paddingX = 45;
  const paddingY = 30;

  const points = historyLogs.map((log, index) => {
    const x = paddingX + (index / Math.max(1, historyLogs.length - 1)) * (chartWidth - paddingX * 2);
    const scoreClamped = Math.max(minScore, Math.min(maxScore, log.credit_score));
    const y = chartHeight - paddingY - ((scoreClamped - minScore) / (maxScore - minScore)) * (chartHeight - paddingY * 2);
    return { ...log, x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  // Milestone line for 750 Prime Target
  const primeY = chartHeight - paddingY - ((750 - minScore) / (maxScore - minScore)) * (chartHeight - paddingY * 2);

  const initialScore = historyLogs[0].credit_score;
  const latestScore = historyLogs[historyLogs.length - 1].credit_score;
  const overallDelta = latestScore - initialScore;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Overview Stat Ribbon */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Overall Progression
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="mono-num" style={{ fontSize: '1.8rem', fontWeight: 800, color: overallDelta >= 0 ? '#34d399' : '#fb7185' }}>
              {overallDelta >= 0 ? `+${overallDelta}` : overallDelta} PTS
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ({initialScore} → {latestScore})
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across {historyLogs.length} logged checkpoints
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Prime Target Benchmark
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="mono-num" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>
              750+ CIBIL
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>
            {latestScore >= 750 ? 'Milestone Achieved!' : `${750 - latestScore} points remaining to Prime`}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Utilization Trend
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="mono-num" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a78bfa' }}>
              {historyLogs[historyLogs.length - 1].utilization_ratio.toFixed(1)}%
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              from {historyLogs[0].utilization_ratio.toFixed(1)}%
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Target: &lt; 30% for max CIBIL velocity
          </div>
        </div>
      </div>

      {/* Interactive Line Chart Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
              Historical CIBIL Score Trajectory
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '2px 0 0' }}>
              Visualizing the long-term impact of disciplined financial adjustments
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '3px', background: '#10b981', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-muted)' }}>Recorded Score</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '2px', background: '#38bdf8', borderTop: '2px dashed #38bdf8' }} />
              <span style={{ color: '#38bdf8' }}>750 Prime Target</span>
            </div>
          </div>
        </div>

        {/* SVG Canvas Line Chart */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <div style={{ minWidth: '600px', position: 'relative' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[550, 650, 700, 750].map((gridScore) => {
                const gy = chartHeight - paddingY - ((gridScore - minScore) / (maxScore - minScore)) * (chartHeight - paddingY * 2);
                return (
                  <g key={gridScore}>
                    <line x1={paddingX} y1={gy} x2={chartWidth - paddingX} y2={gy} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                    <text x={paddingX - 10} y={gy + 4} fill="#64748b" fontSize="10" textAnchor="end">{gridScore}</text>
                  </g>
                );
              })}

              {/* 750 Prime Milestone Target Line */}
              <line
                x1={paddingX}
                y1={primeY}
                x2={chartWidth - paddingX}
                y2={primeY}
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <text x={chartWidth - paddingX + 5} y={primeY + 4} fill="#38bdf8" fontSize="10" fontWeight="700">750 Prime</text>

              {/* Area fill */}
              <path d={areaD} fill="url(#chartGradient)" />

              {/* Score Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((pt, idx) => (
                <g
                  key={pt.id || idx}
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint?.id === pt.id ? 7 : 5}
                    fill="#0f172a"
                    stroke="#10b981"
                    strokeWidth={hoveredPoint?.id === pt.id ? 4 : 2.5}
                    style={{ transition: 'all 0.15s ease' }}
                  />
                  {/* Month Label below axis */}
                  <text
                    x={pt.x}
                    y={chartHeight - 8}
                    fill="#94a3b8"
                    fontSize="10"
                    fontWeight="500"
                    textAnchor="middle"
                  >
                    {pt.month_label}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div style={{
                position: 'absolute',
                left: `${hoveredPoint.x}px`,
                top: `${hoveredPoint.y - 75}px`,
                transform: 'translateX(-50%)',
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                borderRadius: '8px',
                padding: '8px 12px',
                pointerEvents: 'none',
                boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                zIndex: 10,
                whiteSpace: 'nowrap'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{hoveredPoint.month_label}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399' }}>
                  Score: {hoveredPoint.credit_score}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                  Utilization: {hoveredPoint.utilization_ratio.toFixed(1)}% | FOIR: {hoveredPoint.dti_ratio.toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Credit Bureau Scoring Factors Weightage Breakdown (Indian Standard) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
          Indian Credit Bureau Weightage Composition
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '18px' }}>
          How TransUnion CIBIL and Experian India evaluate your score pillars
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Payment History</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34d399' }}>35%</span>
            </div>
            <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '35%', height: '100%', background: '#10b981' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginTop: '6px' }}>
              Zero late payments / NACH bounces
            </span>
          </div>

          <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Amounts Owed / Util</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8' }}>30%</span>
            </div>
            <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '30%', height: '100%', background: '#06b6d4' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginTop: '6px' }}>
              Keep total utilization below 30%
            </span>
          </div>

          <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Credit History Length</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#a78bfa' }}>15%</span>
            </div>
            <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '15%', height: '100%', background: '#8b5cf6' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginTop: '6px' }}>
              Age of oldest credit card / loan
            </span>
          </div>

          <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Credit Mix</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f59e0b' }}>10%</span>
            </div>
            <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '10%', height: '100%', background: '#f59e0b' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginTop: '6px' }}>
              Healthy balance of secured & unsecured
            </span>
          </div>

          <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>New Credit Inquiries</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fb7185' }}>10%</span>
            </div>
            <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '10%', height: '100%', background: '#f43f5e' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginTop: '6px' }}>
              Limit hard inquiries to &lt; 2 per year
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

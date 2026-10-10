import React from 'react';
import { Sparkles, AlertOctagon, CheckCircle, ArrowRight, ShieldCheck, Zap, RefreshCw, MessageSquare } from 'lucide-react';

export default function AIRoadmapTab({ aiAnalysis, isLoading, onTriggerAI, onOpenChat, profile }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top AI Action Header */}
      <div className="glass-panel" style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(14, 20, 32, 0.9) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
          }}>
            <Sparkles size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Groq AI Financial Strategist
              </h2>
              <span style={{
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                QWEN 3.8 / LLAMA REASONING
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Deep diagnosis of bureau records & customized 5-step recovery plan for Indian banking.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onOpenChat}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <MessageSquare size={16} color="#38bdf8" />
            <span>Ask Follow-up</span>
          </button>

          <button
            onClick={onTriggerAI}
            disabled={isLoading}
            className="btn btn-ai"
            style={{ fontSize: '0.85rem' }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="spin-slow" />
                <span>Generating Roadmap...</span>
              </>
            ) : (
              <>
                <Zap size={16} />
                <span>Re-Analyze with Groq</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <RefreshCw size={36} color="#a855f7" className="spin-slow" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Groq AI is Evaluating Bureau Metrics...</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto' }}>
            Analyzing credit card utilization, debt-to-income limits against RBI thresholds, and synthesizing a 5-step Indian banking roadmap.
          </p>
        </div>
      )}

      {/* Main Analysis Content */}
      {!isLoading && aiAnalysis && (
        <>
          {/* Executive Summary Card */}
          <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #6366f1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <ShieldCheck size={18} color="#818cf8" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#c7d2fe' }}>
                Executive Financial Health Assessment
              </h3>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-main)', margin: 0 }}>
              {aiAnalysis.executive_summary}
            </p>

            {aiAnalysis.score_analysis && (
              <p style={{ fontSize: '0.86rem', lineHeight: 1.5, color: 'var(--text-muted)', marginTop: '12px' }}>
                <b>Bureau Factor Analysis:</b> {aiAnalysis.score_analysis}
              </p>
            )}
          </div>

          {/* Critical Bottlenecks Section */}
          {aiAnalysis.bottlenecks && aiAnalysis.bottlenecks.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <AlertOctagon size={18} color="#f43f5e" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  Identified Financial Bottlenecks
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '14px'
              }}>
                {aiAnalysis.bottlenecks.map((bottleneck, idx) => (
                  <div
                    key={idx}
                    className="glass-panel"
                    style={{
                      padding: '16px 20px',
                      background: 'rgba(244, 63, 94, 0.05)',
                      border: '1px solid rgba(244, 63, 94, 0.2)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      minWidth: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(244, 63, 94, 0.2)',
                      color: '#fb7185',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      !
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', marginBottom: '2px' }}>
                        Bottleneck Flag #{idx + 1}
                      </div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>
                        {bottleneck}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5-Step Actionable Roadmap Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                  5-Step Actionable Recovery Roadmap
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '2px 0 0' }}>
                  Sequential execution plan tailored to Indian banking policies (CIBIL, RBI, NBFCs)
                </p>
              </div>
              <span className="badge badge-excellent">
                Target: 750+ Prime Tier
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {aiAnalysis.roadmap && aiAnalysis.roadmap.map((step, index) => (
                <div
                  key={index}
                  className="glass-panel"
                  style={{
                    padding: '20px 24px',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gap: '20px',
                    alignItems: 'flex-start',
                    transition: 'transform 0.2s ease, border-color 0.2s ease'
                  }}
                >
                  {/* Step Number Badge */}
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#34d399',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 12px rgba(16, 185, 129, 0.2)'
                  }}>
                    {step.step_number || index + 1}
                  </div>

                  {/* Step Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                        {step.title}
                      </h4>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#38bdf8',
                        background: 'rgba(6, 182, 212, 0.12)',
                        padding: '3px 9px',
                        borderRadius: '6px',
                        border: '1px solid rgba(6, 182, 212, 0.3)'
                      }}>
                        {step.timeline}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
                      <b>Action:</b> {step.action}
                    </p>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '10px',
                      marginTop: '6px',
                      paddingTop: '10px',
                      borderTop: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={14} color="#10b981" />
                        <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
                          Impact: {step.impact}
                        </span>
                      </div>

                      {step.indian_context && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ShieldCheck size={14} color="#6366f1" />
                          <span style={{ fontSize: '0.78rem', color: '#c7d2fe' }}>
                            Indian Standard: {step.indian_context}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

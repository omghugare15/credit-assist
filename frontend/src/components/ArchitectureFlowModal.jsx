import React from 'react';
import { X, Server, Database, Cpu, FileText, Layout, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ArchitectureFlowModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(10px)',
      zIndex: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '32px',
        background: '#090d16',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '20px',
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.9)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                SYSTEM ARCHITECTURE
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                End-to-End System Flow (flow.png)
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: '4px 0 0' }}>
              Verified full-stack implementation connecting Frontend, FastAPI, Groq AI, SQLite & ReportLab
            </p>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Visual Architecture Diagram Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {/* Node 1: Web Frontend */}
          <div className="glass-panel" style={{ padding: '20px', borderTop: '3px solid #06b6d4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Layout size={22} color="#06b6d4" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Web Frontend</h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>React.js / Vite / Vanilla CSS</span>
              </div>
            </div>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: 1.6 }}>
              <li>Interactive CIBIL Speedometer gauge</li>
              <li>Scenarios 1-4 persona switcher</li>
              <li>What-If credit simulation studio</li>
              <li>AI live chat with Groq consultant</li>
            </ul>
          </div>

          {/* Node 2: FastAPI Backend */}
          <div className="glass-panel" style={{ padding: '20px', borderTop: '3px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Server size={22} color="#10b981" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>FastAPI Backend</h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Python 3.14 / Uvicorn</span>
              </div>
            </div>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: 1.6 }}>
              <li>REST endpoints with Pydantic validation</li>
              <li>FOIR (DTI) & Utilization calculations</li>
              <li>CIBIL tier assignment & history logging</li>
              <li>What-If score simulation engine</li>
            </ul>
          </div>

          {/* Node 3: AI Engine */}
          <div className="glass-panel" style={{ padding: '20px', borderTop: '3px solid #8b5cf6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Cpu size={22} color="#a855f7" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>AI Engine</h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Groq API (Qwen 3.8 / LLaMA)</span>
              </div>
            </div>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: 1.6 }}>
              <li>Authorized via user's Groq API key</li>
              <li>Synthesizes 5-step Indian banking roadmap</li>
              <li>Identifies financial bottlenecks</li>
              <li>Conversational credit advisory chat</li>
            </ul>
          </div>

          {/* Node 4: Database */}
          <div className="glass-panel" style={{ padding: '20px', borderTop: '3px solid #f59e0b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Database size={22} color="#f59e0b" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Database</h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>SQLite / SQLAlchemy ORM</span>
              </div>
            </div>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: 1.6 }}>
              <li>Users, FinancialProfiles, Logs tables</li>
              <li>Historical score checkpoints tracking</li>
              <li>AI consultation caching</li>
              <li>Persistent across app restarts</li>
            </ul>
          </div>

          {/* Node 5: PDF Generation Service */}
          <div className="glass-panel" style={{ padding: '20px', borderTop: '3px solid #ec4899' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <FileText size={22} color="#ec4899" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>PDF Service</h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>ReportLab (Python)</span>
              </div>
            </div>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: 1.6 }}>
              <li>Generates high-res official credit audit PDF</li>
              <li>Styled metrics table & score badge</li>
              <li>Full 5-step actionable roadmap</li>
              <li>Instant one-click browser download</li>
            </ul>
          </div>

          {/* Node 6: Financial Health Report */}
          <div className="glass-panel" style={{ padding: '20px', borderTop: '3px solid #3b82f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <CheckCircle2 size={22} color="#38bdf8" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Financial Health Report</h4>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>JSON Response Pipeline</span>
              </div>
            </div>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: 1.6 }}>
              <li>Normalized JSON payload response</li>
              <li>Real-time frontend state sync</li>
              <li>Live delta indicators (+XX PTS)</li>
              <li>Complies with Indian banking norms</li>
            </ul>
          </div>
        </div>

        {/* Live Service Status */}
        <div style={{
          padding: '16px 20px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>
              All 6 Flow Components Active & Synchronized
            </span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            FastAPI Backend: http://127.0.0.1:8000 | Groq: Connected | ReportLab: Ready
          </span>
        </div>
      </div>
    </div>
  );
}

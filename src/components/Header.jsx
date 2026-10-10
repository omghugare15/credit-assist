import React from 'react';
import { ShieldCheck, Download, Sparkles, MessageSquare, Plus, UserCheck, RefreshCw } from 'lucide-react';

export default function Header({
  users,
  currentUser,
  onSelectUser,
  onOpenNewUser,
  onTriggerAI,
  isAILoading,
  onOpenChat,
  onOpenFlowModal,
  onDownloadPDF
}) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(8, 12, 20, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      padding: '14px 28px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <ShieldCheck size={24} color="#ffffff" strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(to right, #ffffff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                CREDIT ASSISTANT
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                GROQ AI • CIBIL INTELLIGENCE
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>
              Indian Financial Ecosystem & Credit Health Platform
            </p>
          </div>
        </div>

        {/* User Persona Switcher (Scenarios 1-4) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Profile:
          </span>
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            gap: '4px'
          }}>
            {users.map(u => {
              const isSelected = currentUser && currentUser.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => onSelectUser(u.id)}
                  style={{
                    background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                    color: isSelected ? '#34d399' : 'var(--text-muted)',
                    border: isSelected ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                    padding: '6px 12px',
                    borderRadius: '7px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <UserCheck size={14} />
                  <span>{u.name.split(' ')[0]}</span>
                </button>
              );
            })}
            
            <button
              onClick={onOpenNewUser}
              title="Register New Borrower Profile (Scenario 1)"
              style={{
                background: 'transparent',
                color: 'var(--text-muted)',
                border: '1px dashed var(--border-subtle)',
                padding: '6px 10px',
                borderRadius: '7px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Plus size={13} />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onOpenFlowModal}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '8px 12px' }}
            title="Inspect System Flow Architecture Diagram"
          >
            <span>Architecture Flow</span>
          </button>

          <button
            onClick={onOpenChat}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '8px 14px' }}
          >
            <MessageSquare size={15} color="#38bdf8" />
            <span>AI Advisor Chat</span>
          </button>

          <button
            onClick={onDownloadPDF}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '8px 14px' }}
            title="Download ReportLab Generated PDF Credit Report"
          >
            <Download size={15} color="#10b981" />
            <span>Audit PDF</span>
          </button>

          <button
            onClick={onTriggerAI}
            disabled={isAILoading}
            className="btn btn-ai"
            style={{ fontSize: '0.8rem', padding: '8px 16px' }}
          >
            {isAILoading ? (
              <>
                <RefreshCw size={15} className="spin-slow" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>AI Consult</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

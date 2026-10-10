import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';

export default function AIChatDrawer({ isOpen, onClose, profile, userName }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${userName}! I'm your dedicated Credit & Banking Strategist powered by Groq. Based on your current CIBIL score of ${profile?.credit_score || 650} and utilization of ${profile?.utilization_ratio || 0}%, how can I help you optimize your borrowing terms today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const quickPrompts = [
    "How can I reach 750+ CIBIL score in 90 days?",
    "Should I close my oldest credit card?",
    "How do I dispute an erroneous late payment under RBI rules?",
    "Will taking a personal loan to clear card debt help my score?"
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`/api/ai/chat/${profile?.user_id || 1}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          chat_history: messages.slice(-6)
        })
      });

      if (!res.ok) throw new Error('Failed to get AI response');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm currently unable to connect to the AI model. For immediate score improvement, keep your credit card utilization below 30% and ensure zero NACH mandate bounces across all loans."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: '480px',
      background: 'rgba(10, 14, 24, 0.96)',
      backdropFilter: 'blur(24px)',
      borderLeft: '1px solid var(--border-subtle)',
      boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.7)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideIn 0.25s ease'
    }}>
      {/* Drawer Header */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={20} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              AI Credit Advisor
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              Live • Groq Qwen 3.8
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '10px',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '88%'
              }}
            >
              {!isUser && (
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '28px'
                }}>
                  <Sparkles size={14} color="#a5b4fc" />
                </div>
              )}

              <div style={{
                background: isUser ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                border: isUser ? 'none' : '1px solid var(--border-subtle)',
                fontSize: '0.86rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-line'
              }}>
                {m.content}
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RefreshCw size={14} color="#a5b4fc" className="spin-slow" />
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)'
            }}>
              Consulting Indian banking guidelines...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Pills */}
      <div style={{ padding: '8px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              padding: '4px 10px',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(8, 12, 20, 0.8)',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Ask anything about CIBIL, loans, or bureau disputes..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#ffffff',
            fontSize: '0.88rem',
            outline: 'none'
          }}
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="btn btn-primary"
          style={{ padding: '10px 14px', borderRadius: '10px' }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

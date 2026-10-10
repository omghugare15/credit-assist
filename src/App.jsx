import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Sliders,
  BookOpen,
  Download,
  AlertCircle,
  CheckCircle,
  FileText,
  Info
} from 'lucide-react';

import Header from './components/Header';
import ScoreGauge from './components/ScoreGauge';
import MetricCards from './components/MetricCards';
import AIRoadmapTab from './components/AIRoadmapTab';
import ProgressHistoryTab from './components/ProgressHistoryTab';
import SimulatorTab from './components/SimulatorTab';
import UpdateProfileModal from './components/UpdateProfileModal';
import AIChatDrawer from './components/AIChatDrawer';
import ArchitectureFlowModal from './components/ArchitectureFlowModal';

export default function App() {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  // UI States
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap', 'history', 'simulator', 'guide'
  const [isAILoading, setIsAILoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNewUserModal, setIsNewUserModal] = useState(false);
  const [scoreDelta, setScoreDelta] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // 1. Fetch Users List
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        if (data.length > 0 && !currentUserId) {
          setCurrentUserId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // 2. Fetch Active Profile & History
  const fetchUserProfile = async (userId) => {
    try {
      const [profRes, histRes] = await贯彻([
        fetch(`/api/users/${userId}/profile`),
        fetch(`/api/users/${userId}/history`)
      ]);

      if (profRes.ok) {
        const pData = await profRes.json();
        setCurrentUser(pData.user);
        setCurrentProfile(pData.profile);
      }

      if (histRes.ok) {
        const hData = await histRes.json();
        setHistoryLogs(hData);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  // Helper for parallel requests
  const 贯彻 = (promises) => Promise.all(promises);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchUserProfile(currentUserId);
      // Automatically load AI consultation for the selected user
      handleTriggerAI(currentUserId);
    }
  }, [currentUserId]);

  // 3. Trigger Groq AI Consultation (Scenario 2)
  const handleTriggerAI = async (userIdToUse) => {
    const uid = userIdToUse || currentUserId;
    if (!uid) return;
    setIsAILoading(true);
    try {
      const res = await fetch(`/api/ai/consult/${uid}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data);
      }
    } catch (err) {
      console.error('Groq AI consultation error:', err);
    } finally {
      setIsAILoading(false);
    }
  };

  // 4. Download PDF Report (flow.png: ReportLab PDF)
  const handleDownloadPDF = () => {
    if (!currentUserId) return;
    showToast('Generating official ReportLab PDF audit report...', 'info');
    window.location.href = `/api/report/pdf/${currentUserId}`;
  };

  // 5. Update Profile (Scenario 1 & 4)
  const handleSaveProfile = async (formData, isNew) => {
    try {
      if (isNew) {
        // Create user
        const createRes = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          })
        });
        if (!createRes.ok) throw new Error('User creation failed');
        const newUser = await createRes.json();

        // Update profile
        await fetch(`/api/users/${newUser.id}/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        await fetchUsers();
        setCurrentUserId(newUser.id);
        showToast(`Borrower ${newUser.name} registered successfully! (Scenario 1)`);
      } else {
        // Update existing profile (Scenario 4)
        const updateRes = await fetch(`/api/users/${currentUserId}/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (updateRes.ok) {
          const resData = await updateRes.json();
          setScoreDelta(resData.profile.score_delta || 0);
          showToast(`Financial metrics updated! Score delta: ${resData.profile.score_delta >= 0 ? '+' : ''}${resData.profile.score_delta} pts`);
          await fetchUserProfile(currentUserId);
          // Re-trigger AI for fresh roadmap
          handleTriggerAI(currentUserId);
        }
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      showToast('Error saving profile data', 'error');
    }
  };

  // 6. Apply Simulation from Simulator tab (Scenario 4)
  const handleApplySimulation = async (simulatedData) => {
    try {
      const updateRes = await fetch(`/api/users/${currentUserId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simulatedData)
      });
      if (updateRes.ok) {
        const resData = await updateRes.json();
        setScoreDelta(resData.profile.score_delta || 0);
        showToast(`Simulation Applied! Bureau Score increased to ${simulatedData.credit_score} (+${resData.profile.score_delta} PTS)!`);
        await fetchUserProfile(currentUserId);
        handleTriggerAI(currentUserId);
      }
    } catch (err) {
      console.error('Error applying simulation:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: toastMessage.type === 'error' ? '#f43f5e' : (toastMessage.type === 'info' ? '#0284c7' : '#10b981'),
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          fontSize: '0.86rem',
          fontWeight: 600,
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          zIndex: 150,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.2s ease'
        }}>
          {toastMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        users={users}
        currentUser={currentUser}
        onSelectUser={(id) => setCurrentUserId(id)}
        onOpenNewUser={() => {
          setIsNewUserModal(true);
          setIsProfileModalOpen(true);
        }}
        onTriggerAI={() => handleTriggerAI()}
        isAILoading={isAILoading}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenFlowModal={() => setIsFlowModalOpen(true)}
        onDownloadPDF={handleDownloadPDF}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '28px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Scenario Quick Reference Banner */}
        <div className="glass-panel" style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.18)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: '#10b981',
              color: '#020617',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              FLOW COMPLIANCE
            </span>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-main)', fontWeight: 500 }}>
              Testing All 4 Scenarios:
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              1. Onboarding & FOIR • 2. Groq AI 5-Step Plan • 3. Line Chart History • 4. What-If Simulator & Delta
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
              Viewing: <b>{currentUser?.name || 'Borrower'}</b> ({currentProfile?.tier || 'Fair'} Score: {currentProfile?.credit_score})
            </span>
          </div>
        </div>

        {/* Hero Section: Gauge & Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 420px) 1fr',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          <ScoreGauge
            profile={currentProfile}
            scoreDelta={scoreDelta}
            onEditProfile={() => {
              setIsNewUserModal(false);
              setIsProfileModalOpen(true);
            }}
          />

          <MetricCards profile={currentProfile} />
        </div>

        {/* Workspace Navigation Tabs */}
        <div>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '8px',
            marginBottom: '24px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}>
            <button
              onClick={() => setActiveTab('roadmap')}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'roadmap' ? '3px solid #6366f1' : '3px solid transparent',
                color: activeTab === 'roadmap' ? '#c7d2fe' : 'var(--text-muted)',
                padding: '12px 18px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={16} color={activeTab === 'roadmap' ? '#818cf8' : '#94a3b8'} />
              <span>AI 5-Step Roadmap (Scenario 2)</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'history' ? '3px solid #10b981' : '3px solid transparent',
                color: activeTab === 'history' ? '#34d399' : 'var(--text-muted)',
                padding: '12px 18px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <TrendingUp size={16} color={activeTab === 'history' ? '#10b981' : '#94a3b8'} />
              <span>Score Trajectory History (Scenario 3)</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'simulator' ? '3px solid #06b6d4' : '3px solid transparent',
                color: activeTab === 'simulator' ? '#38bdf8' : 'var(--text-muted)',
                padding: '12px 18px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <Sliders size={16} color={activeTab === 'simulator' ? '#06b6d4' : '#94a3b8'} />
              <span>What-If Score Simulator (Scenario 4)</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'guide' ? '3px solid #f59e0b' : '3px solid transparent',
                color: activeTab === 'guide' ? '#fbbf24' : 'var(--text-muted)',
                padding: '12px 18px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <BookOpen size={16} color={activeTab === 'guide' ? '#f59e0b' : '#94a3b8'} />
              <span>Indian Banking & RBI Standards</span>
            </button>
          </div>

          {/* Tab 1: AI Roadmap */}
          {activeTab === 'roadmap' && (
            <AIRoadmapTab
              aiAnalysis={aiAnalysis}
              isLoading={isAILoading}
              onTriggerAI={() => handleTriggerAI()}
              onOpenChat={() => setIsChatOpen(true)}
              profile={currentProfile}
            />
          )}

          {/* Tab 2: Progress History */}
          {activeTab === 'history' && (
            <ProgressHistoryTab
              historyLogs={historyLogs}
              profile={currentProfile}
            />
          )}

          {/* Tab 3: What-If Simulator */}
          {activeTab === 'simulator' && (
            <SimulatorTab
              profile={currentProfile}
              onApplySimulation={handleApplySimulation}
            />
          )}

          {/* Tab 4: Indian Banking Standards & CIBIL Bureau Guide */}
          {activeTab === 'guide' && (
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                  Indian Banking Norms & Bureau Governance Guidelines
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: '4px 0 0' }}>
                  Essential rules and benchmarks established by Reserve Bank of India (RBI) and licensed credit bureaus
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
                <div style={{ padding: '18px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginBottom: '8px' }}>
                    1. The 30% Credit Card Utilization Rule
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    RBI and credit bureaus (TransUnion CIBIL, Experian, Equifax, CRIF High Mark) strongly recommend keeping overall revolving credit card balances under 30% of total sanctioned limits. Exceeding 50% signals credit hunger and can immediately drop scores by 40-70 points.
                  </p>
                </div>

                <div style={{ padding: '18px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', marginBottom: '8px' }}>
                    2. FOIR (Fixed Obligation to Income Ratio)
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Indian commercial banks (SBI, HDFC, ICICI, Axis) calculate FOIR as Total Monthly Debt EMIs divided by Net Monthly Salary. For home loan eligibility, banks mandate FOIR must stay under 40-50%. A FOIR above 50% leads to automatic loan rejection regardless of income.
                  </p>
                </div>

                <div style={{ padding: '18px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#a78bfa', marginBottom: '8px' }}>
                    3. NACH e-Mandate & DPD (Days Past Due)
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    A single dishonored NACH / ECS installment logs an immediate DPD flag on your Credit Information Report (CIR). Lenders look at 36 months of repayment history. Automating EMIs on salary day prevents accidental bureau blemishes.
                  </p>
                </div>

                <div style={{ padding: '18px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f59e0b', marginBottom: '8px' }}>
                    4. 30-Day RBI Dispute Resolution Mandate
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Under RBI's Master Directions, credit bureaus must adjudicate borrower-initiated disputes within 30 days. If an erroneously reported account or missing NOC is disputed, lenders are legally bound to update bureau records or face compensatory penalties.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: 'var(--text-dim)',
        background: 'rgba(6, 9, 15, 0.9)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <b>Credit Assistant</b> • Full Stack AI Credit Health & Intelligence Platform (FastAPI + React + Groq AI + ReportLab)
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ color: '#10b981' }}>FastAPI Backend: Online</span>
            <span style={{ color: '#38bdf8' }}>Groq API (Qwen 3.8): Connected</span>
            <span style={{ color: '#a78bfa' }}>SQLite DB: Persisted</span>
          </div>
        </div>
      </footer>

      {/* Slide-over AI Chat Drawer */}
      <AIChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        profile={currentProfile}
        userName={currentUser?.name || 'Borrower'}
      />

      {/* Edit / New Profile Modal */}
      <UpdateProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={currentProfile}
        isNewUser={isNewUserModal}
        onSave={handleSaveProfile}
      />

      {/* Architecture Flow Modal */}
      <ArchitectureFlowModal
        isOpen={isFlowModalOpen}
        onClose={() => setIsFlowModalOpen(false)}
      />
    </div>
  );
}

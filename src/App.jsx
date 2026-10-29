import React, { useState, useEffect, useRef, useMemo } from 'react';

const INR = (n) => '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN');
const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

const DEFAULT_DEMO = {
  id: 1,
  name: 'Rahul Sharma',
  first: 'Rahul',
  email: 'demo@creditassistant.in',
  score: 648,
  inc: 85000,
  exp: 38000,
  emi: 18000,
  lim: 150000,
  bal: 60000,
  miss: 1,
  hist: [612, 622, 631, 640, 645, 648],
  est: false
};

const TIER_MAP = (s) =>
  s < 650 ? ['Poor', 'rd'] : s < 700 ? ['Fair', 'am'] : s < 750 ? ['Good', 'bl'] : ['Excellent', 'gr'];

const calcUtil = (p) => (!p || !p.lim ? 0 : (p.bal / p.lim) * 100);
const calcFoir = (p) => (!p || !p.inc ? 0 : (p.emi / p.inc) * 100);

export default function App() {
  // --- Core State ---
  const [user, setUser] = useState(null);
  const [profilesList, setProfilesList] = useState([]);
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'history' | 'sim' | 'std'
  const [gateView, setGateView] = useState('login'); // 'login' | 'signup' | 'details'
  const [isEditing, setIsEditing] = useState(false);
  const [pendingSignup, setPendingSignup] = useState(null);

  // Score display animation state
  const [displayScore, setDisplayScore] = useState(300);
  const targetScoreRef = useRef(300);
  const animFrameRef = useRef(null);

  // Forms error messages
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');

  // Toast
  const [toastText, setToastText] = useState('');
  const [toastActive, setToastActive] = useState(false);
  const toastTimerRef = useRef(null);

  // AI Drawer & Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const msgsEndRef = useRef(null);

  // AI Consult State
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  // Simulator Sliders
  const [simPay, setSimPay] = useState(0);
  const [simInc, setSimInc] = useState(0);
  const [simMon, setSimMon] = useState(0);
  const [simEmi, setSimEmi] = useState(0);

  // Details Form State
  const [detailsForm, setDetailsForm] = useState({
    inc: '',
    exp: '',
    emi: '',
    lim: '',
    bal: '',
    miss: '',
    score: ''
  });

  // Login & Signup Form State
  const [loginForm, setLoginForm] = useState({ email: '', pw: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', pw: '' });

  const showToast = (msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastText(msg);
    setToastActive(true);
    toastTimerRef.current = setTimeout(() => {
      setToastActive(false);
    }, 2800);
  };

  // --- Smooth Gauge Animation ---
  const animateScoreTo = (newScore) => {
    const start = targetScoreRef.current;
    targetScoreRef.current = newScore;
    const startTime = performance.now();
    const duration = 900;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      // Cubic ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const cur = Math.round(start + (newScore - start) * eased);
      setDisplayScore(cur);
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayScore(newScore);
      }
    };
    animFrameRef.current = requestAnimationFrame(step);
  };

  // --- Initialize App & Check Local Storage / Backend Users ---
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Try to fetch backend users
        const res = await fetch('/api/users');
        if (res.ok) {
          const uList = await res.json();
          setProfilesList(uList);
        }
      } catch (err) {
        console.warn('Backend /api/users unavailable, using offline fallback', err);
      }

      // Check if user session was stored in localStorage
      const savedUser = localStorage.getItem('credit_assistant_active_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          animateScoreTo(parsed.score);
          fetchAIAnalysis(parsed.id, parsed);
          return;
        } catch (e) {
          console.error(e);
        }
      }

      // Default to login gate
      setGateView('login');
    };

    loadInitialData();
  }, []);

  // Update simulator defaults when user changes
  useEffect(() => {
    if (user) {
      const safeBal = user.bal || 0;
      const safeLim = user.lim || 1;
      const initialPay = Math.max(0, Math.ceil((safeBal - safeLim * 0.3) / 1000) * 1000);
      setSimPay(Math.min(initialPay, safeBal));
      setSimInc(0);
      setSimMon(0);
      setSimEmi(0);
      animateScoreTo(user.score);
    }
  }, [user?.email, user?.score]);

  // Sync details form with current user when editing
  const openEditDetails = () => {
    if (!user) return;
    setIsEditing(true);
    setDetailsForm({
      inc: user.inc || '',
      exp: user.exp || '',
      emi: user.emi || '',
      lim: user.lim || '',
      bal: user.bal || '',
      miss: user.miss || 0,
      score: user.est ? '' : user.score || ''
    });
    setGateView('details');
  };

  // --- Backend AI Analysis Fetcher ---
  const fetchAIAnalysis = async (userId, userObj) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/ai/consult/${userId}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data);
      }
    } catch (e) {
      console.warn('AI consult API error, using calculated roadmap', e);
    }
  };

  // --- Handle Login ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    const em = loginForm.email.trim().toLowerCase();
    const pw = loginForm.pw;

    // Check demo credentials
    if ((em === 'demo@creditassistant.in' || em === 'rahul.sharma@example.in') && pw === 'demo1234') {
      let loggedUser = { ...DEFAULT_DEMO };
      // Try to load latest from backend if available
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const list = await res.json();
          const found = list.find((u) => u.email.toLowerCase() === em || u.name === 'Rahul Sharma');
          if (found) {
            const pRes = await fetch(`/api/users/${found.id}/profile`);
            if (pRes.ok) {
              const pData = await pRes.json();
              const hRes = await fetch(`/api/users/${found.id}/history`);
              const hData = hRes.ok ? await hRes.json() : [];
              loggedUser = {
                id: found.id,
                name: found.name,
                first: found.name.split(' ')[0],
                email: found.email,
                score: pData.profile.credit_score,
                inc: pData.profile.monthly_income,
                exp: pData.profile.monthly_expenses,
                emi: pData.profile.total_loan_emi,
                lim: pData.profile.credit_card_limit,
                bal: pData.profile.credit_card_balance,
                miss: pData.profile.missed_payments_24m,
                hist: hData.length ? hData.map((h) => h.credit_score) : DEFAULT_DEMO.hist,
                est: false
              };
            }
          }
        }
      } catch (err) {
        console.warn('Backend load failed, using default demo object', err);
      }

      setUser(loggedUser);
      localStorage.setItem('credit_assistant_active_user', JSON.stringify(loggedUser));
      animateScoreTo(loggedUser.score);
      showToast(`Welcome back, ${loggedUser.first}!`);
      fetchAIAnalysis(loggedUser.id, loggedUser);
      return;
    }

    // Check custom local accounts or backend
    try {
      const localAccounts = JSON.parse(localStorage.getItem('credit_assistant_accounts') || '{}');
      const stored = localAccounts[em];
      if (stored && stored.pw === pw) {
        setUser(stored.p);
        localStorage.setItem('credit_assistant_active_user', JSON.stringify(stored.p));
        animateScoreTo(stored.p.score);
        showToast(`Logged in as ${stored.p.first}!`);
        fetchAIAnalysis(stored.p.id, stored.p);
        return;
      }

      // Check backend user login
      const bRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: em, password: pw })
      });
      if (bRes.ok) {
        const bUser = await bRes.json();
        const pRes = await fetch(`/api/users/${bUser.id}/profile`);
        if (pRes.ok) {
          const pData = await pRes.json();
          const hRes = await fetch(`/api/users/${bUser.id}/history`);
          const hData = hRes.ok ? await hRes.json() : [];
          const newUserObj = {
            id: bUser.id,
            name: bUser.name,
            first: bUser.name.split(' ')[0],
            email: bUser.email,
            score: pData.profile.credit_score,
            inc: pData.profile.monthly_income,
            exp: pData.profile.monthly_expenses,
            emi: pData.profile.total_loan_emi,
            lim: pData.profile.credit_card_limit,
            bal: pData.profile.credit_card_balance,
            miss: pData.profile.missed_payments_24m,
            hist: hData.length ? hData.map((h) => h.credit_score) : [pData.profile.credit_score],
            est: false
          };
          setUser(newUserObj);
          localStorage.setItem('credit_assistant_active_user', JSON.stringify(newUserObj));
          animateScoreTo(newUserObj.score);
          showToast(`Logged in as ${newUserObj.first}!`);
          fetchAIAnalysis(newUserObj.id, newUserObj);
          return;
        }
      }
    } catch (err) {
      console.warn(err);
    }

    setLoginError('Email or password is incorrect. Check them, or sign up for a new account.');
  };

  // --- Handle Signup Step 1 ---
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setSignupError('');
    const em = signupForm.email.trim().toLowerCase();
    const localAccounts = JSON.parse(localStorage.getItem('credit_assistant_accounts') || '{}');
    if (localAccounts[em]) {
      setSignupError('This email already has an account. Log in instead.');
      return;
    }
    const nm = signupForm.name.trim();
    setPendingSignup({
      name: nm,
      first: nm.split(' ')[0] || nm,
      email: em,
      pw: signupForm.pw
    });
    setIsEditing(false);
    setDetailsForm({
      inc: '',
      exp: '',
      emi: '',
      lim: '',
      bal: '',
      miss: 0,
      score: ''
    });
    setGateView('details');
  };

  // --- Handle Financial Details Submit ---
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    const inc = Number(detailsForm.inc) || 1;
    const exp = Number(detailsForm.exp) || 0;
    const emi = Number(detailsForm.emi) || 0;
    const lim = Number(detailsForm.lim) || 1;
    const bal = Number(detailsForm.bal) || 0;
    const miss = Number(detailsForm.miss) || 0;
    const rawScore = detailsForm.score ? Number(detailsForm.score) : 0;

    const uRatio = (bal / lim) * 100;
    const fRatio = (emi / inc) * 100;
    const isEstimated = !rawScore;
    const finalScore = rawScore
      ? Math.max(300, Math.min(900, rawScore))
      : Math.round(
          Math.min(
            900,
            Math.max(
              300,
              760 - 2.5 * Math.max(0, uRatio - 30) - 30 * miss - 1.5 * Math.max(0, fRatio - 40)
            )
          )
        );

    let updatedUser;
    if (isEditing && user) {
      updatedUser = {
        ...user,
        inc,
        exp,
        emi,
        lim,
        bal,
        miss,
        score: finalScore,
        est: isEstimated,
        hist: [...(user.hist || []), finalScore].slice(-6)
      };

      // Sync to backend PUT /api/users/{id}/profile
      try {
        await fetch(`/api/users/${user.id}/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credit_score: finalScore,
            monthly_income: inc,
            monthly_expenses: exp,
            credit_card_limit: lim,
            credit_card_balance: bal,
            total_loan_emi: emi,
            active_loans_count: 2,
            missed_payments_24m: miss,
            credit_age_years: 4.0
          })
        });
      } catch (err) {
        console.warn('Backend update failed:', err);
      }
    } else {
      // New user registration
      let userId = Date.now();
      try {
        const createRes = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: pendingSignup.name,
            email: pendingSignup.email
          })
        });
        if (createRes.ok) {
          const bUser = await createRes.json();
          userId = bUser.id;
          await fetch(`/api/users/${userId}/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              credit_score: finalScore,
              monthly_income: inc,
              monthly_expenses: exp,
              credit_card_limit: lim,
              credit_card_balance: bal,
              total_loan_emi: emi,
              active_loans_count: 1,
              missed_payments_24m: miss,
              credit_age_years: 3.0
            })
          });
        }
      } catch (err) {
        console.warn('Backend user create failed:', err);
      }

      updatedUser = {
        id: userId,
        name: pendingSignup.name,
        first: pendingSignup.first,
        email: pendingSignup.email,
        inc,
        exp,
        emi,
        lim,
        bal,
        miss,
        score: finalScore,
        est: isEstimated,
        hist: [finalScore]
      };

      // Save to localStorage accounts
      const localAccounts = JSON.parse(localStorage.getItem('credit_assistant_accounts') || '{}');
      localAccounts[pendingSignup.email] = {
        pw: pendingSignup.pw,
        p: updatedUser
      };
      localStorage.setItem('credit_assistant_accounts', JSON.stringify(localAccounts));
    }

    setUser(updatedUser);
    localStorage.setItem('credit_assistant_active_user', JSON.stringify(updatedUser));
    setIsEditing(false);
    animateScoreTo(updatedUser.score);
    showToast(isEditing ? 'Profile details updated!' : `Welcome to Credit Assistant, ${updatedUser.first}!`);
    fetchAIAnalysis(updatedUser.id, updatedUser);
  };

  // --- Switch Profile ---
  const handleSwitchProfile = async (targetUserId) => {
    try {
      const pRes = await fetch(`/api/users/${targetUserId}/profile`);
      if (pRes.ok) {
        const pData = await pRes.json();
        const hRes = await fetch(`/api/users/${targetUserId}/history`);
        const hData = hRes.ok ? await hRes.json() : [];
        const switched = {
          id: pData.user.id,
          name: pData.user.name,
          first: pData.user.name.split(' ')[0],
          email: pData.user.email,
          score: pData.profile.credit_score,
          inc: pData.profile.monthly_income,
          exp: pData.profile.monthly_expenses,
          emi: pData.profile.total_loan_emi,
          lim: pData.profile.credit_card_limit,
          bal: pData.profile.credit_card_balance,
          miss: pData.profile.missed_payments_24m,
          hist: hData.length ? hData.map((h) => h.credit_score) : [pData.profile.credit_score],
          est: false
        };
        setUser(switched);
        localStorage.setItem('credit_assistant_active_user', JSON.stringify(switched));
        animateScoreTo(switched.score);
        showToast(`Switched profile to ${switched.name}`);
        fetchAIAnalysis(switched.id, switched);
      }
    } catch (e) {
      console.warn('Profile switch failed', e);
    }
  };

  // --- Logout ---
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('credit_assistant_active_user');
    setIsChatOpen(false);
    setChatMessages([]);
    setGateView('login');
    showToast('Logged out successfully.');
  };

  // --- Audit PDF Generation ---
  const handleDownloadAuditPDF = async () => {
    if (!user) return;
    setIsDownloadingPDF(true);
    showToast('Generating official ReportLab Bureau Audit PDF...');

    try {
      const res = await fetch(`/api/report/pdf/${user.id}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const cleanName = user.name.replace(/[^a-zA-Z0-9]/g, '_');
        a.download = `Credit_Assistant_Audit_${cleanName}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        showToast('Audit PDF downloaded successfully!');
      } else {
        // Fallback to window.print()
        showToast('Preparing print-friendly audit report...');
        setTimeout(() => window.print(), 300);
      }
    } catch (err) {
      console.warn('PDF endpoint error, falling back to print:', err);
      showToast('Opening print dialog for official audit...');
      setTimeout(() => window.print(), 300);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // --- AI Consult Action ---
  const handleTriggerAIConsult = async () => {
    if (!user) return;
    setIsConsulting(true);
    showToast(`Consulting AI Advisor on Indian Banking Norms...`);
    setActiveTab('roadmap');

    try {
      const res = await fetch(`/api/ai/consult/${user.id}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data);
        showToast('AI 5-step roadmap updated with live bureau recommendations!');
      } else {
        showToast('Roadmap aligned to Indian banking & RBI guidelines.');
      }
    } catch (err) {
      console.warn('AI consult fetch failed:', err);
      showToast('Roadmap loaded from RBI compliance rules.');
    } finally {
      setIsConsulting(false);
      const el = document.getElementById('t-roadmap');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- AI Chat Logic ---
  const handleSendChat = async () => {
    const q = chatInput.trim();
    if (!q) return;

    const userMsg = { id: Date.now(), role: 'u', text: q };
    const newChatHistory = [...chatMessages, userMsg];
    setChatMessages(newChatHistory);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const apiHistory = newChatHistory.map((m) => ({
        role: m.role === 'u' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch(`/api/ai/chat/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: q,
          chat_history: apiHistory.slice(0, -1)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [...prev, { id: Date.now() + 1, role: 'a', text: data.reply }]);
        setIsChatLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Chat API error, falling back to smart local advice:', err);
    }

    // Smart Conversational Local Fallback
    const l = q.trim().toLowerCase();
    const curUtil = calcUtil(user);
    const safeBal = (user.lim || 150000) * 0.3;
    const gap = Math.max(0, 750 - user.score);
    let reply = `Based on your profile (CIBIL: ${user.score}, Utilization: ${curUtil.toFixed(1)}%), keeping your card balance under ${INR(safeBal)} is your fastest path to 750+ prime tier. What would you like to explore?`;

    if (/^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening)|yo|sup)\b/i.test(l) || ['hi', 'hello', 'hey', 'test'].includes(l)) {
      reply = `Hello ${user.first || ''}! 👋 I'm your Credit Assistant AI advisor. Your CIBIL score is currently ${user.score} (${tierName} tier) with ${curUtil.toFixed(1)}% card utilization.\n\nHow can I help you today? You can ask me:\n• How do I reach 750+ prime score?\n• How to lower my card utilization?\n• Will banks approve my loan with this FOIR?\n• How to dispute an error on CIBIL?`;
    } else if (/^(thanks|thank you|thx|great|awesome|perfect|ok|okay|got it|cool)\b/i.test(l)) {
      reply = `You're very welcome, ${user.first || 'borrower'}! 😊 Keeping card utilization under 30% and paying bills on time will steadily build your score. Feel free to ask if anything else comes up!`;
    } else if (/who are you|what can you do|help|about you|commands/.test(l)) {
      reply = `I am your personal Indian Credit Intelligence Advisor. 🇮🇳\n\nI can help you with:\n1. CIBIL score recovery & 750+ prime roadmap\n2. Credit card utilization & interest savings (avoiding 42% APR)\n3. FOIR & loan eligibility for SBI, HDFC, ICICI\n4. Disputing errors under RBI's 30-day mandate\n5. Setting up e-NACH auto-debit to protect payment history`;
    } else if (/improve|boost|increase|750|reach 750|fix score|roadmap|plan/.test(l)) {
      reply = `You are ${gap} points away from 750+ Prime tier:\n\n1. Bring Card Balance below ${INR(safeBal)}: Dropping utilization under 30% adds +25 to +40 points quickly.\n2. Request a Limit Increase: Ask your bank for a 30-50% limit hike with salary slips.\n3. Automate via e-NACH: Prevent 30-day DPD late marks on your EMIs (${INR(user.emi)}/mo).\n4. Check Closed Accounts: Ensure paid loans have formal NOCs on CIBIL.`;
    } else if (/utili|balance|card|debt|limit/.test(l)) {
      reply = `Credit Card Analysis:\n• Current Limit: ${INR(user.lim)}\n• Current Balance: ${INR(user.bal)} (${curUtil.toFixed(1)}% utilization)\n• Safe Ceiling (30%): ${INR(safeBal)}\n\nPaying down ${INR(Math.max(0, user.bal - safeBal))} moves you into the safe green zone and stops 42% APR compounding interest.`;
    } else if (/foir|loan|approval|salary|emi|income/.test(l)) {
      const f = calcFoir(user);
      reply = `FOIR Analysis:\n• Monthly Income: ${INR(user.inc)}\n• Monthly EMIs: ${INR(user.emi)}\n• FOIR: ${f.toFixed(1)}% (${f <= 40 ? 'Safe' : 'Elevated above 40% cap'})\n\nBanks (SBI, HDFC, ICICI) cap FOIR at 40-50%. ${f <= 40 ? 'You qualify for prime loan pricing!' : 'Lowering personal loan EMIs will restore high loan approval capacity.'}`;
    } else if (/miss|late|dpd|default|nach|mandate/.test(l)) {
      reply = `Payment History (35% CIBIL weight):\nYou have ${user.miss || 0} missed payment(s) in the last 24 months. Activating an e-NACH auto-debit mandate prevents 30-day DPD marks, allowing 6-12 clean billing cycles to rebuild prime standing.`;
    } else if (/dispute|cir|report|cibil|error|noc|written off/.test(l)) {
      reply = `How to dispute CIBIL errors (RBI 30-Day Mandate):\n1. Pull your official CIR from CIBIL or Experian.\n2. Verify that closed loans show formal NOCs.\n3. Raise an online dispute at cibil.com/dispute-center.\n4. Under RBI Master Directions, lenders must correct bureau records within 30 days.`;
    }


    setTimeout(() => {
      setChatMessages((prev) => [...prev, { id: Date.now() + 1, role: 'a', text: reply }]);
      setIsChatLoading(false);
    }, 400);
  };

  useEffect(() => {
    if (msgsEndRef.current) {
      msgsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatLoading]);

  // Open Chat Drawer
  const handleOpenChat = () => {
    setIsChatOpen(true);
    if (!chatMessages.length && user) {
      setChatMessages([
        {
          id: 1,
          role: 'a',
          text: `Hi ${user.first}! I'm your AI credit advisor. Ask me anything about your CIBIL score, FOIR, card utilization, or debt repayment roadmap.`
        }
      ]);
    }
  };

  // --- What-If Simulator Calculations ---
  const simResult = useMemo(() => {
    if (!user) return { pr: 300, delta: 0, oldUtil: 0, newUtil: 0, oldFoir: 0, newFoir: 0, savedInterest: 0 };

    const oldUtil = calcUtil(user);
    const newBal = Math.max(0, user.bal - simPay);
    const newLim = user.lim * (1 + simInc / 100);
    const newUtil = (newBal / newLim) * 100;

    const oldFoir = calcFoir(user);
    const newEmi = Math.max(0, user.emi - simEmi);
    const newFoir = (newEmi / user.inc) * 100;

    const q = (u) => -2.5 * Math.max(0, u - 30) + 0.5 * Math.max(0, 30 - u);
    const d =
      Math.min(60, q(newUtil) - q(oldUtil)) +
      Math.min(30, simMon * 2.5) +
      Math.min(15, (simEmi / 1000) * 1.2);

    const pr = Math.min(900, Math.max(300, Math.round(user.score + d)));
    const delta = pr - user.score;
    const savedInterest = simPay * 0.42; // ~42% APR revolving card debt in India

    return {
      pr,
      delta,
      oldUtil,
      newUtil,
      oldFoir,
      newFoir,
      savedInterest,
      newBal,
      newLim,
      newEmi
    };
  }, [user, simPay, simInc, simMon, simEmi]);

  // Apply Simulation
  const handleApplySimulation = async () => {
    if (!user) return;
    if (simResult.pr === user.score) {
      showToast('Move a slider to see a projected change first.');
      return;
    }

    const updatedUser = {
      ...user,
      bal: simResult.newBal,
      lim: simResult.newLim,
      emi: simResult.newEmi,
      score: simResult.pr,
      hist: [...(user.hist || []), simResult.pr].slice(-6),
      est: false
    };

    // Save to backend
    try {
      await fetch(`/api/users/${user.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credit_score: simResult.pr,
          monthly_income: user.inc,
          monthly_expenses: user.exp,
          credit_card_limit: simResult.newLim,
          credit_card_balance: simResult.newBal,
          total_loan_emi: simResult.newEmi,
          active_loans_count: 2,
          missed_payments_24m: user.miss,
          credit_age_years: 4.0
        })
      });
    } catch (err) {
      console.warn('Backend simulation apply sync error:', err);
    }

    setUser(updatedUser);
    localStorage.setItem('credit_assistant_active_user', JSON.stringify(updatedUser));
    animateScoreTo(simResult.pr);
    showToast(`Simulation Applied! Bureau Score updated to ${simResult.pr} (+${simResult.delta} pts)`);
  };

  // --- Fill Demo Button ---
  const handleFillDemo = () => {
    setLoginForm({
      email: 'demo@creditassistant.in',
      pw: 'demo1234'
    });
    setLoginError('');
  };

  // Derived metrics for UI
  const curUtil = user ? calcUtil(user) : 0;
  const curFoir = user ? calcFoir(user) : 0;
  const [tierName, tierColor] = user ? TIER_MAP(user.score) : ['Fair', 'am'];
  const scoreGap = user ? 750 - user.score : 0;

  const scoreNoteMap = {
    Poor: 'Lenders price in extra risk. Lowering card utilization is the fastest fix.',
    Fair: 'Approval is likely, but with a risk premium. Get utilization under 30% to move up.',
    Good: 'You qualify for competitive rates. A few clean months get you to prime.',
    Excellent: 'You are in the prime tier. Keep utilization low and every payment on time.'
  };

  // Default Roadmap Steps if AI analysis not fetched
  const defaultRoadmapSteps = [
    {
      step_number: 1,
      title: 'Pay down your card balance',
      timeline: 'Month 1',
      action: user
        ? curUtil > 30
          ? `Bring the balance from ${INR(user.bal)} to under ${INR(user.lim * 0.3)}.`
          : `Keep the balance under ${INR(user.lim * 0.3)}.`
        : '',
      impact: 'Expect +25 to +40 points once utilization drops below 30%.',
      indian_context: 'Avoid the minimum-due trap: 42% APR compounds fast on Indian cards.'
    },
    {
      step_number: 2,
      title: 'Request a credit limit increase',
      timeline: 'Months 1 to 2',
      action: 'Send salary slips or your ITR to your issuing bank and ask for a 30 to 50% higher limit. Do not open new cards.',
      impact: 'A larger limit lowers utilization without spending cash.',
      indian_context: 'Banks often pre-approve hikes in NetBanking after 12 months of clean history.'
    },
    {
      step_number: 3,
      title: 'Audit your credit reports',
      timeline: 'Months 2 to 3',
      action: 'Download your CIBIL and Experian reports and confirm every closed account has a formal NOC.',
      impact: 'Removes phantom dues and wrong days-past-due tags that depress your score.',
      indian_context: 'Under RBI guidelines, bureaus must resolve disputes within 30 days.'
    },
    {
      step_number: 4,
      title: 'Set up e-NACH auto-debit',
      timeline: 'Month 3',
      action: 'Link your card and loan EMIs to an e-NACH mandate so no payment is missed.',
      impact: 'Stops new 30 and 60 day late marks, the most damaging entries.',
      indian_context: 'e-NACH is accepted by all major Indian banks and NBFCs.'
    },
    {
      step_number: 5,
      title: 'Build a balanced credit mix',
      timeline: 'Month 6 onward',
      action: 'Add a small secured loan, such as a gold or auto loan, alongside your cards and repay it on time.',
      impact: 'Credit mix is 10% of the score and rewards a healthy secured and unsecured balance.',
      indian_context: 'Bureaus favor accounts with 12 or more months of seasoning.'
    }
  ];

  const activeRoadmap = aiAnalysis?.roadmap?.length ? aiAnalysis.roadmap : defaultRoadmapSteps;

  // History Chart Calculations
  const chartSvgContent = useMemo(() => {
    if (!user || !user.hist || !user.hist.length) return null;
    const h = user.hist;
    const lo = Math.min(...h, 650) - 25;
    const hi = 800;
    const n = h.length;

    const X = (i) => (n > 1 ? 50 + i * (560 / (n - 1)) : 330);
    const Y = (v) => 230 - ((v - lo) / (hi - lo)) * 200;

    const y750 = Y(750);
    const pathD = h.map((v, i) => (i ? 'L' : 'M') + X(i) + ' ' + Y(v)).join(' ');

    return {
      y750,
      pathD,
      points: h.map((v, i) => ({
        cx: X(i),
        cy: Y(v),
        score: v,
        isLast: i === n - 1,
        label: user.email === 'demo@creditassistant.in' ? MONTHS[6 - n + i] || `Entry ${i + 1}` : `Entry ${i + 1}`
      })),
      lastScore: h[n - 1],
      lastX: X(n - 1),
      lastY: Y(h[n - 1])
    };
  }, [user]);

  // Gauge Tick Marks
  const gaugeTicks = useMemo(() => {
    const ticks = [
      { v: 650, label: '650' },
      { v: 750, label: '750 prime' }
    ];
    return ticks.map((t) => {
      const a = Math.PI * (1 - (t.v - 300) / 600);
      const c = Math.cos(a);
      const s = Math.sin(a);
      return {
        x1: 150 + 108 * c,
        y1: 150 - 108 * s,
        x2: 150 + 116 * c,
        y2: 150 - 116 * s,
        tx: 150 + 136 * c,
        ty: 150 - 132 * s + 4,
        label: t.label
      };
    });
  }, []);

  return (
    <div className="wrap">
      {/* --- HEADER --- */}
      <header className="top">
        <div className="brand">
          <span className="logo">
            <svg className="i" style={{ width: '24px', height: '24px' }}>
              <use href="#sh" />
            </svg>
          </span>
          <div>
            <h1>Credit Assistant</h1>
            <p>Credit health for Indian borrowers</p>
          </div>
        </div>

        {/* Profile Switcher (When Logged in & Profiles Available) */}
        {user && profilesList.length > 1 && (
          <div className="profiles" aria-label="Available borrower profiles">
            {profilesList.slice(0, 4).map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={user.id === p.id}
                onClick={() => handleSwitchProfile(p.id)}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Auth status buttons */}
        <div className="auth" id="auth">
          {user ? (
            <>
              <span className="who">{user.first}</span>
              <button className="btn" data-a="edit" onClick={openEditDetails}>
                Update details
              </button>
              <button className="btn" data-a="out" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                className="btn"
                data-a="login"
                onClick={() => {
                  setGateView('login');
                  setLoginError('');
                }}
              >
                Log in
              </button>
              <button
                className="btn p"
                data-a="signup"
                onClick={() => {
                  setGateView('signup');
                  setSignupError('');
                }}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </header>

      {/* --- ACTION BAR (WHEN LOGGED IN) --- */}
      {user && (
        <div className="acts" id="acts">
          <button className="btn" id="bChat" onClick={handleOpenChat}>
            <svg className="i">
              <use href="#ms" />
            </svg>
            AI advisor chat
          </button>
          <button
            className="btn"
            id="bAudit"
            onClick={handleDownloadAuditPDF}
            disabled={isDownloadingPDF}
          >
            <svg className="i">
              <use href="#dl" />
            </svg>
            {isDownloadingPDF ? 'Generating PDF...' : 'Audit PDF'}
          </button>
          <button
            className="btn p"
            id="bConsult"
            onClick={handleTriggerAIConsult}
            disabled={isConsulting}
          >
            <svg className="i">
              <use href="#sp" />
            </svg>
            {isConsulting ? 'Consulting AI...' : 'AI consult'}
          </button>
        </div>
      )}

      {/* --- GATE SECTION (LOGIN / SIGNUP / ONBOARDING DETAILS) --- */}
      {!user && (
        <section className="gate" id="gate">
          <div>
            <h2>Know your credit health and what to fix first.</h2>
            <p className="lead">
              Tell us about your income, loans and cards. We work out your ratios, show how lenders see
              you and build a plan to reach a 750+ score.
            </p>
            <ul className="need">
              <li>Monthly income and expenses</li>
              <li>Loan EMIs, card limit and card balance</li>
              <li>Your CIBIL score, if you have it. We estimate one if you don’t</li>
            </ul>
          </div>

          <div className="card">
            {/* LOGIN FORM */}
            {gateView === 'login' && (
              <form id="f-login" onSubmit={handleLoginSubmit}>
                <h3>Log in</h3>
                <label className="f">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                </label>
                <label className="f">
                  Password
                  <input
                    name="pw"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={loginForm.pw}
                    onChange={(e) => setLoginForm({ ...loginForm, pw: e.target.value })}
                  />
                </label>
                {loginError && (
                  <p className="err" id="lerr" role="alert">
                    {loginError}
                  </p>
                )}
                <button className="btn p" style={{ justifyContent: 'center' }}>
                  Log in
                </button>
                <div className="demo">
                  <span>Demo: demo@creditassistant.in / demo1234</span>
                  <button type="button" className="lnk" id="fillDemo" onClick={handleFillDemo}>
                    Fill it in
                  </button>
                </div>
                <p>
                  New here?{' '}
                  <button
                    type="button"
                    className="lnk"
                    onClick={() => {
                      setGateView('signup');
                      setSignupError('');
                    }}
                  >
                    Sign up
                  </button>
                </p>
              </form>
            )}

            {/* SIGNUP FORM */}
            {gateView === 'signup' && (
              <form id="f-signup" onSubmit={handleSignupSubmit}>
                <h3>Create your account</h3>
                <label className="f">
                  Full name
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  />
                </label>
                <label className="f">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  />
                </label>
                <label className="f">
                  Password
                  <input
                    name="pw"
                    type="password"
                    minLength={6}
                    required
                    autoComplete="new-password"
                    value={signupForm.pw}
                    onChange={(e) => setSignupForm({ ...signupForm, pw: e.target.value })}
                  />
                  <small>At least 6 characters</small>
                </label>
                {signupError && (
                  <p className="err" id="serr" role="alert">
                    {signupError}
                  </p>
                )}
                <button className="btn p" style={{ justifyContent: 'center' }}>
                  Continue
                </button>
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="lnk"
                    onClick={() => {
                      setGateView('login');
                      setLoginError('');
                    }}
                  >
                    Log in
                  </button>
                </p>
              </form>
            )}

            {/* FINANCIAL DETAILS FORM (ONBOARDING) */}
            {gateView === 'details' && (
              <form id="f-details" onSubmit={handleDetailsSubmit}>
                <h3 id="dt">Tell us about your finances</h3>
                <div className="g2">
                  <label className="f">
                    Monthly income (₹)
                    <input
                      name="inc"
                      type="number"
                      min="1"
                      required
                      value={detailsForm.inc}
                      onChange={(e) => setDetailsForm({ ...detailsForm, inc: e.target.value })}
                    />
                  </label>
                  <label className="f">
                    Monthly expenses (₹)
                    <input
                      name="exp"
                      type="number"
                      min="0"
                      required
                      value={detailsForm.exp}
                      onChange={(e) => setDetailsForm({ ...detailsForm, exp: e.target.value })}
                    />
                  </label>
                  <label className="f">
                    Loan EMIs a month (₹)
                    <input
                      name="emi"
                      type="number"
                      min="0"
                      required
                      value={detailsForm.emi}
                      onChange={(e) => setDetailsForm({ ...detailsForm, emi: e.target.value })}
                    />
                  </label>
                  <label className="f">
                    Total card limit (₹)
                    <input
                      name="lim"
                      type="number"
                      min="1"
                      required
                      value={detailsForm.lim}
                      onChange={(e) => setDetailsForm({ ...detailsForm, lim: e.target.value })}
                    />
                  </label>
                  <label className="f">
                    Card balance owed (₹)
                    <input
                      name="bal"
                      type="number"
                      min="0"
                      required
                      value={detailsForm.bal}
                      onChange={(e) => setDetailsForm({ ...detailsForm, bal: e.target.value })}
                    />
                  </label>
                  <label className="f">
                    Missed payments in 24 months
                    <input
                      name="miss"
                      type="number"
                      min="0"
                      required
                      value={detailsForm.miss}
                      onChange={(e) => setDetailsForm({ ...detailsForm, miss: e.target.value })}
                    />
                  </label>
                  <label className="f w">
                    CIBIL score (optional)
                    <input
                      name="score"
                      type="number"
                      min="300"
                      max="900"
                      placeholder="e.g. 710"
                      value={detailsForm.score}
                      onChange={(e) => setDetailsForm({ ...detailsForm, score: e.target.value })}
                    />
                    <small>
                      Find it in your latest CIBIL report. Leave it blank and we will estimate it from
                      your details.
                    </small>
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button className="btn p">See my credit health</button>
                  <button
                    type="button"
                    className="btn"
                    id="dCancel"
                    onClick={() => setGateView('login')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      )}

      {/* --- EDIT DETAILS MODAL / SCREEN (WHEN LOGGED IN) --- */}
      {user && isEditing && (
        <section className="card" style={{ maxWidth: '640px', margin: '20px auto 40px' }}>
          <form id="f-details" onSubmit={handleDetailsSubmit}>
            <h3 id="dt">Update your details</h3>
            <div className="g2">
              <label className="f">
                Monthly income (₹)
                <input
                  name="inc"
                  type="number"
                  min="1"
                  required
                  value={detailsForm.inc}
                  onChange={(e) => setDetailsForm({ ...detailsForm, inc: e.target.value })}
                />
              </label>
              <label className="f">
                Monthly expenses (₹)
                <input
                  name="exp"
                  type="number"
                  min="0"
                  required
                  value={detailsForm.exp}
                  onChange={(e) => setDetailsForm({ ...detailsForm, exp: e.target.value })}
                />
              </label>
              <label className="f">
                Loan EMIs a month (₹)
                <input
                  name="emi"
                  type="number"
                  min="0"
                  required
                  value={detailsForm.emi}
                  onChange={(e) => setDetailsForm({ ...detailsForm, emi: e.target.value })}
                />
              </label>
              <label className="f">
                Total card limit (₹)
                <input
                  name="lim"
                  type="number"
                  min="1"
                  required
                  value={detailsForm.lim}
                  onChange={(e) => setDetailsForm({ ...detailsForm, lim: e.target.value })}
                />
              </label>
              <label className="f">
                Card balance owed (₹)
                <input
                  name="bal"
                  type="number"
                  min="0"
                  required
                  value={detailsForm.bal}
                  onChange={(e) => setDetailsForm({ ...detailsForm, bal: e.target.value })}
                />
              </label>
              <label className="f">
                Missed payments in 24 months
                <input
                  name="miss"
                  type="number"
                  min="0"
                  required
                  value={detailsForm.miss}
                  onChange={(e) => setDetailsForm({ ...detailsForm, miss: e.target.value })}
                />
              </label>
              <label className="f w">
                CIBIL score (optional)
                <input
                  name="score"
                  type="number"
                  min="300"
                  max="900"
                  placeholder="300-900"
                  value={detailsForm.score}
                  onChange={(e) => setDetailsForm({ ...detailsForm, score: e.target.value })}
                />
                <small>Find it in your latest CIBIL report, or leave blank to calculate.</small>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button className="btn p">Save changes</button>
              <button type="button" className="btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* --- MAIN DASHBOARD (WHEN LOGGED IN & NOT EDITING) --- */}
      {user && !isEditing && (
        <main id="app">
          {/* HERO SECTION */}
          <section className="hero" aria-label="Score summary">
            {/* Score Card with Gauge */}
            <div className="score">
              <div className="sc-h">
                <span>CIBIL score</span>
                <span className={`pill t-${tierColor}`} id="tier">
                  {tierName}
                </span>
              </div>
              <div className="gw">
                <svg
                  className="gauge"
                  viewBox="0 0 300 165"
                  role="img"
                  aria-label="Score gauge from 300 to 900"
                >
                  <path
                    d="M30 150A120 120 0 0 1 270 150"
                    pathLength="100"
                    fill="none"
                    stroke="rgba(255,255,255,.14)"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  <path
                    id="fg"
                    d="M30 150A120 120 0 0 1 270 150"
                    pathLength="100"
                    fill="none"
                    stroke="#6C9BFF"
                    strokeWidth="14"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: `${Math.max(0, Math.min(100, (displayScore - 300) / 6))} 100`
                    }}
                  />
                  <g id="tks">
                    {gaugeTicks.map((t, idx) => (
                      <React.Fragment key={idx}>
                        <line
                          x1={t.x1}
                          y1={t.y1}
                          x2={t.x2}
                          y2={t.y2}
                          stroke="rgba(255,255,255,.55)"
                          strokeWidth="2"
                        />
                        <text className="tk" textAnchor="middle" x={t.tx} y={t.ty}>
                          {t.label}
                        </text>
                      </React.Fragment>
                    ))}
                  </g>
                </svg>
                <div className="num">
                  <b id="n">{displayScore}</b>
                  <span>/ 900</span>
                </div>
              </div>
              <p id="tnote">
                {scoreNoteMap[tierName]}
                {user.est &&
                  ' This score is estimated from your details. Add the score from your CIBIL report for an exact reading.'}
              </p>
            </div>

            {/* Side Metrics */}
            <div className="side">
              <h2 id="hl">
                {scoreGap > 0
                  ? `${user.first}, you’re ${scoreGap} points from prime rates.`
                  : `${user.first}, you’re in the prime tier.`}
              </h2>
              <p className="lead" id="lead">
                {scoreGap > 0
                  ? `Most of the gap comes from ${
                      curUtil > 30
                        ? 'card utilization'
                        : user.miss
                        ? 'missed payments'
                        : 'credit history length'
                    }. The roadmap below shows what to do first.`
                  : 'Lenders will offer you their best pricing. Protect the score with the habits below.'}
              </p>

              <dl className="metrics" id="metrics">
                <div>
                  <dt>Monthly income</dt>
                  <dd className="big">{INR(user.inc)}</dd>
                  <small></small>
                </div>
                <div>
                  <dt>Monthly expenses</dt>
                  <dd className="big">{INR(user.exp)}</dd>
                  <small></small>
                </div>
                <div>
                  <dt>Loan EMIs</dt>
                  <dd className="big">{INR(user.emi)}</dd>
                  <small></small>
                </div>
                <div>
                  <dt>FOIR</dt>
                  <dd className={`big ${curFoir > 40 ? 'c-rd' : 'c-gr'}`}>{curFoir.toFixed(1)}%</dd>
                  <small>Safe under 40%</small>
                </div>
                <div>
                  <dt>Card utilization</dt>
                  <dd className={`big ${curUtil > 30 ? 'c-rd' : 'c-gr'}`}>{curUtil.toFixed(1)}%</dd>
                  <small>Safe under 30%</small>
                </div>
              </dl>
            </div>
          </section>

          {/* TABS NAVIGATION */}
          <div className="tabs" role="tablist" id="tabs">
            <button
              role="tab"
              data-t="roadmap"
              aria-selected={activeTab === 'roadmap'}
              onClick={() => setActiveTab('roadmap')}
            >
              5-step roadmap
            </button>
            <button
              role="tab"
              data-t="history"
              aria-selected={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
            >
              Score history
            </button>
            <button
              role="tab"
              data-t="sim"
              aria-selected={activeTab === 'sim'}
              onClick={() => setActiveTab('sim')}
            >
              What-if simulator
            </button>
            <button
              role="tab"
              data-t="std"
              aria-selected={activeTab === 'std'}
              onClick={() => setActiveTab('std')}
            >
              Indian banking and RBI standards
            </button>
          </div>

          {/* TAB 1: 5-STEP ROADMAP */}
          <section id="t-roadmap" className={`panel ${activeTab === 'roadmap' ? 'on' : ''}`}>
            <div className="assess">
              <h3>Financial health assessment</h3>
              <p id="exec">
                {aiAnalysis?.executive_summary ||
                  `${user.name}’s credit score is ${user.score} (${tierName}). ${
                    curUtil > 30 || curFoir > 40 || user.miss
                      ? 'Elevated debt ratios and payment history currently trigger caution flags for Tier-1 lenders such as HDFC, SBI and ICICI.'
                      : 'Your ratios sit comfortably inside the limits Tier-1 lenders such as HDFC, SBI and ICICI look for.'
                  }`}
              </p>
              <p id="fx">
                {aiAnalysis?.score_analysis ||
                  `At ${user.score}, lenders see ${
                    tierColor === 'rd'
                      ? 'moderate risk and charge higher interest spreads on unsecured loans'
                      : tierColor === 'am'
                      ? 'acceptable risk and may add a premium to unsecured loans'
                      : 'low risk and price loans competitively'
                  }.`}
              </p>
            </div>

            <h3 className="sub">What is holding your score back</h3>
            <div id="bn" className="bn">
              {aiAnalysis?.bottlenecks?.length ? (
                aiAnalysis.bottlenecks.map((b, i) => <div key={i}>{b}</div>)
              ) : curUtil > 30 || user.miss || curFoir > 40 ? (
                <>
                  {curUtil > 30 && (
                    <div>
                      Card utilization is {curUtil.toFixed(1)}%, well above the RBI-recommended safe
                      ceiling of 30%.
                    </div>
                  )}
                  {user.miss > 0 && (
                    <div>
                      {user.miss} missed payment{user.miss > 1 ? 's are' : ' is'} logged in bureau records,
                      dragging down payment history.
                    </div>
                  )}
                  {curFoir > 40 && (
                    <div>FOIR is {curFoir.toFixed(1)}%, above the 40% threshold most banks accept.</div>
                  )}
                </>
              ) : (
                <div className="ok">
                  Nothing is flagged. Keep utilization under 30% and pay every bill on time.
                </div>
              )}
            </div>

            <div className="rh">
              <h3 className="sub">Your recovery plan</h3>
              <span className="goal">Goal: 750+ prime tier</span>
            </div>

            <ol id="steps" className="steps">
              {activeRoadmap.map((s, idx) => (
                <li key={idx}>
                  <i>{s.step_number || idx + 1}</i>
                  <div className="st">
                    <header>
                      <h3>{s.title}</h3>
                      <span className="when">{s.timeline}</span>
                    </header>
                    <p>{s.action}</p>
                    <div className="two">
                      <span className="imp">{s.impact}</span>
                      <span className="std">{s.indian_context || s.rbi_norm || ''}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* TAB 2: SCORE HISTORY */}
          <section id="t-history" className={`panel ${activeTab === 'history' ? 'on' : ''}`}>
            <div className="cols">
              <div className="card">
                <h3>Score history</h3>
                {chartSvgContent && (
                  <svg id="chart" className="chart" viewBox="0 0 640 270">
                    {/* Dotted target line at 750 */}
                    <line
                      x1="40"
                      x2="620"
                      y1={chartSvgContent.y750}
                      y2={chartSvgContent.y750}
                      stroke="var(--gr)"
                      strokeDasharray="6 5"
                      strokeWidth="2"
                    />
                    <text
                      x="620"
                      y={chartSvgContent.y750 - 8}
                      textAnchor="end"
                      style={{ fill: 'var(--gr)', fontSize: '12px', fontWeight: 600 }}
                    >
                      750 prime target
                    </text>

                    {/* Score polyline */}
                    <path
                      d={chartSvgContent.pathD}
                      fill="none"
                      stroke="var(--bl)"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />

                    {/* Circles & Labels */}
                    {chartSvgContent.points.map((pt, i) => (
                      <g key={i}>
                        <circle
                          cx={pt.cx}
                          cy={pt.cy}
                          r={pt.isLast ? 7 : 4}
                          fill={pt.isLast ? 'var(--bl)' : 'var(--sf)'}
                          stroke="var(--bl)"
                          strokeWidth="2"
                        />
                        <text x={pt.cx} y="258" textAnchor="middle">
                          {pt.label}
                        </text>
                      </g>
                    ))}

                    {/* Latest score floating tag */}
                    <text
                      x={chartSvgContent.lastX}
                      y={chartSvgContent.lastY - 14}
                      textAnchor="middle"
                      style={{ fill: 'var(--ink)', fontWeight: 700, fontSize: '14px' }}
                    >
                      {chartSvgContent.lastScore}
                    </text>
                  </svg>
                )}
                {(!user.hist || user.hist.length < 2) && (
                  <p style={{ textAlign: 'center', color: 'var(--mut)', marginTop: '12px' }}>
                    Your history builds each time you update your details or apply a simulation.
                  </p>
                )}
              </div>

              <div className="card">
                <h3>What the bureau weighs</h3>
                <div className="fac">
                  <span>Payment history</span>
                  <span>35%</span>
                  <div className="bar">
                    <i style={{ width: '35%' }}></i>
                  </div>
                </div>
                <div className="fac">
                  <span>Credit utilization</span>
                  <span>30%</span>
                  <div className="bar">
                    <i style={{ width: '30%' }}></i>
                  </div>
                </div>
                <div className="fac">
                  <span>Credit age and vintage</span>
                  <span>15%</span>
                  <div className="bar">
                    <i style={{ width: '15%' }}></i>
                  </div>
                </div>
                <div className="fac">
                  <span>Credit mix</span>
                  <span>10%</span>
                  <div className="bar">
                    <i style={{ width: '10%' }}></i>
                  </div>
                </div>
                <div className="fac">
                  <span>New inquiries</span>
                  <span>10%</span>
                  <div className="bar">
                    <i style={{ width: '10%' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TAB 3: WHAT-IF SIMULATOR */}
          <section id="t-sim" className={`panel ${activeTab === 'sim' ? 'on' : ''}`}>
            <div className="cols">
              <div className="card">
                <h3>Try a change before you make it</h3>
                <div id="sliders">
                  {/* Slider 1: Pay down card balance */}
                  <div className="sl">
                    <label htmlFor="s-pay">
                      Pay down card balance
                      <output id="o-pay">{INR(simPay)}</output>
                    </label>
                    <input
                      type="range"
                      id="s-pay"
                      min="0"
                      max={user.bal}
                      step="1000"
                      value={simPay}
                      onChange={(e) => setSimPay(Number(e.target.value))}
                    />
                  </div>

                  {/* Slider 2: Raise card limit */}
                  <div className="sl">
                    <label htmlFor="s-inc">
                      Raise card limit
                      <output id="o-inc">+{simInc}%</output>
                    </label>
                    <input
                      type="range"
                      id="s-inc"
                      min="0"
                      max="50"
                      step="5"
                      value={simInc}
                      onChange={(e) => setSimInc(Number(e.target.value))}
                    />
                  </div>

                  {/* Slider 3: Months of on-time payments */}
                  <div className="sl">
                    <label htmlFor="s-mon">
                      Months of on-time payments
                      <output id="o-mon">{simMon} mo</output>
                    </label>
                    <input
                      type="range"
                      id="s-mon"
                      min="0"
                      max="12"
                      step="1"
                      value={simMon}
                      onChange={(e) => setSimMon(Number(e.target.value))}
                    />
                  </div>

                  {/* Slider 4: Reduce loan EMI */}
                  <div className="sl">
                    <label htmlFor="s-emi">
                      Reduce loan EMI
                      <output id="o-emi">{INR(simEmi)}</output>
                    </label>
                    <input
                      type="range"
                      id="s-emi"
                      min="0"
                      max={user.emi}
                      step="500"
                      value={simEmi}
                      onChange={(e) => setSimEmi(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Projected score</h3>
                <div className="proj">
                  <span className="big" id="pj">
                    {simResult.pr}
                  </span>
                  <span className="delta" id="dl">
                    {simResult.delta >= 0 ? `+${simResult.delta}` : simResult.delta} points
                  </span>
                </div>

                {/* Visual score track */}
                <div className="track" id="trk">
                  <div
                    className="f"
                    id="tf"
                    style={{
                      left: `${Math.max(0, (user.score - 300) / 6)}%`,
                      width: `${Math.max(0, (simResult.pr - user.score) / 6)}%`
                    }}
                  ></div>
                  <div
                    className="mk"
                    id="mc"
                    style={{ left: `${Math.max(0, (user.score - 300) / 6)}%` }}
                  >
                    <em>Now</em>
                  </div>
                  <div className="mk g" id="mg" style={{ left: '75%' }}>
                    <em>750</em>
                  </div>
                </div>

                <div className="stats" id="stats">
                  <div>
                    <span>Card utilization</span>
                    <b>
                      {simResult.oldUtil.toFixed(1)}% to {simResult.newUtil.toFixed(1)}%
                    </b>
                  </div>
                  <div>
                    <span>FOIR</span>
                    <b>
                      {simResult.oldFoir.toFixed(1)}% to {simResult.newFoir.toFixed(1)}%
                    </b>
                  </div>
                  <div>
                    <span>Card interest saved a year</span>
                    <b>{INR(simResult.savedInterest)}</b>
                  </div>
                </div>

                <button className="btn p" id="apply" onClick={handleApplySimulation}>
                  <svg className="i">
                    <use href="#sp" />
                  </svg>
                  Apply to profile
                </button>
              </div>
            </div>
          </section>

          {/* TAB 4: INDIAN BANKING & RBI STANDARDS */}
          <section id="t-std" className={`panel ${activeTab === 'std' ? 'on' : ''}`}>
            <div className="cols">
              <div className="card">
                <h3>Score bands lenders use</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Band</th>
                      <th>Score</th>
                      <th>What lenders do</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Poor</td>
                      <td>Below 650</td>
                      <td>Higher rates, closer scrutiny on large loans</td>
                    </tr>
                    <tr>
                      <td>Fair</td>
                      <td>650 to 699</td>
                      <td>Approval likely, with a risk premium</td>
                    </tr>
                    <tr>
                      <td>Good</td>
                      <td>700 to 749</td>
                      <td>Competitive rates on most products</td>
                    </tr>
                    <tr>
                      <td>Excellent</td>
                      <td>750 to 900</td>
                      <td>Pre-approved offers and prime pricing</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="card">
                <h3>Rules worth knowing</h3>
                <ul className="rules">
                  <li>Keep card utilization under 30% of your limit.</li>
                  <li>Banks usually cap FOIR at 40 to 50% of income.</li>
                  <li>Bureaus must resolve reported disputes within 30 days.</li>
                  <li>An e-NACH auto-debit mandate prevents 30 and 60 day late marks.</li>
                  <li>Paying only the minimum due leaves interest at about 42% APR.</li>
                </ul>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* --- AI ADVISOR CHAT DRAWER --- */}
      <aside className={`drawer ${isChatOpen ? 'on' : ''}`} id="drawer" aria-label="AI advisor chat">
        <div className="dh">
          <h3>AI advisor</h3>
          <button
            className="btn"
            id="cX"
            aria-label="Close chat"
            style={{ padding: '6px' }}
            onClick={() => setIsChatOpen(false)}
          >
            <svg className="i">
              <use href="#x" />
            </svg>
          </button>
        </div>

        <div className="msgs" id="msgs">
          {chatMessages.map((m) => (
            <div key={m.id} className={`m ${m.role}`}>
              {m.text}
            </div>
          ))}
          {isChatLoading && <div className="m a">Consulting advisor insights...</div>}
          <div ref={msgsEndRef} />
        </div>

        <form
          className="cf"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendChat();
          }}
        >
          <input
            id="ci"
            placeholder="Ask about your score"
            aria-label="Message"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button className="btn p" id="cS" aria-label="Send">
            <svg className="i">
              <use href="#sd" />
            </svg>
          </button>
        </form>
      </aside>

      {/* --- TOAST NOTIFICATION --- */}
      <div id="toast" role="status" className={toastActive ? 'on' : ''}>
        {toastText}
      </div>
    </div>
  );
}

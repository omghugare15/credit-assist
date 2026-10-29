# Credit Assistant — Official Demo Video Recording Script
## Duration: 3 to 4 Minutes (Target: ~3:30)

> **Recording Advice & Teleprompter Guide:**
> - **Screen Resolution:** 1080p (1920x1080) or 2K.
> - **Browser Setup:** Chrome/Brave in Full Screen (Press `F11`), zoom level at 100% or 110%.
> - **Pre-recording Check:** Make sure backend (`py -m uvicorn backend.main:app --port 8000`) and frontend (`npm run dev`) are running, and database is seeded.
> - **Pacing:** Speak naturally, with confidence and energy. Pause for half a second after each click so the viewer can observe the UI transition.

---

### ⏱️ Timeline Overview

| Section | Timestamp | Focus / Feature Highlighted |
|---|---|---|
| **Scene 1** | `0:00 - 0:30` (30s) | Problem Hook, Indian Credit Landscape & Platform Introduction |
| **Scene 2** | `0:30 - 1:15` (45s) | Executive Dashboard, Score Gauge & Indian Banking Ratios (FOIR/CUR) |
| **Scene 3** | `1:15 - 2:00` (45s) | Groq AI Consultation Engine, 5-Step Indian Roadmap & Live Chat Drawer |
| **Scene 4** | `2:00 - 2:45` (45s) | What-If Simulation Engine, 42% APR Interest Savings & Live Commit |
| **Scene 5** | `2:45 - 3:15` (30s) | Official Multi-Page ReportLab PDF Audit Generation & Architecture |
| **Scene 6** | `3:15 - 3:35` (20s) | Automated Test Suite Verification & Conclusion |

---

## 🎬 Detailed Step-by-Step Script

---

### Scene 1: Introduction & Problem Context (0:00 – 0:30)
**Visual Action on Screen:**  
- Start on the Credit Assistant dashboard with **Rahul Sharma** selected.
- Cursor hovers gently over the header title and the CIBIL score gauge (`648 - Fair Tier`).

**Spoken Script (Voiceover):**  
> *"Hello everyone! In India, your credit score isn't just a number—it dictates whether your home loan gets approved, how much interest you pay, and your overall financial mobility.*  
>  
> *Yet, millions of Indian borrowers face opaque bureau scoring, high debt obligation ratios known as FOIR, and crippling revolving credit card interest rates compounding at over 42% per year.*  
>  
> *Welcome to **Credit Assistant**—an enterprise-grade, full-stack AI-driven credit intelligence and health platform built specifically for the Indian banking and lending ecosystem governed by RBI, TransUnion CIBIL, and Experian India."*

---

### Scene 2: Dashboard Overview & Financial Health Metrics (0:30 – 1:15)
**Visual Action on Screen:**  
- Point the cursor to the **Score Gauge** (648 Fair) and the **750 Prime Target Line**.
- Scroll slightly down to showcase the **Metric Cards**:
  - Point to **Monthly Income** (`₹85,000`).
  - Point to **FOIR / DTI Ratio** card (`68.0% - High Risk`).
  - Point to **Credit Card Utilization** card (`68.0%` with the 30% golden threshold indicator).
- Click on the user dropdown in the header to briefly show other seeded borrowers (**Priya Patel - 742 Good**, **Amit Verma - 575 Poor**), then switch back to Rahul Sharma.

**Spoken Script (Voiceover):**  
> *"Let's take a look at our current borrower, Rahul Sharma. His CIBIL score is currently 648, placing him in the Fair tier—just short of the prime 750 milestone.*  
>  
> *Looking at his live diagnostic metrics, our algorithmic engine immediately calculates two critical ratios used by Indian banks:*  
> *First, his **Fixed Obligation to Income Ratio (FOIR)** is sitting at 68%, far above the RBI-recommended 40 to 50% ceiling. Notice how our formula adheres to Indian underwriting by imputing a mandatory 5% minimum monthly payment on his revolving card balances.*  
>  
> *Second, his **Credit Card Utilization** is at 68%, substantially breaching the CIBIL golden threshold of 30%. This single bottleneck is actively dragging down his credit score every reporting cycle."*

---

### Scene 3: Groq AI Consultation Engine & Live Advisor Chat (1:15 – 2:00)
**Visual Action on Screen:**  
- Click on the **"AI Credit Roadmap"** tab.
- Scroll down smoothly through the **Executive Summary** and the **Sequential 5-Step Recovery Roadmap**.
- Point out Step 1 (*CIBIL CIR Dispute*), Step 3 (*e-NACH Auto-Debit*), and Step 4 (*Debt Avalanche on 42% APR balances*).
- Click the **"Ask AI Advisor"** floating button or header button to slide out the **AIChatDrawer**.
- Type (or click a sample question): *"How can I bring my utilization below 30% quickly?"*
- Show the low-latency response from Groq AI answering with Rahul's exact numbers. Close the drawer.

**Spoken Script (Voiceover):**  
> *"Instead of generic financial truisms, Credit Assistant integrates directly with **Groq Cloud AI**, leveraging high-speed LLaMA and Qwen reasoning models.*  
>  
> *In under two seconds, the AI analyzes Rahul's profile and formulates a customized, sequential 5-step recovery roadmap codified specifically for Indian banking reality.*  
> *It outlines filing a CIBIL Credit Information Report (CIR) dispute for delayed reporting, establishing e-NACH auto-debit mandates to permanently eliminate 30 and 60-day past-due marks, and applying a debt avalanche to eradicate high-APR card debt.*  
>  
> *Borrowers can also open the interactive **AI Advisor Drawer** at any time to converse in real-time. The AI has immediate context of Rahul's exact income and loan EMIs, delivering hyper-personalized consultation."*

---

### Scene 4: What-If Real-Time Credit Score Simulator (2:00 – 2:45)
**Visual Action on Screen:**  
- Click on the **"Credit Simulator"** tab.
- Slowly drag the **"Credit Card Balance Repayment"** slider from `₹0` to `₹50,000`.
- Watch the live **Projected Score** dynamically increment (e.g., from 648 to 685, `+37 pts`).
- Drag the **"On-Time Payment Seasoning"** slider to `6 months`—watch the score surge past 700!
- Highlight the **"Compounding Interest Saved"** card showing real liquidity savings (`₹10,000+` saved).
- Click the blue **"Apply Improvements to Profile"** button.
- **Enjoy the Confetti!** Point out how the main dashboard gauge and history chart immediately update with the newly simulated profile.

**Spoken Script (Voiceover):**  
> *"Now, here is one of the most powerful features: the **Real-Time What-If Credit Simulator**.*  
> *Borrowers often wonder: 'If I pay off 50,000 rupees on my credit card, how much will my CIBIL score actually improve?'*  
>  
> *Let's test it live. As I drag the card repayment slider to ₹50,000, our reactive math engine projects an instant +37 point score increase in under 15 milliseconds.*  
> *Next, let's add 6 months of unbroken on-time payment seasoning—Rahul crosses into the 700+ Good tier!*  
>  
> *Even better, our engine calculates avoided compound interest, showing Rahul that paying this down prevents over ₹10,500 from draining into 42% annualized card charges.*  
>  
> *When Rahul is ready, he clicks **Apply Improvements**—and with a celebratory milestone trigger, the changes are committed directly to our database as a new historical checkpoint!"*

---

### Scene 5: Official ReportLab PDF Audit & System Architecture (2:45 – 3:15)
**Visual Action on Screen:**  
- Scroll to the top and click **"Download Credit Audit Report (PDF)"**.
- The PDF opens or downloads instantly. Open it and scroll through Pages 1 and 2:
  - Show the dynamic color-coded Score Tier Badge.
  - Show the Bureau Benchmark Matrix, Diagnostic Risk Flags, and statutory RBI compliance disclaimers.
- Return to the browser and click the **"Architecture & Flow"** button in the header to open the modal.
- Point out the React 18, FastAPI, Groq AI, and SQLAlchemy pipeline.

**Spoken Script (Voiceover):**  
> *"For official credit applications, Credit Assistant features a built-in vector document engine powered by **ReportLab**.*  
> *With a single click, it compiles a multi-page **Official Credit Health & Audit Report**.*  
> *It features institutional score tier indicators, risk matrices, the 5-step roadmap, and mandatory RBI Fair Practices Code compliance disclaimers.*  
>  
> *Under the hood, the system is powered by a high-throughput **FastAPI** asynchronous core, **React 18** on Vite with Tailwind and Lucide iconography, **SQLAlchemy 2.0 ORM**, and low-latency **Groq Cloud LPU** acceleration."*

---

### Scene 6: Verification & Conclusion (3:15 – 3:35)
**Visual Action on Screen:**  
- Switch briefly to terminal or show test suite screenshot / `test_e2e.py` passing:
  `ALL 8 END-TO-END INTEGRATION TESTS PASSED (100% OK)`.
- Return to the beautiful main dashboard.

**Spoken Script (Voiceover):**  
> *"The entire platform is backed by a comprehensive end-to-end automated test suite covering all 8 core API services—from diagnostic latency probes to PDF compilation and AI reasoning.*  
>  
> *Credit Assistant empowers borrowers with transparency, pre-emptive simulation, and actionable intelligence to take full control of their credit health.*  
>  
> *Thank you for watching, and feel free to explore the full source code and documentation in our repository!"*

---

## 🎯 Pro Recording Checklist

1. **Before Starting:**
   - [ ] Run `py -m uvicorn backend.main:app --port 8000` in Terminal 1.
   - [ ] Run `npm run dev` in Terminal 2.
   - [ ] Open `http://localhost:5173` in your browser.
   - [ ] Test the **Simulator slider** and **Confetti** once to make sure browser animation runs smoothly.
   - [ ] Click **Download PDF** once to ensure your browser allows downloads/popups without prompting.
2. **Audio Setup:**
   - Use a clear microphone; maintain consistent volume.
   - Speak with an encouraging, professional, and confident cadence.
3. **Cursor Movement:**
   - Move your mouse smoothly; avoid rapid random hovering.
   - Pause for 1 second on key cards (e.g. FOIR 68%, Confetti, PDF generation).

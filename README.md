# Credit Assistant — Full-Stack AI Credit Intelligence Platform (India)

**Credit Assistant** is a full-stack, AI-driven financial platform designed to diagnose, track, and optimize credit health within the Indian financial ecosystem (TransUnion CIBIL, Experian India, and RBI regulatory guidelines).

Built with **FastAPI (Python)**, **React.js + Vite**, **Groq AI (Qwen 3.8 / LLaMA reasoning)**, **ReportLab PDF Service**, and **SQLite / SQLAlchemy**.

---

## 🏛️ System Architecture Flow (`flow.png`)

```
[User]
   │
   ▼
[Web Frontend (React.js / Vite)]
   ▲                     │
   │  JSON Responses     │  HTTP / JSON Requests
   │                     ▼
┌──────────────────────────────────────────────┐
│           FastAPI Backend (Python)           │
└──────┬─────────────┬─────────────┬───────────┘
       │             │             │
       ▼             ▼             ▼
  [Database]    [AI Engine]   [PDF Generation]
  (SQLite /      (Groq API /     (ReportLab)
  SQLAlchemy)     Qwen 3.8)            │
       │             │                 │
       │             │                 ▼
       ▼             ▼            Generated PDF
  Query Results  AI Roadmap &     (Credit Audit Report)
                 Analysis
```

---

## 🎯 Implementation of the 4 Scenarios (`instruction.txt`)

### 1. Scenario 1: User Onboarding & Initial Assessment
- New borrower registers with personal details, income, expenses, credit limit, and current score.
- Backend immediately calculates **Debt-to-Income / FOIR Ratio** and **Credit Utilization Ratio** according to Indian banking standards.
- Persists user profile and creates initial baseline checkpoint in the database.

### 2. Scenario 2: AI-Powered Financial Consultation
- User triggers AI Advisor from the dashboard.
- Sends financial data to **Groq AI Engine** using the provided API key.
- Groq AI evaluates credit bottlenecks and generates an **executive summary** and a **5-step actionable roadmap tailored to Indian banking** (e.g. CIBIL CIR dispute process, 30% utilization cap, e-NACH mandates, and debt avalanche).
- Users can also chat in real-time with the **AI Credit Advisor drawer**.

### 3. Scenario 3: Progress Tracking via Data Visualization
- Renders an interactive **CIBIL Score Trajectory Line Chart** mapping historical improvements over months.
- Visualizes the impact of disciplined financial habits with data point tooltips and the **750 Prime Milestone Target Line**.
- Displays Indian credit bureau factor weightage breakdown (Payment History 35%, Utilization 30%, Credit Age 15%, Mix 10%, Inquiries 10%).

### 4. Scenario 4: Real-time Credit Health Monitoring & What-If Simulator
- Interactive **Credit Score Simulator** with sliders for:
  - Paying down credit card balance
  - Closing personal loan EMIs
  - Requesting credit limit enhancements
  - Seasoning on-time payment track record
- Recalculates projected score with a live `+XX PTS` delta chip, updated utilization, and DTI.
- **"Apply Improvements to Profile"** button commits changes to the database and records a new historical checkpoint with confetti celebration.

---

## 📄 PDF Generation Service (flow.png)
- Dedicated endpoint `GET /api/report/pdf/{user_id}` powered by **ReportLab**.
- Generates a styled, multi-page **Official Credit Health & Audit Report** containing:
  - Borrower credentials & generation timestamp
  - Credit score badge & tier assessment
  - Financial health metrics & benchmark comparison table
  - Identified financial bottleneck flags
  - Sequential 5-step Indian banking roadmap
  - RBI compliance & disclaimer note.

---

## 🚀 Running the Project Locally

### 1. Backend (FastAPI)
```powershell
# Run the FastAPI server on port 8000
py -m uvicorn backend.main:app --port 8000
```
- API Base URL: `http://127.0.0.1:8000`
- API Documentation: `http://127.0.0.1:8000/docs`

### 2. Frontend (React.js / Vite)
```powershell
cd frontend
npm run dev
```
- Frontend Dev URL: `http://localhost:5173`
- Pre-configured Vite reverse proxy seamlessly routes `/api` requests to port `8000`.

### 3. Automated End-to-End Test Suite
```powershell
py test_e2e.py
```
Validates all 4 scenarios, Groq AI responses, PDF generation, and database persistence in one run.

---

## ☁️ Deploying on Vercel

The repository is fully pre-configured for full-stack Vercel deployment using **Serverless Python Functions** (`api/index.py`) and a **Vite React Frontend** (`frontend/dist`).

### Option A: Via GitHub (Recommended)
1. Initialize git and push this repo to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Credit Assistant initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Open [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   - `GROQ_API_KEY`: `<your-groq-api-key>`
   - *(Optional)* `DATABASE_URL`: Your Supabase / PostgreSQL connection string if persistent multi-user database is desired. If omitted, it automatically falls back to `/tmp/credit_assistant.db`.

5. Click **"Deploy"**! Vercel will build the frontend and serve both the SPA and FastAPI routes under a single unified domain.

### Option B: Via Vercel CLI
```bash
npx vercel
```
Follow the interactive prompts to link your project and deploy to preview or production (`npx vercel --prod`).


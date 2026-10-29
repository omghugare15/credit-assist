# Credit Assistant — AI-Driven Credit Intelligence & Health Platform

**Credit Assistant** is a full-stack financial intelligence platform engineered specifically for the **Indian credit and banking ecosystem** (governed by TransUnion CIBIL, Experian India, and RBI regulatory guidelines). The platform analyzes borrower financial profiles, computes critical risk ratios, provides real-time credit score simulations, generates actionable AI advisory roadmaps, and produces official multi-page credit audit reports.

[![Demo Video](https://img.shields.io/badge/Demo_Video-Google_Drive-FF5722?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/drive/folders/16D-9sqAK9aAXcug44KLtbovuMejPwFYq?usp=sharing)
[![Project Documentation](https://img.shields.io/badge/Project_Document-Google_Drive-4285F4?style=for-the-badge&logo=googledocs&logoColor=white)](https://drive.google.com/drive/folders/16D-9sqAK9aAXcug44KLtbovuMejPwFYq?usp=sharing)

---

## 📌 Table of Contents
- [Executive Overview](#-executive-overview)
- [Demo Video & Project Documentation](#-demo-video--project-documentation)
- [System Architecture](#-system-architecture)
- [Core Features & Scenarios](#-core-features--scenarios)
  - [1. Borrower Onboarding & Baseline Assessment](#1-borrower-onboarding--baseline-assessment)
  - [2. AI Credit Advisor & Consultation Engine](#2-ai-credit-advisor--consultation-engine)
  - [3. Historical Progression & Bureau Visualization](#3-historical-progression--bureau-visualization)
  - [4. Real-Time What-If Credit Score Simulator](#4-real-time-what-if-credit-score-simulator)
  - [5. Official Credit Audit PDF Generation Service](#5-official-credit-audit-pdf-generation-service)
  - [6. Continuous Health & Diagnostic Monitoring](#6-continuous-health--diagnostic-monitoring)
- [Financial Formulas & Algorithmic Engine](#-financial-formulas--algorithmic-engine)
- [API Reference](#-api-reference)
- [Database Schema & Entity Relationships](#-database-schema--entity-relationships)
- [Technology Stack](#-technology-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Local Development & Verification](#-local-development--verification)

---

## 🎥 Demo Video & Project Documentation

Access the complete walk-through demo video and detailed project documentation hosted on Google Drive:

| Resource | Description | Direct Access |
|---|---|---|
| 🎬 **Platform Demo Video** | Live walk-through showcasing borrower onboarding, What-If credit simulation, Groq AI consultation, and dynamic PDF audit report generation. | [Watch Video on Google Drive ↗](https://drive.google.com/drive/folders/16D-9sqAK9aAXcug44KLtbovuMejPwFYq?usp=sharing) |
| 📄 **Project Documentation (PDF)** | Official 5-page publication-grade engineering report with architecture schemas, mathematical models (FOIR/CUR), API specs, and test results. | [View on Google Drive ↗](https://drive.google.com/drive/folders/16D-9sqAK9aAXcug44KLtbovuMejPwFYq?usp=sharing) · [Local File (PDF)](./Credit_Assistant_Project_Documentation.pdf) |


---
---

## 🏛️ Executive Overview

In the Indian lending ecosystem, credit scores (ranging from 300 to 900) directly dictate loan approvals, interest rates, and financial mobility. Borrowers frequently face:
1. **Opaque Bureau Reporting**: A lack of transparency on how credit card utilization, active loan counts, and repayment delays degrade CIBIL scores.
2. **Elevated Debt Obligations (FOIR)**: Inability to gauge whether their Fixed Obligation to Income Ratio (FOIR) exceeds the standard 40-50% threshold mandated by Indian public and private sector banks.
3. **Generic Advice**: Financial tips that fail to incorporate Indian regulatory mechanisms such as CIBIL CIR dispute resolutions, e-NACH auto-debit mandates, and RBI-mandated settlement impacts.

**Credit Assistant** bridges this gap by combining algorithmic financial modeling, Groq-accelerated AI reasoning, and a high-performance interactive interface to deliver institution-grade credit health analysis.

---

## 🏗️ System Architecture

```
                                   ┌───────────────────────────┐
                                   │      React 18 + Vite      │
                                   │   Interactive Dashboard   │
                                   └─────────────┬─────────────┘
                                                 │
                                                 │ HTTP / REST (JSON)
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   FastAPI Application Core                                  │
│                                                                                             │
│  ┌───────────────────────┐  ┌────────────────────────┐  ┌────────────────────────────────┐  │
│  │  Financial Calculator │  │   Groq AI Engine       │  │   ReportLab PDF Engine         │  │
│  │  • FOIR / DTI Ratios  │  │   • Qwen 3.8 / LLaMA   │  │   • Multi-Page Audit Reports   │  │
│  │  • Utilization Capping│  │   • 5-Step Roadmap     │  │   • Compliance Badges          │  │
│  │  • Bureau Weightages  │  │   • Live Chat Advisor  │  │   • Benchmark Matrix           │  │
│  └──────────┬────────────┘  └───────────┬────────────┘  └───────────────┬────────────────┘  │
│             │                           │                               │                   │
│             └─────────────────────┬─────┴───────────────────────────────┘                   │
│                                   │                                                         │
│                                   ▼                                                         │
│                      SQLAlchemy ORM Data Layer                                              │
└───────────────────────────────────┬─────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Relational Store  │
                         │ (SQLite / Postgres) │
                         └─────────────────────┘
```

---

## 🎯 Core Features & Scenarios

### 1. Borrower Onboarding & Baseline Assessment
- Captures verified borrower credentials, monthly income, expenses, active loan EMIs, credit card limits, and current balances.
- Immediately calculates **Fixed Obligation to Income Ratio (FOIR/DTI)** and **Credit Utilization Ratio** aligned with Indian underwriting practices.
- Categorizes borrower credit standing into bureau tiers: **Poor (<650)**, **Fair (650–699)**, **Good (700–749)**, and **Excellent (750–900)**.
- Automatically persists the profile and registers an initial historical baseline checkpoint.

### 2. AI Credit Advisor & Consultation Engine
- Integrates with **Groq AI (Qwen 3.8 / LLaMA reasoning model)** to perform credit bottleneck diagnostics.
- Produces an **Executive Financial Health Summary** identifying high-risk parameters (e.g., credit card utilization > 50%, high EMI burden).
- Formulates a customized, sequential **5-step recovery roadmap** tailored to Indian banking:
  - CIBIL CIR (Credit Information Report) dispute filings for reporting discrepancies.
  - 30% credit card utilization ceiling optimization.
  - Setting up e-NACH auto-debit mandates to eliminate 30/60 DPD (Days Past Due) marks.
  - Debt avalanche targeting high-APR revolving balances (~42% APR).
  - Credit seasoning and building a balanced mix of secured (home/auto) vs. unsecured (personal/card) credit.
- Features an interactive **AI Credit Advisor drawer** allowing borrowers to converse in real time about credit repair strategies.

### 3. Historical Progression & Bureau Visualization
- Visualizes credit score trajectories over time with an interactive line chart.
- Highlights the **750 Prime Milestone Target Line**, the benchmark for pre-approved loans and prime lending rates in India.
- Displays Indian credit bureau factor weightage distribution:
  - **Payment History**: 35%
  - **Credit Utilization**: 30%
  - **Credit Age & Vintage**: 15%
  - **Credit Mix (Secured vs. Unsecured)**: 10%
  - **Credit Inquiries**: 10%

### 4. Real-Time What-If Credit Score Simulator
- Provides dynamic simulation controls allowing borrowers to evaluate the impact of financial actions before committing funds:
  - **Credit Card Balance Repayment** (revolving debt pay-down).
  - **Loan EMI Reduction** (closing personal loans or prepayment).
  - **Credit Card Limit Enhancement** (denominator expansion).
  - **On-Time Payment Seasoning** (unbroken consecutive payment cycles).
  - **Monthly Income Fluctuations**.
- Computes real-time projected scores, updated utilization rates, FOIR deltas, and estimated interest savings on high-APR compounding balances.
- Allows users to **"Apply Improvements to Profile"**, committing the simulation to the database as a new historical checkpoint with confetti visualization.

### 5. Official Credit Audit PDF Generation Service
- Employs a dedicated **ReportLab** document engine (`GET /api/report/pdf/{user_id}`).
- Generates a formatted, multi-page **Official Credit Health & Audit Report**:
  - Official generation timestamp and verified borrower credentials.
  - Score badge, tier indicator, and bureau benchmark comparison table.
  - Financial bottleneck flags and diagnostic risk matrix.
  - Sequential 5-step Indian banking actionable roadmap.
  - Statutory RBI compliance disclaimer and regulatory notices.

### 6. Continuous Health & Diagnostic Monitoring
- Provides dedicated `/health` and `/api/health` monitoring endpoints.
- Executes real-time live database ping queries (`SELECT 1`) to measure DB query latency in milliseconds.
- Tracks process uptime in seconds, system environment, and AI engine readiness.
- Implements anti-caching headers (`Cache-Control: no-cache, no-store, must-revalidate`) and appropriate status codes (`200 OK` vs. `503 Service Unavailable`).

---

## 🧮 Financial Formulas & Algorithmic Engine

### 1. Fixed Obligation to Income Ratio (FOIR / DTI)
In the Indian banking sector, credit card obligations are evaluated assuming a minimum monthly payment of **5% of outstanding revolving balance**:

$$\text{Total Monthly Obligations} = \text{Total Loan EMIs} + (\text{Credit Card Balance} \times 0.05)$$

$$\text{FOIR (\%)} = \left( \frac{\text{Total Monthly Obligations}}{\text{Monthly Income}} \right) \times 100$$

- **Thresholds**: $\le 35\%$ is optimal; $35\% - 50\%$ is moderate; $> 50\%$ indicates severe debt strain.

### 2. Credit Utilization Ratio (CUR)
Measures revolving debt exposure against sanctioned revolving limits:

$$\text{Utilization (\%)} = \min\left(100, \left( \frac{\text{Credit Card Balance}}{\text{Credit Card Limit}} \right) \times 100 \right)$$

- **Thresholds**: $\le 30\%$ represents the CIBIL golden threshold; $> 50\%$ negatively impacts credit score.

### 3. Bureau Score Tier Matrix
| Score Range | Bureau Classification | Lending Implications in India |
|---|---|---|
| **750 – 900** | **Excellent** | Pre-approved home/car loans, lowest interest spreads, premium credit cards |
| **700 – 749** | **Good** | Standard retail loans approved with standard processing fees |
| **650 – 699** | **Fair** | Higher interest rates, additional co-borrower/guarantor required |
| **300 – 649** | **Poor** | High rejection rate for unsecured credit; secured/FD-backed cards required |

### 4. Credit Simulation Algorithm
The simulator models score improvements based on Indian bureau weightings:
- **Utilization Recovery Boost**: Reducing utilization from $> 50\%$ to $\le 30\%$ awards up to $+15$ bonus points in addition to proportional improvement delta.
- **FOIR Improvement Boost**: Lowering FOIR by $> 5\%$ grants up to $+30$ creditworthiness points.
- **Payment History Seasoning**: Consecutive on-time monthly payments contribute $+4$ points per verified cycle (up to $+35$ points maximum).
- **Compound Interest Savings**: Calculates avoided interest on card balances based on the standard $\sim 42\%$ annualized compounding card rate in India:

$$\text{Interest Saved} \approx \text{Repayment Amount} \times \left( \frac{0.42}{12} \right) \times 6$$

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Live system & database health diagnostic (with latency & uptime) |
| `GET` | `/api/health` | API namespace health check endpoint |
| `GET` | `/api/users` | Retrieve all registered borrowers |
| `POST` | `/api/users` | Onboard new borrower and establish baseline profile |
| `GET` | `/api/users/{id}/profile` | Retrieve comprehensive financial profile and calculated ratios |
| `PUT` | `/api/users/{id}/profile` | Update profile attributes and recalculate derived metrics |
| `GET` | `/api/users/{id}/history` | Retrieve chronological credit progression logs |
| `POST` | `/api/users/{id}/simulate` | Run real-time What-If credit score simulations |
| `POST` | `/api/ai/consult/{id}` | Generate AI-driven credit consultation and 5-step roadmap |
| `POST` | `/api/ai/chat/{id}` | Real-time conversational AI advisory chat session |
| `GET` | `/api/report/pdf/{id}` | Generate and download official ReportLab Credit Audit Report PDF |

---

## 🗄️ Database Schema & Entity Relationships

```
┌──────────────────┐          1:1          ┌──────────────────────────┐
│      users       ├──────────────────────►│    financial_profiles    │
├──────────────────┤                       ├──────────────────────────┤
│ id (PK)          │                       │ id (PK)                  │
│ name             │                       │ user_id (FK, Unique)     │
│ email (Unique)   │                       │ credit_score             │
│ phone            │                       │ monthly_income           │
│ created_at       │                       │ monthly_expenses         │
└────────┬─────────┘                       │ credit_card_limit        │
         │                                 │ credit_card_balance      │
         │ 1:N                             │ total_loan_emi           │
         ├──────────────────┐              │ active_loans_count       │
         │                  │              │ missed_payments_24m      │
         ▼                  ▼              │ credit_age_years         │
┌──────────────────┐  ┌──────────────────┐ │ dti_ratio (derived)      │
│credit_history_log│  │ ai_analysis_logs │ │ utilization_ratio (calc) │
├──────────────────┤  ├──────────────────┤ │ tier (calculated)        │
│ id (PK)          │  │ id (PK)          │ │ updated_at               │
│ user_id (FK)     │  │ user_id (FK)     │ └──────────────────────────┘
│ month_label      │  │ executive_summary│
│ credit_score     │  │ bottlenecks_json │
│ utilization_ratio│  │ roadmap_json     │
│ dti_ratio        │  │ raw_response     │
│ total_debt       │  │ created_at       │
│ note             │  └──────────────────┘
│ recorded_at      │
└──────────────────┘
```

---

## 💻 Technology Stack

### Backend
- **FastAPI**: Modern, asynchronous Python web framework providing high throughput and automatic OpenAPI/Swagger documentation.
- **SQLAlchemy 2.0**: Object-Relational Mapper managing schema definitions, transactions, and persistence.
- **Pydantic v2**: Strict request/response validation and data serialization.
- **ReportLab**: Enterprise PDF document generation engine providing vector graphics, custom color palettes, and typographic styling.
- **Uvicorn**: Lightning-fast ASGI server for Python web applications.

### Frontend
- **React 18**: Component-driven UI architecture with responsive state management.
- **Vite**: Modern frontend build tooling and development server.
- **Lucide React**: Clean, semantic iconography set for financial dashboards.
- **Canvas Confetti**: Visual celebration trigger on milestone achievements and profile improvements.

### Artificial Intelligence
- **Groq Cloud API**: High-speed inference engine running **Qwen 3.8 / LLaMA** models for contextual financial reasoning and conversational advisory.

---

## 📁 Project Directory Structure

```
credit-assistant/
├── backend/
│   ├── calculator.py       # Algorithmic engine (FOIR, Utilization, Tier, Simulator)
│   ├── config.py           # Environment variables, Groq keys & DB URL resolution
│   ├── database.py         # SQLAlchemy engine, session management & connection pools
│   ├── groq_service.py     # Groq AI prompt engineering, structured parsing & fallback
│   ├── main.py             # FastAPI routing, middleware, health endpoints & static mount
│   ├── models.py           # SQLAlchemy database entity models
│   ├── pdf_service.py      # ReportLab official credit audit report generator
│   ├── schemas.py          # Pydantic validation schemas & API data contracts
│   └── seed.py             # Database seeder with realistic Indian borrower test profiles
├── public/                 # Static assets (favicons, SVG vector icons)
├── src/
│   ├── assets/             # Brand logos and imagery
│   ├── components/
│   │   ├── AIChatDrawer.jsx           # Conversational AI Credit Advisor drawer
│   │   ├── AIRoadmapTab.jsx           # 5-step personalized Indian banking roadmap
│   │   ├── ArchitectureFlowModal.jsx  # System architecture & data flow modal
│   │   ├── Header.jsx                 # User switcher, score pill & audit actions
│   │   ├── MetricCards.jsx            # KPI cards (Income, Expenses, Debt, FOIR, CUR)
│   │   ├── ProgressHistoryTab.jsx     # Historical score charts & factor weightings
│   │   ├── ScoreGauge.jsx             # Visual score meter with tier markers
│   │   ├── SimulatorTab.jsx           # Interactive What-If credit score simulator
│   │   └── UpdateProfileModal.jsx     # Borrower profile editing & recalculation modal
│   ├── App.css                        # Application styles and glassmorphism themes
│   ├── App.jsx                        # Master dashboard state container & API synchronizer
│   ├── index.css                      # Global design system & typography tokens
│   └── main.jsx                       # React DOM root entry point
├── test_e2e.py             # End-to-end integration test suite covering all 4 core scenarios
├── index.html              # HTML5 application shell
├── package.json            # Node.js dependencies and frontend scripts
├── requirements.txt        # Python backend dependencies
├── vite.config.js          # Vite configuration with local proxy routing to FastAPI
└── .env.example            # Environment variables template
```

---

## 🛠️ Local Development & Verification

### 1. Environment Setup
Create a `.env` file in the project root:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=qwen/qwen3.8-27b
```
*(Optional: Define `DATABASE_URL` if using PostgreSQL; defaults to SQLite automatically).*

### 2. Run the Backend API Server
```powershell
py -m uvicorn backend.main:app --port 8000 --reload
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`
- Health Diagnostic: `http://127.0.0.1:8000/health`

### 3. Run the Frontend Development Server
```powershell
npm install
npm run dev
```
- Dashboard URL: `http://localhost:5173`
- Pre-configured Vite reverse proxy seamlessly routes all `/api` and `/health` requests to `http://127.0.0.1:8000`.

### 4. Run the Automated End-to-End Test Suite
In a separate terminal, execute the test suite to validate all system components:
```powershell
py test_e2e.py
```
This test suite verifies:
1. Health endpoint response and latency metrics.
2. Borrower onboarding and baseline calculations.
3. Financial profile updates and ratio recalculations.
4. Historical progression retrieval.
5. What-If credit score simulation deltas.
6. ReportLab PDF document compilation.
7. Groq AI credit consultation reasoning.
8. Real-time conversational AI advisory chat.

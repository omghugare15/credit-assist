# Credit Assistant — AI-Driven Credit Intelligence & Health Platform
## Engineering Technical Specification & Project Architecture Report

[![Document Type](https://img.shields.io/badge/Document-Technical_Specification-0F172A?style=for-the-badge)](#)
[![Target Ecosystem](https://img.shields.io/badge/Ecosystem-Indian_Banking_(RBI_/_CIBIL)-1D4ED8?style=for-the-badge)](#)
[![System Version](https://img.shields.io/badge/Release-v2.4.0_Production_Ready-15803D?style=for-the-badge)](#)
[![Design Standard](https://img.shields.io/badge/Design-IEEE_/_Swiss_Grid-64748B?style=for-the-badge)](#)

---

> [!NOTE]
> **Executive Summary:**  
> **Credit Assistant** is an enterprise-grade financial technology platform engineered specifically for the Indian credit and banking ecosystem. Regulated by guidelines from the **Reserve Bank of India (RBI)** and scored under credit information bureaus (**TransUnion CIBIL**, **Experian India**, **CRIF High Mark**), the platform unites deterministic algorithmic modeling, low-latency Groq AI inference (LLaMA/Qwen reasoning), interactive real-time What-If simulations, and dynamic ReportLab PDF audit synthesis to deliver institutional-grade credit diagnostics and restorative roadmaps for retail borrowers.

---

## 📌 Document Overview & Table of Contents

- [1. Systemic Problem Statement in Indian Retail Credit](#1-systemic-problem-statement-in-indian-retail-credit)
- [2. Strategic Engineering Objectives & Target KPIs](#2-strategic-engineering-objectives--target-kpis)
- [3. End-to-End System Architecture & Tier Breakdown](#3-end-to-end-system-architecture--tier-breakdown)
- [4. Relational Database Schema & Entity Relationships](#4-relational-database-schema--entity-relationships)
- [5. RESTful API Contract & Route Specifications](#5-restful-api-contract--route-specifications)
- [6. Algorithmic Financial Engine & Mathematical Formulations](#6-algorithmic-financial-engine--mathematical-formulations)
- [7. What-If Dynamic Credit Score Simulation Formulation](#7-what-if-dynamic-credit-score-simulation-formulation)
- [8. Groq AI Advisory Engine & 5-Step Indian Recovery Roadmap](#8-groq-ai-advisory-engine--5-step-indian-recovery-roadmap)
- [9. Real-Time Conversational AI Advisory Architecture](#9-real-time-conversational-ai-advisory-architecture)
- [10. Official ReportLab Credit Audit PDF Synthesis Engine](#10-official-reportlab-credit-audit-pdf-synthesis-engine)
- [11. Regulatory Compliance, Security & Privacy Standards](#11-regulatory-compliance-security--privacy-standards)
- [12. Automated Verification & End-to-End Test Suite](#12-automated-verification--end-to-end-test-suite)
- [13. Production Deployment Topology & Execution Setup](#13-production-deployment-topology--execution-setup)
- [14. Future Innovation Roadmap & Strategic Milestones](#14-future-innovation-roadmap--strategic-milestones)
- [15. Engineering Certification & Design Audit](#15-engineering-certification--design-audit)

---

## 1. Systemic Problem Statement in Indian Retail Credit

In India, access to prime personal, auto, and home financing is governed strictly by the **300–900 bureau scoring range**. Despite rapid credit card penetration and retail lending growth, consumers face acute systematic hurdles:

| Challenge | Systemic Root Cause in Indian Banking | Borrower Financial Consequence |
|---|---|---|
| **Opaque Bureau Scoring** | Bureaus (CIBIL/Experian) do not disclose real-time point deductions for utilization spikes or DPDs. | Borrowers blindly trigger score drops by crossing the 30% credit card utilization threshold. |
| **Unmonitored FOIR / DTI** | Indian banks enforce strict Fixed Obligation to Income Ratios (FOIR capped at 40–50%). | Uninformed loan applicants face outright rejections, generating hard bureau inquiry penalties. |
| **Compounding 42% APR Debt** | Revolving credit card debt in India incurs 3.5% to 3.75% monthly interest (42% to 45% APR). | Paying only minimum dues leads to exponential compounding balance traps and debt spiraling. |
| **Western Advice Inapplicability** | Generic financial tools ignore Indian mechanisms: e-NACH auto-debits, CIR disputes, and 30/60 DPDs. | Borrowers fail to utilize formal Indian statutory grievance dispute channels. |

---

## 2. Strategic Engineering Objectives & Target KPIs

| Target Objective | System Implementation Architecture | Target Metric / KPI |
|---|---|---|
| **Automated Risk Modeling** | Deterministic FOIR & CUR algorithmic engine with banking 5% card rule. | Zero calculation discrepancy across all income bands. |
| **Pre-Emptive Simulation** | Reactive What-If simulation slider matrix calculating instant score projections. | < 15ms simulation execution time. |
| **AI-Driven Advisory** | Groq Cloud API integration running Qwen 3.8 / LLaMA structured prompt engine. | < 1.5s turnaround for full 5-step recovery roadmap. |
| **Statutory Audit PDF** | Vectorized ReportLab document generation engine with compliance notices. | Downloadable multi-page institutional audit in < 500ms. |

---

## 3. End-to-End System Architecture & Tier Breakdown

The platform adopts a decoupled client-server architecture designed for high availability, deterministic calculations, and sub-second AI inference:

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

### Architectural Tier Specification

1. **Frontend Presentation Tier**: React 18 SPA built with Vite, Lucide Icons, and Canvas Confetti for reactive UI state, slider interactions, and SVG gauge rendering.
2. **API Application Core**: FastAPI on Python 3.10+ running Uvicorn ASGI server with non-blocking request pipelines, CORS middleware, and automated OpenAPI documentation.
3. **Financial Modeling Engine**: Codified inside `backend/calculator.py` for deterministic FOIR, CUR, tier categorization, and interest calculations.
4. **Artificial Intelligence Layer**: Groq Cloud inference running Qwen 3.8 and LLaMA reasoning models for contextual credit repair diagnostics.
5. **Document Generation Engine**: Vectorized ReportLab 5.0+ engine in `backend/pdf_service.py` compiling downloadable institutional audit reports.
6. **Persistence & ORM Layer**: SQLAlchemy 2.0 ORM with connection pooling, transaction isolation, and support for SQLite and PostgreSQL.

---

## 4. Relational Database Schema & Entity Relationships

The relational data model enforces strict referential integrity across borrower identities, snapshot profiles, historical trend logs, and cached AI consultation outputs:

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

| Entity Table | Primary & Foreign Keys | Key Attributes & Types | Relationship Cardinality |
|---|---|---|---|
| **users** | PK: `id` (Integer) | `name` (String), `email` (Unique String), `phone` (String), `created_at` (DateTime) | 1 : 1 with `financial_profiles`<br/>1 : N with history & AI logs |
| **financial_profiles** | PK: `id`<br/>FK: `user_id` (Unique) | `credit_score` (Int), `monthly_income` (Float), `monthly_expenses` (Float), `credit_card_limit` (Float), `credit_card_balance` (Float), `total_loan_emi` (Float), `active_loans_count` (Int), `missed_payments_24m` (Int), `dti_ratio` (Float) | 1 : 1 parent-child constraint with automatic cascade deletion |
| **credit_history_log** | PK: `id`<br/>FK: `user_id` | `month_label` (String), `credit_score` (Int), `utilization_ratio` (Float), `dti_ratio` (Float), `total_debt` (Float), `note` (String), `recorded_at` (DateTime) | 1 : N chronological checkpoints for trajectory visualizations |
| **ai_analysis_logs** | PK: `id`<br/>FK: `user_id` | `executive_summary` (Text), `bottlenecks_json` (Text), `roadmap_json` (Text), `raw_response` (Text), `created_at` (DateTime) | 1 : N consultation history log for audit and re-read |

---

## 5. RESTful API Contract & Route Specifications

| Verb | Endpoint Route | Input / Payload | Output Response & Status | Status Code |
|---|---|---|---|---|
| `GET` | `/health`, `/api/health` | None (Diagnostic ping) | Live DB ping latency (ms), process uptime, system environment | `200 OK` |
| `GET` | `/api/users` | None | Returns JSON array of all registered borrowers | `200 OK` |
| `POST` | `/api/users` | JSON: User Profile | Onboards new borrower; initializes financial ratios & baseline log | `201 Created` |
| `GET` | `/api/users/{id}/profile` | Path ID | Returns full financial profile, calculated ratios, and bureau tier | `200 OK` |
| `PUT` | `/api/users/{id}/profile` | JSON: Financial updates | Modifies financial attributes and triggers deterministic recalculation | `200 OK` |
| `GET` | `/api/users/{id}/history` | Path ID | Returns chronological credit progression logs for trend line charting | `200 OK` |
| `POST` | `/api/users/{id}/simulate` | JSON: Slider deltas | Executes real-time What-If simulation; returns projected score & savings | `200 OK` |
| `POST` | `/api/ai/consult/{id}` | Path ID | Runs Groq AI reasoning to formulate 5-step personalized Indian roadmap | `200 OK` |
| `POST` | `/api/ai/chat/{id}` | JSON: User query | Context-aware conversational AI advisory chat session | `200 OK` |
| `GET` | `/api/report/pdf/{id}` | Path ID | Compiles and streams official ReportLab Credit Audit Report PDF | `200 OK` |

---

## 6. Algorithmic Financial Engine & Mathematical Formulations

### A. Fixed Obligation to Income Ratio (FOIR / DTI) — Indian 5% Card Rule
In Indian commercial banking, credit card debt is treated as an ongoing liability by imputing an assumed minimum monthly obligation of **5% of total outstanding revolving balance**:

$$\text{Total Monthly Obligations (₹)} = \text{Total Loan EMIs} + (\text{Credit Card Balance} \times 0.05)$$

$$\text{FOIR (\%)} = \left( \frac{\text{Total Monthly Obligations}}{\text{Monthly Income}} \right) \times 100$$

> [!TIP]
> **Underwriting Thresholds:**
> - **Optimal / Prime:** $\le 35\%$
> - **Moderate / Strained:** $35\% - 50\%$
> - **High Risk / Rejection Tier:** $> 50\%$

### B. Credit Utilization Ratio (CUR) — 30% CIBIL Golden Rule
Measures revolving debt exposure relative to aggregate sanctioned credit limits across cards:

$$\text{CUR (\%)} = \min\left( 100, \left( \frac{\text{Credit Card Balance}}{\text{Credit Card Limit}} \right) \times 100 \right)$$

- **Golden Threshold:** $\le 30\%$ awards maximum score appreciation.
- **Risk Threshold:** $> 50\%$ triggers progressive bureau point penalties.

### C. Indian Bureau Score Tier Matrix
| Score Range | Bureau Classification | Underwriting Terms & Lending Status in India |
|---|---|---|
| **750 – 900** | **Excellent (Prime)** | Pre-approved home/car loans, lowest interest spreads (Repo + 2.05%), 100% waiver on processing fees. |
| **700 – 749** | **Good** | Standard retail credit approvals; standard documentation and processing fees. |
| **650 – 699** | **Fair (Subprime)** | Higher risk-premium spreads (+150-250 bps); mandatory collateral or co-borrower requirement. |
| **300 – 649** | **Poor (Distressed)** | Outright rejection for unsecured lending; eligibility limited strictly to FD-backed secured cards. |

---

## 7. What-If Dynamic Credit Score Simulation Formulation

The real-time simulator computes score trajectory adjustments by applying weighted deltas derived from bureau algorithms:

| Simulation Factor | Mathematical Formulation & Algorithmic Rule | Maximum Impact |
|---|---|---|
| **Utilization Recovery** | $\Delta = (\text{Current CUR} - \text{Simulated CUR}) \times 0.40$. If CUR drops from $>50\%$ to $\le 30\%$, an additional $+15$ point milestone bonus is awarded. | **+45 Points** |
| **FOIR Reduction** | $\Delta = (\text{Current FOIR} - \text{Simulated FOIR}) \times 0.35$. If FOIR decreases by $>5\%$, an extra $+8$ point debt relief bonus is granted. | **+30 Points** |
| **Payment Seasoning** | $\Delta = \text{Consecutive On-Time Payment Cycles} \times 4\text{ points per verified cycle}$. | **+35 Points** |
| **Avoided Compounding Interest** | $\text{Interest Saved} = \text{Repaid Principal} \times \left(\frac{0.42}{12}\right) \times 6\text{ months}$. Highlights avoided cash drain on 42% APR cards. | **Direct Cash Relief (₹)** |

---

## 8. Groq AI Advisory Engine & 5-Step Indian Recovery Roadmap

The AI Consultation Engine (`backend/groq_service.py`) utilizes Groq Cloud LPU acceleration to execute contextual credit diagnostics in sub-second latency, formulating a personalized, sequential 5-step recovery roadmap:

- **Step 1: CIBIL CIR Dispute Resolution & Error Rectification**  
  Initiate an online Credit Information Report (CIR) dispute via the CIBIL portal for erroneous DPDs, duplicated loan accounts, or unsettled status marks wrongly reported by lending institutions.
- **Step 2: 30% Credit Card Utilization Optimization**  
  Pay down revolving credit card balances below 30% before the billing cycle statement date. Request sanctioned credit limit upgrades to expand denominator headroom without spending increases.
- **Step 3: e-NACH Auto-Debit Mandates**  
  Configure electronic National Automated Clearing House (e-NACH) auto-debit mandates across salary accounts to eliminate human oversight and permanently avoid 30/60 DPD (Days Past Due) bureau marks.
- **Step 4: Debt Avalanche Strategy**  
  Target aggressive debt elimination towards high-APR revolving credit cards (compounding at ~42% APR) while maintaining minimum contractual obligations on low-cost secured loans (home/car loans at 8-9%).
- **Step 5: Credit Mix & Vintage Seasoning**  
  Maintain oldest active credit cards to protect credit vintage. Balance portfolio by pairing unsecured debt with secured assets (e.g. gold loan, auto loan) to achieve an optimal 60:40 secured-to-unsecured ratio.

---

## 9. Real-Time Conversational AI Advisory Architecture

Borrowers can query the AI Advisor dynamically via a slide-out drawer interface (`AIChatDrawer`). The backend injects verified profile data (CIBIL score, FOIR, missed payments, active loans) as system context, ensuring answers reference the borrower's exact numbers rather than generic platitudes. Complete session dialogues are stored in memory and summarized for ongoing continuity.

---

## 10. Official ReportLab Credit Audit PDF Synthesis Engine

The ReportLab document synthesis module (`backend/pdf_service.py`) dynamically compiles high-fidelity, multi-page audit reports without relying on headless browsers or HTML-to-PDF rasterization:

- **Vector-Grade Precision:** Direct PDF canvas drawing eliminates raster blurring and reduces output payload to < 200 KB per complete audit report.
- **Dynamic Score Badging:** Generates conditional visual badges that dynamically color-code based on the borrower's computed tier (Green for Prime $\ge 750$ down to Red for Distressed $< 650$).
- **Statutory Regulatory Notices:** Formats mandatory RBI Fair Practices Code disclaimers, data privacy notices, and dispute filing guidelines.
- **Deterministic Character Encoding:** Built-in sanitization pipeline converts non-standard currency symbols into robust typographic formats ensuring uniform rendering across OS platforms.

---

## 11. Regulatory Compliance, Security & Privacy Standards

- **Reserve Bank of India (RBI) Regulations:** Enforces the RBI Master Direction on Credit Card and Debit Card Issuance (2022/2024 amendments), calculating 5% revolving obligation and statutory consumer disclosures on compounding card fees.
- **Data Privacy & Protection:** Complies with India's Digital Personal Data Protection (DPDP) Act 2023. No unencrypted PII is persistently retained; database records are decoupled by pseudonymous internal keys.
- **Cache Invalidation & Security:** Diagnostic and health probes emit strict `Cache-Control: no-cache, no-store, must-revalidate` headers to ensure accurate real-time monitoring.

---

## 12. Automated Verification & End-to-End Test Suite

The system incorporates an end-to-end integration test suite (`test_e2e.py`) validating all 8 core API services across simulated borrower profiles:

| Test Case ID | Verification Scenario | Validation Criteria | Automated Status |
|---|---|---|---|
| **TC-001** | Diagnostic Health Probe | Status 200, DB latency < 50ms, uptime verification | **PASS** |
| **TC-002** | Borrower Onboarding & Baseline | Profile created, FOIR and CUR accurately computed | **PASS** |
| **TC-003** | Profile Modification & Recalc | Financial values updated, derived ratios recomputed | **PASS** |
| **TC-004** | Chronological History Fetch | Array of historical logs returned with timestamps | **PASS** |
| **TC-005** | What-If Simulator Engine | Score delta accurately projected with compound savings | **PASS** |
| **TC-006** | ReportLab PDF Compilation | Binary PDF byte-stream verified (> 5 KB, valid PDF header) | **PASS** |
| **TC-007** | Groq AI Consultation Flow | Executive summary & 5-step structured roadmap parsed | **PASS** |
| **TC-008** | Conversational Chat Advisory | Interactive response returned with contextual memory | **PASS** |

---

## 13. Production Deployment Topology & Execution Setup

### Local Development
```powershell
# 1. Run Backend API
py -m uvicorn backend.main:app --port 8000 --reload

# 2. Run Frontend SPA
npm install
npm run dev

# 3. Execute Automated Test Suite
py test_e2e.py
```

### Cloud Production Topology
- **Backend API:** Deployed on Render / AWS ECS with automatic scaling and process management via `render.yaml`.
- **Frontend SPA:** Deployed on Vercel Edge Network with reverse proxy rewrites configured in `vercel.json`.
- **Database:** PostgreSQL on Supabase / Render with connection pooling and automated SSL enforcement.

---

## 14. Future Innovation Roadmap & Strategic Milestones

1. **Phase 1 (Q1) — Account Aggregator (AA) Ecosystem Integration:**  
   Connect with RBI-licensed Account Aggregators (Setu, Anumati) to ingest real-time bank statement cash flows automatically.
2. **Phase 2 (Q2) — Vernacular Multi-Lingual Advisory:**  
   Deploy Hindi, Marathi, and Tamil conversational agents via Groq to democratize credit intelligence for tier-2/3 Indian cities.
3. **Phase 3 (Q3) — Automated CIR Dispute Filing Bot:**  
   Enable one-click submission of pre-drafted grievance letters directly to TransUnion CIBIL and banking ombudsmen.

---

## 15. Engineering Certification & Design Audit

> [!IMPORTANT]
> **Engineering Certification:**  
> This document certifies the technical architecture, mathematical modeling, and operational verification of the **Credit Assistant Platform**. All ratios strictly conform to Indian commercial banking standards (RBI Master Directions / CIBIL / Experian). Validated by automated end-to-end integration tests TC-001 through TC-008.

### Adopted Typography & Design System Standards
- **Grid Layout**: Swiss International Typographic Style (strict vertical alignment, 36pt margins, balanced whitespace).
- **Type Hierarchy**: Modular scale based on Perfect Fourth ($1.333$ ratio) with $1.4\times$ to $1.5\times$ proportional leading.
- **Color Contrast**: Complies with **WCAG 2.1 AAA** contrast standards (Slate 900 on white delivers $13.5:1$ contrast ratio).
- **Information Architecture**: Cognitive chunking via callout cards, structured tables, and bold typographic signposting.

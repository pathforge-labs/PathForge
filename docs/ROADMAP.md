# PathForge — Live Sprint Board

> **Single Source of Truth** for all sprint tracking and task management.
> **Last Updated**: 2026-02-19 | **Current Phase**: B (Career Intelligence)

---

## How This File Works

| Symbol | Meaning               |
| :----- | :-------------------- |
| `[x]`  | Task completed        |
| `[/]`  | Task in progress      |
| `[ ]`  | Task not started      |
| `[-]`  | Task deferred/skipped |
| ✅     | Sprint complete       |
| 📋     | Current sprint        |
| ⏳     | Upcoming sprint       |

> **Rules**: Sprint definitions come from `docs/architecture/ARCHITECTURE.md` Section 7.
> This file is the ONLY place where task status is tracked — never in `session-state.json` or `session-context.md`.

---

## Phase A: Core Platform (MVP)

### Sprint 1-2 — Foundation + AI Engine (✅ Complete)

> Combined into a single execution block. Original definition: Monorepo, FastAPI, DB schema, JWT auth, Docker, Alembic + Resume parsing, embeddings, semantic matching, CV tailoring.

- [x] Monorepo setup (pnpm workspace, Turborepo)
- [x] FastAPI backend with Python 3.12+
- [x] PostgreSQL + pgvector database schema
- [x] JWT authentication + refresh tokens
- [x] Docker Compose for local development
- [x] Alembic migration setup
- [x] Resume parser (AI-powered structured extraction)
- [x] Voyage AI v4 embedding integration
- [x] Semantic matching engine (cosine similarity + HNSW)
- [x] CV tailoring pipeline (LLM-powered)
- [x] Architecture document (ARCHITECTURE.md v2.0.0)
- [x] Market Viability Report — Digital Anthropologist analysis

### Sprint 3 — Job Aggregation (✅ Complete)

> Original definition: Adzuna/Jooble API integration, deduplication, embedding pipeline.

- [x] Adzuna API provider implementation
- [x] Jooble API provider implementation
- [x] Job deduplication pipeline
- [x] Embedding pipeline for job listings
- [x] 13 AI service unit tests

### Sprint 4 — Web App (✅ Complete)

> Original definition: Next.js UI, onboarding, Career Radar dashboard, interview prep.

- [x] Next.js 15 landing page (marketing site)
- [x] Waitlist system + hero form
- [x] Testimonials marquee section
- [x] FAQ accordion section
- [x] Footer redesign (status badge, NL trust badge, Company column)
- [x] Interactive CSS enhancements (265+ lines)
- [x] Back-to-top button component
- [x] Navbar scroll glass effect

### Sprint 5 — Application Flow (✅ Complete)

> Original definition: User-consented apply, safety controls, logging.

- [x] Application Kanban pipeline
- [x] Company blacklist system
- [x] Rate limiting controls
- [x] Retrospective Audit — 11 findings remediated across 12 files
- [x] 129/129 tests passing
- [x] Brand constants framework + GitHub repo setup

### Sprint 6a — Navbar & UI Excellence (✅ Complete, unplanned)

> **Inserted sprint**: Navbar/theme work emerged from Tier-1 quality audit. Not in original ARCHITECTURE.md definition. Sprint 6 proper (Analytics) deferred to 6b.

- [x] Floating pill navbar with custom breakpoint (860px)
- [x] Desktop CTA cluster with gradient border
- [x] Full-screen mobile drawer with portal + staggered animations
- [x] Hamburger↔X morphing toggle
- [x] ThemeToggle component + next-themes integration
- [x] Theme-aware logos (CSS-only dark/light switching)
- [x] Light mode color palette (oklch-based)
- [x] Nav section renames (Process, Pricing)
- [x] Hydration fix (useSyncExternalStore)
- [x] Gitflow strategy: main + production branches
- [x] Development Workflow documentation (13 sections)
- [x] Merge policy (sprint-end, milestone, hotfix cadences)

### Sprint 6a.1 — Performance Optimization (✅ Complete, unplanned)

> **Inserted sprint**: Performance work emerged from retrospective audit findings. Tier 1-4 optimizations.

- [x] WebP image conversion (30-70% size reduction)
- [x] Dynamic imports for TestimonialsMarquee + FaqAccordion
- [x] Scroll listener consolidation (useScrollState hook)
- [x] CSS-only ScrollProgress (animation-timeline: scroll())
- [x] @next/bundle-analyzer integration
- [x] Lucide icon audit (confirmed tree-shakeable)

### Sprint 6b — Analytics (✅ Complete)

> Resumes original Sprint 6 definition from ARCHITECTURE.md.

- [x] Funnel pipeline event tracking
- [x] Market intelligence dashboard
- [x] CV A/B tracking system

### Sprint 7 — Production Readiness (✅ Complete)

> Original definition: Expo mobile app, push notifications, security audit, monitoring.
> **Pivoted**: Mobile deferred; focused on production readiness for web platform.

- [x] GitHub Actions CI/CD pipeline (ci.yml + deploy.yml)
- [x] Alembic migration — CHECK constraint on applications.status
- [x] Redis-backed JWT token blacklist + /auth/logout endpoint
- [x] ARQ async background task queue for AI pipeline
- [x] Security headers middleware (OWASP compliance)
- [x] Production deployment configuration (Railway + Vercel)
- [x] Pre-production deployment checklist (docs/TODO-pre-production.md)

---

## Phase B: Career Intelligence (Post-MVP)

> Sprint definitions from ARCHITECTURE.md Section 7, Phase B.

### Sprint 8 — Career DNA Activation (✅ Complete)

- [x] 7 SQLAlchemy models (CareerDNA hub + 6 dimensions) with 10 StrEnums
- [x] 12 Pydantic request/response schemas
- [x] Versioned AI prompt templates (6 dimensions)
- [x] CareerDNAAnalyzer (5 LLM methods + 1 data-driven)
- [x] CareerDNAService lifecycle orchestration
- [x] 10 REST API endpoints with auth enforcement
- [x] Alembic migration for 7 Career DNA tables
- [x] 22 tests (168/168 total suite passing)
- [x] Tier-1 retrospective audit — 12 lint fixes applied

### Sprint 9 — Career Threat Radar™ (✅ Complete)

> **Hardening carry-over from Sprint 8 audit:**

- [x] ⚠️ Prompt injection sanitization — 8-layer OWASP LLM01 defense
- [x] ⚠️ Rate limiting on `/career-dna/generate` — 3/min per user (slowapi)
- [x] Quality Gate Research — 8 competitors, 4 proprietary innovations defined

> **Career Threat Radar™ features:**

- [x] 🔥 Career Resilience Score™ — 5-factor composite adaptability metric (0–100)
- [x] 🔥 Skills Shield™ Matrix — skills classified as shields (protective) vs exposures (vulnerable)
- [x] 🔥 Threat→Opportunity Inversion Engine — every threat auto-paired with actionable opportunity
- [x] 🔥 Career Moat Score — 4-dimension career defensibility metric (0–100)
- [x] Automation risk scoring — hybrid ONET Frey-Osborne + LLM contextual analysis
- [x] Industry trend monitoring — LLM-powered personalized trend analysis
- [x] Alert engine — severity-tiered, event-driven, user preference-filtered
- [x] 6 data models, 10 API endpoints, Signal Fusion Engine
- [x] 25 new tests (202/202 total passing)
- [x] Tier-1 retrospective audit — 2 lint fixes applied

### Sprint 10 — Skill Decay & Growth Tracker (⏳)

- [ ] Skill freshness scoring
- [ ] Market demand curves
- [ ] Skill Velocity Map
- [ ] Personalized reskilling paths

### Sprint 11 — Salary Intelligence Engine™ (⏳)

- [ ] Personalized salary calculation
- [ ] Skill→salary impact modeling
- [ ] Historical trajectory tracking

### Sprint 12 — Transition Pathways (⏳)

- [ ] Anonymized career movement patterns
- [ ] Proven pivot paths
- [ ] Success probability modeling

---

## Ad-Hoc Work Log

> Unplanned tasks that emerged during development. These are logged here and attributed to the sprint during which they occurred.

| Date       | Task                                  | During Sprint | Status  | Notes                                        |
| :--------- | :------------------------------------ | :------------ | :------ | :------------------------------------------- |
| 2026-02-13 | Production branch setup & gitflow     | 6a            | ✅ Done | Documented in DEVELOPMENT_WORKFLOW.md        |
| 2026-02-13 | Retrospective audit remediation       | 5→6a          | ✅ Done | 11 findings across 12 files                  |
| 2026-02-14 | Performance optimization (Tier 1-4)   | 6a.1          | ✅ Done | Image, scroll, bundle optimizations          |
| 2026-02-14 | Professional Project Tracking System  | 6b            | ✅ Done | This system itself                           |
| 2026-02-14 | Sprint 6b Analytics implementation    | 6b            | ✅ Done | 3 models, 8 endpoints, 17 tests              |
| 2026-02-14 | Agent Customization Architecture      | Post-6b       | ✅ Done | GEMINI.md, 8 rules, 16 workflows             |
| 2026-02-15 | PPTS v1.1 — 8 audit findings          | Post-7        | ✅ Done | Volatile-only state, staleness detect        |
| 2026-02-15 | ESLint cleanup — 7 issues resolved    | Post-7        | ✅ Done | 0 errors, 0 warnings achieved                |
| 2026-02-16 | MyPy type annotation overhaul         | Post-9        | ✅ Done | 165→0 errors, 32 files, 3 bugs fixed         |
| 2026-02-16 | CI pipeline fix — ai extras           | Post-9        | ✅ Done | Test collection failures resolved            |
| 2026-02-16 | Contact page redesign (Tier-1)        | Post-9        | ✅ Done | 2-col layout, dept cards, FAQ grid           |
| 2026-02-16 | Navbar/footer/sitemap updates         | Post-9        | ✅ Done | Contact link, social links, JSON-LD          |
| 2026-02-16 | Pricing section + Tier-1 audit        | Post-9        | ✅ Done | 3 tiers, PricingCards, 9 audit fixes         |
| 2026-02-17 | Google Workspace + email aliases      | Post-9        | ✅ Done | emre@pathforge.eu + 4 aliases                |
| 2026-02-17 | Resend email integration              | Post-9        | ✅ Done | SPF/DKIM/DMARC DNS verified                  |
| 2026-02-17 | GA4 + Consent Mode v2                 | Post-9        | ✅ Done | G-EKGQR1ZWH3, consent-aware tracking         |
| 2026-02-17 | Google Search Console verified        | Post-9        | ✅ Done | DNS TXT record, robots.ts created            |
| 2026-02-17 | Vercel deploy pipeline setup          | Post-9        | ✅ Done | Monorepo config, auto-deploy disabled        |
| 2026-02-17 | CI/CD pnpm version fix                | Post-9        | ✅ Done | Removed explicit version from actions        |
| 2026-02-17 | GitHub Secrets (Vercel)               | Post-9        | ✅ Done | 3 secrets, deploy pipeline tested ✅         |
| 2026-02-18 | Railway API deployment                | Post-9        | ✅ Done | 3 fixes, health check verified ✅            |
| 2026-02-18 | DNS configuration (GoDaddy→Vercel)    | Post-9        | ✅ Done | pathforge.eu live, Valid Configuration       |
| 2026-02-18 | DKIM Google Workspace                 | Post-9        | ✅ Done | google.\_domainkey TXT, auth active          |
| 2026-02-18 | Vercel + Railway env vars             | Post-9        | ✅ Done | 13 Railway + 6 Vercel vars configured        |
| 2026-02-19 | Turnstile error resolution            | Post-9        | ✅ Done | useTurnstile hook, 300030/preload fix        |
| 2026-02-19 | Waitlist duplicate handling           | Post-9        | ✅ Done | Duplicate detection, diff emails, rate limit |
| 2026-02-19 | UI/UX polish session                  | Post-9        | ✅ Done | 6 issues + drag/swipe, deployed to prod      |
| 2026-02-19 | Turnstile CSP fix (execute-on-demand) | Post-9        | ✅ Done | execution: execute mode, Tier-1 audit ✅     |

---

## Sprint Velocity

| Sprint | Planned Tasks | Completed | Ad-Hoc Added | Sessions |
| :----- | :------------ | :-------- | :----------- | :------- |
| 1-2    | 12            | 12        | 0            | ~4       |
| 3      | 5             | 5         | 0            | ~2       |
| 4      | 8             | 8         | 0            | ~3       |
| 5      | 6             | 6         | 2            | ~3       |
| 6a     | 12            | 12        | 3            | ~3       |
| 6a.1   | 6             | 6         | 0            | 1        |
| 6b     | 3             | 3         | 2            | 1        |
| 7      | 6             | 7         | 1            | 1        |
| 8      | 3             | 9         | 1            | 2        |
| 9      | 8             | 11        | 3            | 1        |

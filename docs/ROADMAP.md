# PathForge — Live Sprint Board

> **Single Source of Truth** for all sprint tracking and task management.
> **Last Updated**: 2026-02-14 | **Current Phase**: A (MVP)

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

### Sprint 6b — Analytics (📋 Current)

> Resumes original Sprint 6 definition from ARCHITECTURE.md.

- [ ] Funnel pipeline event tracking
- [ ] Market intelligence dashboard
- [ ] CV A/B tracking system

### Sprint 7 — Mobile + Production (⏳ Upcoming)

> Original definition: Expo mobile app, push notifications, security audit, monitoring.

- [ ] GitHub Actions CI/CD pipeline (ci.yml, deploy.yml)
- [ ] Alembic migration for CHECK constraint on applications.status
- [ ] Background task queue (Celery/Dramatiq) for AI pipeline
- [ ] Redis-backed token blacklist for JWT revocation
- [ ] Security audit
- [ ] Production deployment (Vercel + Railway)

---

## Phase B: Career Intelligence (Post-MVP)

> Sprint definitions from ARCHITECTURE.md Section 7, Phase B.

### Sprint 8 — Career DNA Activation (⏳)

- [ ] Living Career DNA profiles
- [ ] Hidden skills discovery
- [ ] Growth vector calculation

### Sprint 9 — Career Threat Radar™ (⏳)

- [ ] Industry trend monitoring
- [ ] Layoff signal detection
- [ ] Automation risk scoring
- [ ] Preemptive career alerts

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

| Date       | Task                                 | During Sprint | Status    | Notes                                 |
| :--------- | :----------------------------------- | :------------ | :-------- | :------------------------------------ |
| 2026-02-13 | Production branch setup & gitflow    | 6a            | ✅ Done   | Documented in DEVELOPMENT_WORKFLOW.md |
| 2026-02-13 | Retrospective audit remediation      | 5→6a          | ✅ Done   | 11 findings across 12 files           |
| 2026-02-14 | Performance optimization (Tier 1-4)  | 6a.1          | ✅ Done   | Image, scroll, bundle optimizations   |
| 2026-02-14 | Professional Project Tracking System | 6b            | 🔄 Active | This system itself                    |

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
| 6b     | 3             | 0         | 1            | —        |

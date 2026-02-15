# Changelog

All notable changes to PathForge, organized by sprint.
Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [Ad-Hoc] — PPTS v1.1 & Code Quality — 2026-02-15

### Changed

- **PPTS v1.1**: Resolved 8 audit findings — volatile-only `session-state.json` (v2.1.0), slimmed `session-context.md` (102→51 lines), staleness detection, sync verification, honest labeling, rule deduplication
- **ESLint cleanup**: Resolved all 7 lint issues (2 errors, 5 warnings → 0 problems)
  - Replaced impure `Math.random()` with `useId`-based deterministic hash (`sidebar.tsx`)
  - Moved reduced-motion check from effect to lazy `useState` initializer (`use-scroll-animation.ts`)
  - Removed unused imports (`Link`, `Image`, `useState`) and unused state setters
- Updated `sprint-tracking.md` to v1.1.0
- Updated `GEMINI.md` session file paths to `.agent/` prefix

---

## [Sprint 7] — Production Readiness — 2026-02-14

### Added

- GitHub Actions CI/CD: `ci.yml` (path-filtered lint+test+build) + `deploy.yml` (Railway + Vercel)
- Alembic migration `5d6e7f8g9h0i` — CHECK constraint on `applications.status`
- Redis-backed JWT token blacklist (`token_blacklist.py`) with SETEX auto-TTL
- `/auth/logout` endpoint with `jti`-based token revocation
- `SecurityHeadersMiddleware` — OWASP-compliant security headers (7 headers)
- ARQ async background worker with 3 task functions + cron health check
- Production CORS origins + `effective_cors_origins` property
- `.env.production.example` — documented production environment template
- `railway.toml` — Railway config-as-code with health check
- `docs/TODO-pre-production.md` — deployment checklist
- Worker service added to `docker-compose.yml`

### Changed

- `security.py` — access tokens now include `jti` claim for revocation
- `Dockerfile.worker` CMD updated from placeholder to ARQ entrypoint
- `pyproject.toml` — added `arq`, `bcrypt`, `aiosqlite` dependencies
- `main.py` — environment-aware CORS using `effective_cors_origins`

---

## [Ad-Hoc] — Agent Customization Architecture — 2026-02-14

### Added

- `GEMINI.md` global rules file (cross-workspace identity, principles, code standards)
- Workspace rules: `architecture.md`, `documentation.md` (2 new)
- Workflows: `/review` (quality gate), `/migrate` (Alembic lifecycle) (2 new)
- `docs/AGENT_ARCHITECTURE.md` — comprehensive 3-layer system reference
- `docs/MCP_ARCHITECTURE.md` — MCP server strategy and expansion plan

### Changed

- Enhanced `coding-style.md` with Python/FastAPI standards
- Enhanced `security.md` with GDPR compliance and AI pipeline safety
- Enhanced `testing.md` with pytest conventions and example patterns
- Updated `/deploy` workflow with PathForge-specific Vercel + Railway config
- Updated `session-state.json` capabilities: rules 6→8, workflows 14→16

---

## [Sprint 6b] — Analytics — 2026-02-14

### Added

- **Funnel pipeline**: `FunnelEvent` model + 3 endpoints (record, metrics, timeline)
- **Market intelligence**: `MarketInsight` model + 2 endpoints (list, generate)
- **CV A/B experiments**: `CVExperiment` model + 3 endpoints (list, create, result)
- Analytics service layer with 8 public methods + 5 compute functions
- 15 Pydantic schemas for request/response validation
- Alembic migration `4c5d6e7f8g9h` — 3 tables, 10 indexes
- Frontend analytics dashboard at `/dashboard/analytics`
- Typed API client with 10 TypeScript interfaces + 8 functions
- 17 new tests (146 total, 0 failures)

### Fixed

- `FunnelEventResponse` metadata field mapping (`validation_alias="metadata_"`)

---

## [Sprint 6a.1] — Performance Optimization — 2026-02-14

### Added

- `useScrollState` hook — singleton scroll listener using `useSyncExternalStore`
- `@next/bundle-analyzer` integration with `analyze` script
- CSS-only scroll progress indicator using `animation-timeline: scroll()`

### Changed

- `TestimonialsMarquee` and `FaqAccordion` converted to dynamic imports (`next/dynamic`)
- `BackToTop` and `NavScrollEffect` refactored to use shared `useScrollState` hook
- `ScrollProgress` converted from JavaScript client component to pure CSS server component
- All hero/testimonial images converted to WebP format (30-70% size reduction)

### Fixed

- Infinite re-render loop in `useScrollState` — fixed with module-level `SERVER_SNAPSHOT` constant

---

## [Sprint 6a] — Navbar & UI Excellence — 2026-02-13

### Added

- Floating pill navbar with custom `--breakpoint-nav: 860px`
- Desktop CTA cluster with gradient border (primary→accent)
- Full-screen mobile drawer with React portal + staggered animations
- Hamburger↔X morphing toggle with pixel-perfect alignment
- `ThemeToggle` component with `sm`/`lg` variants + hydration safety
- `next-themes` integration with `ThemeProvider`
- Theme-aware logos (`logo-light.png` / `logo-dark.png`) via CSS switching
- Light mode color palette (oklch-based)
- Dark-scoped gradient-text, glass-card, elevated-card, problem-card styles
- Body scroll lock + Escape key handler on mobile drawer
- Development Workflow documentation (`docs/DEVELOPMENT_WORKFLOW.md`)
- Gitflow strategy: `main` (dev) + `production` (releases)
- Conventional Commits convention

### Changed

- Nav section renames: "How it Works" → "The Process", "Comparison" → "Pricing"
- Social icons + theme toggle scaled 10% for mobile touch targets

### Fixed

- Hydration mismatch — replaced `typeof document` check with `useSyncExternalStore`

---

## [Sprint 5] — Application Flow — 2026-02-12

### Added

- Application Kanban pipeline with status tracking
- Company blacklist system with current employer protection
- Rate limiting controls (10/hour, 30/day)
- Retrospective Audit — 11 findings remediated across 12 files

---

## [Sprint 4] — Web App — 2026-02-11

### Added

- Next.js 15 landing page (marketing site)
- Waitlist system with hero form
- Testimonials marquee with animated border glow
- FAQ accordion section
- Footer redesign (status badge, NL trust badge, Company column)
- Back-to-top button with glass effect
- Navbar scroll glass effect
- Interactive CSS enhancements (265+ lines)

---

## [Sprint 3] — Job Aggregation — 2026-02-10

### Added

- Adzuna API provider with salary data
- Jooble API provider with multilingual support
- Job deduplication pipeline
- Embedding pipeline for job listings
- 13 AI service unit tests

---

## [Sprint 1-2] — Foundation + AI Engine — 2026-02-09

### Added

- Monorepo setup (pnpm workspace, Turborepo)
- FastAPI backend (Python 3.12+)
- PostgreSQL + pgvector database schema
- JWT authentication with refresh tokens
- Docker Compose for local development
- Alembic migration framework
- Resume parser (AI-powered structured extraction)
- Voyage AI v4 embedding integration
- Semantic matching engine (cosine + HNSW)
- CV tailoring pipeline (LLM-powered)
- Architecture document (ARCHITECTURE.md v2.0.0)
- Brand constants framework
- GitHub repository setup

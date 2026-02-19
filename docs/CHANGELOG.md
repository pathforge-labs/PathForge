# Changelog

All notable changes to PathForge, organized by sprint.
Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [Ad-Hoc] — Turnstile CSP Console Fix — 2026-02-19

### Changed

- **Turnstile execution mode** — switched from implicit (challenge on page load) to `execution: 'execute'` (challenge on form submit only)
- **Script loading strategy** — changed from `afterInteractive` to `lazyOnload` for deferred loading
- **Form components** — both `waitlist-form` and `contact-form` now call `execute()` on submit

### Fixed

- **CSP fallback warnings** — eliminated `script-src not explicitly set` console errors
- **Private Access Token 401s** — no longer triggered on idle page load
- **Preload timing warnings** — Cloudflare challenge resources no longer preloaded unnecessarily

---

## [Ad-Hoc] — UI/UX Polish & Testimonials — 2026-02-19

### Added

- **Ali Avci testimonial** — new card with `.webp` photo, cybersecurity/enterprise perspective
- **Testimonial drag-to-scroll** — desktop Pointer Events API with grab cursor, drag threshold, click prevention
- **Testimonial touch swipe** — mobile horizontal gesture detection (doesn't hijack vertical scroll)
- **Testimonial arrow controls** — left/right chevron buttons with brand gradient styling

### Changed

- **Scroll-to-top button** — enlarged to 50×50px, brand gradient bg, white icon, rounded-full
- **Footer copyright** — `"PathForge by PathForge"` → `"PathForge. All rights reserved."`
- **Navbar** — removed gradient pipe divider between theme toggle and CTA
- **PWA theme-color** — moved to `viewport` export with dark/light media queries (Next.js 16)
- **Müslüm Gezgin photo** — updated to clean version (no "Open To Work" banner)

---

## [Ad-Hoc] — Waitlist Duplicate Handling — 2026-02-19

### Added

- **Duplicate detection** — proactive check before Resend contact creation
- **Differentiated emails** — new subscribers get welcome email, returning subscribers get acknowledgment
- **Rate limiting** — IP-based throttle on waitlist endpoint
- **Turnstile CAPTCHA** — bot protection via Cloudflare Turnstile integration

---

## [Ad-Hoc] — Turnstile Error Resolution — 2026-02-19

### Added

- **`useTurnstile` hook** — centralized Turnstile widget lifecycle management
- **Global script loading** — Turnstile script loaded once in marketing layout
- **Dev environment skip** — Turnstile disabled in development to prevent preload warnings

### Fixed

- **Error 300030** — resolved by proper widget cleanup and re-render handling
- **Preload warnings** — eliminated by loading script at layout level
- **Widget hang** — fixed with explicit reset/remove lifecycle in hook

---

## [Ad-Hoc] — Security Hardening & Deploy Optimization — 2026-02-18

### Added

- **API security hardening** — RFC 9116 `security.txt`, `robots.txt`, bot trap middleware, favicon 204 handler
- **BotTrapMiddleware** — 23 exploit paths blocked in production
- **SECURITY.md** — GitHub Security Policy for responsible disclosure
- **Production docs protection** — `/docs`, `/redoc`, `/openapi.json` disabled in production
- 6 new tests (208/208 total passing)

### Changed

- **Pre-push hook** — fast mode default (lint + types only, ~12s vs ~7min)
- **`ci-local.ps1`** — added `-Fast` switch, skips Pytest + Next.js build
- **Production merge detection** — fixed `--no-ff` merge skip (ancestor check direction)
- **LOCAL-CI-GATE.md** — rewritten with Tier-1 Quality Strategy documentation

### Removed

- **`deploy.yml`** — removed redundant GitHub Actions deploy workflow (Railway native integration handles deploys)

### Fixed

- **Railway deploy conflict** — `railway up` CLI blocked by native GitHub integration (403 Forbidden)
- **Security endpoints not deployed** — Railway watchPatterns skipped merge commits, forced rebuild via trigger commit

---

## [Ad-Hoc] — Railway Deploy, DNS & DKIM — 2026-02-18

### Added

- **Railway API deployment** — 3 fixes applied (port binding, watchPatterns, `.[ai]` deps), health check verified
- **Redis service** — added to Railway, `REDIS_URL` + `RATELIMIT_STORAGE_URI` configured
- **DNS configuration** — `pathforge.eu` A record → Vercel, `www` CNAME → Vercel, `api` CNAME → Railway
- **DKIM authentication** — Google Workspace key generated, `google._domainkey` TXT record added, verification active
- **13 Railway env vars** — JWT secrets, DB, Redis, CORS, port configured
- **6 Vercel env vars** — Resend keys, GA4 ID, API URL, Corepack (Production-only)
- **RAILWAY_TOKEN** — generated and added to GitHub Secrets

### Changed

- `Dockerfile.api` — `pip install .` → `pip install ".[ai]"` (litellm/langchain/voyageai)
- `railway.toml` — hardcoded `--port 8000`, expanded `watchPatterns`

---

## [Ad-Hoc] — Production Infrastructure Setup — 2026-02-17

### Added

- **Google Workspace** — `emre@pathforge.eu` with 4 aliases (hello, support, privacy, info)
- **Resend integration** — SPF, DKIM, DMARC DNS records verified, API key configured
- **GA4 analytics** — `G-EKGQR1ZWH3` with Consent Mode v2 implementation
- **Google Search Console** — DNS TXT verification, `robots.ts` with Googlebot rules
- **Vercel deploy pipeline** — monorepo build config, auto-deploy disabled (`exit 0`)
- **GitHub Secrets** — `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_TOKEN` configured
- **Vercel project** linked via CLI (`.vercel/project.json`)

### Fixed

- **pnpm version conflict** — removed explicit `version: 10` from `pnpm/action-setup` in `deploy.yml` and `ci.yml` (conflicts with `packageManager` field in `package.json`)

### Changed

- Root `package.json` — added `packageManager: "pnpm@10.28.2"` for Vercel Corepack
- Vercel production branch set to `production`, Node.js version set to `22.x`

---

## [Ad-Hoc] — Contact Page Redesign & Navigation — 2026-02-16

### Added

- **Contact page redesign** — premium Tier-1 2-column layout inspired by BeSync:
  - Department cards (General Inquiries, Business & Press with COMING SOON badge, Location)
  - Subject `<select>` dropdown with ChevronDown indicator (6 categories)
  - 2×2 FAQ grid, enhanced social cards with brand-color hover effects
  - Ambient radial gradient blobs, glassmorphism card styling
  - Response time trust badge (24–48 hours), GDPR + data safety badges
- **Contact API route** — `POST /api/contact` with Resend email, XSS prevention, rate limiting, subject allowlist validation
- **Navigation updates** — Contact link added to navbar, mobile nav, and footer
- `/contact` added to `sitemap.ts` and JSON-LD breadcrumbs
- `brand.ts` updated with social links (`linkedin`, `instagram`, `x`) and company constants

### Changed

- Removed "Sign In" from navbar (pre-launch)
- Frontend form inputs now include `maxLength` to match backend validation limits

---

## [Ad-Hoc] — MyPy Type Safety & CI Fix — 2026-02-16

### Fixed

- **MyPy type overhaul**: Resolved all 165 type errors → 0 across 69 source files (32 files modified)
  - Generic type parameterization (`dict` → `dict[str, Any]`, `list` → `list[Any]`)
  - Forward reference handling (`TYPE_CHECKING` + `from __future__ import annotations`)
  - 3 real bugs discovered: missing `user_id` args in `ResumeService.get_by_id` calls
  - 2 test mock fixes: `uselist=False` relationship patterns
  - `CareerDNAChildModel` TypeAlias for type-safe generic helpers
  - `AlertPreference` model fields aligned: `dict[str, Any]` → `list[str]`
- **CI pipeline**: Added `.[ai]` extras to `pip install` in `ci.yml` — resolved `voyageai`/`litellm` test collection failures
- **LOCAL-CI-GATE.md**: Updated output example, design decisions, setup instructions

---

## [Sprint 9] — Career Threat Radar™ — 2026-02-15

### Added

- **Career Threat Radar™** — full threat intelligence system:
  - 6 SQLAlchemy models (`AutomationRisk`, `IndustryTrend`, `SkillShieldEntry`, `CareerResilienceSnapshot`, `ThreatAlert`, `AlertPreference`) + 7 StrEnums
  - 14 Pydantic schemas for request/response validation
  - Alembic migration `7f8g9h0i1j2k` — 6 tables with FK CASCADE + indexes
  - ONET Frey-Osborne dataset (130 SOC codes, 20 categories) + cached data loader
  - AI analyzer: 4 LLM methods with versioned prompt templates
  - Signal Fusion Engine: CRS™ (5-factor composite) + Career Moat Score (4-dimension)
  - 10 REST endpoints at `/api/v1/threat-radar`
  - 25 new tests (202/202 total passing)
- **Ethics safeguards**: confidence cap (0.85), HIGH alert evidence gate (≥2 sources), mandatory Threat→Opportunity pairing, anti-catastrophizing prompts

---

## [Sprint 8] — Career DNA Activation — 2026-02-15

### Added

- **Career DNA™** — 7 SQLAlchemy models, 12 Pydantic schemas, 5 LLM methods + 1 data-driven
- CareerDNAService lifecycle orchestration + 10 REST endpoints
- Alembic migration for 7 Career DNA tables
- 22 tests (168/168 total passing)
- Prompt injection sanitization (8-layer OWASP LLM01 defense)
- Rate limiting on `/career-dna/generate` (3/min per user)

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

# Changelog

All notable changes to PathForge, organized by sprint.
Format follows [Keep a Changelog](https://keepachangelog.com/).

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

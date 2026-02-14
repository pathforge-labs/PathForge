# Session Context — PathForge

> **Framework**: Antigravity AI Kit v2.0.0
> **Last Updated**: 2026-02-13T19:00:00+01:00

---

## 📋 Last Session Summary

**Date**: 2026-02-13
**Focus**: Sprint 6 — Navbar, Drawer, Theme System + Gitflow Setup

### Completed

- ✅ Floating pill navbar with custom `--breakpoint-nav: 860px`
- ✅ Desktop CTA cluster with gradient border (primary→accent padding trick)
- ✅ Gradient pipe dividers between CTA elements
- ✅ Full-screen mobile drawer with portal + staggered animations
- ✅ Hamburger↔X morphing toggle with pixel-perfect alignment (`top-[24px] right-[36px]`)
- ✅ `ThemeToggle` component with `sm`/`lg` size variants + `useSyncExternalStore` hydration safety
- ✅ `next-themes` integration with `ThemeProvider` + `suppressHydrationWarning`
- ✅ Theme-aware logos (`logo-light.png` / `logo-dark.png`) via CSS switching (`dark:hidden`/`hidden dark:block`)
- ✅ Comprehensive light mode color palette (oklch-based)
- ✅ Dark-scoped gradient-text, glass-card, elevated-card, problem-card
- ✅ Nav section renames: "How it Works" → "The Process", "Comparison" → "Pricing"
- ✅ Body scroll lock + Escape key handler on mobile drawer
- ✅ Social icons + theme toggle scaled 10% for mobile touch targets
- ✅ Hydration fix: `useSyncExternalStore` replaces `typeof document` check
- ✅ Development Workflow documentation (`docs/DEVELOPMENT_WORKFLOW.md`) — 13 sections
- ✅ Gitflow strategy established: `main` (dev) + `production` (releases)
- ✅ Merge policy defined: sprint-end releases, milestone releases, hotfix bypass
- ✅ Conventional Commits convention adopted
- ✅ Committed: `4efad92`, `a717997`, `09f5ae0`

### Previous Sessions (cumulative)

- ✅ Sprint 3 — AI Engine (resume parser, embeddings, matching, CV tailor)
- ✅ Sprint 4 — Job Ingestion (Adzuna + Jooble providers, dedup, embed pipeline)
- ✅ Sprint 5 — Application Pipeline (Kanban, blacklist, rate limiting)
- ✅ Retrospective Audit — 11 findings remediated across 12 files
- ✅ Landing page + waitlist + footer + testimonials + FAQ
- ✅ Brand constants framework + GitHub repo setup

### Final State

- **Branch**: `main` (`09f5ae0`)
- **Production**: `production` (`a717997`)
- **Git Status**: Clean, up to date with `origin/main`

---

## 📌 Sprint Tracking

> **⚠️ Task tracking has moved to `docs/ROADMAP.md` (SSOT)**
> See `.agent/rules/sprint-tracking.md` for the full protocol.
>
> Do NOT add task lists to this file. This section is a pointer only.

---

## 🔧 Working Context

- **Repository**: https://github.com/besync-labs/PathForge.git
- **Branches**: `main` (development), `production` (releases)
- **Domain**: pathforge.eu (primary), pathforge.nl (301 redirect)
- **Framework**: Next.js 15 + TailwindCSS v4 (Turborepo monorepo)
- **Backend**: FastAPI + PostgreSQL + pgvector + Alembic
- **Package Manager**: pnpm
- **Workflow**: `docs/DEVELOPMENT_WORKFLOW.md` (Conventional Commits, Gitflow, Quality Gates)

---

## 📂 Key File Locations

| File                                       | Purpose                                          |
| :----------------------------------------- | :----------------------------------------------- |
| `apps/api/app/ai/`                         | AI engine (parser, embeddings, matching, tailor) |
| `apps/api/app/api/v1/`                     | API routes (auth, ai, applications, blacklist)   |
| `apps/api/app/services/`                   | Service layer (application service)              |
| `apps/api/app/jobs/`                       | Job ingestion pipeline                           |
| `apps/api/app/core/security.py`            | JWT + auth                                       |
| `apps/api/tests/`                          | Test suite (129 tests)                           |
| `apps/web/src/app/(marketing)/page.tsx`    | Landing page                                     |
| `apps/web/src/components/navbar.tsx`       | Desktop navbar (floating pill)                   |
| `apps/web/src/components/mobile-nav.tsx`   | Mobile drawer                                    |
| `apps/web/src/components/theme-toggle.tsx` | Theme toggle component                           |
| `apps/web/src/app/globals.css`             | Design system (light/dark tokens)                |
| `docs/DEVELOPMENT_WORKFLOW.md`             | Gitflow, commits, quality gates                  |
| `.agent/session-context.md`                | This file                                        |
| `.agent/session-state.json`                | Machine-readable state                           |

---

## 🔄 Quick Resume Commands

```bash
git status
git log --oneline -5
git branch -vv
cd apps/api && .venv/Scripts/python -m pytest tests/ -q
cd apps/web && pnpm build
```

---

## 📝 Handoff Notes

- Gitflow is now live: `main` for dev, `production` for releases, merge at sprint-end
- Follow `docs/DEVELOPMENT_WORKFLOW.md` for all Git operations going forward
- Conventional Commits required: `type(scope): description`
- Theme system fully operational — verify both dark/light modes for all UI changes
- Sprint 6 navbar work is mostly complete, some polish tasks may remain
- Next session: continue Sprint 6 or start Sprint 7 (Dashboard)

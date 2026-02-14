# Session Context — PathForge

> **Framework**: Antigravity AI Kit v2.0.0
> **Last Updated**: 2026-02-14T03:50:00+01:00

---

## 📋 Last Session Summary

**Date**: 2026-02-14
**Focus**: Sprint 6b — Analytics (Funnel Pipeline, Market Intelligence, CV A/B Tracking)

### Completed

- ✅ Professional Project Tracking System (ROADMAP.md as SSOT)
- ✅ Sprint 6a.1 — Performance Optimization (WebP, dynamic imports, scroll consolidation)
- ✅ Sprint 6b — Analytics: 3 models, 15 schemas, 8 service methods, 8 API endpoints
- ✅ Alembic migration for 3 analytics tables (10 indexes)
- ✅ Frontend analytics dashboard at `/dashboard/analytics`
- ✅ 17 new tests, 146/146 total passing
- ✅ Tier-1 Retrospective Audit — all Compliant, 0 blockers
- ✅ Committed: `477ff86` (analytics), session-end commit pending

### Previous Sessions (cumulative)

- ✅ Sprint 1-2 — Foundation + AI Engine
- ✅ Sprint 3 — Job Aggregation (Adzuna + Jooble)
- ✅ Sprint 5 — Application Pipeline (Kanban, blacklist, rate limiting)
- ✅ Sprint 6a — Navbar, Drawer, Theme System + Gitflow
- ✅ Sprint 6a.1 — Performance Optimization
- ✅ Sprint 6b — Analytics

### Final State

- **Branch**: `main`
- **Git Status**: Clean after session-end commit
- **Tests**: 146/146 passing

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

| File                                      | Purpose                                                   |
| :---------------------------------------- | :-------------------------------------------------------- |
| `apps/api/app/ai/`                        | AI engine (parser, embeddings, matching, tailor)          |
| `apps/api/app/api/v1/`                    | API routes (auth, ai, applications, blacklist, analytics) |
| `apps/api/app/services/`                  | Service layer (application, analytics)                    |
| `apps/api/app/models/analytics.py`        | Analytics models (Funnel, Insight, Experiment)            |
| `apps/api/app/core/security.py`           | JWT + auth                                                |
| `apps/api/tests/`                         | Test suite (146 tests)                                    |
| `apps/web/src/app/(dashboard)/dashboard/` | Dashboard pages (main + analytics)                        |
| `apps/web/src/lib/api.ts`                 | Typed API client                                          |
| `docs/ROADMAP.md`                         | Sprint board (SSOT)                                       |
| `docs/CHANGELOG.md`                       | Per-sprint changelog                                      |

---

## 🔄 Quick Resume Commands

```bash
git status
git log --oneline -5
cd apps/api && .venv/Scripts/python -m pytest tests/ -q
cd apps/web && pnpm build
```

---

## 📝 Handoff Notes

- Sprint 6b Analytics is COMPLETE — all 3 planned tasks delivered
- Next: Sprint 7 — Mobile + Production (CI/CD, background tasks, Redis, deployment)
- 3 optional analytics enhancements noted in retrospective audit for future sprints
- Gitflow is live: `main` for dev, `production` for releases
- Follow `docs/DEVELOPMENT_WORKFLOW.md` for all Git operations

# Session Context — PathForge

> **Framework**: Antigravity AI Kit v2.0.0
> **Last Updated**: 2026-02-14T14:45:00+01:00

---

## 📋 Last Session Summary

**Date**: 2026-02-14
**Focus**: Agent Customization Architecture — Professional system design and implementation

### Completed

- ✅ Industry research (Google, Anthropic, OpenAI, Vercel, Stripe, Amazon, Apple)
- ✅ Created `GEMINI.md` global rules (identity, principles, code quality, session protocol)
- ✅ Enhanced 3 workspace rules (coding-style, security, testing) with Python backend standards
- ✅ Created 2 new workspace rules (architecture, documentation)
- ✅ Created 2 new workflows (/review, /migrate)
- ✅ Updated /deploy workflow with PathForge-specific Vercel + Railway config
- ✅ Created `docs/MCP_ARCHITECTURE.md` — MCP server strategy
- ✅ Created `docs/AGENT_ARCHITECTURE.md` — comprehensive system reference (11.5 KB)
- ✅ Committed: `8425120` (docs(agent): implement professional agent customization architecture)
- ✅ Build: 23/23 routes, Tests: 146/146 passing

### Previous Sessions (cumulative)

- ✅ Sprint 1-2 — Foundation + AI Engine
- ✅ Sprint 3 — Job Aggregation (Adzuna + Jooble)
- ✅ Sprint 5 — Application Pipeline (Kanban, blacklist, rate limiting)
- ✅ Sprint 6a — Navbar, Drawer, Theme System + Gitflow
- ✅ Sprint 6a.1 — Performance Optimization
- ✅ Sprint 6b — Analytics

### Final State

- **Branch**: `main`
- **Git Status**: Clean, pushed to origin
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
| `docs/AGENT_ARCHITECTURE.md`              | Agent customization system reference                      |
| `docs/MCP_ARCHITECTURE.md`                | MCP server strategy                                       |

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

- Agent Customization System is COMPLETE — 3-layer architecture (Global → Workspace → MCP)
- `GEMINI.md` created at `c:\Users\infoe\.gemini\GEMINI.md` — works with Claude Opus 4.6 AND Gemini
- Capability inventory: 108 total (18 agents, 32 commands, 27 skills, 16 workflows, 8 rules, 4 checklists, 1 MCP server)
- Next: Sprint 7 — Mobile + Production (CI/CD, background tasks, Redis, deployment)
- Gitflow is live: `main` for dev, `production` for releases
- Follow `docs/DEVELOPMENT_WORKFLOW.md` for all Git operations

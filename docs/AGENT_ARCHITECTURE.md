# PathForge Agent Architecture

> **Version**: 1.0.0
> **Effective**: 2026-02-14
> **Framework**: Antigravity AI Kit v2.0.0

---

## System Overview

PathForge uses a **three-layer agent customization architecture** within the Antigravity environment. This design is model-agnostic — it functions identically whether the active model is Claude Opus 4.6, Gemini, or any future model.

```
┌───────────────────────────────────────────────────────────────────┐
│                    Antigravity Extension                          │
│                    (VS Code Agent Host)                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Layer 1: GLOBAL RULES                                      │ │
│  │  c:\Users\infoe\.gemini\GEMINI.md                           │ │
│  │  → Identity, principles, universal code standards           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Layer 2: WORKSPACE CONFIGURATION                           │ │
│  │  .agent/rules/     → Domain-specific enforcement rules      │ │
│  │  .agent/workflows/ → Slash-command operational procedures   │ │
│  │  .agent/skills/    → On-demand specialist knowledge         │ │
│  │  .agent/agents/    → Role-specific instruction sets         │ │
│  │  .agent/commands/  → Reusable task shortcuts                │ │
│  │  .agent/checklists/→ Session start/end protocols            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Layer 3: MCP SERVERS                                       │ │
│  │  Extension-level tool integrations                          │ │
│  │  → GitKraken (active), Database tools (planned)             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Active Model: Claude Opus 4.6 / Gemini                    │ │
│  │  Context = Layer 1 + Layer 2 + Layer 3 + User Prompt       │ │
│  └─────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

---

## Design Philosophy

Inspired by leading industry architectures:

| Source                                       | Pattern Adopted                                   | Application in PathForge                   |
| :------------------------------------------- | :------------------------------------------------ | :----------------------------------------- |
| **Anthropic** (CLAUDE.md, Constitutional AI) | Structured rules files as persistent agent memory | `GEMINI.md` + `.agent/rules/`              |
| **OpenAI** (Agent SDK)                       | Reasoner / Toolbox / Governor separation          | Agents reason, MCP tools act, rules govern |
| **Google** (Gemini Code Assist)              | GEMINI.md + MCP Store + Customizations UI         | Three-layer architecture                   |
| **Vercel** (AI SDK)                          | Tool-first agents with streaming                  | Workflows as operational procedures        |
| **Stripe** (Writing culture)                 | One document per decision, read-before-discuss    | ROADMAP.md as SSOT                         |
| **Amazon** (Narrative memos)                 | Document-driven decisions over verbal agreements  | Architecture docs survive sessions         |
| **Linear** (Cycles)                          | Sprint state visible at a glance                  | ROADMAP.md sprint board format             |

---

## Layer 1: Global Rules (`GEMINI.md`)

**Path**: `c:\Users\infoe\.gemini\GEMINI.md`
**Scope**: All workspaces (PathForge, BeSync, AegisQA, future projects)

| Section                 | Purpose                                 |
| :---------------------- | :-------------------------------------- |
| Identity                | Trust-Grade AI partner definition       |
| Operating Principles    | 5 immutable priority rules              |
| Communication Standards | Tone, error handling, format            |
| Code Quality Standards  | Universal + TypeScript + Python         |
| Git Discipline          | Conventional Commits, pre-commit checks |
| Session Protocol        | Start/end checklist enforcement         |
| Documentation Standards | CHANGELOG, ROADMAP, inline comments     |
| MCP Server Awareness    | Prefer MCP tools over raw CLI           |

---

## Layer 2: Workspace Configuration

### Rules (`.agent/rules/`)

Enforcement rules specific to PathForge:

| Rule                 | Priority | Scope                                        |
| :------------------- | :------- | :------------------------------------------- |
| `quality-gate.md`    | CRITICAL | Pre-execution research and market validation |
| `sprint-tracking.md` | CRITICAL | ROADMAP.md as SSOT, session lifecycle        |
| `security.md`        | CRITICAL | GDPR, PII protection, API security           |
| `architecture.md`    | HIGH     | Monorepo structure, service boundaries       |
| `coding-style.md`    | HIGH     | TypeScript + Python conventions              |
| `testing.md`         | HIGH     | pytest + Jest patterns, TDD                  |
| `git-workflow.md`    | HIGH     | Conventional Commits, branch naming          |
| `documentation.md`   | HIGH     | Document hierarchy, preservation rule        |

### Workflows (`.agent/workflows/`)

Slash-command operational procedures:

| Command          | Purpose                                                       |
| :--------------- | :------------------------------------------------------------ |
| `/plan`          | Implementation planning with Socratic gate                    |
| `/create`        | New feature scaffolding                                       |
| `/enhance`       | Iterative feature development                                 |
| `/review`        | Sequential quality gate (lint, types, tests, security, build) |
| `/test`          | Test writing and execution                                    |
| `/deploy`        | Production deployment (Vercel + Railway)                      |
| `/migrate`       | Alembic database migration lifecycle                          |
| `/debug`         | Systematic problem investigation                              |
| `/status`        | Project state overview                                        |
| `/preview`       | Dev server management                                         |
| `/brainstorm`    | Structured option exploration                                 |
| `/orchestrate`   | Multi-agent task coordination                                 |
| `/quality-gate`  | Tier-1 pre-task research validation                           |
| `/retrospective` | Full product/architecture/AI audit                            |
| `/ui-ux-pro-max` | Premium UI/UX design workflow                                 |

### Skills (27 Specialist Modules)

On-demand knowledge loaded based on task context. Key skills:

| Skill                   | Purpose                              |
| :---------------------- | :----------------------------------- |
| `typescript-expert`     | Advanced TypeScript patterns         |
| `frontend-patterns`     | React/Next.js with Vercel guidelines |
| `api-patterns`          | RESTful API design                   |
| `database-design`       | Schema design and optimization       |
| `security-practices`    | Vulnerability prevention             |
| `testing-patterns`      | Quality assurance strategies         |
| `deployment-procedures` | CI/CD and rollback strategies        |
| `ui-ux-pro-max`         | 50+ styles, anti-AI-slop design      |

### Agents (18 Specialist Roles)

| Agent                 | Responsibility                    |
| :-------------------- | :-------------------------------- |
| Planner               | Feature planning, risk assessment |
| Architect             | System design, ADR creation       |
| Code Reviewer         | Quality + security review         |
| TDD Guide             | Test-first enforcement            |
| Security Reviewer     | Vulnerability analysis            |
| Backend Specialist    | FastAPI/SQLAlchemy patterns       |
| Frontend Specialist   | Next.js/React development         |
| Database Architect    | Schema design, query optimization |
| DevOps Engineer       | CI/CD, deployment                 |
| Performance Optimizer | Core Web Vitals optimization      |

---

## Layer 3: MCP Servers

See [MCP_ARCHITECTURE.md](file:///d:/ProfesionalDevelopment/AntigravityProjects/pathforge/docs/MCP_ARCHITECTURE.md) for full details.

**Active**: GitKraken (Git operations)
**Planned**: Database tooling, Cloud deployment

---

## Capability Inventory

| Category    | Count   | Location             |
| :---------- | :------ | :------------------- |
| Agents      | 18      | `.agent/agents/`     |
| Commands    | 32      | `.agent/commands/`   |
| Skills      | 27      | `.agent/skills/`     |
| Workflows   | 16      | `.agent/workflows/`  |
| Rules       | 8       | `.agent/rules/`      |
| Checklists  | 4       | `.agent/checklists/` |
| MCP Servers | 1       | Extension-level      |
| **Total**   | **106** |                      |

---

## Maintenance Guidelines

1. **Rules**: Update when coding standards or architectural decisions change
2. **Workflows**: Add when a repeatable multi-step process emerges
3. **Skills**: Add when a new technical domain is introduced
4. **MCP Servers**: Add only when selection criteria (see MCP_ARCHITECTURE.md) are met
5. **GEMINI.md**: Update only for cross-workspace changes; project-specific rules go in `.agent/rules/`
6. **This document**: Update when any capability is added, removed, or restructured

---

## Version History

| Date       | Version | Change                                                            |
| :--------- | :------ | :---------------------------------------------------------------- |
| 2026-02-14 | 1.0.0   | Initial architecture — 3-layer system, industry research codified |

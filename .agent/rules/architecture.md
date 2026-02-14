# Architecture Rules

> **Priority**: HIGH — Enforced in design reviews
> **Scope**: PathForge workspace — Turborepo monorepo

---

## Monorepo Structure

```
pathforge/
├── apps/
│   ├── api/          # FastAPI backend (Python 3.12+)
│   └── web/          # Next.js 15 frontend (TypeScript)
├── packages/         # Shared libraries (future)
├── docs/             # Architecture, changelog, roadmap
└── .agent/           # AI agent configuration
```

### Boundaries

| App        | Responsibility                        | Technology                    | Port |
| :--------- | :------------------------------------ | :---------------------------- | :--- |
| `apps/api` | REST API, AI engine, database         | FastAPI, SQLAlchemy, pgvector | 8000 |
| `apps/web` | Marketing site, dashboard, onboarding | Next.js 15, TailwindCSS v4    | 3000 |

- **NEVER** import backend code from frontend or vice versa
- Shared types/contracts are defined in API schemas and replicated as TypeScript interfaces in `apps/web/src/lib/api.ts`

---

## Backend Architecture (FastAPI)

```
Thin Routes → Service Layer → Models/Database
                ↕
            AI Engine
```

| Layer                  | Responsibility                            | Rules                                          |
| :--------------------- | :---------------------------------------- | :--------------------------------------------- |
| Routes (`api/v1/`)     | HTTP handling, auth enforcement           | MAX 10 lines per handler, delegate to services |
| Services (`services/`) | Business logic, validation, orchestration | Pure functions where possible, testable        |
| Models (`models/`)     | Database schema, relationships            | SQLAlchemy ORM, Alembic migrations             |
| Schemas (`schemas/`)   | Request/response contracts                | Pydantic models, explicit field validators     |
| AI Engine (`ai/`)      | Resume parsing, matching, tailoring       | Isolated from web framework                    |

---

## Frontend Architecture (Next.js 15)

- **App Router** with route groups: `(marketing)`, `(dashboard)`, `(auth)`
- **Server Components** by default — use `"use client"` only when necessary
- **Dynamic imports** for heavy components (marquee, accordion)
- **CSS-first** animations over JavaScript where possible

---

## Database Conventions

- **Alembic** for ALL schema changes — no raw SQL migrations
- Table names: `snake_case`, plural (`users`, `funnel_events`)
- Column names: `snake_case`
- Always include: `id` (UUID), `created_at`, `updated_at`
- Foreign keys: `<entity>_id` naming convention
- Indexes: create for all foreign keys and frequent query columns

---

## API Design

- **Versioned**: `/api/v1/` prefix on all endpoints
- **RESTful**: Standard HTTP methods and status codes
- **Consistent responses**: All endpoints return Pydantic-validated JSON
- **Pagination**: Offset-based with `skip` and `limit` parameters
- **Error format**: `{ "detail": "Human-readable error message" }`

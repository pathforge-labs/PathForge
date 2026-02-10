# PathForge — Career Intelligence for Everyone

> _Where Careers Are Built, Not Searched_
>
> **Version**: 0.1.0 | **Status**: Sprint 1 — Foundation

PathForge is a **Career Intelligence Platform** that democratizes enterprise-grade career intelligence — Skills Graphs, Market Signals, Predictive Analytics — for every professional. Powered by **Career DNA™** technology.

## Quick Start

### Prerequisites

- **Python** 3.12+
- **Node.js** 22+
- **pnpm** 10+
- **Docker** & Docker Compose

### 1. Start Infrastructure

```bash
docker compose -f docker/docker-compose.yml up -d
```

### 2. Set Up API

```bash
cd apps/api
python -m venv .venv
.venv/Scripts/activate    # Windows
pip install -e ".[dev]"
```

### 3. Run Migrations

```bash
cd apps/api
alembic upgrade head
```

### 4. Start API Server

```bash
cd apps/api
uvicorn app.main:app --reload --port 8000
```

### 5. API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

---

## Project Structure

```
pathforge/
├── apps/
│   ├── api/                    # FastAPI backend (Python)
│   │   ├── app/
│   │   │   ├── api/v1/         # Versioned route handlers
│   │   │   ├── core/           # Config, security, database
│   │   │   ├── models/         # SQLAlchemy ORM models
│   │   │   ├── schemas/        # Pydantic request/response DTOs
│   │   │   └── services/       # Business logic layer
│   │   ├── alembic/            # Database migrations
│   │   └── pyproject.toml      # Python project config
│   └── web/                    # Next.js frontend (planned)
├── packages/
│   └── shared/                 # Shared TypeScript types (planned)
├── docker/
│   └── docker-compose.yml      # PostgreSQL + Redis
└── docs/                       # Architecture & research
```

---

## Tech Stack

| Layer                | Technology                                  |
| :------------------- | :------------------------------------------ |
| Backend API          | FastAPI (Python 3.12+)                      |
| Database             | PostgreSQL 16 + pgvector                    |
| Cache/Queue          | Redis 7                                     |
| Auth                 | JWT (access + refresh tokens)               |
| AI (planned)         | Claude Sonnet 4.5 / Gemini Flash / Opus 4.6 |
| Embeddings (planned) | Voyage AI                                   |
| Frontend (planned)   | Next.js 15                                  |

---

## License

UNLICENSED — Proprietary

# PathForge — Career Intelligence for Everyone

> _Where Careers Are Built, Not Searched_

[![CI](https://github.com/pathforge-labs/PathForge/actions/workflows/ci.yml/badge.svg)](https://github.com/pathforge-labs/PathForge/actions/workflows/ci.yml)
[![Deploy](https://github.com/pathforge-labs/PathForge/actions/workflows/deploy.yml/badge.svg)](https://github.com/pathforge-labs/PathForge/actions/workflows/deploy.yml)

PathForge is a **Career Intelligence Platform** that democratizes enterprise-grade career intelligence — Skills Graphs, Market Signals, Predictive Analytics — for every professional. Powered by **Career DNA™** technology.

## 🏗️ Architecture

| Layer         | Technology                    | Purpose                       |
| :------------ | :---------------------------- | :---------------------------- |
| Frontend      | Next.js 15, TailwindCSS v4    | Landing page, dashboard       |
| Backend API   | FastAPI (Python 3.12+)        | REST API, AI pipelines        |
| Database      | PostgreSQL 16 + pgvector      | Relational + vector storage   |
| Cache / Queue | Redis 7                       | JWT blacklist, ARQ task queue |
| AI Models     | Claude Sonnet 4, Gemini Flash | LLM-powered career analysis   |
| Embeddings    | Voyage AI v3                  | Semantic matching engine      |
| Auth          | JWT (access + refresh tokens) | Stateless authentication      |
| Deployment    | Vercel (web) + Railway (API)  | Production infrastructure     |
| CI/CD         | GitHub Actions                | Automated quality gates       |

## 🚀 Quick Start

### Prerequisites

- **Python** 3.12+ · **Node.js** 22+ · **pnpm** 10+ · **Docker** & Docker Compose

### One-Command Start (Recommended)

```powershell
.\scripts\start-dev.ps1
```

This starts Docker (PostgreSQL + Redis), FastAPI backend, and Next.js frontend in one go. Opens the browser automatically.

### Manual Setup

<details>
<summary>Step-by-step manual setup</summary>

#### 1. Start Infrastructure

```bash
docker compose -f docker/docker-compose.yml up -d
```

#### 2. Set Up API

```bash
cd apps/api
python -m venv .venv
.venv/Scripts/activate    # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -e ".[dev,ai]"
```

#### 3. Run Migrations

```bash
cd apps/api
alembic upgrade head
```

#### 4. Start API Server

```bash
cd apps/api
uvicorn app.main:app --reload --port 8000
```

#### 5. Start Web App

```bash
pnpm install
pnpm --filter web dev
```

</details>

### Development URLs

| Service     | URL                         |
| :---------- | :-------------------------- |
| Frontend    | http://localhost:3000       |
| Backend API | http://localhost:8000       |
| Swagger UI  | http://localhost:8000/docs  |
| ReDoc       | http://localhost:8000/redoc |

## 🧪 Quality Gates

Run the full CI pipeline locally before pushing:

```powershell
.\scripts\ci-local.ps1            # Run all gates
.\scripts\ci-local.ps1 -Scope api # API only
.\scripts\ci-local.ps1 -Scope web # Web only
```

| Gate       | Tool                     | Scope           |
| :--------- | :----------------------- | :-------------- |
| Lint       | Ruff                     | API             |
| Type check | MyPy                     | API             |
| Tests      | Pytest                   | API (202 tests) |
| Lint       | ESLint (Next.js)         | Web             |
| Build      | Next.js production build | Web             |

> A pre-push Git hook runs `ci-local.ps1` automatically before every push.

## 📁 Project Structure

```
pathforge/
├── apps/
│   ├── api/                     # FastAPI backend (Python)
│   │   ├── app/
│   │   │   ├── api/v1/          # Versioned route handlers
│   │   │   ├── core/            # Config, security, database
│   │   │   ├── models/          # SQLAlchemy ORM models
│   │   │   ├── schemas/         # Pydantic request/response DTOs
│   │   │   └── services/        # Business logic layer
│   │   ├── alembic/             # Database migrations
│   │   └── tests/               # Pytest test suite
│   └── web/                     # Next.js 15 frontend
│       └── src/
│           ├── app/             # App Router pages & layouts
│           ├── components/      # React components
│           ├── config/          # Brand constants, settings
│           └── lib/             # Utilities, API client
├── packages/
│   └── shared/                  # Shared TypeScript types
├── docker/                      # Dockerfiles & Compose
├── docs/                        # Architecture, roadmap, research
├── scripts/                     # Dev & CI automation scripts
├── .github/workflows/           # CI/CD pipelines
└── railway.toml                 # Railway deployment config
```

## 🔑 Career Intelligence Features

| Feature                       | Status     | Description                               |
| :---------------------------- | :--------- | :---------------------------------------- |
| **Career DNA™**               | ✅ Shipped | 6-dimension career profile analysis       |
| **Career Threat Radar™**      | ✅ Shipped | AI-powered automation risk scoring        |
| **Career Resilience Score™**  | ✅ Shipped | 5-factor composite adaptability metric    |
| **Skills Shield™ Matrix**     | ✅ Shipped | Skills classified as shields vs exposures |
| **Career Moat Score**         | ✅ Shipped | 4-dimension career defensibility metric   |
| **Threat→Opportunity Engine** | ✅ Shipped | Every threat auto-paired with opportunity |
| Skill Decay Tracker           | ⏳ Next    | Skill freshness + market demand curves    |
| Salary Intelligence           | ⏳ Planned | Personalized salary calculation           |

## 📖 Documentation

| Document                                                | Purpose                             |
| :------------------------------------------------------ | :---------------------------------- |
| [ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md)    | System design & technical decisions |
| [ROADMAP.md](docs/ROADMAP.md)                           | Sprint tracking (SSOT)              |
| [DEVELOPMENT_WORKFLOW.md](docs/DEVELOPMENT_WORKFLOW.md) | Git workflow & contribution guide   |
| [BRANDING.md](docs/BRANDING.md)                         | Brand governance & naming rules     |
| [CHANGELOG.md](docs/CHANGELOG.md)                       | Release history                     |

## 🌐 Production

| Environment | URL                      |
| :---------- | :----------------------- |
| Web         | https://pathforge.eu     |
| API         | https://api.pathforge.eu |

## 📄 License

UNLICENSED — Proprietary

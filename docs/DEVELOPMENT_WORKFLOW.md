# PathForge — Development Process & Workflow

> **Document Status**: Living document — updated as processes evolve.
> **Last Updated**: 2026-02-18
> **Owner**: Emre Dursun (Founder & Lead Engineer)

---

## 1. Git Branching Strategy

PathForge follows a **simplified Gitflow** optimized for a solo-developer + AI workflow while maintaining professional deployment standards.

### Branch Topology

```
production ──────────────●───────────────────────●──── Live releases
                        ↑                       ↑
main ────────●───●──────●───●───●───●───●───●───●──── Integration
            ↑       ↑           ↑       ↑
feature/    ●───●───●           │       │
navbar-v2                       │       │
                                │       │
feature/    ────────────────●───●       │
career-dna-api                         │
                                       │
hotfix/     ───────────────────────●───●
fix-waitlist-form
```

### Branch Descriptions

| Branch       | Purpose                     | Merges To             | Protection                 |
| :----------- | :-------------------------- | :-------------------- | :------------------------- |
| `production` | Live production releases    | —                     | ✅ Protected, deploy-only  |
| `main`       | Integration & development   | `production`          | ✅ Protected, CI must pass |
| `feature/*`  | New features & enhancements | `main`                | —                          |
| `bugfix/*`   | Non-critical bug fixes      | `main`                | —                          |
| `hotfix/*`   | Production emergencies      | `main` + `production` | —                          |
| `release/*`  | Release stabilization       | `main` + `production` | —                          |

### Branch Naming Convention

```
feature/S{sprint}-{story}-{short-description}
bugfix/S{sprint}-{ticket}-{short-description}
hotfix/{ticket}-{short-description}
release/v{major}.{minor}.{patch}
```

**Examples:**

- `feature/S6-03-mobile-drawer-redesign`
- `bugfix/S6-B12-hydration-fix`
- `hotfix/waitlist-form-500`
- `release/v0.2.0`

---

## 2. Commit Convention

PathForge uses [Conventional Commits](https://www.conventionalcommits.org/) for automated changelog generation and semantic versioning.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type       | Purpose                                  | Triggers Version Bump |
| :--------- | :--------------------------------------- | :-------------------- |
| `feat`     | New feature                              | Minor bump            |
| `fix`      | Bug fix                                  | Patch bump            |
| `perf`     | Performance improvement                  | Patch bump            |
| `refactor` | Code restructure (no behavior change)    | —                     |
| `docs`     | Documentation only                       | —                     |
| `style`    | Formatting, whitespace (no logic change) | —                     |
| `test`     | Adding/updating tests                    | —                     |
| `chore`    | Build, tooling, dependency updates       | —                     |
| `ci`       | CI/CD pipeline changes                   | —                     |
| `revert`   | Reverting a previous commit              | —                     |

### Scopes

| Scope    | Covers                            |
| :------- | :-------------------------------- |
| `web`    | Next.js frontend (`apps/web`)     |
| `api`    | FastAPI backend (`apps/api`)      |
| `shared` | Shared packages (`packages/*`)    |
| `docker` | Container configurations          |
| `infra`  | CI/CD, deployment, infrastructure |
| `docs`   | Documentation changes             |
| `deps`   | Dependency updates                |

### Examples

```
feat(web): add theme-aware logo switching with CSS-only approach
fix(web): resolve hydration mismatch in mobile drawer portal
perf(api): optimize Career DNA embedding cache lookup
refactor(web): extract ThemeToggle into standalone component
docs: add development workflow and Gitflow documentation
chore(deps): upgrade next-themes to v0.4.6
ci: add PR lint and build checks via GitHub Actions
```

---

## 3. Sprint Workflow

PathForge uses a **1-week sprint cycle** optimized for solo development with AI assistance.

### Sprint Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                     1-WEEK SPRINT CYCLE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📋 BACKLOG         🏃 IN PROGRESS       ✅ DONE            │
│  ─────────         ─────────────        ────────           │
│  │ Story A │  →    │ Implementing │  →  │ Merged  │         │
│  │ Story B │       │ In Review    │     │ Verified │        │
│  │ Bug C   │       │ Testing      │                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  SPRINT CEREMONIES                                          │
│  • Sprint Planning    (Day 1 — define backlog)              │
│  • Daily Check-in     (Session start — what's next?)        │
│  • Sprint Review      (Day 7 — demo, screenshots)          │
│  • Retrospective      (Day 7 — /retrospective audit)       │
└─────────────────────────────────────────────────────────────┘
```

### Sprint Numbering

Format: `S{number}` — Example: `S6`, `S7`, `S8`

Each sprint has a sprint document at `docs/sprints/S{number}.md` containing:

- Sprint goal and theme
- User stories with acceptance criteria
- Task breakdown with estimates

---

## 4. Quality Gates

### Pre-Implementation Gate (Mandatory)

Before ANY feature implementation, execute the `/quality-gate` protocol:

1. **Market Research** — 5+ competitor analysis
2. **Comparative Analysis** — Feature approach table
3. **Gap Detection** — Where PathForge exceeds/falls short
4. **Enhancement Strategy** — How PathForge improves upon market
5. **Ethics & Risk Assessment** — Privacy, bias, automation safety
6. **Implementation Plan** — Structured execution plan
7. **Approval** — Product Owner sign-off before coding

### Pre-Commit Gate

Before committing any work:

- [ ] Code compiles (`pnpm build:web`)
- [ ] Lint passes (`pnpm lint`)
- [ ] No TypeScript errors
- [ ] No new console warnings/errors
- [ ] Changes are visually verified in browser
- [ ] Commit message follows Conventional Commits

### Pre-Merge Gate (Pull Requests)

Every PR to `main` must satisfy:

- [ ] CI pipeline passes (lint, type-check, build)
- [ ] Code review completed (self-review or AI-assisted)
- [ ] No breaking changes without migration plan
- [ ] Documentation updated if public API changes
- [ ] Screenshots attached for UI changes

### Pre-Release Gate

Before merging `main` → `production`:

- [ ] All sprint stories verified
- [ ] `/retrospective` audit completed
- [ ] No critical or high-severity issues open
- [ ] Lighthouse score ≥ 90 (Performance, Accessibility, SEO)
- [ ] Build artifact tested in preview environment

---

## 5. Definition of Done (DoD)

A feature is **Done** when ALL criteria are met:

| Category   | Criteria                                        |
| :--------- | :---------------------------------------------- |
| **Code**   | Written, follows style guidelines, passes lint  |
| **Types**  | Full TypeScript type coverage, no `any`         |
| **Tests**  | Unit/integration tests written and passing      |
| **Review** | Code reviewed (self-review + `/retrospective`)  |
| **Docs**   | README/JSDoc updated where applicable           |
| **Visual** | Verified in browser (dark + light mode)         |
| **A11y**   | ARIA labels, keyboard navigation, semantic HTML |
| **Mobile** | Responsive — tested at 375px, 768px, 1440px     |
| **Perf**   | No regressions in Lighthouse scores             |
| **Commit** | Conventional Commit message, clean history      |

---

## 6. CI/CD Pipeline Architecture

### GitHub Actions Workflows

#### CI Pipeline (`ci.yml`) — Triggers on push to `main`

```
┌─────────────────────────────────────────────────┐
│           Push to main (ci.yml)                 │
├─────────────────────────────────────────────────┤
│  ✅ Install dependencies (pnpm)                 │
│  ✅ API: Ruff Lint                               │
│  ✅ API: MyPy Type Check                         │
│  ✅ API: Pytest (202 tests)                      │
│  ✅ Web: ESLint                                  │
│  ✅ Web: Next.js production build                │
└─────────────────────────────────────────────────┘
```

#### Deploy Pipeline (`deploy.yml`) — Triggers on push to `production`

```
┌─────────────────────────────────────────────────┐
│       Push to production (deploy.yml)           │
├─────────────────────────────────────────────────┤
│  ✅ Deploy API → Railway (via CLI)               │
└─────────────────────────────────────────────────┘
```

### Deployment Strategy

| Component | Deploy Mechanism              | Trigger              | Platform |
| :-------- | :---------------------------- | :------------------- | :------- |
| **Web**   | Vercel Git Integration (auto) | Push to `production` | Vercel   |
| **API**   | GitHub Actions `deploy.yml`   | Push to `production` | Railway  |

> [!IMPORTANT]
> Web deployments are **NOT** handled by GitHub Actions. Vercel's native Git integration
> automatically deploys on push to the `production` branch. The `deploy.yml` workflow
> only handles Railway API deployment.

### Vercel Configuration

| Setting            | Value                                      |
| :----------------- | :----------------------------------------- |
| Production Branch  | `production`                               |
| Root Directory     | `apps/web`                                 |
| Install Command    | `pnpm install`                             |
| Build Command      | `pnpm build`                               |
| Ignored Build Step | Only `production` branch triggers builds   |
| Node.js Version    | 22.x                                       |
| Corepack           | Enabled (`ENABLE_EXPERIMENTAL_COREPACK=1`) |

### Local Pre-Push Gate

A smart pre-push hook runs automatically before every `git push`. See [LOCAL-CI-GATE.md](guides/LOCAL-CI-GATE.md) for full documentation.

Key optimizations:

- **Non-code changes** (docs, config, hooks) → CI skipped entirely
- **Fast-forward merges** (`main` → `production`) → CI skipped
- **Scope detection** → Only relevant gates run (api/web/all)

### Preview Deployments

Pushes to non-production branches are ignored by Vercel (via Ignored Build Step). Preview deployments are not enabled on the Hobby plan.

---

## 7. Environment Strategy

| Environment     | Branch       | URL              | Purpose           |
| :-------------- | :----------- | :--------------- | :---------------- |
| **Development** | `feature/*`  | `localhost:3000` | Local development |
| **Production**  | `production` | `pathforge.eu`   | Live site         |

---

## 8. Merge Policy — `main` → `production`

> [!IMPORTANT]
> `production` is the **live deployment branch**. All development happens on `main`.
> Merges to `production` are **deliberate releases**, never ad-hoc pushes.

### When to Merge

| Trigger               | Cadence                     | Description                                                           |
| :-------------------- | :-------------------------- | :-------------------------------------------------------------------- |
| **Sprint Release**    | End of each sprint (weekly) | All sprint stories verified → merge `main` → `production`             |
| **Milestone Release** | As needed                   | Major feature complete → cut `release/v{x.y.z}` → merge to both       |
| **Hotfix**            | Immediate                   | Critical production bug → `hotfix/*` → merge to `main` + `production` |

### Merge Rules

1. **Never merge daily** — `main` is the active development branch; frequent merges to `production` defeat its purpose as a stable baseline
2. **Sprint-end release (recommended cadence)** — At the end of each 1-week sprint, after all stories are verified and the `/retrospective` audit passes, merge `main` → `production`
3. **Milestone release (for significant features)** — When a major feature or group of features is complete, create a `release/v{x.y.z}` branch, stabilize, then merge to `production`
4. **Hotfixes bypass the sprint** — Critical production bugs get `hotfix/*` branches that merge directly to both `main` and `production`
5. **Always use PRs** — Even for solo development, create a PR from `main` → `production` to maintain an audit trail and trigger CI checks
6. **Tag every release** — Every merge to `production` gets a `v{x.y.z}` tag

### Pre-Merge Checklist (`main` → `production`)

- [ ] All sprint stories verified and marked ✅
- [ ] `/retrospective` audit completed with grade ≥ B
- [ ] Build passes (`pnpm build:web`)
- [ ] No critical or high-severity open issues
- [ ] Lighthouse score ≥ 90 (Performance, A11y, SEO)
- [ ] Changelog generated from Conventional Commits
- [ ] PR created with release notes summary
- [ ] Tag created: `git tag v{x.y.z}`

### Merge Flow Diagram

```
Sprint End / Milestone Complete
        │
        ▼
┌─────────────────────┐
│  /retrospective     │  ← Audit build, lint, code quality
│  audit on main      │
└────────┬────────────┘
         │ Pass?
    ┌────┴────┐
   Yes       No → Fix issues on main, re-audit
    │
    ▼
┌─────────────────────┐
│  Create PR:         │
│  main → production  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  CI checks pass     │  ← Lint, type-check, build, tests
│  Review & approve   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Merge + Tag        │
│  git tag v{x.y.z}   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Deploy to          │
│  production env     │
└─────────────────────┘
```

---

## 9. Release Process

### Versioning

PathForge follows [Semantic Versioning](https://semver.org/):

```
v{MAJOR}.{MINOR}.{PATCH}

MAJOR — Breaking changes (API, data model)
MINOR — New features (backward compatible)
PATCH — Bug fixes, patches
```

### Release Checklist

1. Create `release/v{x.y.z}` branch from `main`
2. Update `package.json` version
3. Generate changelog from Conventional Commits
4. Run full `/retrospective` audit
5. Create PR to `production`
6. Tag release: `git tag v{x.y.z}`
7. Deploy to production
8. Verify smoke tests pass
9. Merge back to `main` (if any release fixes were applied)

---

## 10. Project Structure Reference

```
pathforge/
├── apps/
│   ├── web/                    # Next.js 16 frontend
│   │   ├── src/
│   │   │   ├── app/            # App Router pages & layouts
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── config/         # Brand constants, feature flags
│   │   │   ├── data/           # Static data (landing content)
│   │   │   └── hooks/          # Custom React hooks
│   │   └── public/             # Static assets (logos, images)
│   │
│   └── api/                    # FastAPI backend (planned)
│       ├── src/
│       │   ├── core/           # Config, security, middleware
│       │   ├── domains/        # Feature-based modules
│       │   ├── models/         # SQLAlchemy models
│       │   └── schemas/        # Pydantic schemas
│       └── requirements.txt
│
├── packages/                    # Shared packages (monorepo)
│   └── shared-types/           # TypeScript interfaces
│
├── docker/                      # Container configurations
│   ├── Dockerfile.api
│   └── docker-compose.yml
│
├── docs/                        # Documentation
│   ├── architecture/           # ADRs, system design
│   ├── sprints/                # Sprint backlogs
│   ├── BRANDING.md             # Brand guidelines
│   └── DEVELOPMENT_WORKFLOW.md # This document
│
├── .agent/                      # AI agent configuration
│   ├── workflows/              # Slash command workflows
│   ├── skills/                 # Agent skills
│   └── rules/                  # Governance rules
│
├── .github/
│   └── workflows/              # GitHub Actions CI/CD
│
├── scripts/                     # Development scripts
│   └── start-dev.ps1           # Local dev server launcher
│
├── package.json                 # Root workspace config
├── pnpm-workspace.yaml          # pnpm workspace definition
└── README.md
```

---

## 11. Development Environment

### Prerequisites

| Tool           | Version  | Purpose               |
| :------------- | :------- | :-------------------- |
| Node.js        | ≥ 22.0.0 | JavaScript runtime    |
| pnpm           | ≥ 10.0.0 | Package manager       |
| Git            | Latest   | Version control       |
| Docker Desktop | Latest   | Container development |
| VS Code        | Latest   | IDE (recommended)     |

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens (GitKraken)
- PostCSS Language Support
- Error Lens
- GitHub Copilot / Gemini

### Quick Start

```bash
# Clone
git clone https://github.com/pathforge-labs/PathForge.git
cd pathforge

# Install
pnpm install

# Run development server
pnpm dev:web          # Next.js on localhost:3000
.\scripts\start-dev.ps1  # Full stack (Windows)

# Build
pnpm build:web

# Lint
pnpm lint
```

---

## 12. Session Management Protocol

### Session Start

1. Pull latest from `main`
2. Review sprint backlog (`docs/sprints/S{n}.md`)
3. Create feature branch if starting new work
4. Run dev server and verify clean state

### Session End

1. Commit all work-in-progress (WIP commits OK on feature branches)
2. Push to remote
3. Update sprint task status
4. Document any blockers or decisions made

---

## 13. Code Review Standards

### Self-Review Checklist

Before marking any work as complete:

- [ ] Read through the entire diff
- [ ] Check for leftover `console.log`, `TODO`, debug code
- [ ] Verify no hardcoded values that should be constants
- [ ] Confirm responsive behavior at key breakpoints
- [ ] Test in both dark and light themes
- [ ] Verify accessibility (keyboard navigation, screen reader)
- [ ] Run `/retrospective` audit for larger changes

### AI-Assisted Review

For significant changes, use the `/retrospective` workflow which includes:

- **Code Review**: Style, patterns, comment accuracy
- **Security Scan**: XSS, injection, dependency audit
- **Verification**: Build, lint, type-check, functional tests

# Local CI Pre-Push Gate

> Catches lint and type errors before push. Full tests run in GitHub Actions CI.

## Quick Start

```powershell
# Fast mode — lint + types only (~12s) — DEFAULT for pre-push hook
.\scripts\ci-local.ps1 -Fast

# Full mode — lint + types + tests + build (mirrors ci.yml)
.\scripts\ci-local.ps1

# Scoped fast mode
.\scripts\ci-local.ps1 -Fast -Scope api    # API lint + types only
.\scripts\ci-local.ps1 -Fast -Scope web    # Web lint only
.\scripts\ci-local.ps1 -Scope api          # Full API gates
```

## Tier-1 Quality Strategy

| Tier         | Where             | What Runs                                | Time     |
| :----------- | :---------------- | :--------------------------------------- | :------- |
| **Pre-Push** | Local (fast mode) | Ruff lint + MyPy type check              | **~12s** |
| **CI/CD**    | GitHub Actions    | Ruff + MyPy + Pytest + ESLint + Build    | ~3 min   |
| **Audit**    | Local (manual)    | `/retrospective` + `/review` + `/verify` | ~10 min  |

> [!TIP]
> Pre-push catches syntax, import, and type errors instantly. Tests and builds run in GitHub Actions CI after push. Tier-1 audits (`/retrospective`, `/review`, `/verify`) catch deeper issues before committing.

## Gate Architecture

| Gate                | CI Step                                       | Scope | Pre-Push (Fast) | Full Mode |
| ------------------- | --------------------------------------------- | ----- | --------------- | --------- |
| **Ruff Lint**       | `python -m ruff check app/ tests/`            | `api` | ✅ Runs         | ✅ Runs   |
| **MyPy Type Check** | `python -m mypy app --ignore-missing-imports` | `api` | ✅ Runs         | ✅ Runs   |
| **Pytest**          | `python -m pytest tests/ -q --tb=short`       | `api` | ⏭️ Skipped      | ✅ Runs   |
| **Next.js Lint**    | `pnpm lint`                                   | `web` | ✅ Runs         | ✅ Runs   |
| **Next.js Build**   | `pnpm build`                                  | `web` | ⏭️ Skipped      | ✅ Runs   |

### Fail-Fast Behavior

Gates run sequentially. If a **blocking** gate fails, subsequent gates are skipped and the script exits with code `1`. MyPy runs as a non-blocking warning — it reports issues but doesn't prevent the push.

## Smart Pre-Push Hook

A git pre-push hook at `.githooks/pre-push` automatically runs the CI gate before every `git push` in **fast mode**, with intelligent optimizations to minimize unnecessary build times.

### Activation

```powershell
git config core.hooksPath .githooks
```

> [!NOTE]
> This is already activated in the repository. No further setup needed.

### Smart Optimizations

The hook analyzes each push and automatically decides what to run:

| Scenario                                                | Behavior                            | Time     |
| :------------------------------------------------------ | :---------------------------------- | :------- |
| **Non-code changes** (docs, config, hooks, scripts, CI) | Skips CI entirely                   | **0s**   |
| **Production merge** (`main` → `production`)            | Skips CI (already tested on `main`) | **0s**   |
| **API-only changes** (`apps/api/`)                      | Fast mode: Ruff + MyPy              | **~12s** |
| **Web-only changes** (`apps/web/`)                      | Fast mode: ESLint                   | **~5s**  |
| **Mixed changes**                                       | Fast mode: all lint + types         | **~15s** |

#### Non-Code File Patterns (Auto-Skip)

Changes to these paths are classified as non-code and skip CI:

- `*.md`, `docs/`, `*.txt`, `LICENSE` — Documentation
- `.agent/`, `.vscode/`, `.githooks/` — Agent/IDE config
- `.github/`, `scripts/` — CI/CD config
- `docker/` — Docker infrastructure
- `packages/shared/` — Shared types (no build step)
- `.gitignore`, `.editorconfig`, `.prettierrc` — Root configs

#### Production Merge Detection

When pushing the `production` branch, the hook checks if `origin/main` is an ancestor of the push target. This works for both fast-forward merges AND `--no-ff` merge commits. If all code comes from main (which already passed CI), the hook skips redundant CI.

### Overrides

```powershell
# Default: Fast mode (lint + types only)
git push

# Full CI locally (lint + types + tests + build)
$env:FULL_CI=1; git push; Remove-Item Env:FULL_CI

# Skip hook entirely (emergency only)
git push --no-verify

# Skip via env var (trusted pushes)
$env:SKIP_CI=1; git push; Remove-Item Env:SKIP_CI
```

## Prerequisites

| Tool              | Location                         | Required For    |
| ----------------- | -------------------------------- | --------------- |
| Python 3.12+ venv | `apps/api/.venv/`                | API gates       |
| Ruff              | `pip install ruff` (in venv)     | Ruff Lint       |
| MyPy              | `pip install mypy` (in venv)     | MyPy (optional) |
| Pytest            | `pip install '.[dev]'` (in venv) | Pytest (full)   |
| Node.js 22+       | System                           | Web gates       |
| pnpm              | System (via corepack)            | Web gates       |

### Full Setup

```powershell
# API environment
cd apps/api
python -m venv .venv
.venv\Scripts\pip install ".[dev,ai]"

# Web environment
cd apps/web
pnpm install
```

## Output Examples

### Fast Mode (Default Pre-Push)

```
╔══════════════════════════════════════════╗
║  Pre-Push Hook — Running Local CI Gate   ║
╠══════════════════════════════════════════╣
║  Scope: api                              ║
║  Changed: 2 api, 0 web, 0 root          ║
║  Mode: FAST (lint + types only)          ║
╚══════════════════════════════════════════╝

==========================================
  PathForge - Local CI Gate
  Mode: FAST (lint + types only)
==========================================
  Scope: api

--- API: Lint & Test ---

>> Ruff Lint
  [PASS] Ruff Lint (0.2s) - 0 errors

>> MyPy Type Check (warning only)
  [PASS] MyPy Type Check (10.9s) - 0 errors

>> Pytest
  [SKIP] Pytest (fast mode — tests run in GitHub Actions CI)

--- Summary ---

  [PASS] Ruff Lint             0.2s  (0 errors)
  [PASS] MyPy Type Check       10.9s  (0 errors)
  [SKIP] Pytest                0.0s  (fast mode)

==========================================
  ALL GATES PASSED - Safe to push
==========================================
  Total: 11.2s
```

### Production Merge (Skipped)

```
╔══════════════════════════════════════════╗
║  Pre-Push Hook — Production Merge         ║
╠══════════════════════════════════════════╣
║  All code already CI-tested on main.      ║
║  Skipping redundant CI gate.              ║
╚══════════════════════════════════════════╝
```

### Non-Code Change (Skipped)

```
╔══════════════════════════════════════════╗
║  Pre-Push Hook — Non-Code Change          ║
╠══════════════════════════════════════════╣
║  Only docs/config/infra files changed.    ║
║  Skipping CI gate.                        ║
╚══════════════════════════════════════════╝
```

## File Map

| File                                              | Purpose                                   |
| ------------------------------------------------- | ----------------------------------------- |
| [`ci-local.ps1`](../../scripts/ci-local.ps1)      | Standalone CI gate script                 |
| [`pre-push`](../../.githooks/pre-push)            | Git pre-push hook (calls ci-local.ps1)    |
| [`ci.yml`](../../.github/workflows/ci.yml)        | GitHub Actions pipeline (source of truth) |
| [`review.md`](../../.agent/workflows/review.md)   | `/review` workflow (links to script)      |
| [`pyproject.toml`](../../apps/api/pyproject.toml) | Ruff/MyPy/Pytest configuration            |

## Design Decisions

1. **Fast by default** — pre-push runs lint + types only (~12s), full tests deferred to GitHub Actions CI
2. **Tier-1 quality strategy** — fast local checks + GitHub Actions CI + manual Tier-1 audits
3. **Fail-fast** — stops at first blocking failure to save time
4. **MyPy is non-blocking** — runs as a warning gate so type regressions don't block pushes
5. **PowerShell 5.1 compatible** — uses native `Write-Host -ForegroundColor` instead of ANSI escapes
6. **Opt-in hook** — activated via `git config`, bypassable with `--no-verify` or `SKIP_CI=1`
7. **FULL_CI escape hatch** — `FULL_CI=1 git push` runs the complete pipeline locally when needed
8. **Test env vars auto-managed** — sets and cleans up `ENVIRONMENT`, `JWT_SECRET`, `JWT_REFRESH_SECRET`
9. **Telemetry disabled** — sets `NEXT_TELEMETRY_DISABLED=1` during Next.js build, cleans up after
10. **Smart scope detection** — analyzes `git diff` to run only relevant gates (api/web/all)
11. **Production merge skip** — detects `main` → `production` merges (ff + no-ff) and skips redundant CI
12. **Non-code skip** — changes to docs, config, and infra files bypass CI entirely

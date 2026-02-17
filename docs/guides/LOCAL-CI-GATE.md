# Local CI Pre-Push Gate

> Mirrors `.github/workflows/ci.yml` locally to catch failures before push.

## Quick Start

```powershell
# Run all gates (API + Web)
.\scripts\ci-local.ps1

# Run API gates only (Ruff, MyPy, Pytest)
.\scripts\ci-local.ps1 -Scope api

# Run Web gates only (ESLint, Next.js Build)
.\scripts\ci-local.ps1 -Scope web
```

## Gate Architecture

The script mirrors the exact gates from the GitHub Actions pipeline:

| Gate                | CI Step                                       | Scope | Blocking        |
| ------------------- | --------------------------------------------- | ----- | --------------- |
| **Ruff Lint**       | `python -m ruff check app/ tests/`            | `api` | ✅ Yes          |
| **MyPy Type Check** | `python -m mypy app --ignore-missing-imports` | `api` | ⚠️ Warning only |
| **Pytest**          | `python -m pytest tests/ -q --tb=short`       | `api` | ✅ Yes          |
| **Next.js Lint**    | `pnpm lint`                                   | `web` | ✅ Yes          |
| **Next.js Build**   | `pnpm build`                                  | `web` | ✅ Yes          |

### Fail-Fast Behavior

Gates run sequentially. If a **blocking** gate fails, subsequent gates are skipped and the script exits with code `1`. MyPy runs as a non-blocking warning — it reports issues but doesn't prevent the push.

## Smart Pre-Push Hook

A git pre-push hook at `.githooks/pre-push` automatically runs the CI gate before every `git push`, with **intelligent optimizations** to minimize unnecessary build times.

### Activation

The hook is activated via:

```powershell
git config core.hooksPath .githooks
```

> [!NOTE]
> This is already activated in the repository. No further setup is needed for developers who clone this repo.

### Smart Optimizations

The hook analyzes each push and automatically decides what to run:

| Scenario                                                | Behavior                            | Time Saved |
| :------------------------------------------------------ | :---------------------------------- | :--------- |
| **Non-code changes** (docs, config, hooks, scripts, CI) | Skips CI entirely                   | ~8 min     |
| **Fast-forward merge** (`main` → `production`)          | Skips CI (already tested on `main`) | ~8 min     |
| **API-only changes** (`apps/api/`)                      | Runs with `-Scope api` only         | ~15s       |
| **Web-only changes** (`apps/web/`)                      | Runs with `-Scope web` only         | ~7 min     |
| **Mixed changes**                                       | Runs with `-Scope all`              | —          |

#### Non-Code File Patterns (Auto-Skip)

Changes to these paths are classified as non-code and skip CI:

- `*.md`, `docs/`, `*.txt`, `LICENSE` — Documentation
- `.agent/`, `.vscode/`, `.githooks/` — Agent/IDE config
- `.github/`, `scripts/` — CI/CD config
- `docker/` — Docker infrastructure
- `packages/shared/` — Shared types (no build step)
- `.gitignore`, `.editorconfig`, `.prettierrc` — Root configs

#### Fast-Forward Merge Detection

When pushing the `production` branch, the hook checks if all commits are already present on `origin/main`. If so, it skips CI because those commits were already tested when they were pushed to `main`.

### Bypassing

Two ways to skip the hook:

```powershell
# Method 1: Git native bypass (emergency only)
git push --no-verify

# Method 2: Environment variable (trusted pushes)
$env:SKIP_CI=1; git push; Remove-Item Env:SKIP_CI
```

## Prerequisites

| Tool              | Location                         | Required For    |
| ----------------- | -------------------------------- | --------------- |
| Python 3.12+ venv | `apps/api/.venv/`                | API gates       |
| Ruff              | `pip install ruff` (in venv)     | Ruff Lint       |
| MyPy              | `pip install mypy` (in venv)     | MyPy (optional) |
| Pytest            | `pip install '.[dev]'` (in venv) | Pytest          |
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

### Full CI Run (Scope: all)

```
╔══════════════════════════════════════════╗
║  Pre-Push Hook — Running Local CI Gate   ║
╠══════════════════════════════════════════╣
║  Scope: all                               ║
║  Changed: 3 api, 2 web, 0 root            ║
╚══════════════════════════════════════════╝

--- API: Lint & Test ---

>> Ruff Lint
  [PASS] Ruff Lint (0.1s) - 0 errors

>> MyPy Type Check (warning only)
  [PASS] MyPy Type Check (2.4s)

>> Pytest
  [PASS] Pytest (38.6s) - 202 passed

--- Web: Lint & Build ---

>> Next.js Lint
  [PASS] Next.js Lint (6.2s)

>> Next.js Build
  [PASS] Next.js Build (12.2s)

--- Summary ---
==========================================
  ALL GATES PASSED - Safe to push
==========================================
  Total: 59.8s
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

### Fast-Forward Merge (Skipped)

```
╔══════════════════════════════════════════╗
║  Pre-Push Hook — Fast-Forward Detected    ║
╠══════════════════════════════════════════╣
║  All commits already tested on main.      ║
║  Skipping CI gate.                        ║
╚══════════════════════════════════════════╝
```

## File Map

| File                                              | Purpose                                   |
| ------------------------------------------------- | ----------------------------------------- |
| [`ci-local.ps1`](../../scripts/ci-local.ps1)      | Standalone CI gate script                 |
| [`pre-push`](../../.githooks/pre-push)            | Git pre-push hook                         |
| [`ci.yml`](../../.github/workflows/ci.yml)        | GitHub Actions pipeline (source of truth) |
| [`review.md`](../../.agent/workflows/review.md)   | `/review` workflow (links to script)      |
| [`pyproject.toml`](../../apps/api/pyproject.toml) | Ruff/MyPy/Pytest configuration            |

## Design Decisions

1. **Mirrors CI 1:1** — same commands, same order, same working directories
2. **Fail-fast** — stops at first blocking failure to save time
3. **MyPy is non-blocking** — runs as a warning gate so future type regressions don't block the push pipeline
4. **PowerShell 5.1 compatible** — uses native `Write-Host -ForegroundColor` instead of ANSI escapes
5. **Opt-in hook** — activated via `git config`, bypassable with `--no-verify`
6. **Test env vars auto-managed** — sets and cleans up `ENVIRONMENT`, `JWT_SECRET`, `JWT_REFRESH_SECRET`
7. **Telemetry disabled** — sets `NEXT_TELEMETRY_DISABLED=1` during Next.js build, cleans up after
8. **Smart scope detection** — analyzes `git diff` to run only relevant gates (api/web/all)
9. **Fast-forward skip** — detects `main` → `production` merges and skips redundant CI
10. **Non-code skip** — changes to docs, config, and infra files bypass CI entirely

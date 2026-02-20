---
description: PowerShell shell conventions for Windows. Avoid bash-isms. Reference before running terminal commands.
---

# Shell Conventions — Windows PowerShell 5.x

> **Environment**: Windows PowerShell 5.x (NOT PowerShell 7/Core)
> **Scope**: All `run_command` tool calls across all PathForge workspaces

---

## 🔴 CRITICAL RULES

1. **NEVER use `&&`** — It is NOT a valid operator in PowerShell 5.x
2. **NEVER use `cd dir && command`** — Use the `Cwd` parameter on `run_command` instead
3. **NEVER use `||`** as bash-style OR — Use `if (-not $?) { ... }` instead

---

## Operator Reference

| Operator | Bash                       | PowerShell 5.x          | Notes                             |
| -------- | -------------------------- | ----------------------- | --------------------------------- |
| `&&`     | Sequential (conditional)   | ❌ **NOT SUPPORTED**    | Use `;` or `Cwd` param            |
| `;`      | Sequential (unconditional) | ✅ Sequential execution | Runs next regardless of exit code |
| `\|`     | Pipe stdout                | ✅ Pipe objects         | Different semantics than bash     |
| `\|\|`   | OR (run on failure)        | ❌ **NOT SUPPORTED**    | Use `if (-not $?) { ... }`        |
| `>`      | Redirect stdout            | ✅ Redirect output      | Same behavior                     |
| `2>&1`   | Redirect stderr to stdout  | ✅ Merge streams        | Same behavior                     |

---

## Patterns

### ❌ WRONG: Chaining with &&

```bash
cd apps/api && .venv/Scripts/python -m pytest tests/ -q
```

### ✅ RIGHT: Use Cwd parameter

```powershell
# Set Cwd to "apps/api" on run_command, then just run:
& ".venv\Scripts\python.exe" -m pytest tests/ -q
```

### ✅ RIGHT: Sequential with ;

```powershell
git status; git log --oneline -5
```

### ✅ RIGHT: Call operator for executables with spaces/special chars

```powershell
& ".venv\Scripts\ruff.exe" check app/
& ".venv\Scripts\pytest.exe" tests/ -v
```

---

## Common PathForge Commands

| Task              | Command                                       | Cwd        |
| ----------------- | --------------------------------------------- | ---------- |
| Run backend tests | `& ".venv\Scripts\pytest.exe" tests/ -q`      | `apps/api` |
| Run ruff lint     | `& ".venv\Scripts\ruff.exe" check app/`       | `apps/api` |
| Run ruff fix      | `& ".venv\Scripts\ruff.exe" check --fix app/` | `apps/api` |
| Alembic migrate   | `& ".venv\Scripts\alembic.exe" upgrade head`  | `apps/api` |
| Frontend lint     | `npx next lint`                               | `apps/web` |
| Frontend build    | `pnpm build`                                  | `apps/web` |
| Type check        | `npx tsc --noEmit`                            | `apps/web` |

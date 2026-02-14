---
description: Code review workflow. Lint, type-check, test, security scan, and build verification.
---

# /review - Code Review Quality Gate

$ARGUMENTS

---

## 🔴 CRITICAL RULES

1. **SEQUENTIAL** — Each step must pass before proceeding
2. **NO OVERRIDES** — Failed gates block merge
3. **DOCUMENT** — Log results for audit trail

---

## Review Pipeline

```
/review
    │
    ▼
1. Lint Check
    │
    Pass? ──No──► Fix lint errors
    │
   Yes
    │
    ▼
2. Type Check
    │
    Pass? ──No──► Fix type errors
    │
   Yes
    │
    ▼
3. Test Suite
    │
    Pass? ──No──► Fix failing tests
    │
   Yes
    │
    ▼
4. Security Scan
    │
    Pass? ──No──► Fix vulnerabilities
    │
   Yes
    │
    ▼
5. Build Verification
    │
    Pass? ──No──► Fix build errors
    │
   Yes
    │
    ▼
✅ Review Complete — Ready for commit
```

---

## Steps

### 1. Lint Check (Frontend)

// turbo

```bash
cd apps/web && npx next lint
```

### 2. Type Check (Frontend)

// turbo

```bash
cd apps/web && npx tsc --noEmit
```

### 3. Backend Tests

// turbo

```bash
cd apps/api && .venv/Scripts/python -m pytest tests/ -q
```

### 4. Security Scan

// turbo

```bash
cd apps/web && npm audit --audit-level=moderate
```

### 5. Build Verification

// turbo

```bash
cd apps/web && pnpm build
```

---

## Output Format

### All Checks Passed

```markdown
## ✅ Review Complete

| Gate     | Status                | Duration |
| :------- | :-------------------- | :------- |
| Lint     | ✅ Pass               | 2.1s     |
| Types    | ✅ Pass               | 4.3s     |
| Tests    | ✅ Pass (146/146)     | 24s      |
| Security | ✅ No vulnerabilities | 1.2s     |
| Build    | ✅ Pass (23 routes)   | 8.7s     |

**Verdict**: Ready for commit.
```

### Check Failed

```markdown
## ❌ Review Failed

| Gate   | Status    |
| :----- | :-------- |
| [gate] | ❌ FAILED |

### Failure Details

[Error output]

### Recommended Fix

[Fix steps]
```

---

## Examples

```
/review
/review lint
/review tests
/review security
```

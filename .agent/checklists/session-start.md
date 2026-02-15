# Session Start Checklist

> **Framework**: Antigravity AI Kit v2.0.0  
> **Purpose**: Complete this checklist at the beginning of every work session  
> **Principle**: Full context before new work

---

## 🔄 Context Loading

- [ ] **session-context.md** loaded
  - Last session handoff notes reviewed
  - ⚠️ This file contains handoff context ONLY — not task tracking
- [ ] **session-state.json** loaded
  - Last commit, branch, test count verified
  - ⚠️ Volatile-only metadata (v2.1.0 schema) — not task tracking
- [ ] **Staleness check**
  - Compare `session-state.json → repository.lastCommit` with `git log --oneline -1`
  - If mismatch → alert user: "Session files are stale (synced at X, HEAD is Y)"
  - Continue with `docs/ROADMAP.md` as authoritative source regardless
- [ ] **rules.md** loaded (if project has one)
  - Project-specific rules acknowledged

---

## 🗺️ Sprint State Validation (Auto)

> **MANDATORY**: This section replaces all previous task tracking approaches.
> See `.agent/rules/sprint-tracking.md` for full protocol.

- [ ] **docs/ROADMAP.md** loaded (SSOT)
  - Current sprint identified
  - In-progress tasks (`[/]`) identified
  - Next priority tasks (`[ ]`) identified
- [ ] **Present to user**:
  - Current sprint name + goal
  - 🔴 In-progress tasks
  - 📋 Next priority tasks
  - ⚠️ Blockers or dependencies
- [ ] **Validate against ARCHITECTURE.md**
  - Sprint numbers match Section 7
  - No drift between roadmap and board
- [ ] **docs/CHANGELOG.md** reviewed for entries since last session

---

## 📂 Project State

- [ ] **Git status** clean or understood
  ```bash
  git status
  git branch
  ```
- [ ] **Dependencies** up to date
  ```bash
  npm install  # or pnpm install
  ```
- [ ] **Build** passes
  ```bash
  npm run build
  ```

---

## 🎯 Task Context

Based on task type, load relevant context:

**For Feature Work:**

- [ ] Requirements document located
- [ ] Related existing code identified
- [ ] Test strategy understood

**For Bug Fixes:**

- [ ] Bug reproduction steps known
- [ ] Related logs/errors reviewed
- [ ] Affected code paths identified

**For Refactoring:**

- [ ] Scope of changes understood
- [ ] Test coverage verified
- [ ] Rollback plan considered

---

## ⚡ Quick Verification

- [ ] Development server starts
  ```bash
  npm run dev
  ```
- [ ] Tests pass
  ```bash
  npm test
  ```
- [ ] No critical errors in console

---

## ✅ Ready State

After completing this checklist:

1. ✅ Context fully loaded
2. ✅ Environment verified
3. ✅ Ready to begin task

**Proceed with**: `/plan` or `/implement`

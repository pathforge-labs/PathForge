# Session End Checklist

> **Framework**: Antigravity AI Kit v2.0.0  
> **Purpose**: Complete this checklist before ending any work session  
> **Principle**: Context preservation for continuity

---

## 📝 Context Preservation

- [ ] **session-context.md** updated with:
  - Session summary (handoff notes only)
  - Handoff notes for next session
  - Any blockers discovered
  - ⚠️ NO task lists — use ROADMAP.md instead
- [ ] **session-state.json** updated:
  - Last commit, branch, test count
  - ⚠️ NO task arrays — use ROADMAP.md instead

---

## 🗺️ Sprint State Sync (Auto)

> **MANDATORY**: See `.agent/rules/sprint-tracking.md` for full protocol.

- [ ] **docs/ROADMAP.md** updated:
  - Completed tasks marked `[x]`
  - In-progress tasks marked `[/]`
  - New ad-hoc work logged in Ad-Hoc Work Log table
  - Sprint velocity table updated
- [ ] **docs/CHANGELOG.md** updated:
  - This session's changes logged under current sprint
- [ ] **Verify no duplicate tracking**:
  - No task arrays in `session-state.json`
  - No task lists in `session-context.md`

---

## 📊 Progress Documentation

- [ ] **README.md** or docs updated (if needed)
- [ ] **CHANGELOG.md** updated (if release-worthy changes)
- [ ] **ADRs created** for significant decisions
  - Use `/adr` command for new decisions

---

## 🔍 Quality Verification

- [ ] **All tests pass**
  ```bash
  npm test
  ```
- [ ] **Build succeeds**
  ```bash
  npm run build
  ```
- [ ] **Linting clean**
  ```bash
  npm run lint
  ```

---

## 📦 Git Status

- [ ] **All changes committed**
  ```bash
  git status  # Should be clean
  ```
- [ ] **Commit messages follow convention**
  ```
  feat(scope): description
  fix(scope): description
  docs(scope): description
  ```
- [ ] **Pushed to remote**
  ```bash
  git push origin [branch]
  ```

---

## 🔄 Handoff Preparation

If another session will continue this work:

- [ ] Clear **Next Steps** documented in session-context.md
- [ ] **Blockers** clearly identified
- [ ] Required **context files** listed
- [ ] Any **environment changes** noted

---

## ✅ Session Complete

**Final commit convention:**

```bash
git commit -m "chore(session): end session - [summary]"
git push origin [branch]
```

Session can now be safely ended.

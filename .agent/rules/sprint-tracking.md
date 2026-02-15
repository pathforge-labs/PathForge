# Sprint Tracking Protocol

> **Version**: 1.1.0
> **Effective**: 2026-02-14
> **Authority**: Emre Dursun — Product Owner
> **Enforcement**: MANDATORY — No exceptions

---

## Core Principle

**`docs/ROADMAP.md` is the Single Source of Truth (SSOT) for all sprint tracking.**

No task status may be tracked in any other file. This rule is inspired by:

- **Stripe's writing culture**: one document per decision, read-before-discuss
- **Amazon's document-driven culture**: narrative memos over presentations
- **Anthropic's context engineering**: structured markdown files (CLAUDE.md) for persistent agent memory
- **Linear's Cycles model**: sprint state visible at a glance, auto-rolling

---

## Mandatory Rules

### 1. SSOT Enforcement

- **ROADMAP.md** is the ONLY file where task status (`[ ]`, `[/]`, `[x]`, `[-]`) is tracked
- **NEVER** duplicate task lists in `session-context.md`, `session-state.json`, or conversation artifacts
- `session-context.md` → session-level handoff notes only
- `session-state.json` → volatile-only metadata (v2.1.0 schema — NO task arrays, NO static project data)

### 2. Sprint Identity

- Sprint numbers and definitions come from `docs/architecture/ARCHITECTURE.md` Section 7
- **NEVER invent new sprint numbers** — only use numbers from the master roadmap
- If unplanned work requires a sprint, use a **suffix**: `6a`, `6b`, `6a.1`
- If sprints need reordering, update BOTH `ROADMAP.md` AND `ARCHITECTURE.md`

### 3. Session Start Protocol

When a session begins, the agent MUST:

1. Read `docs/ROADMAP.md`
2. Identify the current sprint and its status
3. Present to the user:
   - Current sprint name and goal
   - 🔴 In-progress tasks (`[/]`)
   - 📋 Next priority tasks (`[ ]`)
   - ⚠️ Any blockers or dependencies
4. Validate sprint state matches `ARCHITECTURE.md` definitions
5. If drift is detected → alert user before proceeding

### 4. Session End Protocol

When a session ends, the agent MUST:

1. Update `docs/ROADMAP.md`:
   - Mark completed tasks `[x]`
   - Mark in-progress tasks `[/]`
   - Log any ad-hoc work in the Ad-Hoc Work Log table
2. Update `docs/CHANGELOG.md`:
   - Add entries for what shipped this session
3. Update `session-context.md`:
   - Session summary (handoff notes only, NO task lists)
4. Update `session-state.json`:
   - Last commit, branch, test count (NO task arrays)
5. Commit all tracking files together

### 5. Mid-Session Updates

During active work:

- When a task is completed → immediately mark `[x]` in `ROADMAP.md`
- When unplanned work begins → add to Ad-Hoc Work Log in `ROADMAP.md`
- When sprint questions are asked → read `ROADMAP.md` first, never answer from memory

### 6. Sprint Lifecycle

```
[ ] Not Started → [/] In Progress → [x] Completed
                                  → [-] Deferred (with reason)
```

A sprint is complete when:

- All planned tasks are `[x]` or `[-]` (with documented reason)
- Ad-hoc work is logged
- CHANGELOG.md is updated
- Commit pushed to `main`

### 7. Answering Sprint Questions

When the user asks about sprint status, timeline, or next steps:

1. **ALWAYS read ROADMAP.md first** — never answer from conversation memory
2. Cross-reference with ARCHITECTURE.md for definitions
3. Provide consistent, file-backed answers

---

## Reject & Escalate

| Condition                                                   | Action                                    |
| :---------------------------------------------------------- | :---------------------------------------- |
| Task tracked in `session-state.json` tasks array            | ❌ Remove immediately, move to ROADMAP.md |
| Sprint number not in ARCHITECTURE.md                        | ❌ Reject — use suffix notation           |
| Task status answered from memory without reading ROADMAP.md | ❌ Self-correct — read file first         |
| Session ends without ROADMAP.md update                      | ❌ Block — must sync before commit        |

---

## Version History

| Date       | Version | Change                                                                |
| :--------- | :------ | :-------------------------------------------------------------------- |
| 2026-02-15 | 1.1.0   | Aligned with PPTS v1.1.0 — volatile-only schema, staleness detection  |
| 2026-02-14 | 1.0.0   | Initial protocol — Professional Project Tracking System establishment |

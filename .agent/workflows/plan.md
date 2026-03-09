---
description: Strategic Sprint Planning & Engineering Intelligence. Dual-mode — sprint planning with velocity analysis & health scan, or feature planning with Socratic discovery.
---

# /plan — Strategic Sprint Planning & Engineering Intelligence

> **Trigger**: `/plan Sprint N` (sprint mode) · `/plan {feature}` (feature mode)
> **Skills**: `plan-writing`, `behavioral-modes` (BRAINSTORM)

> [!CAUTION]
> Plan ONLY — no implementation code. All 5 intelligence domains required. Approval required before execution.

---

## Mode Detection

| Input                   | Mode                          |
| :---------------------- | :---------------------------- |
| `/plan Sprint N`        | 🏃 Sprint Planning (8 steps)  |
| `/plan {anything else}` | 🔧 Feature Planning (6 steps) |

## 🔴 Critical Rules

1. **NO CODE** — planning only, zero implementation
2. **ROADMAP.md is SSOT** — sprint tasks come from `docs/ROADMAP.md`, never invented
3. **5 Domains** — evaluate Architecture, Security, Reliability, Product Strategy, Engineering Velocity
4. **Velocity Guardrails** — if planned > 1.5× historical avg → MUST propose sprint split
5. **P0 Gate** — unresolved P0 blockers from previous sprint = first workstream
6. **Approval** — plan presented to Product Owner before any execution

---

# 🏃 Sprint Planning Mode

Execute ALL steps IN ORDER.

### Step 1: Context Loading

// turbo

Load and extract data from:

- `docs/ROADMAP.md` — sprint definition, tasks, Phases, Verification Gates
- `.agent/session-context.md` — current context, P0 blockers, handoff notes, previous retro findings
- `.agent/session-state.json` — production readiness scores
- Previous sprint in ROADMAP → scan for `[ ]` (incomplete) and `[-]` (deferred) → **Rollover Items**
- `git log -10 --oneline` — recent commit context

**Parse format:** `### Sprint N — Title (emoji)` → `**Phase A — Name (N sessions)**` → `- [ ] task` → `> **Sprint N Verification Gates**: ...`

**Errors:** Missing sprint → ABORT. Stale session files (>7 days) → WARN and continue.

---

### Step 2: Sprint Velocity Analysis

// turbo

From the **Sprint Velocity** table in `docs/ROADMAP.md`:

1. `avg_tasks` = sum(Completed) / count(sprints)
2. `avg_sessions` = sum(Sessions) / count(sprints)
3. `avg_adhoc` = sum(Ad-Hoc Added) / count(sprints)
4. `velocity_ratio` = planned_tasks / avg_tasks
5. Reserve `ceil(avg_adhoc)` tasks as ad-hoc buffer (~15%)

| Ratio    | Action                                       |
| :------- | :------------------------------------------- |
| ≤ 1.0×   | ✅ Healthy                                   |
| 1.0–1.5× | ⚠️ Elevated — note in plan                   |
| > 1.5×   | 🔴 MUST propose sprint split (e.g., 39a/39b) |

No velocity data? Default: **8 tasks / 2 sessions**.

---

### Step 3: Platform Health Scan

Rate each domain ✅/⚠️/🔴 with evidence:

**Architecture** — Service boundaries clean? Data model consistent? Scalability bottlenecks?
**Security** — Auth flows complete? API protection (rate limit, CAPTCHA)? Dependencies audited?
**Reliability** — Monitoring active? Rollback strategy? Error rate acceptable?
**Product Strategy** — Highest-impact features identified? User journey bottlenecks?
**Engineering Velocity** — CI/CD healthy? Test coverage? Tech debt trend? Production readiness score from `session-state.json`?

---

### Step 4: Dependency & Risk Analysis

**Risk Matrix:**

| Risk          | Severity (P0–P4) | Likelihood | Mitigation |
| :------------ | :--------------- | :--------- | :--------- |
| [description] | P0–P4            | H/M/L      | [action]   |

**Dependency Chain** — identify `🔧 MANUAL` blockers:

```
Phase A (CODE) → no blockers
Phase B (CODE) → depends on A
Phase E (CODE) → ⚠️ BLOCKED BY: 🔧 MANUAL OAuth setup
```

**Cross-Sprint:** list dependencies on/from other sprints.

---

### Step 5: Strategic Prioritization

Priority order: **P0** Safety → **P1** Security → **P2** Architecture/Reliability → **P3** Product → **P4** Debt

Organize into **5 workstreams:**

1. **Platform Reliability** — infra, monitoring, resilience
2. **Security & Identity** — auth, authz, data protection
3. **Architecture** — service boundaries, data model, scalability
4. **Developer Experience** — CI/CD, tooling, testing, debt
5. **Product Capability** — user-facing features

---

### Step 6: Session Breakdown

Use ROADMAP Phase convention:

```
**Phase A — [Name] ([N] sessions)**
- [ ] Task (P0 — CODE)
- [ ] 🔧 MANUAL: Task (user action)
→ depends on Phase A

**Phase B — [Name] ([N] sessions)**
- [ ] Task (P1 — CODE)
```

Rules: P0 first · MANUAL tasks prefixed with `🔧 MANUAL:` · Dependencies noted with `→`

---

### Step 7: Validation Plan

1. Extract `> **Sprint N Verification Gates**:` from ROADMAP as exit criteria
2. Verify plan quality:
   - [ ] Every task has success criteria
   - [ ] Every workstream has ≥1 task
   - [ ] Risk matrix populated
   - [ ] Sessions ≤ historical avg (or split justified)
   - [ ] Rollover items addressed
   - [ ] MANUAL tasks have instructions
   - [ ] Cross-sprint dependencies documented

---

### Step 8: Output & Tracking

Create `docs/PLAN-sprint-{N}.md` with this structure:

```markdown
# Sprint {N} Plan — {Title}

> Generated: {date} · Velocity: {ratio}× · Readiness: {score}/100

## Strategic Objectives

## Platform Health Assessment (5 domains, ✅/⚠️/🔴)

## Rollover Items

## Workstreams (WS1–WS5 with tasks + verify criteria)

## Session Breakdown (Phase A/B/C convention)

## Dependency Chain (with 🔧 MANUAL blockers)

## Risk Matrix (severity/likelihood/mitigation)

## Verification Gates (from ROADMAP)

## Strategic Initiatives (optional — long-term proposals)

## Lessons from Previous Sprint
```

Present to Product Owner via `notify_user`. After approval: update Sprint Velocity table in ROADMAP.

---

# 🔧 Feature Planning Mode

### Step 1: Socratic Gate

Ask **3+ clarifying questions** (purpose, scope, constraints). Do NOT proceed until answered.

### Step 2: Architecture Impact

Files/services affected · dependency chain · breaking changes · pattern alignment

### Step 3: Security Implications

New auth requirements · data access controls · input validation · rate limiting needs

### Step 4: Task Breakdown

Follow `plan-writing` skill: 2–5 min tasks · explicit verify criteria · max 10 tasks · SPECIFIC (paths, commands, outputs)

### Step 5: Risk Assessment

Performance impact · backward compatibility · scalability · testing requirements

### Step 6: Plan Output

Create `docs/PLAN-{slug}.md`:

```markdown
# {Feature Name}

## Goal — one sentence

## Impact — files, services, breaking changes

## Tasks — [ ] Action → Verify: [check]

## Done When — success criteria

## Risks — risk → mitigation

## Notes
```

Present to Product Owner via `notify_user`.

---

## Governance

**PROHIBITED:** Writing code · inventing tasks outside ROADMAP · skipping domains · ignoring velocity data · starting without approval · marking ✅ without evidence

**REQUIRED:** Evaluate all 5 domains · separate MANUAL vs CODE · flag >1.5× with split · carry forward P0s first · include previous sprint lessons · extract Verification Gates

---

## Completion Criteria

- [ ] All steps executed in order
- [ ] Plan file created (`docs/PLAN-sprint-{N}.md` or `docs/PLAN-{slug}.md`)
- [ ] 5 domains evaluated (sprint) · Velocity documented · Risks mitigated
- [ ] MANUAL tasks flagged · Sessions follow Phase convention
- [ ] Product Owner approved

## Related Resources

| Resource        | Path                                  |
| :-------------- | :------------------------------------ |
| ROADMAP         | `docs/ROADMAP.md`                     |
| Session Context | `.agent/session-context.md`           |
| Session State   | `.agent/session-state.json`           |
| Plan Writing    | `.agent/skills/plan-writing/SKILL.md` |
| Quality Gate    | `.agent/workflows/quality-gate.md`    |
| Retrospective   | `.agent/workflows/retrospective.md`   |
| Architecture    | `docs/architecture/ARCHITECTURE.md`   |

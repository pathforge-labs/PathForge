# ADR-001: Agent Orchestration Strategy

> **Status**: DEFERRED (Agent Teams) | ACTIVE (Enhanced Sub-Agent)
> **Date Recorded**: 2026-02-11
> **Decision Maker**: Emre Dursun
> **Review Trigger**: Claude Code Agent Teams exits experimental status

---

## Context

Claude Code introduced **Agent Teams** — an experimental feature (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`) enabling multiple Claude Code instances to run as peers with direct messaging, shared task lists, and self-coordination.

We evaluated three orchestration models for PathForge:

| Model                     | Description                                              | Status          |
| :------------------------ | :------------------------------------------------------- | :-------------- |
| **A. Enhanced Sub-Agent** | Single session, agent personas, sequential orchestration | ✅ **Active**   |
| **B. Full Agent Teams**   | Multiple peer instances, direct messaging, shared tasks  | ⏸️ **Deferred** |
| **C. Hybrid**             | Sub-Agent default + Agent Teams for parallel sprints     | ⏸️ **Deferred** |

---

## Decision

**Postpone Agent Teams adoption** until the feature is officially stable. Continue with the Enhanced Sub-Agent model (Model A) as the primary orchestration strategy.

### Rationale

1. **Experimental status** — `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` flag signals instability
2. **Known limitations** (as of Feb 2026):
   - No session resumption for in-process teammates
   - Task status can lag / block dependent tasks
   - One team per session, no nested teams
   - Split panes require tmux (not available on Windows Terminal / VS Code natively)
   - Lead is fixed for team lifetime
   - Permissions set at spawn time only
3. **Current architecture works well** — 20+ successful sessions with zero orchestration failures
4. **Cost efficiency** — Agent Teams costs 3-5x more tokens per session

---

## Future Implementation Plan

When Agent Teams reaches stable release, implement all three models side-by-side:

```
.agent/
├── orchestration/
│   ├── sub-agent/          ← Current model (always available)
│   ├── agent-teams/        ← Full peer-to-peer (when stable)
│   └── hybrid/             ← Auto-select based on sprint type
```

### Model Selection Criteria (Future)

| Sprint Type                                   | Recommended Model    |
| :-------------------------------------------- | :------------------- |
| Single-track (landing page, single feature)   | Sub-Agent            |
| Multi-track (API + Frontend + Tests + DevOps) | Agent Teams          |
| Mixed complexity                              | Hybrid (auto-select) |

### Implementation Checklist (When Ready)

- [ ] Verify Agent Teams is no longer experimental
- [ ] Confirm Windows support (native or WSL2)
- [ ] Confirm session resumption works with teammates
- [ ] Test with a non-critical sprint first
- [ ] Document team templates for common PathForge sprints
- [ ] Update `/orchestrate` workflow to support model selection
- [ ] Add cost monitoring / token budget per team session

---

## Key Findings (Reference)

### Agent Teams Architecture

- **Communication**: Direct peer-to-peer messaging between teammates
- **Coordination**: Shared task list — teammates self-claim unblocked tasks
- **Display modes**: In-process (any terminal) or split panes (tmux/iTerm2)
- **Quality gates**: `TeammateIdle` and `TaskCompleted` hooks
- **Task assignment**: Lead assigns OR teammates self-claim

### Ideal Use Cases for Agent Teams

1. **Parallel code review** — security, performance, and test coverage reviewers simultaneously
2. **Competing hypotheses** — agents debate theories like a scientific panel
3. **Cross-layer sprints** — frontend, backend, tests each owned by a teammate
4. **Research & review** — multiple angles investigated simultaneously

### Estimated Impact on PathForge

| Factor          | Impact                                    |
| :-------------- | :---------------------------------------- |
| Sprint velocity | 2-4x for parallel work                    |
| Quality         | Neutral (peer review ↑, file conflicts ↓) |
| Token cost      | 3-5x per team session                     |
| MVP timeline    | Could shave 2-4 weeks off Sprint 2+       |

---

## References

- [Claude Code Agent Teams Docs](https://code.claude.com/docs/en/agent-teams)
- [Claude Code Sub-Agents vs Agent Teams — Video Walkthrough](https://www.youtube.com/watch?v=KCJsdQpcfic)
- [Sub-Agents vs Agent Teams Comparison](https://code.claude.com/docs/en/features-overview#compare-similar-features)
- Brainstorm artifact: `brainstorm_agent_teams.md` (conversation `68c03cd7`)
- Our current orchestration: `.agent/skills/parallel-agents/SKILL.md`, `.agent/workflows/orchestrate.md`

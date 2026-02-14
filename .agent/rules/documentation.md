# Documentation Rules

> **Priority**: HIGH — Enforced at session end
> **Scope**: PathForge workspace

---

## Document Hierarchy

| Document                       | Purpose                               | Update Frequency          |
| :----------------------------- | :------------------------------------ | :------------------------ |
| `docs/ARCHITECTURE.md`         | System design, sprint definitions     | When architecture changes |
| `docs/ROADMAP.md`              | Sprint board (SSOT for task tracking) | Every session             |
| `docs/CHANGELOG.md`            | Per-sprint shipped work               | Every session             |
| `docs/DEVELOPMENT_WORKFLOW.md` | Git workflow, conventions             | When process changes      |
| `docs/AGENT_ARCHITECTURE.md`   | Agent customization reference         | When agent config changes |
| `.agent/session-context.md`    | Session handoff notes (NO task lists) | Every session end         |
| `.agent/session-state.json`    | Machine-readable metadata             | Every session end         |

---

## Documentation Standards

### ROADMAP.md (SSOT)

- **ONLY** place where task status is tracked (`[ ]`, `[/]`, `[x]`, `[-]`)
- Sprint definitions reference `ARCHITECTURE.md` Section 7
- Ad-hoc work logged in the Ad-Hoc Work Log table
- Sprint velocity tracked per sprint

### CHANGELOG.md

- Follow [Keep a Changelog](https://keepachangelog.com/) format
- Organize by sprint, not by date
- Categories: `Added`, `Changed`, `Fixed`, `Removed`
- Every user-facing change gets an entry

### Inline Documentation

- **WHY** over **WHAT** — code should be self-documenting
- Complex algorithms: explain the approach before the code
- Workarounds: include the issue/reason and expected resolution
- API docstrings: describe purpose, parameters, return values, and raised exceptions

---

## Preservation Rule

> Inspired by Amazon's "writing survives meetings" culture.

- **No valuable content shall be silently deleted**
- When removing documentation, explain what was removed and why
- When moving content, update all cross-references in the same commit

---

## Cross-Reference Integrity

- File references in docs must resolve to real paths
- When a file is renamed or moved, update all referencing documents
- Sprint numbers must match between `ROADMAP.md` and `ARCHITECTURE.md`

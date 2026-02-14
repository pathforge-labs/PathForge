# MCP Server Architecture — PathForge

> **Last Updated**: 2026-02-14
> **Status**: Phase 1 (Foundation Active)

---

## Overview

Model Context Protocol (MCP) servers extend the Antigravity agent's capabilities by providing standardized tool interfaces. This document defines PathForge's MCP server strategy, current integrations, and future expansion plan.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Antigravity Agent                   │
│         (Claude Opus 4.6 / Gemini)              │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Rules   │  │ Workflows│  │    Skills     │  │
│  │ (.agent) │  │ (.agent) │  │   (.agent)    │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │           MCP Server Layer               │   │
│  │                                          │   │
│  │  ┌────────────┐  ┌──────────────────┐   │   │
│  │  │ GitKraken  │  │  Future Servers  │   │   │
│  │  │  (Active)  │  │   (Planned)      │   │   │
│  │  └────────────┘  └──────────────────┘   │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## Active MCP Servers

### GitKraken (Phase 1 — Active)

| Capability        | Tools                           | Usage                          |
| :---------------- | :------------------------------ | :----------------------------- |
| Repository status | `git_status`, `git_branch`      | Session start/end verification |
| Version control   | `git_add_or_commit`, `git_push` | Atomic commits                 |
| History & audit   | `git_log_or_diff`, `git_blame`  | Code review, debugging         |
| Branch management | `git_checkout`, `git_worktree`  | Feature branching              |
| Stash operations  | `git_stash`                     | Work-in-progress management    |

**Operational Rule**: When MCP Git tools are available, prefer them over raw `git` CLI commands. This ensures consistent logging and reduces error-prone manual commands.

---

## Recommended Expansion (Phase 2 — Sprint 7+)

| MCP Server                    | Purpose                                      | When to Add                              |
| :---------------------------- | :------------------------------------------- | :--------------------------------------- |
| **MCP Toolbox for Databases** | Direct PostgreSQL queries, schema inspection | When database debugging becomes frequent |
| **Cloud Run**                 | Deploy apps to Google Cloud Run              | If deploying to GCP instead of Railway   |
| **Firebase**                  | Push notifications, auth integration         | If mobile app (Sprint 8+) uses Firebase  |

### Selection Criteria

Before adding an MCP server, verify:

1. **Necessity**: Does it solve a repeated manual task?
2. **Security**: Does it require credentials? Are they scoped minimally?
3. **Overlap**: Does it duplicate existing CLI tools without adding value?
4. **Stability**: Is the MCP server stable and maintained?

---

## Configuration

MCP servers are configured at the **Antigravity extension level** (not per-workspace). Configuration is managed through the IDE's MCP settings panel (visible in the MCP Store).

### Current Configuration

```json
{
  "servers": {
    "GitKraken": {
      "status": "active",
      "capabilities": [
        "git_status",
        "git_branch",
        "git_commit",
        "git_push",
        "git_diff",
        "git_blame"
      ]
    }
  }
}
```

---

## Version History

| Date       | Change                                                 |
| :--------- | :----------------------------------------------------- |
| 2026-02-14 | Initial MCP architecture documented (GitKraken active) |

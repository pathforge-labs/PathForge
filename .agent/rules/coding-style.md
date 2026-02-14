# Coding Style Rules

> **Priority**: HIGH — Enforced in reviews
> **Scope**: PathForge workspace (TypeScript + Python)

---

## TypeScript (Frontend — Next.js 15)

- **STRICT** mode enabled (`strict: true` in `tsconfig.json`)
- **NO** `any` type usage — use `unknown` with type guards when needed
- **EXPLICIT** return types on all exported functions
- **Zod** for runtime validation of API responses and form input

### Naming Conventions

| Entity                     | Convention        | Example               |
| :------------------------- | :---------------- | :-------------------- |
| Variables & functions      | `camelCase`       | `getUserProfile`      |
| Types, interfaces, classes | `PascalCase`      | `FunnelEventResponse` |
| Constants                  | `SCREAMING_SNAKE` | `MAX_RETRY_COUNT`     |
| React components           | `PascalCase`      | `ThemeToggle`         |
| CSS custom properties      | `--kebab-case`    | `--color-primary`     |
| File names (components)    | `PascalCase.tsx`  | `NavDrawer.tsx`       |
| File names (utilities)     | `camelCase.ts`    | `useScrollState.ts`   |

---

## Python (Backend — FastAPI + SQLAlchemy)

- **Type hints** on ALL function signatures (parameters + return)
- **Pydantic** models for all request/response validation
- **NO** bare `except` clauses — always catch specific exceptions
- `snake_case` for functions, variables, modules
- `PascalCase` for classes (SQLAlchemy models, Pydantic schemas)
- **f-strings** preferred over `.format()` or `%`

### Module Organization

```
app/
├── api/v1/           # Route handlers (thin — delegate to services)
├── core/             # Security, config, database setup
├── models/           # SQLAlchemy ORM models
├── schemas/          # Pydantic request/response schemas
├── services/         # Business logic layer
└── ai/               # AI engine (parser, embeddings, matching, tailor)
```

---

## File Organization (Universal)

| Metric                  | Limit        | Enforcement                       |
| :---------------------- | :----------- | :-------------------------------- |
| Lines per file          | MAX 800      | Hard limit                        |
| Lines per function      | MAX 50       | Hard limit                        |
| Nesting depth           | MAX 4 levels | Hard limit                        |
| Parameters per function | MAX 5        | Soft limit — use objects beyond 5 |

---

## Immutability

- **PREFER** `const` over `let` (TypeScript)
- **USE** spread operator for state updates
- **AVOID** direct mutation — return new objects/arrays
- Python: favor tuple unpacking and `dataclass(frozen=True)` where applicable

---

## Import Order

### TypeScript

1. React / Next.js built-ins
2. Third-party packages
3. Internal aliases (`@/components`, `@/lib`)
4. Relative imports
5. Type-only imports (`import type { ... }`)

### Python

1. Standard library
2. Third-party packages
3. Local application imports
4. Blank line between each group

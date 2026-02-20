---
description: Database migration workflow using Alembic. Generate, review, apply, and verify migrations.
---

# /migrate - Database Migration

$ARGUMENTS

---

## Sub-commands

```
/migrate              - Interactive migration wizard
/migrate generate     - Auto-generate migration from model changes
/migrate review       - Review pending migration SQL
/migrate apply        - Apply pending migrations
/migrate history      - Show migration history
/migrate rollback     - Rollback last migration
```

---

## 🔴 CRITICAL RULES

1. **NEVER** modify database schema without an Alembic migration
2. **ALWAYS** review generated SQL before applying
3. **TEST** migrations on a clean database before pushing
4. **DOCUMENT** what each migration does in its docstring

---

## Migration Flow

```
/migrate generate
    │
    ▼
Model changes detected → Migration file created
    │
    ▼
/migrate review
    │
    ▼
Review upgrade() and downgrade() SQL
    │
    Acceptable? ──No──► Edit migration manually
    │
   Yes
    │
    ▼
/migrate apply
    │
    ▼
Migration applied → Database updated
    │
    ▼
Run tests to verify
    │
    ▼
✅ Migration Complete
```

---

## Steps

### 1. Generate Migration

```powershell
# Cwd: apps/api
& ".venv\Scripts\alembic.exe" revision --autogenerate -m "description_of_change"
```

### 2. Review Migration

```powershell
# Cwd: apps/api
& ".venv\Scripts\alembic.exe" heads
```

Then open the generated migration file in `apps/api/alembic/versions/` and verify:

- `upgrade()` function applies the correct schema changes
- `downgrade()` function properly reverses the changes
- Index creation is included for foreign keys and query columns

### 3. Apply Migration

```powershell
# Cwd: apps/api
& ".venv\Scripts\alembic.exe" upgrade head
```

### 4. Verify

// turbo

```powershell
# Cwd: apps/api
& ".venv\Scripts\python.exe" -m pytest tests/ -q
```

---

## Naming Convention

Migration messages follow the pattern: `<action>_<entity>_<detail>`

| Example       | Message                                       |
| :------------ | :-------------------------------------------- |
| New table     | `create_funnel_events_table`                  |
| Add column    | `add_status_check_constraint_to_applications` |
| Add index     | `add_index_on_user_id_to_jobs`                |
| Modify column | `change_metadata_column_type_in_insights`     |

---

## Examples

```
/migrate generate
/migrate review
/migrate apply
/migrate history
/migrate rollback
```

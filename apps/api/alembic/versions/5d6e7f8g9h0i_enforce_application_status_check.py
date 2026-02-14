"""
Enforce application status CHECK constraint at database level

Revision ID: 5d6e7f8g9h0i
Revises: 4c5d6e7f8g9h
Create Date: 2026-02-14

Sprint 7 — Production Readiness
The CHECK constraint was defined in the ORM model but never enforced at
the PostgreSQL level. This migration adds the constraint so that invalid
status values are rejected by the database itself.
"""

from alembic import op

# revision identifiers
revision = "5d6e7f8g9h0i"
down_revision = "4c5d6e7f8g9h"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_check_constraint(
        "ck_application_status",
        "applications",
        "status IN ('saved','applied','interviewing','offered','rejected','withdrawn')",
    )


def downgrade() -> None:
    op.drop_constraint("ck_application_status", "applications", type_="check")

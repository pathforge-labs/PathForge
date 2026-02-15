"""
Add Career DNA tables — career_dna, skill_genome_entries, hidden_skills,
experience_blueprints, growth_vectors, values_profiles, market_positions

Revision ID: 6e7f8g9h0i1j
Revises: 5d6e7f8g9h0i
Create Date: 2026-02-15

Sprint 8 — Career DNA Activation
Seven new tables implementing the 6 Career DNA™ dimensions:
    1. career_dna (hub entity — 1:1 with users)
    2. skill_genome_entries (explicit + inferred skills)
    3. hidden_skills (AI-discovered transferable skills)
    4. experience_blueprints (career pattern analysis)
    5. growth_vectors (trajectory projection)
    6. values_profiles (career values alignment)
    7. market_positions (market standing snapshot)
"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSON, UUID

from alembic import op

# revision identifiers
revision = "6e7f8g9h0i1j"
down_revision = "5d6e7f8g9h0i"
branch_labels = None
depends_on = None

_NOW = sa.func.now()
_UUID_PK = sa.Column("id", UUID(as_uuid=True), primary_key=True)
_TS_CREATED = sa.Column(
    "created_at", sa.DateTime(timezone=True),
    nullable=False, server_default=_NOW,
)
_TS_UPDATED = sa.Column(
    "updated_at", sa.DateTime(timezone=True),
    nullable=False, server_default=_NOW,
)


def _career_dna_fk(unique: bool = False) -> sa.Column:
    """Reusable FK column pointing to career_dna.id."""
    return sa.Column(
        "career_dna_id",
        UUID(as_uuid=True),
        sa.ForeignKey("career_dna.id", ondelete="CASCADE"),
        nullable=False,
        unique=unique,
    )


def upgrade() -> None:
    # ── 1. career_dna (hub) ────────────────────────────────────
    op.create_table(
        "career_dna",
        _UUID_PK,
        sa.Column(
            "user_id", UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False, unique=True,
        ),
        sa.Column(
            "completeness_score", sa.Float,
            nullable=False, server_default="0.0",
        ),
        sa.Column(
            "last_analysis_at", sa.DateTime(timezone=True),
            nullable=True,
        ),
        sa.Column(
            "version", sa.Integer,
            nullable=False, server_default="1",
        ),
        sa.Column("summary", sa.Text, nullable=True),
        _TS_CREATED,
        _TS_UPDATED,
    )
    op.create_index(
        "ix_career_dna_user_id", "career_dna",
        ["user_id"], unique=True,
    )

    # ── 2. skill_genome_entries ────────────────────────────────
    op.create_table(
        "skill_genome_entries",
        _UUID_PK,
        _career_dna_fk(unique=False),
        sa.Column("skill_name", sa.String(255), nullable=False),
        sa.Column(
            "category", sa.String(50),
            nullable=False, server_default="technical",
        ),
        sa.Column(
            "proficiency_level", sa.String(50),
            nullable=False, server_default="intermediate",
        ),
        sa.Column(
            "source", sa.String(50),
            nullable=False, server_default="explicit",
        ),
        sa.Column(
            "confidence", sa.Float,
            nullable=False, server_default="1.0",
        ),
        sa.Column("evidence", JSON, nullable=True),
        sa.Column("years_experience", sa.Integer, nullable=True),
        sa.Column("last_used_date", sa.String(50), nullable=True),
        _TS_CREATED,
        _TS_UPDATED,
    )
    op.create_index(
        "ix_skill_genome_entries_career_dna_id",
        "skill_genome_entries", ["career_dna_id"],
    )
    op.create_index(
        "ix_skill_genome_entries_skill_name",
        "skill_genome_entries", ["skill_name"],
    )

    # ── 3. hidden_skills ───────────────────────────────────────
    op.create_table(
        "hidden_skills",
        _UUID_PK,
        _career_dna_fk(unique=False),
        sa.Column("skill_name", sa.String(255), nullable=False),
        sa.Column(
            "discovery_method", sa.String(50),
            nullable=False, server_default="resume_inference",
        ),
        sa.Column(
            "confidence", sa.Float,
            nullable=False, server_default="0.5",
        ),
        sa.Column("evidence", JSON, nullable=True),
        sa.Column("user_confirmed", sa.Boolean, nullable=True),
        sa.Column("source_text", sa.Text, nullable=True),
        _TS_CREATED,
        _TS_UPDATED,
    )
    op.create_index(
        "ix_hidden_skills_career_dna_id",
        "hidden_skills", ["career_dna_id"],
    )
    op.create_index(
        "ix_hidden_skills_skill_name",
        "hidden_skills", ["skill_name"],
    )

    # ── 4. experience_blueprints ───────────────────────────────
    op.create_table(
        "experience_blueprints",
        _UUID_PK,
        _career_dna_fk(unique=True),
        sa.Column(
            "total_years", sa.Float,
            nullable=False, server_default="0.0",
        ),
        sa.Column(
            "role_count", sa.Integer,
            nullable=False, server_default="0",
        ),
        sa.Column(
            "avg_tenure_months", sa.Float,
            nullable=False, server_default="0.0",
        ),
        sa.Column(
            "career_direction", sa.String(50),
            nullable=False, server_default="exploring",
        ),
        sa.Column(
            "industry_diversity", sa.Float,
            nullable=False, server_default="0.0",
        ),
        sa.Column("seniority_trajectory", JSON, nullable=True),
        sa.Column("pattern_analysis", sa.Text, nullable=True),
        _TS_CREATED,
        _TS_UPDATED,
    )
    op.create_index(
        "ix_experience_blueprints_career_dna_id",
        "experience_blueprints", ["career_dna_id"], unique=True,
    )

    # ── 5. growth_vectors ──────────────────────────────────────
    op.create_table(
        "growth_vectors",
        _UUID_PK,
        _career_dna_fk(unique=True),
        sa.Column(
            "current_trajectory", sa.String(50),
            nullable=False, server_default="steady",
        ),
        sa.Column("projected_roles", JSON, nullable=True),
        sa.Column("skill_velocity", JSON, nullable=True),
        sa.Column(
            "growth_score", sa.Float,
            nullable=False, server_default="50.0",
        ),
        sa.Column("analysis_reasoning", sa.Text, nullable=True),
        _TS_CREATED,
        _TS_UPDATED,
    )
    op.create_index(
        "ix_growth_vectors_career_dna_id",
        "growth_vectors", ["career_dna_id"], unique=True,
    )

    # ── 6. values_profiles ─────────────────────────────────────
    op.create_table(
        "values_profiles",
        _UUID_PK,
        _career_dna_fk(unique=True),
        sa.Column(
            "work_style", sa.String(50),
            nullable=False, server_default="flexible",
        ),
        sa.Column(
            "impact_preference", sa.String(50),
            nullable=False, server_default="team",
        ),
        sa.Column("environment_fit", JSON, nullable=True),
        sa.Column("derived_values", JSON, nullable=True),
        sa.Column(
            "confidence", sa.Float,
            nullable=False, server_default="0.5",
        ),
        _TS_CREATED,
        _TS_UPDATED,
    )
    op.create_index(
        "ix_values_profiles_career_dna_id",
        "values_profiles", ["career_dna_id"], unique=True,
    )

    # ── 7. market_positions ────────────────────────────────────
    op.create_table(
        "market_positions",
        _UUID_PK,
        _career_dna_fk(unique=True),
        sa.Column(
            "percentile_overall", sa.Float,
            nullable=False, server_default="50.0",
        ),
        sa.Column("skill_demand_scores", JSON, nullable=True),
        sa.Column(
            "matching_job_count", sa.Integer,
            nullable=False, server_default="0",
        ),
        sa.Column(
            "market_trend", sa.String(50),
            nullable=False, server_default="stable",
        ),
        sa.Column(
            "computed_at", sa.DateTime(timezone=True),
            nullable=False, server_default=_NOW,
        ),
        _TS_CREATED,
        _TS_UPDATED,
    )
    op.create_index(
        "ix_market_positions_career_dna_id",
        "market_positions", ["career_dna_id"], unique=True,
    )


def downgrade() -> None:
    # Drop child tables first (FK dependency order)
    op.drop_table("market_positions")
    op.drop_table("values_profiles")
    op.drop_table("growth_vectors")
    op.drop_table("experience_blueprints")
    op.drop_table("hidden_skills")
    op.drop_table("skill_genome_entries")
    op.drop_table("career_dna")

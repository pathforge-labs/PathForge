"""
Add Career Threat Radar™ tables — automation_risks, industry_trends,
skill_shield_entries, career_resilience_snapshots, threat_alerts,
alert_preferences

Revision ID: 7f8g9h0i1j2k
Revises: 6e7f8g9h0i1j
Create Date: 2026-02-15

Sprint 9 — Career Threat Radar™
Six new tables implementing the 4 proprietary innovations:
    1. automation_risks (ONET + LLM hybrid scoring)
    2. industry_trends (personalized trend monitoring)
    3. skill_shield_entries (Skills Shield™ classification)
    4. career_resilience_snapshots (Career Resilience Score™ + Moat)
    5. threat_alerts (severity-tiered proactive alerts)
    6. alert_preferences (user notification preferences)
"""

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSON, UUID

from alembic import op

# revision identifiers
revision = "7f8g9h0i1j2k"
down_revision = "6e7f8g9h0i1j"
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
    # ── 1. automation_risks ────────────────────────────────────
    op.create_table(
        "automation_risks",
        _UUID_PK,
        _career_dna_fk(unique=True),
        sa.Column("onet_soc_code", sa.String(20), nullable=False),
        sa.Column("onet_occupation_title", sa.String(255), nullable=False),
        sa.Column("base_automation_probability", sa.Float, nullable=False),
        sa.Column(
            "contextual_risk_score", sa.Float,
            nullable=False, server_default="50.0",
        ),
        sa.Column(
            "risk_level", sa.String(20),
            nullable=False, server_default="medium",
        ),
        sa.Column("vulnerable_tasks", JSON, nullable=True),
        sa.Column("resilient_tasks", JSON, nullable=True),
        sa.Column("recommended_skills", JSON, nullable=True),
        sa.Column("analysis_reasoning", sa.Text, nullable=True),
        sa.Column("opportunity_inversions", JSON, nullable=True),
        sa.Column(
            "analyzed_at", sa.DateTime(timezone=True),
            nullable=False, server_default=_NOW,
        ),
        _TS_CREATED,
        _TS_UPDATED,
    )
    op.create_index(
        "ix_automation_risks_career_dna_id",
        "automation_risks", ["career_dna_id"], unique=True,
    )

    # ── 2. industry_trends ─────────────────────────────────────
    op.create_table(
        "industry_trends",
        _UUID_PK,
        _career_dna_fk(unique=False),
        sa.Column("industry_name", sa.String(255), nullable=False),
        sa.Column(
            "trend_direction", sa.String(20),
            nullable=False, server_default="stable",
        ),
        sa.Column(
            "confidence", sa.Float,
            nullable=False, server_default="0.5",
        ),
        sa.Column("key_signals", JSON, nullable=True),
        sa.Column("impact_on_user", sa.Text, nullable=True),
        sa.Column("recommended_actions", JSON, nullable=True),
        sa.Column("data_sources", JSON, nullable=True),
        sa.Column(
            "analyzed_at", sa.DateTime(timezone=True),
            nullable=False, server_default=_NOW,
        ),
        _TS_CREATED,
        _TS_UPDATED,
    )
    op.create_index(
        "ix_industry_trends_career_dna_id",
        "industry_trends", ["career_dna_id"],
    )

    # ── 3. skill_shield_entries ────────────────────────────────
    op.create_table(
        "skill_shield_entries",
        _UUID_PK,
        _career_dna_fk(unique=False),
        sa.Column("skill_name", sa.String(255), nullable=False),
        sa.Column(
            "classification", sa.String(20),
            nullable=False, server_default="neutral",
        ),
        sa.Column(
            "automation_resistance", sa.Float,
            nullable=False, server_default="0.5",
        ),
        sa.Column(
            "market_demand_trend", sa.String(20),
            nullable=False, server_default="stable",
        ),
        sa.Column("reasoning", sa.Text, nullable=True),
        sa.Column("improvement_path", sa.Text, nullable=True),
        _TS_CREATED,
        _TS_UPDATED,
    )
    op.create_index(
        "ix_skill_shield_entries_career_dna_id",
        "skill_shield_entries", ["career_dna_id"],
    )
    op.create_index(
        "ix_skill_shield_entries_skill_name",
        "skill_shield_entries", ["skill_name"],
    )

    # ── 4. career_resilience_snapshots ─────────────────────────
    op.create_table(
        "career_resilience_snapshots",
        _UUID_PK,
        _career_dna_fk(unique=False),
        # CRS 5-factor scores
        sa.Column(
            "overall_score", sa.Float,
            nullable=False, server_default="50.0",
        ),
        sa.Column(
            "skill_diversity_index", sa.Float,
            nullable=False, server_default="50.0",
        ),
        sa.Column(
            "automation_resistance", sa.Float,
            nullable=False, server_default="50.0",
        ),
        sa.Column(
            "growth_velocity", sa.Float,
            nullable=False, server_default="50.0",
        ),
        sa.Column(
            "industry_stability", sa.Float,
            nullable=False, server_default="50.0",
        ),
        sa.Column(
            "adaptability_signal", sa.Float,
            nullable=False, server_default="50.0",
        ),
        # Career Moat Score
        sa.Column(
            "moat_score", sa.Float,
            nullable=False, server_default="50.0",
        ),
        sa.Column(
            "moat_strength", sa.String(20),
            nullable=False, server_default="narrow",
        ),
        # Explainability
        sa.Column("explanation", sa.Text, nullable=True),
        sa.Column("improvement_actions", JSON, nullable=True),
        sa.Column(
            "computed_at", sa.DateTime(timezone=True),
            nullable=False, server_default=_NOW,
        ),
        _TS_CREATED,
        _TS_UPDATED,
    )
    op.create_index(
        "ix_career_resilience_snapshots_career_dna_id",
        "career_resilience_snapshots", ["career_dna_id"],
    )

    # ── 5. threat_alerts ───────────────────────────────────────
    op.create_table(
        "threat_alerts",
        _UUID_PK,
        _career_dna_fk(unique=False),
        sa.Column(
            "category", sa.String(30),
            nullable=False, server_default="market_shift",
        ),
        sa.Column(
            "severity", sa.String(20),
            nullable=False, server_default="low",
        ),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("opportunity", sa.Text, nullable=False),
        sa.Column("evidence", JSON, nullable=True),
        sa.Column(
            "channel", sa.String(20),
            nullable=False, server_default="in_app",
        ),
        sa.Column(
            "status", sa.String(20),
            nullable=False, server_default="unread",
        ),
        sa.Column(
            "snoozed_until", sa.DateTime(timezone=True),
            nullable=True,
        ),
        sa.Column(
            "read_at", sa.DateTime(timezone=True),
            nullable=True,
        ),
        _TS_CREATED,
        _TS_UPDATED,
    )
    op.create_index(
        "ix_threat_alerts_career_dna_id",
        "threat_alerts", ["career_dna_id"],
    )
    op.create_index(
        "ix_threat_alerts_status",
        "threat_alerts", ["status"],
    )
    op.create_index(
        "ix_threat_alerts_severity",
        "threat_alerts", ["severity"],
    )

    # ── 6. alert_preferences ──────────────────────────────────
    op.create_table(
        "alert_preferences",
        _UUID_PK,
        _career_dna_fk(unique=True),
        sa.Column("enabled_categories", JSON, nullable=False),
        sa.Column(
            "min_severity", sa.String(20),
            nullable=False, server_default="low",
        ),
        sa.Column("enabled_channels", JSON, nullable=False),
        sa.Column("quiet_hours_start", sa.Time, nullable=True),
        sa.Column("quiet_hours_end", sa.Time, nullable=True),
        _TS_CREATED,
        _TS_UPDATED,
    )
    op.create_index(
        "ix_alert_preferences_career_dna_id",
        "alert_preferences", ["career_dna_id"], unique=True,
    )


def downgrade() -> None:
    # Drop child tables first (FK dependency order)
    op.drop_table("alert_preferences")
    op.drop_table("threat_alerts")
    op.drop_table("career_resilience_snapshots")
    op.drop_table("skill_shield_entries")
    op.drop_table("industry_trends")
    op.drop_table("automation_risks")

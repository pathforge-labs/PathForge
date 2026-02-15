"""
PathForge — Career Threat Radar™ Models
==========================================
Domain models for the Career Threat Radar™ system — the industry's
first consumer-grade career threat intelligence platform.

Models:
    1. AutomationRisk — ONET + LLM hybrid automation risk scoring
    2. IndustryTrend — Personalized industry trend monitoring
    3. SkillShieldEntry — Skills Shield™ classification (shield/exposure)
    4. CareerResilienceSnapshot — Career Resilience Score™ (5-factor composite)
    5. ThreatAlert — Severity-tiered proactive career alerts
    6. AlertPreference — User notification preferences

Proprietary Innovations:
    - Career Resilience Score™ (5-factor composite, 0–100)
    - Skills Shield™ Matrix (protective vs vulnerable skills)
    - Threat→Opportunity Inversion Engine (every threat → opportunity)
    - Career Moat Score (4-dimension defensibility, 0–100)
"""

import enum
import uuid
from datetime import datetime, time

from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    String,
    Text,
    Time,
    func,
)
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin

# ── Enums ──────────────────────────────────────────────────────


class AlertSeverity(enum.StrEnum):
    """Threat severity classification (3-tier for anti-catastrophizing)."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class AlertCategory(enum.StrEnum):
    """Career threat signal categories."""

    AUTOMATION_RISK = "automation_risk"
    INDUSTRY_DECLINE = "industry_decline"
    SKILL_OBSOLESCENCE = "skill_obsolescence"
    LAYOFF_SIGNAL = "layoff_signal"
    MARKET_SHIFT = "market_shift"


class AlertChannel(enum.StrEnum):
    """Notification delivery channel (extensible for Sprint 10+)."""

    IN_APP = "in_app"       # Sprint 9 — implemented
    EMAIL = "email"         # Sprint 10+ — architecture only
    PUSH = "push"           # Sprint 10+ — architecture only


class AlertStatus(enum.StrEnum):
    """Alert lifecycle status with user autonomy controls."""

    UNREAD = "unread"
    READ = "read"
    DISMISSED = "dismissed"
    SNOOZED = "snoozed"
    ACTED_ON = "acted_on"


class TrendDirection(enum.StrEnum):
    """Industry health direction classification."""

    GROWING = "growing"
    STABLE = "stable"
    DECLINING = "declining"
    DISRUPTED = "disrupted"


class ShieldClassification(enum.StrEnum):
    """Skills Shield™ classification for Frey-Osborne bottleneck mapping."""

    SHIELD = "shield"       # Protects against disruption (high bottleneck)
    EXPOSURE = "exposure"   # Increases vulnerability (low bottleneck)
    NEUTRAL = "neutral"     # Minimal directional impact


class MoatStrength(enum.StrEnum):
    """Career Moat Score band classification (Buffett moat theory)."""

    WIDE = "wide"           # 75–100: strong defensive position
    NARROW = "narrow"       # 40–74: moderate protection
    NONE = "none"           # 0–39: vulnerable position


# ── AutomationRisk ─────────────────────────────────────────────


class AutomationRisk(UUIDMixin, TimestampMixin, Base):
    """
    Hybrid automation risk assessment per Career DNA profile.

    Combines:
        A) ONET Frey-Osborne static probability (702 SOC codes)
        B) LLM contextual analysis against user's Career DNA
        C) Threat→Opportunity inversion recommendations

    Explainability: every score includes analysis_reasoning
    and opportunity_inversions for anti-anxiety UX.
    """

    __tablename__ = "automation_risks"

    career_dna_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("career_dna.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    onet_soc_code: Mapped[str] = mapped_column(
        String(20), nullable=False
    )
    onet_occupation_title: Mapped[str] = mapped_column(
        String(255), nullable=False
    )
    base_automation_probability: Mapped[float] = mapped_column(
        Float, nullable=False
    )
    contextual_risk_score: Mapped[float] = mapped_column(
        Float, default=50.0, nullable=False
    )
    risk_level: Mapped[str] = mapped_column(
        String(20), default=AlertSeverity.MEDIUM.value, nullable=False
    )
    vulnerable_tasks: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    resilient_tasks: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    recommended_skills: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    analysis_reasoning: Mapped[str | None] = mapped_column(Text, nullable=True)
    opportunity_inversions: Mapped[dict | None] = mapped_column(
        JSON, nullable=True
    )
    analyzed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    career_dna: Mapped["CareerDNA"] = relationship(
        "CareerDNA", back_populates="automation_risk"
    )

    def __repr__(self) -> str:
        return (
            f"<AutomationRisk soc={self.onet_soc_code} "
            f"risk={self.contextual_risk_score}>"
        )


# ── IndustryTrend ──────────────────────────────────────────────


class IndustryTrend(UUIDMixin, TimestampMixin, Base):
    """
    Personalized industry trend analysis.

    LLM-powered analysis of the user's primary industry,
    with impact assessment specific to their Career DNA.
    Includes recommended_actions as Threat→Opportunity inversions.
    """

    __tablename__ = "industry_trends"

    career_dna_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("career_dna.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    industry_name: Mapped[str] = mapped_column(String(255), nullable=False)
    trend_direction: Mapped[str] = mapped_column(
        String(20), default=TrendDirection.STABLE.value, nullable=False
    )
    confidence: Mapped[float] = mapped_column(
        Float, default=0.5, nullable=False
    )
    key_signals: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    impact_on_user: Mapped[str | None] = mapped_column(Text, nullable=True)
    recommended_actions: Mapped[dict | None] = mapped_column(
        JSON, nullable=True
    )
    data_sources: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    analyzed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    career_dna: Mapped["CareerDNA"] = relationship(
        "CareerDNA", back_populates="industry_trends"
    )

    def __repr__(self) -> str:
        return (
            f"<IndustryTrend {self.industry_name} "
            f"({self.trend_direction})>"
        )


# ── SkillShieldEntry ───────────────────────────────────────────


class SkillShieldEntry(UUIDMixin, TimestampMixin, Base):
    """
    Skills Shield™ classification for a single skill.

    Classifies each skill in the user's genome as:
        - SHIELD: high Frey-Osborne bottleneck score (creativity,
          social intelligence, perception/manipulation)
        - EXPOSURE: low bottleneck score, mapped to automatable tasks
        - NEUTRAL: minimal directional impact

    Cross-referenced with Career DNA proficiency levels.
    """

    __tablename__ = "skill_shield_entries"

    career_dna_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("career_dna.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    skill_name: Mapped[str] = mapped_column(String(255), nullable=False)
    classification: Mapped[str] = mapped_column(
        String(20), default=ShieldClassification.NEUTRAL.value, nullable=False
    )
    automation_resistance: Mapped[float] = mapped_column(
        Float, default=0.5, nullable=False
    )
    market_demand_trend: Mapped[str] = mapped_column(
        String(20), default=TrendDirection.STABLE.value, nullable=False
    )
    reasoning: Mapped[str | None] = mapped_column(Text, nullable=True)
    improvement_path: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    career_dna: Mapped["CareerDNA"] = relationship(
        "CareerDNA", back_populates="skill_shield_entries"
    )

    def __repr__(self) -> str:
        return (
            f"<SkillShieldEntry {self.skill_name} "
            f"({self.classification})>"
        )


# ── CareerResilienceSnapshot ───────────────────────────────────


class CareerResilienceSnapshot(UUIDMixin, TimestampMixin, Base):
    """
    Career Resilience Score™ — 5-factor composite metric (0–100).

    Weighted formula:
        CRS = (skill_diversity × 0.25) + (automation_resistance × 0.25)
            + (growth_velocity × 0.20) + (industry_stability × 0.15)
            + (adaptability_signal × 0.15)

    Also includes Career Moat Score (4-dimension defensibility):
        1. Skill Rarity (inverse frequency)
        2. Switching Cost (employer replacement difficulty)
        3. Network Effect (cross-functional value growth)
        4. Intangible Assets (certifications, patents, domain depth)

    Every factor is visible and explainable — PathForge Manifesto #6.
    """

    __tablename__ = "career_resilience_snapshots"

    career_dna_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("career_dna.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    # Career Resilience Score™ — 5 factors
    overall_score: Mapped[float] = mapped_column(
        Float, default=50.0, nullable=False
    )
    skill_diversity_index: Mapped[float] = mapped_column(
        Float, default=50.0, nullable=False
    )
    automation_resistance: Mapped[float] = mapped_column(
        Float, default=50.0, nullable=False
    )
    growth_velocity: Mapped[float] = mapped_column(
        Float, default=50.0, nullable=False
    )
    industry_stability: Mapped[float] = mapped_column(
        Float, default=50.0, nullable=False
    )
    adaptability_signal: Mapped[float] = mapped_column(
        Float, default=50.0, nullable=False
    )

    # Career Moat Score — 4 dimensions
    moat_score: Mapped[float] = mapped_column(
        Float, default=50.0, nullable=False
    )
    moat_strength: Mapped[str] = mapped_column(
        String(20), default=MoatStrength.NARROW.value, nullable=False
    )

    # Explainability
    explanation: Mapped[str | None] = mapped_column(Text, nullable=True)
    improvement_actions: Mapped[dict | None] = mapped_column(
        JSON, nullable=True
    )
    computed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    career_dna: Mapped["CareerDNA"] = relationship(
        "CareerDNA", back_populates="resilience_snapshots"
    )

    def __repr__(self) -> str:
        return (
            f"<CareerResilienceSnapshot crs={self.overall_score} "
            f"moat={self.moat_score} ({self.moat_strength})>"
        )


# ── ThreatAlert ────────────────────────────────────────────────


class ThreatAlert(UUIDMixin, TimestampMixin, Base):
    """
    Proactive career threat alert with Threat→Opportunity inversion.

    Design principle: a user NEVER sees a threat without a pathway.
    The `opportunity` field ensures anti-anxiety UX design —
    every alert includes an actionable recommendation.

    Severity validation: HIGH requires ≥2 signal sources (evidence field).
    """

    __tablename__ = "threat_alerts"

    career_dna_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("career_dna.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    category: Mapped[str] = mapped_column(
        String(30), default=AlertCategory.MARKET_SHIFT.value, nullable=False
    )
    severity: Mapped[str] = mapped_column(
        String(20), default=AlertSeverity.LOW.value, nullable=False
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    opportunity: Mapped[str] = mapped_column(Text, nullable=False)
    evidence: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    channel: Mapped[str] = mapped_column(
        String(20), default=AlertChannel.IN_APP.value, nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(20), default=AlertStatus.UNREAD.value, nullable=False
    )
    snoozed_until: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    read_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationships
    career_dna: Mapped["CareerDNA"] = relationship(
        "CareerDNA", back_populates="threat_alerts"
    )

    def __repr__(self) -> str:
        return (
            f"<ThreatAlert [{self.severity}] {self.category}: "
            f"{self.title[:40]}>"
        )


# ── AlertPreference ────────────────────────────────────────────


class AlertPreference(UUIDMixin, TimestampMixin, Base):
    """
    User alert notification preferences.

    Supports user autonomy (PathForge Manifesto #5):
    users can dismiss, snooze, or disable alert categories.
    Extensible for multi-channel delivery in Sprint 10+.
    """

    __tablename__ = "alert_preferences"

    career_dna_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("career_dna.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    enabled_categories: Mapped[dict] = mapped_column(
        JSON,
        default=lambda: [category.value for category in AlertCategory],
        nullable=False,
    )
    min_severity: Mapped[str] = mapped_column(
        String(20), default=AlertSeverity.LOW.value, nullable=False
    )
    enabled_channels: Mapped[dict] = mapped_column(
        JSON,
        default=lambda: [AlertChannel.IN_APP.value],
        nullable=False,
    )
    quiet_hours_start: Mapped[time | None] = mapped_column(
        Time, nullable=True
    )
    quiet_hours_end: Mapped[time | None] = mapped_column(
        Time, nullable=True
    )

    # Relationships
    career_dna: Mapped["CareerDNA"] = relationship(
        "CareerDNA", back_populates="alert_preference"
    )

    def __repr__(self) -> str:
        return f"<AlertPreference min_severity={self.min_severity}>"

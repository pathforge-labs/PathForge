"""
PathForge — Analytics Models
==============================
Funnel pipeline events, market intelligence snapshots,
and CV A/B experiment tracking.

Sprint 6b — Analytics (ARCHITECTURE.md §3.2 / §7)
"""

import uuid
from datetime import UTC, datetime
from enum import StrEnum

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------


class FunnelStage(StrEnum):
    """Application lifecycle stages for funnel tracking."""

    VIEWED = "viewed"
    SAVED = "saved"
    CV_TAILORED = "cv_tailored"
    APPLIED = "applied"
    INTERVIEWING = "interviewing"
    OFFERED = "offered"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class InsightType(StrEnum):
    """Categories of market intelligence insights."""

    SKILL_DEMAND = "skill_demand"
    SALARY_TREND = "salary_trend"
    MARKET_HEAT = "market_heat"
    COMPETITION_LEVEL = "competition_level"
    APPLICATION_VELOCITY = "application_velocity"


class ExperimentStatus(StrEnum):
    """Lifecycle states for a CV A/B experiment."""

    RUNNING = "running"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------


class FunnelEvent(UUIDMixin, Base):
    """
    Tracks every stage transition in the application lifecycle.

    Architecture ref: ARCHITECTURE.md §3.2 — FunnelEvent entity.
    Each row represents a single user-action in the funnel, enabling
    conversion-rate analysis across the full job-application pipeline.
    """

    __tablename__ = "funnel_events"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    application_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("applications.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    stage: Mapped[str] = mapped_column(
        String(30), nullable=False, index=True,
    )
    metadata_: Mapped[dict | None] = mapped_column(
        "metadata", JSON, nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
        index=True,
    )

    # Relationships
    user: Mapped["User"] = relationship("User")
    application: Mapped["Application | None"] = relationship("Application")

    def __repr__(self) -> str:
        return f"<FunnelEvent {self.stage} user={self.user_id}>"


class MarketInsight(UUIDMixin, Base):
    """
    Aggregated market intelligence snapshots.

    Architecture ref: ARCHITECTURE.md §3.2 — MarketInsight entity.
    Stores computed analytics like skill-demand trends, salary curves,
    and competitive landscape metrics for a specific user and time period.
    """

    __tablename__ = "market_insights"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    insight_type: Mapped[str] = mapped_column(
        String(30), nullable=False, index=True,
    )
    data: Mapped[dict] = mapped_column(
        JSON, nullable=False,
    )
    period: Mapped[str] = mapped_column(
        String(20), nullable=False,
    )
    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
        index=True,
    )

    # Relationships
    user: Mapped["User"] = relationship("User")

    def __repr__(self) -> str:
        return f"<MarketInsight {self.insight_type} period={self.period}>"


class CVExperiment(UUIDMixin, TimestampMixin, Base):
    """
    CV A/B experiment — compares two tailored CV versions.

    Tracks performance of variant_a vs variant_b for the same job listing.
    Extends the existing CVVersion model with experimentation capabilities
    for data-driven CV optimization.
    """

    __tablename__ = "cv_experiments"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    job_listing_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("job_listings.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    variant_a_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("cv_versions.id", ondelete="CASCADE"),
        nullable=False,
    )
    variant_b_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("cv_versions.id", ondelete="CASCADE"),
        nullable=False,
    )
    winner_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("cv_versions.id", ondelete="SET NULL"),
        nullable=True,
    )
    status: Mapped[str] = mapped_column(
        String(20), default=ExperimentStatus.RUNNING, nullable=False, index=True,
    )
    metrics: Mapped[dict | None] = mapped_column(
        JSON, nullable=True,
    )
    hypothesis: Mapped[str | None] = mapped_column(
        Text, nullable=True,
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True,
    )

    # Relationships
    user: Mapped["User"] = relationship("User")
    job_listing: Mapped["JobListing"] = relationship("JobListing")
    variant_a: Mapped["CVVersion"] = relationship("CVVersion", foreign_keys=[variant_a_id])
    variant_b: Mapped["CVVersion"] = relationship("CVVersion", foreign_keys=[variant_b_id])
    winner: Mapped["CVVersion | None"] = relationship(
        "CVVersion", foreign_keys=[winner_id],
    )

    def __repr__(self) -> str:
        return f"<CVExperiment {self.status} job={self.job_listing_id}>"

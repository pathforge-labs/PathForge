"""
PathForge — Application & CVVersion Models
============================================
Job application lifecycle tracking and tailored CV versioning.
"""

from __future__ import annotations

import uuid
from enum import StrEnum
from typing import TYPE_CHECKING, Any

from sqlalchemy import CheckConstraint, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.job_listing import JobListing
    from app.models.resume import Resume
    from app.models.user import User


class ApplicationStatus(StrEnum):
    """Valid statuses for an application lifecycle."""

    SAVED = "saved"
    APPLIED = "applied"
    INTERVIEWING = "interviewing"
    OFFERED = "offered"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


# Valid state transitions
VALID_TRANSITIONS: dict[ApplicationStatus, set[ApplicationStatus]] = {
    ApplicationStatus.SAVED: {
        ApplicationStatus.APPLIED,
        ApplicationStatus.WITHDRAWN,
    },
    ApplicationStatus.APPLIED: {
        ApplicationStatus.INTERVIEWING,
        ApplicationStatus.REJECTED,
        ApplicationStatus.WITHDRAWN,
    },
    ApplicationStatus.INTERVIEWING: {
        ApplicationStatus.OFFERED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.WITHDRAWN,
    },
    ApplicationStatus.OFFERED: {
        ApplicationStatus.WITHDRAWN,
    },
    ApplicationStatus.REJECTED: set(),
    ApplicationStatus.WITHDRAWN: set(),
}


class Application(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "applications"
    __table_args__ = (
        UniqueConstraint("user_id", "job_listing_id", name="uq_user_job_application"),
        CheckConstraint(
            "status IN ('saved','applied','interviewing','offered','rejected','withdrawn')",
            name="ck_application_status",
        ),
    )

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
    cv_version_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("cv_versions.id", ondelete="SET NULL"),
        nullable=True,
    )
    status: Mapped[str] = mapped_column(
        String(20), default=ApplicationStatus.SAVED, nullable=False, index=True,
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    user: Mapped[User] = relationship("User", back_populates="applications")
    job_listing: Mapped[JobListing] = relationship("JobListing")
    cv_version: Mapped[CVVersion | None] = relationship(
        "CVVersion", back_populates="application",
    )

    def __repr__(self) -> str:
        return f"<Application {self.status} for job={self.job_listing_id}>"


class CVVersion(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "cv_versions"

    resume_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resumes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    job_listing_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("job_listings.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    tailored_content: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    diff_from_base: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    ats_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    generation_log: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    # Relationships
    resume: Mapped[Resume] = relationship("Resume")
    job_listing: Mapped[JobListing] = relationship("JobListing")
    application: Mapped[Application | None] = relationship(
        "Application", back_populates="cv_version", uselist=False,
    )

    def __repr__(self) -> str:
        return f"<CVVersion v{self.version} for job={self.job_listing_id}>"

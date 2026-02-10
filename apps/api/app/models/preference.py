"""
PathForge — Preference & BlacklistEntry Models
================================================
User's job search preferences and company exclusion list.
"""

import uuid

from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class Preference(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "preferences"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    locations: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    work_type: Mapped[str | None] = mapped_column(String(50), nullable=True)  # remote/hybrid/onsite
    salary_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    salary_max: Mapped[int | None] = mapped_column(Integer, nullable=True)
    salary_currency: Mapped[str] = mapped_column(String(3), default="EUR", nullable=False)
    sectors: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    job_titles: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    experience_level: Mapped[str | None] = mapped_column(String(50), nullable=True)
    extra: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="preferences")

    def __repr__(self) -> str:
        return f"<Preference user={self.user_id}>"


class BlacklistEntry(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "blacklist_entries"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_current_employer: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="blacklist_entries")

    def __repr__(self) -> str:
        return f"<BlacklistEntry {self.company_name}>"

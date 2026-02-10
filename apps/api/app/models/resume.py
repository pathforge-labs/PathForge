"""
PathForge — Resume & Skill Models
===================================
Parsed, structured CV data with vector embeddings for semantic matching.
"""

import uuid

from pgvector.sqlalchemy import Vector
from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class Resume(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "resumes"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), default="Main Resume", nullable=False)
    raw_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    structured_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    embedding = mapped_column(Vector(3072), nullable=True)
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    file_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="resumes")
    skills: Mapped[list["Skill"]] = relationship(
        "Skill", back_populates="resume", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Resume {self.title} v{self.version}>"


class Skill(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "skills"

    resume_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resumes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    proficiency_level: Mapped[str | None] = mapped_column(String(50), nullable=True)
    years_experience: Mapped[int | None] = mapped_column(Integer, nullable=True)
    verified: Mapped[bool] = mapped_column(default=False, nullable=False)

    # Relationships
    resume: Mapped["Resume"] = relationship("Resume", back_populates="skills")

    def __repr__(self) -> str:
        return f"<Skill {self.name} ({self.proficiency_level})>"

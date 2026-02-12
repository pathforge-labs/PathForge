"""
PathForge — Resume Service
============================
Business logic for resume CRUD operations.
Ready for Sprint 2 AI parsing integration.
"""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.resume import Resume


class ResumeService:
    """Encapsulates resume-related business logic."""

    @staticmethod
    async def create(
        db: AsyncSession,
        *,
        user_id: uuid.UUID,
        title: str = "Main Resume",
        raw_text: str | None = None,
        file_url: str | None = None,
    ) -> Resume:
        """Create a new resume for a user."""
        # Determine next version number
        result = await db.execute(
            select(Resume)
            .where(Resume.user_id == user_id)
            .order_by(Resume.version.desc())
            .limit(1)
        )
        latest = result.scalar_one_or_none()
        next_version = (latest.version + 1) if latest else 1

        resume = Resume(
            user_id=user_id,
            title=title,
            raw_text=raw_text,
            file_url=file_url,
            version=next_version,
        )
        db.add(resume)
        await db.flush()
        await db.refresh(resume)
        return resume

    @staticmethod
    async def get_by_user(db: AsyncSession, user_id: uuid.UUID) -> list[Resume]:
        """Get all resumes for a user, ordered by version descending."""
        result = await db.execute(
            select(Resume)
            .where(Resume.user_id == user_id)
            .order_by(Resume.version.desc())
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(
        db: AsyncSession, resume_id: uuid.UUID, user_id: uuid.UUID
    ) -> Resume | None:
        """Get a specific resume by ID, scoped to a user."""
        result = await db.execute(
            select(Resume).where(
                Resume.id == resume_id,
                Resume.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def delete(
        db: AsyncSession, resume_id: uuid.UUID, user_id: uuid.UUID
    ) -> bool:
        """Delete a resume by ID, scoped to a user. Returns True if deleted."""
        resume = await ResumeService.get_by_id(db, resume_id, user_id)
        if not resume:
            return False
        await db.delete(resume)
        await db.flush()
        return True

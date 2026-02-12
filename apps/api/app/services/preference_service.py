"""
PathForge — Preference & Blacklist Services
=============================================
Business logic for user preferences and company blacklists.
"""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.preference import BlacklistEntry, Preference


class PreferenceService:
    """Encapsulates user preference business logic."""

    @staticmethod
    async def get_by_user(db: AsyncSession, user_id: uuid.UUID) -> Preference | None:
        """Get the active preference for a user."""
        result = await db.execute(
            select(Preference).where(Preference.user_id == user_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def upsert(
        db: AsyncSession,
        user_id: uuid.UUID,
        **fields: object,
    ) -> Preference:
        """Create or update user preferences."""
        existing = await PreferenceService.get_by_user(db, user_id)

        if existing:
            for field, value in fields.items():
                if value is not None:
                    setattr(existing, field, value)
            await db.flush()
            await db.refresh(existing)
            return existing

        preference = Preference(user_id=user_id, **fields)
        db.add(preference)
        await db.flush()
        await db.refresh(preference)
        return preference


class BlacklistService:
    """Encapsulates company blacklist business logic."""

    @staticmethod
    async def get_by_user(db: AsyncSession, user_id: uuid.UUID) -> list[BlacklistEntry]:
        """Get all blacklist entries for a user."""
        result = await db.execute(
            select(BlacklistEntry).where(BlacklistEntry.user_id == user_id)
        )
        return list(result.scalars().all())

    @staticmethod
    async def add(
        db: AsyncSession,
        *,
        user_id: uuid.UUID,
        company_name: str,
        reason: str | None = None,
        is_current_employer: bool = False,
    ) -> BlacklistEntry:
        """Add a company to the user's blacklist."""
        entry = BlacklistEntry(
            user_id=user_id,
            company_name=company_name,
            reason=reason,
            is_current_employer=is_current_employer,
        )
        db.add(entry)
        await db.flush()
        await db.refresh(entry)
        return entry

    @staticmethod
    async def remove(
        db: AsyncSession, entry_id: uuid.UUID, user_id: uuid.UUID
    ) -> bool:
        """Remove a blacklist entry. Returns True if deleted."""
        result = await db.execute(
            select(BlacklistEntry).where(
                BlacklistEntry.id == entry_id,
                BlacklistEntry.user_id == user_id,
            )
        )
        entry = result.scalar_one_or_none()
        if not entry:
            return False
        await db.delete(entry)
        await db.flush()
        return True

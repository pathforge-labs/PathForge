"""
PathForge — Models Package
===========================
Central import point for all SQLAlchemy models.
Alembic auto-generates migrations from these imports.
"""

from app.models.base import Base
from app.models.matching import JobListing, MatchResult
from app.models.preference import BlacklistEntry, Preference
from app.models.resume import Resume, Skill
from app.models.user import User

__all__ = [
    "Base",
    "BlacklistEntry",
    "JobListing",
    "MatchResult",
    "Preference",
    "Resume",
    "Skill",
    "User",
]

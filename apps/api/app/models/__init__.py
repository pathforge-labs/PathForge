"""
PathForge — Models Package
===========================
Central import point for all SQLAlchemy models.
Alembic auto-generates migrations from these imports.
"""

from app.models.analytics import CVExperiment, FunnelEvent, MarketInsight
from app.models.application import Application, CVVersion
from app.models.base import Base
from app.models.career_dna import (
    CareerDNA,
    ExperienceBlueprint,
    GrowthVector,
    HiddenSkill,
    MarketPosition,
    SkillGenomeEntry,
    ValuesProfile,
)
from app.models.matching import JobListing, MatchResult
from app.models.preference import BlacklistEntry, Preference
from app.models.resume import Resume, Skill
from app.models.user import User

__all__ = [
    "Application",
    "Base",
    "BlacklistEntry",
    "CVExperiment",
    "CVVersion",
    "CareerDNA",
    "ExperienceBlueprint",
    "FunnelEvent",
    "GrowthVector",
    "HiddenSkill",
    "JobListing",
    "MarketInsight",
    "MarketPosition",
    "MatchResult",
    "Preference",
    "Resume",
    "Skill",
    "SkillGenomeEntry",
    "User",
    "ValuesProfile",
]

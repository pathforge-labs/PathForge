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
from app.models.salary_intelligence import (
    SalaryEstimate,
    SalaryHistoryEntry,
    SalaryPreference,
    SalaryScenario,
    SkillSalaryImpact,
)
from app.models.skill_decay import (
    MarketDemandSnapshot,
    ReskillingPathway,
    SkillDecayPreference,
    SkillFreshness,
    SkillVelocityEntry,
)
from app.models.threat_radar import (
    AlertPreference,
    AutomationRisk,
    CareerResilienceSnapshot,
    IndustryTrend,
    SkillShieldEntry,
    ThreatAlert,
)
from app.models.user import User

__all__ = [
    "AlertPreference",
    "Application",
    "AutomationRisk",
    "Base",
    "BlacklistEntry",
    "CVExperiment",
    "CVVersion",
    "CareerDNA",
    "CareerResilienceSnapshot",
    "ExperienceBlueprint",
    "FunnelEvent",
    "GrowthVector",
    "HiddenSkill",
    "IndustryTrend",
    "JobListing",
    "MarketDemandSnapshot",
    "MarketInsight",
    "MarketPosition",
    "MatchResult",
    "Preference",
    "ReskillingPathway",
    "Resume",
    "SalaryEstimate",
    "SalaryHistoryEntry",
    "SalaryPreference",
    "SalaryScenario",
    "Skill",
    "SkillDecayPreference",
    "SkillFreshness",
    "SkillGenomeEntry",
    "SkillSalaryImpact",
    "SkillShieldEntry",
    "SkillVelocityEntry",
    "ThreatAlert",
    "User",
    "ValuesProfile",
]

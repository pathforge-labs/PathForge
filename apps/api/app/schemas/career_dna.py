"""
PathForge — Career DNA Schemas
================================
Pydantic request/response models for the Career DNA API.
All schemas use strict typing with no `Any` fields.
"""

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field

# ── Skill Genome ───────────────────────────────────────────────


class SkillGenomeEntryResponse(BaseModel):
    """Single skill within the genome."""

    id: uuid.UUID
    skill_name: str
    category: str
    proficiency_level: str
    source: str
    confidence: float = Field(ge=0.0, le=1.0)
    evidence: dict[str, Any] | None = None
    years_experience: int | None = None
    last_used_date: str | None = None

    model_config = {"from_attributes": True}


class HiddenSkillResponse(BaseModel):
    """AI-discovered hidden skill with evidence trail."""

    id: uuid.UUID
    skill_name: str
    discovery_method: str
    confidence: float = Field(ge=0.0, le=1.0)
    evidence: dict[str, Any] | None = None
    user_confirmed: bool | None = None
    source_text: str | None = None

    model_config = {"from_attributes": True}


class HiddenSkillConfirmRequest(BaseModel):
    """User confirm/reject a hidden skill."""

    confirmed: bool


class SkillGenomeResponse(BaseModel):
    """Complete skill genome with hidden skills."""

    explicit_skills: list[SkillGenomeEntryResponse] = Field(default_factory=list)
    hidden_skills: list[HiddenSkillResponse] = Field(default_factory=list)
    total_skills: int = 0


# ── Experience Blueprint ───────────────────────────────────────


class ExperienceBlueprintResponse(BaseModel):
    """Analyzed career experience pattern."""

    id: uuid.UUID
    total_years: float
    role_count: int
    avg_tenure_months: float
    career_direction: str
    industry_diversity: float = Field(ge=0.0, le=1.0)
    seniority_trajectory: dict[str, Any] | None = None
    pattern_analysis: str | None = None

    model_config = {"from_attributes": True}


# ── Growth Vector ──────────────────────────────────────────────


class GrowthVectorResponse(BaseModel):
    """Career trajectory projection with explainable reasoning."""

    id: uuid.UUID
    current_trajectory: str
    projected_roles: dict[str, Any] | None = None
    skill_velocity: dict[str, Any] | None = None
    growth_score: float = Field(ge=0.0, le=100.0)
    analysis_reasoning: str | None = None

    model_config = {"from_attributes": True}


# ── Values Profile ─────────────────────────────────────────────


class ValuesProfileResponse(BaseModel):
    """Career values alignment profile."""

    id: uuid.UUID
    work_style: str
    impact_preference: str
    environment_fit: dict[str, Any] | None = None
    derived_values: dict[str, Any] | None = None
    confidence: float = Field(ge=0.0, le=1.0)

    model_config = {"from_attributes": True}


# ── Market Position ────────────────────────────────────────────


class MarketPositionResponse(BaseModel):
    """Real-time market standing snapshot."""

    id: uuid.UUID
    percentile_overall: float = Field(ge=0.0, le=100.0)
    skill_demand_scores: dict[str, Any] | None = None
    matching_job_count: int
    market_trend: str
    computed_at: datetime

    model_config = {"from_attributes": True}


# ── Career DNA (Hub) ───────────────────────────────────────────


class CareerDNASummaryResponse(BaseModel):
    """Lightweight Career DNA summary."""

    id: uuid.UUID
    completeness_score: float = Field(ge=0.0, le=100.0)
    last_analysis_at: datetime | None = None
    version: int
    has_skill_genome: bool = False
    has_experience_blueprint: bool = False
    has_growth_vector: bool = False
    has_values_profile: bool = False
    has_market_position: bool = False
    hidden_skills_count: int = 0

    model_config = {"from_attributes": True}


class CareerDNAResponse(BaseModel):
    """Full Career DNA profile with all dimensions."""

    id: uuid.UUID
    completeness_score: float = Field(ge=0.0, le=100.0)
    last_analysis_at: datetime | None = None
    version: int
    summary: str | None = None

    # Dimensions
    skill_genome: SkillGenomeResponse | None = None
    experience_blueprint: ExperienceBlueprintResponse | None = None
    growth_vector: GrowthVectorResponse | None = None
    values_profile: ValuesProfileResponse | None = None
    market_position: MarketPositionResponse | None = None
    hidden_skills: list[HiddenSkillResponse] = Field(default_factory=list)

    model_config = {"from_attributes": True}


# ── Request Schemas ────────────────────────────────────────────


class CareerDNAGenerateRequest(BaseModel):
    """Trigger Career DNA analysis."""

    dimensions: list[str] | None = Field(
        default=None,
        description=(
            "Optional list of dimensions to recompute. "
            "If empty/null, all dimensions are recomputed. "
            "Valid: skill_genome, experience_blueprint, "
            "growth_vector, values_profile, market_position"
        ),
    )


class CareerDNARefreshResponse(BaseModel):
    """Response after refreshing a dimension."""

    dimension: str
    status: str = "completed"
    completeness_score: float = Field(ge=0.0, le=100.0)

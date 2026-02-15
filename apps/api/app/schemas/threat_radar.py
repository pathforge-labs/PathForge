"""
PathForge — Career Threat Radar™ Schemas
==========================================
Pydantic request/response models for the Career Threat Radar™ API.
All schemas use strict typing with no `Any` fields.
"""

import uuid
from datetime import datetime, time

from pydantic import BaseModel, Field

# ── Automation Risk ────────────────────────────────────────────


class AutomationRiskResponse(BaseModel):
    """Hybrid ONET + LLM automation risk assessment."""

    id: uuid.UUID
    onet_soc_code: str
    onet_occupation_title: str
    base_automation_probability: float = Field(ge=0.0, le=1.0)
    contextual_risk_score: float = Field(ge=0.0, le=100.0)
    risk_level: str
    vulnerable_tasks: dict | None = None
    resilient_tasks: dict | None = None
    recommended_skills: dict | None = None
    analysis_reasoning: str | None = None
    opportunity_inversions: dict | None = None
    analyzed_at: datetime

    model_config = {"from_attributes": True}


# ── Industry Trend ─────────────────────────────────────────────


class IndustryTrendResponse(BaseModel):
    """Personalized industry trend analysis."""

    id: uuid.UUID
    industry_name: str
    trend_direction: str
    confidence: float = Field(ge=0.0, le=1.0)
    key_signals: dict | None = None
    impact_on_user: str | None = None
    recommended_actions: dict | None = None
    data_sources: dict | None = None
    analyzed_at: datetime

    model_config = {"from_attributes": True}


# ── Skills Shield™ ─────────────────────────────────────────────


class SkillShieldEntryResponse(BaseModel):
    """Single skill classified as shield, exposure, or neutral."""

    id: uuid.UUID
    skill_name: str
    classification: str
    automation_resistance: float = Field(ge=0.0, le=1.0)
    market_demand_trend: str
    reasoning: str | None = None
    improvement_path: str | None = None

    model_config = {"from_attributes": True}


class SkillShieldMatrixResponse(BaseModel):
    """Complete Skills Shield™ Matrix — shields vs exposures."""

    shields: list[SkillShieldEntryResponse] = Field(default_factory=list)
    exposures: list[SkillShieldEntryResponse] = Field(default_factory=list)
    neutrals: list[SkillShieldEntryResponse] = Field(default_factory=list)
    total_skills: int = 0
    moat_strength_pct: float = Field(
        ge=0.0, le=100.0, default=50.0,
        description="Percentage of skills classified as shields",
    )


# ── Career Resilience Score™ ───────────────────────────────────


class CareerResilienceResponse(BaseModel):
    """Career Resilience Score™ — 5-factor composite (0–100)."""

    id: uuid.UUID
    overall_score: float = Field(ge=0.0, le=100.0)
    skill_diversity_index: float = Field(ge=0.0, le=100.0)
    automation_resistance: float = Field(ge=0.0, le=100.0)
    growth_velocity: float = Field(ge=0.0, le=100.0)
    industry_stability: float = Field(ge=0.0, le=100.0)
    adaptability_signal: float = Field(ge=0.0, le=100.0)
    moat_score: float = Field(ge=0.0, le=100.0)
    moat_strength: str
    explanation: str | None = None
    improvement_actions: dict | None = None
    computed_at: datetime

    model_config = {"from_attributes": True}


# ── Threat Alerts ──────────────────────────────────────────────


class ThreatAlertResponse(BaseModel):
    """Career threat alert with paired opportunity recommendation."""

    id: uuid.UUID
    category: str
    severity: str
    title: str
    description: str
    opportunity: str
    evidence: dict | None = None
    channel: str
    status: str
    snoozed_until: datetime | None = None
    read_at: datetime | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ThreatAlertUpdateRequest(BaseModel):
    """Update alert status (read, dismiss, snooze, act)."""

    status: str = Field(
        description=(
            "New status: 'read', 'dismissed', 'snoozed', or 'acted_on'"
        ),
    )
    snoozed_until: datetime | None = Field(
        default=None,
        description="Required when status is 'snoozed'",
    )


class ThreatAlertListResponse(BaseModel):
    """Paginated alert feed."""

    alerts: list[ThreatAlertResponse] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 20


# ── Alert Preferences ─────────────────────────────────────────


class AlertPreferenceResponse(BaseModel):
    """User alert notification preferences."""

    id: uuid.UUID
    enabled_categories: list[str] = Field(default_factory=list)
    min_severity: str
    enabled_channels: list[str] = Field(default_factory=list)
    quiet_hours_start: time | None = None
    quiet_hours_end: time | None = None

    model_config = {"from_attributes": True}


class AlertPreferenceUpdateRequest(BaseModel):
    """Update alert preferences."""

    enabled_categories: list[str] | None = Field(
        default=None,
        description="Alert categories to enable",
    )
    min_severity: str | None = Field(
        default=None,
        description="Minimum severity: 'low', 'medium', or 'high'",
    )
    enabled_channels: list[str] | None = Field(
        default=None,
        description="Channels: 'in_app', 'email', 'push'",
    )
    quiet_hours_start: time | None = None
    quiet_hours_end: time | None = None


# ── Composite Responses ────────────────────────────────────────


class ThreatRadarScanResponse(BaseModel):
    """Response after triggering a comprehensive threat scan."""

    status: str = "completed"
    automation_risk: AutomationRiskResponse | None = None
    industry_trends: list[IndustryTrendResponse] = Field(default_factory=list)
    skills_shield: SkillShieldMatrixResponse | None = None
    resilience: CareerResilienceResponse | None = None
    alerts_generated: int = 0


class ThreatRadarOverviewResponse(BaseModel):
    """Full Career Threat Radar™ dashboard overview."""

    resilience: CareerResilienceResponse | None = None
    automation_risk: AutomationRiskResponse | None = None
    skills_shield: SkillShieldMatrixResponse | None = None
    industry_trends: list[IndustryTrendResponse] = Field(default_factory=list)
    recent_alerts: list[ThreatAlertResponse] = Field(default_factory=list)
    total_unread_alerts: int = 0

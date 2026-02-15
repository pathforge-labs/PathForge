"""
PathForge — Analytics Schemas
===============================
Pydantic validation schemas for the analytics API.
"""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.models.analytics import ExperimentStatus, FunnelStage, InsightType

# ---------------------------------------------------------------------------
# Funnel Events
# ---------------------------------------------------------------------------


class FunnelEventCreate(BaseModel):
    """Create a new funnel event."""

    application_id: uuid.UUID | None = None
    stage: FunnelStage
    metadata: dict | None = None


class FunnelEventResponse(BaseModel):
    """Single funnel event response."""

    id: uuid.UUID
    user_id: uuid.UUID
    application_id: uuid.UUID | None
    stage: FunnelStage
    metadata: dict | None = Field(None, validation_alias="metadata_")
    created_at: datetime

    model_config = {"from_attributes": True, "populate_by_name": True}


class FunnelStageMetric(BaseModel):
    """Conversion metric for a single funnel stage."""

    stage: FunnelStage
    count: int
    conversion_rate: float = Field(
        ..., ge=0.0, le=100.0,
        description="Percentage of entries reaching this stage",
    )


class FunnelMetricsResponse(BaseModel):
    """Aggregated funnel conversion metrics."""

    user_id: uuid.UUID
    period: str
    total_events: int
    stages: list[FunnelStageMetric]


class FunnelTimelinePoint(BaseModel):
    """Single data point in a funnel timeline."""

    date: str
    stage: FunnelStage
    count: int


class FunnelTimelineResponse(BaseModel):
    """Time-series funnel event data for charts."""

    user_id: uuid.UUID
    days: int
    data: list[FunnelTimelinePoint]


# ---------------------------------------------------------------------------
# Market Insights
# ---------------------------------------------------------------------------


class InsightGenerateRequest(BaseModel):
    """Request to generate a market insight."""

    insight_type: InsightType
    period: str = Field(
        default="30d",
        description="Time period for insight aggregation (e.g. 7d, 30d, 90d)",
    )


class MarketInsightResponse(BaseModel):
    """Single market insight response."""

    id: uuid.UUID
    user_id: uuid.UUID
    insight_type: InsightType
    data: dict
    period: str
    generated_at: datetime

    model_config = {"from_attributes": True}


class MarketInsightsListResponse(BaseModel):
    """List of market insights for a user."""

    user_id: uuid.UUID
    insights: list[MarketInsightResponse]
    count: int


# ---------------------------------------------------------------------------
# CV Experiments
# ---------------------------------------------------------------------------


class CVExperimentCreate(BaseModel):
    """Create a new CV A/B experiment."""

    job_listing_id: uuid.UUID
    variant_a_id: uuid.UUID
    variant_b_id: uuid.UUID
    hypothesis: str | None = None


class ExperimentResultUpdate(BaseModel):
    """Record the result of a CV experiment."""

    winner_id: uuid.UUID
    metrics: dict = Field(
        default_factory=dict,
        description="Performance metrics (e.g. ats_score_a, ats_score_b, response_rate)",
    )


class CVExperimentResponse(BaseModel):
    """Single CV experiment response."""

    id: uuid.UUID
    user_id: uuid.UUID
    job_listing_id: uuid.UUID
    variant_a_id: uuid.UUID
    variant_b_id: uuid.UUID
    winner_id: uuid.UUID | None
    status: ExperimentStatus
    metrics: dict | None
    hypothesis: str | None
    created_at: datetime
    completed_at: datetime | None

    model_config = {"from_attributes": True}


class CVExperimentsListResponse(BaseModel):
    """List of CV experiments for a user."""

    user_id: uuid.UUID
    experiments: list[CVExperimentResponse]
    count: int

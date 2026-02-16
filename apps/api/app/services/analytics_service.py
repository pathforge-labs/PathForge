"""
PathForge — Analytics Service
================================
Business logic for funnel tracking, market intelligence,
and CV A/B experimentation.
"""

import uuid
from collections import Counter
from datetime import UTC, datetime, timedelta
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.analytics import (
    CVExperiment,
    ExperimentStatus,
    FunnelEvent,
    FunnelStage,
    InsightType,
    MarketInsight,
)
from app.models.application import Application
from app.models.matching import JobListing, MatchResult

# ---------------------------------------------------------------------------
# Funnel pipeline
# ---------------------------------------------------------------------------


async def record_funnel_event(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    application_id: uuid.UUID | None,
    stage: FunnelStage,
    metadata: dict[str, Any] | None = None,
) -> FunnelEvent:
    """Insert a new funnel event."""
    event = FunnelEvent(
        user_id=user_id,
        application_id=application_id,
        stage=stage,
        metadata_=metadata,
    )
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event


# Ordered stages for conversion funnel
_FUNNEL_ORDER: list[FunnelStage] = [
    FunnelStage.VIEWED,
    FunnelStage.SAVED,
    FunnelStage.CV_TAILORED,
    FunnelStage.APPLIED,
    FunnelStage.INTERVIEWING,
    FunnelStage.OFFERED,
    FunnelStage.ACCEPTED,
]


async def get_funnel_metrics(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    period: str = "30d",
) -> dict[str, Any]:
    """
    Aggregate funnel conversion rates per stage.

    Returns dict with total_events, stages list (stage, count, conversion_rate).
    Conversion rate is relative to the first stage (viewed).
    """
    days = _parse_period(period)
    cutoff = datetime.now(UTC) - timedelta(days=days)

    result = await db.execute(
        select(FunnelEvent.stage, func.count())
        .where(
            FunnelEvent.user_id == user_id,
            FunnelEvent.created_at >= cutoff,
        )
        .group_by(FunnelEvent.stage)
    )
    counts: dict[str, int] = dict(result.all())  # type: ignore[arg-type]

    total = sum(counts.values())
    top_count = counts.get(FunnelStage.VIEWED, total) or 1

    stages = []
    for stage in _FUNNEL_ORDER:
        count = counts.get(stage, 0)
        rate = round((count / top_count) * 100, 1) if top_count else 0.0
        stages.append({"stage": stage, "count": count, "conversion_rate": rate})

    return {
        "user_id": user_id,
        "period": period,
        "total_events": total,
        "stages": stages,
    }


async def get_funnel_timeline(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    days: int = 30,
) -> dict[str, Any]:
    """
    Time-series event counts grouped by day and stage.

    Returns dict with data list of {date, stage, count} points.
    """
    cutoff = datetime.now(UTC) - timedelta(days=days)

    result = await db.execute(
        select(
            func.date(FunnelEvent.created_at).label("day"),
            FunnelEvent.stage,
            func.count().label("cnt"),
        )
        .where(
            FunnelEvent.user_id == user_id,
            FunnelEvent.created_at >= cutoff,
        )
        .group_by("day", FunnelEvent.stage)
        .order_by("day")
    )

    data = [
        {"date": str(row.day), "stage": row.stage, "count": row.cnt}
        for row in result.all()
    ]

    return {"user_id": user_id, "days": days, "data": data}


# ---------------------------------------------------------------------------
# Market intelligence
# ---------------------------------------------------------------------------


async def generate_market_insight(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    insight_type: InsightType,
    period: str = "30d",
) -> MarketInsight:
    """
    Generate a market insight by aggregating platform data.

    Different insight types produce different analytics:
    - skill_demand: top skills requested in matched jobs
    - salary_trend: salary ranges from matched listings
    - market_heat: new listings per day in user's domain
    - competition_level: estimated applicants per listing
    - application_velocity: user's application rate over time
    """
    days = _parse_period(period)
    cutoff = datetime.now(UTC) - timedelta(days=days)

    data: dict[str, Any]
    match insight_type:
        case InsightType.SKILL_DEMAND:
            data = await _compute_skill_demand(db, user_id, cutoff)
        case InsightType.SALARY_TREND:
            data = await _compute_salary_trend(db, user_id, cutoff)
        case InsightType.MARKET_HEAT:
            data = await _compute_market_heat(db, user_id, cutoff)
        case InsightType.COMPETITION_LEVEL:
            data = await _compute_competition_level(db, user_id, cutoff)
        case InsightType.APPLICATION_VELOCITY:
            data = await _compute_application_velocity(db, user_id, cutoff)
        case _:
            data = {"message": "Unknown insight type"}

    insight = MarketInsight(
        user_id=user_id,
        insight_type=insight_type,
        data=data,
        period=period,
    )
    db.add(insight)
    await db.commit()
    await db.refresh(insight)
    return insight


async def get_market_insights(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    limit: int = 20,
) -> list[MarketInsight]:
    """Retrieve latest market insights for a user."""
    result = await db.execute(
        select(MarketInsight)
        .where(MarketInsight.user_id == user_id)
        .order_by(MarketInsight.generated_at.desc())
        .limit(limit)
    )
    return list(result.scalars().all())


# ---------------------------------------------------------------------------
# CV A/B experiments
# ---------------------------------------------------------------------------


async def create_cv_experiment(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    job_listing_id: uuid.UUID,
    variant_a_id: uuid.UUID,
    variant_b_id: uuid.UUID,
    hypothesis: str | None = None,
) -> CVExperiment:
    """Start a new CV A/B experiment."""
    experiment = CVExperiment(
        user_id=user_id,
        job_listing_id=job_listing_id,
        variant_a_id=variant_a_id,
        variant_b_id=variant_b_id,
        hypothesis=hypothesis,
    )
    db.add(experiment)
    await db.commit()
    await db.refresh(experiment)
    return experiment


async def record_experiment_result(
    db: AsyncSession,
    *,
    experiment_id: uuid.UUID,
    winner_id: uuid.UUID,
    metrics: dict[str, Any] | None = None,
) -> CVExperiment:
    """Complete an experiment by recording the winner."""
    result = await db.execute(
        select(CVExperiment).where(CVExperiment.id == experiment_id)
    )
    experiment = result.scalar_one_or_none()
    if experiment is None:
        msg = f"Experiment {experiment_id} not found"
        raise ValueError(msg)

    experiment.winner_id = winner_id
    experiment.metrics = metrics or {}
    experiment.status = ExperimentStatus.COMPLETED
    experiment.completed_at = datetime.now(UTC)

    await db.commit()
    await db.refresh(experiment)
    return experiment


async def get_experiments(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    limit: int = 20,
) -> list[CVExperiment]:
    """List user's CV experiments."""
    result = await db.execute(
        select(CVExperiment)
        .where(CVExperiment.user_id == user_id)
        .order_by(CVExperiment.created_at.desc())
        .limit(limit)
    )
    return list(result.scalars().all())


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _parse_period(period: str) -> int:
    """Parse period string (e.g. '30d', '7d', '90d') to days integer."""
    stripped = period.strip().lower()
    if stripped.endswith("d"):
        try:
            return int(stripped[:-1])
        except ValueError:
            pass
    return 30  # default


async def _compute_skill_demand(
    db: AsyncSession, user_id: uuid.UUID, cutoff: datetime,
) -> dict[str, Any]:
    """Top skills appearing in matched job listings."""
    result = await db.execute(
        select(JobListing.description)
        .join(MatchResult, MatchResult.job_listing_id == JobListing.id)
        .where(
            MatchResult.user_id == user_id,
            MatchResult.created_at >= cutoff,
        )
        .limit(100)
    )
    descriptions = [row[0] or "" for row in result.all()]

    # Simple keyword frequency analysis
    tech_keywords = {
        "python", "javascript", "typescript", "react", "node", "docker",
        "kubernetes", "aws", "azure", "gcp", "sql", "postgresql", "redis",
        "graphql", "rest", "fastapi", "django", "flask", "next.js",
        "terraform", "ci/cd", "git", "agile", "scrum", "java", "go",
        "rust", "c++", "swift", "kotlin", "machine learning", "ai",
    }
    counter: Counter[str] = Counter()
    for desc in descriptions:
        lower = desc.lower()
        for kw in tech_keywords:
            if kw in lower:
                counter[kw] += 1

    top_skills = counter.most_common(10)
    return {
        "top_skills": [{"skill": s, "mentions": c} for s, c in top_skills],
        "total_listings_analyzed": len(descriptions),
    }


async def _compute_salary_trend(
    db: AsyncSession, user_id: uuid.UUID, cutoff: datetime,
) -> dict[str, Any]:
    """Salary data from matched listings (placeholder — Adzuna provides salary)."""
    result = await db.execute(
        select(func.count())
        .select_from(MatchResult)
        .where(
            MatchResult.user_id == user_id,
            MatchResult.created_at >= cutoff,
        )
    )
    match_count = result.scalar() or 0

    return {
        "matches_analyzed": match_count,
        "note": "Salary data aggregation requires Adzuna salary API fields",
        "trend": "stable",
    }


async def _compute_market_heat(
    db: AsyncSession, user_id: uuid.UUID, cutoff: datetime,
) -> dict[str, Any]:
    """New listings per day in user's matched domain."""
    result = await db.execute(
        select(
            func.date(JobListing.created_at).label("day"),
            func.count().label("cnt"),
        )
        .where(JobListing.created_at >= cutoff)
        .group_by("day")
        .order_by("day")
    )
    daily_counts = [{"date": str(row.day), "new_listings": row.cnt} for row in result.all()]

    total = sum(d["new_listings"] for d in daily_counts)
    avg = round(total / max(len(daily_counts), 1), 1)

    return {
        "daily_counts": daily_counts,
        "average_per_day": avg,
        "total_period": total,
    }


async def _compute_competition_level(
    db: AsyncSession, user_id: uuid.UUID, cutoff: datetime,
) -> dict[str, Any]:
    """Estimated competition level from application counts per listing."""
    result = await db.execute(
        select(func.count(Application.id))
        .where(
            Application.user_id == user_id,
            Application.created_at >= cutoff,
        )
    )
    user_apps = result.scalar() or 0

    return {
        "your_applications": user_apps,
        "estimated_competition": "moderate",
        "note": "Cross-user competition data requires multi-tenant analytics",
    }


async def _compute_application_velocity(
    db: AsyncSession, user_id: uuid.UUID, cutoff: datetime,
) -> dict[str, Any]:
    """User's application rate over time."""
    result = await db.execute(
        select(
            func.date(Application.created_at).label("day"),
            func.count().label("cnt"),
        )
        .where(
            Application.user_id == user_id,
            Application.created_at >= cutoff,
        )
        .group_by("day")
        .order_by("day")
    )
    daily = [{"date": str(row.day), "applications": row.cnt} for row in result.all()]

    total = sum(d["applications"] for d in daily)
    avg = round(total / max(len(daily), 1), 1)

    return {
        "daily_applications": daily,
        "total": total,
        "average_per_day": avg,
    }

"""
PathForge — Career Threat Radar™ Service
==========================================
Signal Fusion Engine: orchestrates threat analysis pipeline,
computes Career Resilience Score™ and Career Moat Score,
and generates Threat→Opportunity inversions.

Pipeline flow:
    1. Score automation risk (ONET + LLM)
    2. Analyze industry trends (LLM)
    3. Classify Skills Shield™ (LLM + bottleneck)
    4. Compute CRS (5-factor composite formula)
    5. Compute Career Moat Score (4-dimension)
    6. Generate threat alerts with opportunity inversions
"""

import logging
import uuid
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.ai.threat_radar_analyzer import ThreatRadarAnalyzer
from app.models.career_dna import CareerDNA
from app.models.threat_radar import (
    AlertPreference,
    AlertSeverity,
    AlertStatus,
    AutomationRisk,
    CareerResilienceSnapshot,
    IndustryTrend,
    MoatStrength,
    SkillShieldEntry,
    ThreatAlert,
)

# Type alias for threat radar models that share career_dna_id + created_at
CareerDNAChildModel = AutomationRisk | IndustryTrend | SkillShieldEntry | CareerResilienceSnapshot

logger = logging.getLogger(__name__)


# ── CRS Weights (Career Resilience Score™) ─────────────────────

CRS_WEIGHT_SKILL_DIVERSITY = 0.25
CRS_WEIGHT_AUTOMATION_RESISTANCE = 0.25
CRS_WEIGHT_GROWTH_VELOCITY = 0.20
CRS_WEIGHT_INDUSTRY_STABILITY = 0.15
CRS_WEIGHT_ADAPTABILITY = 0.15


class ThreatRadarService:
    """
    Signal Fusion Engine for Career Threat Radar™.

    Orchestrates the full threat analysis pipeline from data
    gathering through score computation to alert generation.
    """

    # ── Full Scan ──────────────────────────────────────────────

    @staticmethod
    async def run_full_scan(
        db: AsyncSession,
        *,
        user_id: uuid.UUID,
        soc_code: str,
        industry_name: str,
    ) -> dict[str, Any]:
        """
        Execute full Career Threat Radar™ analysis pipeline.

        Args:
            db: Database session.
            user_id: User's UUID.
            soc_code: ONET SOC code for user's occupation.
            industry_name: User's primary industry.

        Returns:
            Dict with all analysis results for response building.
        """
        # Get Career DNA (required dependency)
        career_dna = await _get_career_dna_with_genome(db, user_id)
        if career_dna is None:
            logger.warning(
                "Threat scan requested but no Career DNA for user %s",
                user_id,
            )
            return {"status": "error", "detail": "Career DNA profile required"}

        # Gather Career DNA context
        skills_summary = _format_skills_summary(career_dna)
        experience_summary = _format_experience_summary(career_dna)
        skill_names = _extract_skill_names(career_dna)
        years_experience = _estimate_years(career_dna)

        # Step 1: Automation Risk
        risk_data = await ThreatRadarAnalyzer.score_automation_risk(
            soc_code=soc_code,
            skills_summary=skills_summary,
            experience_summary=experience_summary,
            years_experience=years_experience,
        )
        automation_risk = await _persist_automation_risk(
            db, career_dna.id, risk_data,
        )

        # Step 2: Industry Trends
        trend_data = await ThreatRadarAnalyzer.analyze_industry_trends(
            industry_name=industry_name,
            skills_summary=skills_summary,
            experience_summary=experience_summary,
        )
        industry_trend = await _persist_industry_trend(
            db, career_dna.id, trend_data,
        )

        # Step 3: Skills Shield™
        shield_data = await ThreatRadarAnalyzer.classify_skills_shield(
            skills_list=skill_names,
            soc_code=soc_code,
        )
        shield_entries = await _persist_shield_entries(
            db, career_dna.id, shield_data,
        )

        # Step 4: Career Resilience Score™
        crs = _compute_crs(
            risk_data=risk_data,
            trend_data=trend_data,
            shield_data=shield_data,
            career_dna=career_dna,
        )

        # Step 5: Career Moat Score
        moat = _compute_moat_score(
            shield_data=shield_data,
            career_dna=career_dna,
        )

        snapshot = await _persist_resilience_snapshot(
            db, career_dna.id, crs, moat,
        )

        # Step 6: Threat Alerts
        shield_skills = [
            entry["skill_name"] for entry in shield_data
            if entry.get("classification") == "shield"
        ]
        exposure_skills = [
            entry["skill_name"] for entry in shield_data
            if entry.get("classification") == "exposure"
        ]

        trend_summary = (
            f"Industry: {industry_name}, "
            f"Direction: {trend_data.get('trend_direction', 'unknown')}, "
            f"Impact: {trend_data.get('impact_on_user', 'Not assessed')}"
        )

        alerts_data = await ThreatRadarAnalyzer.generate_threat_assessment(
            risk_score=risk_data.get("contextual_risk_score", 50.0),
            risk_level=risk_data.get("risk_level", "medium"),
            vulnerable_tasks=risk_data.get("vulnerable_tasks", []),
            industry_trends_summary=trend_summary,
            shield_skills=shield_skills,
            exposure_skills=exposure_skills,
            skills_summary=skills_summary,
            experience_summary=experience_summary,
        )
        alerts = await _persist_threat_alerts(
            db, career_dna.id, alerts_data,
        )

        await db.flush()

        return {
            "status": "completed",
            "automation_risk": automation_risk,
            "industry_trend": industry_trend,
            "shield_entries": shield_entries,
            "snapshot": snapshot,
            "alerts": alerts,
            "alerts_generated": len(alerts),
        }

    # ── Overview (Read-Only) ───────────────────────────────────

    @staticmethod
    async def get_overview(
        db: AsyncSession,
        *,
        user_id: uuid.UUID,
    ) -> dict[str, Any]:
        """Get full Threat Radar dashboard data."""
        career_dna = await _get_career_dna_with_genome(db, user_id)
        if career_dna is None:
            return {}

        career_dna_id = career_dna.id

        # Fetch latest of each entity
        automation_risk = await _get_latest(db, AutomationRisk, career_dna_id)
        industry_trends = await _get_all(db, IndustryTrend, career_dna_id)
        shield_entries = await _get_all(db, SkillShieldEntry, career_dna_id)
        snapshot = await _get_latest(
            db, CareerResilienceSnapshot, career_dna_id,
        )

        # Recent alerts (unread + recent read)
        alerts_result = await db.execute(
            select(ThreatAlert)
            .where(ThreatAlert.career_dna_id == career_dna_id)
            .order_by(ThreatAlert.created_at.desc())
            .limit(10)
        )
        recent_alerts = list(alerts_result.scalars().all())

        # Unread count
        unread_count_result = await db.execute(
            select(func.count(ThreatAlert.id))
            .where(
                ThreatAlert.career_dna_id == career_dna_id,
                ThreatAlert.status == AlertStatus.UNREAD.value,
            )
        )
        total_unread = unread_count_result.scalar() or 0

        return {
            "automation_risk": automation_risk,
            "industry_trends": industry_trends,
            "shield_entries": shield_entries,
            "snapshot": snapshot,
            "recent_alerts": recent_alerts,
            "total_unread_alerts": total_unread,
        }

    # ── Alert Management ───────────────────────────────────────

    @staticmethod
    async def get_alerts(
        db: AsyncSession,
        *,
        user_id: uuid.UUID,
        page: int = 1,
        page_size: int = 20,
        status_filter: str | None = None,
    ) -> dict[str, Any]:
        """Get paginated threat alerts."""
        career_dna = await _get_career_dna_with_genome(db, user_id)
        if career_dna is None:
            return {"alerts": [], "total": 0, "page": page, "page_size": page_size}

        query = (
            select(ThreatAlert)
            .where(ThreatAlert.career_dna_id == career_dna.id)
        )
        count_query = (
            select(func.count(ThreatAlert.id))
            .where(ThreatAlert.career_dna_id == career_dna.id)
        )

        if status_filter:
            query = query.where(ThreatAlert.status == status_filter)
            count_query = count_query.where(
                ThreatAlert.status == status_filter,
            )

        total_result = await db.execute(count_query)
        total = total_result.scalar() or 0

        offset = (page - 1) * page_size
        query = query.order_by(
            ThreatAlert.created_at.desc(),
        ).offset(offset).limit(page_size)

        result = await db.execute(query)
        alerts = list(result.scalars().all())

        return {
            "alerts": alerts,
            "total": total,
            "page": page,
            "page_size": page_size,
        }

    @staticmethod
    async def update_alert_status(
        db: AsyncSession,
        *,
        user_id: uuid.UUID,
        alert_id: uuid.UUID,
        new_status: str,
        snoozed_until: datetime | None = None,
    ) -> ThreatAlert | None:
        """Update a single alert's status."""
        career_dna = await _get_career_dna_with_genome(db, user_id)
        if career_dna is None:
            return None

        result = await db.execute(
            select(ThreatAlert).where(
                ThreatAlert.id == alert_id,
                ThreatAlert.career_dna_id == career_dna.id,
            )
        )
        alert = result.scalar_one_or_none()
        if alert is None:
            return None

        alert.status = new_status
        if new_status == AlertStatus.READ.value:
            alert.read_at = datetime.now(UTC)
        if new_status == AlertStatus.SNOOZED.value and snoozed_until:
            alert.snoozed_until = snoozed_until
        await db.flush()
        return alert

    # ── Alert Preferences ──────────────────────────────────────

    @staticmethod
    async def get_preferences(
        db: AsyncSession,
        *,
        user_id: uuid.UUID,
    ) -> AlertPreference | None:
        """Get user's alert preferences."""
        career_dna = await _get_career_dna_with_genome(db, user_id)
        if career_dna is None:
            return None

        result = await db.execute(
            select(AlertPreference).where(
                AlertPreference.career_dna_id == career_dna.id,
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def update_preferences(
        db: AsyncSession,
        *,
        user_id: uuid.UUID,
        updates: dict[str, Any],
    ) -> AlertPreference | None:
        """Update or create alert preferences."""
        career_dna = await _get_career_dna_with_genome(db, user_id)
        if career_dna is None:
            return None

        result = await db.execute(
            select(AlertPreference).where(
                AlertPreference.career_dna_id == career_dna.id,
            )
        )
        pref = result.scalar_one_or_none()

        if pref is None:
            pref = AlertPreference(career_dna_id=career_dna.id)
            db.add(pref)

        for key, value in updates.items():
            if value is not None and hasattr(pref, key):
                setattr(pref, key, value)

        await db.flush()
        return pref


# ── CRS Computation ────────────────────────────────────────────


def _compute_crs(
    *,
    risk_data: dict[str, Any],
    trend_data: dict[str, Any],
    shield_data: list[dict[str, Any]],
    career_dna: CareerDNA,
) -> dict[str, float]:
    """
    Compute Career Resilience Score™ using 5-factor weighted formula.

    CRS = (skill_diversity × 0.25) + (automation_resistance × 0.25)
        + (growth_velocity × 0.20) + (industry_stability × 0.15)
        + (adaptability_signal × 0.15)
    """
    # Factor 1: Skill Diversity Index
    skill_count = len(career_dna.skill_genome) if career_dna.skill_genome else 0
    skill_diversity = min(100.0, skill_count * 5.0)

    # Factor 2: Automation Resistance (inverse of risk)
    risk_score = risk_data.get("contextual_risk_score", 50.0)
    automation_resistance = max(0.0, 100.0 - risk_score)

    # Factor 3: Growth Velocity
    growth_vector = career_dna.growth_vector
    if growth_vector:
        growth_velocity = float(
            growth_vector.growth_score
            if growth_vector.growth_score is not None
            else 50.0
        )
    else:
        growth_velocity = 50.0

    # Factor 4: Industry Stability
    trend_direction = trend_data.get("trend_direction", "stable")
    industry_stability_map = {
        "growing": 85.0,
        "stable": 60.0,
        "declining": 25.0,
        "disrupted": 15.0,
    }
    industry_stability = industry_stability_map.get(trend_direction, 50.0)

    # Factor 5: Adaptability Signal
    shield_count = sum(
        1 for entry in shield_data
        if entry.get("classification") == "shield"
    )
    total_skills = max(1, len(shield_data))
    adaptability_signal = min(100.0, (shield_count / total_skills) * 100)

    # Weighted composite
    overall = (
        skill_diversity * CRS_WEIGHT_SKILL_DIVERSITY
        + automation_resistance * CRS_WEIGHT_AUTOMATION_RESISTANCE
        + growth_velocity * CRS_WEIGHT_GROWTH_VELOCITY
        + industry_stability * CRS_WEIGHT_INDUSTRY_STABILITY
        + adaptability_signal * CRS_WEIGHT_ADAPTABILITY
    )

    return {
        "overall_score": round(max(0.0, min(100.0, overall)), 1),
        "skill_diversity_index": round(skill_diversity, 1),
        "automation_resistance": round(automation_resistance, 1),
        "growth_velocity": round(growth_velocity, 1),
        "industry_stability": round(industry_stability, 1),
        "adaptability_signal": round(adaptability_signal, 1),
    }


def _compute_moat_score(
    *,
    shield_data: list[dict[str, Any]],
    career_dna: CareerDNA,
) -> dict[str, Any]:
    """
    Compute Career Moat Score (4-dimension defensibility).

    Dimensions:
        1. Skill Rarity — how uncommon your skill combination is
        2. Switching Cost — employer replacement difficulty
        3. Network Effect — cross-functional value growth
        4. Intangible Assets — certifications, patents, domain depth
    """
    # Dimension 1: Skill Rarity (shield skills are rarer)
    shield_count = sum(
        1 for entry in shield_data
        if entry.get("classification") == "shield"
    )
    total_skills = max(1, len(shield_data))
    skill_rarity = min(100.0, (shield_count / total_skills) * 120)

    # Dimension 2: Switching Cost (years × skill depth)
    years = _estimate_years(career_dna)
    switching_cost = min(100.0, years * 6.0)

    # Dimension 3: Network Effect (experience diversity)
    blueprint = career_dna.experience_blueprint
    if blueprint:
        diversity = float(
            blueprint.industry_diversity
            if blueprint.industry_diversity is not None
            else 0.3
        )
        network_effect = min(100.0, diversity * 100)
    else:
        network_effect = 30.0

    # Dimension 4: Intangible Assets (skill count proxy)
    intangible = min(100.0, total_skills * 4.0)

    # Average of 4 dimensions
    moat_score = round(
        (skill_rarity + switching_cost + network_effect + intangible) / 4.0,
        1,
    )
    moat_score = max(0.0, min(100.0, moat_score))

    # Classify strength
    if moat_score >= 75:
        moat_strength = MoatStrength.WIDE.value
    elif moat_score >= 40:
        moat_strength = MoatStrength.NARROW.value
    else:
        moat_strength = MoatStrength.NONE.value

    return {
        "moat_score": moat_score,
        "moat_strength": moat_strength,
    }


# ── Private Helpers ────────────────────────────────────────────


async def _get_career_dna_with_genome(
    db: AsyncSession,
    user_id: uuid.UUID,
) -> CareerDNA | None:
    """Fetch CareerDNA with skill_genome eagerly loaded."""
    result = await db.execute(
        select(CareerDNA)
        .where(CareerDNA.user_id == user_id)
        .options(
            selectinload(CareerDNA.skill_genome),
            selectinload(CareerDNA.experience_blueprint),
            selectinload(CareerDNA.growth_vector),
        )
    )
    return result.scalar_one_or_none()


def _format_skills_summary(career_dna: CareerDNA) -> str:
    """Format CareerDNA skill_genome into text for prompts."""
    if not career_dna.skill_genome:
        return "No skills data available"
    skills = [
        f"{entry.skill_name} ({entry.proficiency_level})"
        for entry in career_dna.skill_genome[:30]
    ]
    return ", ".join(skills)


def _format_experience_summary(career_dna: CareerDNA) -> str:
    """Format experience blueprint into text."""
    if not career_dna.experience_blueprint:
        return "No experience data available"
    blueprint = career_dna.experience_blueprint
    return str(blueprint.pattern_analysis or "Experience data available")


def _extract_skill_names(career_dna: CareerDNA) -> list[str]:
    """Extract skill names from genome."""
    if not career_dna.skill_genome:
        return []
    return [entry.skill_name for entry in career_dna.skill_genome[:30]]


def _estimate_years(career_dna: CareerDNA) -> float:
    """Estimate years of experience from blueprint."""
    if career_dna.experience_blueprint:
        total = career_dna.experience_blueprint.total_years
        return float(total) if total else 5.0
    return 5.0


async def _persist_automation_risk(
    db: AsyncSession,
    career_dna_id: uuid.UUID,
    data: dict[str, Any],
) -> AutomationRisk:
    """Upsert automation risk record."""
    # Delete existing (one-to-one)
    await db.execute(
        delete(AutomationRisk).where(
            AutomationRisk.career_dna_id == career_dna_id,
        )
    )
    record = AutomationRisk(
        career_dna_id=career_dna_id,
        onet_soc_code=data.get("onet_soc_code", "00-0000.00"),
        onet_occupation_title=data.get("onet_occupation_title", "Unknown"),
        base_automation_probability=data.get("base_automation_probability", 0.3),
        contextual_risk_score=data.get("contextual_risk_score", 50.0),
        risk_level=data.get("risk_level", AlertSeverity.MEDIUM.value),
        vulnerable_tasks=data.get("vulnerable_tasks"),
        resilient_tasks=data.get("resilient_tasks"),
        recommended_skills=data.get("recommended_skills"),
        analysis_reasoning=data.get("analysis_reasoning"),
        opportunity_inversions=data.get("opportunity_inversions"),
    )
    db.add(record)
    await db.flush()
    return record


async def _persist_industry_trend(
    db: AsyncSession,
    career_dna_id: uuid.UUID,
    data: dict[str, Any],
) -> IndustryTrend:
    """Persist industry trend record."""
    record = IndustryTrend(
        career_dna_id=career_dna_id,
        industry_name=data.get("industry_name", "Unknown"),
        trend_direction=data.get("trend_direction", "stable"),
        confidence=data.get("confidence", 0.5),
        key_signals=data.get("key_signals"),
        impact_on_user=data.get("impact_on_user"),
        recommended_actions=data.get("recommended_actions"),
        data_sources=data.get("data_sources"),
    )
    db.add(record)
    await db.flush()
    return record


async def _persist_shield_entries(
    db: AsyncSession,
    career_dna_id: uuid.UUID,
    data: list[dict[str, Any]],
) -> list[SkillShieldEntry]:
    """Replace and persist Skills Shield™ entries."""
    # Clear old entries
    await db.execute(
        delete(SkillShieldEntry).where(
            SkillShieldEntry.career_dna_id == career_dna_id,
        )
    )

    entries = []
    for item in data:
        entry = SkillShieldEntry(
            career_dna_id=career_dna_id,
            skill_name=item.get("skill_name", "Unknown"),
            classification=item.get("classification", "neutral"),
            automation_resistance=item.get("automation_resistance", 0.5),
            market_demand_trend=item.get("market_demand_trend", "stable"),
            reasoning=item.get("reasoning"),
            improvement_path=item.get("improvement_path"),
        )
        db.add(entry)
        entries.append(entry)

    await db.flush()
    return entries


async def _persist_resilience_snapshot(
    db: AsyncSession,
    career_dna_id: uuid.UUID,
    crs: dict[str, float],
    moat: dict[str, Any],
) -> CareerResilienceSnapshot:
    """Persist CRS + Moat snapshot."""
    explanation = (
        f"Career Resilience Score: {crs['overall_score']}/100. "
        f"Career Moat: {moat['moat_score']}/100 ({moat['moat_strength']}). "
        f"Factors — Skill Diversity: {crs['skill_diversity_index']}, "
        f"Automation Resistance: {crs['automation_resistance']}, "
        f"Growth Velocity: {crs['growth_velocity']}, "
        f"Industry Stability: {crs['industry_stability']}, "
        f"Adaptability: {crs['adaptability_signal']}."
    )

    snapshot = CareerResilienceSnapshot(
        career_dna_id=career_dna_id,
        overall_score=crs["overall_score"],
        skill_diversity_index=crs["skill_diversity_index"],
        automation_resistance=crs["automation_resistance"],
        growth_velocity=crs["growth_velocity"],
        industry_stability=crs["industry_stability"],
        adaptability_signal=crs["adaptability_signal"],
        moat_score=moat["moat_score"],
        moat_strength=moat["moat_strength"],
        explanation=explanation,
    )
    db.add(snapshot)
    await db.flush()
    return snapshot


async def _persist_threat_alerts(
    db: AsyncSession,
    career_dna_id: uuid.UUID,
    data: list[dict[str, Any]],
) -> list[ThreatAlert]:
    """Persist generated threat alerts."""
    alerts = []
    for item in data:
        alert = ThreatAlert(
            career_dna_id=career_dna_id,
            category=item.get("category", "market_shift"),
            severity=item.get("severity", "low"),
            title=item.get("title", "Career Alert")[:500],
            description=item.get("description", ""),
            opportunity=item.get("opportunity", ""),
            evidence=item.get("evidence"),
        )
        db.add(alert)
        alerts.append(alert)

    await db.flush()
    return alerts


async def _get_latest(
    db: AsyncSession,
    model_class: type[CareerDNAChildModel],
    career_dna_id: uuid.UUID,
) -> Any:
    """Get the most recent record of a model type."""
    result = await db.execute(
        select(model_class)
        .where(model_class.career_dna_id == career_dna_id)
        .order_by(model_class.created_at.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()


async def _get_all(
    db: AsyncSession,
    model_class: type[CareerDNAChildModel],
    career_dna_id: uuid.UUID,
) -> list[Any]:
    """Get all records of a model type for a career DNA."""
    result = await db.execute(
        select(model_class)
        .where(model_class.career_dna_id == career_dna_id)
        .order_by(model_class.created_at.desc())
    )
    return list(result.scalars().all())


"""
PathForge AI Engine — Career Threat Radar™ Analyzer
=====================================================
AI pipeline for the Career Threat Radar™ system.

4 LLM methods:
    1. score_automation_risk — Hybrid ONET + LLM scoring
    2. analyze_industry_trends — Personalized trend analysis
    3. classify_skills_shield — Frey-Osborne bottleneck classification
    4. generate_threat_assessment — Threat→Opportunity inversion alerts

All methods follow the same pattern as CareerDNAAnalyzer:
    - Static async methods
    - complete_json for structured LLM output
    - sanitize_user_text before all LLM calls
    - Timing + structured logging
    - Safe fallbacks on error
"""

import logging
import time
from typing import Any

from app.ai.threat_radar_prompts import (
    AUTOMATION_RISK_USER_PROMPT,
    INDUSTRY_TREND_USER_PROMPT,
    SKILLS_SHIELD_USER_PROMPT,
    THREAT_ASSESSMENT_USER_PROMPT,
    THREAT_RADAR_SYSTEM_PROMPT,
)
from app.core.llm import LLMError, LLMTier, complete_json
from app.core.prompt_sanitizer import sanitize_user_text
from app.data.onet_loader import (
    OccupationEntry,
    compute_bottleneck_average,
    get_occupation_by_soc,
    search_occupations_by_title,
)

logger = logging.getLogger(__name__)


class ThreatRadarAnalyzer:
    """
    AI pipeline for Career Threat Radar™ analysis.

    Each method performs a focused LLM call and returns
    validated structured data. All results include reasoning
    and opportunity recommendations for explainability.
    """

    # ── Automation Risk Scoring ────────────────────────────────

    @staticmethod
    async def score_automation_risk(
        *,
        soc_code: str,
        skills_summary: str,
        experience_summary: str,
        years_experience: float,
    ) -> dict[str, Any]:
        """
        Score automation risk using hybrid ONET + LLM analysis.

        Args:
            soc_code: ONET SOC code for the user's occupation.
            skills_summary: Formatted skills overview from Career DNA.
            experience_summary: Career experience narrative.
            years_experience: Total years of professional experience.

        Returns:
            Dict with: contextual_risk_score, risk_level, vulnerable_tasks,
            resilient_tasks, recommended_skills, analysis_reasoning,
            opportunity_inversions.
        """
        occupation = get_occupation_by_soc(soc_code)
        if occupation is None:
            # Fallback: try title search from experience summary
            matches = search_occupations_by_title(
                experience_summary[:100], max_results=1,
            )
            occupation = matches[0] if matches else _fallback_occupation(soc_code)

        base_probability = occupation["automation_probability"]

        # Sanitize user text
        clean_skills, _ = sanitize_user_text(
            skills_summary, max_length=3000, context="threat_skills",
        )
        clean_exp, _ = sanitize_user_text(
            experience_summary, max_length=3000, context="threat_exp",
        )

        start = time.monotonic()
        try:
            data: dict[str, Any] = await complete_json(
                prompt=AUTOMATION_RISK_USER_PROMPT.format(
                    soc_code=soc_code,
                    occupation_title=occupation["title"],
                    base_probability=f"{base_probability:.3f}",
                    skills_summary=clean_skills,
                    experience_summary=clean_exp,
                    years_experience=str(years_experience),
                ),
                system_prompt=THREAT_RADAR_SYSTEM_PROMPT,
                tier=LLMTier.PRIMARY,
                temperature=0.1,
                max_tokens=2048,
            )

            # Inject ONET baseline data into result
            data["onet_soc_code"] = soc_code
            data["onet_occupation_title"] = occupation["title"]
            data["base_automation_probability"] = base_probability

            # Clamp contextual risk score to 0-100
            score = data.get("contextual_risk_score", base_probability * 100)
            data["contextual_risk_score"] = max(0.0, min(100.0, float(score)))

            elapsed = time.monotonic() - start
            logger.info(
                "Automation risk scored: %.1f/100 [%s] (%.2fs)",
                data["contextual_risk_score"],
                data.get("risk_level", "unknown"),
                elapsed,
            )
            return data

        except LLMError as exc:
            elapsed = time.monotonic() - start
            logger.error(
                "Automation risk scoring failed (%.2fs): %s",
                elapsed,
                str(exc)[:200],
            )
            return _default_automation_risk(soc_code, occupation)

    # ── Industry Trend Analysis ────────────────────────────────

    @staticmethod
    async def analyze_industry_trends(
        *,
        industry_name: str,
        skills_summary: str,
        experience_summary: str,
    ) -> dict[str, Any]:
        """
        Analyze industry trends personalized to the user's Career DNA.

        Args:
            industry_name: Primary industry to analyze.
            skills_summary: Formatted skills overview.
            experience_summary: Career experience narrative.

        Returns:
            Dict with: trend_direction, confidence, key_signals,
            impact_on_user, recommended_actions, data_sources.
        """
        if not industry_name or not industry_name.strip():
            logger.warning("Empty industry name for trend analysis")
            return _default_industry_trend(industry_name or "Unknown")

        clean_skills, _ = sanitize_user_text(
            skills_summary, max_length=2000, context="trend_skills",
        )
        clean_exp, _ = sanitize_user_text(
            experience_summary, max_length=2000, context="trend_exp",
        )
        clean_industry, _ = sanitize_user_text(
            industry_name, max_length=200, context="trend_industry",
        )

        start = time.monotonic()
        try:
            data: dict[str, Any] = await complete_json(
                prompt=INDUSTRY_TREND_USER_PROMPT.format(
                    industry_name=clean_industry,
                    skills_summary=clean_skills,
                    experience_summary=clean_exp,
                ),
                system_prompt=THREAT_RADAR_SYSTEM_PROMPT,
                tier=LLMTier.FAST,
                temperature=0.1,
                max_tokens=1536,
            )

            # Cap confidence at 0.85 per ethics policy
            if data.get("confidence", 0) > 0.85:
                data["confidence"] = 0.85

            # Inject industry name
            data["industry_name"] = industry_name

            elapsed = time.monotonic() - start
            logger.info(
                "Industry trend analyzed: %s → %s (%.2fs)",
                industry_name,
                data.get("trend_direction", "unknown"),
                elapsed,
            )
            return data

        except LLMError as exc:
            elapsed = time.monotonic() - start
            logger.error(
                "Industry trend analysis failed (%.2fs): %s",
                elapsed,
                str(exc)[:200],
            )
            return _default_industry_trend(industry_name)

    # ── Skills Shield™ Classification ──────────────────────────

    @staticmethod
    async def classify_skills_shield(
        *,
        skills_list: list[str],
        soc_code: str,
    ) -> list[dict[str, Any]]:
        """
        Classify each skill as SHIELD, EXPOSURE, or NEUTRAL.

        Uses Frey-Osborne bottleneck dimensions from ONET data as
        context for the LLM classification.

        Args:
            skills_list: List of skill names from Career DNA genome.
            soc_code: ONET SOC code for bottleneck reference.

        Returns:
            List of classification dicts with: skill_name, classification,
            automation_resistance, market_demand_trend, reasoning,
            improvement_path.
        """
        if not skills_list:
            logger.warning("Empty skills list for shield classification")
            return []

        occupation = get_occupation_by_soc(soc_code)
        if occupation is None:
            occupation = _fallback_occupation(soc_code)

        bottleneck = occupation["bottleneck_scores"]

        # Format skills as numbered list for clear LLM parsing
        formatted_skills = "\n".join(
            f"{idx + 1}. {skill}" for idx, skill in enumerate(skills_list)
        )

        start = time.monotonic()
        try:
            data: dict[str, Any] = await complete_json(
                prompt=SKILLS_SHIELD_USER_PROMPT.format(
                    skills_list=formatted_skills,
                    occupation_title=occupation["title"],
                    perception_score=f"{bottleneck['perception_manipulation']:.2f}",
                    creative_score=f"{bottleneck['creative_intelligence']:.2f}",
                    social_score=f"{bottleneck['social_intelligence']:.2f}",
                ),
                system_prompt=THREAT_RADAR_SYSTEM_PROMPT,
                tier=LLMTier.PRIMARY,
                temperature=0.0,
                max_tokens=3072,
            )

            classifications = data.get("classifications", [])

            # Validate and clamp automation_resistance
            for entry in classifications:
                resistance = entry.get("automation_resistance", 0.5)
                entry["automation_resistance"] = max(0.0, min(1.0, float(resistance)))

            elapsed = time.monotonic() - start
            shield_count = sum(
                1 for c in classifications
                if c.get("classification") == "shield"
            )
            exposure_count = sum(
                1 for c in classifications
                if c.get("classification") == "exposure"
            )
            logger.info(
                "Skills Shield classified: %d shields, %d exposures, "
                "%d neutral (%.2fs)",
                shield_count,
                exposure_count,
                len(classifications) - shield_count - exposure_count,
                elapsed,
            )
            return classifications

        except LLMError as exc:
            elapsed = time.monotonic() - start
            logger.error(
                "Skills Shield classification failed (%.2fs): %s",
                elapsed,
                str(exc)[:200],
            )
            return _default_shield_classifications(skills_list, occupation)

    # ── Threat Assessment (with Inversion Engine) ──────────────

    @staticmethod
    async def generate_threat_assessment(
        *,
        risk_score: float,
        risk_level: str,
        vulnerable_tasks: list[str],
        industry_trends_summary: str,
        shield_skills: list[str],
        exposure_skills: list[str],
        skills_summary: str,
        experience_summary: str,
    ) -> list[dict[str, Any]]:
        """
        Generate threat alerts with Threat→Opportunity inversions.

        Design principle: a user NEVER sees a threat without a pathway.

        Args:
            risk_score: Contextual automation risk score (0-100).
            risk_level: Risk level string (low/medium/high).
            vulnerable_tasks: Tasks most at risk.
            industry_trends_summary: Formatted industry trend overview.
            shield_skills: Skills classified as shields.
            exposure_skills: Skills classified as exposures.
            skills_summary: Full skills overview.
            experience_summary: Career experience narrative.

        Returns:
            List of alert dicts with: category, severity, title,
            description, opportunity, evidence.
        """
        clean_skills, _ = sanitize_user_text(
            skills_summary, max_length=2000, context="threat_assess_skills",
        )
        clean_exp, _ = sanitize_user_text(
            experience_summary, max_length=2000, context="threat_assess_exp",
        )
        clean_trends, _ = sanitize_user_text(
            industry_trends_summary, max_length=1500,
            context="threat_assess_trends",
        )

        start = time.monotonic()
        try:
            data: dict[str, Any] = await complete_json(
                prompt=THREAT_ASSESSMENT_USER_PROMPT.format(
                    risk_score=f"{risk_score:.1f}",
                    risk_level=risk_level,
                    vulnerable_tasks=", ".join(vulnerable_tasks) or "None identified",
                    industry_trends_summary=clean_trends,
                    shield_skills=", ".join(shield_skills) or "None classified",
                    exposure_skills=", ".join(exposure_skills) or "None classified",
                    skills_summary=clean_skills,
                    experience_summary=clean_exp,
                ),
                system_prompt=THREAT_RADAR_SYSTEM_PROMPT,
                tier=LLMTier.PRIMARY,
                temperature=0.2,
                max_tokens=2048,
            )

            alerts = data.get("alerts", [])

            # Validate: HIGH severity requires ≥2 evidence sources
            for alert in alerts:
                if alert.get("severity") == "high":
                    evidence = alert.get("evidence", {})
                    sources = evidence.get("sources", [])
                    if len(sources) < 2:
                        alert["severity"] = "medium"
                        logger.warning(
                            "Downgraded HIGH alert to MEDIUM (insufficient "
                            "evidence): %s",
                            alert.get("title", "unknown")[:60],
                        )

                # Ensure opportunity field is never empty
                if not alert.get("opportunity"):
                    alert["opportunity"] = (
                        "Consider exploring adjacent roles that leverage "
                        "your existing strengths while building new "
                        "capabilities."
                    )

            elapsed = time.monotonic() - start
            logger.info(
                "Threat assessment generated: %d alerts (%.2fs)",
                len(alerts),
                elapsed,
            )
            return alerts

        except LLMError as exc:
            elapsed = time.monotonic() - start
            logger.error(
                "Threat assessment generation failed (%.2fs): %s",
                elapsed,
                str(exc)[:200],
            )
            return []


# ── Default Fallbacks ──────────────────────────────────────────


def _fallback_occupation(soc_code: str) -> OccupationEntry:
    """Safe fallback when SOC code is not in the ONET dataset."""
    return OccupationEntry(
        soc_code=soc_code,
        title="General Professional",
        automation_probability=0.30,
        bottleneck_scores={
            "perception_manipulation": 0.30,
            "creative_intelligence": 0.50,
            "social_intelligence": 0.50,
        },
        category="unknown",
    )


def _default_automation_risk(
    soc_code: str,
    occupation: OccupationEntry,
) -> dict[str, Any]:
    """Safe fallback for automation risk when LLM fails."""
    base_prob = occupation["automation_probability"]
    return {
        "onet_soc_code": soc_code,
        "onet_occupation_title": occupation["title"],
        "base_automation_probability": base_prob,
        "contextual_risk_score": base_prob * 100,
        "risk_level": _probability_to_risk_level(base_prob),
        "vulnerable_tasks": [],
        "resilient_tasks": [],
        "recommended_skills": [],
        "analysis_reasoning": (
            "Analysis based on ONET baseline data only. "
            "Contextual adjustment unavailable — please retry."
        ),
        "opportunity_inversions": [],
    }


def _default_industry_trend(industry_name: str) -> dict[str, Any]:
    """Safe fallback for industry trend analysis."""
    return {
        "industry_name": industry_name,
        "trend_direction": "stable",
        "confidence": 0.3,
        "key_signals": [],
        "impact_on_user": (
            "Unable to complete personalized analysis. "
            "General industry outlook appears stable."
        ),
        "recommended_actions": [],
        "data_sources": ["baseline_estimate"],
    }


def _default_shield_classifications(
    skills_list: list[str],
    occupation: OccupationEntry,
) -> list[dict[str, Any]]:
    """
    Deterministic fallback using bottleneck average.

    When LLM classification fails, use the occupation's bottleneck
    average to provide a baseline classification.
    """
    avg = compute_bottleneck_average(occupation["bottleneck_scores"])

    # Apply simple threshold-based classification
    if avg >= 0.60:
        default_class = "shield"
    elif avg <= 0.35:
        default_class = "exposure"
    else:
        default_class = "neutral"

    return [
        {
            "skill_name": skill,
            "classification": default_class,
            "automation_resistance": avg,
            "market_demand_trend": "stable",
            "reasoning": (
                "Classified using occupation-level bottleneck average "
                f"({avg:.2f}). LLM-based analysis unavailable."
            ),
            "improvement_path": None,
        }
        for skill in skills_list
    ]


def _probability_to_risk_level(probability: float) -> str:
    """Convert Frey-Osborne probability to risk level string."""
    if probability >= 0.70:
        return "high"
    if probability >= 0.30:
        return "medium"
    return "low"

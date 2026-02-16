"""
PathForge AI Engine — Career DNA Analyzer
============================================
AI pipeline for computing Career DNA™ dimensions.

Orchestrates LLM calls for each dimension:
    - Hidden Skills Discovery (dual-source)
    - Experience Blueprint Analysis
    - Growth Vector Computation
    - Values Profile Extraction
    - Market Position (data-driven, no LLM)
    - Career DNA Summary Synthesis
"""

import logging
import time
from typing import Any

from app.ai.career_dna_prompts import (
    CAREER_DNA_SUMMARY_USER_PROMPT,
    CAREER_DNA_SYSTEM_PROMPT,
    EXPERIENCE_BLUEPRINT_USER_PROMPT,
    GROWTH_VECTOR_USER_PROMPT,
    HIDDEN_SKILLS_SYSTEM_PROMPT,
    HIDDEN_SKILLS_USER_PROMPT,
    VALUES_PROFILE_USER_PROMPT,
)
from app.core.llm import LLMError, LLMTier, complete_json
from app.core.prompt_sanitizer import sanitize_user_text

logger = logging.getLogger(__name__)


class CareerDNAAnalyzer:
    """
    AI pipeline for Career DNA™ analysis.

    Each method performs a focused LLM call and returns
    validated structured data. All results include confidence
    scores and evidence for explainability.
    """

    @staticmethod
    async def discover_hidden_skills(
        explicit_skills: list[str],
        experience_text: str,
    ) -> list[dict[str, Any]]:
        """
        Discover hidden transferable skills via LLM inference.

        Method A of dual-source discovery: semantic analysis of
        experience descriptions to find competencies not explicitly listed.

        Args:
            explicit_skills: Skills already known (to exclude from results).
            experience_text: Raw experience descriptions to analyze.

        Returns:
            List of hidden skill dicts with: skill_name, confidence,
            evidence, source_text.
        """
        if not experience_text or not experience_text.strip():
            logger.warning("Empty experience text for hidden skills discovery")
            return []

        # Sanitize user-provided text before LLM prompt
        clean_exp, _ = sanitize_user_text(
            experience_text, max_length=6000, context="hidden_skills_exp",
        )

        start = time.monotonic()
        try:
            data: dict[str, Any] = await complete_json(
                prompt=HIDDEN_SKILLS_USER_PROMPT.format(
                    explicit_skills=", ".join(explicit_skills) or "None listed",
                    experience_text=clean_exp,
                ),
                system_prompt=HIDDEN_SKILLS_SYSTEM_PROMPT,
                tier=LLMTier.PRIMARY,
                temperature=0.1,
                max_tokens=2048,
            )
            skills: list[dict[str, Any]] = data.get("hidden_skills", [])
            # Cap confidence at 0.9 for inferred skills
            for skill in skills:
                if skill.get("confidence", 0) > 0.9:
                    skill["confidence"] = 0.9
            elapsed = time.monotonic() - start
            logger.info(
                "Hidden skills discovered: %d skills (%.2fs)",
                len(skills),
                elapsed,
            )
            return skills

        except LLMError as exc:
            elapsed = time.monotonic() - start
            logger.error(
                "Hidden skills discovery failed (%.2fs): %s",
                elapsed,
                str(exc)[:200],
            )
            return []

    @staticmethod
    async def analyze_experience_blueprint(
        experience_text: str,
    ) -> dict[str, Any]:
        """
        Analyze career experience pattern.

        Args:
            experience_text: Raw experience descriptions.

        Returns:
            Dict with: total_years, role_count, avg_tenure_months,
            career_direction, industry_diversity, seniority_trajectory,
            pattern_analysis.
        """
        if not experience_text or not experience_text.strip():
            logger.warning("Empty experience text for blueprint analysis")
            return _default_blueprint()

        # Sanitize user-provided text before LLM prompt
        clean_exp, _ = sanitize_user_text(
            experience_text, max_length=6000, context="blueprint_exp",
        )

        start = time.monotonic()
        try:
            data: dict[str, Any] = await complete_json(
                prompt=EXPERIENCE_BLUEPRINT_USER_PROMPT.format(
                    experience_text=clean_exp,
                ),
                system_prompt=CAREER_DNA_SYSTEM_PROMPT,
                tier=LLMTier.FAST,
                temperature=0.0,
                max_tokens=1024,
            )
            elapsed = time.monotonic() - start
            logger.info("Experience blueprint analyzed (%.2fs)", elapsed)
            return data

        except LLMError as exc:
            elapsed = time.monotonic() - start
            logger.error(
                "Experience blueprint analysis failed (%.2fs): %s",
                elapsed,
                str(exc)[:200],
            )
            return _default_blueprint()

    @staticmethod
    async def compute_growth_vector(
        experience_text: str,
        skills_text: str,
        preferences_text: str,
    ) -> dict[str, Any]:
        """
        Compute career trajectory projection.

        Multi-signal: skill trajectory + market demand + experience velocity.

        Args:
            experience_text: Career history descriptions.
            skills_text: Formatted skills summary.
            preferences_text: User's stated career preferences.

        Returns:
            Dict with: current_trajectory, projected_roles, skill_velocity,
            growth_score, analysis_reasoning.
        """
        if not experience_text or not experience_text.strip():
            logger.warning("Empty data for growth vector computation")
            return _default_growth_vector()

        # Sanitize user-provided text before LLM prompt
        clean_exp, _ = sanitize_user_text(
            experience_text, max_length=4000, context="growth_exp",
        )
        clean_skills, _ = sanitize_user_text(
            skills_text, max_length=2000, context="growth_skills",
        )
        clean_prefs, _ = sanitize_user_text(
            preferences_text or "Not specified",
            max_length=2000,
            context="growth_prefs",
        )

        start = time.monotonic()
        try:
            data: dict[str, Any] = await complete_json(
                prompt=GROWTH_VECTOR_USER_PROMPT.format(
                    experience_text=clean_exp,
                    skills_text=clean_skills,
                    preferences_text=clean_prefs,
                ),
                system_prompt=CAREER_DNA_SYSTEM_PROMPT,
                tier=LLMTier.PRIMARY,
                temperature=0.1,
                max_tokens=1536,
            )
            # Clamp growth_score to 0-100
            score = data.get("growth_score", 50.0)
            data["growth_score"] = max(0.0, min(100.0, float(score)))
            elapsed = time.monotonic() - start
            logger.info("Growth vector computed (%.2fs)", elapsed)
            return data

        except LLMError as exc:
            elapsed = time.monotonic() - start
            logger.error(
                "Growth vector computation failed (%.2fs): %s",
                elapsed,
                str(exc)[:200],
            )
            return _default_growth_vector()

    @staticmethod
    async def extract_values_profile(
        experience_text: str,
        preferences_text: str,
    ) -> dict[str, Any]:
        """
        Extract career values from patterns and preferences.

        4-dimensional model: work_style, impact_preference,
        environment_fit, derived_values. Based on TWA framework.
        Never uses demographic data.

        Args:
            experience_text: Career history descriptions.
            preferences_text: User-stated career preferences.

        Returns:
            Dict with: work_style, impact_preference, environment_fit,
            derived_values, confidence.
        """
        if not experience_text or not experience_text.strip():
            logger.warning("Empty data for values profile extraction")
            return _default_values_profile()

        # Sanitize user-provided text before LLM prompt
        clean_exp, _ = sanitize_user_text(
            experience_text, max_length=4000, context="values_exp",
        )
        clean_prefs, _ = sanitize_user_text(
            preferences_text or "Not specified",
            max_length=2000,
            context="values_prefs",
        )

        start = time.monotonic()
        try:
            data: dict[str, Any] = await complete_json(
                prompt=VALUES_PROFILE_USER_PROMPT.format(
                    experience_text=clean_exp,
                    preferences_text=clean_prefs,
                ),
                system_prompt=CAREER_DNA_SYSTEM_PROMPT,
                tier=LLMTier.PRIMARY,
                temperature=0.1,
                max_tokens=1024,
            )
            # Cap confidence
            confidence = data.get("confidence", 0.5)
            data["confidence"] = max(0.0, min(1.0, float(confidence)))
            elapsed = time.monotonic() - start
            logger.info("Values profile extracted (%.2fs)", elapsed)
            return data

        except LLMError as exc:
            elapsed = time.monotonic() - start
            logger.error(
                "Values profile extraction failed (%.2fs): %s",
                elapsed,
                str(exc)[:200],
            )
            return _default_values_profile()

    @staticmethod
    async def synthesize_summary(
        skills_summary: str,
        experience_summary: str,
        growth_summary: str,
        values_summary: str,
        market_summary: str,
    ) -> str:
        """
        Create an executive summary from all Career DNA dimensions.

        Args:
            skills_summary: Formatted skill genome overview.
            experience_summary: Blueprint narrative.
            growth_summary: Growth vector narrative.
            values_summary: Values profile overview.
            market_summary: Market position overview.

        Returns:
            2-3 sentence career DNA narrative string.
        """
        start = time.monotonic()
        try:
            data: dict[str, Any] = await complete_json(
                prompt=CAREER_DNA_SUMMARY_USER_PROMPT.format(
                    skills_summary=skills_summary or "Not analyzed",
                    experience_summary=experience_summary or "Not analyzed",
                    growth_summary=growth_summary or "Not analyzed",
                    values_summary=values_summary or "Not analyzed",
                    market_summary=market_summary or "Not analyzed",
                ),
                system_prompt=CAREER_DNA_SYSTEM_PROMPT,
                tier=LLMTier.FAST,
                temperature=0.2,
                max_tokens=512,
            )
            elapsed = time.monotonic() - start
            logger.info("Career DNA summary synthesized (%.2fs)", elapsed)
            return str(data.get("summary", ""))

        except LLMError as exc:
            elapsed = time.monotonic() - start
            logger.error(
                "Career DNA summary synthesis failed (%.2fs): %s",
                elapsed,
                str(exc)[:200],
            )
            return ""

    @staticmethod
    def compute_market_position(
        skill_names: list[str],
        job_listings_data: list[dict[str, Any]],
    ) -> dict[str, Any]:
        """
        Compute market position from internal job listing data.

        No LLM call — pure data analysis:
        - Count matching listings per skill
        - Calculate demand frequency
        - Derive approximate percentile
        - Determine market trend (rising/stable/declining)

        Args:
            skill_names: User's skill set.
            job_listings_data: Structured job listing data.

        Returns:
            Dict with: percentile_overall, skill_demand_scores,
            matching_job_count, market_trend.
        """
        if not skill_names or not job_listings_data:
            return _default_market_position()

        total_listings = len(job_listings_data)
        skill_demand: dict[str, float] = {}
        matching_listings: set[int] = set()

        for skill in skill_names:
            skill_lower = skill.lower()
            match_count = 0
            for idx, listing in enumerate(job_listings_data):
                description = str(listing.get("description", "")).lower()
                title = str(listing.get("title", "")).lower()
                if skill_lower in description or skill_lower in title:
                    match_count += 1
                    matching_listings.add(idx)

            demand_score = (match_count / total_listings) if total_listings > 0 else 0.0
            skill_demand[skill] = round(demand_score, 3)

        # Overall percentile based on average demand
        avg_demand = (
            sum(skill_demand.values()) / len(skill_demand)
            if skill_demand
            else 0.0
        )
        percentile = min(100.0, round(avg_demand * 100, 1))

        # Market trend heuristic
        high_demand_count = sum(
            1 for score in skill_demand.values() if score > 0.3
        )
        if high_demand_count > len(skill_demand) * 0.6:
            trend = "rising"
        elif high_demand_count > len(skill_demand) * 0.3:
            trend = "stable"
        else:
            trend = "declining"

        return {
            "percentile_overall": percentile,
            "skill_demand_scores": skill_demand,
            "matching_job_count": len(matching_listings),
            "market_trend": trend,
        }


# ── Default Fallbacks ──────────────────────────────────────────


def _default_blueprint() -> dict[str, Any]:
    """Safe fallback for experience blueprint."""
    return {
        "total_years": 0.0,
        "role_count": 0,
        "avg_tenure_months": 0.0,
        "career_direction": "exploring",
        "industry_diversity": 0.0,
        "seniority_trajectory": None,
        "pattern_analysis": None,
    }


def _default_growth_vector() -> dict[str, Any]:
    """Safe fallback for growth vector."""
    return {
        "current_trajectory": "steady",
        "projected_roles": None,
        "skill_velocity": None,
        "growth_score": 50.0,
        "analysis_reasoning": None,
    }


def _default_values_profile() -> dict[str, Any]:
    """Safe fallback for values profile."""
    return {
        "work_style": "flexible",
        "impact_preference": "team",
        "environment_fit": None,
        "derived_values": None,
        "confidence": 0.0,
    }


def _default_market_position() -> dict[str, Any]:
    """Safe fallback for market position."""
    return {
        "percentile_overall": 0.0,
        "skill_demand_scores": None,
        "matching_job_count": 0,
        "market_trend": "stable",
    }

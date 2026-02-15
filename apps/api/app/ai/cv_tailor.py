"""
PathForge AI Engine — CV Tailoring Service
============================================
AI-powered CV customization with field-level diff tracking and
ATS compliance validation.

Human-in-the-loop principle: generates recommendations, never submits automatically.
"""

from __future__ import annotations

import logging
import time
from typing import Any

from app.ai.prompts import CV_TAILOR_SYSTEM_PROMPT, CV_TAILOR_USER_PROMPT
from app.ai.schemas import ParsedResume, TailoredCV
from app.core.llm import LLMError, LLMTier, complete_json

logger = logging.getLogger(__name__)


class CVTailoringService:
    """
    Generate tailored CVs for specific job listings.

    Design decisions:
    - Uses PRIMARY tier (high-quality generation is critical for CVs)
    - Field-level diff tracking — user sees exactly what changed and why
    - ATS compliance scoring — estimates keyword match quality
    - NEVER fabricates experience — only reorganizes and rephrases
    - Human review is required before any submission (enforced by API flow)
    """

    @staticmethod
    async def generate_tailored_cv(
        *,
        resume: ParsedResume,
        job_title: str,
        job_company: str,
        job_description: str,
    ) -> TailoredCV:
        """
        Generate a tailored CV for a specific job listing.

        The LLM reorganizes, rephrases, and emphasizes existing content
        to maximize ATS compatibility and relevance. Every change is
        tracked in the diffs field with a reason.

        Args:
            resume: Parsed resume data from the resume parser.
            job_title: Target job title.
            job_company: Target company name.
            job_description: Full job description text.

        Returns:
            TailoredCV with tailored content, diffs, and ATS score.

        Raises:
            LLMError: If generation fails after all retries.
        """
        start = time.monotonic()

        # Prepare resume sections for the prompt
        skills_text = ", ".join([s.name for s in resume.skills]) if resume.skills else "None"
        experience_text = "\n".join([
            f"- {exp.title} at {exp.company}: {exp.description}"
            + (", ".join(exp.achievements) if exp.achievements else "")
            for exp in resume.experience
        ]) if resume.experience else "None"

        prompt = CV_TAILOR_USER_PROMPT.format(
            resume_summary=resume.summary or "No summary provided",
            resume_skills=skills_text,
            resume_experience=experience_text,
            job_title=job_title,
            job_company=job_company,
            job_description=job_description,
        )

        try:
            data: dict[str, Any] = await complete_json(
                prompt=prompt,
                system_prompt=CV_TAILOR_SYSTEM_PROMPT,
                tier=LLMTier.PRIMARY,
                temperature=0.3,
                max_tokens=4096,
            )

            tailored = TailoredCV.model_validate(data)
            elapsed = time.monotonic() - start

            logger.info(
                "CV tailored for '%s' at %s: ATS=%d%%, %d diffs (%.2fs)",
                job_title,
                job_company,
                tailored.ats_score,
                len(tailored.diffs),
                elapsed,
            )
            return tailored

        except LLMError:
            elapsed = time.monotonic() - start
            logger.error(
                "CV tailoring failed after %.2fs for job '%s' at %s",
                elapsed,
                job_title,
                job_company,
            )
            raise

        except Exception as exc:
            elapsed = time.monotonic() - start
            logger.error(
                "Unexpected error in CV tailoring (%.2fs): %s",
                elapsed,
                str(exc)[:200],
            )
            raise LLMError(f"CV tailoring failed: {exc}") from exc

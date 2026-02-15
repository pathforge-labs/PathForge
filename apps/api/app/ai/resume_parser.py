"""
PathForge AI Engine — Resume Parser
=====================================
LLM-powered structured resume extraction.

Uses the Fast tier for cost-efficient, high-volume parsing.
Returns a validated ParsedResume Pydantic model.
"""

from __future__ import annotations

import logging
import time
from typing import Any

from app.ai.prompts import RESUME_PARSE_SYSTEM_PROMPT, RESUME_PARSE_USER_PROMPT
from app.ai.schemas import ParsedResume
from app.core.llm import LLMError, LLMTier, complete_json

logger = logging.getLogger(__name__)


class ResumeParser:
    """
    Parse raw resume text into structured data using LLM extraction.

    Design decisions:
    - Uses FAST tier (high-volume, low-cost parsing)
    - Returns Pydantic-validated output — malformed data is caught immediately
    - Graceful degradation: on failure, returns a minimal ParsedResume
    - Logs parse time and success/failure for monitoring
    """

    @staticmethod
    async def parse(raw_text: str) -> ParsedResume:
        """
        Parse raw resume text into a structured ParsedResume.

        Args:
            raw_text: The raw text content of a resume/CV.

        Returns:
            ParsedResume with all extracted fields validated.
        """
        if not raw_text or not raw_text.strip():
            logger.warning("Empty resume text provided to parser")
            return ParsedResume()

        start = time.monotonic()
        try:
            data: dict[str, Any] = await complete_json(
                prompt=RESUME_PARSE_USER_PROMPT.format(resume_text=raw_text),
                system_prompt=RESUME_PARSE_SYSTEM_PROMPT,
                tier=LLMTier.FAST,
                temperature=0.0,
                max_tokens=4096,
            )
            parsed = ParsedResume.model_validate(data)
            elapsed = time.monotonic() - start
            logger.info(
                "Resume parsed successfully: %d skills, %d experiences (%.2fs)",
                len(parsed.skills),
                len(parsed.experience),
                elapsed,
            )
            return parsed

        except LLMError as exc:
            elapsed = time.monotonic() - start
            logger.error(
                "Resume parsing failed after %.2fs: %s",
                elapsed,
                str(exc)[:200],
            )
            # Graceful degradation — return minimal result
            return ParsedResume(summary=raw_text[:500])

        except Exception as exc:
            elapsed = time.monotonic() - start
            logger.error(
                "Unexpected error during resume parsing (%.2fs): %s",
                elapsed,
                str(exc)[:200],
            )
            return ParsedResume(summary=raw_text[:500])

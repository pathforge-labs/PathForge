"""
PathForge AI Engine — Semantic Matching Pipeline
==================================================
pgvector HNSW cosine similarity matching with LLM explanations.

Pipeline: resume embedding → pgvector top-K query → LLM explanation → stored result
"""

from __future__ import annotations

import logging
import uuid
from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.prompts import MATCH_EXPLAIN_SYSTEM_PROMPT, MATCH_EXPLAIN_USER_PROMPT
from app.ai.schemas import MatchCandidate, MatchExplanation, ParsedResume
from app.core.llm import LLMTier, complete_json
from app.models.matching import MatchResult

logger = logging.getLogger(__name__)


class MatchingService:
    """
    Semantic job matching using pgvector cosine similarity.

    Design decisions:
    - Uses pgvector's `<=>` operator (cosine distance) with HNSW index
    - Score = 1 - cosine_distance (higher = better match)
    - LLM explanations are generated per match (Primary tier)
    - Results are persisted to match_results table for audit trail
    """

    @staticmethod
    async def find_matches(
        db: AsyncSession,
        *,
        resume_embedding: list[float],
        top_k: int = 20,
    ) -> list[MatchCandidate]:
        """
        Find the top-K most semantically similar job listings.

        Uses pgvector's cosine distance operator with HNSW index for
        sub-100ms query performance at expected scale.

        Args:
            db: Database session.
            resume_embedding: The user's resume embedding vector.
            top_k: Number of top matches to return.

        Returns:
            Ranked list of MatchCandidate objects with scores.
        """
        embedding_str = "[" + ",".join(str(f) for f in resume_embedding) + "]"

        query = text("""
            SELECT
                id::text AS job_id,
                title,
                company,
                1 - (embedding <=> :embedding::vector) AS score
            FROM job_listings
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> :embedding::vector
            LIMIT :top_k
        """)

        result = await db.execute(
            query,
            {"embedding": embedding_str, "top_k": top_k},
        )
        rows = result.mappings().all()

        candidates = [
            MatchCandidate(
                job_id=str(row["job_id"]),
                score=float(row["score"]),
                title=str(row["title"]),
                company=str(row["company"]),
            )
            for row in rows
        ]

        logger.info(
            "Found %d matches (top score: %.4f)",
            len(candidates),
            candidates[0].score if candidates else 0.0,
        )
        return candidates

    @staticmethod
    async def explain_match(
        *,
        resume: ParsedResume,
        job_title: str,
        job_company: str,
        job_description: str,
    ) -> MatchExplanation:
        """
        Generate an LLM-powered explanation of why a job matches.

        Uses the Primary tier for high-quality reasoning.

        Args:
            resume: Parsed resume data.
            job_title: Job listing title.
            job_company: Company name.
            job_description: Full job description.

        Returns:
            MatchExplanation with assessment, strengths, gaps, recommendation.
        """
        # Build resume summary for the prompt
        skills_text = ", ".join([s.name for s in resume.skills]) if resume.skills else "None listed"
        exp_summary = "; ".join(
            [f"{e.title} at {e.company}" for e in resume.experience]
        ) if resume.experience else "None listed"
        resume_summary = (
            f"Name: {resume.full_name}\n"
            f"Summary: {resume.summary}\n"
            f"Skills: {skills_text}\n"
            f"Experience: {exp_summary}"
        )

        prompt = MATCH_EXPLAIN_USER_PROMPT.format(
            resume_summary=resume_summary,
            job_title=job_title,
            job_company=job_company,
            job_description=job_description,
        )

        data: dict[str, Any] = await complete_json(
            prompt=prompt,
            system_prompt=MATCH_EXPLAIN_SYSTEM_PROMPT,
            tier=LLMTier.PRIMARY,
            temperature=0.2,
        )

        explanation = MatchExplanation.model_validate(data)
        logger.info(
            "Match explanation generated: %s (%d strengths, %d gaps)",
            explanation.recommendation,
            len(explanation.strengths),
            len(explanation.gaps),
        )
        return explanation

    @staticmethod
    async def store_match(
        db: AsyncSession,
        *,
        user_id: uuid.UUID,
        job_id: uuid.UUID,
        score: float,
        explanation: str,
    ) -> MatchResult:
        """
        Persist a match result to the database for audit trail.

        Args:
            db: Database session.
            user_id: The user's UUID.
            job_id: The job listing's UUID.
            score: Cosine similarity score (0-1).
            explanation: LLM-generated match explanation text.

        Returns:
            The created MatchResult record.
        """
        match_result = MatchResult(
            user_id=user_id,
            job_listing_id=job_id,
            overall_score=score,
            explanation=explanation,
        )
        db.add(match_result)
        await db.flush()
        logger.info(
            "Match result stored: user=%s job=%s score=%.4f",
            user_id,
            job_id,
            score,
        )
        return match_result

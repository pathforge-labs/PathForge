"""
PathForge — Job Embedding Pipeline
=====================================
Batch embed new job listings using the existing Voyage AI integration.

Selects jobs with NULL embeddings, generates canonical text,
and batch-embeds them using the EmbeddingService from Sprint 2.
"""

from __future__ import annotations

import logging

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.matching import JobListing

logger = logging.getLogger(__name__)


def job_to_canonical(job: JobListing) -> str:
    """
    Build canonical text for a job listing for embedding.

    Mirrors the pattern from the resume embedding service:
    structured text that captures the key semantic signals.
    """
    parts = [
        f"Title: {job.title}",
        f"Company: {job.company}",
    ]
    if job.location:
        parts.append(f"Location: {job.location}")
    if job.work_type:
        parts.append(f"Type: {job.work_type}")
    if job.salary_info:
        parts.append(f"Salary: {job.salary_info}")
    if job.description:
        # Truncate description to avoid excessive token usage
        desc = job.description[:2000]
        parts.append(f"Description: {desc}")

    return "\n".join(parts)


async def embed_new_jobs(
    *,
    session: AsyncSession,
    batch_size: int = 50,
) -> int:
    """
    Embed all job listings that don't have embeddings yet.

    Uses Voyage AI via the EmbeddingService.

    Args:
        session: Async database session
        batch_size: Number of jobs to embed per batch

    Returns:
        Number of jobs embedded
    """
    # Import here to avoid circular imports and allow optional AI deps
    from app.ai.embedding_service import EmbeddingService

    embedding_service = EmbeddingService()

    # Get jobs without embeddings
    result = await session.execute(
        select(JobListing)
        .where(JobListing.embedding.is_(None))
        .limit(batch_size * 10)  # Cap total to avoid runaway
    )
    jobs = list(result.scalars().all())

    if not jobs:
        logger.info("No jobs need embedding")
        return 0

    logger.info("Embedding %d job listings", len(jobs))
    total_embedded = 0

    # Process in batches
    for i in range(0, len(jobs), batch_size):
        batch = jobs[i : i + batch_size]
        texts = [job_to_canonical(job) for job in batch]

        try:
            embeddings = await embedding_service.embed_batch(texts)
        except Exception:
            logger.exception("Failed to embed batch %d-%d", i, i + len(batch))
            continue

        # Update each job with its embedding
        for job, emb in zip(batch, embeddings, strict=False):
            await session.execute(
                update(JobListing)
                .where(JobListing.id == job.id)
                .values(embedding=emb)
            )

        total_embedded += len(batch)

    await session.commit()
    logger.info("Successfully embedded %d job listings", total_embedded)

    return total_embedded

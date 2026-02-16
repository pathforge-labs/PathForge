"""
PathForge — Job Ingestion Orchestrator
=========================================
Fetch → Deduplicate → Insert → Embed pipeline.

This is the main entry point for pulling jobs from external APIs
into the PathForge database. It coordinates:

1. Fetching from all configured providers (Adzuna, Jooble)
2. Computing dedup fingerprints
3. Checking against existing DB records
4. Bulk inserting new listings
5. Triggering embedding for new listings

Designed to be called from an API endpoint or background scheduler.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.jobs.dedup import compute_fingerprint
from app.jobs.providers.base import JobProvider, RawJobListing
from app.models.matching import JobListing

logger = logging.getLogger(__name__)


@dataclass
class IngestionStats:
    """Summary of an ingestion run."""

    provider: str = ""
    fetched: int = 0
    new: int = 0
    duplicates: int = 0
    errors: int = 0

    def to_dict(self) -> dict[str, Any]:
        return {
            "provider": self.provider,
            "fetched": self.fetched,
            "new": self.new,
            "duplicates": self.duplicates,
            "errors": self.errors,
        }


@dataclass
class IngestionResult:
    """Overall ingestion run result across all providers."""

    providers: list[IngestionStats] = field(default_factory=list)

    @property
    def total_fetched(self) -> int:
        return sum(s.fetched for s in self.providers)

    @property
    def total_new(self) -> int:
        return sum(s.new for s in self.providers)

    @property
    def total_duplicates(self) -> int:
        return sum(s.duplicates for s in self.providers)

    def to_dict(self) -> dict[str, Any]:
        return {
            "total_fetched": self.total_fetched,
            "total_new": self.total_new,
            "total_duplicates": self.total_duplicates,
            "providers": [s.to_dict() for s in self.providers],
        }


async def ingest_jobs(
    *,
    session: AsyncSession,
    providers: list[JobProvider],
    keywords: str,
    location: str = "",
    country: str = "nl",
    pages: int = 1,
    results_per_page: int = 20,
) -> IngestionResult:
    """
    Run the full ingestion pipeline.

    Fetches from all providers, deduplicates, and stores new listings.

    Args:
        session: Async database session
        providers: List of job provider instances
        keywords: Search keywords
        location: Location filter
        country: Country code (ISO 3166-1 alpha-2)
        pages: Number of pages to fetch per provider
        results_per_page: Results per page

    Returns:
        IngestionResult with per-provider stats
    """
    result = IngestionResult()

    for provider in providers:
        stats = IngestionStats(provider=provider.name)

        # Fetch all pages
        raw_listings: list[RawJobListing] = []
        for page in range(1, pages + 1):
            try:
                page_results = await provider.search(
                    keywords=keywords,
                    location=location,
                    country=country,
                    page=page,
                    results_per_page=results_per_page,
                )
                raw_listings.extend(page_results)
            except (OSError, ValueError, KeyError):
                logger.exception("Error fetching page %d from %s", page, provider.name)
                stats.errors += 1

        stats.fetched = len(raw_listings)
        logger.info("Fetched %d listings from %s", stats.fetched, provider.name)

        # Deduplicate and insert
        if raw_listings:
            new_count, dup_count = await _dedupe_and_insert(
                session=session,
                listings=raw_listings,
            )
            stats.new = new_count
            stats.duplicates = dup_count

        result.providers.append(stats)
        logger.info(
            "%s ingestion: %d fetched, %d new, %d duplicates",
            provider.name,
            stats.fetched,
            stats.new,
            stats.duplicates,
        )

    return result


async def _dedupe_and_insert(
    *,
    session: AsyncSession,
    listings: list[RawJobListing],
) -> tuple[int, int]:
    """
    Deduplicate listings against DB and insert new ones.

    Returns:
        (new_count, duplicate_count)
    """
    # Compute fingerprints
    fingerprints: dict[str, RawJobListing] = {}
    for listing in listings:
        fp = compute_fingerprint(listing.title, listing.company, listing.location)
        if fp not in fingerprints:
            fingerprints[fp] = listing

    # Skip batch-internal duplicates
    batch_dupes = len(listings) - len(fingerprints)

    # Check which fingerprints already exist in DB
    existing_result = await session.execute(
        select(JobListing.fingerprint).where(
            JobListing.fingerprint.in_(list(fingerprints.keys()))
        )
    )
    existing_fps = {row[0] for row in existing_result.fetchall()}

    # Filter to only new listings
    new_listings = {
        fp: listing for fp, listing in fingerprints.items() if fp not in existing_fps
    }

    db_dupes = len(fingerprints) - len(new_listings)
    total_dupes = batch_dupes + db_dupes

    if not new_listings:
        return 0, total_dupes

    # Bulk insert using PostgreSQL ON CONFLICT DO NOTHING
    values = []
    for fp, listing in new_listings.items():
        values.append(
            {
                "title": listing.title[:500],
                "company": listing.company[:255],
                "description": listing.description,
                "location": (listing.location or "")[:255],
                "work_type": (listing.work_type or "")[:50] or None,
                "salary_info": (listing.salary_info or "")[:255] or None,
                "source_url": listing.source_url or None,
                "source_platform": listing.source_platform[:100] if listing.source_platform else None,
                "external_id": listing.external_id[:255] if listing.external_id else None,
                "fingerprint": fp,
                "structured_data": listing.extra if listing.extra else None,
            }
        )

    stmt = pg_insert(JobListing).values(values).on_conflict_do_nothing(
        index_elements=["fingerprint"]
    )
    await session.execute(stmt)
    await session.commit()

    logger.info("Inserted %d new job listings", len(new_listings))
    return len(new_listings), total_dupes

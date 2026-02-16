"""
PathForge — Job Provider Protocol
====================================
Common interface for all job API providers.

Every provider implements the same protocol, making it easy to add new
sources (Reed, Indeed, etc.) without changing the ingestion pipeline.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Protocol, runtime_checkable


@dataclass(frozen=True)
class RawJobListing:
    """
    Normalized representation of a job listing from any provider.

    All provider-specific fields are mapped to this common shape
    before entering the deduplication and storage pipeline.
    """

    title: str
    company: str
    description: str
    location: str = ""
    work_type: str = ""
    salary_info: str = ""
    source_url: str = ""
    source_platform: str = ""
    external_id: str = ""
    extra: dict[str, Any] = field(default_factory=dict)


@runtime_checkable
class JobProvider(Protocol):
    """
    Protocol all job API providers must satisfy.

    Implementations handle authentication, rate limiting,
    response parsing, and mapping to RawJobListing.
    """

    @property
    def name(self) -> str:
        """Provider name (e.g. 'adzuna', 'jooble')."""
        ...

    async def search(
        self,
        *,
        keywords: str,
        location: str = "",
        country: str = "nl",
        page: int = 1,
        results_per_page: int = 20,
    ) -> list[RawJobListing]:
        """
        Search for jobs matching the given criteria.

        Args:
            keywords: Search terms (e.g. "python developer")
            location: City or region
            country: ISO 3166-1 alpha-2 country code
            page: Page number (1-indexed)
            results_per_page: Results per page

        Returns:
            List of normalized job listings.
        """
        ...

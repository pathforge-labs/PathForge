"""
PathForge — Job Provider Tests
=================================
Tests for Adzuna and Jooble API clients with mocked HTTP responses.
"""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import httpx
import pytest

from app.jobs.providers.adzuna import AdzunaProvider, _format_salary
from app.jobs.providers.jooble import JoobleProvider


# ── Helper ─────────────────────────────────────────────────────


def _mock_response(status_code: int, json_data=None, text: str = "") -> httpx.Response:
    """Create a properly constructed mock httpx.Response."""
    request = httpx.Request("GET", "https://test.com")
    if json_data is not None:
        import json as json_mod
        response = httpx.Response(
            status_code,
            request=request,
            content=json_mod.dumps(json_data).encode(),
            headers={"content-type": "application/json"},
        )
    else:
        response = httpx.Response(
            status_code,
            request=request,
            text=text,
        )
    return response


# ── Adzuna Fixtures ────────────────────────────────────────────


ADZUNA_RESPONSE = {
    "results": [
        {
            "id": "12345",
            "title": "Senior Python Developer",
            "company": {"display_name": "Tech Corp"},
            "description": "We are looking for a Python developer...",
            "location": {"display_name": "Amsterdam, Noord-Holland"},
            "redirect_url": "https://adzuna.nl/job/12345",
            "contract_type": "permanent",
            "salary_min": 60000,
            "salary_max": 80000,
            "category": {"label": "IT Jobs"},
            "created": "2026-02-13T00:00:00Z",
        },
        {
            "id": "67890",
            "title": "Data Engineer",
            "company": {"display_name": "Data Co"},
            "description": "Join our data team...",
            "location": {"display_name": "Rotterdam"},
            "redirect_url": "https://adzuna.nl/job/67890",
            "contract_time": "full_time",
            "category": {"label": "IT Jobs"},
            "created": "2026-02-12T00:00:00Z",
        },
    ],
    "count": 2,
}


# ── Jooble Fixtures ────────────────────────────────────────────


JOOBLE_RESPONSE = {
    "totalCount": 50,
    "jobs": [
        {
            "title": "Backend Developer",
            "location": "Amsterdam",
            "snippet": "Python/FastAPI backend developer needed...",
            "salary": "€55,000 - €75,000",
            "link": "https://jooble.org/job/abc123",
            "company": "StartupX",
            "id": "abc123",
            "updated": "2026-02-13",
            "type": "Full-time",
        },
    ],
}


# ── Adzuna Tests ───────────────────────────────────────────────


class TestAdzunaProvider:
    """Test Adzuna API client."""

    @pytest.mark.asyncio
    async def test_search_success(self) -> None:
        """Should parse Adzuna response into RawJobListing objects."""
        mock_resp = _mock_response(200, json_data=ADZUNA_RESPONSE)

        with patch.object(
            httpx.AsyncClient,
            "get",
            new_callable=AsyncMock,
            return_value=mock_resp,
        ):
            provider = AdzunaProvider(app_id="test_id", app_key="test_key")
            results = await provider.search(keywords="python developer", country="nl")

        assert len(results) == 2
        assert results[0].title == "Senior Python Developer"
        assert results[0].company == "Tech Corp"
        assert results[0].location == "Amsterdam, Noord-Holland"
        assert results[0].source_platform == "adzuna"
        assert results[0].external_id == "12345"

    @pytest.mark.asyncio
    async def test_search_api_error(self) -> None:
        """Should return empty list on HTTP error."""
        mock_resp = _mock_response(429, text="Rate limited")

        with patch.object(
            httpx.AsyncClient,
            "get",
            new_callable=AsyncMock,
            return_value=mock_resp,
        ):
            provider = AdzunaProvider(app_id="test_id", app_key="test_key")
            results = await provider.search(keywords="python", country="nl")

        assert results == []

    @pytest.mark.asyncio
    async def test_search_network_error(self) -> None:
        """Should return empty list on network error."""
        with patch.object(
            httpx.AsyncClient,
            "get",
            new_callable=AsyncMock,
            side_effect=httpx.ConnectError("Connection refused"),
        ):
            provider = AdzunaProvider(app_id="test_id", app_key="test_key")
            results = await provider.search(keywords="python", country="nl")

        assert results == []

    def test_provider_name(self) -> None:
        provider = AdzunaProvider(app_id="x", app_key="y")
        assert provider.name == "adzuna"


class TestAdzunaSalaryFormat:
    """Test salary formatting helper."""

    def test_salary_range(self) -> None:
        raw = {"salary_min": 60000, "salary_max": 80000}
        assert _format_salary(raw) == "€60,000 - €80,000"

    def test_salary_min_only(self) -> None:
        raw = {"salary_min": 50000, "salary_max": None}
        assert _format_salary(raw) == "€50,000+"

    def test_no_salary(self) -> None:
        raw = {}
        assert _format_salary(raw) == ""


# ── Jooble Tests ───────────────────────────────────────────────


class TestJoobleProvider:
    """Test Jooble API client."""

    @pytest.mark.asyncio
    async def test_search_success(self) -> None:
        """Should parse Jooble response into RawJobListing objects."""
        mock_resp = _mock_response(200, json_data=JOOBLE_RESPONSE)

        with patch.object(
            httpx.AsyncClient,
            "post",
            new_callable=AsyncMock,
            return_value=mock_resp,
        ):
            provider = JoobleProvider(api_key="test_key")
            results = await provider.search(keywords="backend developer")

        assert len(results) == 1
        assert results[0].title == "Backend Developer"
        assert results[0].company == "StartupX"
        assert results[0].location == "Amsterdam"
        assert results[0].source_platform == "jooble"
        assert results[0].external_id == "abc123"
        assert results[0].salary_info == "€55,000 - €75,000"

    @pytest.mark.asyncio
    async def test_search_api_error(self) -> None:
        """Should return empty list on HTTP error."""
        mock_resp = _mock_response(500, text="Server error")

        with patch.object(
            httpx.AsyncClient,
            "post",
            new_callable=AsyncMock,
            return_value=mock_resp,
        ):
            provider = JoobleProvider(api_key="test_key")
            results = await provider.search(keywords="python")

        assert results == []

    def test_provider_name(self) -> None:
        provider = JoobleProvider(api_key="x")
        assert provider.name == "jooble"

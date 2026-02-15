"""
PathForge API — Analytics Tests
==================================
Tests for funnel pipeline, market intelligence, and CV A/B experiment endpoints.

Sprint 6b — Analytics
"""

import pytest
from httpx import AsyncClient

# ── Funnel Pipeline Tests ─────────────────────────────────────────


class TestFunnelEvents:
    """POST /api/v1/analytics/funnel/events"""

    @pytest.mark.asyncio
    async def test_record_funnel_event(self, client: AsyncClient, auth_headers: dict):
        """Should record a funnel event successfully."""
        response = await client.post(
            "/api/v1/analytics/funnel/events",
            headers=auth_headers,
            json={"stage": "viewed", "metadata": {"source": "career_radar"}},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["stage"] == "viewed"
        assert data["metadata"] == {"source": "career_radar"}
        assert data["id"] is not None
        assert data["user_id"] is not None

    @pytest.mark.asyncio
    async def test_record_funnel_event_all_stages(self, client: AsyncClient, auth_headers: dict):
        """Should accept all valid funnel stages."""
        valid_stages = [
            "viewed", "saved", "cv_tailored", "applied",
            "interviewing", "offered", "accepted", "rejected", "withdrawn",
        ]
        for stage in valid_stages:
            response = await client.post(
                "/api/v1/analytics/funnel/events",
                headers=auth_headers,
                json={"stage": stage},
            )
            assert response.status_code == 201, f"Failed for stage: {stage}"

    @pytest.mark.asyncio
    async def test_record_funnel_event_invalid_stage(self, client: AsyncClient, auth_headers: dict):
        """Should reject invalid funnel stages."""
        response = await client.post(
            "/api/v1/analytics/funnel/events",
            headers=auth_headers,
            json={"stage": "invalid_stage"},
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_record_funnel_event_unauthenticated(self, client: AsyncClient):
        """Should require authentication."""
        response = await client.post(
            "/api/v1/analytics/funnel/events",
            json={"stage": "viewed"},
        )
        assert response.status_code == 401


class TestFunnelMetrics:
    """GET /api/v1/analytics/funnel/metrics"""

    @pytest.mark.asyncio
    async def test_get_funnel_metrics(self, client: AsyncClient, auth_headers: dict):
        """Should return funnel metrics with stages."""
        response = await client.get(
            "/api/v1/analytics/funnel/metrics",
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert "total_events" in data
        assert "stages" in data
        assert isinstance(data["stages"], list)

    @pytest.mark.asyncio
    async def test_get_funnel_metrics_with_period(self, client: AsyncClient, auth_headers: dict):
        """Should accept custom period parameter."""
        response = await client.get(
            "/api/v1/analytics/funnel/metrics?period=7d",
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert response.json()["period"] == "7d"


class TestFunnelTimeline:
    """GET /api/v1/analytics/funnel/timeline"""

    @pytest.mark.asyncio
    async def test_get_funnel_timeline(self, client: AsyncClient, auth_headers: dict):
        """Should return timeline data for charts."""
        response = await client.get(
            "/api/v1/analytics/funnel/timeline",
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert "days" in data

    @pytest.mark.asyncio
    async def test_get_funnel_timeline_custom_days(self, client: AsyncClient, auth_headers: dict):
        """Should accept custom days parameter."""
        response = await client.get(
            "/api/v1/analytics/funnel/timeline?days=7",
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert response.json()["days"] == 7


# ── Market Intelligence Tests ─────────────────────────────────────


class TestMarketInsights:
    """GET/POST /api/v1/analytics/market/insights"""

    @pytest.mark.asyncio
    async def test_get_market_insights_empty(self, client: AsyncClient, auth_headers: dict):
        """Should return empty list when no insights exist."""
        response = await client.get(
            "/api/v1/analytics/market/insights",
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["count"] == 0
        assert data["insights"] == []

    @pytest.mark.asyncio
    async def test_generate_market_insight(self, client: AsyncClient, auth_headers: dict):
        """Should generate a new market insight."""
        response = await client.post(
            "/api/v1/analytics/market/insights/generate",
            headers=auth_headers,
            json={"insight_type": "skill_demand", "period": "30d"},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["insight_type"] == "skill_demand"
        assert data["period"] == "30d"
        assert data["data"] is not None
        assert data["id"] is not None

    @pytest.mark.asyncio
    async def test_generate_all_insight_types(self, client: AsyncClient, auth_headers: dict):
        """Should support all insight types."""
        insight_types = [
            "skill_demand", "salary_trend", "market_heat",
            "competition_level", "application_velocity",
        ]
        for itype in insight_types:
            response = await client.post(
                "/api/v1/analytics/market/insights/generate",
                headers=auth_headers,
                json={"insight_type": itype},
            )
            assert response.status_code == 201, f"Failed for type: {itype}"

    @pytest.mark.asyncio
    async def test_generate_insight_invalid_type(self, client: AsyncClient, auth_headers: dict):
        """Should reject invalid insight types."""
        response = await client.post(
            "/api/v1/analytics/market/insights/generate",
            headers=auth_headers,
            json={"insight_type": "invalid_type"},
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_insights_persist_after_generation(self, client: AsyncClient, auth_headers: dict):
        """Insights should be retrievable after generation."""
        # Generate
        await client.post(
            "/api/v1/analytics/market/insights/generate",
            headers=auth_headers,
            json={"insight_type": "market_heat", "period": "7d"},
        )
        # Retrieve
        response = await client.get(
            "/api/v1/analytics/market/insights",
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert response.json()["count"] >= 1


# ── CV A/B Experiment Tests ───────────────────────────────────────


class TestCVExperiments:
    """GET/POST/PATCH /api/v1/analytics/experiments"""

    @pytest.mark.asyncio
    async def test_list_experiments_empty(self, client: AsyncClient, auth_headers: dict):
        """Should return empty list when no experiments exist."""
        response = await client.get(
            "/api/v1/analytics/experiments",
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["count"] == 0
        assert data["experiments"] == []

    @pytest.mark.asyncio
    async def test_experiments_unauthenticated(self, client: AsyncClient):
        """Should require authentication for all experiment endpoints."""
        response = await client.get("/api/v1/analytics/experiments")
        assert response.status_code == 401

        response = await client.post(
            "/api/v1/analytics/experiments",
            json={
                "job_listing_id": "00000000-0000-0000-0000-000000000000",
                "variant_a_id": "00000000-0000-0000-0000-000000000000",
                "variant_b_id": "00000000-0000-0000-0000-000000000000",
            },
        )
        assert response.status_code == 401


# ── Integration Tests ─────────────────────────────────────────────


class TestAnalyticsIntegration:
    """Cross-feature integration tests."""

    @pytest.mark.asyncio
    async def test_funnel_then_metrics(self, client: AsyncClient, auth_headers: dict):
        """Recording funnel events should affect metrics."""
        # Record some events
        for stage in ["viewed", "viewed", "saved", "applied"]:
            await client.post(
                "/api/v1/analytics/funnel/events",
                headers=auth_headers,
                json={"stage": stage},
            )

        # Check metrics
        response = await client.get(
            "/api/v1/analytics/funnel/metrics",
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["total_events"] >= 4

    @pytest.mark.asyncio
    async def test_full_analytics_flow(self, client: AsyncClient, auth_headers: dict):
        """Complete analytics workflow: funnel → insights → metrics."""
        # 1. Record funnel events
        response = await client.post(
            "/api/v1/analytics/funnel/events",
            headers=auth_headers,
            json={"stage": "viewed", "metadata": {"job_title": "Senior Engineer"}},
        )
        assert response.status_code == 201

        # 2. Generate market insight
        response = await client.post(
            "/api/v1/analytics/market/insights/generate",
            headers=auth_headers,
            json={"insight_type": "application_velocity", "period": "30d"},
        )
        assert response.status_code == 201

        # 3. Get aggregated metrics
        response = await client.get(
            "/api/v1/analytics/funnel/metrics",
            headers=auth_headers,
        )
        assert response.status_code == 200

        # 4. Get timeline
        response = await client.get(
            "/api/v1/analytics/funnel/timeline?days=7",
            headers=auth_headers,
        )
        assert response.status_code == 200

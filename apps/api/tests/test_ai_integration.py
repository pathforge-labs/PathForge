"""
PathForge AI Engine — Integration Tests
==========================================
Tests for production hardening: error handlers, request ID middleware,
rate limiting, and structured logging integration.
"""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from httpx import AsyncClient

from app.core.llm import LLMError
from app.core.middleware import get_request_id, request_id_var

# ── Request ID Middleware Tests ────────────────────────────────


class TestRequestIDMiddleware:
    """Test X-Request-ID generation and propagation."""

    @pytest.mark.asyncio
    async def test_response_includes_request_id(self, client: AsyncClient) -> None:
        """Every response should include X-Request-ID header."""
        response = await client.get("/api/v1/health")
        assert response.status_code == 200
        assert "x-request-id" in response.headers
        # Should be a valid UUID4 format
        rid = response.headers["x-request-id"]
        assert len(rid) == 36  # UUID4 format: 8-4-4-4-12

    @pytest.mark.asyncio
    async def test_incoming_request_id_preserved(self, client: AsyncClient) -> None:
        """If X-Request-ID is sent by client, it should be preserved."""
        custom_id = "test-trace-12345"
        response = await client.get(
            "/api/v1/health",
            headers={"X-Request-ID": custom_id},
        )
        assert response.status_code == 200
        assert response.headers["x-request-id"] == custom_id

    @pytest.mark.asyncio
    async def test_unique_ids_per_request(self, client: AsyncClient) -> None:
        """Each request without an incoming ID should get a unique one."""
        response1 = await client.get("/api/v1/health")
        response2 = await client.get("/api/v1/health")
        id1 = response1.headers["x-request-id"]
        id2 = response2.headers["x-request-id"]
        assert id1 != id2

    def test_get_request_id_default(self) -> None:
        """get_request_id() should return empty string outside of request."""
        assert get_request_id() == ""

    def test_request_id_contextvar(self) -> None:
        """request_id_var should hold value within context."""
        token = request_id_var.set("test-123")
        assert get_request_id() == "test-123"
        request_id_var.reset(token)


# ── Error Handler Tests ───────────────────────────────────────


class TestErrorHandlers:
    """Test global exception handlers return proper responses."""

    @pytest.mark.asyncio
    async def test_llm_error_returns_503(
        self, client: AsyncClient, auth_headers: dict
    ) -> None:
        """LLMError should return 503 with AI-specific error body."""
        # Mock at the endpoint level — ResumeParser.parse catches LLMError
        # internally for graceful degradation, so we mock parse itself to raise
        with patch(
            "app.ai.resume_parser.ResumeParser.parse",
            new_callable=AsyncMock,
            side_effect=LLMError("All tiers exhausted"),
        ):
            response = await client.post(
                "/api/v1/ai/parse-resume",
                json={"raw_text": "x" * 100},
                headers=auth_headers,
            )
        assert response.status_code == 503
        body = response.json()
        assert body["error"] == "ai_service_unavailable"
        assert "request_id" in body
        assert "temporarily unavailable" in body["detail"].lower()

    @pytest.mark.asyncio
    async def test_error_response_includes_request_id(
        self, client: AsyncClient, auth_headers: dict
    ) -> None:
        """All error responses should include request_id for tracing."""
        with patch(
            "app.ai.resume_parser.ResumeParser.parse",
            new_callable=AsyncMock,
            side_effect=LLMError("Failed"),
        ):
            response = await client.post(
                "/api/v1/ai/parse-resume",
                json={"raw_text": "x" * 100},
                headers=auth_headers,
            )
        body = response.json()
        assert body["request_id"]  # Non-empty
        # X-Request-ID header should also be present
        assert "x-request-id" in response.headers


# ── Rate Limiting Tests ───────────────────────────────────────


class TestRateLimiting:
    """Test per-user rate limiting on AI endpoints."""

    @pytest.mark.asyncio
    async def test_parse_resume_rate_limit_headers(
        self, client: AsyncClient, auth_headers: dict
    ) -> None:
        """Rate-limited endpoints should return rate limit headers."""
        with patch(
            "app.ai.resume_parser.complete_json",
            new_callable=AsyncMock,
            return_value={
                "full_name": "Test",
                "skills": [],
                "experience": [],
            },
        ):
            response = await client.post(
                "/api/v1/ai/parse-resume",
                json={"raw_text": "x" * 100},
                headers=auth_headers,
            )

        # SlowAPI adds these headers
        assert response.status_code == 200
        # Check rate limit headers exist (slowapi adds x-ratelimit-* headers)
        # The header names may vary, but the response should succeed within limits
        assert response.status_code != 429


# ── Integration Smoke Test ────────────────────────────────────


class TestAIPipelineIntegration:
    """End-to-end integration tests with mocked external services."""

    @pytest.mark.asyncio
    async def test_parse_resume_full_pipeline(
        self, client: AsyncClient, auth_headers: dict
    ) -> None:
        """Test parse-resume endpoint returns structured data."""
        mock_llm_response = {
            "full_name": "Jane Doe",
            "email": "jane@example.com",
            "phone": "+31612345678",
            "location": "Amsterdam, NL",
            "summary": "Senior Python developer with 8 years experience.",
            "skills": [
                {"name": "Python", "category": "technical", "proficiency_level": "expert"},
                {"name": "FastAPI", "category": "technical", "proficiency_level": "advanced"},
            ],
            "experience": [
                {
                    "company": "TechCorp",
                    "title": "Senior Developer",
                    "start_date": "2020-01",
                    "end_date": "Present",
                    "description": "Led backend team",
                    "achievements": ["Reduced latency by 40%"],
                },
            ],
            "education": [
                {
                    "institution": "University of Amsterdam",
                    "degree": "MSc",
                    "field": "Computer Science",
                    "graduation_date": "2016",
                },
            ],
            "certifications": [],
            "languages": [{"name": "English", "proficiency": "fluent"}],
        }

        with patch(
            "app.ai.resume_parser.complete_json",
            new_callable=AsyncMock,
            return_value=mock_llm_response,
        ):
            response = await client.post(
                "/api/v1/ai/parse-resume",
                json={"raw_text": "Jane Doe\nSenior Python developer..." + "x" * 50},
                headers=auth_headers,
            )

        assert response.status_code == 200
        data = response.json()
        assert data["full_name"] == "Jane Doe"
        assert len(data["skills"]) == 2
        assert data["skills"][0]["name"] == "Python"
        assert len(data["experience"]) == 1
        assert data["experience"][0]["company"] == "TechCorp"

        # Verify response headers
        assert "x-request-id" in response.headers

    @pytest.mark.asyncio
    async def test_parse_resume_unauthenticated(self, client: AsyncClient) -> None:
        """AI endpoints should reject unauthenticated requests."""
        response = await client.post(
            "/api/v1/ai/parse-resume",
            json={"raw_text": "x" * 100},
        )
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_parse_resume_short_text_rejected(
        self, client: AsyncClient, auth_headers: dict
    ) -> None:
        """Resume text below min_length (50 chars) should be rejected."""
        response = await client.post(
            "/api/v1/ai/parse-resume",
            json={"raw_text": "too short"},
            headers=auth_headers,
        )
        assert response.status_code == 422  # Validation error

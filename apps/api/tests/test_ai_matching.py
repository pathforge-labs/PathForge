"""
PathForge AI Engine — Matching Pipeline Tests
================================================
Tests for semantic matching and LLM explanation generation.
All tests use mocked dependencies — no API keys or DB needed.
"""

from unittest.mock import AsyncMock, patch

import pytest

from app.ai.schemas import (
    MatchCandidate,
    MatchExplanation,
    ParsedExperience,
    ParsedResume,
    ParsedSkill,
)

# ── MatchCandidate Schema Tests ────────────────────────────────


class TestMatchCandidateSchema:
    """Test MatchCandidate Pydantic model validation."""

    def test_valid_candidate(self):
        """A valid match candidate should be created."""
        candidate = MatchCandidate(
            job_id="550e8400-e29b-41d4-a716-446655440000",
            score=0.85,
            title="Backend Engineer",
            company="TechCo",
        )
        assert candidate.score == 0.85
        assert candidate.title == "Backend Engineer"

    def test_score_bounds(self):
        """Scores at boundaries should be valid."""
        low = MatchCandidate(job_id="test-id", score=0.0)
        high = MatchCandidate(job_id="test-id", score=1.0)
        assert low.score == 0.0
        assert high.score == 1.0

    def test_score_out_of_bounds(self):
        """Scores outside 0-1 should fail validation."""
        with pytest.raises(ValueError):
            MatchCandidate(job_id="test-id", score=1.5)
        with pytest.raises(ValueError):
            MatchCandidate(job_id="test-id", score=-0.1)


# ── MatchExplanation Schema Tests ──────────────────────────────


class TestMatchExplanationSchema:
    """Test MatchExplanation Pydantic model validation."""

    def test_valid_explanation(self):
        """A fully populated explanation should validate."""
        explanation = MatchExplanation(
            overall_assessment="Strong match due to Python and backend experience.",
            strengths=["Strong Python skills", "Backend architecture"],
            gaps=["No AWS experience listed"],
            recommendation="strong_match",
        )
        assert explanation.recommendation == "strong_match"
        assert len(explanation.strengths) == 2
        assert len(explanation.gaps) == 1

    def test_minimal_explanation(self):
        """Minimal explanation with only required fields."""
        explanation = MatchExplanation(
            overall_assessment="Decent match.",
        )
        assert explanation.strengths == []
        assert explanation.recommendation == ""

    def test_explanation_from_dict(self):
        """Should validate from a raw dict (simulating LLM JSON output)."""
        data = {
            "overall_assessment": "Good fit for the role.",
            "strengths": ["Python", "FastAPI"],
            "gaps": ["Need Docker"],
            "recommendation": "good_match",
        }
        explanation = MatchExplanation.model_validate(data)
        assert explanation.overall_assessment == "Good fit for the role."


# ── explain_match Tests (with mocked LLM) ─────────────────────


MOCK_EXPLAIN_RESPONSE = {
    "overall_assessment": "Strong match for this senior backend role.",
    "strengths": [
        "Extensive Python experience matches requirements",
        "FastAPI expertise aligns with tech stack",
    ],
    "gaps": [
        "No Kubernetes experience mentioned",
    ],
    "recommendation": "strong_match",
}


class TestMatchExplain:
    """Test explain_match with mocked LLM calls."""

    @pytest.mark.asyncio
    async def test_explain_match_success(self):
        """Should return a validated MatchExplanation from LLM output."""
        with patch("app.ai.matching.complete_json", new_callable=AsyncMock) as mock_llm:
            mock_llm.return_value = MOCK_EXPLAIN_RESPONSE

            from app.ai.matching import MatchingService

            resume = ParsedResume(
                full_name="Test User",
                summary="Senior backend engineer.",
                skills=[
                    ParsedSkill(name="Python"),
                    ParsedSkill(name="FastAPI"),
                ],
                experience=[
                    ParsedExperience(company="TechCo", title="Senior Engineer"),
                ],
            )

            result = await MatchingService.explain_match(
                resume=resume,
                job_title="Senior Backend Engineer",
                job_company="StartupCo",
                job_description="Build scalable APIs with Python and FastAPI.",
            )

            assert isinstance(result, MatchExplanation)
            assert result.recommendation == "strong_match"
            assert len(result.strengths) == 2
            assert len(result.gaps) == 1
            mock_llm.assert_called_once()

    @pytest.mark.asyncio
    async def test_explain_match_prompt_content(self):
        """Should include resume and job details in the prompt."""
        with patch("app.ai.matching.complete_json", new_callable=AsyncMock) as mock_llm:
            mock_llm.return_value = MOCK_EXPLAIN_RESPONSE

            from app.ai.matching import MatchingService

            resume = ParsedResume(
                full_name="Jane Doe",
                summary="Data scientist.",
                skills=[ParsedSkill(name="Machine Learning")],
            )

            await MatchingService.explain_match(
                resume=resume,
                job_title="ML Engineer",
                job_company="DataCo",
                job_description="Build ML pipelines.",
            )

            # Verify the prompt was populated with our data
            call_args = mock_llm.call_args
            prompt = call_args.kwargs.get("prompt", "")
            assert "Jane Doe" in prompt
            assert "ML Engineer" in prompt
            assert "DataCo" in prompt

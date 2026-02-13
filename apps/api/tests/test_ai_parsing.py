"""
PathForge AI Engine — Resume Parsing Tests
=============================================
Tests for Pydantic schemas, prompt templates, and LLM parsing.
All tests use mocked LLM responses — no API keys needed.
"""

from unittest.mock import AsyncMock, patch

import pytest

from app.ai.prompts import (
    RESUME_PARSE_SYSTEM_PROMPT,
    RESUME_PARSE_USER_PROMPT,
    RESUME_PARSE_VERSION,
)
from app.ai.schemas import ParsedResume, ParsedSkill, ParsedExperience, ParsedEducation


# ── Schema Validation Tests ────────────────────────────────────


class TestParsedResumeSchema:
    """Test ParsedResume Pydantic model validation."""

    def test_minimal_valid_resume(self):
        """An empty resume should be valid (all fields optional or default)."""
        resume = ParsedResume()
        assert resume.full_name == ""
        assert resume.skills == []
        assert resume.experience == []

    def test_full_valid_resume(self):
        """A fully populated resume should validate."""
        resume = ParsedResume(
            full_name="John Doe",
            email="john@example.com",
            phone="+1-555-0100",
            location="San Francisco, CA",
            summary="Senior software engineer with 10 years experience.",
            skills=[
                ParsedSkill(name="Python", category="technical", proficiency_level="expert"),
                ParsedSkill(name="Leadership", category="soft", proficiency_level="advanced"),
            ],
            experience=[
                ParsedExperience(
                    company="Acme Corp",
                    title="Senior Engineer",
                    start_date="2020-01",
                    end_date="Present",
                    description="Led backend development",
                    achievements=["Reduced latency by 50%", "Mentored 5 engineers"],
                ),
            ],
            education=[
                ParsedEducation(
                    institution="MIT",
                    degree="BSc",
                    field="Computer Science",
                    graduation_date="2015",
                ),
            ],
        )
        assert resume.full_name == "John Doe"
        assert len(resume.skills) == 2
        assert resume.skills[0].name == "Python"
        assert len(resume.experience) == 1
        assert resume.experience[0].achievements[0] == "Reduced latency by 50%"

    def test_skill_defaults(self):
        """Skills should have sensible defaults."""
        skill = ParsedSkill(name="Python")
        assert skill.category == "general"
        assert skill.proficiency_level == "intermediate"

    def test_resume_from_dict(self):
        """Model should validate from a raw dict (simulating LLM JSON output)."""
        data = {
            "full_name": "Jane Smith",
            "email": "jane@test.com",
            "skills": [
                {"name": "React", "category": "technical", "proficiency_level": "advanced"},
            ],
            "experience": [
                {"company": "Tech Co", "title": "Frontend Dev"},
            ],
        }
        resume = ParsedResume.model_validate(data)
        assert resume.full_name == "Jane Smith"
        assert len(resume.skills) == 1
        assert resume.skills[0].name == "React"

    def test_extra_fields_ignored(self):
        """Extra fields from LLM output should be ignored, not cause errors."""
        data = {
            "full_name": "Test User",
            "some_unknown_field": "should be ignored",
            "skills": [],
        }
        resume = ParsedResume.model_validate(data)
        assert resume.full_name == "Test User"


# ── Prompt Template Tests ──────────────────────────────────────


class TestPromptTemplates:
    """Test prompt templates are well-formed."""

    def test_version_exists(self):
        """Prompt versions should be defined."""
        assert RESUME_PARSE_VERSION == "1.0.0"

    def test_system_prompt_not_empty(self):
        """System prompt should contain instructions."""
        assert len(RESUME_PARSE_SYSTEM_PROMPT) > 100
        assert "JSON" in RESUME_PARSE_SYSTEM_PROMPT

    def test_user_prompt_has_placeholder(self):
        """User prompt should have {resume_text} placeholder."""
        assert "{resume_text}" in RESUME_PARSE_USER_PROMPT

    def test_user_prompt_renders(self):
        """User prompt should render with sample data."""
        rendered = RESUME_PARSE_USER_PROMPT.format(
            resume_text="John Doe, Software Engineer at Acme"
        )
        assert "John Doe" in rendered
        assert "Acme" in rendered


# ── Resume Parser Tests (with mocked LLM) ─────────────────────


MOCK_LLM_RESPONSE = {
    "full_name": "Sarah Connor",
    "email": "sarah@skynet.com",
    "phone": "+1-555-9999",
    "location": "Los Angeles, CA",
    "summary": "Battle-hardened software engineer.",
    "skills": [
        {"name": "Python", "category": "technical", "proficiency_level": "expert"},
        {"name": "Leadership", "category": "soft", "proficiency_level": "advanced"},
    ],
    "experience": [
        {
            "company": "Cyberdyne Systems",
            "title": "Lead Engineer",
            "start_date": "2019-01",
            "end_date": "Present",
            "description": "Led AI defense systems.",
            "achievements": ["Prevented Skynet launch", "Built T-800 override"],
        },
    ],
    "education": [
        {
            "institution": "LA Tech",
            "degree": "BSc",
            "field": "Computer Science",
            "graduation_date": "2014",
        },
    ],
    "certifications": [],
    "languages": [{"name": "English", "proficiency": "native"}],
}


class TestResumeParser:
    """Test ResumeParser with mocked LLM calls."""

    @pytest.mark.asyncio
    async def test_parse_success(self):
        """Parser should return validated ParsedResume from LLM output."""
        with patch("app.ai.resume_parser.complete_json", new_callable=AsyncMock) as mock_llm:
            mock_llm.return_value = MOCK_LLM_RESPONSE

            from app.ai.resume_parser import ResumeParser

            result = await ResumeParser.parse("Sarah Connor's resume text here...")

            assert result.full_name == "Sarah Connor"
            assert len(result.skills) == 2
            assert result.skills[0].name == "Python"
            assert len(result.experience) == 1
            assert result.experience[0].company == "Cyberdyne Systems"
            mock_llm.assert_called_once()

    @pytest.mark.asyncio
    async def test_parse_empty_text(self):
        """Parser should return empty ParsedResume for empty input."""
        from app.ai.resume_parser import ResumeParser

        result = await ResumeParser.parse("")
        assert result.full_name == ""
        assert result.skills == []

    @pytest.mark.asyncio
    async def test_parse_llm_failure_graceful(self):
        """Parser should gracefully degrade when LLM fails."""
        with patch("app.ai.resume_parser.complete_json", new_callable=AsyncMock) as mock_llm:
            from app.core.llm import LLMError

            mock_llm.side_effect = LLMError("All tiers exhausted")

            from app.ai.resume_parser import ResumeParser

            result = await ResumeParser.parse("Some resume text that causes failure")

            # Should not raise, should return minimal result
            assert result.summary.startswith("Some resume text")
            assert result.skills == []

    @pytest.mark.asyncio
    async def test_parse_malformed_json_graceful(self):
        """Parser should handle malformed JSON from LLM gracefully."""
        with patch("app.ai.resume_parser.complete_json", new_callable=AsyncMock) as mock_llm:
            # Return malformed data that Pydantic can't validate
            mock_llm.side_effect = Exception("JSON decode error")

            from app.ai.resume_parser import ResumeParser

            result = await ResumeParser.parse("Resume text here")

            # Should not raise, should return minimal result
            assert isinstance(result, ParsedResume)

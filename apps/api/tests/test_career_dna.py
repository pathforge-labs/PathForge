"""
PathForge — Career DNA Tests
================================
Test suite for Career DNA™ API endpoints, service layer,
and model integrity.
"""

import uuid

import pytest
from httpx import AsyncClient

# ── Model Tests ────────────────────────────────────────────────


@pytest.mark.asyncio
async def test_career_dna_model_creation(db_session):
    """Test CareerDNA model can be created and linked to a user."""
    from app.core.security import hash_password
    from app.models.career_dna import CareerDNA
    from app.models.user import User

    user = User(
        email="dna@pathforge.eu",
        hashed_password=hash_password("TestPass123!"),
        full_name="DNA Test User",
    )
    db_session.add(user)
    await db_session.flush()

    career_dna = CareerDNA(user_id=user.id)
    db_session.add(career_dna)
    await db_session.flush()

    assert career_dna.id is not None
    assert career_dna.user_id == user.id
    assert career_dna.version == 1
    assert career_dna.completeness_score == 0.0


@pytest.mark.asyncio
async def test_skill_genome_entry_creation(db_session):
    """Test SkillGenomeEntry model can be created."""
    from app.core.security import hash_password
    from app.models.career_dna import CareerDNA, SkillGenomeEntry
    from app.models.user import User

    user = User(
        email="genome@pathforge.eu",
        hashed_password=hash_password("TestPass123!"),
        full_name="Genome User",
    )
    db_session.add(user)
    await db_session.flush()

    career_dna = CareerDNA(user_id=user.id)
    db_session.add(career_dna)
    await db_session.flush()

    entry = SkillGenomeEntry(
        career_dna_id=career_dna.id,
        skill_name="Python",
        category="technical",
        proficiency_level="expert",
        source="explicit",
        confidence=1.0,
        years_experience=5,
    )
    db_session.add(entry)
    await db_session.flush()

    assert entry.id is not None
    assert entry.skill_name == "Python"
    assert entry.confidence == 1.0


@pytest.mark.asyncio
async def test_hidden_skill_creation(db_session):
    """Test HiddenSkill model creation with evidence."""
    from app.core.security import hash_password
    from app.models.career_dna import CareerDNA, HiddenSkill
    from app.models.user import User

    user = User(
        email="hidden@pathforge.eu",
        hashed_password=hash_password("TestPass123!"),
        full_name="Hidden User",
    )
    db_session.add(user)
    await db_session.flush()

    career_dna = CareerDNA(user_id=user.id)
    db_session.add(career_dna)
    await db_session.flush()

    hidden = HiddenSkill(
        career_dna_id=career_dna.id,
        skill_name="Project Management",
        discovery_method="resume_inference",
        confidence=0.75,
        evidence={"reasoning": "Led cross-functional team of 8"},
        source_text="Led cross-functional team of 8 engineers",
    )
    db_session.add(hidden)
    await db_session.flush()

    assert hidden.id is not None
    assert hidden.confidence == 0.75
    assert hidden.user_confirmed is None


@pytest.mark.asyncio
async def test_experience_blueprint_creation(db_session):
    """Test ExperienceBlueprint model creation."""
    from app.core.security import hash_password
    from app.models.career_dna import CareerDNA, ExperienceBlueprint
    from app.models.user import User

    user = User(
        email="blueprint@pathforge.eu",
        hashed_password=hash_password("TestPass123!"),
        full_name="Blueprint User",
    )
    db_session.add(user)
    await db_session.flush()

    career_dna = CareerDNA(user_id=user.id)
    db_session.add(career_dna)
    await db_session.flush()

    blueprint = ExperienceBlueprint(
        career_dna_id=career_dna.id,
        total_years=8.5,
        role_count=4,
        avg_tenure_months=25.5,
        career_direction="ascending",
        industry_diversity=0.6,
    )
    db_session.add(blueprint)
    await db_session.flush()

    assert blueprint.career_direction == "ascending"
    assert blueprint.total_years == 8.5


@pytest.mark.asyncio
async def test_growth_vector_creation(db_session):
    """Test GrowthVector model creation."""
    from app.core.security import hash_password
    from app.models.career_dna import CareerDNA, GrowthVector
    from app.models.user import User

    user = User(
        email="growth@pathforge.eu",
        hashed_password=hash_password("TestPass123!"),
        full_name="Growth User",
    )
    db_session.add(user)
    await db_session.flush()

    career_dna = CareerDNA(user_id=user.id)
    db_session.add(career_dna)
    await db_session.flush()

    vector = GrowthVector(
        career_dna_id=career_dna.id,
        current_trajectory="accelerating",
        growth_score=78.5,
        skill_velocity={"Python": 3, "Rust": 5, "Java": -2},
        analysis_reasoning="Strong upward trajectory in emerging technologies.",
    )
    db_session.add(vector)
    await db_session.flush()

    assert vector.current_trajectory == "accelerating"
    assert vector.growth_score == 78.5


@pytest.mark.asyncio
async def test_values_profile_creation(db_session):
    """Test ValuesProfile model creation."""
    from app.core.security import hash_password
    from app.models.career_dna import CareerDNA, ValuesProfile
    from app.models.user import User

    user = User(
        email="values@pathforge.eu",
        hashed_password=hash_password("TestPass123!"),
        full_name="Values User",
    )
    db_session.add(user)
    await db_session.flush()

    career_dna = CareerDNA(user_id=user.id)
    db_session.add(career_dna)
    await db_session.flush()

    profile = ValuesProfile(
        career_dna_id=career_dna.id,
        work_style="autonomous",
        impact_preference="organizational",
        derived_values={
            "autonomy": 0.9,
            "growth": 0.8,
            "creativity": 0.7,
        },
        confidence=0.75,
    )
    db_session.add(profile)
    await db_session.flush()

    assert profile.work_style == "autonomous"
    assert profile.confidence == 0.75


@pytest.mark.asyncio
async def test_market_position_creation(db_session):
    """Test MarketPosition model creation."""
    from app.core.security import hash_password
    from app.models.career_dna import CareerDNA, MarketPosition
    from app.models.user import User

    user = User(
        email="market@pathforge.eu",
        hashed_password=hash_password("TestPass123!"),
        full_name="Market User",
    )
    db_session.add(user)
    await db_session.flush()

    career_dna = CareerDNA(user_id=user.id)
    db_session.add(career_dna)
    await db_session.flush()

    position = MarketPosition(
        career_dna_id=career_dna.id,
        percentile_overall=72.5,
        matching_job_count=45,
        market_trend="rising",
        skill_demand_scores={"Python": 0.85, "FastAPI": 0.72},
    )
    db_session.add(position)
    await db_session.flush()

    assert position.percentile_overall == 72.5
    assert position.market_trend == "rising"


# ── AI Analyzer Unit Tests ─────────────────────────────────────


class TestMarketPositionAnalyzer:
    """Tests for the data-driven market position computation."""

    def test_compute_market_position_basic(self):
        """Test market position with matching skills."""
        from app.ai.career_dna_analyzer import CareerDNAAnalyzer

        skills = ["Python", "FastAPI"]
        listings = [
            {"title": "Python Developer", "description": "We need Python and Django"},
            {"title": "Backend Engineer", "description": "FastAPI experience required"},
            {"title": "Frontend Dev", "description": "React and TypeScript"},
        ]

        result = CareerDNAAnalyzer.compute_market_position(skills, listings)

        assert result["matching_job_count"] == 2
        assert result["percentile_overall"] > 0
        assert "Python" in result["skill_demand_scores"]
        assert "FastAPI" in result["skill_demand_scores"]

    def test_compute_market_position_no_matches(self):
        """Test market position with no matching skills."""
        from app.ai.career_dna_analyzer import CareerDNAAnalyzer

        skills = ["COBOL"]
        listings = [
            {"title": "Python Dev", "description": "Python required"},
        ]

        result = CareerDNAAnalyzer.compute_market_position(skills, listings)

        assert result["matching_job_count"] == 0
        assert result["skill_demand_scores"]["COBOL"] == 0.0

    def test_compute_market_position_empty_inputs(self):
        """Test market position with empty inputs returns defaults."""
        from app.ai.career_dna_analyzer import CareerDNAAnalyzer

        result = CareerDNAAnalyzer.compute_market_position([], [])

        assert result["matching_job_count"] == 0
        assert result["market_trend"] == "stable"

    def test_compute_market_position_trend_rising(self):
        """Test rising trend when most skills are in demand."""
        from app.ai.career_dna_analyzer import CareerDNAAnalyzer

        skills = ["Python", "FastAPI"]
        listings = [
            {"title": "Dev", "description": "Python FastAPI"},
            {"title": "Dev", "description": "Python FastAPI expert"},
            {"title": "Dev", "description": "Python backend"},
        ]

        result = CareerDNAAnalyzer.compute_market_position(skills, listings)

        assert result["market_trend"] == "rising"


# ── Service Layer Tests ────────────────────────────────────────


@pytest.mark.asyncio
async def test_service_get_or_create_new(db_session):
    """Test creating a new Career DNA profile via service."""
    from app.core.security import hash_password
    from app.models.user import User
    from app.services.career_dna_service import CareerDNAService

    user = User(
        email="service_new@pathforge.eu",
        hashed_password=hash_password("TestPass123!"),
        full_name="Service New User",
    )
    db_session.add(user)
    await db_session.flush()

    career_dna = await CareerDNAService.get_or_create(
        db_session, user_id=user.id
    )

    assert career_dna is not None
    assert career_dna.user_id == user.id
    assert career_dna.version == 1


@pytest.mark.asyncio
async def test_service_get_or_create_existing(db_session):
    """Test getting existing Career DNA profile via service."""
    from app.core.security import hash_password
    from app.models.user import User
    from app.services.career_dna_service import CareerDNAService

    user = User(
        email="service_existing@pathforge.eu",
        hashed_password=hash_password("TestPass123!"),
        full_name="Service Existing User",
    )
    db_session.add(user)
    await db_session.flush()

    # Create first
    first = await CareerDNAService.get_or_create(db_session, user_id=user.id)
    # Get again — should return same
    second = await CareerDNAService.get_or_create(db_session, user_id=user.id)

    assert first.id == second.id


@pytest.mark.asyncio
async def test_service_delete_profile(db_session):
    """Test deleting Career DNA profile (GDPR erasure)."""
    from app.core.security import hash_password
    from app.models.user import User
    from app.services.career_dna_service import CareerDNAService

    user = User(
        email="service_delete@pathforge.eu",
        hashed_password=hash_password("TestPass123!"),
        full_name="Service Delete User",
    )
    db_session.add(user)
    await db_session.flush()

    await CareerDNAService.get_or_create(db_session, user_id=user.id)
    deleted = await CareerDNAService.delete_profile(
        db_session, user_id=user.id
    )

    assert deleted is True

    profile = await CareerDNAService.get_full_profile(
        db_session, user_id=user.id
    )
    assert profile is None


@pytest.mark.asyncio
async def test_service_delete_nonexistent(db_session):
    """Test deleting non-existent profile returns False."""
    from app.services.career_dna_service import CareerDNAService

    deleted = await CareerDNAService.delete_profile(
        db_session, user_id=uuid.uuid4()
    )
    assert deleted is False


@pytest.mark.asyncio
async def test_service_confirm_hidden_skill(db_session):
    """Test confirming a hidden skill."""
    from app.core.security import hash_password
    from app.models.career_dna import CareerDNA, HiddenSkill
    from app.models.user import User
    from app.services.career_dna_service import CareerDNAService

    user = User(
        email="confirm@pathforge.eu",
        hashed_password=hash_password("TestPass123!"),
        full_name="Confirm User",
    )
    db_session.add(user)
    await db_session.flush()

    career_dna = CareerDNA(user_id=user.id)
    db_session.add(career_dna)
    await db_session.flush()

    hidden = HiddenSkill(
        career_dna_id=career_dna.id,
        skill_name="Leadership",
        discovery_method="resume_inference",
        confidence=0.7,
    )
    db_session.add(hidden)
    await db_session.flush()

    result = await CareerDNAService.confirm_hidden_skill(
        db_session,
        user_id=user.id,
        skill_id=hidden.id,
        confirmed=True,
    )

    assert result is not None
    assert result.user_confirmed is True


# ── API Endpoint Tests ─────────────────────────────────────────


@pytest.mark.asyncio
async def test_get_career_dna_not_found(client: AsyncClient, auth_headers: dict):
    """Test GET /career-dna returns 404 when no profile exists."""
    response = await client.get("/api/v1/career-dna", headers=auth_headers)
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_career_dna_summary_not_found(
    client: AsyncClient, auth_headers: dict
):
    """Test GET /career-dna/summary returns 404 when no profile exists."""
    response = await client.get(
        "/api/v1/career-dna/summary", headers=auth_headers
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_career_dna_not_found(
    client: AsyncClient, auth_headers: dict
):
    """Test DELETE /career-dna returns 404 when no profile exists."""
    response = await client.delete(
        "/api/v1/career-dna", headers=auth_headers
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_skill_genome_not_found(
    client: AsyncClient, auth_headers: dict
):
    """Test GET /career-dna/skills returns 404 when no profile exists."""
    response = await client.get(
        "/api/v1/career-dna/skills", headers=auth_headers
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_career_dna_unauthenticated(client: AsyncClient):
    """Test Career DNA endpoints require authentication."""
    response = await client.get("/api/v1/career-dna")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_completeness_calculation():
    """Test _calculate_completeness returns correct percentages."""
    from types import SimpleNamespace

    from app.services.career_dna_service import _calculate_completeness

    # No dimensions
    career_dna = SimpleNamespace(
        skill_genome=[],
        experience_blueprint=None,
        growth_vector=None,
        values_profile=None,
        market_position=None,
    )
    assert _calculate_completeness(career_dna) == 0.0

    # All dimensions present
    career_dna_full = SimpleNamespace(
        skill_genome=["something"],
        experience_blueprint="present",
        growth_vector="present",
        values_profile="present",
        market_position="present",
    )
    assert _calculate_completeness(career_dna_full) == 100.0

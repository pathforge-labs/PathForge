"""
PathForge — Career Threat Radar™ Tests
==========================================
Test suite for:
    - Threat Radar model creation (6 entities)
    - ONET data loader functions
    - CRS™ computation (5-factor weighted formula)
    - Career Moat Score (4-dimension)
    - Skills Shield™ classification fallback
    - API endpoint auth gates
"""

import uuid

import pytest
from httpx import AsyncClient


# ── Model Tests ────────────────────────────────────────────────


@pytest.mark.asyncio
async def test_automation_risk_model_creation(db_session):
    """Test AutomationRisk model can be created."""
    from app.core.security import hash_password
    from app.models.career_dna import CareerDNA
    from app.models.threat_radar import AutomationRisk
    from app.models.user import User

    user = User(
        email="risk@threatradar.test",
        hashed_password=hash_password("TestPass123!"),
        full_name="Risk User",
    )
    db_session.add(user)
    await db_session.flush()

    career_dna = CareerDNA(user_id=user.id)
    db_session.add(career_dna)
    await db_session.flush()

    risk = AutomationRisk(
        career_dna_id=career_dna.id,
        onet_soc_code="15-1252.00",
        onet_occupation_title="Software Developers",
        base_automation_probability=0.042,
        contextual_risk_score=15.5,
        risk_level="low",
    )
    db_session.add(risk)
    await db_session.flush()

    assert risk.id is not None
    assert risk.onet_soc_code == "15-1252.00"
    assert risk.base_automation_probability == 0.042
    assert risk.contextual_risk_score == 15.5


@pytest.mark.asyncio
async def test_industry_trend_model_creation(db_session):
    """Test IndustryTrend model can be created."""
    from app.core.security import hash_password
    from app.models.career_dna import CareerDNA
    from app.models.threat_radar import IndustryTrend
    from app.models.user import User

    user = User(
        email="trend@threatradar.test",
        hashed_password=hash_password("TestPass123!"),
        full_name="Trend User",
    )
    db_session.add(user)
    await db_session.flush()

    career_dna = CareerDNA(user_id=user.id)
    db_session.add(career_dna)
    await db_session.flush()

    trend = IndustryTrend(
        career_dna_id=career_dna.id,
        industry_name="Technology",
        trend_direction="growing",
        confidence=0.75,
    )
    db_session.add(trend)
    await db_session.flush()

    assert trend.id is not None
    assert trend.industry_name == "Technology"
    assert trend.trend_direction == "growing"
    assert trend.confidence == 0.75


@pytest.mark.asyncio
async def test_skill_shield_entry_model_creation(db_session):
    """Test SkillShieldEntry model can be created."""
    from app.core.security import hash_password
    from app.models.career_dna import CareerDNA
    from app.models.threat_radar import SkillShieldEntry
    from app.models.user import User

    user = User(
        email="shield@threatradar.test",
        hashed_password=hash_password("TestPass123!"),
        full_name="Shield User",
    )
    db_session.add(user)
    await db_session.flush()

    career_dna = CareerDNA(user_id=user.id)
    db_session.add(career_dna)
    await db_session.flush()

    entry = SkillShieldEntry(
        career_dna_id=career_dna.id,
        skill_name="System Design",
        classification="shield",
        automation_resistance=0.92,
        market_demand_trend="growing",
        reasoning="High creative intelligence required",
    )
    db_session.add(entry)
    await db_session.flush()

    assert entry.id is not None
    assert entry.classification == "shield"
    assert entry.automation_resistance == 0.92


@pytest.mark.asyncio
async def test_career_resilience_snapshot_creation(db_session):
    """Test CareerResilienceSnapshot with CRS + Moat Score."""
    from app.core.security import hash_password
    from app.models.career_dna import CareerDNA
    from app.models.threat_radar import CareerResilienceSnapshot
    from app.models.user import User

    user = User(
        email="crs@threatradar.test",
        hashed_password=hash_password("TestPass123!"),
        full_name="CRS User",
    )
    db_session.add(user)
    await db_session.flush()

    career_dna = CareerDNA(user_id=user.id)
    db_session.add(career_dna)
    await db_session.flush()

    snapshot = CareerResilienceSnapshot(
        career_dna_id=career_dna.id,
        overall_score=72.5,
        skill_diversity_index=80.0,
        automation_resistance=85.0,
        growth_velocity=65.0,
        industry_stability=60.0,
        adaptability_signal=70.0,
        moat_score=68.5,
        moat_strength="narrow",
        explanation="Strong technical foundation with growth room.",
    )
    db_session.add(snapshot)
    await db_session.flush()

    assert snapshot.id is not None
    assert snapshot.overall_score == 72.5
    assert snapshot.moat_strength == "narrow"


@pytest.mark.asyncio
async def test_threat_alert_model_creation(db_session):
    """Test ThreatAlert with mandatory opportunity field."""
    from app.core.security import hash_password
    from app.models.career_dna import CareerDNA
    from app.models.threat_radar import ThreatAlert
    from app.models.user import User

    user = User(
        email="alert@threatradar.test",
        hashed_password=hash_password("TestPass123!"),
        full_name="Alert User",
    )
    db_session.add(user)
    await db_session.flush()

    career_dna = CareerDNA(user_id=user.id)
    db_session.add(career_dna)
    await db_session.flush()

    alert = ThreatAlert(
        career_dna_id=career_dna.id,
        category="automation_risk",
        severity="medium",
        title="Growing AI adoption in your area",
        description="LLM coding assistants are changing development.",
        opportunity="Specialize in AI-augmented development workflows.",
    )
    db_session.add(alert)
    await db_session.flush()

    assert alert.id is not None
    assert alert.opportunity != ""
    assert alert.status == "unread"


@pytest.mark.asyncio
async def test_alert_preference_model_creation(db_session):
    """Test AlertPreference defaults."""
    from app.core.security import hash_password
    from app.models.career_dna import CareerDNA
    from app.models.threat_radar import AlertPreference
    from app.models.user import User

    user = User(
        email="pref@threatradar.test",
        hashed_password=hash_password("TestPass123!"),
        full_name="Pref User",
    )
    db_session.add(user)
    await db_session.flush()

    career_dna = CareerDNA(user_id=user.id)
    db_session.add(career_dna)
    await db_session.flush()

    pref = AlertPreference(career_dna_id=career_dna.id)
    db_session.add(pref)
    await db_session.flush()

    assert pref.id is not None
    assert pref.min_severity == "low"


# ── ONET Data Loader Tests ────────────────────────────────────


def test_onet_loader_get_by_soc():
    """Test ONET lookup by SOC code."""
    from app.data.onet_loader import get_occupation_by_soc

    result = get_occupation_by_soc("15-1252.00")
    assert result is not None
    assert result["soc_code"] == "15-1252.00"
    assert "Software" in result["title"]
    assert 0.0 <= result["automation_probability"] <= 1.0


def test_onet_loader_get_by_soc_missing():
    """Test ONET lookup for non-existent SOC code returns None."""
    from app.data.onet_loader import get_occupation_by_soc

    result = get_occupation_by_soc("99-9999.99")
    assert result is None


def test_onet_loader_search_by_title():
    """Test ONET title search with fuzzy matching."""
    from app.data.onet_loader import search_occupations_by_title

    results = search_occupations_by_title("software", max_results=5)
    assert len(results) >= 1
    assert any("Software" in occ["title"] for occ in results)


def test_onet_loader_categories():
    """Test ONET category listing."""
    from app.data.onet_loader import get_all_categories

    categories = get_all_categories()
    assert len(categories) >= 5
    assert "technology" in categories


def test_onet_loader_bottleneck_average():
    """Test bottleneck average computation."""
    from app.data.onet_loader import compute_bottleneck_average

    scores = {
        "perception_manipulation": 0.30,
        "creative_intelligence": 0.60,
        "social_intelligence": 0.90,
    }
    avg = compute_bottleneck_average(scores)
    assert abs(avg - 0.60) < 0.01


# ── CRS Computation Tests ─────────────────────────────────────


def test_crs_computation_high_resilience():
    """Test CRS formula with high-resilience inputs."""
    from unittest.mock import MagicMock

    from app.services.threat_radar_service import _compute_crs

    # Mock career_dna with 20 skills and growth vector
    career_dna = MagicMock()
    career_dna.skill_genome = [MagicMock() for _ in range(20)]
    growth_mock = MagicMock()
    growth_mock.growth_score = 85.0
    career_dna.growth_vector = [growth_mock]

    result = _compute_crs(
        risk_data={"contextual_risk_score": 10.0},
        trend_data={"trend_direction": "growing"},
        shield_data=[
            {"classification": "shield"} for _ in range(15)
        ] + [
            {"classification": "exposure"} for _ in range(5)
        ],
        career_dna=career_dna,
    )

    assert result["overall_score"] > 70.0
    assert result["skill_diversity_index"] == 100.0  # 20 x 5 = 100
    assert result["automation_resistance"] == 90.0    # 100 - 10
    assert result["growth_velocity"] == 85.0
    assert result["industry_stability"] == 85.0       # growing
    assert result["adaptability_signal"] == 75.0      # 15/20 x 100


def test_crs_computation_low_resilience():
    """Test CRS formula with low-resilience inputs."""
    from unittest.mock import MagicMock

    from app.services.threat_radar_service import _compute_crs

    career_dna = MagicMock()
    career_dna.skill_genome = [MagicMock() for _ in range(3)]
    career_dna.growth_vector = []

    result = _compute_crs(
        risk_data={"contextual_risk_score": 85.0},
        trend_data={"trend_direction": "declining"},
        shield_data=[
            {"classification": "exposure"} for _ in range(3)
        ],
        career_dna=career_dna,
    )

    assert result["overall_score"] < 30.0
    assert result["skill_diversity_index"] == 15.0  # 3 x 5
    assert result["automation_resistance"] == 15.0   # 100 - 85
    assert result["growth_velocity"] == 50.0         # default
    assert result["industry_stability"] == 25.0      # declining
    assert result["adaptability_signal"] == 0.0      # 0 shields


# ── Moat Score Tests ───────────────────────────────────────────


def test_moat_score_wide():
    """Test Moat Score classification — WIDE moat."""
    from unittest.mock import MagicMock

    from app.services.threat_radar_service import _compute_moat_score

    career_dna = MagicMock()
    blueprint = MagicMock()
    blueprint.total_years = 15
    blueprint.industry_diversity = 0.8
    career_dna.experience_blueprint = [blueprint]
    career_dna.skill_genome = [MagicMock() for _ in range(25)]

    result = _compute_moat_score(
        shield_data=[
            {"classification": "shield"} for _ in range(20)
        ] + [
            {"classification": "neutral"} for _ in range(5)
        ],
        career_dna=career_dna,
    )

    assert result["moat_score"] >= 75.0
    assert result["moat_strength"] == "wide"


def test_moat_score_none():
    """Test Moat Score classification — NONE moat."""
    from unittest.mock import MagicMock

    from app.services.threat_radar_service import _compute_moat_score

    career_dna = MagicMock()
    career_dna.experience_blueprint = []
    career_dna.skill_genome = [MagicMock() for _ in range(2)]

    result = _compute_moat_score(
        shield_data=[
            {"classification": "exposure"} for _ in range(2)
        ],
        career_dna=career_dna,
    )

    assert result["moat_score"] < 40.0
    assert result["moat_strength"] == "none"


# ── Skills Shield™ Fallback Tests ──────────────────────────────


def test_shield_fallback_high_bottleneck():
    """Test deterministic fallback classifies as SHIELD."""
    from app.ai.threat_radar_analyzer import _default_shield_classifications

    occupation = {
        "soc_code": "15-1252.00",
        "title": "Software Developers",
        "automation_probability": 0.042,
        "bottleneck_scores": {
            "perception_manipulation": 0.70,
            "creative_intelligence": 0.80,
            "social_intelligence": 0.50,
        },
        "category": "Computer and Mathematical",
    }

    results = _default_shield_classifications(
        ["Python", "System Design"], occupation,
    )

    assert len(results) == 2
    assert all(entry["classification"] == "shield" for entry in results)


def test_shield_fallback_low_bottleneck():
    """Test deterministic fallback classifies as EXPOSURE."""
    from app.ai.threat_radar_analyzer import _default_shield_classifications

    occupation = {
        "soc_code": "43-9021.00",
        "title": "Data Entry Keyers",
        "automation_probability": 0.99,
        "bottleneck_scores": {
            "perception_manipulation": 0.20,
            "creative_intelligence": 0.10,
            "social_intelligence": 0.20,
        },
        "category": "Office and Administrative Support",
    }

    results = _default_shield_classifications(
        ["Data Entry", "Typing"], occupation,
    )

    assert len(results) == 2
    assert all(entry["classification"] == "exposure" for entry in results)


# ── API Endpoint Tests ─────────────────────────────────────────


@pytest.mark.asyncio
async def test_threat_radar_overview_requires_auth(client: AsyncClient):
    """Overview endpoint returns 401 without auth."""
    response = await client.get("/api/v1/threat-radar")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_threat_radar_scan_requires_auth(client: AsyncClient):
    """Scan endpoint returns 401 without auth."""
    response = await client.post(
        "/api/v1/threat-radar/scan?soc_code=15-1252.00&industry_name=Technology",
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_threat_radar_alerts_requires_auth(client: AsyncClient):
    """Alerts endpoint returns 401 without auth."""
    response = await client.get("/api/v1/threat-radar/alerts")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_threat_radar_overview_empty(
    client: AsyncClient, auth_headers: dict,
):
    """Overview returns empty state for user with no scan data."""
    response = await client.get(
        "/api/v1/threat-radar",
        headers=auth_headers,
    )
    # Should return 200 with empty overview (no threat data yet)
    assert response.status_code == 200
    data = response.json()
    assert data["total_unread_alerts"] == 0


@pytest.mark.asyncio
async def test_threat_radar_alerts_empty(
    client: AsyncClient, auth_headers: dict,
):
    """Alerts returns empty list for new user."""
    response = await client.get(
        "/api/v1/threat-radar/alerts",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["alerts"] == []


@pytest.mark.asyncio
async def test_threat_radar_preferences_empty(
    client: AsyncClient, auth_headers: dict,
):
    """Preferences returns null before setup."""
    response = await client.get(
        "/api/v1/threat-radar/preferences",
        headers=auth_headers,
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_threat_radar_skills_shield_empty(
    client: AsyncClient, auth_headers: dict,
):
    """Skills Shield returns empty matrix for new user."""
    response = await client.get(
        "/api/v1/threat-radar/skills-shield",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_skills"] == 0


@pytest.mark.asyncio
async def test_threat_radar_resilience_empty(
    client: AsyncClient, auth_headers: dict,
):
    """Resilience returns null for new user."""
    response = await client.get(
        "/api/v1/threat-radar/resilience",
        headers=auth_headers,
    )
    assert response.status_code == 200

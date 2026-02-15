"""
PathForge API — Test Configuration
====================================
Async test fixtures for FastAPI endpoint testing.

Uses SQLite (in-memory) for fast isolated tests.
Registers custom type compilers to handle PostgreSQL-specific
column types (ARRAY, Vector, JSON) that don't exist in SQLite.
"""

import asyncio
from collections.abc import AsyncGenerator

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import event, String, Text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.security import create_access_token


# ── SQLite ↔ PostgreSQL Type Compatibility ────────────────────
#
# We need to register compilation hooks BEFORE importing models,
# so that when Base.metadata.create_all runs, the types are known.

from sqlalchemy.ext.compiler import compiles
from sqlalchemy.dialects.postgresql import ARRAY, JSON

# pgvector's Vector type
from pgvector.sqlalchemy import Vector


# ARRAY → TEXT (SQLite stores serialized representation)
@compiles(ARRAY, "sqlite")
def _compile_array_sqlite(type_, compiler, **kw):
    return "TEXT"


# Vector → TEXT
@compiles(Vector, "sqlite")
def _compile_vector_sqlite(type_, compiler, **kw):
    return "TEXT"


# JSON → TEXT
@compiles(JSON, "sqlite")
def _compile_json_sqlite(type_, compiler, **kw):
    return "TEXT"


# ── Now import models (which triggers Base.metadata population) ──
from app.models.base import Base
from app.models import (
    User, Resume, Skill, Preference, BlacklistEntry, JobListing, MatchResult,
    Application, CVVersion, FunnelEvent, MarketInsight, CVExperiment,
    CareerDNA, SkillGenomeEntry, HiddenSkill, ExperienceBlueprint,
    GrowthVector, ValuesProfile, MarketPosition,
    AutomationRisk, IndustryTrend, SkillShieldEntry,
    CareerResilienceSnapshot, ThreatAlert, AlertPreference,
)


# ── Test Database ─────────────────────────────────────────────

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def event_loop():
    """Create an event loop for the test session."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def test_engine():
    """Create a test database engine with all tables."""
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()


@pytest.fixture
async def db_session(test_engine) -> AsyncGenerator[AsyncSession, None]:
    """Provide a transactional session that rolls back after each test."""
    # Use a connection-level transaction so each test is isolated
    async with test_engine.connect() as conn:
        transaction = await conn.begin()

        # Use a nested savepoint so session.commit() doesn't
        # finalize the outer transaction (avoids SAWarning)
        nested = await conn.begin_nested()

        session = AsyncSession(bind=conn, expire_on_commit=False)

        # Restart nested savepoint after each session commit
        @event.listens_for(session.sync_session, "after_transaction_end")
        def _restart_nested(session_sync, transaction_sync):
            nonlocal nested
            if not nested.is_active:
                nested = conn.sync_connection.begin_nested()

        yield session

        await session.close()
        await transaction.rollback()


@pytest.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Provide an async HTTP client wired to the test database."""
    from app.core.database import get_db
    from app.main import app

    async def _override_get_db() -> AsyncGenerator[AsyncSession, None]:
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://testserver",
    ) as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest.fixture
async def registered_user(client: AsyncClient) -> dict:
    """Register a test user and return their data."""
    payload = {
        "email": "test@pathforge.eu",
        "password": "TestPass123!",
        "full_name": "Test User",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    return {**response.json(), "password": payload["password"]}


@pytest.fixture
async def auth_headers(client: AsyncClient, registered_user: dict) -> dict:
    """Login and return authorization headers."""
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": registered_user["email"],
            "password": registered_user["password"],
        },
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

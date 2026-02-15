"""
PathForge API — Application & Blacklist Endpoint Tests
========================================================
Tests for /api/v1/applications and /api/v1/blacklist.
Covers CRUD, blacklist enforcement, rate limits, and state transitions.
"""

import uuid

import pytest
from httpx import AsyncClient

# ── Helpers ────────────────────────────────────────────────────


async def _create_job(db_session, **overrides) -> str:
    """Insert a job listing directly into the DB and return its UUID string."""
    from app.models.matching import JobListing

    job = JobListing(
        title=overrides.get("title", "Senior Engineer"),
        company=overrides.get("company", "TechCorp"),
        description=overrides.get("description", "A great job listing for testing."),
        location=overrides.get("location", "Amsterdam"),
        source_url=overrides.get("source_url", "https://example.com/job/1"),
        source_platform=overrides.get("source_platform", "test"),
    )
    db_session.add(job)
    await db_session.flush()
    return str(job.id)


# ── Blacklist CRUD ─────────────────────────────────────────────


@pytest.mark.asyncio
async def test_add_to_blacklist(client: AsyncClient, auth_headers: dict):
    """POST /api/v1/blacklist adds a company."""
    response = await client.post(
        "/api/v1/blacklist",
        json={"company_name": "EvilCorp", "reason": "Bad culture"},
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["company_name"] == "EvilCorp"
    assert data["reason"] == "Bad culture"
    assert data["is_current_employer"] is False


@pytest.mark.asyncio
async def test_add_duplicate_blacklist(client: AsyncClient, auth_headers: dict):
    """POST /api/v1/blacklist with duplicate company returns 409."""
    payload = {"company_name": "DupeCorp"}
    await client.post("/api/v1/blacklist", json=payload, headers=auth_headers)
    response = await client.post("/api/v1/blacklist", json=payload, headers=auth_headers)
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_list_blacklist(client: AsyncClient, auth_headers: dict):
    """GET /api/v1/blacklist returns user's entries."""
    await client.post(
        "/api/v1/blacklist",
        json={"company_name": "ListTestCorp"},
        headers=auth_headers,
    )
    response = await client.get("/api/v1/blacklist", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert any(e["company_name"] == "ListTestCorp" for e in data["items"])


@pytest.mark.asyncio
async def test_delete_blacklist(client: AsyncClient, auth_headers: dict):
    """DELETE /api/v1/blacklist/{id} removes entry."""
    create = await client.post(
        "/api/v1/blacklist",
        json={"company_name": "DeleteMeCorp"},
        headers=auth_headers,
    )
    entry_id = create.json()["id"]

    response = await client.delete(f"/api/v1/blacklist/{entry_id}", headers=auth_headers)
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_delete_blacklist_not_found(client: AsyncClient, auth_headers: dict):
    """DELETE /api/v1/blacklist/{id} with invalid ID returns 404."""
    fake_id = str(uuid.uuid4())
    response = await client.delete(f"/api/v1/blacklist/{fake_id}", headers=auth_headers)
    assert response.status_code == 404


# ── Application CRUD ──────────────────────────────────────────


@pytest.mark.asyncio
async def test_create_application(client: AsyncClient, auth_headers: dict, db_session):
    """POST /api/v1/applications creates a 'saved' application."""
    job_id = await _create_job(db_session)

    response = await client.post(
        "/api/v1/applications",
        json={"job_listing_id": job_id},
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "saved"
    assert data["job_listing_id"] == job_id


@pytest.mark.asyncio
async def test_list_applications(client: AsyncClient, auth_headers: dict, db_session):
    """GET /api/v1/applications returns user's applications."""
    job_id = await _create_job(db_session, title="List Test Job", company="ListCo")
    await client.post(
        "/api/v1/applications",
        json={"job_listing_id": job_id},
        headers=auth_headers,
    )
    response = await client.get("/api/v1/applications", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1


@pytest.mark.asyncio
async def test_get_application(client: AsyncClient, auth_headers: dict, db_session):
    """GET /api/v1/applications/{id} returns a specific application."""
    job_id = await _create_job(db_session, title="Get Test Job", company="GetCo")
    create = await client.post(
        "/api/v1/applications",
        json={"job_listing_id": job_id},
        headers=auth_headers,
    )
    app_id = create.json()["id"]

    response = await client.get(f"/api/v1/applications/{app_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == app_id


@pytest.mark.asyncio
async def test_get_application_not_found(client: AsyncClient, auth_headers: dict):
    """GET /api/v1/applications/{id} with invalid ID returns 404."""
    fake_id = str(uuid.uuid4())
    response = await client.get(f"/api/v1/applications/{fake_id}", headers=auth_headers)
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_application(client: AsyncClient, auth_headers: dict, db_session):
    """DELETE /api/v1/applications/{id} removes application."""
    job_id = await _create_job(db_session, title="Delete Job", company="DeleteCo")
    create = await client.post(
        "/api/v1/applications",
        json={"job_listing_id": job_id},
        headers=auth_headers,
    )
    app_id = create.json()["id"]

    response = await client.delete(f"/api/v1/applications/{app_id}", headers=auth_headers)
    assert response.status_code == 204


# ── Status Transitions ────────────────────────────────────────


@pytest.mark.asyncio
async def test_valid_status_transition(client: AsyncClient, auth_headers: dict, db_session):
    """PATCH /api/v1/applications/{id}/status with valid transition succeeds."""
    job_id = await _create_job(db_session, title="Transition Job", company="TransCo")
    create = await client.post(
        "/api/v1/applications",
        json={"job_listing_id": job_id},
        headers=auth_headers,
    )
    app_id = create.json()["id"]

    # saved → applied
    response = await client.patch(
        f"/api/v1/applications/{app_id}/status",
        json={"status": "applied"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["status"] == "applied"


@pytest.mark.asyncio
async def test_invalid_status_transition(client: AsyncClient, auth_headers: dict, db_session):
    """PATCH /api/v1/applications/{id}/status with invalid transition returns 422."""
    job_id = await _create_job(db_session, title="Invalid Trans Job", company="InvalidCo")
    create = await client.post(
        "/api/v1/applications",
        json={"job_listing_id": job_id},
        headers=auth_headers,
    )
    app_id = create.json()["id"]

    # saved → offered (skipping applied + interviewing — invalid!)
    response = await client.patch(
        f"/api/v1/applications/{app_id}/status",
        json={"status": "offered"},
        headers=auth_headers,
    )
    assert response.status_code == 422
    assert "Cannot transition" in response.json()["detail"]


@pytest.mark.asyncio
async def test_withdraw_application(client: AsyncClient, auth_headers: dict, db_session):
    """PATCH to 'withdrawn' from 'saved' is valid."""
    job_id = await _create_job(db_session, title="Withdraw Job", company="WithdrawCo")
    create = await client.post(
        "/api/v1/applications",
        json={"job_listing_id": job_id},
        headers=auth_headers,
    )
    app_id = create.json()["id"]

    response = await client.patch(
        f"/api/v1/applications/{app_id}/status",
        json={"status": "withdrawn"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["status"] == "withdrawn"


# ── Blacklist Enforcement ─────────────────────────────────────


@pytest.mark.asyncio
async def test_blacklist_blocks_application(
    client: AsyncClient, auth_headers: dict, db_session,
):
    """POST /api/v1/applications to blacklisted company returns 403."""
    # Blacklist company
    await client.post(
        "/api/v1/blacklist",
        json={"company_name": "BlockedCorp"},
        headers=auth_headers,
    )

    # Try to apply
    job_id = await _create_job(db_session, title="Blocked Job", company="BlockedCorp")
    response = await client.post(
        "/api/v1/applications",
        json={"job_listing_id": job_id},
        headers=auth_headers,
    )
    assert response.status_code == 403
    assert "blacklist" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_blacklist_case_insensitive(
    client: AsyncClient, auth_headers: dict, db_session,
):
    """Blacklist check is case-insensitive."""
    await client.post(
        "/api/v1/blacklist",
        json={"company_name": "CaseTestCorp"},
        headers=auth_headers,
    )

    job_id = await _create_job(db_session, title="Case Job", company="casetestcorp")
    response = await client.post(
        "/api/v1/applications",
        json={"job_listing_id": job_id},
        headers=auth_headers,
    )
    assert response.status_code == 403


# ── Auth Required ─────────────────────────────────────────────


@pytest.mark.asyncio
async def test_applications_require_auth(client: AsyncClient):
    """GET /api/v1/applications without auth returns 401."""
    response = await client.get("/api/v1/applications")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_blacklist_requires_auth(client: AsyncClient):
    """GET /api/v1/blacklist without auth returns 401."""
    response = await client.get("/api/v1/blacklist")
    assert response.status_code == 401


# ── Filter by Status ──────────────────────────────────────────


@pytest.mark.asyncio
async def test_filter_applications_by_status(
    client: AsyncClient, auth_headers: dict, db_session,
):
    """GET /api/v1/applications?status=saved filters correctly."""
    job_id = await _create_job(db_session, title="Filter Job", company="FilterCo")
    await client.post(
        "/api/v1/applications",
        json={"job_listing_id": job_id},
        headers=auth_headers,
    )
    response = await client.get(
        "/api/v1/applications?status=saved", headers=auth_headers,
    )
    assert response.status_code == 200
    for item in response.json()["items"]:
        assert item["status"] == "saved"

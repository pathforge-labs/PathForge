"""
PathForge API — Auth Endpoint Tests
=====================================
Tests for /api/v1/auth (register, login, refresh).
"""

import pytest
from httpx import AsyncClient


# ── Registration ────────────────────────────────────────────────


@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    """POST /api/v1/auth/register creates a user and returns 201."""
    payload = {
        "email": "newuser@pathforge.eu",
        "password": "SecurePass123!",
        "full_name": "New User",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201

    data = response.json()
    assert data["email"] == payload["email"]
    assert data["full_name"] == payload["full_name"]
    assert data["is_active"] is True
    assert data["is_verified"] is False
    assert "id" in data
    assert "created_at" in data


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient, registered_user: dict):
    """POST /api/v1/auth/register with existing email returns 409."""
    payload = {
        "email": registered_user["email"],
        "password": "AnotherPass456!",
        "full_name": "Duplicate User",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"]


@pytest.mark.asyncio
async def test_register_short_password(client: AsyncClient):
    """POST /api/v1/auth/register with short password returns 422."""
    payload = {
        "email": "short@pathforge.eu",
        "password": "123",
        "full_name": "Short Pass",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_register_invalid_email(client: AsyncClient):
    """POST /api/v1/auth/register with invalid email returns 422."""
    payload = {
        "email": "not-an-email",
        "password": "SecurePass123!",
        "full_name": "Bad Email",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422


# ── Login ───────────────────────────────────────────────────────


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, registered_user: dict):
    """POST /api/v1/auth/login with valid credentials returns tokens."""
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": registered_user["email"],
            "password": registered_user["password"],
        },
    )
    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient, registered_user: dict):
    """POST /api/v1/auth/login with wrong password returns 401."""
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": registered_user["email"],
            "password": "WrongPassword!",
        },
    )
    assert response.status_code == 401
    assert "Incorrect" in response.json()["detail"]


@pytest.mark.asyncio
async def test_login_nonexistent_user(client: AsyncClient):
    """POST /api/v1/auth/login with unknown email returns 401."""
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "nobody@pathforge.eu",
            "password": "SomePass123!",
        },
    )
    assert response.status_code == 401


# ── Token Refresh ───────────────────────────────────────────────


@pytest.mark.asyncio
async def test_refresh_token_success(client: AsyncClient, registered_user: dict):
    """POST /api/v1/auth/refresh with valid refresh token returns new tokens."""
    # First, login to get tokens
    login_response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": registered_user["email"],
            "password": registered_user["password"],
        },
    )
    refresh_token = login_response.json()["refresh_token"]

    # Then refresh
    response = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


@pytest.mark.asyncio
async def test_refresh_token_invalid(client: AsyncClient):
    """POST /api/v1/auth/refresh with invalid token returns 401."""
    response = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": "invalid.token.here"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_refresh_with_access_token(client: AsyncClient, registered_user: dict):
    """POST /api/v1/auth/refresh with an access token (not refresh) returns 401."""
    # Login to get access token
    login_response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": registered_user["email"],
            "password": registered_user["password"],
        },
    )
    access_token = login_response.json()["access_token"]

    # Try to use access token as refresh token
    response = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": access_token},
    )
    assert response.status_code == 401

"""
PathForge API — User Endpoint Tests
=====================================
Tests for /api/v1/users (protected profile endpoints).
"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_me_authenticated(
    client: AsyncClient, auth_headers: dict, registered_user: dict
):
    """GET /api/v1/users/me with valid token returns user profile."""
    response = await client.get("/api/v1/users/me", headers=auth_headers)
    assert response.status_code == 200

    data = response.json()
    assert data["email"] == registered_user["email"]
    assert data["full_name"] == registered_user["full_name"]
    assert data["is_active"] is True


@pytest.mark.asyncio
async def test_get_me_unauthorized(client: AsyncClient):
    """GET /api/v1/users/me without token returns 401."""
    response = await client.get("/api/v1/users/me")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_me_invalid_token(client: AsyncClient):
    """GET /api/v1/users/me with invalid token returns 401."""
    headers = {"Authorization": "Bearer invalid.token.here"}
    response = await client.get("/api/v1/users/me", headers=headers)
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_update_me_full_name(
    client: AsyncClient, auth_headers: dict
):
    """PATCH /api/v1/users/me updates user's full name."""
    response = await client.patch(
        "/api/v1/users/me",
        headers=auth_headers,
        json={"full_name": "Updated Name"},
    )
    assert response.status_code == 200
    assert response.json()["full_name"] == "Updated Name"


@pytest.mark.asyncio
async def test_update_me_avatar(
    client: AsyncClient, auth_headers: dict
):
    """PATCH /api/v1/users/me updates avatar URL."""
    response = await client.patch(
        "/api/v1/users/me",
        headers=auth_headers,
        json={"avatar_url": "https://example.com/avatar.png"},
    )
    assert response.status_code == 200
    assert response.json()["avatar_url"] == "https://example.com/avatar.png"


@pytest.mark.asyncio
async def test_update_me_unauthorized(client: AsyncClient):
    """PATCH /api/v1/users/me without token returns 401."""
    response = await client.patch(
        "/api/v1/users/me",
        json={"full_name": "Hacker"},
    )
    assert response.status_code == 401

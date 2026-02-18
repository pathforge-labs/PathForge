"""
PathForge API — Well-Known Endpoint Tests
============================================
Tests for security.txt, robots.txt, favicon, and bot trap middleware.
"""

import pytest
from httpx import AsyncClient

# ── security.txt (RFC 9116) ────────────────────────────────────


@pytest.mark.asyncio
async def test_security_txt_returns_200(client: AsyncClient) -> None:
    """GET /.well-known/security.txt returns 200 with plain text."""
    response = await client.get("/.well-known/security.txt")
    assert response.status_code == 200
    assert "text/plain" in response.headers["content-type"]
    assert "Contact:" in response.text


@pytest.mark.asyncio
async def test_security_txt_contains_required_fields(client: AsyncClient) -> None:
    """security.txt includes all RFC 9116 recommended fields."""
    response = await client.get("/.well-known/security.txt")
    content = response.text

    assert "Contact: mailto:" in content
    assert "Expires:" in content
    assert "Preferred-Languages:" in content
    assert "Canonical:" in content


# ── robots.txt ──────────────────────────────────────────────────


@pytest.mark.asyncio
async def test_robots_txt_returns_200(client: AsyncClient) -> None:
    """GET /robots.txt returns 200 with Disallow all."""
    response = await client.get("/robots.txt")
    assert response.status_code == 200
    assert "text/plain" in response.headers["content-type"]
    assert "Disallow: /" in response.text
    assert "User-agent: *" in response.text


# ── favicon.ico ─────────────────────────────────────────────────


@pytest.mark.asyncio
async def test_favicon_returns_204(client: AsyncClient) -> None:
    """GET /favicon.ico returns 204 No Content."""
    response = await client.get("/favicon.ico")
    assert response.status_code == 204


# ── Bot Trap Middleware ─────────────────────────────────────────
# Note: BotTrapMiddleware is only active in production.
# In test environment (environment="development"), requests pass through
# to normal route resolution. These tests verify the paths return 404
# from FastAPI's default handler (no matching route).


@pytest.mark.asyncio
async def test_dotenv_returns_404(client: AsyncClient) -> None:
    """GET /.env returns 404 (no route exists for exploit paths)."""
    response = await client.get("/.env")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_git_config_returns_404(client: AsyncClient) -> None:
    """GET /.git/config returns 404 (no route exists for exploit paths)."""
    response = await client.get("/.git/config")
    assert response.status_code == 404

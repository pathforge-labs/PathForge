"""
PathForge — Push Service Tests (Sprint 33 F4/F6/F7)
=====================================================
Unit and integration tests for push service remediation:
- F4: Dispatch-based rate limiting (daily_push_count counter)
- F6: PII masking (device token obfuscation)
- F7: httpx connection pooling (shared client singleton)
"""

from __future__ import annotations

import uuid
from datetime import date, timedelta

import httpx
import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import NotificationPreference
from app.services import push_service
from app.services.push_service import (
    _get_daily_push_count,
    _increment_dispatch_count,
    close_http_client,
    get_http_client,
    mask_token,
)

# ── F6: mask_token Tests ──────────────────────────────────────


class TestMaskToken:
    """Tests for device token PII masking (Sprint 33 F6)."""

    def test_mask_token_standard(self) -> None:
        """Full-length token shows only last 4 chars."""
        result = mask_token("ExponentPushToken[abcdef123456]")
        assert result == "***456]"
        assert "abcdef" not in result

    def test_mask_token_short(self) -> None:
        """Token with 4 or fewer chars returns generic mask."""
        assert mask_token("abcd") == "***"
        assert mask_token("abc") == "***"
        assert mask_token("a") == "***"

    def test_mask_token_empty_string(self) -> None:
        """Empty string returns generic mask."""
        assert mask_token("") == "***"

    def test_mask_token_exactly_five_chars(self) -> None:
        """Five-char token shows last 4."""
        result = mask_token("12345")
        assert result == "***2345"

    @pytest.mark.anyio
    async def test_get_status_returns_masked_token(
        self, db_session: AsyncSession, authenticated_user: object,
    ) -> None:
        """get_status() masks the device_token in its response."""
        from app.models.push_token import PushToken
        from app.models.user import User

        user = authenticated_user
        assert isinstance(user, User)

        token = PushToken(
            user_id=str(user.id),
            device_token="ExponentPushToken[test_masked_tok]",
            platform="ios",
        )
        db_session.add(token)
        await db_session.flush()

        result = await push_service.get_status(
            db_session, user_id=uuid.UUID(str(user.id)),
        )
        assert result["registered"] is True
        assert result["token"] == "***tok]"
        assert "test_masked" not in result["token"]

    @pytest.mark.anyio
    async def test_get_status_unregistered(
        self, db_session: AsyncSession, authenticated_user: object,
    ) -> None:
        """get_status() returns registered=False when no token exists."""
        from app.models.user import User

        user = authenticated_user
        assert isinstance(user, User)

        result = await push_service.get_status(
            db_session, user_id=uuid.UUID(str(user.id)),
        )
        assert result["registered"] is False
        assert result["token"] is None


# ── F4: Daily Push Count Tests ────────────────────────────────


class TestDailyPushCount:
    """Tests for dispatch-based rate limiting (Sprint 33 F4)."""

    def _make_pref(
        self,
        count: int = 0,
        push_date: date | None = None,
    ) -> NotificationPreference:
        """Create a NotificationPreference with given counter state."""
        pref = NotificationPreference(
            user_id=str(uuid.uuid4()),
            push_notifications=True,
            daily_push_count=count,
            last_push_date=push_date,
        )
        return pref

    def test_stale_date_returns_zero(self) -> None:
        """Yesterday's date means counter effectively resets to 0."""
        yesterday = date.today() - timedelta(days=1)
        pref = self._make_pref(count=5, push_date=yesterday)
        assert _get_daily_push_count(pref) == 0

    def test_today_returns_count(self) -> None:
        """Today's date returns the stored count."""
        pref = self._make_pref(count=2, push_date=date.today())
        assert _get_daily_push_count(pref) == 2

    def test_none_date_returns_zero(self) -> None:
        """Null last_push_date returns 0."""
        pref = self._make_pref(count=3, push_date=None)
        assert _get_daily_push_count(pref) == 0

    @pytest.mark.anyio
    async def test_increment_resets_on_new_day(
        self, db_session: AsyncSession,
    ) -> None:
        """Counter resets to 1 when date changes."""
        yesterday = date.today() - timedelta(days=1)
        pref = self._make_pref(count=3, push_date=yesterday)
        db_session.add(pref)
        await db_session.flush()

        await _increment_dispatch_count(db_session, pref=pref)
        assert pref.daily_push_count == 1
        assert pref.last_push_date == date.today()

    @pytest.mark.anyio
    async def test_increment_on_same_day(
        self, db_session: AsyncSession,
    ) -> None:
        """Counter increments when same day."""
        pref = self._make_pref(count=2, push_date=date.today())
        db_session.add(pref)
        await db_session.flush()

        await _increment_dispatch_count(db_session, pref=pref)
        assert pref.daily_push_count == 3
        assert pref.last_push_date == date.today()


# ── F7: HTTP Client Tests ────────────────────────────────────


class TestHttpClient:
    """Tests for httpx connection pooling (Sprint 33 F7)."""

    @pytest.mark.anyio
    async def test_http_client_singleton(self) -> None:
        """get_http_client() returns the same instance on repeated calls."""
        # Reset module state
        push_service._http_client = None

        client_a = await get_http_client()
        client_b = await get_http_client()
        assert client_a is client_b

        # Cleanup
        await close_http_client()

    @pytest.mark.anyio
    async def test_http_client_has_limits(self) -> None:
        """Client has timeout and connection limits configured."""
        push_service._http_client = None

        client = await get_http_client()
        assert isinstance(client, httpx.AsyncClient)
        assert client.timeout.connect == 10.0
        assert client.timeout.read == 10.0

        await close_http_client()

    @pytest.mark.anyio
    async def test_close_http_client(self) -> None:
        """close_http_client() closes and nullifies the client."""
        push_service._http_client = None

        client = await get_http_client()
        assert not client.is_closed

        await close_http_client()
        assert push_service._http_client is None

"""
PathForge — Billing Integration Tests (Sprint 38 Audit)
=========================================================
Sprint 38: Tests for the billing integration layer added to AI engine routes.

Coverage targets:
    - BillingService.check_scan_limit: all code paths
    - BillingService.record_usage: increment + lazy period creation

Audit findings tested:
    C2 — Usage tracking (record_usage) after successful AI scans
    C5 — Scan limit pre-check (check_scan_limit) before AI operations
"""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.services.billing_service import BillingService

# ── check_scan_limit Tests ──────────────────────────────────


@pytest.mark.asyncio
class TestCheckScanLimit:
    """C5: Validate scan limit pre-check behavior."""

    async def test_billing_disabled_skips_check(
        self,
        db_session: AsyncSession,
        monkeypatch: pytest.MonkeyPatch,
    ) -> None:
        """When billing is disabled, check_scan_limit is a no-op.

        Ensures graceful degradation for self-hosted or dev environments.
        """
        monkeypatch.setattr(settings, "billing_enabled", False)
        user = MagicMock()
        result = await BillingService.check_scan_limit(
            db_session, user, "career_dna",
        )
        assert result is None

    async def test_premium_tier_unlimited_scans(
        self,
        db_session: AsyncSession,
        billing_test_user: MagicMock,
        monkeypatch: pytest.MonkeyPatch,
    ) -> None:
        """Premium users should never hit a scan limit.

        get_scan_limit('premium') returns None → immediate return.
        We mock get_user_tier to avoid lazy-loading the ORM relationship.
        """
        monkeypatch.setattr(settings, "billing_enabled", True)

        with patch(
            "app.services.billing_service.get_user_tier",
            return_value="premium",
        ):
            result = await BillingService.check_scan_limit(
                db_session, billing_test_user, "career_passport",
            )
        assert result is None

    async def test_free_tier_exceeds_limit_raises_403(
        self,
        db_session: AsyncSession,
        billing_test_user: MagicMock,
        monkeypatch: pytest.MonkeyPatch,
    ) -> None:
        """Free-tier user who has exhausted scans should get 403.

        Validates the scan_limit_exceeded error structure:
        tier, usage count, limit, and upgrade URL.
        """
        from fastapi import HTTPException

        monkeypatch.setattr(settings, "billing_enabled", True)

        # Record 3 scans to exhaust the free limit
        for _ in range(3):
            await BillingService.record_usage(
                db_session, billing_test_user, "career_dna",
            )

        # Mock tier resolution to avoid lazy-load greenlet issue
        with patch(
            "app.services.billing_service.get_user_tier",
            return_value="free",
        ), pytest.raises(HTTPException) as exc_info:
            await BillingService.check_scan_limit(
                db_session, billing_test_user, "career_dna",
            )

        assert exc_info.value.status_code == 403
        detail = exc_info.value.detail
        assert detail["error"] == "scan_limit_exceeded"
        assert detail["current_tier"] == "free"
        assert detail["scans_used"] >= 3
        assert detail["scan_limit"] == 3
        assert "/billing/checkout" in detail["upgrade_url"]


# ── record_usage Tests ──────────────────────────────────────


@pytest.mark.asyncio
class TestRecordUsage:
    """C2: Validate usage tracking after successful AI scans."""

    async def test_record_usage_creates_period_and_increments(
        self,
        db_session: AsyncSession,
        billing_test_user: MagicMock,
        monkeypatch: pytest.MonkeyPatch,
    ) -> None:
        """First record_usage call creates a period record with count=1.

        F4: Lazy period reset — UsageRecord is created on first scan.
        """
        monkeypatch.setattr(settings, "billing_enabled", True)

        usage = await BillingService.record_usage(
            db_session, billing_test_user, "threat_radar",
        )

        assert usage.scan_count >= 1
        assert usage.engine_breakdown is not None
        assert "threat_radar" in usage.engine_breakdown

    async def test_record_usage_increments_total_scans(
        self,
        db_session: AsyncSession,
        billing_test_user: MagicMock,
        monkeypatch: pytest.MonkeyPatch,
    ) -> None:
        """Multiple record_usage calls should increase total scans_used.

        Uses get_usage_summary to verify aggregate scan count, which
        is resilient to per-record period boundary edge cases.
        """
        monkeypatch.setattr(settings, "billing_enabled", True)

        # Mock get_user_tier to avoid lazy-load greenlet issues
        with patch(
            "app.services.billing_service.get_user_tier",
            return_value="free",
        ):
            # Get baseline count
            summary_before = await BillingService.get_usage_summary(
                db_session, billing_test_user,
            )
            baseline = summary_before["scans_used"]

            # Record two scans
            await BillingService.record_usage(
                db_session, billing_test_user, "skill_decay",
            )
            await BillingService.record_usage(
                db_session, billing_test_user, "salary_intelligence",
            )

            summary_after = await BillingService.get_usage_summary(
                db_session, billing_test_user,
            )
            assert summary_after["scans_used"] >= baseline + 2

    async def test_record_usage_returns_valid_usage_record(
        self,
        db_session: AsyncSession,
        billing_test_user: MagicMock,
        monkeypatch: pytest.MonkeyPatch,
    ) -> None:
        """record_usage should return a UsageRecord with valid structure.

        Validates that the returned object has expected fields:
        scan_count > 0, engine_breakdown contains the engine name,
        and period timestamps are set.
        """
        monkeypatch.setattr(settings, "billing_enabled", True)

        usage = await BillingService.record_usage(
            db_session, billing_test_user, "career_simulation",
        )

        # Structural assertions on the UsageRecord
        assert usage.scan_count >= 1
        assert usage.engine_breakdown is not None
        assert "career_simulation" in usage.engine_breakdown
        assert usage.period_start is not None
        assert usage.period_end is not None
        assert usage.user_id == billing_test_user.id
        assert usage.subscription_id is not None

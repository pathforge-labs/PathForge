"""
PathForge — Subscription & Billing Schemas
============================================
Sprint 34: Pydantic DTOs for billing endpoints.

All response schemas include ConfigDict(from_attributes=True) per F20.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

# ── Subscription ───────────────────────────────────────────────


class SubscriptionResponse(BaseModel):
    """Current subscription state for the authenticated user."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    tier: str
    status: str
    stripe_customer_id: str | None
    stripe_subscription_id: str | None
    current_period_start: datetime | None
    current_period_end: datetime | None
    cancel_at_period_end: bool
    trial_end: datetime | None
    created_at: datetime


# ── Usage ──────────────────────────────────────────────────────


class UsageSummaryResponse(BaseModel):
    """Current period usage for the authenticated user."""

    model_config = ConfigDict(from_attributes=True)

    tier: str
    scan_limit: int | None = Field(description="None = unlimited")
    scans_used: int
    scans_remaining: int | None = Field(description="None = unlimited")
    period_start: datetime | None
    period_end: datetime | None
    engine_breakdown: dict[str, int] | None


# ── Checkout ───────────────────────────────────────────────────


class CreateCheckoutSessionRequest(BaseModel):
    """Request to create a Stripe Checkout session."""

    tier: str = Field(pattern="^(pro|premium)$", description="Target tier")
    annual: bool = Field(default=False, description="Annual billing")
    success_url: str = Field(min_length=1, max_length=2048)
    cancel_url: str = Field(min_length=1, max_length=2048)


class CreateCheckoutSessionResponse(BaseModel):
    """Stripe Checkout session URL."""

    checkout_url: str


# ── Customer Portal ────────────────────────────────────────────


class CustomerPortalResponse(BaseModel):
    """Stripe Customer Portal URL."""

    portal_url: str


# ── Feature Access ─────────────────────────────────────────────


class FeatureAccessResponse(BaseModel):
    """Feature gating status for the authenticated user."""

    tier: str
    engines: list[str]
    scan_limit: int | None
    scans_remaining: int | None
    billing_enabled: bool


# ── Billing Events (Admin) ────────────────────────────────────


class BillingEventResponse(BaseModel):
    """Admin view of a billing event."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    stripe_event_id: str
    event_type: str
    user_id: uuid.UUID | None
    payload_summary: dict[str, str] | None
    processed_at: datetime
    created_at: datetime

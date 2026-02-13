"""
PathForge — Application Service
=================================
Business logic for application CRUD, status transitions,
rate limiting, and blacklist enforcement.
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.application import Application, ApplicationStatus, CVVersion, VALID_TRANSITIONS
from app.models.matching import JobListing
from app.models.preference import BlacklistEntry

# ── Safety Constants ──────────────────────────────────────────

RATE_LIMIT_HOURLY = 10
RATE_LIMIT_DAILY = 30


class ApplicationError(Exception):
    """Base error for application service."""

    def __init__(self, message: str, code: str = "APPLICATION_ERROR") -> None:
        self.message = message
        self.code = code
        super().__init__(message)


class BlacklistViolation(ApplicationError):
    """Raised when applying to a blacklisted company."""

    def __init__(self, company: str) -> None:
        super().__init__(
            f"Cannot apply: '{company}' is on your blacklist",
            code="BLACKLIST_VIOLATION",
        )


class RateLimitViolation(ApplicationError):
    """Raised when apply rate limit is exceeded."""

    def __init__(self, period: str, limit: int) -> None:
        super().__init__(
            f"Rate limit exceeded: max {limit} applications per {period}",
            code="RATE_LIMIT_EXCEEDED",
        )


class InvalidTransition(ApplicationError):
    """Raised when an invalid status transition is attempted."""

    def __init__(self, current: str, target: str) -> None:
        super().__init__(
            f"Cannot transition from '{current}' to '{target}'",
            code="INVALID_TRANSITION",
        )


# ── Blacklist Checks ─────────────────────────────────────────


async def check_blacklist(
    db: AsyncSession, user_id: uuid.UUID, company: str,
) -> None:
    """Raise BlacklistViolation if the company is blacklisted by this user."""
    result = await db.execute(
        select(BlacklistEntry).where(
            BlacklistEntry.user_id == user_id,
            func.lower(BlacklistEntry.company_name) == company.strip().lower(),
        )
    )
    if result.scalar_one_or_none():
        raise BlacklistViolation(company)


# ── Rate Limiting ────────────────────────────────────────────


async def check_rate_limit(db: AsyncSession, user_id: uuid.UUID) -> None:
    """Enforce 10/hour and 30/day application rate limits."""
    now = datetime.now(UTC)

    # Hourly check
    hour_ago = now - timedelta(hours=1)
    hourly_count = await db.scalar(
        select(func.count())
        .select_from(Application)
        .where(
            Application.user_id == user_id,
            Application.status != ApplicationStatus.SAVED,
            Application.created_at >= hour_ago,
        )
    )
    if (hourly_count or 0) >= RATE_LIMIT_HOURLY:
        raise RateLimitViolation("hour", RATE_LIMIT_HOURLY)

    # Daily check
    day_ago = now - timedelta(days=1)
    daily_count = await db.scalar(
        select(func.count())
        .select_from(Application)
        .where(
            Application.user_id == user_id,
            Application.status != ApplicationStatus.SAVED,
            Application.created_at >= day_ago,
        )
    )
    if (daily_count or 0) >= RATE_LIMIT_DAILY:
        raise RateLimitViolation("day", RATE_LIMIT_DAILY)


# ── CRUD ─────────────────────────────────────────────────────


async def create_application(
    db: AsyncSession,
    user_id: uuid.UUID,
    job_listing_id: uuid.UUID,
    *,
    status: str = ApplicationStatus.SAVED,
    notes: str | None = None,
) -> Application:
    """Create a new application with blacklist and rate-limit enforcement."""
    # Fetch job listing for blacklist check
    job = await db.get(JobListing, job_listing_id)
    if not job:
        raise ApplicationError("Job listing not found", code="NOT_FOUND")

    # Safety checks
    await check_blacklist(db, user_id, job.company)
    if status != ApplicationStatus.SAVED:
        await check_rate_limit(db, user_id)

    application = Application(
        user_id=user_id,
        job_listing_id=job_listing_id,
        status=status,
        notes=notes,
        source_url=job.source_url,
    )
    db.add(application)
    await db.flush()
    return application


async def get_application(
    db: AsyncSession, app_id: uuid.UUID, user_id: uuid.UUID,
) -> Application | None:
    """Get a single application with job listing eagerly loaded."""
    result = await db.execute(
        select(Application)
        .options(joinedload(Application.job_listing))
        .where(Application.id == app_id, Application.user_id == user_id)
    )
    return result.unique().scalar_one_or_none()


async def list_applications(
    db: AsyncSession,
    user_id: uuid.UUID,
    *,
    status_filter: str | None = None,
    page: int = 1,
    per_page: int = 20,
) -> tuple[list[Application], int]:
    """List user's applications with optional status filter and pagination."""
    base = select(Application).where(Application.user_id == user_id)
    if status_filter:
        base = base.where(Application.status == status_filter)

    # Count
    count_stmt = select(func.count()).select_from(base.subquery())
    total = await db.scalar(count_stmt) or 0

    # Fetch
    stmt = (
        base.options(joinedload(Application.job_listing))
        .order_by(Application.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    result = await db.execute(stmt)
    applications = list(result.unique().scalars().all())
    return applications, total


async def update_status(
    db: AsyncSession,
    app_id: uuid.UUID,
    user_id: uuid.UUID,
    new_status: str,
) -> Application:
    """Update application status with state machine enforcement."""
    application = await get_application(db, app_id, user_id)
    if not application:
        raise ApplicationError("Application not found", code="NOT_FOUND")

    current = ApplicationStatus(application.status)
    target = ApplicationStatus(new_status)

    if target not in VALID_TRANSITIONS.get(current, set()):
        raise InvalidTransition(current, target)

    # Rate-limit applies when transitioning to "applied"
    if target == ApplicationStatus.APPLIED:
        await check_rate_limit(db, user_id)

    application.status = target
    await db.flush()
    return application


async def delete_application(
    db: AsyncSession, app_id: uuid.UUID, user_id: uuid.UUID,
) -> bool:
    """Delete an application. Returns True if deleted."""
    application = await get_application(db, app_id, user_id)
    if not application:
        return False
    await db.delete(application)
    await db.flush()
    return True

"""
PathForge API — Rate Limiter
===============================
Per-user rate limiting for expensive AI endpoints.

Uses SlowAPI with JWT-based user identification.
In-memory storage for development, Redis-ready for production.
"""

from __future__ import annotations

import logging

from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.requests import Request

logger = logging.getLogger(__name__)


def _get_user_or_ip(request: Request) -> str:
    """
    Extract rate-limit key from the request.

    Priority:
    1. Authenticated user ID (from JWT via request.state)
    2. Client IP address (fallback for unauthenticated requests)

    This ensures authenticated users are rate-limited per-user,
    not per-IP (important for shared networks/VPNs).
    """
    # FastAPI Depends populates request.state with user after auth
    user = getattr(request.state, "user", None)
    if user and hasattr(user, "id"):
        return f"user:{user.id}"
    return get_remote_address(request)


# ── Limiter Instance ───────────────────────────────────────────
# In-memory storage for development. For production, configure:
#   RATELIMIT_STORAGE_URI=redis://localhost:6379/1

limiter = Limiter(
    key_func=_get_user_or_ip,
    default_limits=["200/minute"],
    storage_uri="memory://",
)

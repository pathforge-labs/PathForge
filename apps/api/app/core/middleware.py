"""
PathForge API — Middleware
=======================================
Request ID tracking and security headers.

Features:
- Generates UUID4 per request (X-Request-ID)
- Accepts incoming X-Request-ID header (preserves client/gateway IDs)
- Security headers (OWASP compliance) in production
"""

from __future__ import annotations

import uuid
from contextvars import ContextVar
from typing import Any

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.core.config import settings

# ── Context Variable ───────────────────────────────────────────
# Accessible from any async code in the same request lifecycle.
request_id_var: ContextVar[str] = ContextVar("request_id", default="")


class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Middleware that assigns a unique request ID to every request.

    - If X-Request-ID header exists, use it (gateway/client tracing)
    - Otherwise, generate a UUID4
    - Stores in contextvars for log binding
    - Returns X-Request-ID in response headers
    """

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        # Use incoming request ID or generate new one
        incoming_id = request.headers.get("x-request-id", "")
        rid = incoming_id if incoming_id else str(uuid.uuid4())

        # Store in contextvars for log binding
        token = request_id_var.set(rid)

        try:
            response = await call_next(request)
            response.headers["X-Request-ID"] = rid
            return response
        finally:
            request_id_var.reset(token)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    OWASP-compliant security headers middleware.

    Applies protective HTTP headers to all responses:
    - Prevents MIME-type sniffing (X-Content-Type-Options)
    - Prevents clickjacking (X-Frame-Options)
    - Enforces HTTPS in production (Strict-Transport-Security)
    - Controls referrer information leakage
    - Restricts browser feature access (Permissions-Policy)
    """

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        response = await call_next(request)

        # Always applied
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "0"  # Modern: rely on CSP, disable legacy filter
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"

        # HSTS: only in production to avoid HTTPS enforcement in local dev
        if settings.is_production:
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains; preload"
            )

        return response


def get_request_id() -> str:
    """Get the current request ID from contextvars."""
    return request_id_var.get("")

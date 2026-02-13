"""
PathForge API — Request ID Middleware
=======================================
Generates a unique request ID per request for distributed tracing.

Features:
- Generates UUID4 per request
- Accepts incoming X-Request-ID header (preserves client/gateway IDs)
- Returns X-Request-ID in response headers
- Stores in contextvars for binding to logs
"""

from __future__ import annotations

import uuid
from contextvars import ContextVar
from typing import Any

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

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


def get_request_id() -> str:
    """Get the current request ID from contextvars."""
    return request_id_var.get("")

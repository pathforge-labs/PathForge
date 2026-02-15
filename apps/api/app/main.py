"""
PathForge API — Application Entry Point
=========================================
FastAPI application factory with CORS, routing, and OpenAPI configuration.

Run with: uvicorn app.main:app --reload
"""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.v1 import (
    ai,
    analytics,
    applications,
    auth,
    blacklist,
    career_dna,
    health,
    threat_radar,
    users,
)
from app.core.config import settings
from app.core.error_handlers import register_error_handlers
from app.core.logging_config import setup_logging
from app.core.middleware import RequestIDMiddleware, SecurityHeadersMiddleware
from app.core.rate_limit import limiter


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application startup and shutdown events."""
    # Startup
    setup_logging(debug=settings.debug)
    yield
    # Shutdown


def create_app() -> FastAPI:
    """Application factory."""
    application = FastAPI(
        title=f"{settings.app_name} API",
        description=f"{settings.app_name} — {settings.app_tagline}. "
        "AI-powered Career Intelligence Platform with Career DNA™ technology, "
        "semantic job matching, CV tailoring, and skill gap analysis.",
        version=settings.app_version,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # ── Middleware (order matters: outermost runs first) ────────
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.effective_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    application.add_middleware(RequestIDMiddleware)
    application.add_middleware(SecurityHeadersMiddleware)

    # ── Error Handlers ─────────────────────────────────────────
    register_error_handlers(application)
    application.state.limiter = limiter
    application.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # ── Routes ─────────────────────────────────────────────────
    application.include_router(health.router, prefix="/api/v1")
    application.include_router(auth.router, prefix="/api/v1")
    application.include_router(users.router, prefix="/api/v1")
    application.include_router(ai.router, prefix="/api/v1")
    application.include_router(applications.router, prefix="/api/v1")
    application.include_router(blacklist.router, prefix="/api/v1")
    application.include_router(analytics.router, prefix="/api/v1")
    application.include_router(career_dna.router, prefix="/api/v1")
    application.include_router(threat_radar.router, prefix="/api/v1")

    return application


app = create_app()

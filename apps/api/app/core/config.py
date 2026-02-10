"""
PathForge API — Career Intelligence Platform
==========================================
Core application configuration.

All settings are loaded from environment variables with sensible defaults.
Import from here, never hardcode configuration values.

Usage:
    from app.core.config import settings
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Brand Identity ──────────────────────────────────────────
    app_name: str = "PathForge"
    app_slug: str = "pathforge"
    app_tagline: str = "Career Intelligence for Everyone"
    app_version: str = "0.1.0"

    # ── Server ──────────────────────────────────────────────────
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = False
    environment: str = "development"

    # ── Database ────────────────────────────────────────────────
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/pathforge_dev"
    database_echo: bool = False

    # ── Redis ───────────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379/0"

    # ── JWT Authentication ──────────────────────────────────────
    jwt_secret: str = "change-me-in-production-use-a-real-secret"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60
    jwt_refresh_token_expire_days: int = 30

    # ── CORS ────────────────────────────────────────────────────
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
    ]

    # ── AI / LLM Providers (loaded when needed) ─────────────────
    anthropic_api_key: str = ""
    google_ai_api_key: str = ""
    voyage_api_key: str = ""

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


settings = Settings()

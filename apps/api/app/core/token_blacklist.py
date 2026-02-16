"""
PathForge — Redis-Backed JWT Token Blacklist
=============================================
Manages token revocation using Redis SETEX with automatic TTL cleanup.

When a user logs out or a refresh token is rotated, the token's `jti`
(JWT ID) is added to the blacklist with a TTL matching the token's
remaining lifetime. Redis automatically evicts expired entries.

Usage:
    from app.core.token_blacklist import token_blacklist

    await token_blacklist.revoke(jti="abc-123", ttl_seconds=3600)
    is_revoked = await token_blacklist.is_revoked(jti="abc-123")
"""

from __future__ import annotations

import logging
from typing import ClassVar

from redis.asyncio import Redis

from app.core.config import settings

logger = logging.getLogger(__name__)

# Redis key prefix for blacklisted tokens
_PREFIX: str = "token:blacklist:"


class TokenBlacklist:
    """Async Redis-backed token revocation store."""

    _redis: ClassVar[Redis | None] = None

    @classmethod
    async def get_redis(cls) -> Redis:
        """Lazily initialize and return the Redis connection."""
        if cls._redis is None:
            cls._redis = Redis.from_url(
                settings.redis_url,
                decode_responses=True,
                socket_connect_timeout=5,
            )
        return cls._redis

    @classmethod
    async def revoke(cls, jti: str, ttl_seconds: int) -> None:
        """
        Add a token JTI to the blacklist.

        The entry auto-expires after ``ttl_seconds`` (matching
        the token's remaining lifetime), so no manual cleanup needed.
        """
        redis = await cls.get_redis()
        key = f"{_PREFIX}{jti}"
        await redis.setex(key, ttl_seconds, "revoked")
        logger.info("Token %s blacklisted (TTL=%ds)", jti[:8], ttl_seconds)

    @classmethod
    async def is_revoked(cls, jti: str) -> bool:
        """Check whether a token JTI has been revoked."""
        redis = await cls.get_redis()
        key = f"{_PREFIX}{jti}"
        return bool(await redis.exists(key))

    @classmethod
    async def close(cls) -> None:
        """Gracefully close the Redis connection pool."""
        if cls._redis is not None:
            await cls._redis.aclose()
            cls._redis = None


# Module-level convenience instance
token_blacklist = TokenBlacklist

"""
PathForge AI Engine — LiteLLM Provider Routing
================================================
Tiered multi-provider LLM routing with automatic fallbacks.

Usage:
    from app.core.llm import complete, LLMTier

    result = await complete(
        prompt="Extract skills from this resume...",
        tier=LLMTier.FAST,
    )
"""

from __future__ import annotations

import asyncio
import enum
import json
import logging
import time
from typing import Any

import litellm

from app.core.config import settings

logger = logging.getLogger(__name__)

# ── Suppress noisy LiteLLM logs in non-debug mode ──────────────
litellm.suppress_debug_info = True
if not settings.debug:
    litellm.set_verbose = False


class LLMTier(enum.StrEnum):
    """Model selection tier — maps to config model names."""

    PRIMARY = "primary"
    FAST = "fast"
    DEEP = "deep"


# ── Tier → Model Resolution ────────────────────────────────────

_TIER_MODEL_MAP: dict[LLMTier, str] = {
    LLMTier.PRIMARY: settings.llm_primary_model,
    LLMTier.FAST: settings.llm_fast_model,
    LLMTier.DEEP: settings.llm_deep_model,
}

_FALLBACK_CHAIN: dict[LLMTier, list[LLMTier]] = {
    LLMTier.DEEP: [LLMTier.PRIMARY, LLMTier.FAST],
    LLMTier.PRIMARY: [LLMTier.FAST],
    LLMTier.FAST: [],
}


def _resolve_model(tier: LLMTier) -> str:
    """Resolve a tier to its configured model name."""
    return _TIER_MODEL_MAP[tier]


# ── Core Completion Function ───────────────────────────────────

async def complete(
    *,
    prompt: str,
    system_prompt: str = "",
    tier: LLMTier = LLMTier.PRIMARY,
    response_format: dict[str, Any] | None = None,
    temperature: float = 0.1,
    max_tokens: int = 4096,
) -> str:
    """
    Send a completion request through the tiered LLM routing layer.

    Features:
    - Automatic model selection by tier
    - Fallback chain: Deep → Primary → Fast
    - Retry with exponential backoff (configurable)
    - Structured JSON output via response_format
    - Timeout enforcement
    - Token usage logging

    Args:
        prompt: The user prompt to send.
        system_prompt: Optional system-level instructions.
        tier: Which model tier to use (PRIMARY, FAST, DEEP).
        response_format: Optional JSON schema for structured output.
        temperature: Sampling temperature (0.0-1.0). Default 0.1 for determinism.
        max_tokens: Maximum tokens in response.

    Returns:
        The model's response text.

    Raises:
        LLMError: If all tiers in the fallback chain fail.
    """
    tiers_to_try = [tier, *_FALLBACK_CHAIN.get(tier, [])]
    last_error: Exception | None = None

    for attempt_tier in tiers_to_try:
        model = _resolve_model(attempt_tier)
        try:
            result = await _call_with_retry(
                model=model,
                prompt=prompt,
                system_prompt=system_prompt,
                response_format=response_format,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            if attempt_tier != tier:
                logger.warning(
                    "LLM fallback activated: %s → %s",
                    tier.value,
                    attempt_tier.value,
                )
            return result
        except Exception as exc:
            last_error = exc
            logger.warning(
                "LLM tier %s (%s) failed: %s. Trying fallback...",
                attempt_tier.value,
                model,
                str(exc)[:200],
            )

    raise LLMError(
        f"All LLM tiers exhausted. Last error: {last_error}"
    ) from last_error


async def complete_json(
    *,
    prompt: str,
    system_prompt: str = "",
    tier: LLMTier = LLMTier.FAST,
    temperature: float = 0.0,
    max_tokens: int = 4096,
) -> dict[str, Any]:
    """
    Convenience wrapper that requests JSON output and parses it.

    Returns:
        Parsed JSON dict from the model's response.

    Raises:
        LLMError: If the response is not valid JSON after retries.
    """
    raw = await complete(
        prompt=prompt,
        system_prompt=system_prompt,
        tier=tier,
        response_format={"type": "json_object"},
        temperature=temperature,
        max_tokens=max_tokens,
    )

    # Strip markdown code fences if present (some models wrap JSON)
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        # Remove first and last lines (```json and ```)
        cleaned = "\n".join(lines[1:-1]).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise LLMError(
            f"LLM returned invalid JSON: {str(exc)[:200]}"
        ) from exc


# ── Internal Retry Logic ───────────────────────────────────────

async def _call_with_retry(
    *,
    model: str,
    prompt: str,
    system_prompt: str,
    response_format: dict[str, Any] | None,
    temperature: float,
    max_tokens: int,
) -> str:
    """Call LiteLLM with exponential backoff retries."""
    messages: list[dict[str, str]] = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    last_error: Exception | None = None
    max_retries = settings.llm_max_retries

    for attempt in range(max_retries + 1):
        try:
            start = time.monotonic()

            kwargs: dict[str, Any] = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "timeout": settings.llm_timeout,
            }
            if response_format is not None:
                kwargs["response_format"] = response_format

            response = await litellm.acompletion(**kwargs)
            elapsed = time.monotonic() - start

            # Extract response text
            content = response.choices[0].message.content or ""

            # Log usage
            usage = getattr(response, "usage", None)
            if usage:
                logger.info(
                    "LLM [%s] %d prompt + %d completion tokens, %.2fs",
                    model,
                    usage.prompt_tokens,
                    usage.completion_tokens,
                    elapsed,
                )
            else:
                logger.info("LLM [%s] completed in %.2fs", model, elapsed)

            return content

        except Exception as exc:
            last_error = exc
            if attempt < max_retries:
                wait = 2 ** attempt  # 1s, 2s, 4s
                logger.warning(
                    "LLM retry %d/%d for %s after error: %s (wait %ds)",
                    attempt + 1,
                    max_retries,
                    model,
                    str(exc)[:100],
                    wait,
                )
                await asyncio.sleep(wait)

    raise last_error  # type: ignore[misc]


# ── Custom Exception ───────────────────────────────────────────

class LLMError(Exception):
    """Raised when LLM completion fails after all retries and fallbacks."""

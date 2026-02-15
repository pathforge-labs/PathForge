"""
PathForge -- Prompt Injection Sanitizer
==========================================
Sanitize user-provided text before it enters LLM prompts.

Addresses OWASP LLM Top 10 -- LLM01: Prompt Injection.

Patterns detected and neutralized:
    - Instruction overrides ("IGNORE ALL PREVIOUS INSTRUCTIONS")
    - Role impersonation ("SYSTEM:", "ASSISTANT:", "[INST]")
    - Delimiter injection (---, backquotes, ===)
    - Unicode confusables (zero-width chars, homoglyphs)
    - Excessive whitespace / padding attacks

Usage:
    from app.core.prompt_sanitizer import sanitize_user_text

    clean = sanitize_user_text(raw_resume_text, max_length=6000)
"""

from __future__ import annotations

import logging
import re
import unicodedata
from typing import Any

logger = logging.getLogger(__name__)

# ── Injection Pattern Definitions ──────────────────────────────

# Patterns that attempt to override system instructions
_INSTRUCTION_OVERRIDE_PATTERNS: list[re.Pattern[str]] = [
    re.compile(
        r"(?i)(ignore|forget|disregard|override|bypass)\s+"
        r"(all\s+)?(previous|prior|above|earlier|system)\s+"
        r"(instructions?|prompts?|rules?|context)",
    ),
    re.compile(
        r"(?i)do\s+not\s+follow\s+(the\s+)?(above|previous|system)\s+"
        r"(instructions?|prompts?|rules?)",
    ),
    re.compile(
        r"(?i)you\s+are\s+now\s+(a|an|in)\s+",
    ),
    re.compile(
        r"(?i)act\s+as\s+(if\s+you\s+are|a|an)\s+",
    ),
    re.compile(
        r"(?i)new\s+(instructions?|rules?|role|persona)\s*:",
    ),
    re.compile(
        r"(?i)from\s+now\s+on\s*,?\s+(you|ignore|forget)",
    ),
]

# Role impersonation markers (case-insensitive match)
_ROLE_MARKERS: list[str] = [
    "SYSTEM:",
    "ASSISTANT:",
    "USER:",
    "[INST]",
    "[/INST]",
    "<<SYS>>",
    "<</SYS>>",
]

# Chat template markers (angle-bracket prefixed)
_CHAT_TEMPLATE_PATTERNS: list[re.Pattern[str]] = [
    re.compile(r"<\|im_start\|>", re.IGNORECASE),
    re.compile(r"<\|im_end\|>", re.IGNORECASE),
    re.compile(r"<\|system\|>", re.IGNORECASE),
    re.compile(r"<\|user\|>", re.IGNORECASE),
    re.compile(r"<\|assistant\|>", re.IGNORECASE),
]

# Delimiter injection: sequences of 3+ separator characters
_DELIMITER_PATTERN = re.compile(r"([-=~`]{3,})")

# Unicode zero-width and invisible characters
_ZERO_WIDTH_CHARS = re.compile(
    r"[\u200b\u200c\u200d\u200e\u200f"
    r"\u2060\u2061\u2062\u2063\u2064"
    r"\ufeff\u00ad\u034f\u180e]"
)

# Excessive whitespace (more than 3 consecutive newlines)
_EXCESSIVE_NEWLINES = re.compile(r"\n{4,}")

# Default max length for sanitized text
DEFAULT_MAX_LENGTH = 8000


# ── Public API ─────────────────────────────────────────────────


def sanitize_user_text(
    text: str,
    *,
    max_length: int = DEFAULT_MAX_LENGTH,
    context: str = "unknown",
) -> tuple[str, dict[str, Any]]:
    """
    Sanitize user-provided text for safe inclusion in LLM prompts.

    Defense-in-depth approach: multiple layers of pattern detection
    and neutralization. Designed to be non-destructive to legitimate
    professional text (resumes, cover letters, preferences).

    Args:
        text: Raw user-provided text to sanitize.
        max_length: Maximum character length after sanitization.
        context: Label for logging (e.g., "experience_text").

    Returns:
        Tuple of (sanitized_text, metadata_dict).
        metadata_dict contains: patterns_found (list), chars_removed (int),
        was_truncated (bool), original_length (int).
    """
    if not text or not text.strip():
        return "", _empty_metadata()

    original_length = len(text)
    cleaned = text
    patterns_found: list[str] = []

    # Layer 1: Remove zero-width / invisible Unicode characters
    zero_width_matches = _ZERO_WIDTH_CHARS.findall(cleaned)
    if zero_width_matches:
        cleaned = _ZERO_WIDTH_CHARS.sub("", cleaned)
        patterns_found.append(f"zero_width_chars:{len(zero_width_matches)}")

    # Layer 2: Normalize Unicode (NFC form) to collapse confusables
    cleaned = unicodedata.normalize("NFC", cleaned)

    # Layer 3: Neutralize instruction override patterns
    for pattern in _INSTRUCTION_OVERRIDE_PATTERNS:
        if pattern.search(cleaned):
            pattern_name = pattern.pattern[:40]
            patterns_found.append(f"instruction_override:{pattern_name}")
            cleaned = pattern.sub("[FILTERED]", cleaned)

    # Layer 4: Neutralize role impersonation markers
    for marker in _ROLE_MARKERS:
        if marker.upper() in cleaned.upper():
            patterns_found.append(f"role_marker:{marker}")
            # Case-insensitive replacement
            escaped = re.escape(marker)
            cleaned = re.sub(escaped, "[FILTERED]", cleaned, flags=re.IGNORECASE)

    # Layer 5: Neutralize chat template markers
    for pattern in _CHAT_TEMPLATE_PATTERNS:
        if pattern.search(cleaned):
            patterns_found.append(f"chat_template:{pattern.pattern[:30]}")
            cleaned = pattern.sub("[FILTERED]", cleaned)

    # Layer 6: Collapse delimiter injection sequences
    delimiter_matches = _DELIMITER_PATTERN.findall(cleaned)
    if delimiter_matches:
        # Replace runs of 3+ separators with a single instance
        cleaned = _DELIMITER_PATTERN.sub(
            lambda match: match.group(0)[0] * 2, cleaned
        )
        patterns_found.append(f"delimiter_injection:{len(delimiter_matches)}")

    # Layer 7: Collapse excessive whitespace
    cleaned = _EXCESSIVE_NEWLINES.sub("\n\n\n", cleaned)

    # Layer 8: Enforce length limit
    was_truncated = False
    if len(cleaned) > max_length:
        cleaned = cleaned[:max_length]
        was_truncated = True

    # Strip leading/trailing whitespace
    cleaned = cleaned.strip()

    chars_removed = original_length - len(cleaned)

    # Log if any patterns were found
    if patterns_found:
        logger.warning(
            "Prompt sanitization [%s]: %d pattern(s) neutralized, "
            "%d chars removed. Patterns: %s",
            context,
            len(patterns_found),
            chars_removed,
            ", ".join(patterns_found),
        )

    metadata: dict[str, Any] = {
        "patterns_found": patterns_found,
        "chars_removed": chars_removed,
        "was_truncated": was_truncated,
        "original_length": original_length,
    }

    return cleaned, metadata


def _empty_metadata() -> dict[str, Any]:
    """Return metadata for empty input."""
    return {
        "patterns_found": [],
        "chars_removed": 0,
        "was_truncated": False,
        "original_length": 0,
    }

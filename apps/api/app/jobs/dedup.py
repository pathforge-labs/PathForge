"""
PathForge — Job Deduplication Service
========================================
SHA256 fingerprint-based deduplication for job listings.

Strategy:
    1. Normalize key fields (title, company, location)
    2. Compute SHA256 hash of concatenated normalized values
    3. Check fingerprint against unique index in DB
    4. Skip if exists, insert if new

This catches:
    - Same job posted on Adzuna and Jooble
    - Same job reposted by the same company on different days
    - Minor title variations (case, whitespace, punctuation)
"""

from __future__ import annotations

import hashlib
import re
import unicodedata


def normalize_text(text: str) -> str:
    """
    Normalize text for consistent fingerprinting.

    Operations:
    1. Unicode NFKD normalization (è → e, ü → u)
    2. Lowercase
    3. Strip leading/trailing whitespace
    4. Collapse multiple whitespace to single space
    5. Remove common punctuation (keeps alphanumeric + spaces)
    """
    if not text:
        return ""

    # Unicode normalization
    normalized = unicodedata.normalize("NFKD", text)
    # Remove combining characters (accents)
    normalized = "".join(c for c in normalized if not unicodedata.combining(c))
    # Lowercase
    normalized = normalized.lower()
    # Remove punctuation (keep alphanumeric + whitespace)
    normalized = re.sub(r"[^\w\s]", "", normalized)
    # Collapse whitespace
    normalized = re.sub(r"\s+", " ", normalized).strip()

    return normalized


def compute_fingerprint(
    title: str,
    company: str,
    location: str = "",
) -> str:
    """
    Compute a SHA256 fingerprint for deduplication.

    The fingerprint is deterministic: same inputs always produce the same hash.
    This allows the unique DB index to enforce deduplication at the database level.

    Args:
        title: Job title
        company: Company name
        location: Job location (optional, but improves accuracy)

    Returns:
        64-character hex string (SHA256 digest)
    """
    parts = [
        normalize_text(title),
        normalize_text(company),
        normalize_text(location),
    ]
    combined = "|".join(parts)
    return hashlib.sha256(combined.encode("utf-8")).hexdigest()

"""
PathForge — ONET Data Loader
================================
Loads and queries the curated ONET Frey-Osborne automation risk
dataset. Provides lookup by SOC code, fuzzy title matching, and
category filtering for the Career Threat Radar™ pipeline.

Data is loaded once on first access and cached in-memory.
"""

import json
import logging
from functools import lru_cache
from pathlib import Path
from typing import TypedDict

logger = logging.getLogger(__name__)

# ── Type Definitions ───────────────────────────────────────────

DATA_FILE = Path(__file__).parent / "onet_automation_risk.json"


class BottleneckScores(TypedDict):
    """Frey-Osborne bottleneck dimension scores (0.0–1.0)."""

    perception_manipulation: float
    creative_intelligence: float
    social_intelligence: float


class OccupationEntry(TypedDict):
    """Single ONET occupation entry."""

    soc_code: str
    title: str
    automation_probability: float
    bottleneck_scores: BottleneckScores
    category: str


class OnetDataset(TypedDict):
    """Parsed ONET dataset structure."""

    occupations: list[OccupationEntry]
    by_soc_code: dict[str, OccupationEntry]
    by_category: dict[str, list[OccupationEntry]]


# ── Loader ─────────────────────────────────────────────────────


@lru_cache(maxsize=1)
def load_onet_dataset() -> OnetDataset:
    """
    Load and index the ONET automation risk dataset.

    Returns a typed dict with three access patterns:
        - occupations: full list
        - by_soc_code: O(1) SOC code lookup
        - by_category: grouped by category
    """
    with DATA_FILE.open(encoding="utf-8") as file_handle:
        raw = json.load(file_handle)

    occupations: list[OccupationEntry] = raw["occupations"]
    by_soc_code: dict[str, OccupationEntry] = {}
    by_category: dict[str, list[OccupationEntry]] = {}

    for entry in occupations:
        soc_code = entry["soc_code"]
        category = entry["category"]

        by_soc_code[soc_code] = entry

        if category not in by_category:
            by_category[category] = []
        by_category[category].append(entry)

    logger.info(
        "Loaded ONET dataset: %d occupations, %d categories",
        len(occupations),
        len(by_category),
    )

    return OnetDataset(
        occupations=occupations,
        by_soc_code=by_soc_code,
        by_category=by_category,
    )


# ── Query Functions ────────────────────────────────────────────


def get_occupation_by_soc(soc_code: str) -> OccupationEntry | None:
    """Look up an occupation by exact SOC code."""
    dataset = load_onet_dataset()
    return dataset["by_soc_code"].get(soc_code)


def search_occupations_by_title(
    query: str,
    *,
    max_results: int = 10,
) -> list[OccupationEntry]:
    """
    Search occupations by title substring (case-insensitive).

    Returns up to `max_results` matches sorted by automation probability
    (most at-risk first) for threat-relevant ordering.
    """
    dataset = load_onet_dataset()
    query_lower = query.lower()

    matches = [
        entry
        for entry in dataset["occupations"]
        if query_lower in entry["title"].lower()
    ]

    matches.sort(key=lambda entry: entry["automation_probability"], reverse=True)
    return matches[:max_results]


def get_occupations_by_category(category: str) -> list[OccupationEntry]:
    """Get all occupations in a category."""
    dataset = load_onet_dataset()
    return dataset["by_category"].get(category, [])


def get_all_categories() -> list[str]:
    """Get all available occupation categories."""
    dataset = load_onet_dataset()
    return sorted(dataset["by_category"].keys())


def compute_bottleneck_average(
    bottleneck_scores: BottleneckScores,
) -> float:
    """
    Compute the average bottleneck score for Skills Shield™ classification.

    Higher average → more resistant to automation (SHIELD).
    Lower average → more vulnerable to automation (EXPOSURE).

    Classification thresholds (used in Skills Shield™ Classifier):
        ≥ 0.60 → SHIELD
        ≤ 0.35 → EXPOSURE
        0.36–0.59 → NEUTRAL
    """
    scores = [
        bottleneck_scores["perception_manipulation"],
        bottleneck_scores["creative_intelligence"],
        bottleneck_scores["social_intelligence"],
    ]
    return sum(scores) / len(scores)

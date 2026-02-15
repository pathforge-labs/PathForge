"""
PathForge — Job Deduplication Tests
======================================
Tests for fingerprint computation and text normalization.
"""


from app.jobs.dedup import compute_fingerprint, normalize_text


class TestNormalizeText:
    """Test text normalization for consistent fingerprinting."""

    def test_lowercase(self) -> None:
        assert normalize_text("Senior Python Developer") == "senior python developer"

    def test_strip_whitespace(self) -> None:
        assert normalize_text("  Python Developer  ") == "python developer"

    def test_collapse_whitespace(self) -> None:
        assert normalize_text("Python   Developer") == "python developer"

    def test_remove_punctuation(self) -> None:
        assert normalize_text("Sr. Developer (Python)") == "sr developer python"

    def test_unicode_normalization(self) -> None:
        """Accented characters should be normalized (è → e)."""
        result = normalize_text("Développeur Python")
        assert "e" in result  # è → e
        assert "é" not in result

    def test_empty_string(self) -> None:
        assert normalize_text("") == ""

    def test_special_characters(self) -> None:
        assert normalize_text("C++ / C# Developer") == "c c developer"

    def test_tab_and_newline(self) -> None:
        assert normalize_text("Python\tDeveloper\nSenior") == "python developer senior"


class TestComputeFingerprint:
    """Test SHA256 fingerprint computation."""

    def test_deterministic(self) -> None:
        """Same input always produces same fingerprint."""
        fp1 = compute_fingerprint("Python Dev", "Acme", "Amsterdam")
        fp2 = compute_fingerprint("Python Dev", "Acme", "Amsterdam")
        assert fp1 == fp2

    def test_hex_length(self) -> None:
        """SHA256 produces 64-character hex string."""
        fp = compute_fingerprint("Dev", "Co", "NY")
        assert len(fp) == 64
        assert all(c in "0123456789abcdef" for c in fp)

    def test_case_insensitive(self) -> None:
        """Fingerprint should be case-insensitive."""
        fp1 = compute_fingerprint("Python Developer", "Acme Corp", "Amsterdam")
        fp2 = compute_fingerprint("python developer", "acme corp", "amsterdam")
        assert fp1 == fp2

    def test_whitespace_insensitive(self) -> None:
        """Extra whitespace should not change fingerprint."""
        fp1 = compute_fingerprint("Python Developer", "Acme", "Amsterdam")
        fp2 = compute_fingerprint("  Python  Developer  ", "  Acme  ", "  Amsterdam  ")
        assert fp1 == fp2

    def test_punctuation_insensitive(self) -> None:
        """Punctuation differences should not change fingerprint."""
        fp1 = compute_fingerprint("Sr. Developer", "Acme, Inc.", "N.Y.")
        fp2 = compute_fingerprint("Sr Developer", "Acme Inc", "NY")
        assert fp1 == fp2

    def test_different_jobs_different_fingerprints(self) -> None:
        """Different jobs should produce different fingerprints."""
        fp1 = compute_fingerprint("Python Developer", "Acme", "Amsterdam")
        fp2 = compute_fingerprint("Java Developer", "Acme", "Amsterdam")
        assert fp1 != fp2

    def test_different_companies_different_fingerprints(self) -> None:
        fp1 = compute_fingerprint("Python Developer", "Acme", "Amsterdam")
        fp2 = compute_fingerprint("Python Developer", "Widget Co", "Amsterdam")
        assert fp1 != fp2

    def test_empty_location(self) -> None:
        """Should work with empty location."""
        fp = compute_fingerprint("Dev", "Co", "")
        assert len(fp) == 64

    def test_cross_provider_dedup(self) -> None:
        """Same job from Adzuna and Jooble should have same fingerprint."""
        # Adzuna might format as "Senior Python Developer"
        # Jooble might format as "Senior Python developer"
        fp_adzuna = compute_fingerprint(
            "Senior Python Developer", "Tech Corp", "Amsterdam, Netherlands"
        )
        fp_jooble = compute_fingerprint(
            "Senior Python developer", "Tech Corp", "Amsterdam, Netherlands"
        )
        assert fp_adzuna == fp_jooble

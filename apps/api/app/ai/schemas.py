"""
PathForge AI Engine — Pydantic Output Schemas
===============================================
Structured data models for AI pipeline outputs.
Used as contracts between parsing, embedding, and matching stages.
"""

from __future__ import annotations

from pydantic import BaseModel, Field

# ── Resume Parsing Output ──────────────────────────────────────


class ParsedSkill(BaseModel):
    """A single skill extracted from a resume."""

    name: str = Field(..., description="Skill name, e.g. 'Python', 'Project Management'")
    category: str = Field(
        default="general",
        description="Category: 'technical', 'soft', 'language', 'tool', 'general'",
    )
    proficiency_level: str = Field(
        default="intermediate",
        description="Proficiency: 'beginner', 'intermediate', 'advanced', 'expert'",
    )


class ParsedExperience(BaseModel):
    """A single work experience entry."""

    company: str = Field(..., description="Company or organization name")
    title: str = Field(..., description="Job title / role")
    start_date: str = Field(default="", description="Start date (ISO or free-text)")
    end_date: str = Field(default="", description="End date or 'Present'")
    description: str = Field(default="", description="Role description")
    achievements: list[str] = Field(
        default_factory=list,
        description="Key achievements / bullet points",
    )


class ParsedEducation(BaseModel):
    """A single education entry."""

    institution: str = Field(..., description="School / university name")
    degree: str = Field(default="", description="Degree type, e.g. 'BSc', 'MSc', 'MBA'")
    field: str = Field(default="", description="Field of study")
    graduation_date: str = Field(default="", description="Graduation date")


class ParsedCertification(BaseModel):
    """A professional certification."""

    name: str = Field(..., description="Certification name")
    issuer: str = Field(default="", description="Issuing organization")
    date: str = Field(default="", description="Date obtained")


class ParsedLanguage(BaseModel):
    """A language with proficiency level."""

    name: str = Field(..., description="Language name")
    proficiency: str = Field(
        default="conversational",
        description="'native', 'fluent', 'conversational', 'basic'",
    )


class ParsedResume(BaseModel):
    """
    Complete structured output from resume parsing.

    This is the canonical data contract between the resume parser
    and all downstream services (embedding, matching, CV tailoring).
    """

    full_name: str = Field(default="", description="Candidate's full name")
    email: str = Field(default="", description="Contact email")
    phone: str = Field(default="", description="Contact phone")
    location: str = Field(default="", description="City/country")
    summary: str = Field(default="", description="Professional summary / objective")
    skills: list[ParsedSkill] = Field(default_factory=list)
    experience: list[ParsedExperience] = Field(default_factory=list)
    education: list[ParsedEducation] = Field(default_factory=list)
    certifications: list[ParsedCertification] = Field(default_factory=list)
    languages: list[ParsedLanguage] = Field(default_factory=list)


# ── Matching Output ────────────────────────────────────────────


class MatchCandidate(BaseModel):
    """A single job match result with score and metadata."""

    job_id: str = Field(..., description="UUID of the matched job listing")
    score: float = Field(..., ge=0.0, le=1.0, description="Cosine similarity score (0-1)")
    title: str = Field(default="", description="Job title")
    company: str = Field(default="", description="Company name")


class MatchExplanation(BaseModel):
    """LLM-generated explanation of why a job matches."""

    overall_assessment: str = Field(..., description="1-2 sentence match summary")
    strengths: list[str] = Field(default_factory=list, description="Why this is a good match")
    gaps: list[str] = Field(default_factory=list, description="Skills/experience gaps")
    recommendation: str = Field(
        default="",
        description="Action recommendation: 'strong_match', 'good_match', 'stretch', 'poor_match'",
    )


# ── CV Tailoring Output ───────────────────────────────────────


class CVSectionDiff(BaseModel):
    """A single field-level change in the tailored CV."""

    section: str = Field(..., description="Which section was modified, e.g. 'summary', 'skills'")
    original: str = Field(..., description="Original content")
    modified: str = Field(..., description="Tailored content")
    reason: str = Field(..., description="Why this change was made")


class TailoredCV(BaseModel):
    """Complete tailored CV output with field-level diff tracking."""

    tailored_summary: str = Field(default="", description="Tailored professional summary")
    tailored_skills: list[str] = Field(default_factory=list, description="Prioritized skill list")
    tailored_experience: list[str] = Field(
        default_factory=list,
        description="Rewritten experience bullets",
    )
    diffs: list[CVSectionDiff] = Field(
        default_factory=list,
        description="Field-level change log with rationale",
    )
    ats_score: int = Field(
        default=0,
        ge=0,
        le=100,
        description="Estimated ATS compatibility score (0-100)",
    )
    ats_suggestions: list[str] = Field(
        default_factory=list,
        description="ATS compliance improvement suggestions",
    )

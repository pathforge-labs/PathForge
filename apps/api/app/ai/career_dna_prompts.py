"""
PathForge AI Engine — Career DNA Prompt Templates
====================================================
Versioned prompts for Career DNA™ analysis.
All 6 dimensions: SkillGenome, ExperienceBlueprint,
GrowthVector, ValuesProfile, MarketPosition, HiddenSkills.
"""

# ── Career DNA Analysis ────────────────────────────────────────

CAREER_DNA_VERSION = "1.0.0"

CAREER_DNA_SYSTEM_PROMPT = """\
You are a Career Intelligence Analyst specializing in career DNA profiling. \
You analyze resumes and professional data to extract deep career insights \
across multiple dimensions.

RULES:
1. NEVER fabricate information not present in the source data.
2. Clearly distinguish between explicit data and inferred insights.
3. All inferred data must include confidence scores (0.0-1.0).
4. Maximum confidence for inferred data is 0.9 without direct evidence.
5. Every score or rating must be accompanied by reasoning.
6. Base values analysis on career patterns, NEVER on demographics.
7. Frame growth projections as possibilities, not predictions.
8. Return your response as a valid JSON object matching the schema exactly.
"""

# ── Hidden Skills Discovery ────────────────────────────────────

HIDDEN_SKILLS_VERSION = "1.0.0"

HIDDEN_SKILLS_SYSTEM_PROMPT = """\
You are a Transferable Skills Discovery Engine. Your task is to identify \
skills that are implicitly demonstrated in professional experience \
descriptions but NOT explicitly listed by the candidate.

RULES:
1. Look for competencies implied by responsibilities and achievements.
2. Consider cross-domain transferable skills (e.g., project management \
skills from leading engineering teams).
3. Each discovered skill must have supporting evidence from the source text.
4. Confidence scores: 0.3-0.6 for weak signals, 0.6-0.8 for moderate, \
0.8-0.9 for strong (max 0.9 without explicit mention).
5. Do NOT rediscover skills already explicitly listed by the candidate.
6. NEVER invent or hallucinate skills that have no textual basis.
7. Return your response as a valid JSON object matching the schema exactly.
"""

HIDDEN_SKILLS_USER_PROMPT = """\
Analyze the following professional experience to discover hidden \
transferable skills NOT already in the explicit skill list.

EXPLICIT SKILLS (already known — do NOT include these):
---
{explicit_skills}
---

PROFESSIONAL EXPERIENCE:
---
{experience_text}
---

Return a JSON object with this exact key:
- hidden_skills (array of objects with: skill_name, confidence, evidence, \
source_text)

Where:
- skill_name: the transferable skill discovered
- confidence: float 0.0-0.9
- evidence: string explaining HOW this skill is demonstrated
- source_text: exact quote from experience that supports this discovery
"""

# ── Experience Blueprint Analysis ──────────────────────────────

EXPERIENCE_BLUEPRINT_VERSION = "1.0.0"

EXPERIENCE_BLUEPRINT_USER_PROMPT = """\
Analyze the following career history to extract the experience blueprint.

CAREER HISTORY:
---
{experience_text}
---

Return a JSON object with these exact keys:
- total_years: float (total professional experience)
- role_count: int (number of distinct positions)
- avg_tenure_months: float (average time per role)
- career_direction: string (one of: ascending, lateral, transitioning, \
exploring)
- industry_diversity: float 0.0-1.0 (0=single industry, 1=highly diverse)
- seniority_trajectory: object with keys "levels" (array of role levels \
from earliest to latest, e.g. ["junior", "mid", "senior"]) and \
"trend" (string: "upward", "stable", or "mixed")
- pattern_analysis: string (2-3 sentence narrative of career patterns)
"""

# ── Growth Vector Computation ──────────────────────────────────

GROWTH_VECTOR_VERSION = "1.0.0"

GROWTH_VECTOR_USER_PROMPT = """\
Compute a career growth vector from the following data.

CAREER HISTORY:
---
{experience_text}
---

SKILLS:
---
{skills_text}
---

PREFERENCES (stated career goals):
---
{preferences_text}
---

Return a JSON object with these exact keys:
- current_trajectory: string (one of: accelerating, steady, plateauing, \
pivoting)
- projected_roles: object with keys "short_term" (1-2 years, array of \
strings), "medium_term" (3-5 years, array of strings)
- skill_velocity: object mapping skill names to velocity score -5 to +5 \
(negative=declining relevance, positive=growing demand)
- growth_score: float 0-100 (overall growth momentum)
- analysis_reasoning: string (2-3 sentence explanation of the projection, \
framed as possibilities not certainties)
"""

# ── Values Profile Extraction ──────────────────────────────────

VALUES_PROFILE_VERSION = "1.0.0"

VALUES_PROFILE_USER_PROMPT = """\
Extract career values from the following career data. Base analysis ONLY \
on experience patterns and stated preferences — NEVER on demographics.

CAREER HISTORY:
---
{experience_text}
---

STATED PREFERENCES:
---
{preferences_text}
---

Return a JSON object with these exact keys:
- work_style: string (one of: autonomous, collaborative, structured, \
flexible)
- impact_preference: string (one of: individual, team, organizational, \
societal)
- environment_fit: object with keys "company_size" \
(startup/mid/enterprise/any), "pace" (fast/moderate/steady), \
"culture" (innovation/stability/growth)
- derived_values: object mapping value names to strength scores 0.0-1.0. \
Include at least: autonomy, stability, creativity, impact, growth, \
collaboration, compensation, work_life_balance
- confidence: float 0.0-1.0 (overall confidence in values assessment)
"""

# ── Career DNA Summary ─────────────────────────────────────────

CAREER_DNA_SUMMARY_VERSION = "1.0.0"

CAREER_DNA_SUMMARY_USER_PROMPT = """\
Synthesize the following Career DNA dimensions into a 2-3 sentence \
executive summary of this professional's career identity.

SKILL GENOME:
---
{skills_summary}
---

EXPERIENCE BLUEPRINT:
---
{experience_summary}
---

GROWTH VECTOR:
---
{growth_summary}
---

VALUES PROFILE:
---
{values_summary}
---

MARKET POSITION:
---
{market_summary}
---

Return a JSON object with this exact key:
- summary: string (2-3 sentence career DNA narrative)
"""

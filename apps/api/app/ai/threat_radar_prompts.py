"""
PathForge AI Engine — Career Threat Radar™ Prompt Templates
==============================================================
Versioned prompts for the Career Threat Radar™ analysis pipeline.

Methods covered:
    1. score_automation_risk — ONET-aware contextual risk scoring
    2. analyze_industry_trends — Personalized trend monitoring
    3. classify_skills_shield — Frey-Osborne bottleneck classification
    4. generate_threat_assessment — Threat→Opportunity inversion
"""

# ── Threat Radar System Prompt ─────────────────────────────────

THREAT_RADAR_VERSION = "1.0.0"

THREAT_RADAR_SYSTEM_PROMPT = """\
You are a Career Threat Intelligence Analyst for PathForge. You specialize \
in analyzing career vulnerability and resilience using labor market data, \
automation research, and individual career profiles.

CRITICAL RULES:
1. NEVER catastrophize or use fear-inducing language.
2. Every threat MUST be paired with a constructive opportunity.
3. Frame automation risk as a spectrum, not a binary.
4. Confidence scores reflect certainty of the analysis (0.0-1.0).
5. Maximum confidence for any projection is 0.85 (inherent uncertainty).
6. Scores labeled "indicative, not deterministic" — never absolute.
7. Base all analysis on professional data, NEVER demographics.
8. Return your response as a valid JSON object matching the schema exactly.
"""

# ── Automation Risk Scoring ────────────────────────────────────

AUTOMATION_RISK_VERSION = "1.0.0"

AUTOMATION_RISK_USER_PROMPT = """\
Analyze the automation risk for this professional using their Career DNA \
and the ONET baseline data.

ONET BASELINE:
---
SOC Code: {soc_code}
Occupation: {occupation_title}
Frey-Osborne Base Probability: {base_probability}
---

CAREER DNA SUMMARY:
---
Skills: {skills_summary}
Experience: {experience_summary}
Years of Experience: {years_experience}
---

INSTRUCTIONS:
1. Start from the ONET base probability as a baseline.
2. Adjust UP (more risk) if the user lacks modern/evolving skills.
3. Adjust DOWN (less risk) if the user has strong bottleneck skills \
(creativity, social intelligence, complex perception).
4. Identify specific tasks that are vulnerable vs resilient.
5. Recommend skills to develop that would reduce exposure.
6. Generate opportunity_inversions: for each major threat, provide \
a specific, actionable career opportunity.

Return a JSON object with these exact keys:
- contextual_risk_score: float 0-100 (adjusted from base probability)
- risk_level: string (one of: low, medium, high)
- vulnerable_tasks: array of strings (tasks most at risk)
- resilient_tasks: array of strings (tasks that protect this professional)
- recommended_skills: array of objects with keys "skill" (string) and \
"reason" (string explaining why this skill reduces exposure)
- analysis_reasoning: string (2-3 sentences explaining the risk assessment, \
framed constructively)
- opportunity_inversions: array of objects with keys "threat" (string), \
"opportunity" (string describing actionable career pathway), \
"estimated_impact" (string e.g. "could reduce exposure by ~15%")
"""

# ── Industry Trend Analysis ────────────────────────────────────

INDUSTRY_TREND_VERSION = "1.0.0"

INDUSTRY_TREND_USER_PROMPT = """\
Analyze the current trajectory of the following industry, personalized \
to this professional's Career DNA.

INDUSTRY: {industry_name}
PROFESSIONAL'S SKILLS: {skills_summary}
PROFESSIONAL'S EXPERIENCE: {experience_summary}

INSTRUCTIONS:
1. Assess the overall health and direction of this industry.
2. Identify key signals (technological shifts, regulatory changes, \
market forces) affecting this industry.
3. Evaluate the specific impact on THIS professional given their skills.
4. Generate recommended actions as Threat→Opportunity inversions.

Return a JSON object with these exact keys:
- trend_direction: string (one of: growing, stable, declining, disrupted)
- confidence: float 0.0-0.85 (how confident you are in this assessment)
- key_signals: array of objects with keys "signal" (string), \
"impact" (string: positive/negative/neutral), "timeframe" (string)
- impact_on_user: string (2-3 sentences personalized to this professional)
- recommended_actions: array of objects with keys "action" (string), \
"rationale" (string), "urgency" (string: low/medium/high)
- data_sources: array of strings (general categories of evidence used)
"""

# ── Skills Shield™ Classification ──────────────────────────────

SKILLS_SHIELD_VERSION = "1.0.0"

SKILLS_SHIELD_USER_PROMPT = """\
Classify each of this professional's skills using the Frey-Osborne \
bottleneck framework for automation resistance.

PROFESSIONAL'S SKILLS:
---
{skills_list}
---

ONET BOTTLENECK REFERENCE:
---
Occupation: {occupation_title}
Perception/Manipulation Score: {perception_score}
Creative Intelligence Score: {creative_score}
Social Intelligence Score: {social_score}
---

CLASSIFICATION RULES:
- SHIELD: Skills that score HIGH on at least 2 of 3 bottleneck dimensions \
(creativity, social intelligence, perception/manipulation). These protect \
against automation.
- EXPOSURE: Skills that score LOW on all bottleneck dimensions AND are \
primarily procedural/routine. These increase vulnerability.
- NEUTRAL: Skills that don't strongly fit either category.

For each skill, also provide:
- automation_resistance: float 0.0-1.0 (how resistant this specific skill is)
- market_demand_trend: string (growing/stable/declining)
- reasoning: why this classification was chosen
- improvement_path: for EXPOSURE skills, what adjacent skill would shift \
this toward SHIELD status

Return a JSON object with this exact key:
- classifications: array of objects with keys "skill_name" (string), \
"classification" (string: shield/exposure/neutral), \
"automation_resistance" (float 0.0-1.0), \
"market_demand_trend" (string), "reasoning" (string), \
"improvement_path" (string or null)
"""

# ── Threat Assessment (Threat→Opportunity Inversion) ───────────

THREAT_ASSESSMENT_VERSION = "1.0.0"

THREAT_ASSESSMENT_USER_PROMPT = """\
Generate career threat alerts for this professional based on the \
analysis data below. EVERY alert MUST include an opportunity.

AUTOMATION RISK:
---
Risk Score: {risk_score}/100
Risk Level: {risk_level}
Vulnerable Tasks: {vulnerable_tasks}
---

INDUSTRY TRENDS:
---
{industry_trends_summary}
---

SKILLS SHIELD STATUS:
---
Shields: {shield_skills}
Exposures: {exposure_skills}
---

CAREER DNA:
---
Skills: {skills_summary}
Experience: {experience_summary}
---

ALERT GENERATION RULES:
1. Generate 1-5 alerts based on actual signals (don't manufacture threats).
2. Each alert has severity: low (informational), medium (actionable), \
high (urgent — requires ≥2 supporting signals).
3. MANDATORY: every alert must have an "opportunity" field with a \
specific, actionable recommendation.
4. Categories: automation_risk, industry_decline, skill_obsolescence, \
layoff_signal, market_shift.
5. Use empowering language, not fear-inducing language.

Return a JSON object with this exact key:
- alerts: array of objects with keys "category" (string), \
"severity" (string: low/medium/high), "title" (string, max 80 chars), \
"description" (string, 1-2 sentences), \
"opportunity" (string, specific actionable recommendation), \
"evidence" (object with key "sources" array of strings describing \
the signals that support this alert)
"""

# Sprint 9 — Career Threat Radar™: Quality Gate Research & Implementation Plan

> **Quality Gate Protocol**: Steps 1–7 executed | **Trust-Grade Enhancement**: Authorized
> **Date**: 2026-02-15
> **Sprint**: 9 of 12
> **Status**: 🔒 PENDING PRODUCT OWNER APPROVAL

---

## Step 1: Market Research

Researched across **8 competitors** in the career intelligence / workforce planning domain:

| Platform                     | Category               | Relevance                                                                  |
| :--------------------------- | :--------------------- | :------------------------------------------------------------------------- |
| **LinkedIn** Career Insights | Consumer + Enterprise  | Economic Graph, skill demand trends, talent supply/demand                  |
| **Eightfold AI**             | Enterprise HR          | Deep learning talent matching, skills ontology, workforce planning         |
| **Gloat**                    | Enterprise HR          | Internal talent marketplace, Skills Landscape, at-risk role detection      |
| **Workday** Skills Cloud     | Enterprise HCM         | AI-inferred skills, automation impact scoring, Career Hub                  |
| **Teal HQ**                  | Consumer career tool   | Job tracker, resume builder, skill gap analysis — **no** threat monitoring |
| **Jobscan**                  | Consumer ATS optimizer | Keyword matching, resume scoring — **no** career risk features             |
| **O\*NET / Frey-Osborne**    | Academic research      | 702-occupation automation probability dataset, Gaussian process classifier |
| **BLS / WARN Act**           | Government data        | Official layoff data, industry employment projections                      |

### Key Findings

1. **No consumer-grade career threat radar exists.** Enterprise platforms (Eightfold, Gloat, Workday) provide threat intelligence but lock it behind $100K+ contracts. Consumer tools (Teal, Jobscan) focus exclusively on job search optimization — they do not proactively warn users about career risks.

2. **Enterprise patterns are clear and proven:**
   - Skill-vs-market demand gap analysis (all 3 enterprise players)
   - Automation susceptibility scoring per role (Workday, Eightfold)
   - Industry disruption signal tracking (Gloat Skills Planner)
   - Proactive alert feeds with actionable recommendations (all 3)

3. **ONET + Frey-Osborne is the gold standard** for automation risk. The Oxford methodology uses 702 O\*NET occupation descriptions, rates them via Gaussian process classifier against 3 bottleneck dimensions (perception/manipulation, creativity, social intelligence). Published 2013, still cited by OECD, WEF, and BLS.

4. **Career Resilience is the emerging frontier (2025–2026).** Mercer, WEF, Forbes, and Gartner all identify "career resilience" as the next evolution beyond threat detection — but **no platform has productized it** as a composite, explainable metric for individuals.

5. **Career Moat (Warren Buffett analogy)** is gaining traction as a framework for individual career defensibility. No platform computes it. This represents a greenfield opportunity.

---

## Step 2: Comparative Analysis

| Feature                        | LinkedIn           | Eightfold                  | Gloat                     | Workday              | PathForge (Current) | PathForge (Proposed)       |
| :----------------------------- | :----------------- | :------------------------- | :------------------------ | :------------------- | :------------------ | :------------------------- |
| **Skill demand trends**        | ✅ Economic Graph  | ✅ Job Intelligence Engine | ✅ Skills Landscape       | ✅ Skills Cloud      | ❌ None             | ✅ vs. Career DNA          |
| **Automation risk score**      | ❌                 | ✅ Role risk analysis      | ✅ At-risk role detection | ✅ Automation impact | ❌ None             | ✅ Hybrid (ONET + LLM)     |
| **Layoff signal detection**    | ❌                 | ❌                         | ❌                        | ❌                   | ❌ None             | ✅ WARN Act + news signals |
| **Proactive career alerts**    | ⚠️ Job alerts only | ✅ Enterprise only         | ✅ Enterprise only        | ✅ Enterprise only   | ❌ None             | ✅ In-app → extendable     |
| **Career Resilience Score**    | ❌                 | ❌                         | ❌                        | ❌                   | ❌ None             | ✅ **PathForge FIRST**     |
| **Career Moat Analysis**       | ❌                 | ❌                         | ❌                        | ❌                   | ❌ None             | ✅ **PathForge FIRST**     |
| **Skills Shield™ Matrix**      | ❌                 | ❌                         | ⚠️ Skills Landscape       | ⚠️ Skills Cloud      | ❌ None             | ✅ **PathForge FIRST**     |
| **Threat→Opportunity Pairing** | ❌                 | ❌                         | ❌                        | ❌                   | ❌ None             | ✅ **PathForge FIRST**     |
| **Individual-focused**         | ⚠️ Limited         | ❌ Enterprise only         | ❌ Enterprise only        | ❌ Enterprise only   | ✅ Core focus       | ✅ Core focus              |
| **Explainable scoring**        | ❌ Opaque          | ❌ Opaque                  | ⚠️ Partial                | ❌ Opaque            | N/A                 | ✅ Full transparency       |
| **Data sovereignty**           | ❌                 | ❌                         | ❌                        | ❌                   | ✅ GDPR-native      | ✅ GDPR-native             |
| **User autonomy**              | Low                | None                       | None                      | None                 | Full                | Full (human-in-the-loop)   |

---

## Step 3: Gap Detection

### Where PathForge Already Exceeds Market

- ✅ **Individual-first**: Only platform making enterprise-grade intelligence available to individuals
- ✅ **GDPR-native data sovereignty**: User owns all data, can delete at will
- ✅ **Career DNA™ foundation**: 6-dimension career profile provides the richest input for threat analysis
- ✅ **Transparent scoring**: Every recommendation is explainable (Manifesto principle #6)
- ✅ **Prompt injection defense**: 8-layer sanitization already deployed

### Where PathForge Is Below Market Level (Closing in Sprint 9)

- ❌ **No career risk monitoring** → Career Threat Radar™ closes this gap
- ❌ **No automation risk scoring** → Hybrid ONET + LLM scoring
- ❌ **No industry trend tracking** → LLM-powered trend analysis
- ❌ **No proactive alerting system** → Event-driven alert engine

---

## Step 4: Enhancement Strategy — 4 Proprietary Innovations

> [!IMPORTANT]
> These 4 innovations are **not replications** — they are concepts that **no competitor offers**. Each is grounded in validated industry research (WEF, Mercer, Taleb, Buffett) but productized as consumer-grade features for the first time.

### Innovation 1: Career Resilience Score™ (CRS)

**What it is:** A composite 0–100 metric measuring how well a user's career withstands disruption.

**Why no one has this:** Eightfold/Gloat/Workday all measure _threat exposure_ but **none** compute a positive _resilience_ metric. LinkedIn shows demand trends but not individual defensibility. Mercer and WEF both identify "career resilience" as the critical frontier but no product has materialised it.

**How it works — 5-factor weighted formula:**

| Factor                | Weight | Source                          | What It Measures                                       |
| :-------------------- | :----- | :------------------------------ | :----------------------------------------------------- |
| Skill Diversity Index | 25%    | Career DNA Skills Genome        | Breadth of transferable skills across domains          |
| Automation Resistance | 25%    | ONET + LLM hybrid score         | How resistant current role is to automation            |
| Growth Velocity       | 20%    | Career DNA Growth Vector        | Rate of skill acquisition and trajectory               |
| Industry Stability    | 15%    | Industry Trend analysis         | Health of user's primary industry                      |
| Adaptability Signal   | 15%    | Career DNA Experience Blueprint | Career pivots, cross-industry moves, learning velocity |

**PathForge advantage:** Fully explainable. Every factor has a visible weight and a narrative explanation. Users see _exactly_ why their score is what it is, and _exactly_ what to improve. Enterprise tools like Eightfold compute internal scores but never show the user.

---

### Innovation 2: Skills Shield™ Matrix

**What it is:** A visual classification of a user's skills into **Shields** (protect against automation/disruption) and **Exposures** (increase vulnerability).

**Why no one has this:** Gloat has "Skills Landscape" and Workday has "Skills Cloud", but neither frames skills as _protective vs. vulnerable_. They show demand levels but not defensive posture. The "career moat" framework (Warren Buffett's competitive advantage concept applied to careers) provides the theoretical foundation.

**How it works:**

```
┌──────────────────────────────────────────────────────┐
│                  SKILLS SHIELD™ MATRIX                │
├──────────────────────┬───────────────────────────────┤
│   🛡️ SHIELDS         │   ⚠️ EXPOSURES               │
│   (Protect You)      │   (Increase Vulnerability)   │
├──────────────────────┼───────────────────────────────┤
│ System Architecture  │ Manual Testing               │
│ Stakeholder Mgmt     │ Data Entry Workflows         │
│ Strategic Planning   │ Routine Code Generation      │
│ Ethical AI Judgment   │ Template-Based Reporting     │
├──────────────────────┼───────────────────────────────┤
│ Moat Strength: 72%   │ Exposure Level: 28%          │
└──────────────────────┴───────────────────────────────┘
```

**Classification methodology:**

- **Shields**: Skills scoring HIGH on Frey-Osborne bottleneck dimensions (creativity, social intelligence, perception/manipulation)
- **Exposures**: Skills scoring LOW on bottleneck dimensions AND mapped to high-automation ONET occupational tasks
- Cross-referenced with Career DNA proficiency levels for personalization

---

### Innovation 3: Threat→Opportunity Inversion Engine

**What it is:** Every threat signal is **automatically paired** with a concrete, actionable opportunity recommendation.

**Why no one has this:** Enterprise platforms show threats but leave actionable guidance to HR teams. LinkedIn sends generic "you might like these jobs" alerts. No platform systematically inverts threats into specific, personalized growth pathways.

**The anti-anxiety design principle:** Threat radar systems risk causing career anxiety. The inversion engine ensures users **never see a threat without a pathway**. This is both an ethical safeguard and a UX differentiator.

**How it works:**

| Threat Signal                                            | Automated Inversion                                                                                                                       | Source                          |
| :------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------ |
| "Your role has 68% automation probability"               | "Your system design and stakeholder management skills form a strong moat. Strengthening cloud architecture would reduce exposure by ~15%" | ONET + Career DNA               |
| "Your industry (retail tech) is showing decline signals" | "Your Python + data skills transfer to healthcare tech (growing +12% YoY). 3 of your top skills directly match."                          | Industry Trend + Skills Genome  |
| "Skill X is becoming obsolete"                           | "Skill Y (adjacent, growing demand) leverages 80% of the same knowledge base. Estimated learning curve: 3 months."                        | Skills Genome + Market Position |

**Implementation:** Inversion prompts are built into the LLM analysis pipeline — the AI generates both the threat assessment AND the opportunity recommendation in a single analysis call, ensuring they are contextually coherent.

---

### Innovation 4: Career Moat Score (Defensive Depth Analysis)

**What it is:** A single metric (0–100) measuring how _defensible_ a user's career position is — borrowed from Warren Buffett's concept of competitive moats applied to individual careers.

**Why no one has this:** The "career moat" is a popular concept in career strategy writing (Medium, Forbes, LinkedIn articles) but **no platform has quantified it**. Competitive moat analysis exists for companies (Morningstar rates company moats); PathForge does it for people.

**4-dimension moat framework:**

| Dimension             | What It Measures                                        | Compute Method                                                   |
| :-------------------- | :------------------------------------------------------ | :--------------------------------------------------------------- |
| **Skill Rarity**      | How uncommon your skill combination is                  | Inverse of skill frequency in ONET + market data                 |
| **Switching Cost**    | How costly it is for an employer to replace you         | Years of experience × domain depth × relationship capital        |
| **Network Effect**    | How your value grows with connections and influence     | Career DNA experience pattern + cross-functional markers         |
| **Intangible Assets** | Certifications, patents, publications, domain expertise | Career DNA explicit markers + LLM inference from experience text |

**PathForge advantage:** This gives users a proactive, positive-framed metric. Instead of "you're at risk" (anxiety-inducing), it says "your career moat is 74/100 — here's how to widen it" (empowering).

---

## Step 5: Ethics, Bias & Automation Risk Assessment

| Risk                              | Assessment                                     | Mitigation                                                                                                                   |
| :-------------------------------- | :--------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| **Fear-inducing UX**              | Threat radar could cause anxiety               | MUST pair every threat with an opportunity via Inversion Engine. CRS and Moat Score provide positive framing.                |
| **AI bias in automation scoring** | ONET dataset reflects U.S. occupational norms  | Supplement with LLM contextual reasoning; label scores as "indicative, not deterministic"; add user self-assessment override |
| **GDPR / personal data**          | Threat analysis processes career history       | All analysis derived from existing Career DNA; no new PII collection; leverage existing GDPR deletion endpoint               |
| **Catastrophizing**               | System could overstate threats                 | 3-tier severity (Low/Medium/High); require ≥2 signal sources for "High"; include confidence intervals                        |
| **Score anxiety**                 | Users could obsess over resilience/moat scores | Display scores alongside clear improvement actions; use "improvement available" framing, not "you're failing"                |
| **Automation safety**             | LLM calls for analysis                         | Rate limiting (3/min for scan); prompt sanitization deployed; dedicated rate limits per endpoint                             |
| **User autonomy**                 | Alerts could feel prescriptive                 | Users can dismiss, snooze, or disable alert categories; all recommendations are suggestions, never mandates                  |

---

## Step 6: Implementation Plan

### 6.1 Recommended Answers to Socratic Questions

#### Q1: Data Sources — **Models first + ONET static data**

> **Tier-1 Methodology**: Build the full domain model + service layer + AI pipeline with:
>
> - **ONET static data** for automation risk (free, proven, public domain Frey-Osborne dataset)
> - **Curated seed data** for industry trends (hand-crafted scenarios)
> - **Defer live API integrations** (NewsAPI, BLS feeds) to Sprint 10+
>
> **Why**: Eightfold, Gloat, and Workday all started with structured data before layering live feeds.

#### Q2: Automation Risk Scoring — **Hybrid (ONET + LLM + Innovations)**

> 1. **Base score**: Map user's role → ONET SOC code → Frey-Osborne automation probability
> 2. **Contextual adjustment**: LLM analyzes user's Career DNA against the base score
> 3. **Skills Shield™**: Classify each skill as Shield or Exposure via bottleneck dimension mapping
> 4. **Career Resilience Score™**: Composite 5-factor metric (computed from all available signals)
> 5. **Career Moat Score**: 4-dimension defensibility metric
> 6. **Threat→Opportunity Inversion**: Auto-pair every threat with an actionable recommendation

#### Q3: Alert System — **In-app feed with extensible architecture**

> Sprint 9: `ThreatAlert` model + in-app feed + user preferences
> Architecture: `AlertChannel` enum (`IN_APP`, `EMAIL`, `PUSH`) — only `IN_APP` now
> Sprint 10+: Layer email/push via the same architecture

---

### 6.2 Architecture Overview

```
┌────────────────────────────────────────────────────────────────┐
│                    CAREER THREAT RADAR™                         │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐   │
│  │  Industry       │  │  Automation    │  │  Skills Shield™ │   │
│  │  Trend          │  │  Risk Scorer   │  │  Classifier     │   │
│  │  Analyzer       │  │  (ONET + LLM)  │  │  (Bottleneck    │   │
│  │  (LLM)          │  │                │  │   Dimension)    │   │
│  └────────┬───────┘  └────────┬───────┘  └───────┬─────────┘   │
│           │                    │                   │             │
│  ┌────────┴────────────────────┴───────────────────┴──────┐     │
│  │           Signal Fusion Engine                          │     │
│  │  ┌──────────────────────────────────────────────────┐  │     │
│  │  │  Career Resilience Score™   Career Moat Score    │  │     │
│  │  │  (5-factor composite)       (4-dimension)        │  │     │
│  │  └──────────────────────────────────────────────────┘  │     │
│  │  - Aggregates all threat signals                       │     │
│  │  - Inverts threats → opportunities                     │     │
│  │  - Generates explainability narratives                 │     │
│  └──────────────────────┬─────────────────────────────────┘     │
│                         │                                        │
│  ┌──────────────────────┴────────────────────────────────┐      │
│  │                 Alert Engine                            │      │
│  │  - Severity-tiered dispatch                             │      │
│  │  - Channel routing (IN_APP → EMAIL → PUSH)              │      │
│  │  - User preference filtering                            │      │
│  └─────────────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────────┘
```

### 6.3 File-Level Breakdown

#### Data Layer

| File                                   | Action    | Description                                                                                                                                 |
| :------------------------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `app/models/threat_radar.py`           | **[NEW]** | `AutomationRisk`, `IndustryTrend`, `SkillShieldEntry`, `ThreatAlert`, `AlertPreference`, `CareerResilienceSnapshot` — 6 models + 7 StrEnums |
| `app/schemas/threat_radar.py`          | **[NEW]** | Pydantic schemas: request/response DTOs for all endpoints + composite score schemas                                                         |
| `alembic/versions/xxx_threat_radar.py` | **[NEW]** | Migration for 6 new tables                                                                                                                  |

#### AI Pipeline

| File                                 | Action    | Description                                                                                                                                                              |
| :----------------------------------- | :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/ai/threat_radar_analyzer.py`    | **[NEW]** | `ThreatRadarAnalyzer`: `analyze_industry_trends()`, `score_automation_risk()`, `classify_skills_shield()`, `generate_threat_assessment()` + Threat→Opportunity inversion |
| `app/ai/prompts/threat_radar/`       | **[NEW]** | Versioned prompt templates: trend analysis, risk scoring, skill classification, opportunity inversion                                                                    |
| `app/data/onet_automation_risk.json` | **[NEW]** | Curated ONET Frey-Osborne dataset (702 SOC codes with automation probabilities)                                                                                          |

#### Service Layer

| File                                   | Action    | Description                                                                                                                    |
| :------------------------------------- | :-------- | :----------------------------------------------------------------------------------------------------------------------------- |
| `app/services/threat_radar_service.py` | **[NEW]** | Signal Fusion Engine: analysis → Skills Shield → CRS computation → Moat computation → alert generation → opportunity inversion |

#### API Layer

| File                         | Action       | Description                  |
| :--------------------------- | :----------- | :--------------------------- |
| `app/api/v1/threat_radar.py` | **[NEW]**    | 10 REST endpoints (see §6.5) |
| `app/api/v1/router.py`       | **[MODIFY]** | Register threat_radar router |

#### Tests

| File                         | Action    | Description                                                                                                    |
| :--------------------------- | :-------- | :------------------------------------------------------------------------------------------------------------- |
| `tests/test_threat_radar.py` | **[NEW]** | Model integrity, CRS formula, Moat computation, Skills Shield classification, service lifecycle, API endpoints |

### 6.4 Model Design

```python
# ── Enums ──────────────────────────────────────────
class AlertSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class AlertCategory(str, enum.Enum):
    AUTOMATION_RISK = "automation_risk"
    INDUSTRY_DECLINE = "industry_decline"
    SKILL_OBSOLESCENCE = "skill_obsolescence"
    LAYOFF_SIGNAL = "layoff_signal"
    MARKET_SHIFT = "market_shift"

class AlertChannel(str, enum.Enum):
    IN_APP = "in_app"           # Sprint 9
    EMAIL = "email"             # Sprint 10+
    PUSH = "push"               # Sprint 10+

class AlertStatus(str, enum.Enum):
    UNREAD = "unread"
    READ = "read"
    DISMISSED = "dismissed"
    SNOOZED = "snoozed"
    ACTED_ON = "acted_on"

class TrendDirection(str, enum.Enum):
    GROWING = "growing"
    STABLE = "stable"
    DECLINING = "declining"
    DISRUPTED = "disrupted"

class ShieldClassification(str, enum.Enum):
    SHIELD = "shield"           # Protects against disruption
    EXPOSURE = "exposure"       # Increases vulnerability
    NEUTRAL = "neutral"         # Minimal impact

class MoatStrength(str, enum.Enum):
    WIDE = "wide"               # 75-100: strong defensive position
    NARROW = "narrow"           # 40-74: moderate protection
    NONE = "none"               # 0-39: vulnerable

# ── AutomationRisk ─────────────────────────────────
class AutomationRisk(Base):
    career_dna_id: FK → CareerDNA
    onet_soc_code: str              # e.g. "15-1252.00"
    onet_occupation_title: str      # e.g. "Software Developers"
    base_automation_probability: float  # Frey-Osborne (0.0-1.0)
    contextual_risk_score: float    # LLM-adjusted (0-100)
    risk_level: AlertSeverity
    vulnerable_tasks: JSON          # tasks most at risk
    resilient_tasks: JSON           # tasks that protect you
    recommended_skills: JSON        # skills to develop
    analysis_reasoning: str         # explainability narrative
    opportunity_inversions: JSON    # threat→opportunity pairings
    analyzed_at: datetime

# ── SkillShieldEntry ───────────────────────────────
class SkillShieldEntry(Base):
    career_dna_id: FK → CareerDNA
    skill_name: str
    classification: ShieldClassification
    automation_resistance: float    # 0.0-1.0 bottleneck score
    market_demand_trend: TrendDirection
    reasoning: str                  # why this classification
    improvement_path: str | None    # how to strengthen this skill

# ── CareerResilienceSnapshot ───────────────────────
class CareerResilienceSnapshot(Base):
    career_dna_id: FK → CareerDNA
    overall_score: float            # 0-100 composite CRS
    skill_diversity_index: float    # 0-100 (weight: 25%)
    automation_resistance: float    # 0-100 (weight: 25%)
    growth_velocity: float          # 0-100 (weight: 20%)
    industry_stability: float       # 0-100 (weight: 15%)
    adaptability_signal: float      # 0-100 (weight: 15%)
    moat_score: float               # 0-100 Career Moat
    moat_strength: MoatStrength
    explanation: str                # human-readable narrative
    improvement_actions: JSON       # top 3 actionable steps
    computed_at: datetime

# ── IndustryTrend ──────────────────────────────────
class IndustryTrend(Base):
    career_dna_id: FK → CareerDNA
    industry_name: str
    trend_direction: TrendDirection
    confidence: float (0-1)
    key_signals: JSON
    impact_on_user: str             # personalized narrative
    recommended_actions: JSON       # opportunity inversion
    data_sources: JSON              # provenance tracking
    analyzed_at: datetime

# ── ThreatAlert ────────────────────────────────────
class ThreatAlert(Base):
    career_dna_id: FK → CareerDNA
    category: AlertCategory
    severity: AlertSeverity
    title: str
    description: str                # threat narrative
    opportunity: str                # inversion: paired recommendation
    evidence: JSON                  # supporting data points
    channel: AlertChannel
    status: AlertStatus
    snoozed_until: datetime | None
    created_at: datetime
    read_at: datetime | None

# ── AlertPreference ────────────────────────────────
class AlertPreference(Base):
    career_dna_id: FK → CareerDNA (unique)
    enabled_categories: JSON        # list of AlertCategory
    min_severity: AlertSeverity
    enabled_channels: JSON          # list of AlertChannel
    quiet_hours_start: time | None
    quiet_hours_end: time | None
```

### 6.5 API Endpoints

| Method  | Path                                   | Auth | Rate Limit | Description                                             |
| :------ | :------------------------------------- | :--- | :--------- | :------------------------------------------------------ |
| `GET`   | `/api/v1/threat-radar`                 | ✅   | 30/min     | Full threat assessment (CRS + Moat + latest alerts)     |
| `POST`  | `/api/v1/threat-radar/scan`            | ✅   | 3/min      | Trigger new comprehensive threat analysis               |
| `GET`   | `/api/v1/threat-radar/resilience`      | ✅   | 30/min     | Career Resilience Score™ breakdown                      |
| `GET`   | `/api/v1/threat-radar/moat`            | ✅   | 30/min     | Career Moat Score with 4-dimension detail               |
| `GET`   | `/api/v1/threat-radar/skills-shield`   | ✅   | 30/min     | Skills Shield™ Matrix (shields vs exposures)            |
| `GET`   | `/api/v1/threat-radar/automation-risk` | ✅   | 30/min     | Automation risk breakdown with inversion                |
| `GET`   | `/api/v1/threat-radar/trends`          | ✅   | 30/min     | Industry trend analysis                                 |
| `GET`   | `/api/v1/threat-radar/alerts`          | ✅   | 30/min     | Alert feed (paginated, filterable by category/severity) |
| `PATCH` | `/api/v1/threat-radar/alerts/{id}`     | ✅   | 30/min     | Update alert status (read, dismiss, snooze)             |
| `PUT`   | `/api/v1/threat-radar/preferences`     | ✅   | 10/min     | Update alert preferences                                |

### 6.6 Execution Order

| Phase | Task                                                          | Depends On | Estimated Complexity |
| :---- | :------------------------------------------------------------ | :--------- | :------------------- |
| 1     | Models (6 tables) + Schemas + Migration                       | —          | Medium               |
| 2     | ONET data curation (JSON seed)                                | —          | Low                  |
| 3     | AI Analyzer (4 LLM methods + Skills Shield classifier)        | Phase 1, 2 | High                 |
| 4     | Service Layer (Signal Fusion Engine + CRS/Moat computation)   | Phase 3    | High                 |
| 5     | API Endpoints (10 routes) + Router Registration               | Phase 4    | Medium               |
| 6     | Tests (model, CRS formula, Moat, Skills Shield, service, API) | Phase 5    | Medium               |
| 7     | Lint + Full Regression + Commit                               | Phase 6    | Low                  |

### 6.7 Dependencies & Blockers

| Item                      | Status       | Notes                                 |
| :------------------------ | :----------- | :------------------------------------ |
| Career DNA models/service | ✅ Complete  | Threat Radar is built atop Career DNA |
| Prompt sanitizer          | ✅ Complete  | Applied to all new LLM methods        |
| Rate limiting infra       | ✅ Complete  | Per-endpoint limits applied           |
| ONET public dataset       | ✅ Available | Free, public domain — needs curation  |
| Live API integrations     | ⏳ Deferred  | NewsAPI, BLS → Sprint 10+             |
| Email notifications       | ⏳ Deferred  | Requires email infra → Sprint 10+     |

---

## Step 7: Verification Plan

### Automated Tests

- Model integrity tests (6 tables, 7 enum constraints, FK cascades)
- CRS formula unit tests (weight validation, edge cases, score bounds)
- Career Moat computation tests (4-dimension scoring, strength classification)
- Skills Shield classification tests (bottleneck dimension mapping)
- Threat→Opportunity inversion tests (every threat must produce an opportunity)
- Service layer tests (full analysis lifecycle, alert generation)
- API endpoint tests (auth, rate limits, pagination, filtering)
- `ruff check` on all modified files
- Full regression: `pytest tests/ -q` (target: 200+ tests)

### Manual Verification

- Review ONET data quality for top-20 tech occupations
- Verify CRS and Moat scores produce intuitive results for known career profiles
- Confirm Skills Shield classifications align with Frey-Osborne bottleneck dimensions
- Verify all alerts have paired opportunity inversions (zero warnings without pathways)

---

## Innovation Summary: PathForge vs. Market

```
                    EVERYONE ELSE                    PATHFORGE
                    ─────────────                    ─────────
                    ❌ Threat Detection Only         ✅ Threat + Resilience + Moat
                    ❌ Enterprise-locked ($100K+)    ✅ Individual-first (free)
                    ❌ Opaque scoring                ✅ Fully explainable
                    ❌ Threats without actions        ✅ Every threat → opportunity
                    ❌ Fragmented skill views         ✅ Skills Shield Matrix
                    ❌ No positive metrics            ✅ CRS + Moat = empowering
                    ❌ Employer-controlled            ✅ User-sovereign (GDPR-native)
```

> **⏳ This plan requires Product Owner approval before implementation may begin.**

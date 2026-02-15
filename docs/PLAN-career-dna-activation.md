# PLAN — Sprint 8: Career DNA Activation

> **Sprint**: 8 · **Phase**: B (Career Intelligence)
> **Scope**: Backend-only (models, services, API endpoints, tests)
> **Created**: 2026-02-15 · **Status**: PENDING APPROVAL

---

## Quality Gate Research Report

### Step 1: Market Research (7+ Competitors)

| Platform         | Category               | Approach                                                                                              | Hidden Skills?                    | Growth Vector?                  | Individual Users?      |
| :--------------- | :--------------------- | :---------------------------------------------------------------------------------------------------- | :-------------------------------- | :------------------------------ | :--------------------- |
| **Eightfold AI** | Enterprise HR ($100K+) | Deep learning on 1B+ profiles; taxonomy-free skill inference; agentic AI for screening                | ✅ Inferred from context          | ✅ Predictive career paths      | ❌ Employer-only       |
| **Gloat**        | Enterprise HR ($100K+) | Task-level Workforce Graph; Skills Foundation AI; Signal/Mosaic/Ascend modules                        | ✅ Cross-reference market data    | ✅ Skills Planner tracks growth | ❌ Employer-only       |
| **LinkedIn**     | Professional Network   | Hybrid NLP: trie-based token matching + fine-tuned BERT models; 200 edits/sec; knowledge distillation | ✅ Infers from summary/experience | ⚠️ Adjacent skills only         | ✅ Free tier available |
| **Teal**         | Job Search Tool        | Keyword extraction from JDs; match score against resume; ATS optimization                             | ⚠️ JD keyword matching only       | ⚠️ Career Goal Tracker (manual) | ✅ Free + paid plans   |
| **Huntr**        | Job Tracker            | AI extracts keywords/qualifications from JDs; match score; achievement generator                      | ❌ No discovery                   | ❌ No growth tracking           | ✅ Free + paid plans   |
| **Jobscan**      | ATS Optimizer          | Keyword comparison (30+ parameters); hard/soft skill detection; match rate scoring                    | ❌ No discovery                   | ❌ No growth tracking           | ✅ Free + paid plans   |
| **Fuel50**       | Enterprise HR          | Career pathing; skills ontology mapping; talent marketplace                                           | ✅ Skills-based matching          | ✅ Career pathways              | ❌ Employer-only       |

**Key Insight**: Enterprise platforms (Eightfold, Gloat, Fuel50) have sophisticated Career DNA equivalents, but they're locked behind $100K+ contracts. Consumer-facing tools (Teal, Huntr, Jobscan) offer keyword matching only — zero career intelligence, zero hidden skills, zero growth vectors.

### Step 2: Comparative Analysis

| Capability            | Eightfold                      | Gloat                  | LinkedIn                 | Teal                 | PathForge (Target)                         |
| :-------------------- | :----------------------------- | :--------------------- | :----------------------- | :------------------- | :----------------------------------------- |
| **Skills Taxonomy**   | Taxonomy-free deep learning    | Proprietary ontology   | 40K+ skills graph        | JD keyword list      | Hybrid: LLM + semantic + market            |
| **Hidden Skills**     | Context inference from profile | Cross-reference market | BERT inference from text | None                 | **A+B combined** (LLM + market cross-ref)  |
| **Growth Vector**     | Predictive career paths        | Skills Planner         | Adjacent skills map      | Manual goal tracker  | **Multi-signal trajectory projection**     |
| **Values Alignment**  | None visible                   | Team/culture matching  | None                     | Work style quiz      | **LLM-extracted from experience patterns** |
| **Market Position**   | Talent benchmarking            | Workforce intelligence | Premium Insights         | None                 | **Real-time skill demand scoring**         |
| **Opportunity Radar** | Internal talent marketplace    | Internal mobility      | Job recommendations      | Job tracker          | **Proactive semantic matching**            |
| **Explainability**    | Low (black box)                | Low                    | Medium                   | High (keyword-based) | **Full — every score explained**           |
| **Privacy**           | Employer-controlled            | Employer-controlled    | Platform-controlled      | User-controlled      | **GDPR-native, user-sovereign**            |
| **Individual Access** | ❌                             | ❌                     | ⚠️ Limited               | ✅                   | ✅ **Full intelligence**                   |

### Step 3: Gap Detection

**Where PathForge already meets/exceeds market**:

- ✅ Semantic matching over keyword matching (Voyage AI v4)
- ✅ LLM-powered resume parsing with structured output
- ✅ Multi-tier LLM routing (Primary/Fast/Deep)
- ✅ GDPR-native privacy architecture
- ✅ Human-in-the-loop automation controls

**Where PathForge is BELOW market**:

- 🔴 No Career DNA profile exists yet (static resume only)
- 🔴 No hidden skills discovery
- 🔴 No growth vector or trajectory tracking
- 🔴 No values alignment profiling
- 🔴 No market position benchmarking
- 🔴 No proactive opportunity matching

**Outdated patterns to avoid**:

- ❌ Keyword-only skill extraction (Jobscan/Huntr approach)
- ❌ Static skill lists without market context
- ❌ Manual goal tracking without AI guidance
- ❌ Black-box scoring without explainability

### Step 4: Enhancement Strategy (PathForge Advantages)

| Enhancement Area   | Industry Standard             | PathForge Approach                                                                                                    | Why Superior                                                       |
| :----------------- | :---------------------------- | :-------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| **Hidden Skills**  | Single-source extraction      | **Dual-source**: (A) LLM inference from experience descriptions + (B) market cross-reference from aggregated job data | Discovers both implicit competencies AND market-validated skills   |
| **Growth Vector**  | Linear career path prediction | **Multi-signal projection**: skill trajectory + market demand curves + role evolution patterns                        | More accurate; accounts for market dynamics, not just past pattern |
| **Explainability** | Black-box scores              | **Every dimension scored with reasoning**: editable, challengeable, with confidence intervals                         | Builds trust; GDPR Art. 22 compliant                               |
| **Privacy**        | Employer-owned data           | **User-sovereign**: GDPR-native, export/delete at will, processing consent per dimension                              | Individual empowerment                                             |
| **Scoring**        | Opaque algorithms             | **Transparent multi-dimensional scoring**: each Career DNA dimension has its own methodology, shown to user           | Auditability, user control                                         |

### Step 5: Ethics, Bias & Automation Risk Assessment

| Risk                                  | Severity | Probability | Mitigation                                                                                                           |
| :------------------------------------ | :------- | :---------- | :------------------------------------------------------------------------------------------------------------------- |
| **AI bias in skill inference**        | High     | Medium      | Confidence scores on all inferred skills; user can confirm/reject; no skill assumed >90% confidence without evidence |
| **Experience pattern bias**           | Medium   | Medium      | Explicit guard against inferring seniority from tenure alone; acknowledge non-linear career paths                    |
| **Growth vector overconfidence**      | Medium   | Low         | All projections shown as ranges with confidence bands; "this is a projection, not a guarantee" disclaimer            |
| **Values alignment stereotyping**     | High     | Low         | Values extracted from stated preferences and patterns only; never from demographic data; user editable               |
| **GDPR: Career DNA as personal data** | High     | N/A         | Career DNA IS personal data — full GDPR compliance: consent, erasure, portability, purpose limitation                |
| **Market position anxiety**           | Medium   | Medium      | Frame as "awareness" not "ranking"; always pair with actionable improvement suggestions                              |

---

## Proposed Changes

### Architecture Overview

Sprint 8 introduces the Career DNA domain as a new bounded context in PathForge. The Career DNA profile aggregates signals across 6 dimensions from existing data (resumes, skills, preferences, match results, job listings) and enriches them with AI-powered analysis.

```
┌─────────────────────────────────────────────────────────────┐
│                    Career DNA Domain                         │
│                                                             │
│  ┌─────────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  CareerDNA       │  │ SkillGenome  │  │ GrowthVector  │  │
│  │  (profile hub)   │  │ (skills map) │  │ (trajectory)  │  │
│  └────────┬────────┘  └──────┬───────┘  └───────┬───────┘  │
│           │                  │                   │          │
│  ┌────────┴────────┐  ┌──────┴───────┐  ┌───────┴───────┐  │
│  │ ExperienceBlueprint│ ValuesProfile │  │ MarketPosition│  │
│  │ (pattern)       │  │ (alignment)  │  │ (standing)    │  │
│  └─────────────────┘  └──────────────┘  └───────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  HiddenSkill — AI-discovered transferable competencies  ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

Data flows:

- `Resume` + `Skill` → **SkillGenome** (explicit + hidden skills)
- `ParsedExperience` → **ExperienceBlueprint** (pattern analysis)
- `SkillGenome` + `ExperienceBlueprint` + market data → **GrowthVector**
- `Preference` + experience patterns → **ValuesProfile**
- `SkillGenome` + `JobListing` aggregates → **MarketPosition**
- `CareerDNA` + `JobListing` embeddings → **OpportunityRadar** (via existing matching, enhanced)

---

### Component 1: Data Models

#### [NEW] [career_dna.py](file:///d:/ProfesionalDevelopment/AntigravityProjects/pathforge/apps/api/app/models/career_dna.py)

New SQLAlchemy models file containing:

1. **`CareerDNA`** — Hub entity linking a user to their living Career DNA profile
   - `user_id` (FK → users, unique — one profile per user)
   - `completeness_score` (Float, 0–100 — percentage of dimensions populated)
   - `last_analysis_at` (DateTime — when last AI analysis ran)
   - `version` (Integer — incremented on each full recomputation)
   - `summary` (Text — AI-generated natural language profile summary)

2. **`SkillGenomeEntry`** — Individual skill within the genome (richer than base `Skill`)
   - `career_dna_id` (FK → career_dna)
   - `skill_name` (String)
   - `category` (String — technical/soft/language/tool/domain)
   - `proficiency_level` (String — beginner/intermediate/advanced/expert)
   - `source` (String — explicit/inferred/market_validated)
   - `confidence` (Float, 0–1 — AI confidence in this skill attribution)
   - `evidence` (JSON — list of evidence items: resume section, experience entry, market signal)
   - `years_experience` (Integer, nullable)
   - `last_used_date` (String, nullable — for future skill decay in Sprint 10)

3. **`HiddenSkill`** — AI-discovered transferable skill
   - `career_dna_id` (FK → career_dna)
   - `skill_name` (String)
   - `discovery_method` (String — resume_inference/market_crossref)
   - `confidence` (Float, 0–1)
   - `evidence` (JSON — which experience/achievement triggered the inference)
   - `user_confirmed` (Boolean, nullable — user acceptance state)
   - `source_text` (Text — original text that triggered inference)

4. **`ExperienceBlueprint`** — Analyzed career experience pattern
   - `career_dna_id` (FK → career_dna)
   - `total_years` (Float)
   - `role_count` (Integer)
   - `avg_tenure_months` (Float)
   - `career_direction` (String — ascending/lateral/transitioning/exploring)
   - `industry_diversity` (Float, 0–1 — breadth of industry exposure)
   - `seniority_trajectory` (JSON — progression data points)
   - `pattern_analysis` (Text — AI-generated pattern narrative)

5. **`GrowthVector`** — Career trajectory projection
   - `career_dna_id` (FK → career_dna)
   - `current_trajectory` (String — accelerating/steady/plateauing/pivoting)
   - `projected_roles` (JSON — list of likely next roles with confidence)
   - `skill_velocity` (JSON — which skills are growing/stable/declining for this user)
   - `growth_score` (Float, 0–100)
   - `analysis_reasoning` (Text — explainable AI narrative)

6. **`ValuesProfile`** — Career values and alignment preferences
   - `career_dna_id` (FK → career_dna)
   - `work_style` (String — autonomous/collaborative/structured/flexible)
   - `impact_preference` (String — individual/team/organizational/societal)
   - `environment_fit` (JSON — startup vs enterprise, remote vs onsite preferences)
   - `derived_values` (JSON — AI-extracted values from experience patterns)
   - `confidence` (Float, 0–1)

7. **`MarketPosition`** — Real-time market standing
   - `career_dna_id` (FK → career_dna)
   - `percentile_overall` (Float, 0–100)
   - `skill_demand_scores` (JSON — per-skill market demand snapshot)
   - `matching_job_count` (Integer — how many current listings match)
   - `market_trend` (String — rising/stable/declining)
   - `computed_at` (DateTime)

#### [MODIFY] [**init**.py](file:///d:/ProfesionalDevelopment/AntigravityProjects/pathforge/apps/api/app/models/__init__.py)

Add imports for all new Career DNA models and add them to `__all__`.

#### [MODIFY] [user.py](file:///d:/ProfesionalDevelopment/AntigravityProjects/pathforge/apps/api/app/models/user.py)

Add `career_dna` relationship to User model (one-to-one).

---

### Component 2: Pydantic Schemas

#### [NEW] [career_dna.py](file:///d:/ProfesionalDevelopment/AntigravityProjects/pathforge/apps/api/app/schemas/career_dna.py)

API request/response schemas:

- `CareerDNAResponse` — Full Career DNA profile response
- `CareerDNASummaryResponse` — Lightweight summary (completeness, last_analysis, dimensions available)
- `SkillGenomeResponse` — List of genome entries with hidden skills
- `HiddenSkillResponse` — Individual hidden skill with evidence
- `HiddenSkillConfirmRequest` — User confirm/reject hidden skill
- `ExperienceBlueprintResponse` — Experience pattern analysis
- `GrowthVectorResponse` — Growth trajectory with projections
- `ValuesProfileResponse` — Values alignment profile
- `MarketPositionResponse` — Market standing snapshot
- `CareerDNAGenerateRequest` — Trigger analysis (optional: which dimensions to recompute)

---

### Component 3: AI Pipeline

#### [NEW] [career_dna_analyzer.py](file:///d:/ProfesionalDevelopment/AntigravityProjects/pathforge/apps/api/app/ai/career_dna_analyzer.py)

Core AI pipeline class `CareerDNAAnalyzer` with methods:

1. **`analyze_full()`** — Orchestrate full Career DNA computation
   - Fetches user's resume, skills, preferences, match results
   - Runs each dimension analyzer in sequence
   - Uses DEEP tier for full analysis, PRIMARY for individual dimensions
   - Returns complete Career DNA profile

2. **`extract_skill_genome()`** — Build comprehensive skill map
   - Merges explicit skills from resume with AI-inferred skills
   - Normalizes skill names (semantic deduplication)
   - Assigns confidence scores based on evidence strength

3. **`discover_hidden_skills()`** — **The core innovation** (dual-source)
   - **Method A (Resume Inference)**: Sends experience descriptions + achievements to LLM with structured prompt asking for transferable skills not explicitly listed (e.g., "managed team of 5" → Leadership, People Management)
   - **Method B (Market Cross-Reference)**: Queries aggregated job listings that match user's experience pattern → identifies skills frequently required in those roles but missing from user's profile
   - Deduplicates across both methods; prioritizes dual-confirmed skills

4. **`analyze_experience_pattern()`** — Compute experience blueprint
   - Analyzes career timeline, role transitions, tenure patterns
   - Classifies career direction (ascending/lateral/transitioning)
   - Calculates industry diversity score

5. **`compute_growth_vector()`** — Project career trajectory
   - Cross-references skill genome with market demand data
   - Projects which skills are accelerating/plateauing
   - Suggests likely next roles based on skill overlap + experience pattern
   - Uses growth score formula incorporating: skill trajectory, market demand, experience velocity

6. **`extract_values_profile()`** — Derive career values
   - Analyzes: stated preferences + experience patterns + role choices
   - Infers work style, impact preference, environment fit from implicit signals
   - Never uses demographic data — only professional behavior patterns

7. **`compute_market_position()`** — Real-time market standing
   - Counts matching job listings (from existing MatchResult data)
   - Computes skill demand scores from aggregated job listing skill frequency
   - Calculates approximate percentile based on available market data

#### [NEW] [career_dna_prompts.py](file:///d:/ProfesionalDevelopment/AntigravityProjects/pathforge/apps/api/app/ai/career_dna_prompts.py)

LLM prompt templates (version-controlled, A/B testable):

- `HIDDEN_SKILLS_SYSTEM_PROMPT` — System instructions for skill inference
- `HIDDEN_SKILLS_USER_PROMPT` — Template with experience descriptions
- `EXPERIENCE_ANALYSIS_SYSTEM_PROMPT` — Pattern recognition instructions
- `GROWTH_VECTOR_SYSTEM_PROMPT` — Trajectory projection instructions
- `VALUES_EXTRACTION_SYSTEM_PROMPT` — Values inference instructions
- `CAREER_DNA_SUMMARY_PROMPT` — Natural language profile summary

---

### Component 4: Service Layer

#### [NEW] [career_dna_service.py](file:///d:/ProfesionalDevelopment/AntigravityProjects/pathforge/apps/api/app/services/career_dna_service.py)

Business logic service with methods:

- `generate_career_dna()` — Full pipeline: fetch data → run AI → persist results
- `get_career_dna()` — Retrieve existing profile for user
- `get_skill_genome()` — Skills genome with hidden skills
- `confirm_hidden_skill()` — User accepts/rejects a discovered skill
- `get_growth_vector()` — Growth trajectory data
- `get_experience_blueprint()` — Experience pattern analysis
- `get_values_profile()` — Values alignment data
- `get_market_position()` — Market standing snapshot
- `refresh_dimension()` — Recompute a specific dimension only

---

### Component 5: API Endpoints

#### [NEW] [career_dna.py](file:///d:/ProfesionalDevelopment/AntigravityProjects/pathforge/apps/api/app/api/v1/career_dna.py)

RESTful endpoints under `/api/v1/career-dna`:

| Method  | Path                                            | Purpose                          |
| :------ | :---------------------------------------------- | :------------------------------- |
| `POST`  | `/api/v1/career-dna/generate`                   | Trigger Career DNA analysis      |
| `GET`   | `/api/v1/career-dna`                            | Get full Career DNA profile      |
| `GET`   | `/api/v1/career-dna/summary`                    | Get lightweight summary          |
| `GET`   | `/api/v1/career-dna/skills`                     | Get skill genome + hidden skills |
| `PATCH` | `/api/v1/career-dna/skills/hidden/{id}/confirm` | Confirm/reject hidden skill      |
| `GET`   | `/api/v1/career-dna/experience`                 | Get experience blueprint         |
| `GET`   | `/api/v1/career-dna/growth`                     | Get growth vector                |
| `GET`   | `/api/v1/career-dna/values`                     | Get values profile               |
| `GET`   | `/api/v1/career-dna/market`                     | Get market position              |
| `POST`  | `/api/v1/career-dna/refresh/{dimension}`        | Recompute single dimension       |

All endpoints require JWT authentication (`Depends(get_current_user)`).

#### [MODIFY] [**init**.py](file:///d:/ProfesionalDevelopment/AntigravityProjects/pathforge/apps/api/app/api/v1/__init__.py)

Register career_dna router.

---

### Component 6: Database Migration

#### [NEW] Alembic migration

- `alembic revision --autogenerate -m "add career_dna tables"`
- Creates tables: `career_dna`, `skill_genome_entries`, `hidden_skills`, `experience_blueprints`, `growth_vectors`, `values_profiles`, `market_positions`

---

### Component 7: Test Infrastructure Updates

#### [MODIFY] [conftest.py](file:///d:/ProfesionalDevelopment/AntigravityProjects/pathforge/apps/api/tests/conftest.py)

Add new Career DNA models to the import list so SQLite test DB creates the tables.

#### [NEW] [test_career_dna.py](file:///d:/ProfesionalDevelopment/AntigravityProjects/pathforge/apps/api/tests/test_career_dna.py)

Comprehensive test suite covering:

1. **Model tests** — Create/read/update/delete Career DNA entities
2. **API endpoint tests** — All 10 endpoints with auth
3. **Service layer tests** — Business logic with mocked AI
4. **AI pipeline tests** — Hidden skills discovery with mocked LLM responses
5. **Edge cases** — Empty resume, no skills, no job listings, partial data

Target: **20+ tests** bringing total from 146 to 166+.

---

## Verification Plan

### Automated Tests

All tests run via the existing pytest infrastructure:

```bash
cd d:\ProfesionalDevelopment\AntigravityProjects\pathforge\apps\api
.venv\Scripts\python -m pytest tests/ -q
```

Specific Sprint 8 tests:

```bash
.venv\Scripts\python -m pytest tests/test_career_dna.py -v
```

**Pass criteria**: All 166+ tests pass (146 existing + 20+ new).

### Lint & Type Safety

```bash
cd d:\ProfesionalDevelopment\AntigravityProjects\pathforge\apps\api
.venv\Scripts\python -m ruff check app/ tests/
```

**Pass criteria**: 0 errors, 0 warnings.

### Build Verification

```bash
cd d:\ProfesionalDevelopment\AntigravityProjects\pathforge\apps\web
pnpm build
```

**Pass criteria**: Clean build (no frontend changes, but verify no monorepo regressions).

---

## Execution Order

| #   | Task                                           | Files                                                          | Estimated Effort |
| :-- | :--------------------------------------------- | :------------------------------------------------------------- | :--------------- |
| 1   | Data models (`CareerDNA` + 6 dimension models) | `models/career_dna.py`, `models/__init__.py`, `models/user.py` | Medium           |
| 2   | Pydantic schemas                               | `schemas/career_dna.py`                                        | Medium           |
| 3   | AI prompts                                     | `ai/career_dna_prompts.py`                                     | Medium           |
| 4   | AI pipeline (analyzer)                         | `ai/career_dna_analyzer.py`                                    | High             |
| 5   | Service layer                                  | `services/career_dna_service.py`                               | Medium           |
| 6   | API endpoints                                  | `api/v1/career_dna.py`, `api/v1/__init__.py`                   | Medium           |
| 7   | Tests                                          | `tests/test_career_dna.py`, `tests/conftest.py`                | High             |
| 8   | Alembic migration                              | `alembic/versions/xxxx_add_career_dna.py`                      | Low              |

---

## Dependencies & Blockers

| Dependency                         | Status       | Impact                                   |
| :--------------------------------- | :----------- | :--------------------------------------- |
| Existing Resume + Skill models     | ✅ Available | Skills Genome builds on these            |
| Existing AI pipeline (LLM routing) | ✅ Available | Career DNA uses DEEP + PRIMARY tiers     |
| Existing JobListing model          | ✅ Available | Market cross-reference for hidden skills |
| Existing MatchResult model         | ✅ Available | Market position computation              |
| Existing Preference model          | ✅ Available | Values alignment extraction              |

No external blockers. All dependencies are in place from Sprints 1–7.

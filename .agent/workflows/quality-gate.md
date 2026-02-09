---
description: CareerPilot Tier-1 Quality Gate - Mandatory pre-task research and validation protocol
---

# /quality-gate — Pre-Task Research & Validation Protocol

> ⚠️ **MANDATORY**: This workflow must be executed before ANY implementation task.
> See `.agent/rules/quality-gate.md` for the full governance document.

## Pre-Execution Checklist

Execute these steps IN ORDER. Do not skip any step.

### Step 1: Market Research (REQUIRED)

// turbo
Research the task domain across minimum 5 competitors:

- LinkedIn, Indeed, Glassdoor, Stepstone, Hired
- Plus any domain-specific leader relevant to the task (e.g., Jobscan, Rezi, Teal, Huntr, LazyApply)
- Document: how is this feature/flow implemented today?
- Document: why did users adopt it? What measurable outcomes does it drive?

### Step 2: Comparative Analysis (REQUIRED)

Produce a comparison table covering:

- Each competitor's approach to the feature
- AI/ML methods used (NLP, semantic matching, scoring algorithms)
- UX patterns, step counts, automation levels
- Data privacy & consent mechanisms
- User control vs. full automation trade-offs
- Conversion funnel metrics (where available)

### Step 3: Gap Detection (REQUIRED)

Identify and document:

- Where CareerPilot already meets/exceeds market standards
- Where CareerPilot is BELOW market level
- Outdated patterns in the current or proposed approach
- If the task uses deceptive, spammy, or ethically harmful automation patterns → REJECT

### Step 4: Enhancement Strategy (REQUIRED)

Define how CareerPilot IMPROVES upon the market baseline:

- More transparent scoring? How? (e.g., explainable skill gap metrics)
- More ethical automation? How? (e.g., human-in-the-loop checkpoints)
- More user-centric? How? (e.g., measurable funnel insights)
- More data-sovereign? How? (e.g., local-first CV processing)
- More accurate? How? (e.g., semantic analysis over keyword matching)

Never replicate without improvement.

### Step 5: Ethics, Bias & Automation Risk Assessment (REQUIRED)

Evaluate:

- Privacy implications (GDPR, CV/personal data handling)
- AI bias risks in scoring, matching, or recommendation
- Automation safety (rate limiting, anti-spam, employer ToS compliance)
- User autonomy (human-in-the-loop control preserved?)
- Mitigation strategies for each identified risk

### Step 6: Implementation Plan (REQUIRED)

Prepare a structured plan containing:

1. Research summary (from Steps 1-5)
2. Key insights extracted
3. Risks of weak approaches
4. Proposed CareerPilot-grade solution
5. Why this approach is superior
6. Step-by-step execution plan
7. Dependencies and blockers

### Step 7: Present for Approval (REQUIRED)

Present the Research & Decision Report to the Product Owner.
**Implementation may NOT begin until explicit approval is received.**

## Rejection Triggers

If any of these conditions are met, REJECT the task:

1. ❌ No market research exists for this feature domain
2. ❌ The approach uses clearly outdated or harmful patterns
3. ❌ The solution is below market standard
4. ❌ Ethics, privacy, or automation safety risks are unmitigated
5. ❌ "Just implement it" without research justification

## Rejection Response Format

> "This task cannot be implemented in its current form, as it does not meet CareerPilot's quality and market standards.
> Below are the identified risks and gaps. A revised, modern alternative is proposed."

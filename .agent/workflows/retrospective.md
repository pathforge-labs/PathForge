---
description: PathForge Tier-1 Retrospective Quality Audit - Full product, architecture, and AI pipeline review against market standards
---

# /retrospective — Tier-1 Retrospective Quality Audit

> **Platform**: Antigravity AI Kit
> **Origin**: PathForge Trust-Grade AI Governance
> **Purpose**: Repeatable, on-demand retrospective audit of PathForge's entire product surface
> **Trigger**: `/retrospective` or `/tier1-audit`
> **Agents**: architect, code-reviewer, security-reviewer, ux-agent
> **Updated**: February 9, 2026

---

> [!CAUTION]
> This is a **critical governance workflow**. You are NOT allowed to defend previous decisions by default, minimize issues to preserve past work, or optimize for speed over correctness. Be critical, precise, and honest — treat PathForge as a product competing with category leaders.

---

## When to Execute

This workflow MUST be triggered at:

- **Major milestones** (sprint completion, phase gates)
- **Pre-launch reviews** (alpha, beta, production)
- **Strategic product checkpoints** (quarterly reviews)
- **Quality regressions or concerns** (user-reported or detected)
- **On-demand** via `/retrospective` command

---

## Workflow Scope (Automatic)

When triggered, the audit MUST automatically include **all** of the following:

| Domain                 | What to Audit                                                          |
| :--------------------- | :--------------------------------------------------------------------- |
| **Semantic Analysis**  | Job parsing accuracy, NLP pipeline quality, entity extraction          |
| **LLM Pipeline**       | CV/cover letter optimization, prompt engineering, token efficiency     |
| **Skill Gap Scoring**  | Scoring algorithm fairness, accuracy, explainability                   |
| **Browser Automation** | Human-in-the-loop controls, rate limiting, anti-spam, ToS compliance   |
| **Application Funnel** | Measurable stages, conversion tracking, user feedback loops            |
| **Market Insights**    | Data freshness, accuracy of salary/trend data, geographic relevance    |
| **Architecture**       | Backend, frontend, infrastructure, database, AI service integration    |
| **Auth & Onboarding**  | Registration, login, profile setup, data import flows                  |
| **Public Surface**     | Landing page, messaging, positioning, SEO                              |
| **Security & Privacy** | CV data handling, encryption, GDPR compliance, data sovereignty        |
| **AI Ethics & Bias**   | Scoring fairness, demographic bias detection, algorithmic transparency |
| **Testing**            | Coverage, strategy, regression prevention                              |

> [!IMPORTANT]
> **Nothing is assumed correct by default.** Every completed item is subject to re-evaluation.

---

## Workflow Steps

Execute these steps IN ORDER. Do not skip any step.

### Step 1: Inventory Collection

// turbo

Load and catalog all completed work:

```markdown
## Source Documents to Load

- [ ] Project documentation → completed features, architecture decisions
- [ ] Task tracking → all completed/merged items
- [ ] Git log → all merged commits on develop/main
- [ ] `.agent/decisions/` → all ADRs (if present)
- [ ] Feature specifications → product requirements
- [ ] AI pipeline configs → model versions, prompt templates, scoring parameters
```

Produce a **Completed Task & System Inventory** — a structured list of every analyzed area.

### Step 2: Market Benchmark Analysis

// turbo

For each completed feature or system, evaluate against market leaders:

- [ ] Was this implemented with **explicit market research**?
- [ ] Does it meet or exceed standards used by: **LinkedIn, Indeed, Glassdoor, Stepstone, Hired**?
- [ ] How does it compare to AI-native competitors: **Jobscan, Rezi, Teal, Huntr, LazyApply**?

```markdown
## Market Benchmark Table (per feature)

| Feature | PathForge Impl. | Market Leader | Gap?     | Notes    |
| :------ | :-------------- | :------------ | :------- | :------- |
| [name]  | [approach]      | [best impl.]  | ✅/⚠️/❌ | [detail] |
```

### Step 3: Outdated Pattern Detection

For each analyzed item, evaluate:

- [ ] Does it rely on **legacy UX, architecture, or AI pipeline assumptions**?
- [ ] Would this approach be considered **obsolete** by today's standards?
- [ ] Are there **deprecated libraries, patterns, or anti-patterns** in use?
- [ ] Does the implementation reflect **2024-2026 best practices** or older thinking?
- [ ] Are AI models/prompts using **outdated techniques** (e.g., keyword matching vs. semantic analysis)?

```markdown
## Outdated Pattern Registry

| Area   | Current Approach | Issue          | Modern Alternative    |
| :----- | :--------------- | :------------- | :-------------------- |
| [area] | [what exists]    | [why outdated] | [what to use instead] |
```

### Step 4: Tier-1 Quality Validation

For each system and feature, answer:

- [ ] Would this pass an **internal review at a top-tier tech company** (Google, Meta, Apple)?
- [ ] Is the execution **senior-level** or merely **functional**?
- [ ] Are there shortcuts, missing edge cases, or incomplete implementations?
- [ ] Does the code quality meet **strict TypeScript, testing, and documentation** standards?
- [ ] Are AI pipelines **reproducible, versioned, and benchmarked**?

### Step 5: Ethics, Bias & Automation Safety Audit

Evaluate each area through the ethics lens:

- [ ] Does the AI scoring system exhibit **demographic or linguistic bias**?
- [ ] Are automated actions **transparent and explainable** to users?
- [ ] Does the implementation respect **GDPR baseline** and **data sovereignty principles**?
- [ ] Would a privacy-conscious user feel safe uploading their CV and job history?
- [ ] Are all automation safeguards (human-in-the-loop, rate limiting, opt-out) effective?
- [ ] Does browser automation comply with **target platform Terms of Service**?

### Step 6: PathForge Differentiation Alignment

For each feature, check alignment with PathForge's core values:

- [ ] Does this actively support **Precision > Volume** philosophy (quality over mass applications)?
- [ ] Does it reinforce **measurable, transparent application funnels**?
- [ ] Does it uphold **human-in-the-loop control** over fully automated actions?
- [ ] Does it maintain **ethical automation** (anti-spam, rate limiting, ToS respect)?
- [ ] Does it deliver **explainable AI scoring** (skill gaps, match quality, improvement paths)?
- [ ] Does it preserve **data sovereignty** (user owns and controls their data)?
- [ ] Or is it only matching industry averages without differentiation?

### Step 7: Classification & Reporting

Classify each analyzed area using this scale:

| Classification             | Meaning                                                | Action Required             |
| :------------------------- | :----------------------------------------------------- | :-------------------------- |
| ✅ **Tier-1 Compliant**    | Meets or exceeds market standards + PathForge values   | No action needed            |
| ⚠️ **Partially Compliant** | Functional but below Tier-1 expectations               | Refinement plan required    |
| ❌ **Non-Compliant**       | Below market standard or violates PathForge principles | Revision required — blocker |

---

## Mandatory Output: Audit Report Structure

You MUST produce the final audit using this exact structure:

```markdown
# PathForge Tier-1 Retrospective Audit Report

> Date: [audit date]
> Sprint/Phase: [current sprint]
> Auditor: Antigravity AI Kit — Trust-Grade Cognitive Excellence System

## 1. Executive Summary

Overall quality assessment. Key strengths. Systemic weaknesses.

## 2. Completed Task & System Inventory

Structured catalog of all analyzed areas.

## 3. Compliance Classification

Per-area classification (✅ / ⚠️ / ❌) with justification.

## 4. Identified Gaps & Risks

- Missing best practices
- Weak or rushed decisions
- Areas below market or PathForge standards

## 5. Outdated or Suboptimal Implementations

- What should be revised or replaced
- Why it is insufficient today
- What modern approach should be used instead

## 6. Revision Recommendations

Per issue:

- Required change
- Justification (market data, best practice reference)
- Expected impact after revision

## 7. Priority Matrix

| Priority                | Issue | Impact | Effort |
| :---------------------- | :---- | :----- | :----- |
| 🔴 Critical (blocker)   | ...   | ...    | ...    |
| 🟠 High priority        | ...   | ...    | ...    |
| 🟢 Optional enhancement | ...   | ...    | ...    |

## 8. Conclusion & Next Steps

Clear revision path. Timeline recommendations.
```

---

## Revision Strategy Rules

When issues are found, you MUST:

1. **Prefer structural improvements** over cosmetic fixes
2. **Avoid incremental patching** when foundations are weak
3. **Ensure all revisions** move PathForge closer to Tier-1 standards
4. **Provide concrete examples** — not vague suggestions
5. **Reference market data** to justify every recommendation

---

## Enforcement & Integrity Rules

### You are PROHIBITED from:

| ❌ Prohibited                           | Why                                   |
| :-------------------------------------- | :------------------------------------ |
| Defending previous decisions by default | Past work is subject to re-evaluation |
| Minimizing issues to preserve past work | Honesty > Comfort                     |
| Optimizing for speed over correctness   | Quality > Velocity                    |
| Marking items ✅ without evidence       | Claims require proof                  |
| Skipping domains in scope               | Complete coverage is mandatory        |

### You are REQUIRED to:

| ✅ Required                                          | Standard                         |
| :--------------------------------------------------- | :------------------------------- |
| Be critical, precise, and honest                     | PhD-level rigor                  |
| Treat PathForge as competing with category leaders   | Market-grade bar                 |
| Recommend revisions whenever standards aren't met    | Zero tolerance for "good enough" |
| Provide actionable, measurable recommendations       | Engineering precision            |
| Cite competitors or best practices for every finding | Evidence-based audit             |

---

## Workflow Completion Criteria

This workflow is considered complete ONLY when:

- [ ] All domains in scope are inventoried and analyzed
- [ ] Every item has a compliance classification (✅ / ⚠️ / ❌)
- [ ] All gaps are documented with evidence
- [ ] A clear revision path exists for every non-compliant area
- [ ] The Priority Matrix is populated with impact/effort estimates
- [ ] The audit report is saved as an artifact for reference
- [ ] Findings are presented to the Product Owner via `notify_user`

> [!NOTE]
> If **no gaps are found**, you must explicitly state WHY PathForge already meets Tier-1 standards, with evidence from market benchmarks and internal quality metrics.

---

## Related Resources

| Resource                | Path                               |
| :---------------------- | :--------------------------------- |
| Quality Gate (pre-task) | `.agent/workflows/quality-gate.md` |
| Quality Gate Rule       | `.agent/rules/quality-gate.md`     |
| Product Context         | `.agent/product.md`                |
| Code Standards          | `.agent/code-standards.md`         |
| ADR Directory           | `.agent/decisions/`                |

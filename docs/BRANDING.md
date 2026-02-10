# PathForge — Brand Identity & Naming Convention Guide

> **Purpose**: Single source of truth for all brand-related naming and strategic identity.
> **Rule**: NEVER hardcode brand names in source code. Always import from this config or reference environment variables.

---

## 0. Strategic Brand Identity

### Category

**Career Intelligence Platform** — not a job search tool, not a CV builder.

### Mission

> **"Democratize career intelligence."**
>
> Enterprise-grade career intelligence — Skills Graphs, Market Signals, Predictive Analytics — has been locked behind $100K+ enterprise contracts. PathForge makes this intelligence available to every individual professional, putting the power back where it belongs: in the hands of the person whose career is actually at stake.

### Vision

> **"A world where no career decision is made blind."**
>
> By building the first consumer-grade Career Intelligence Platform, PathForge transforms career management from a reactive, stressful event into a continuous, data-informed journey — like Waze transformed navigation.

### Taglines (Approved)

- **Primary**: _"Career Intelligence for Everyone"_
- **Conceptual**: _"Where Careers Are Built, Not Searched"_
- **Minimal**: _"Your Career, Intelligently"_

### The PathForge Manifesto

1. **Your career data is YOUR intelligence** — not a recruiter's inventory
2. **Proactive, not reactive** — career guidance before crisis, not after layoff
3. **Evidence over intuition** — every recommendation backed by market data
4. **Precision over volume** — one right move beats 100 blind applications
5. **Human-first AI** — technology amplifies decisions, never replaces judgment
6. **Transparent AI** — every score, match, and recommendation is explainable
7. **EU-native privacy** — GDPR is not a compliance burden, it's trust architecture

### Career DNA™ — Intellectual Property Notice

> **Career DNA™** is a proprietary concept and pending trademark of PathForge.
> It refers to the living, multi-dimensional intelligence layer that represents a professional's skills genome, experience patterns, growth trajectory, values alignment, market position, and opportunity radar.
>
> This concept is central to PathForge's competitive differentiation and must be treated as protected intellectual property in all communications.

---

## 1. Environment Variables (`.env`)

All deployments MUST define these environment variables:

```env
# Brand Identity
APP_NAME=PathForge
APP_SLUG=pathforge
APP_TAGLINE=Career Intelligence for Everyone
APP_DOMAIN=pathforge.eu
APP_DOMAIN_REDIRECT=pathforge.nl

# URLs
APP_URL=https://pathforge.eu
APP_API_URL=https://api.pathforge.eu
APP_DOCS_URL=https://docs.pathforge.eu

# Metadata
APP_DESCRIPTION=PathForge is a Career Intelligence Platform that democratizes enterprise-grade career intelligence — Skills Graphs, Market Signals, Predictive Analytics — for every professional. Powered by Career DNA™ technology.
APP_AUTHOR=PathForge
APP_AUTHOR_EMAIL=hello@pathforge.eu
```

---

## 2. Backend Constants (`config/brand.py`)

```python
"""
PathForge — Brand Constants
============================
Single source of truth for all brand-related values.
Import from here, never hardcode brand names.

Usage:
    from config.brand import APP_NAME, APP_SLUG, APP_DOMAIN
"""

import os

# Core Identity
APP_NAME = os.getenv("APP_NAME", "PathForge")
APP_SLUG = os.getenv("APP_SLUG", "pathforge")
APP_TAGLINE = os.getenv("APP_TAGLINE", "Career Intelligence for Everyone")

# Domains
APP_DOMAIN = os.getenv("APP_DOMAIN", "pathforge.eu")
APP_URL = os.getenv("APP_URL", f"https://{APP_DOMAIN}")
APP_API_URL = os.getenv("APP_API_URL", f"https://api.{APP_DOMAIN}")

# Metadata
APP_DESCRIPTION = os.getenv(
    "APP_DESCRIPTION",
    f"{APP_NAME} is a platform that democratizes enterprise-grade career intelligence — "
    "Skills Graphs, Market Signals, Predictive Analytics — for every "
    "professional. Powered by Career DNA™ technology."
)
APP_AUTHOR = os.getenv("APP_AUTHOR", APP_NAME)
APP_AUTHOR_EMAIL = os.getenv("APP_AUTHOR_EMAIL", f"hello@{APP_DOMAIN}")

# Package Info
APP_VERSION = os.getenv("APP_VERSION", "0.1.0")

# Social / SEO
APP_OG_IMAGE = f"{APP_URL}/og-image.png"
APP_TWITTER_HANDLE = f"@{APP_SLUG}"
```

---

## 3. Frontend Constants (`config/brand.ts`)

```typescript
/**
 * PathForge — Brand Constants
 * ============================
 * Single source of truth for all brand-related values.
 * Import from here, never hardcode brand names.
 *
 * Usage:
 *   import { APP_NAME, APP_SLUG, APP_DOMAIN } from '@/config/brand';
 */

// Core Identity
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "PathForge";
export const APP_SLUG = process.env.NEXT_PUBLIC_APP_SLUG ?? "pathforge";
export const APP_TAGLINE =
  process.env.NEXT_PUBLIC_APP_TAGLINE ?? "Career Intelligence for Everyone";

// Domains
export const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "pathforge.eu";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? `https://${APP_DOMAIN}`;
export const APP_API_URL =
  process.env.NEXT_PUBLIC_APP_API_URL ?? `https://api.${APP_DOMAIN}`;

// Metadata
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ??
  `${APP_NAME} is a platform that democratizes enterprise-grade career intelligence — Skills Graphs, Market Signals, Predictive Analytics — for every professional. Powered by Career DNA™ technology.`;

// SEO
export const APP_OG_IMAGE = `${APP_URL}/og-image.png`;

// Social
export const APP_TWITTER_HANDLE = `@${APP_SLUG}`;

// Helper: Generate page title
export const pageTitle = (page?: string) =>
  page ? `${page} | ${APP_NAME}` : `${APP_NAME} — ${APP_TAGLINE}`;
```

---

## 4. Naming Conventions

### Package Names → Slug Format

```
pathforge-api          # Backend API package
pathforge-web          # Next.js web app
pathforge-mobile       # React Native mobile app
pathforge-shared       # Shared types/utils
```

### Asset Names → Function-Based (NOT Brand-Based)

| ✅ Correct          | ❌ Incorrect            |
| :------------------ | :---------------------- |
| `logo-primary.svg`  | `pathforge-logo.svg`    |
| `logo-icon.svg`     | `pf-icon.svg`           |
| `logo-wordmark.svg` | `pathforge-text.svg`    |
| `og-image.png`      | `pathforge-og.png`      |
| `favicon.ico`       | `pathforge-favicon.ico` |

### URL Patterns → Domain-Agnostic Internally

| ✅ Correct                 | ❌ Incorrect                        |
| :------------------------- | :---------------------------------- |
| `/api/v1/users`            | `https://pathforge.eu/api/v1/users` |
| `${APP_API_URL}/users`     | `https://api.pathforge.eu/users`    |
| `/assets/logo-primary.svg` | `https://pathforge.eu/logo.svg`     |

### Database & Infrastructure Names

| Resource     | Convention                | Example                           |
| :----------- | :------------------------ | :-------------------------------- |
| Database     | `{slug}_{env}`            | `pathforge_dev`, `pathforge_prod` |
| Redis prefix | `{slug}:`                 | `pathforge:session:abc123`        |
| S3 bucket    | `{slug}-{resource}-{env}` | `pathforge-uploads-prod`          |
| Docker image | `{slug}-{service}`        | `pathforge-api`, `pathforge-web`  |

---

## 5. Git & Repository

| Item            | Convention                            |
| :-------------- | :------------------------------------ |
| GitHub org      | `besync-labs`                         |
| Repo name       | `pathforge`                           |
| Branch strategy | `main` → `develop` → feature branches |
| Commit prefix   | Standard conventional commits         |

---

## 6. Future Rebrand Checklist

If PathForge ever needs to be renamed again, update ONLY:

1. This file (`BRANDING.md`)
2. `.env` / `.env.example` values
3. `config/brand.py` defaults
4. `config/brand.ts` defaults
5. `package.json` name fields
6. Git repository name
7. Domain DNS records
8. Asset files (if brand mark changes)

**Everything else reads from these sources automatically.**

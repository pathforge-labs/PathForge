# PathForge — Brand Constants & Naming Convention Guide

> **Purpose**: Single source of truth for all brand-related naming.
> **Rule**: NEVER hardcode brand names in source code. Always import from this config or reference environment variables.

---

## 1. Environment Variables (`.env`)

All deployments MUST define these environment variables:

```env
# Brand Identity
APP_NAME=PathForge
APP_SLUG=pathforge
APP_TAGLINE=AI Career Growth Platform
APP_DOMAIN=pathforge.eu
APP_DOMAIN_REDIRECT=pathforge.nl

# URLs
APP_URL=https://pathforge.eu
APP_API_URL=https://api.pathforge.eu
APP_DOCS_URL=https://docs.pathforge.eu

# Metadata
APP_DESCRIPTION=PathForge is an AI Career Growth Platform that uses semantic matching, career strategy, and intelligent CV tailoring to help professionals navigate career transitions.
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
APP_TAGLINE = os.getenv("APP_TAGLINE", "AI Career Growth Platform")

# Domains
APP_DOMAIN = os.getenv("APP_DOMAIN", "pathforge.eu")
APP_URL = os.getenv("APP_URL", f"https://{APP_DOMAIN}")
APP_API_URL = os.getenv("APP_API_URL", f"https://api.{APP_DOMAIN}")

# Metadata
APP_DESCRIPTION = os.getenv(
    "APP_DESCRIPTION",
    f"{APP_NAME} is an {APP_TAGLINE} that uses semantic matching, "
    "career strategy, and intelligent CV tailoring to help professionals "
    "navigate career transitions."
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
  process.env.NEXT_PUBLIC_APP_TAGLINE ?? "AI Career Growth Platform";

// Domains
export const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "pathforge.eu";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? `https://${APP_DOMAIN}`;
export const APP_API_URL =
  process.env.NEXT_PUBLIC_APP_API_URL ?? `https://api.${APP_DOMAIN}`;

// Metadata
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ??
  `${APP_NAME} is an ${APP_TAGLINE} that uses semantic matching, career strategy, and intelligent CV tailoring to help professionals navigate career transitions.`;

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

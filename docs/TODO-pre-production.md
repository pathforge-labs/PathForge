# Pre-Production Deployment Checklist

> **Status**: In Progress — Complete before first production deployment
> **Sprint**: 7 (Production Readiness)
> **Created**: 2026-02-14 | **Updated**: 2026-02-17

---

## 1. Railway Setup

- [ ] Create Railway project for PathForge API
- [ ] Add Redis service (or connect external Redis)
- [ ] Configure environment variables from `.env.production.example`
- [ ] Verify health check endpoint (`/api/v1/health`) responds

## 2. Vercel Setup

- [ ] Create Vercel project for PathForge Web
- [ ] Connect to GitHub repository (`pathforge-labs/PathForge`)
- [ ] Configure build settings (Next.js, `apps/web` root)
- [ ] Add environment variables (API URL, etc.)

## 3. GitHub Secrets

Store the following in **GitHub → Settings → Secrets and variables → Actions**:

| Secret              | Source                                |
| :------------------ | :------------------------------------ |
| `RAILWAY_TOKEN`     | Railway → Account Settings → Tokens   |
| `VERCEL_TOKEN`      | Vercel → Account Settings → Tokens    |
| `VERCEL_ORG_ID`     | Vercel → Settings → General → Team ID |
| `VERCEL_PROJECT_ID` | Vercel → Project → Settings → General |

## 4. Database

- [ ] Verify Supabase PostgreSQL connection from Railway
- [ ] Run Alembic migrations: `alembic upgrade head`
- [ ] Confirm `ck_application_status` CHECK constraint exists

## 5. Security Verification

- [ ] Generate strong JWT secrets (32+ chars): `python -c "import secrets; print(secrets.token_urlsafe(48))"`
- [ ] Verify CORS origins match production domains
- [ ] Confirm HSTS header present in production responses
- [ ] Test `/auth/logout` endpoint actually revokes tokens

## 6. DNS & Domain

- [x] SPF DNS record (via DomainConnect chain → Google)
- [x] DMARC DNS record (`v=DMARC1; p=none; rua=mailto:emre@pathforge.eu`)
- [x] Google site verification TXT record
- [x] DNS cleanup (removed duplicate SPF + GoDaddy default DMARC)
- [ ] Point `pathforge.eu` A record → Vercel (replace WebsiteBuilder parking)
- [ ] Point `api.pathforge.eu` → Railway (if using custom domain)
- [ ] Verify SSL certificates are active
- [ ] DKIM (Google Workspace) — wait 24-72 hours, then activate via Admin Console

## 7. Email — Google Workspace

- [x] Google Workspace Business Starter activated (`emre@pathforge.eu`)
- [x] MX records configured (5 Google MX entries)
- [x] Email aliases added:
  - [x] `hello@pathforge.eu` (primary contact / Resend sender)
  - [x] `support@pathforge.eu` (customer support)
  - [x] `no-reply@pathforge.eu` (transactional emails)
- [x] All aliases route to `emre@pathforge.eu` inbox
- [ ] DKIM authentication — generate key after 24-72h, add TXT record, start verification

## 8. Email — Resend (Transactional)

- [x] Resend account created (Google login)
- [x] `pathforge.eu` domain added (Region: Ireland, eu-west-1)
- [x] Domain verified (DKIM + SPF + MX all Verified)
- [x] API Key created (`pathforge-production`)
- [x] Audience created (`PathForge Waitlist`)
- [ ] Set `RESEND_API_KEY` in Vercel environment
- [ ] Set `RESEND_FROM_EMAIL=PathForge <hello@pathforge.eu>` in Vercel environment
- [ ] Set `RESEND_AUDIENCE_ID` in Vercel environment
- [ ] Test contact form email delivery (post-deploy)
- [ ] Test waitlist signup flow (post-deploy)

## 9. Analytics — GA4

- [x] GA4 property created (`PathForge` → `PathForge Web`)
- [x] Web stream configured (`https://pathforge.eu`)
- [x] Measurement ID obtained (`G-PJHB43EFLP`)
- [ ] Set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-PJHB43EFLP` in Vercel environment
- [ ] Verify Consent Mode v2 is active (denied by default) — post-deploy
- [ ] Verify GA4 activates only after user accepts cookie banner — post-deploy
- [ ] Verify GA4 is blocked when user declines cookies — post-deploy

## 10. SEO — Google Search Console

- [x] GSC property created (`https://pathforge.eu/`)
- [x] Domain verified via DNS TXT record (no meta tag needed)
- [ ] Submit sitemap to GSC: `https://pathforge.eu/sitemap.xml` — post-deploy
- [ ] Verify sitemap is indexed — check after 48 hours

## 11. Final Pre-Launch Checks

- [ ] `robots.ts` created with proper crawl rules
- [ ] Smoke test: visit all public pages, verify no errors
- [ ] Test contact form end-to-end
- [ ] Test waitlist signup end-to-end
- [ ] Verify cookie banner appears and GA4 consent works
- [ ] Check Lighthouse score (aim for 90+ on all metrics)
- [ ] Review Open Graph / social sharing preview

## 12. Post-Launch — GitHub Organization Migration

> **When**: After production is stable and running for 1-2 weeks

- [ ] Create GitHub Organization: `pathforge-eu` (using `emre@pathforge.eu`)
- [ ] Transfer repo from `pathforge-labs/PathForge` → `pathforge-eu/PathForge`
- [ ] Update Git remote URLs locally
- [ ] Update Vercel GitHub integration (reconnect to new org)
- [ ] Update Railway GitHub integration
- [ ] Update GitHub Secrets in new org
- [ ] Verify CI/CD pipelines work with new org
- [ ] Update `brand.ts` repo references if any

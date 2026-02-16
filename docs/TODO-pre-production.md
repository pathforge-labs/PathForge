# Pre-Production Deployment Checklist

> **Status**: Pending — Complete before first production deployment
> **Sprint**: 7 (Production Readiness)
> **Created**: 2026-02-14 | **Updated**: 2026-02-16

---

## 1. Railway Setup

- [ ] Create Railway project for PathForge API
- [ ] Add Redis service (or connect external Redis)
- [ ] Configure environment variables from `.env.production.example`
- [ ] Verify health check endpoint (`/api/v1/health`) responds

## 2. Vercel Setup

- [ ] Create Vercel project for PathForge Web
- [ ] Connect to GitHub repository (`besync-labs/PathForge`)
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

- [ ] Point `pathforge.eu` → Vercel
- [ ] Point `api.pathforge.eu` → Railway (if using custom domain)
- [ ] Verify SSL certificates are active

## 7. Email (Resend)

- [ ] Verify `pathforge.eu` domain in Resend → DNS records (SPF, DKIM, DMARC)
- [ ] Set `RESEND_API_KEY` in Vercel environment
- [ ] Set `RESEND_FROM_EMAIL` in Vercel environment
- [ ] Set `RESEND_AUDIENCE_ID` in Vercel environment
- [ ] Test contact form auto-reply email delivery
- [ ] Test waitlist signup confirmation
- [ ] Add DMARC DNS record for `pathforge.eu`

## 8. Analytics (GA4)

- [ ] Create GA4 property at https://analytics.google.com
- [ ] Create Web data stream for `pathforge.eu`
- [ ] Copy Measurement ID (`G-XXXXXXXXXX`)
- [ ] Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel environment
- [ ] Verify Consent Mode v2 is active (denied by default)
- [ ] Verify GA4 activates only after user accepts cookie banner
- [ ] Verify GA4 is blocked when user declines cookies

## 9. SEO (Google Search Console)

- [ ] Create GSC property for `pathforge.eu`
- [ ] Choose HTML tag verification method
- [ ] Copy content value from verification meta tag
- [ ] Set `NEXT_PUBLIC_GSC_VERIFICATION` in Vercel environment
- [ ] Verify ownership in GSC
- [ ] Submit sitemap: `https://pathforge.eu/sitemap.xml`

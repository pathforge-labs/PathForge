# Pre-Production Deployment Checklist

> **Status**: Pending — Complete before first production deployment
> **Sprint**: 7 (Production Readiness)
> **Created**: 2026-02-14

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

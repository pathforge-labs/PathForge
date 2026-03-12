# Quality Gate Research — Sprint 39 Handoff Notes Remediation

> **Generated**: 2026-03-12 · **Scope**: H1–H6 Handoff Notes
> **Domain**: OAuth Social Login, CAPTCHA Integration, Env Configuration

---

## 1. Market Research Summary

### Competitors Analyzed (7)

| #   | Platform      | Social Login Providers    | CAPTCHA      | Auth Architecture               |
| :-- | :------------ | :------------------------ | :----------- | :------------------------------ |
| 1   | **LinkedIn**  | Google, Apple, Microsoft  | reCAPTCHA    | OAuth 2.0 + OIDC provider       |
| 2   | **Indeed**    | Google, Apple, Indeed SSO | Turnstile    | OAuth 2.0, "Log in with Indeed" |
| 3   | **Glassdoor** | Google, Indeed SSO        | reCAPTCHA    | Synced with Indeed accounts     |
| 4   | **Stepstone** | Google, Apple, LinkedIn   | reCAPTCHA v3 | OAuth 2.0 redirect              |
| 5   | **Hired**     | Google, LinkedIn, GitHub  | reCAPTCHA    | OAuth 2.0, token-based          |
| 6   | **Teal**      | Google                    | reCAPTCHA    | Magic link + OAuth              |
| 7   | **Jobscan**   | Google, LinkedIn          | reCAPTCHA    | OAuth 2.0, token-based          |

### Key Industry Findings

1. **Google Sign-In is universal** — every competitor offers it. GIS (`accounts.google.com/gsi/client`) is the modern standard (replaces `gapi.auth2`).
2. **Microsoft/Azure is B2B standard** — required for enterprise clients via Entra ID SSO. MSAL.js v5.x is current, v5.4.0 released March 2026.
3. **Cloudflare Turnstile adoption rising** — Indeed uses it. Privacy-focused, GDPR-friendlier than reCAPTCHA (no cookie consent required for Turnstile invisible mode).
4. **Hybrid auth is industry standard** — email/password + social login + passwordless (future). Every major platform offers 2+ login methods.
5. **RFC 9700 (Jan 2025)** — PKCE mandatory for all OAuth 2.0 clients. PathForge uses ID token flow (credential/popup), which is OIDC-compliant.

---

## 2. Gap Detection

| Area                  | PathForge Status                                                    | Market Standard          | Gap?                                          |
| :-------------------- | :------------------------------------------------------------------ | :----------------------- | :-------------------------------------------- |
| Google OAuth          | ✅ Backend implemented (`oauth.py`), Frontend `OAuthButtons` exists | GIS + ID token           | ⚠️ **Missing GIS script tag**                 |
| Microsoft OAuth       | ✅ Backend implemented, Frontend popup flow exists                  | MSAL.js + popup          | ⚠️ **MSAL not installed**, `@ts-expect-error` |
| Turnstile CAPTCHA     | ✅ Backend verifier (`turnstile.py`), Frontend hook exists          | Server-side siteverify   | ⚠️ **Secret key not in API env**              |
| Email/Password        | ✅ Full lifecycle (register, verify, reset, login)                  | Industry standard        | ✅ Meets standard                             |
| OAuth account linking | ✅ Implemented (auto-link by email)                                 | LinkedIn, Indeed pattern | ✅ Exceeds (auto-create + link)               |
| Token security        | ✅ SHA-256, JWT HS256, refresh rotation planned                     | RFC 9700                 | ✅ Meets standard                             |

---

## 3. Enhancement Strategy

PathForge improves over market baseline in:

- **More transparent**: OAuth flow shows clear provider attribution, no silent data collection
- **More ethical**: Turnstile over reCAPTCHA — GDPR-native, no tracking cookies, no consent screen needed
- **More data-sovereign**: Backend validates ID tokens server-side, no client-secret exposure
- **More resilient**: Graceful degradation — empty keys = disabled (dev mode), no crashes

---

## 4. Ethics, Bias & Automation Safety

| Risk                | Severity | Mitigation                                                  |
| :------------------ | :------- | :---------------------------------------------------------- |
| OAuth data scope    | Low      | Only `openid`, `email`, `profile` requested — minimal scope |
| Turnstile privacy   | Very Low | No tracking cookies, GDPR-compliant by design               |
| Account enumeration | Low      | OAuth auto-creates accounts, no "email exists" leakage      |
| Secret key exposure | Medium   | Env vars only, never in code. `.env` is gitignored          |
| Bundle size (MSAL)  | Low      | Dynamic import (`import()`) — only loaded when clicked      |

---

## 5. Conclusion

All 6 handoff items (H1–H6) are **implementation completions** — the architecture and code already exist. The gaps are purely operational (missing env vars, uninstalled dependency, missing script tag). No new feature design needed. Risk: Low. Impact: High (enables OAuth login for all users).

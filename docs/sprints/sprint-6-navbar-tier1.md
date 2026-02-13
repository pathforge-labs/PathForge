# Sprint 6 — Navbar Tier-1 Enhancement

> **Goal**: Elevate PathForge navbar to Tier-1 SaaS standards (Linear, Vercel, Stripe)
> **Created**: 2026-02-13
> **Status**: 📋 Planned
> **Points**: 12 · **Stories**: 5 · **Tasks**: 14

---

## S6-01: Floating Pill Navbar ⭐ P0 (3 pts)

> Convert sticky edge-to-edge navbar to a floating capsule with rounded corners and viewport edge spacing.

- [ ] **T1** — Convert `<nav>` to floating pill layout (`top-4 left-4 right-4 rounded-2xl`) → `navbar.tsx`
- [ ] **T2** — Add floating navbar CSS (glass bg, brand border) → `globals.css`
- [ ] **T3** — Update `.nav-scrolled` styles for floating context → `globals.css`
- [ ] **T4** — Fix hero `pt-` offset for floating navbar → `page.tsx`

**AC**: Navbar floats with gap from edges · rounded corners · glass blur preserved · scroll effect works

---

## S6-02: Expanded Navigation Links — P1 (2 pts)

> Add Pricing + About links for content depth and product credibility.

- [ ] **T5** — Add "Pricing" + "About" to `NAV_LINKS` → `active-nav.tsx`
- [ ] **T6** — Add matching links to mobile nav → `mobile-nav.tsx`
- [ ] **T7** — Add `id="pricing"` to Comparison Table section → `page.tsx`

**AC**: Desktop shows 4+ links · mobile matches · active highlighting works on new anchors

---

## S6-03: CTA Cluster Grouping — P1 (2 pts)

> Wrap Sign In + Join Waitlist in a subtle glass pill for visual hierarchy.

- [ ] **T8** — Wrap right-side actions in glass pill (`rounded-full border bg-white/[0.03]`) → `navbar.tsx`
- [ ] **T9** — Adjust inner spacing for pill container → `navbar.tsx`

**AC**: Visually grouped · border ≤8% opacity · CTA still prominent · no layout shift

---

## S6-04: Micro-Interaction Polish — P2 (2 pts)

> Add hover effects on logo, nav links, and CTA for premium interactivity.

- [ ] **T10** — Apply `.logo-icon` class to logo `<Image>` → `navbar.tsx`
- [ ] **T11** — Add hover-underline to nav links → `active-nav.tsx`
- [ ] **T12** — Add hover `translateY(-1px)` lift to CTA → `navbar.tsx`

**AC**: Logo glows · links get underline · CTA lifts · 150-300ms transitions · respects `prefers-reduced-motion`

---

## S6-05: Theme Toggle — P2 (3 pts)

> Add dark/light mode toggle with full light color palette.

- [ ] **T13** — Create `theme-toggle.tsx` (next-themes + Lucide Moon/Sun icons) → **[NEW]** `components/theme-toggle.tsx`
- [ ] **T14** — Add `ThemeToggle` to navbar between links and CTA cluster → `navbar.tsx`
- [ ] **T15** — Define light mode color palette in CSS variables → `globals.css`

**AC**: Toggle switches Moon/Sun · theme persists via localStorage · no flash on load · light palette production-ready

---

## Verification Checklist

- [ ] Browser test: 375px, 768px, 1024px, 1440px
- [ ] Scroll glass effect
- [ ] Active link highlighting
- [ ] Hover micro-interactions
- [ ] Theme toggle + persistence
- [ ] Before/after screenshots

---

## Execution Order

`S6-01 → S6-02 → S6-03 → S6-04 → S6-05 → Verification`

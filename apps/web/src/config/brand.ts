/**
 * PathForge — Brand Constants
 * ============================
 * Single source of truth for all brand-related values.
 * Import from here, never hardcode brand names.
 *
 * @see docs/BRANDING.md for full governance rules.
 *
 * Usage:
 *   import { APP_NAME, APP_SLUG, APP_TAGLINE } from '@/config/brand';
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
  `${APP_NAME} is a Career Intelligence Platform that democratizes enterprise-grade career intelligence — Skills Graphs, Market Signals, Predictive Analytics — for every professional. Powered by Career DNA™ technology.`;
export const APP_AUTHOR = process.env.NEXT_PUBLIC_APP_AUTHOR ?? APP_NAME;
export const APP_AUTHOR_EMAIL =
  process.env.NEXT_PUBLIC_APP_AUTHOR_EMAIL ?? `hello@${APP_DOMAIN}`;

// Company
export const APP_COMPANY = "PathForge";
export const APP_COUNTRY = "Netherlands";
export const APP_COUNTRY_FLAG = "🇳🇱";

// SEO
export const APP_OG_IMAGE = `${APP_URL}/og-image.jpg`;
export const APP_TWITTER_HANDLE = `@${APP_SLUG}`;

// Social Links
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/pathforge",
  linkedin: "https://linkedin.com/company/pathforge",
  x: "https://x.com/pathforge",
} as const;

// Helper: Generate page title
export const pageTitle = (page?: string) =>
  page ? `${page} | ${APP_NAME}` : `${APP_NAME} — ${APP_TAGLINE}`;

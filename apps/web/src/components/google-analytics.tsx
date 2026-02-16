"use client";

import Script from "next/script";
import { useEffect, useState, type ReactElement } from "react";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CONSENT_KEY = "pathforge-cookie-consent";

/**
 * Google Analytics 4 with Consent Mode v2 (GDPR compliant).
 *
 * - Loads gtag.js only when a valid Measurement ID is configured.
 * - Initializes with denied consent by default (Consent Mode v2).
 * - Updates consent when user accepts cookies via CookieConsent banner.
 * - Listens for localStorage changes to react to consent updates.
 */
export function GoogleAnalytics(): ReactElement | null {
  const [consentGranted, setConsentGranted] = useState(() => {
    // Check initial consent from localStorage (runs once on mount)
    if (typeof window !== "undefined") {
      return localStorage.getItem(CONSENT_KEY) === "accepted";
    }
    return false;
  });

  useEffect(() => {
    // Listen for consent changes from CookieConsent component (cross-tab)
    function handleStorageChange(event: StorageEvent): void {
      if (event.key === CONSENT_KEY) {
        setConsentGranted(event.newValue === "accepted");
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Update gtag consent when state changes
  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: consentGranted ? "granted" : "denied",
      });
    }
  }, [consentGranted]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Consent Mode v2 — denied by default (GDPR)
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
            });

            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
            });
          `,
        }}
      />
    </>
  );
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      targetOrAction: string,
      config?: Record<string, string | boolean>
    ) => void;
    dataLayer: Array<unknown>;
  }
}

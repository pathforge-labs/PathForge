"use client";

import { useState, useEffect, type ReactElement } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "pathforge-cookie-consent";

/**
 * GDPR Cookie Consent Banner
 * Glassmorphism design with Accept/Decline.
 * Persists choice to localStorage to avoid repeat prompts.
 */
export function CookieConsent(): ReactElement | null {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't already made a choice
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't compete with initial page load
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept(): void {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
    // Update GA4 consent in same tab (StorageEvent only fires cross-tab)
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  }

  function decline(): void {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
    // Ensure GA4 stays denied in same tab
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
  }

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-all duration-500 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/30 bg-card/90 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
        {/* Subtle accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

        {/* Close button */}
        <button
          onClick={decline}
          className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground/40 transition-colors hover:text-muted-foreground"
          aria-label="Close cookie banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Cookie className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-3">
            <p className="pr-4 text-sm leading-relaxed text-muted-foreground">
              We use cookies to improve PathForge. Accept to enable
              analytics, or decline — PathForge works either way.{" "}
              <Link
                href="/cookies"
                className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
              >
                Learn more
              </Link>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={accept}
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                Accept
              </button>
              <button
                onClick={decline}
                className="rounded-lg border border-border/30 px-4 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-muted/30 hover:text-foreground"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

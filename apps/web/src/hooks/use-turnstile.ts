"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

interface UseTurnstileResult {
  /** Ref to attach to the container div */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Current Turnstile token (empty until challenge passes) */
  token: string;
  /** Reset the widget + clear the token */
  reset: () => void;
  /** Whether Turnstile is configured (site key present) */
  isEnabled: boolean;
}

/**
 * Custom hook for Cloudflare Turnstile widget management.
 *
 * Handles:
 * - Waiting for global `window.turnstile` API (loaded once in layout)
 * - Safe rendering only when container ref is attached to DOM
 * - Proper cleanup on unmount (removes widget)
 * - React Strict Mode double-mount resilience
 */
export function useTurnstile(): UseTurnstileResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState("");

  const reset = useCallback((): void => {
    if (
      typeof window !== "undefined" &&
      window.turnstile &&
      widgetIdRef.current !== null
    ) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        // Widget may have been removed already
      }
      setToken("");
    }
  }, []);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !IS_PRODUCTION) return;

    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let isMounted = true;

    function renderWidget(): void {
      if (
        !isMounted ||
        !window.turnstile ||
        !containerRef.current ||
        widgetIdRef.current !== null
      ) {
        return;
      }

      // Verify the container is actually in the DOM
      if (!document.body.contains(containerRef.current)) {
        return;
      }

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (newToken: string) => {
            if (isMounted) setToken(newToken);
          },
          "expired-callback": () => {
            if (isMounted) setToken("");
          },
          size: "invisible",
          theme: "dark",
        });
      } catch {
        // Render failed — container may have been removed
        widgetIdRef.current = null;
      }
    }

    // Poll until turnstile API is available AND container ref is attached
    pollTimer = setInterval(() => {
      if (window.turnstile && containerRef.current) {
        if (pollTimer) clearInterval(pollTimer);
        pollTimer = null;
        renderWidget();
      }
    }, 150);

    // Also try immediately
    if (window.turnstile && containerRef.current) {
      if (pollTimer) clearInterval(pollTimer);
      pollTimer = null;
      renderWidget();
    }

    return () => {
      isMounted = false;
      if (pollTimer) clearInterval(pollTimer);

      // Clean up widget on unmount
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Already removed
        }
        widgetIdRef.current = null;
      }
    };
  }, []);

  return {
    containerRef,
    token,
    reset,
    isEnabled: Boolean(TURNSTILE_SITE_KEY) && IS_PRODUCTION,
  };
}

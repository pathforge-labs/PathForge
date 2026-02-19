"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

interface UseTurnstileResult {
  /** Ref to attach to the container div */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Current Turnstile token (empty until challenge passes) */
  token: string;
  /** Trigger the Turnstile challenge and return the token */
  execute: () => Promise<string>;
  /** Reset the widget + clear the token */
  reset: () => void;
  /** Whether Turnstile is configured (site key present) */
  isEnabled: boolean;
}

/**
 * Custom hook for Cloudflare Turnstile widget management.
 *
 * Uses `execution: 'execute'` mode — the widget is pre-rendered but the
 * challenge only runs when `execute()` is called (typically on form submit).
 * This eliminates Cloudflare console warnings (CSP fallback, PAT 401s,
 * preload timing) that occur with the default implicit execution mode.
 *
 * Handles:
 * - Waiting for global `window.turnstile` API (loaded once in layout)
 * - Safe rendering only when container ref is attached to DOM
 * - Promise-based `execute()` for clean async form submission
 * - Proper cleanup on unmount (removes widget)
 * - React Strict Mode double-mount resilience
 */
export function useTurnstile(): UseTurnstileResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState("");

  // Store the resolve function for the execute() promise
  const resolveRef = useRef<((token: string) => void) | null>(null);

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
      resolveRef.current = null;
    }
  }, []);

  /**
   * Trigger the Turnstile challenge. Returns a promise that resolves
   * with the verification token once the challenge completes.
   *
   * If Turnstile is not enabled or not ready, resolves with an empty
   * string (allows forms to degrade gracefully).
   */
  const execute = useCallback((): Promise<string> => {
    // Not enabled — resolve immediately (graceful degradation)
    if (!TURNSTILE_SITE_KEY || !IS_PRODUCTION) {
      return Promise.resolve("");
    }

    // If we already have a valid token, return it
    if (token) {
      return Promise.resolve(token);
    }

    // Widget or API not ready — resolve empty (server-side will skip verification)
    if (
      typeof window === "undefined" ||
      !window.turnstile ||
      widgetIdRef.current === null
    ) {
      return Promise.resolve("");
    }

    return new Promise<string>((resolve) => {
      resolveRef.current = resolve;

      try {
        window.turnstile?.execute(widgetIdRef.current!);
      } catch {
        // Execute failed — resolve empty to not block form submission
        resolveRef.current = null;
        resolve("");
      }

      // Safety timeout: don't block the form forever if Turnstile hangs
      setTimeout(() => {
        if (resolveRef.current === resolve) {
          resolveRef.current = null;
          resolve("");
        }
      }, 10_000);
    });
  }, [token]);

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
          execution: "execute",
          callback: (newToken: string) => {
            if (isMounted) {
              setToken(newToken);
              // Resolve any pending execute() promise
              if (resolveRef.current) {
                resolveRef.current(newToken);
                resolveRef.current = null;
              }
            }
          },
          "expired-callback": () => {
            if (isMounted) setToken("");
          },
          "error-callback": () => {
            // Resolve pending promise with empty string on error
            if (resolveRef.current) {
              resolveRef.current("");
              resolveRef.current = null;
            }
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

      // Reject any pending promise
      if (resolveRef.current) {
        resolveRef.current("");
        resolveRef.current = null;
      }

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
    execute,
    reset,
    isEnabled: Boolean(TURNSTILE_SITE_KEY) && IS_PRODUCTION,
  };
}

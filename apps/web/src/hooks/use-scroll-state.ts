"use client";

import { useSyncExternalStore } from "react";

/* ────────────────────────────────────────────────────────
 * useScrollState — Single scroll listener for the entire app
 *
 * Uses useSyncExternalStore for React 18+ concurrent-safe
 * external state subscription. One rAF-throttled listener
 * is shared across all consumers — no matter how many
 * components call this hook, only ONE scroll handler runs.
 * ──────────────────────────────────────────────────────── */

interface ScrollState {
  scrollY: number;
  scrollProgress: number;
  isScrolled: boolean;
}

const SCROLL_THRESHOLD = 80;

// ── Module-level singleton store ──────────────────────
let state: ScrollState = {
  scrollY: 0,
  scrollProgress: 0,
  isScrolled: false,
};

const listeners = new Set<() => void>();
let ticking = false;
let listenerBound = false;

function handleScroll() {
  if (ticking) return;
  ticking = true;

  requestAnimationFrame(() => {
    const scrollY = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    state = {
      scrollY,
      scrollProgress,
      isScrolled: scrollY > SCROLL_THRESHOLD,
    };

    listeners.forEach((cb) => cb());
    ticking = false;
  });
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  // Lazily attach the singleton listener
  if (!listenerBound && typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll, { passive: true });
    listenerBound = true;
    // Fire once to hydrate initial state
    handleScroll();
  }

  return () => {
    listeners.delete(callback);

    // Clean up when no subscribers remain
    if (listeners.size === 0 && listenerBound) {
      window.removeEventListener("scroll", handleScroll);
      listenerBound = false;
    }
  };
}

function getSnapshot(): ScrollState {
  return state;
}

const SERVER_SNAPSHOT: ScrollState = {
  scrollY: 0,
  scrollProgress: 0,
  isScrolled: false,
};

function getServerSnapshot(): ScrollState {
  return SERVER_SNAPSHOT;
}

/**
 * Shared scroll state hook.
 *
 * Returns `{ scrollY, scrollProgress, isScrolled }` from
 * a single rAF-throttled scroll listener shared app-wide.
 *
 * @example
 * ```tsx
 * const { isScrolled, scrollY } = useScrollState();
 * ```
 */
export function useScrollState(): ScrollState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

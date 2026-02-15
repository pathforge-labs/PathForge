"use client";

import { useState, useEffect, useRef, type RefObject } from "react";

/**
 * Detect whether the user prefers reduced motion.
 * Evaluated once at module level (client-only) to avoid calling
 * setState synchronously inside an effect (react-hooks/set-state-in-effect).
 */
function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(): [
  RefObject<T | null>,
  boolean,
] {
  const ref = useRef<T | null>(null);
  // If the user prefers reduced motion, start visible immediately —
  // no animation needed, no effect required.
  const [isVisible, setIsVisible] = useState(getPrefersReducedMotion);

  useEffect(() => {
    // Already visible (reduced motion) — nothing to observe.
    if (isVisible) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isVisible]);

  return [ref, isVisible];
}

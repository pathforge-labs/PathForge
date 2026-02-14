"use client";

import { useEffect, type RefObject } from "react";
import { useScrollState } from "@/hooks/use-scroll-state";

interface NavScrollEffectProps {
  navRef: RefObject<HTMLElement | null>;
}

/**
 * Adds/removes the `nav-scrolled` class on the <nav> element
 * based on scroll position. Uses a React ref instead of DOM query.
 *
 * Performance: Uses shared useScrollState hook — one rAF-throttled
 * scroll listener for the entire app (replaces per-component listener).
 */
export function NavScrollEffect({ navRef }: NavScrollEffectProps) {
  const { isScrolled } = useScrollState();

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    if (isScrolled) {
      nav.classList.add("nav-scrolled");
    } else {
      nav.classList.remove("nav-scrolled");
    }
  }, [navRef, isScrolled]);

  return null; // Side-effect-only component
}

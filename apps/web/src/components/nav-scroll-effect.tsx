"use client";

import { useEffect } from "react";

/**
 * Adds/removes the `nav-scrolled` class on the <nav> element
 * based on scroll position. Activates after scrolling past the
 * hero section (~80px threshold) for a premium glass-intensify effect.
 */
export function NavScrollEffect() {
  useEffect(() => {
    const nav = document.querySelector("nav[aria-label='Main navigation']");
    if (!nav) return;

    const THRESHOLD = 80;

    function onScroll() {
      if (window.scrollY > THRESHOLD) {
        nav!.classList.add("nav-scrolled");
      } else {
        nav!.classList.remove("nav-scrolled");
      }
    }

    // Check initial position
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null; // This is a side-effect-only component
}

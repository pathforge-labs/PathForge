"use client";

import { ArrowUp } from "lucide-react";
import { useScrollState } from "@/hooks/use-scroll-state";

/**
 * Floating back-to-top button that appears after scrolling past
 * the hero section. Smooth-scrolls to top on click.
 * Tier-1 design: subtle glass effect with brand gradient hover.
 *
 * Performance: Uses shared useScrollState hook — one rAF-throttled
 * scroll listener for the entire app.
 */
export function BackToTop() {
  const { scrollY } = useScrollState();
  const visible = scrollY > 500;

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`back-to-top group fixed bottom-6 right-6 z-40 flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-primary to-accent shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/30 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5 text-white transition-all duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}

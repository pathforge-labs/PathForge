"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Floating back-to-top button that appears after scrolling past
 * the hero section. Smooth-scrolls to top on click.
 * Tier-1 design: subtle glass effect with brand gradient hover.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 500);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`back-to-top group fixed bottom-6 right-6 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border/30 bg-card/80 backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-primary" />
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";

/**
 * Scroll Progress Indicator
 * Fixed top-0 bar with brand gradient (violet→cyan).
 * Uses requestAnimationFrame for smooth, jank-free updates.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number;

    function onScroll() {
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-60 h-[2px] origin-left transition-none"
      style={{
        transform: `scaleX(${progress / 100})`,
        background:
          "linear-gradient(to right, oklch(0.7 0.18 270), oklch(0.75 0.15 195))",
        opacity: progress > 0 ? 1 : 0,
      }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    />
  );
}

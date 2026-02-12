"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface AnimatedBarProps {
  /** Target width as a CSS value, e.g. "92%" */
  targetWidth: string;
  /** Bar color class, e.g. "bg-violet-500" */
  colorClass: string;
  /** Stagger delay in ms */
  delay?: number;
}

/**
 * Scroll-triggered animated progress bar.
 * Animates width from 0% to targetWidth when visible in viewport.
 */
export function AnimatedBar({
  targetWidth,
  colorClass,
  delay = 0,
}: AnimatedBarProps) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div ref={ref} className="glow-bar h-2 overflow-hidden rounded-full bg-secondary">
      <div
        className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`}
        style={{
          width: isVisible ? targetWidth : "0%",
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  );
}

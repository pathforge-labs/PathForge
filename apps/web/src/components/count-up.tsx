"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface CountUpProps {
  /** Target value to count up to, e.g. "92" or "6" */
  end: string;
  /** Optional suffix like "%" or "+" */
  suffix?: string;
  /** Optional prefix like "<" or "$" */
  prefix?: string;
  /** Duration of the count-up animation in ms */
  duration?: number;
  className?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animated number counter that triggers on scroll visibility.
 * Counts from 0 to `end` with an easeOutCubic curve.
 * Respects prefers-reduced-motion via useScrollAnimation.
 */
export function CountUp({
  end,
  suffix = "",
  prefix = "",
  duration = 1500,
  className = "",
}: CountUpProps) {
  const [ref, isVisible] = useScrollAnimation();
  const [displayValue, setDisplayValue] = useState("0");
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    const numericEnd = parseInt(end, 10);
    if (isNaN(numericEnd)) {
      // Non-numeric value (like "Growing") — just show immediately
      setDisplayValue(end);
      return;
    }

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.round(easedProgress * numericEnd);

      setDisplayValue(String(current));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [end, duration]);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      // Use queueMicrotask to avoid synchronous setState inside effect body
      queueMicrotask(() => animate());
    }
  }, [isVisible, animate]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

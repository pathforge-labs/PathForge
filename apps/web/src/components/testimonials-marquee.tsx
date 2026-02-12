"use client";

import { useEffect, useRef, useCallback } from "react";

interface TestimonialsMarqueeProps {
  children: React.ReactNode;
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
  className?: string;
}

const SPEED_MAP = {
  slow: "60s",
  normal: "40s",
  fast: "25s",
};

export function TestimonialsMarquee({
  children,
  speed = "normal",
  direction = "left",
  className = "",
}: TestimonialsMarqueeProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hasClonedRef = useRef(false);

  const addAnimation = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || hasClonedRef.current) return;

    // Check reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    scroller.setAttribute("data-animated", "true");

    const inner = scroller.querySelector(
      "[data-marquee-inner]"
    ) as HTMLElement | null;
    if (!inner) return;

    const items = Array.from(inner.children);
    items.forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      inner.appendChild(clone);
    });

    hasClonedRef.current = true;
  }, []);

  useEffect(() => {
    addAnimation();
  }, [addAnimation]);

  return (
    <>
      <style>{`
        [data-marquee] {
          overflow: hidden;
          -webkit-mask: linear-gradient(90deg, transparent, white 4%, white 96%, transparent);
          mask: linear-gradient(90deg, transparent, white 4%, white 96%, transparent);
        }
        [data-marquee-inner] {
          display: flex;
          gap: 1.25rem;
        }
        [data-marquee][data-animated="true"] [data-marquee-inner] {
          width: max-content;
          flex-wrap: nowrap;
          animation: marquee-scroll var(--marquee-duration, 40s) var(--marquee-direction, normal) linear infinite;
        }
        [data-marquee]:hover [data-marquee-inner] {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          to {
            transform: translateX(calc(-50% - 0.625rem));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-marquee][data-animated="true"] [data-marquee-inner] {
            animation: none;
            flex-wrap: wrap;
            justify-content: center;
            width: auto;
          }
        }
      `}</style>
      <div
        ref={scrollerRef}
        data-marquee
        className={className}
        style={
          {
            "--marquee-duration": SPEED_MAP[speed],
            "--marquee-direction": direction === "left" ? "normal" : "reverse",
          } as React.CSSProperties
        }
      >
        <div data-marquee-inner>{children}</div>
      </div>
    </>
  );
}

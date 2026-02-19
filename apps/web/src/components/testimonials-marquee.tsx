"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TestimonialsMarqueeProps {
  children: React.ReactNode;
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
  className?: string;
  showControls?: boolean;
}

const SPEED_MAP = {
  slow: "60s",
  normal: "40s",
  fast: "25s",
} as const;

/** Milliseconds of inactivity before auto-scroll resumes after manual interaction */
const RESUME_DELAY_MS = 4000;
/** Pixels to scroll per arrow click (roughly one card width + gap) */
const SCROLL_STEP_PX = 400;
/** Minimum horizontal distance (px) before a pointer move is considered a drag */
const DRAG_THRESHOLD_PX = 5;

export function TestimonialsMarquee({
  children,
  speed = "normal",
  direction = "left",
  className = "",
  showControls = true,
}: TestimonialsMarqueeProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const hasClonedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  /* ─── Drag state refs (not reactive — no re-renders needed) ─── */
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const didDragRef = useRef(false);

  /* ─── Touch state refs ─── */
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isTouchScrollingRef = useRef(false);

  /* ─── Clone children for infinite scroll ─── */
  const addAnimation = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || hasClonedRef.current) return;

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

  /* ─── Animation control ─── */

  const pauseAnimation = useCallback(() => {
    const inner = scrollerRef.current?.querySelector("[data-marquee-inner]") as HTMLElement | null;
    if (inner) {
      inner.style.animationPlayState = "paused";
    }
    setIsPaused(true);
  }, []);

  const resumeAnimation = useCallback(() => {
    const inner = scrollerRef.current?.querySelector("[data-marquee-inner]") as HTMLElement | null;
    if (inner) {
      inner.style.animationPlayState = "running";
    }
    setIsPaused(false);
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      resumeAnimation();
      resumeTimerRef.current = null;
    }, RESUME_DELAY_MS);
  }, [resumeAnimation]);

  /** Arrow button scroll */
  const scrollByStep = useCallback((directionOffset: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    pauseAnimation();
    scroller.scrollBy({
      left: directionOffset * SCROLL_STEP_PX,
      behavior: "smooth",
    });
    scheduleResume();
  }, [pauseAnimation, scheduleResume]);

  /* ─── Desktop: click-and-drag ─── */

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    // Only handle primary button (left click), ignore touch (handled separately)
    if (event.button !== 0 || event.pointerType === "touch") return;

    const scroller = scrollerRef.current;
    if (!scroller) return;

    isDraggingRef.current = true;
    didDragRef.current = false;
    dragStartXRef.current = event.clientX;
    scrollStartRef.current = scroller.scrollLeft;

    scroller.setPointerCapture(event.pointerId);
    pauseAnimation();
  }, [pauseAnimation]);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (!isDraggingRef.current || event.pointerType === "touch") return;

    const scroller = scrollerRef.current;
    if (!scroller) return;

    const deltaX = event.clientX - dragStartXRef.current;

    // Only count as drag after exceeding threshold (distinguishes click from drag)
    if (Math.abs(deltaX) > DRAG_THRESHOLD_PX) {
      didDragRef.current = true;
      scroller.scrollLeft = scrollStartRef.current - deltaX;
    }
  }, []);

  const handlePointerUp = useCallback((event: React.PointerEvent) => {
    if (!isDraggingRef.current || event.pointerType === "touch") return;

    isDraggingRef.current = false;

    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.releasePointerCapture(event.pointerId);
    }

    scheduleResume();
  }, [scheduleResume]);

  /** Prevent click from firing on links/buttons after a drag gesture */
  const handleClickCapture = useCallback((event: React.MouseEvent) => {
    if (didDragRef.current) {
      event.preventDefault();
      event.stopPropagation();
      didDragRef.current = false;
    }
  }, []);

  /* ─── Mobile: touch swipe ─── */

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;

    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    isTouchScrollingRef.current = false;

    pauseAnimation();
  }, [pauseAnimation]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;

    // Determine scroll direction on first significant move
    if (!isTouchScrollingRef.current) {
      // Only hijack scroll if horizontal gesture is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > DRAG_THRESHOLD_PX) {
        isTouchScrollingRef.current = true;
      } else if (Math.abs(deltaY) > DRAG_THRESHOLD_PX) {
        // Vertical scroll — let the browser handle it naturally
        return;
      } else {
        return;
      }
    }

    // Horizontal swipe is active — scroll the container
    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.scrollLeft -= deltaX;
      // Update start position for incremental tracking
      touchStartXRef.current = touch.clientX;
      touchStartYRef.current = touch.clientY;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    isTouchScrollingRef.current = false;
    scheduleResume();
  }, [scheduleResume]);

  /** Clean up resume timer on unmount */
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

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

      <div className="relative group/marquee">
        <div
          ref={scrollerRef}
          data-marquee
          className={`${className} cursor-grab active:cursor-grabbing`}
          style={
            {
              "--marquee-duration": SPEED_MAP[speed],
              "--marquee-direction": direction === "left" ? "normal" : "reverse",
            } as React.CSSProperties
          }
          /* Desktop drag handlers */
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClickCapture={handleClickCapture}
          /* Mobile swipe handlers */
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div data-marquee-inner ref={innerRef}>{children}</div>
        </div>

        {/* Navigation arrow controls */}
        {showControls && (
          <>
            <button
              onClick={() => scrollByStep(-1)}
              aria-label="Scroll testimonials left"
              className={`absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-primary to-accent text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/30 sm:left-4 sm:h-11 sm:w-11 ${
                isPaused ? "opacity-100" : "opacity-0 group-hover/marquee:opacity-100"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollByStep(1)}
              aria-label="Scroll testimonials right"
              className={`absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-primary to-accent text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/30 sm:right-4 sm:h-11 sm:w-11 ${
                isPaused ? "opacity-100" : "opacity-0 group-hover/marquee:opacity-100"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </>
  );
}

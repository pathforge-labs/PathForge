"use client";

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { TrendingUp } from "lucide-react";

/* ─────────────────────── Scroll Animation Wrapper ─────── */

export function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────── Hero Dashboard Mockup ────────── */

export function HeroDashboard() {
  return (
    <div className="relative mx-auto mt-16 max-w-4xl">
      {/* Ambient glow behind dashboard */}
      <div
        className="pointer-events-none absolute -inset-8 rounded-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.7 0.18 270 / 12%) 0%, transparent 70%)",
        }}
      />

      {/* Dashboard frame */}
      <div className="elevated-card relative overflow-hidden rounded-2xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-border/40 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="ml-4 flex-1 rounded-md bg-background/30 px-3 py-1 text-center text-[11px] text-muted-foreground/50">
            app.pathforge.eu/dashboard
          </div>
        </div>

        {/* Dashboard content — 3-column metrics */}
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          {/* DNA Score */}
          <div className="animate-float" style={{ animationDelay: "0ms" }}>
          <div className="rounded-xl bg-background/30 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Career DNA™ Score
            </p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-primary">
                92
              </span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-linear-to-r from-primary to-accent"
                style={{ width: "92%" }}
              />
            </div>
            </div>
          </div>

          {/* Match Quality */}
          <div className="animate-float" style={{ animationDelay: "300ms" }}>
          <div className="rounded-xl bg-background/30 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Best Match
            </p>
            <p className="mt-2 font-display text-sm font-semibold">
              Staff Engineer
            </p>
            <p className="text-xs text-muted-foreground">at Vercel</p>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="flex h-5 items-center rounded-full bg-emerald-500/10 px-2 text-[10px] font-medium text-emerald-400">
                94% match
              </div>
              <div className="flex h-5 items-center rounded-full bg-primary/10 px-2 text-[10px] font-medium text-primary">
                +18% salary
              </div>
            </div>
            </div>
          </div>

          {/* Trajectory */}
          <div className="animate-float" style={{ animationDelay: "600ms" }}>
          <div className="rounded-xl bg-background/30 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Growth Trajectory
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="animate-pulse-subtle font-display text-sm font-semibold text-emerald-400">
                Accelerating
              </span>
            </div>
            {/* Mini chart bars */}
            <div className="mt-3 flex items-end gap-1">
              {[30, 40, 35, 55, 50, 65, 60, 75, 70, 85, 80, 92].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-linear-to-t from-primary/40 to-primary/80"
                    style={{ height: `${h * 0.3}px` }}
                  />
                )
              )}
            </div>
            </div>
          </div>
        </div>

        {/* Beam scan effect */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"
            style={{ animation: "beam-scan 4s ease-in-out infinite" }}
          />
        </div>
      </div>
    </div>
  );
}

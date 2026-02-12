"use client";

import { type ReactNode } from "react";

interface BorderGlowProps {
  children: ReactNode;
  className?: string;
}

/**
 * Animated conic-gradient border glow — Tier-1 hover effect.
 *
 * Uses CSS `@property --border-angle` for smooth rotation.
 * At rest the border is a subtle 1px white-alpha line.
 * On hover a violet→cyan gradient beam sweeps around the card
 * with a soft outer glow.
 *
 * Respects `prefers-reduced-motion`.
 */
export function BorderGlow({ children, className = "" }: BorderGlowProps) {
  return (
    <div className={`border-glow rounded-2xl p-px ${className}`}>
      {children}
    </div>
  );
}

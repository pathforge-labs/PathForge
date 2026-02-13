"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore, useCallback } from "react";
import { Moon, Sun } from "lucide-react";

const subscribe = () => () => {};

const SIZES = {
  sm: { button: "h-8 w-8", icon: "h-4 w-4" },
  lg: { button: "h-11 w-11", icon: "h-[22px] w-[22px]" },
} as const;

/**
 * Theme toggle button with Moon/Sun icons.
 * Uses useSyncExternalStore for SSR-safe hydration detection.
 */
export function ThemeToggle({ size = "sm" }: { size?: "sm" | "lg" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const toggle = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const s = SIZES[size];

  if (!mounted) {
    return (
      <button
        className={`flex ${s.button} items-center justify-center rounded-full text-muted-foreground`}
        aria-label="Toggle theme"
        disabled
      >
        <Moon className={s.icon} />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggle}
      className={`flex ${s.button} cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-foreground/8 hover:text-foreground`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className={s.icon} /> : <Moon className={s.icon} />}
    </button>
  );
}


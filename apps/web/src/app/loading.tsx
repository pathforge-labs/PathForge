/**
 * Global loading skeleton.
 * Displayed by Next.js during route transitions.
 * Uses brand pulse animation for a cohesive experience.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Pulsing logo placeholder */}
        <div className="h-10 w-10 animate-pulse rounded-xl bg-primary/20" />
        {/* Loading bar */}
        <div className="h-1 w-32 overflow-hidden rounded-full bg-muted/30">
          <div
            className="h-full w-full origin-left animate-[loading-bar_1.5s_ease-in-out_infinite] rounded-full"
            style={{
              background:
                "linear-gradient(to right, oklch(0.7 0.18 270), oklch(0.75 0.15 195))",
            }}
          />
        </div>
      </div>
    </div>
  );
}

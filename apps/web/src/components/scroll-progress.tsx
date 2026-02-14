/**
 * Scroll Progress Indicator — Pure CSS
 *
 * Uses CSS `animation-timeline: scroll()` to drive progress.
 * Zero JavaScript — no useState, useEffect, or scroll listeners.
 * The bar is fully painted by the compositor thread for jank-free
 * 60fps+ performance.
 *
 * Browser support: Chrome 115+, Edge 115+, Firefox 110+, Safari 18+.
 * Unsupported browsers gracefully degrade (no bar shown).
 */
export function ScrollProgress() {
  return (
    <div
      className="scroll-progress-bar"
      role="progressbar"
      aria-label="Page scroll progress"
    />
  );
}

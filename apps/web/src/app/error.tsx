"use client";

import Link from "next/link";
import { APP_NAME } from "@/config/brand";

/**
 * Global error boundary.
 * Client component required by Next.js for error handling.
 * Provides "Try Again" and "Back to Home" options.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute h-[400px] w-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.704 0.191 22.216 / 8%) 0%, transparent 70%)",
        }}
      />

      <div className="relative text-center">
        <h1 className="font-display mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mx-auto mb-8 max-w-md text-muted-foreground">
          {APP_NAME} encountered an unexpected error. This has been noted and
          we&apos;re looking into it.
        </p>
        {error.digest && (
          <p className="mb-6 text-xs text-muted-foreground/40">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-xl bg-linear-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/20"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-border/30 px-6 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/30 hover:text-foreground"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

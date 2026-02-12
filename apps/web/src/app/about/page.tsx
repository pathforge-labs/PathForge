import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME, APP_COMPANY } from "@/config/brand";

export const metadata: Metadata = {
  title: "About",
  description: `About ${APP_NAME} by ${APP_COMPANY}. We're building the Career Intelligence Platform — using AI to decode Career DNA™ and match professionals with opportunities that truly align.`,
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display mb-4 text-4xl font-bold tracking-tight">
          About {APP_NAME}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {APP_NAME} is built by {APP_COMPANY} — a team passionate about fixing
          how career decisions are made. We&apos;re combining AI, semantic
          analysis, and real market data to build a platform that truly
          understands professionals.
        </p>
        <p className="mb-12 text-sm text-muted-foreground/60">
          Full about page coming soon.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME, APP_AUTHOR_EMAIL } from "@/config/brand";

export const metadata: Metadata = {
  title: "Careers",
  description: `Careers at ${APP_NAME}. We're not hiring yet, but we're building something extraordinary. Join the waitlist to be the first to know when we open positions.`,
};

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display mb-4 text-4xl font-bold tracking-tight">
          Careers
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          We&apos;re not hiring yet — but we&apos;re building something
          extraordinary. When we do open roles, we&apos;ll look for people who
          believe career decisions deserve better tools.
        </p>
        <p className="mb-12 text-sm text-muted-foreground/60">
          Interested? Reach us at{" "}
          <a
            href={`mailto:${APP_AUTHOR_EMAIL}`}
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {APP_AUTHOR_EMAIL}
          </a>
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

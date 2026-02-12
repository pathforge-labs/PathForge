import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/config/brand";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `${APP_NAME} Cookie Policy. We use only essential cookies — no tracking, no ads, no third-party data sharing. Full transparency on how cookies work on our platform.`,
};

export default function CookiesPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display mb-4 text-4xl font-bold tracking-tight">
          Cookie Policy
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {APP_NAME} uses only essential cookies to make the platform work. No
          tracking cookies, no advertising cookies, no third-party data sharing.
        </p>
        <p className="mb-12 text-sm text-muted-foreground/60">
          Full cookie policy will be published before launch.
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

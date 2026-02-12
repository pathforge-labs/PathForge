import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/config/brand";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `${APP_NAME} Terms of Service. Clear, fair terms designed to protect both you and the platform. No hidden clauses — transparency is core to our mission.`,
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display mb-4 text-4xl font-bold tracking-tight">
          Terms of Service
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          We believe in clear, fair terms. {APP_NAME}&apos;s terms of service
          are designed to protect both you and the platform — no hidden clauses,
          no surprises.
        </p>
        <p className="mb-12 text-sm text-muted-foreground/60">
          Full terms of service will be published before launch.
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

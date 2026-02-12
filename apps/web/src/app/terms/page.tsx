import Link from "next/link";
import { APP_NAME } from "@/config/brand";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display mb-4 text-4xl font-bold tracking-tight">
          Terms of Service
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {APP_NAME}&apos;s terms of service are being prepared. We believe in
          clear, fair terms that respect your rights as a user.
        </p>
        <p className="mb-10 text-sm text-muted-foreground/60">
          This page will be updated before our public launch. For questions,
          contact{" "}
          <a
            href="mailto:hello@pathforge.eu"
            className="text-primary underline underline-offset-4"
          >
            hello@pathforge.eu
          </a>
        </p>
        <Link
          href="/"
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

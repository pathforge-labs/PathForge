import Link from "next/link";
import { APP_NAME } from "@/config/brand";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display mb-4 text-4xl font-bold tracking-tight">
          About {APP_NAME}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {APP_NAME} is a Career Intelligence Platform built by BesyncLabs.
          We&apos;re democratizing enterprise-grade career intelligence —
          Skills Graphs, Market Signals, and Predictive Analytics — for every
          professional.
        </p>
        <p className="mb-10 text-sm text-muted-foreground/60">
          Full company information will be available before our public launch.
          For inquiries, reach us at{" "}
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

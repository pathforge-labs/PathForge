import Link from "next/link";
import { APP_NAME } from "@/config/brand";

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display mb-4 text-4xl font-bold tracking-tight">
          Careers at {APP_NAME}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          We&apos;re building the future of career intelligence. When we begin
          hiring, open positions will be listed here. In the meantime,
          we&apos;d love to hear from passionate engineers, designers, and
          data scientists.
        </p>
        <p className="mb-10 text-sm text-muted-foreground/60">
          Interested? Send your pitch to{" "}
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

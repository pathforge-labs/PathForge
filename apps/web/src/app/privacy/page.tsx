import Link from "next/link";
import { APP_NAME } from "@/config/brand";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display mb-4 text-4xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {APP_NAME}&apos;s privacy policy is being finalized. We are committed
          to GDPR-native data handling and full transparency in how we process
          your career data.
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

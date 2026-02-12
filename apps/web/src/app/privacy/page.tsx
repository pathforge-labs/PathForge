import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/config/brand";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `${APP_NAME} Privacy Policy. Learn how we protect your data with GDPR-native practices. Your career data is encrypted, never sold, and fully under your control.`,
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display mb-4 text-4xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Your privacy is fundamental to {APP_NAME}. We&apos;re building a
          GDPR-native platform from the ground up — your career data is
          encrypted, never sold, and always under your control.
        </p>
        <p className="mb-12 text-sm text-muted-foreground/60">
          Full privacy policy will be published before launch.
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

import Link from "next/link";
import { APP_NAME } from "@/config/brand";

/**
 * Custom 404 page with branded design.
 * Next.js automatically uses this for all unmatched routes.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute h-[400px] w-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.7 0.18 270 / 8%) 0%, transparent 70%)",
        }}
      />

      <div className="relative text-center">
        {/* Large 404 number */}
        <p className="font-display text-[8rem] font-extrabold leading-none tracking-tighter text-foreground/5 sm:text-[12rem]">
          404
        </p>

        {/* Overlaid content */}
        <div className="-mt-16 sm:-mt-24">
          <h1 className="font-display mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Page not found
          </h1>
          <p className="mb-8 max-w-md text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back to {APP_NAME}.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/20"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

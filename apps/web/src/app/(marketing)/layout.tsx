import Script from "next/script";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { ScrollProgress } from "@/components/scroll-progress";
import { CookieConsent } from "@/components/cookie-consent";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip to content (a11y) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <ScrollProgress />
      <Navbar />

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <Footer />
      <BackToTop />
      <CookieConsent />

      {/* Turnstile script — loaded once globally, production only */}
      {TURNSTILE_SITE_KEY && IS_PRODUCTION && (
        <Script
          id="cf-turnstile-script"
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="lazyOnload"
        />
      )}
    </div>
  );
}

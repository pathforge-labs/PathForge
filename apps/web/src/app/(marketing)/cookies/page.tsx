import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/animated-sections";
import { APP_NAME, APP_AUTHOR_EMAIL } from "@/config/brand";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `${APP_NAME} Cookie Policy. We use only essential cookies by default — no tracking without your consent.`,
};

const COOKIE_TYPES = [
  {
    category: "Essential",
    required: true,
    description: "Required for the platform to function. Cannot be disabled.",
    examples: [
      { name: "session_id", purpose: "Maintains your login session", duration: "Session" },
      { name: "csrf_token", purpose: "Prevents cross-site request forgery", duration: "Session" },
      { name: "cookie_consent", purpose: "Remembers your cookie preferences", duration: "1 year" },
    ],
  },
  {
    category: "Analytics",
    required: false,
    description: "Help us understand how you use the platform to improve the experience. Data is anonymized.",
    examples: [
      { name: "analytics_session", purpose: "Anonymous session tracking", duration: "30 minutes" },
      { name: "page_views", purpose: "Tracks pages visited (anonymized)", duration: "Session" },
    ],
  },
  {
    category: "Functional",
    required: false,
    description: "Remember your preferences and settings for a better experience.",
    examples: [
      { name: "theme", purpose: "Remembers dark/light mode preference", duration: "1 year" },
      { name: "locale", purpose: "Remembers language preference", duration: "1 year" },
    ],
  },
];

export default function CookiesPage() {
  return (
    <article className="px-6 pb-24 pt-24 sm:pt-32">
      <AnimatedSection className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 border-b border-border/30 pb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            Legal
          </p>
          <h1 className="font-display mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Cookie Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: February 12, 2026 &middot;{" "}
            <span className="text-foreground/60">Effective immediately</span>
          </p>
        </div>

        <div className="prose-custom space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-4 [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mb-2 [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:list-disc">
          <section>
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences and understand how you interact with it. We use cookies responsibly and transparently.
            </p>
          </section>

          <section>
            <h2>2. Our Approach</h2>
            <p>
              {APP_NAME} follows a <strong className="text-foreground">privacy-first</strong> approach to cookies:
            </p>
            <ul>
              <li>We use only essential cookies by default — no tracking without your explicit consent.</li>
              <li>We never use cookies for advertising or cross-site tracking.</li>
              <li>We never sell cookie data to third parties.</li>
              <li>All non-essential cookies require your opt-in consent.</li>
            </ul>
          </section>

          <section>
            <h2>3. Cookie Categories</h2>
            <div className="space-y-6">
              {COOKIE_TYPES.map((type) => (
                <div key={type.category} className="rounded-xl border border-border/20 bg-card/20 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border/10 px-5 py-3">
                    <h3 className="text-sm font-semibold text-foreground mb-0!">{type.category}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      type.required
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {type.required ? "Required" : "Optional"}
                    </span>
                  </div>
                  <div className="px-5 py-4">
                    <p className="mb-4 text-sm text-muted-foreground">{type.description}</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border/10">
                            <th className="pb-2 pr-4 text-left font-medium text-foreground/70">Name</th>
                            <th className="pb-2 pr-4 text-left font-medium text-foreground/70">Purpose</th>
                            <th className="pb-2 text-left font-medium text-foreground/70">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {type.examples.map((cookie) => (
                            <tr key={cookie.name} className="border-b border-border/5 last:border-0">
                              <td className="py-2 pr-4 font-mono text-xs text-primary/80">{cookie.name}</td>
                              <td className="py-2 pr-4">{cookie.purpose}</td>
                              <td className="py-2 whitespace-nowrap">{cookie.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>4. Managing Cookies</h2>
            <h3>Browser Settings</h3>
            <p>
              You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that blocking essential cookies may prevent the platform from functioning correctly.
            </p>
            <h3 className="mt-4">Our Cookie Banner</h3>
            <p>
              When you first visit {APP_NAME}, a cookie consent banner is displayed. You can accept or reject non-essential cookies at any time. Your preference is stored for 12 months using an essential cookie.
            </p>
          </section>

          <section>
            <h2>5. Third-Party Cookies</h2>
            <p>
              We aim to minimize third-party cookies. Currently, we use:
            </p>
            <ul>
              <li><strong>None for advertising</strong> — we do not run ads.</li>
              <li><strong>Privacy-first analytics</strong> — our analytics tooling is configured to minimize data collection and anonymize all visitor data.</li>
            </ul>
            <p className="mt-3">
              We will update this list if our use of third-party services changes.
            </p>
          </section>

          <section>
            <h2>6. Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy as our use of cookies evolves. The &ldquo;Last updated&rdquo; date will be revised accordingly.
            </p>
          </section>

          <section>
            <h2>7. Contact</h2>
            <p>
              For questions about our use of cookies, contact us at{" "}
              <a href={`mailto:${APP_AUTHOR_EMAIL}`} className="text-primary hover:underline">
                {APP_AUTHOR_EMAIL}
              </a>.
            </p>
          </section>

          <div className="mt-12 border-t border-border/20 pt-6 text-xs text-muted-foreground/50">
            <p>See also: <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> · <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link></p>
          </div>
        </div>
      </AnimatedSection>
    </article>
  );
}

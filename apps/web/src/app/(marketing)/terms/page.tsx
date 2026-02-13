import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/animated-sections";
import { APP_NAME, APP_DOMAIN, APP_AUTHOR_EMAIL, APP_COMPANY, APP_COUNTRY } from "@/config/brand";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `${APP_NAME} Terms of Service. Clear, fair terms that govern your use of our career intelligence platform.`,
};

export default function TermsPage() {
  return (
    <article className="px-6 pb-24 pt-24 sm:pt-32">
      <AnimatedSection className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 border-b border-border/30 pb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            Legal
          </p>
          <h1 className="font-display mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: February 12, 2026 &middot;{" "}
            <span className="text-foreground/60">Effective immediately</span>
          </p>
        </div>

        <div className="prose-custom space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-4 [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mb-2 [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:list-disc">
          <section>
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using {APP_NAME} ({APP_DOMAIN}), operated by {APP_COMPANY}, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.
            </p>
          </section>

          <section>
            <h2>2. Definitions</h2>
            <ul>
              <li><strong>&ldquo;Platform&rdquo;</strong> refers to {APP_NAME}, including the website, API, and all related services.</li>
              <li><strong>&ldquo;User&rdquo;</strong> or <strong>&ldquo;You&rdquo;</strong> refers to any individual accessing or using the Platform.</li>
              <li><strong>&ldquo;Content&rdquo;</strong> refers to any data, documents, or materials you upload or create on the Platform.</li>
              <li><strong>&ldquo;Career DNA™&rdquo;</strong> refers to our proprietary career analysis technology.</li>
              <li><strong>&ldquo;Services&rdquo;</strong> refers to the career intelligence features provided by the Platform.</li>
            </ul>
          </section>

          <section>
            <h2>3. Eligibility</h2>
            <p>
              You must be at least 16 years old to use {APP_NAME}. By using the Platform, you represent that you meet this requirement, have the legal capacity to enter into these terms, and are not barred from using the service under applicable law.
            </p>
          </section>

          <section>
            <h2>4. Account Responsibilities</h2>
            <p>When you create an account, you agree to:</p>
            <ul>
              <li>Provide accurate, current, and complete information.</li>
              <li>Maintain the security of your account credentials.</li>
              <li>Notify us immediately of any unauthorized access.</li>
              <li>Accept responsibility for all activities under your account.</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2>5. Acceptable Use</h2>
            <p>You agree NOT to:</p>
            <ul>
              <li>Use the Platform for any illegal or unauthorized purpose.</li>
              <li>Upload malicious content, viruses, or harmful code.</li>
              <li>Attempt to reverse engineer, decompile, or extract source code.</li>
              <li>Scrape, crawl, or harvest data from the Platform without authorization.</li>
              <li>Impersonate another person or entity.</li>
              <li>Use the Platform to discriminate against any individual or group.</li>
              <li>Interfere with or disrupt the Platform&apos;s infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2>6. Your Content</h2>
            <h3>6.1 Ownership</h3>
            <p>
              You retain all ownership rights to your Content (resumes, career documents, profile data). By uploading Content, you grant us a limited, non-exclusive license to process it solely for the purpose of providing the Services.
            </p>
            <h3 className="mt-4">6.2 Processing</h3>
            <p>
              Your Content is processed to generate Career DNA™ analysis and personalized recommendations. We do not use your Content for model training without your explicit, opt-in consent. You may delete your Content and request full data erasure at any time.
            </p>
          </section>

          <section>
            <h2>7. Intellectual Property</h2>
            <p>
              {APP_NAME}, Career DNA™, and all related logos, designs, text, graphics, and software are the intellectual property of {APP_COMPANY}. These terms do not grant you any right to use our trademarks, branding, or proprietary technology beyond normal platform use.
            </p>
          </section>

          <section>
            <h2>8. Service Availability</h2>
            <p>
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. We may temporarily suspend the Platform for:
            </p>
            <ul>
              <li>Planned maintenance (we aim to notify in advance).</li>
              <li>Emergency security patches.</li>
              <li>Force majeure events beyond our reasonable control.</li>
            </ul>
          </section>

          <section>
            <h2>9. AI-Generated Content Disclaimer</h2>
            <p>
              {APP_NAME} uses artificial intelligence to generate career recommendations, match scores, and analysis. While we strive for accuracy:
            </p>
            <ul>
              <li>AI-generated recommendations are informational, not professional advice.</li>
              <li>Results should be used as one input in your career decision-making.</li>
              <li>We do not guarantee the accuracy of salary data, market predictions, or match scores.</li>
              <li>You are responsible for verifying any information before acting on it.</li>
            </ul>
          </section>

          <section>
            <h2>10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, {APP_COMPANY} shall not be liable for:
            </p>
            <ul>
              <li>Any indirect, incidental, special, or consequential damages.</li>
              <li>Loss of profits, revenue, data, or business opportunities.</li>
              <li>Damages arising from your reliance on AI-generated recommendations.</li>
              <li>Third-party actions or content.</li>
            </ul>
            <p className="mt-3">
              Our total liability is limited to the amount you paid for the Services in the 12 months preceding the claim, or €100, whichever is greater.
            </p>
          </section>

          <section>
            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless {APP_COMPANY}, its officers, employees, and partners from any claims, damages, or expenses arising from your violation of these terms or your use of the Platform.
            </p>
          </section>

          <section>
            <h2>12. Termination</h2>
            <p>
              You may terminate your account at any time. We may terminate or suspend access if:
            </p>
            <ul>
              <li>You violate these Terms of Service.</li>
              <li>We are required to do so by law.</li>
              <li>We discontinue the Service (with reasonable notice).</li>
            </ul>
            <p className="mt-3">
              Upon termination, your right to use the Platform ceases immediately. We will retain or delete your data in accordance with our{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2>13. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. We will notify registered users of material changes via email at least 30 days before they take effect. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>14. Governing Law</h2>
            <p>
              These terms are governed by the laws of the {APP_COUNTRY}. Any disputes shall be submitted to the exclusive jurisdiction of the courts in Amsterdam, the {APP_COUNTRY}. Nothing in these terms limits your rights under mandatory consumer protection laws.
            </p>
          </section>

          <section>
            <h2>15. Severability</h2>
            <p>
              If any provision of these terms is found to be unenforceable, the remaining provisions will continue to apply in full force and effect.
            </p>
          </section>

          <section>
            <h2>16. Contact</h2>
            <div className="mt-3 rounded-lg border border-border/20 bg-card/30 p-4">
              <p className="font-medium text-foreground">{APP_COMPANY}</p>
              <p>Email: <a href={`mailto:${APP_AUTHOR_EMAIL}`} className="text-primary hover:underline">{APP_AUTHOR_EMAIL}</a></p>
              <p>Website: <a href={`https://${APP_DOMAIN}`} className="text-primary hover:underline">{APP_DOMAIN}</a></p>
            </div>
          </section>

          <div className="mt-12 border-t border-border/20 pt-6 text-xs text-muted-foreground/50">
            <p>See also: <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> · <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link></p>
          </div>
        </div>
      </AnimatedSection>
    </article>
  );
}

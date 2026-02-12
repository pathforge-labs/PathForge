import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/animated-sections";
import { APP_NAME, APP_DOMAIN, APP_AUTHOR_EMAIL, APP_COMPANY, APP_COUNTRY } from "@/config/brand";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `${APP_NAME} Privacy Policy. Learn how we collect, use, and protect your personal data in compliance with GDPR and EU regulations.`,
};

export default function PrivacyPage() {
  return (
    <article className="px-6 pb-24 pt-16 sm:pt-24">
      <AnimatedSection className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 border-b border-border/30 pb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            Legal
          </p>
          <h1 className="font-display mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: February 12, 2026 &middot;{" "}
            <span className="text-foreground/60">Effective immediately</span>
          </p>
        </div>

        {/* Content */}
        <div className="prose-custom space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mb-4 [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mb-2 [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:list-disc">
          <section>
            <h2>1. Introduction</h2>
            <p>
              {APP_COMPANY} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates {APP_NAME} ({APP_DOMAIN}). Your privacy is fundamentally important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p className="mt-3">
              As a company based in the {APP_COUNTRY}, we operate under the General Data Protection Regulation (GDPR) and treat all users — regardless of location — to the same high standard of data protection.
            </p>
          </section>

          <section>
            <h2>2. Data Controller</h2>
            <p>
              The data controller responsible for your personal data is:
            </p>
            <div className="mt-3 rounded-lg border border-border/20 bg-card/30 p-4">
              <p className="font-medium text-foreground">{APP_COMPANY}</p>
              <p>{APP_COUNTRY}</p>
              <p>Email: <a href={`mailto:${APP_AUTHOR_EMAIL}`} className="text-primary hover:underline">{APP_AUTHOR_EMAIL}</a></p>
            </div>
          </section>

          <section>
            <h2>3. Data We Collect</h2>
            <h3>3.1 Information You Provide</h3>
            <ul>
              <li><strong>Account data:</strong> Name, email address when you create an account or join our waitlist.</li>
              <li><strong>Career documents:</strong> Resumes/CVs you upload for Career DNA™ analysis.</li>
              <li><strong>Profile information:</strong> Professional preferences and career goals you configure.</li>
              <li><strong>Communications:</strong> Messages you send to us via email or support channels.</li>
            </ul>

            <h3 className="mt-6">3.2 Automatically Collected Data</h3>
            <ul>
              <li><strong>Usage data:</strong> Pages visited, features used, and interaction patterns (anonymized).</li>
              <li><strong>Device data:</strong> Browser type, operating system, screen resolution.</li>
              <li><strong>Log data:</strong> IP address (anonymized), access timestamps, referral URLs.</li>
            </ul>

            <h3 className="mt-6">3.3 Data We Do NOT Collect</h3>
            <ul>
              <li>We do not sell your data. Ever.</li>
              <li>We do not track you across other websites.</li>
              <li>We do not use your career documents for model training without explicit consent.</li>
            </ul>
          </section>

          <section>
            <h2>4. How We Use Your Data</h2>
            <ul>
              <li><strong>Career intelligence:</strong> To analyze your career profile and provide personalized recommendations.</li>
              <li><strong>Service improvement:</strong> To understand usage patterns and improve the platform (aggregated, anonymized).</li>
              <li><strong>Communications:</strong> To send product updates you&apos;ve opted into (you can unsubscribe anytime).</li>
              <li><strong>Security:</strong> To detect and prevent fraud, abuse, or security incidents.</li>
              <li><strong>Legal compliance:</strong> To meet regulatory requirements.</li>
            </ul>
          </section>

          <section>
            <h2>5. Legal Basis for Processing</h2>
            <p>Under GDPR, we process your data based on:</p>
            <ul>
              <li><strong>Consent:</strong> For waitlist sign-ups and marketing communications.</li>
              <li><strong>Contract performance:</strong> To provide the {APP_NAME} service you&apos;ve requested.</li>
              <li><strong>Legitimate interest:</strong> For security, fraud prevention, and service improvement.</li>
              <li><strong>Legal obligation:</strong> When required by applicable EU/NL law.</li>
            </ul>
          </section>

          <section>
            <h2>6. Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary for the purposes outlined in this policy:
            </p>
            <ul>
              <li><strong>Account data:</strong> Until you request deletion or 2 years after last activity.</li>
              <li><strong>Career documents:</strong> Until you delete them or request account deletion.</li>
              <li><strong>Usage analytics:</strong> 26 months (anonymized after 14 days).</li>
              <li><strong>Communication records:</strong> 5 years for legal compliance.</li>
            </ul>
          </section>

          <section>
            <h2>7. Your Rights (GDPR)</h2>
            <p>As a data subject, you have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of all personal data we hold about you.</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data.</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data (&ldquo;right to be forgotten&rdquo;).</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong>Restriction:</strong> Request that we limit processing of your data.</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interest.</li>
              <li><strong>Withdraw consent:</strong> Withdraw previously given consent at any time.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href={`mailto:${APP_AUTHOR_EMAIL}`} className="text-primary hover:underline">
                {APP_AUTHOR_EMAIL}
              </a>. We respond within 30 days.
            </p>
          </section>

          <section>
            <h2>8. Data Security</h2>
            <p>
              We implement industry-standard security measures including:
            </p>
            <ul>
              <li>TLS 1.3 encryption for all data in transit</li>
              <li>AES-256 encryption for data at rest</li>
              <li>Regular security audits and penetration testing</li>
              <li>Strict access controls with principle of least privilege</li>
              <li>EU-based data infrastructure</li>
            </ul>
          </section>

          <section>
            <h2>9. Third-Party Services</h2>
            <p>
              We may use third-party services that process data on our behalf. All third-party processors are GDPR-compliant and have signed Data Processing Agreements (DPAs):
            </p>
            <ul>
              <li><strong>Hosting:</strong> Vercel (EU region)</li>
              <li><strong>Analytics:</strong> Anonymized, privacy-first analytics (no cookies required)</li>
              <li><strong>Email:</strong> Transactional email service for account-related communications</li>
            </ul>
          </section>

          <section>
            <h2>10. International Transfers</h2>
            <p>
              Your data is primarily stored and processed within the European Economic Area (EEA). If any data is transferred outside the EEA, we ensure adequate protection through Standard Contractual Clauses (SCCs) or other GDPR-approved mechanisms.
            </p>
          </section>

          <section>
            <h2>11. Children&apos;s Privacy</h2>
            <p>
              {APP_NAME} is not intended for individuals under 16 years of age. We do not knowingly collect personal data from children. If we become aware of any such data, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify registered users of significant changes via email and update the &ldquo;Last updated&rdquo; date. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>13. Contact Us</h2>
            <p>
              For privacy-related inquiries or to exercise your data rights:
            </p>
            <div className="mt-3 rounded-lg border border-border/20 bg-card/30 p-4">
              <p className="font-medium text-foreground">{APP_COMPANY}</p>
              <p>Email: <a href={`mailto:${APP_AUTHOR_EMAIL}`} className="text-primary hover:underline">{APP_AUTHOR_EMAIL}</a></p>
              <p className="mt-2 text-xs text-muted-foreground/60">
                You also have the right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).
              </p>
            </div>
          </section>

          <div className="mt-12 border-t border-border/20 pt-6 text-xs text-muted-foreground/50">
            <p>See also: <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> · <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link></p>
          </div>
        </div>
      </AnimatedSection>
    </article>
  );
}

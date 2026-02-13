import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-sections";
import { APP_NAME, APP_AUTHOR_EMAIL, APP_COMPANY, APP_COUNTRY, APP_COUNTRY_FLAG, SOCIAL_LINKS } from "@/config/brand";
import { Mail, MapPin, Linkedin, Github, X, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${APP_NAME} team. Questions, feedback, partnership inquiries — we'd love to hear from you.`,
};

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: APP_AUTHOR_EMAIL,
    href: `mailto:${APP_AUTHOR_EMAIL}`,
    description: "For general inquiries and support",
  },
  {
    icon: MapPin,
    label: "Location",
    value: `${APP_COUNTRY} ${APP_COUNTRY_FLAG}`,
    href: null,
    description: `${APP_COMPANY} is based in the ${APP_COUNTRY}`,
  },
];

const SOCIAL_CHANNELS = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    handle: "PathForge",
  },
  {
    icon: Github,
    label: "GitHub",
    href: SOCIAL_LINKS.github,
    handle: "pathforge",
  },
  {
    icon: X,
    label: "X (Twitter)",
    href: SOCIAL_LINKS.x,
    handle: "@pathforge",
  },
];

const FAQ_ITEMS = [
  {
    q: "When will PathForge launch?",
    a: "We're currently in development with a waitlist open. Early adopters will get free access to all features at launch.",
  },
  {
    q: "Can I invest or partner with PathForge?",
    a: `We're open to conversations about partnerships and investment. Email us at ${APP_AUTHOR_EMAIL} with details about your proposed collaboration.`,
  },
  {
    q: "I'm a journalist. How can I feature PathForge?",
    a: `For press inquiries, reach out via ${APP_AUTHOR_EMAIL}. We're happy to provide product demos, founder interviews, and high-res brand assets.`,
  },
  {
    q: "I found a bug or have a feature request.",
    a: `We appreciate it! Send details to ${APP_AUTHOR_EMAIL} or open an issue on our GitHub. Every report helps us improve.`,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-28 sm:pt-36">
        <div className="pointer-events-none absolute -left-64 -top-64 h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.75 0.15 195 / 8%), transparent 70%)" }} />
        <AnimatedSection className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <MessageCircle className="h-3.5 w-3.5" />
            Get in Touch
          </div>
          <h1 className="font-display mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
            We&apos;d Love to{" "}
            <span className="gradient-text">Hear From You</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Questions, feedback, partnership inquiries, or just saying hello — we respond to every message.
          </p>
        </AnimatedSection>
      </section>

      {/* Contact channels */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-2xl space-y-4">
          {CONTACT_CHANNELS.map((channel) => (
            <AnimatedSection key={channel.label}>
              <div className="flex items-start gap-4 rounded-xl border border-border/20 bg-card/20 p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <channel.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
                    {channel.label}
                  </p>
                  {channel.href ? (
                    <a href={channel.href} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                      {channel.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-foreground">{channel.value}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">{channel.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Social */}
      <section className="px-6 pb-16">
        <AnimatedSection className="mx-auto max-w-2xl">
          <h2 className="font-display mb-6 text-center text-xl font-bold tracking-tight">
            Connect With Us
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {SOCIAL_CHANNELS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border/20 bg-card/20 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5"
              >
                <social.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{social.label}</p>
                  <p className="text-xs text-muted-foreground">{social.handle}</p>
                </div>
              </a>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-24">
        <AnimatedSection className="mx-auto max-w-2xl">
          <h2 className="font-display mb-8 text-center text-xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <AnimatedSection key={item.q} delay={i * 80}>
                <div className="rounded-xl border border-border/20 bg-card/20 p-5">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{item.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}

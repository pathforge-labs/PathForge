import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animated-sections";
import { ContactForm } from "@/components/contact-form";
import {
  APP_NAME,
  APP_AUTHOR_EMAIL,
  APP_COMPANY,
  APP_COUNTRY,
  APP_COUNTRY_FLAG,
  SOCIAL_LINKS,
} from "@/config/brand";
import {
  Mail,
  MapPin,
  Linkedin,
  Instagram,
  Briefcase,
  MessageCircle,
  Clock,
  Send,
  X,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${APP_NAME} team. Questions, feedback, partnership inquiries — we'd love to hear from you.`,
};

/* ─── Department Contact Cards ─── */
const DEPARTMENT_CARDS = [
  {
    icon: Mail,
    title: "General Inquiries",
    description: "For questions, support, and feedback",
    email: APP_AUTHOR_EMAIL,
  },
  {
    icon: Briefcase,
    title: "Business & Press",
    description: "Partnerships, investments, and media inquiries",
    email: APP_AUTHOR_EMAIL,
    comingSoon: true,
  },
  {
    icon: MapPin,
    title: "Location",
    description: `${APP_COMPANY} is headquartered in the ${APP_COUNTRY}`,
    location: `${APP_COUNTRY} ${APP_COUNTRY_FLAG}`,
  },
];

/* ─── Social Channels ─── */
const SOCIAL_CHANNELS = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    handle: "PathForge",
    color: "hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/5",
  },
  {
    icon: Instagram,
    label: "Instagram",
    href: SOCIAL_LINKS.instagram,
    handle: "@pathforge",
    color: "hover:border-[#E4405F]/30 hover:bg-[#E4405F]/5",
  },
  {
    icon: X,
    label: "X (Twitter)",
    href: SOCIAL_LINKS.x,
    handle: "@pathforge",
    color: "hover:border-foreground/20 hover:bg-foreground/5",
  },
];

/* ─── FAQ ─── */
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
    a: `We appreciate it! Send details to ${APP_AUTHOR_EMAIL}. Every report helps us improve.`,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ─── Background Ambient Glows ─── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -left-48 top-32 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.15 260 / 10%), transparent 70%)",
          }}
        />
        <div
          className="absolute -right-48 top-[600px] h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.70 0.12 195 / 10%), transparent 70%)",
          }}
        />
      </div>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden px-6 pb-12 pt-28 sm:pt-36">
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
            Questions, feedback, partnership inquiries, or just saying hello —
            we respond to every message.
          </p>

          {/* Response time indicator */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-xs font-medium text-emerald-500 dark:text-emerald-400">
            <Clock className="h-3.5 w-3.5" />
            We typically respond within 24–48 hours
          </div>
        </AnimatedSection>
      </section>

      {/* ─── Two-Column: Form + Department Cards ─── */}
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-12">
          {/* Left: Contact Form */}
          <AnimatedSection className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl border border-border/20 bg-card/40 p-6 backdrop-blur-md sm:p-8">
              {/* Subtle top accent line */}
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Send className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold">
                    Send Us a Message
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Fill out the form and we&apos;ll get back to you promptly.
                  </p>
                </div>
              </div>

              <ContactForm />
            </div>
          </AnimatedSection>

          {/* Right: Department Cards */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            {DEPARTMENT_CARDS.map((card, index) => (
              <AnimatedSection key={card.title} delay={index * 100}>
                <div className={`group relative overflow-hidden rounded-2xl border p-5 backdrop-blur-md transition-all duration-300 ${
                  card.comingSoon
                    ? "border-border/10 bg-card/20 opacity-60"
                    : "border-border/20 bg-card/40 hover:border-primary/20 hover:bg-card/60"
                }`}>
                  {/* Hover glow (disabled for coming soon) */}
                  {!card.comingSoon && (
                    <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  )}

                  {/* Coming Soon badge */}
                  {card.comingSoon && (
                    <span className="absolute right-4 top-4 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-amber-500 dark:text-amber-400">
                      COMING SOON
                    </span>
                  )}

                  <div className="relative flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                      card.comingSoon ? "bg-muted/20" : "bg-primary/10 group-hover:bg-primary/15"
                    }`}>
                      <card.icon className={`h-5 w-5 ${card.comingSoon ? "text-muted-foreground/50" : "text-primary"}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">
                        {card.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                        {card.description}
                      </p>
                      {!card.comingSoon && card.email ? (
                        <a
                          href={`mailto:${card.email}`}
                          className="mt-2 inline-block cursor-pointer text-xs font-medium text-primary transition-colors hover:text-primary/80"
                        >
                          {card.email}
                        </a>
                      ) : !card.comingSoon && card.location ? (
                        <p className="mt-2 text-xs font-medium text-foreground/80">
                          {card.location}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ Grid (2×2) ─── */}
      <section className="px-6 pb-20">
        <AnimatedSection className="mx-auto max-w-5xl">
          <h2 className="font-display mb-8 text-center text-2xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FAQ_ITEMS.map((item, index) => (
              <AnimatedSection key={item.q} delay={index * 80}>
                <div className="group rounded-2xl border border-border/20 bg-card/40 p-5 backdrop-blur-md transition-all duration-300 hover:border-primary/15 hover:bg-card/60">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    {item.q}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ─── Social Cards ─── */}
      <section className="px-6 pb-24">
        <AnimatedSection className="mx-auto max-w-5xl">
          <h2 className="font-display mb-2 text-center text-2xl font-bold tracking-tight">
            Follow Us
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Stay updated with our latest news and developments.
          </p>
          <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-3">
            {SOCIAL_CHANNELS.map((social, index) => (
              <AnimatedSection key={social.label} delay={index * 80}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-border/20 bg-card/40 p-6 backdrop-blur-md transition-all duration-300 ${social.color}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 transition-colors duration-300 group-hover:bg-foreground/10">
                    <social.icon className="h-5 w-5 text-muted-foreground transition-colors duration-300 group-hover:text-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {social.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {social.handle}
                    </p>
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}

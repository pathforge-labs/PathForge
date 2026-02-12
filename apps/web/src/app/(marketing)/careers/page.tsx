import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/animated-sections";
import { APP_NAME, APP_AUTHOR_EMAIL, APP_COUNTRY, APP_COUNTRY_FLAG } from "@/config/brand";
import { Sparkles, Heart, Code, Rocket, Brain, Shield, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description: `Careers at ${APP_NAME}. We're not hiring yet, but we're always looking for exceptional people who want to democratize career intelligence.`,
};

const WHAT_WE_VALUE = [
  {
    icon: Brain,
    title: "Deep Thinkers",
    description: "People who question assumptions and dive deep into problems before jumping to solutions.",
  },
  {
    icon: Code,
    title: "Craft Excellence",
    description: "Engineers and designers who take pride in clean code, pixel-perfect UI, and thoughtful architecture.",
  },
  {
    icon: Heart,
    title: "User Empathy",
    description: "Every decision starts with understanding the person on the other end of the screen.",
  },
  {
    icon: Rocket,
    title: "Shipping Bias",
    description: "Prefer shipping small iterations to debating large plans. Perfect is the enemy of progress.",
  },
  {
    icon: Shield,
    title: "Trust Builders",
    description: "People who understand that trust is earned through transparency, reliability, and doing the right thing.",
  },
  {
    icon: Users,
    title: "Team Players",
    description: "Collaboration over competition. We lift each other up and celebrate collective wins.",
  },
];

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-20 sm:pt-28">
        <div className="pointer-events-none absolute -right-64 -top-64 h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.7 0.18 270 / 8%), transparent 70%)" }} />
        <AnimatedSection className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Join the Team
          </div>
          <h1 className="font-display mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Build the Future of{" "}
            <span className="gradient-text">Career Intelligence</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            At {APP_NAME}, we&apos;re on a mission to democratize career intelligence. We&apos;re looking for people who share that vision.
          </p>
        </AnimatedSection>
      </section>

      {/* Status */}
      <section className="px-6 pb-16">
        <AnimatedSection className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center sm:p-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              </span>
              Pre-Launch
            </div>
            <h2 className="font-display mb-3 text-xl font-bold tracking-tight">
              We&apos;re Not Hiring Yet
            </h2>
            <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
              {APP_NAME} is currently in development by our founding team. We&apos;re not actively hiring at this stage, but we&apos;re always interested in hearing from exceptional people who resonate with our mission.
            </p>
            <p className="text-sm text-muted-foreground">
              Send a note to{" "}
              <a href={`mailto:${APP_AUTHOR_EMAIL}?subject=Interested in joining ${APP_NAME}`} className="text-primary font-medium hover:underline">
                {APP_AUTHOR_EMAIL}
              </a>{" "}
              — tell us who you are and what excites you about career intelligence.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* What we value */}
      <section className="px-6 pb-20">
        <AnimatedSection className="mx-auto max-w-4xl">
          <h2 className="font-display mb-2 text-center text-2xl font-bold tracking-tight">
            What We Look For
          </h2>
          <p className="mb-10 text-center text-sm text-muted-foreground">
            When the time comes, these are the qualities we&apos;ll prioritize.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_WE_VALUE.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 80}>
                <div className="h-full rounded-xl border border-border/20 bg-card/20 p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display mb-2 text-sm font-semibold">{value.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Culture */}
      <section className="px-6 pb-20">
        <AnimatedSection className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border/20 bg-card/20 p-8 sm:p-10">
            <h2 className="font-display mb-4 text-xl font-bold tracking-tight">How We Work</h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Remote-first.</strong> We believe great work happens when talented people have the freedom to work from where they&apos;re most productive. Based in the {APP_COUNTRY} {APP_COUNTRY_FLAG}, open to working with talent worldwide.
              </p>
              <p>
                <strong className="text-foreground">AI-amplified.</strong> We practice what we preach — using AI tools to accelerate development, not replace human judgment. Every team member leverages AI assistants for coding, research, and iteration.
              </p>
              <p>
                <strong className="text-foreground">Quality over speed.</strong> We ship frequently, but never at the expense of quality. Clean code, comprehensive testing, and thoughtful design are non-negotiable.
              </p>
              <p>
                <strong className="text-foreground">Ownership culture.</strong> Every team member has full ownership of their domain. We hire smart people and trust them to make great decisions.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <h2 className="font-display mb-4 text-2xl font-bold tracking-tight">
            Stay Connected
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Not ready to apply? Follow us to stay updated on future openings and company milestones.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/about"
              className="rounded-xl border border-border/30 bg-card/30 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-card/60"
            >
              Learn About Us
            </Link>
            <a
              href={`mailto:${APP_AUTHOR_EMAIL}?subject=Interested in joining ${APP_NAME}`}
              className="rounded-xl bg-linear-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/20"
            >
              Get in Touch
            </a>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}

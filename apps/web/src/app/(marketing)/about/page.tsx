import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { WaitlistForm } from "@/components/waitlist-form";
import { AnimatedSection } from "@/components/animated-sections";
import { APP_NAME, APP_COMPANY, APP_COUNTRY, APP_COUNTRY_FLAG } from "@/config/brand";
import { Heart, Shield, Sparkles, Globe, Users, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: `About ${APP_NAME} by ${APP_COMPANY}. We're building career intelligence that was previously only available to Fortune 500 companies — making it accessible to every professional.`,
};

const VALUES = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your career data is yours. End-to-end encryption, GDPR compliance, and zero data selling — non-negotiable.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Sparkles,
    title: "AI for Good",
    description: "We use AI to empower people, not replace them. Explainable recommendations, human-centered design.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Globe,
    title: "EU-Built, Global Reach",
    description: `Proudly built in the ${APP_COUNTRY}. European data protection standards applied to every user worldwide.`,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Heart,
    title: "Democratized Intelligence",
    description: "Career intelligence shouldn't require a Fortune 500 budget. We're making it free for everyone.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built by professionals, for professionals. Every feature starts with real user needs, not assumptions.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Lightbulb,
    title: "Radical Transparency",
    description: "Explainable match scores, clear reasoning, open about our methods. No black boxes.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-28 sm:pt-36">
        <div className="pointer-events-none absolute -left-64 -top-64 h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.7 0.18 270 / 8%), transparent 70%)" }} />
        <AnimatedSection className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <span className="text-base leading-none">{APP_COUNTRY_FLAG}</span>
            Built in {APP_COUNTRY}
          </div>
          <h1 className="font-display mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Career Intelligence for{" "}
            <span className="gradient-text">Everyone</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            We believe every professional deserves access to the career intelligence that was previously reserved for executives at Fortune 500 companies. That&apos;s why we&apos;re building {APP_NAME}.
          </p>
        </AnimatedSection>
      </section>

      {/* Mission */}
      <section className="px-6 pb-20">
        <AnimatedSection className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border/20 bg-card/20 p-8 sm:p-10">
            <h2 className="font-display mb-4 text-2xl font-bold tracking-tight">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              The career landscape is broken. Resume builders optimize formatting, not futures. Job boards match keywords, not potential. Career coaches are expensive and time-limited. Meanwhile, enterprises spend millions on talent intelligence tools that individual professionals can&apos;t access.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {APP_NAME} changes this equation. Using Career DNA™ technology — deep semantic analysis of skills, experience, and career trajectory — we give every professional the same caliber of career intelligence that was previously locked behind enterprise paywalls.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Founder */}
      <section className="px-6 pb-20">
        <AnimatedSection className="mx-auto max-w-3xl">
          <h2 className="font-display mb-8 text-center text-2xl font-bold tracking-tight">
            The Team
          </h2>
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-border/20 bg-card/20 p-8 text-center sm:p-10">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-primary/20">
              <Image
                src="/brand/logo-light.png"
                alt="Emre Dursun"
                fill
                sizes="96px"
                className="object-cover dark:hidden"
              />
              <Image
                src="/brand/logo-dark.png"
                alt="Emre Dursun"
                fill
                sizes="96px"
                className="hidden object-cover dark:block"
              />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Emre Dursun</h3>
              <p className="text-sm text-primary">Founder & CEO</p>
            </div>
            <p className="max-w-lg text-sm text-muted-foreground leading-relaxed">
              ISTQB® Certified Full-Stack Engineer with deep expertise in AI systems, quality engineering, and career technology. Previously built enterprise-grade automation platforms. Passionate about using AI to democratize access to career intelligence.
            </p>
            <p className="text-sm font-medium text-foreground/80">
              {APP_COMPANY} &middot; {APP_COUNTRY} {APP_COUNTRY_FLAG}
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Values */}
      <section className="px-6 pb-20">
        <AnimatedSection className="mx-auto max-w-4xl">
          <h2 className="font-display mb-8 text-center text-2xl font-bold tracking-tight">
            Our Values
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 80}>
                <div className="h-full rounded-xl border border-border/20 bg-card/20 p-6">
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br ${value.gradient} shadow-md`}>
                    <value.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-display mb-2 text-sm font-semibold">{value.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <h2 className="font-display mb-4 text-3xl font-bold tracking-tight">
            Join the Movement
          </h2>
          <p className="mb-8 text-muted-foreground">
            Whether you&apos;re exploring careers, making a pivot, or optimizing your trajectory — we&apos;re building this for you.
          </p>
          <WaitlistForm variant="hero" className="mx-auto max-w-md" />
          <p className="mt-6 text-xs text-muted-foreground/50">
            Interested in joining the team? <Link href="/careers" className="text-primary hover:underline">See our careers page</Link>
          </p>
        </AnimatedSection>
      </section>
    </>
  );
}

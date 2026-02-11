"use client";

import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";
import { MobileNav } from "@/components/mobile-nav";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import {
  Dna,
  Target,
  FileText,
  Shield,
  DollarSign,
  Compass,
  Sparkles,
  Globe,
  Lock,
  Zap,
  ChevronRight,
  Users,
  TrendingUp,
  BarChart3,
  ArrowRight,
} from "lucide-react";

/* ─────────────────────── Data ─────────────────────── */

const FEATURES = [
  {
    icon: Dna,
    title: "Career DNA™ Analysis",
    description:
      "Deep semantic analysis of your skills, experience, and growth trajectory. Not keyword matching — real understanding.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Target,
    title: "Smart Job Matching",
    description:
      "AI-powered matching with explainable compatibility scores and actionable skill gap recommendations.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: FileText,
    title: "CV Intelligence",
    description:
      "Auto-tailored resumes optimized for each opportunity. ATS-ready, recruiter-preferred formatting in seconds.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Shield,
    title: "Career Threat Radar",
    description:
      "Proactive alerts when your skills face AI disruption or market shifts. Stay ahead of change.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: DollarSign,
    title: "Salary Intelligence",
    description:
      "Real-time compensation benchmarks calibrated to your exact profile, experience, and market position.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Compass,
    title: "Career Simulation",
    description:
      "Model future career paths and see projected outcomes before you make your next move.",
    gradient: "from-amber-500 to-orange-500",
  },
];

const STATS = [
  { value: "6", label: "AI Modules", icon: BarChart3 },
  { value: "92%", label: "Match Accuracy", icon: Target },
  { value: "<5s", label: "CV Generation", icon: Zap },
  { value: "500+", label: "Early Signups", icon: Users },
];

const TRUST_BADGES = [
  { icon: Globe, label: "Built in the EU", sublabel: "Amsterdam, NL" },
  { icon: Lock, label: "GDPR Native", sublabel: "Privacy by design" },
  { icon: Zap, label: "AI-Powered", sublabel: "Semantic intelligence" },
];

const DNA_CAPABILITIES = [
  {
    label: "Skill Mapping",
    value: "92%",
    color: "bg-violet-500",
    width: "w-[92%]",
  },
  {
    label: "Market Position",
    value: "Top 15%",
    color: "bg-cyan-500",
    width: "w-[85%]",
  },
  {
    label: "Growth Velocity",
    value: "High",
    color: "bg-emerald-500",
    width: "w-[78%]",
  },
  {
    label: "AI Risk",
    value: "Low",
    color: "bg-amber-500",
    width: "w-[25%]",
  },
];

/* ─────────────────────── Scroll Animation ─────────── */

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────── Hero Dashboard Mockup ────── */

function HeroDashboard() {
  return (
    <div className="relative mx-auto mt-16 max-w-3xl">
      {/* Ambient glow behind dashboard */}
      <div
        className="pointer-events-none absolute -inset-8 rounded-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.7 0.18 270 / 12%) 0%, transparent 70%)",
        }}
      />

      {/* Dashboard frame */}
      <div className="elevated-card relative overflow-hidden rounded-2xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-border/40 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          </div>
          <div className="ml-4 flex-1 rounded-md bg-background/30 px-3 py-1 text-center text-[11px] text-muted-foreground/50">
            app.pathforge.eu/dashboard
          </div>
        </div>

        {/* Dashboard content */}
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          {/* DNA Score */}
          <div className="rounded-xl bg-background/30 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Career DNA™ Score
            </p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-primary">
                92
              </span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-linear-to-r from-primary to-accent"
                style={{ width: "92%" }}
              />
            </div>
          </div>

          {/* Match Quality */}
          <div className="rounded-xl bg-background/30 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Best Match
            </p>
            <p className="mt-2 font-display text-sm font-semibold">
              Staff Engineer
            </p>
            <p className="text-xs text-muted-foreground">at Vercel</p>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="flex h-5 items-center rounded-full bg-emerald-500/10 px-2 text-[10px] font-medium text-emerald-400">
                94% match
              </div>
              <div className="flex h-5 items-center rounded-full bg-primary/10 px-2 text-[10px] font-medium text-primary">
                +18% salary
              </div>
            </div>
          </div>

          {/* Trajectory */}
          <div className="rounded-xl bg-background/30 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              Growth Trajectory
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="font-display text-sm font-semibold text-emerald-400">
                Accelerating
              </span>
            </div>
            {/* Mini chart bars */}
            <div className="mt-3 flex items-end gap-1">
              {[30, 40, 35, 55, 50, 65, 60, 75, 70, 85, 80, 92].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-linear-to-t from-primary/40 to-primary/80"
                    style={{ height: `${h * 0.3}px` }}
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* Beam scan effect */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"
            style={{ animation: "beam-scan 4s ease-in-out infinite" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Page ─────────────────────── */

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Navbar ────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              PathForge
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="cursor-pointer rounded-lg border border-border/50 px-4 py-2 text-sm font-medium transition-all hover:border-border hover:bg-secondary/50"
            >
              Get Started
            </Link>
            <Link
              href="#waitlist"
              className="cursor-pointer rounded-xl bg-white px-5 py-2 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:shadow-lg hover:shadow-white/10"
            >
              Join Waitlist
            </Link>
          </div>

          {/* Mobile nav */}
          <MobileNav />
        </div>
      </nav>

      <main className="flex-1">
        {/* ── Hero Section ────────────────────────────── */}
        <section className="noise-overlay relative overflow-hidden px-6 pb-8 pt-16 sm:pb-12 sm:pt-24 lg:pt-28">
          {/* Ambient glow effects */}
          <div
            className="pointer-events-none absolute -left-64 -top-64 h-[600px] w-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.7 0.2 270 / 10%) 0%, transparent 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute -right-48 top-1/3 h-[500px] w-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.75 0.15 195 / 8%) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Powered by Career DNA™ Technology</span>
            </div>

            {/* Headline — display font */}
            <h1 className="animate-fade-in-up font-display mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Your Career,{" "}
              <span className="gradient-text-animated">
                Intelligently Forged
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="animate-fade-in-up delay-200 mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
              PathForge uses AI to decode your unique Career DNA™ — matching you
              with opportunities that align with your skills, trajectory, and
              ambitions.{" "}
              <span className="text-foreground/80">
                Not just another job board.
              </span>
            </p>

            {/* Waitlist Form */}
            <div
              id="waitlist"
              className="animate-fade-in-up delay-400 mx-auto max-w-lg"
            >
              <WaitlistForm variant="hero" />
            </div>
          </div>

          {/* Hero Dashboard Visualization */}
          <div className="animate-fade-in-up delay-500">
            <HeroDashboard />
          </div>
        </section>

        {/* ── Stats Bar ────────────────────────────────── */}
        <section className="border-y border-border/20 bg-card/20">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 py-8 sm:grid-cols-4 sm:gap-8 sm:py-10">
            {STATS.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 80}>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <stat.icon className="h-4 w-4 text-primary/70" />
                    <span className="font-display text-2xl font-bold sm:text-3xl">
                      {stat.value}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* ── Trust Bar ──────────────────────────────── */}
        <section className="px-6 py-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
            {TRUST_BADGES.map((badge) => (
              <AnimatedSection key={badge.label}>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5">
                    <badge.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{badge.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {badge.sublabel}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* ── Section Divider ─────────────────────────── */}
        <div className="section-divider mx-auto max-w-4xl" />

        {/* ── Problem Section ────────────────────────── */}
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left — copy */}
              <AnimatedSection>
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                  The Problem
                </p>
                <h2 className="font-display mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  The world doesn&apos;t need another{" "}
                  <span className="text-muted-foreground line-through decoration-primary/40 decoration-2">
                    resume builder
                  </span>
                </h2>
                <p className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground lg:text-lg">
                  Existing career tools focus on formatting and keywords. They
                  optimize your resume but never ask the harder question:{" "}
                  <span className="font-medium text-foreground">
                    &ldquo;Is this even the right career move for you?&rdquo;
                  </span>
                </p>
              </AnimatedSection>

              {/* Right — problem cards */}
              <div className="grid gap-4 sm:grid-cols-1">
                {[
                  {
                    label: "Resume Builders",
                    problem: "Format your CV, ignore your trajectory",
                    icon: FileText,
                  },
                  {
                    label: "Job Boards",
                    problem: "Keyword match, miss semantic fit",
                    icon: Target,
                  },
                  {
                    label: "Career Coaches",
                    problem: "$200/hr, limited data access",
                    icon: Users,
                  },
                ].map((item, i) => (
                  <AnimatedSection key={item.label} delay={i * 120}>
                    <div className="glass-card flex cursor-default items-center gap-4 rounded-xl p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                        <item.icon className="h-4 w-4 text-destructive/70" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.problem}
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section Divider ─────────────────────────── */}
        <div className="section-divider mx-auto max-w-4xl" />

        {/* ── Features Section ───────────────────────── */}
        <section id="features" className="px-6 py-20 sm:py-28">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Platform
            </p>
            <h2 className="font-display mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Career Intelligence,{" "}
              <span className="gradient-text">Not Career Guesswork</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground lg:text-lg">
              Six AI-powered modules that work together to understand your
              complete career picture.
            </p>
          </AnimatedSection>

          <div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 80}>
                <div className="glass-card group cursor-default rounded-xl p-6">
                  <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${feature.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    style={{
                      boxShadow: "0 4px 14px oklch(0 0 0 / 25%)",
                    }}
                  >
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-display mb-2 text-base font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* ── Section Divider ─────────────────────────── */}
        <div className="section-divider mx-auto max-w-4xl" />

        {/* ── Career DNA™ Section ────────────────────── */}
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left — Career DNA visualization (replaces JSON code) */}
              <AnimatedSection>
                <div className="elevated-card overflow-hidden rounded-2xl p-6 sm:p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent">
                        <Dna className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold">
                          Career DNA™
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Senior Frontend Engineer
                        </p>
                      </div>
                    </div>
                    <div className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                      Active
                    </div>
                  </div>

                  {/* Visual bars instead of JSON code */}
                  <div className="space-y-4">
                    {DNA_CAPABILITIES.map((cap) => (
                      <div key={cap.label}>
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {cap.label}
                          </span>
                          <span className="font-display font-semibold">
                            {cap.value}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-secondary">
                          <div
                            className={`h-full rounded-full ${cap.color} transition-all duration-1000`}
                            style={{ width: cap.width.replace("w-[", "").replace("]", "") }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Next move suggestion */}
                  <div className="mt-6 rounded-xl border border-border/30 bg-background/30 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                      Recommended Next Move
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <p className="font-display font-semibold">
                          Staff Engineer
                        </p>
                        <p className="text-xs text-muted-foreground">
                          87% confidence · 8-14 months
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Right — copy */}
              <AnimatedSection delay={200}>
                <div className="flex items-center gap-2 mb-3">
                  <Dna className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                    Core Technology
                  </p>
                </div>
                <h2 className="font-display mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
                  Your Career DNA™
                </h2>
                <p className="mb-6 max-w-lg text-base leading-relaxed text-muted-foreground lg:text-lg">
                  Like biological DNA encodes your physical traits, Career DNA™
                  encodes your professional identity — skills, experiences,
                  growth patterns, values, and market positioning — into a
                  semantic model that evolves with you.
                </p>
                <ul className="space-y-3">
                  {[
                    "Semantic skill mapping beyond keywords",
                    "Career trajectory pattern recognition",
                    "Market position & growth potential scoring",
                    "AI-disruption vulnerability analysis",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ── Section Divider ─────────────────────────── */}
        <div className="section-divider mx-auto max-w-4xl" />

        {/* ── Final CTA Section ──────────────────────── */}
        <section className="noise-overlay relative overflow-hidden px-6 py-20 sm:py-28">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.7 0.2 270 / 8%) 0%, transparent 70%)",
            }}
          />
          <AnimatedSection className="relative mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Early Access
            </p>
            <h2 className="font-display mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Ready to Forge Your Path?
            </h2>
            <p className="mb-10 text-muted-foreground lg:text-lg">
              Join the waitlist and be among the first to experience Career
              Intelligence. Free forever for early adopters.
            </p>
            <WaitlistForm variant="hero" className="mx-auto max-w-md" />
          </AnimatedSection>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="border-t border-border/20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-linear-to-br from-primary to-accent">
                  <span className="text-xs font-bold text-white">P</span>
                </div>
                <span className="font-display text-sm font-semibold">
                  PathForge
                </span>
              </div>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
                Career Intelligence, Intelligently Forged. Built in Amsterdam,
                NL. GDPR-native from day one.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-12">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                  Product
                </p>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <Link
                    href="#features"
                    className="cursor-pointer transition-colors hover:text-foreground"
                  >
                    Features
                  </Link>
                  <Link
                    href="#waitlist"
                    className="cursor-pointer transition-colors hover:text-foreground"
                  >
                    Join Waitlist
                  </Link>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                  Legal
                </p>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <Link
                    href="/privacy"
                    className="cursor-pointer transition-colors hover:text-foreground"
                  >
                    Privacy
                  </Link>
                  <Link
                    href="/terms"
                    className="cursor-pointer transition-colors hover:text-foreground"
                  >
                    Terms
                  </Link>
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                  Connect
                </p>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <a
                    href="https://linkedin.com/company/besynclabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer transition-colors hover:text-foreground"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/besync-labs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer transition-colors hover:text-foreground"
                  >
                    GitHub
                  </a>
                  <Link
                    href="mailto:hello@pathforge.eu"
                    className="cursor-pointer transition-colors hover:text-foreground"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/15 pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>
              © {new Date().getFullYear()} PathForge by BesyncLabs. All rights
              reserved.
            </p>
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              <span>pathforge.eu</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

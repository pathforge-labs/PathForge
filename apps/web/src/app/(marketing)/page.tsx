import Link from "next/link";
import Image from "next/image";
import { WaitlistForm } from "@/components/waitlist-form";
import { MobileNav } from "@/components/mobile-nav";
import { AnimatedSection, HeroDashboard } from "@/components/animated-sections";
import { TestimonialsMarquee } from "@/components/testimonials-marquee";
import { TestimonialAvatar } from "@/components/testimonial-avatar";
import { SpotlightCard } from "@/components/spotlight-card";
import { BorderGlow } from "@/components/border-glow";
import { CountUp } from "@/components/count-up";
import { AnimatedBar } from "@/components/animated-bar";
import { FaqAccordion } from "@/components/faq-accordion";
import { ActiveNav } from "@/components/active-nav";
import { NavScrollEffect } from "@/components/nav-scroll-effect";
import { BackToTop } from "@/components/back-to-top";
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
  TrendingUp,
  BarChart3,
  ArrowRight,
  Upload,
  Brain,
  Rocket,
  Check,
  X,
  MessageSquareQuote,
  Linkedin,
  Github,
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
  { value: "92%", label: "Target Accuracy", icon: Target },
  { value: "<5s", label: "CV Generation", icon: Zap },
  { value: "Growing", label: "Waitlist", icon: TrendingUp },
];

const TRUST_BADGES = [
  { icon: Globe, label: "Built in the EU", sublabel: "Amsterdam, NL" },
  { icon: Lock, label: "GDPR Native", sublabel: "Privacy by design" },
  { icon: Zap, label: "AI-Powered", sublabel: "Semantic intelligence" },
];

const DNA_CAPABILITIES = [
  { label: "Skill Mapping", value: "92%", color: "bg-violet-500", width: "92%" },
  { label: "Market Position", value: "Top 15%", color: "bg-cyan-500", width: "85%" },
  { label: "Growth Velocity", value: "High", color: "bg-emerald-500", width: "78%" },
  { label: "AI Risk", value: "Low", color: "bg-amber-500", width: "25%" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Upload,
    title: "Upload your CV",
    description: "Drop your resume or LinkedIn profile. Our AI reads between the lines — not just keywords.",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI builds your Career DNA™",
    description: "Semantic analysis maps your skills, trajectory, market position, and growth patterns.",
  },
  {
    step: "03",
    icon: Rocket,
    title: "Get intelligent matches",
    description: "Receive opportunities scored by true compatibility — with explainable reasoning for every match.",
  },
];

const COMPARISON = {
  headers: ["", "Resume Builders", "Job Boards", "Career Coaches", "PathForge"],
  rows: [
    { feature: "Semantic skill analysis", values: [false, false, false, true] },
    { feature: "AI-powered matching", values: [false, true, false, true] },
    { feature: "Career trajectory modeling", values: [false, false, true, true] },
    { feature: "Auto-tailored CVs", values: [true, false, false, true] },
    { feature: "Salary intelligence", values: [false, false, true, true] },
    { feature: "AI disruption alerts", values: [false, false, false, true] },
    { feature: "Always available", values: [true, true, false, true] },
    { feature: "Affordable", values: [true, true, false, true] },
  ],
};

const TESTIMONIALS = [
  {
    quote: "We built PathForge because we were tired of seeing brilliant engineers undervalued by keyword-matching algorithms. Career decisions deserve real intelligence.",
    name: "Emre Dursun",
    role: "Founder & Lead Engineer",
    company: "BesyncLabs",
    linkedin: "https://www.linkedin.com/in/emre-dursun-nl/",
    image: "/testimonials/emre-dursun.png",
    gradient: "from-violet-500 to-indigo-500",
    featured: true,
  },
  {
    quote: "After years in QA at Elsevier, I know how broken hiring pipelines are. PathForge's approach — understanding the person behind the CV — is the paradigm shift our industry has been waiting for.",
    name: "Mahmut Kaya",
    role: "Senior QA Engineer",
    company: "Elsevier",
    linkedin: "https://www.linkedin.com/in/mahmut-kaya-b9832614a/",
    image: "/testimonials/mahmut-kaya.png",
    gradient: "from-cyan-500 to-blue-500",
    featured: false,
  },
  {
    quote: "Most career tools optimize for keywords. PathForge optimizes for people. That's not an incremental improvement — it's a fundamentally different way of thinking about talent and trajectory.",
    name: "Ilker Akkaya",
    role: "Test Consultant",
    company: "Pancompany",
    linkedin: "https://www.linkedin.com/in/ilkerakkaya/",
    image: "/testimonials/ilker-akkaya.png",
    gradient: "from-emerald-500 to-teal-500",
    featured: false,
  },
  {
    quote: "As a designer moving from graphic design into UI, I know how hard it is when your skills don't fit a neat job title. PathForge understands the creative journey — it sees the transferable skills others overlook.",
    name: "Anna Khotynenko",
    role: "Graphic & UI Designer",
    company: "Wrocław, Poland",
    linkedin: "https://www.linkedin.com/in/anna-khotynenko-897181187/",
    image: "/testimonials/anna-khotynenko.png",
    gradient: "from-fuchsia-500 to-pink-500",
    featured: false,
  },
  {
    quote: "As someone who transitioned from backend engineering into data, I wish Career DNA™ existed when I was navigating that shift. PathForge sees the skills you're building — not just the title you hold.",
    name: "Müslüm Gezgin",
    role: "Software Engineer",
    company: "Shipcloud",
    linkedin: "https://www.linkedin.com/in/muslumgezgin/",
    image: "/testimonials/muslum-gezgin.png",
    gradient: "from-amber-500 to-orange-500",
    featured: false,
  },
  {
    quote: "In testing, we always say: don't just verify it works — verify it's right. PathForge applies that exact mindset to careers. It doesn't just match you to jobs, it validates whether the move actually fits your growth path.",
    name: "Murat Bigin",
    role: "QA Engineer",
    company: "Netherlands",
    linkedin: "https://www.linkedin.com/in/murat-bigin-08439419a/",
    image: "/testimonials/murat-bigin.png",
    gradient: "from-sky-500 to-blue-500",
    featured: false,
  },
  {
    quote: "The career tools market is massive but broken. Nobody connects who you are with where you should go. PathForge changes that with Career DNA™.",
    name: "PathForge Team",
    role: "Product Vision",
    company: "BesyncLabs",
    image: "/testimonials/pathforge.png",
    gradient: "from-rose-500 to-pink-500",
    featured: false,
  },
];

const FAQ = [
  {
    q: "What is Career DNA™?",
    a: "Career DNA™ is our proprietary semantic model that encodes your professional identity — skills, experiences, growth patterns, values, and market positioning — into a living profile that evolves with you. Unlike keyword-based systems, it understands the meaning behind your career.",
  },
  {
    q: "How is PathForge different from LinkedIn or Indeed?",
    a: "LinkedIn and Indeed match keywords. PathForge understands career trajectories. We don't just find jobs that match your resume — we find opportunities that align with where your career is going, not just where it's been.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. PathForge is built in the EU (Amsterdam) and is GDPR-native from day one. Your career data is encrypted, never sold, and you maintain full control. Privacy isn't an afterthought — it's foundational.",
  },
  {
    q: "What does 'free for early adopters' mean?",
    a: "Early waitlist members get lifetime free access to PathForge's core features. You'll be the first to shape the product and your feedback will directly influence our roadmap.",
  },
  {
    q: "When will PathForge launch?",
    a: "We're currently in private development with early access planned for 2026. Join the waitlist to be notified the moment we open doors — and to lock in your free-forever access.",
  },
];

/* ─────────────────────── Page (Server Component) ──── */

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Skip to content (a11y) ──────────────────────── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* ── Navbar ────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl transition-all duration-300" aria-label="Main navigation">
        <NavScrollEffect />
        <div className="mx-auto flex h-16 max-w-7xl 2xl:max-w-[1400px] 3xl:max-w-[1600px] 4xl:max-w-[1800px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="PathForge home">
            <Image
              src="/testimonials/pathforge-logo.png"
              alt="PathForge logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-contain"
            />
            <span className="gradient-text-animated font-display text-2xl font-bold tracking-tight">
              PathForge
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-2 md:flex">
            <ActiveNav />
            <Link
              href="/login"
              className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
            <Link
              href="#cta"
              className="cta-button cursor-pointer rounded-xl bg-linear-to-r from-primary to-accent px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/20"
            >
              Join Waitlist
            </Link>
          </div>

          {/* Mobile nav */}
          <MobileNav />
        </div>
      </nav>

      <main id="main-content" className="flex-1">
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

          <div className="relative mx-auto max-w-4xl 2xl:max-w-[1000px] 3xl:max-w-[1200px] text-center">
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
              <span className="font-medium text-foreground/80">
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
        <section className="border-y border-border/20 bg-card/20" aria-label="Key metrics">
          <div className="mx-auto grid max-w-5xl 2xl:max-w-[1100px] 3xl:max-w-[1280px] grid-cols-2 gap-4 px-6 py-8 sm:grid-cols-4 sm:gap-0 sm:py-10">
            {STATS.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 80}>
                <div className={`stat-item text-center ${i < STATS.length - 1 ? "sm:border-r sm:border-border/15" : ""}`}>
                  <div className="flex items-center justify-center gap-2">
                    <stat.icon className="stat-icon h-4 w-4 text-primary/70" />
                    <span className="stat-value font-display text-2xl font-bold sm:text-3xl">
                      {/^\d+/.test(stat.value) ? (
                        <CountUp
                          end={stat.value.replace(/[^0-9]/g, "")}
                          suffix={stat.value.replace(/[0-9]/g, "")}
                        />
                      ) : (
                        stat.value
                      )}
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
        <section className="px-6 py-8" aria-label="Trust signals">
          <div className="mx-auto flex max-w-4xl 2xl:max-w-[1000px] 3xl:max-w-[1200px] flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
            {TRUST_BADGES.map((badge) => (
              <AnimatedSection key={badge.label}>
                <div className="group flex cursor-default items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-300 hover:scale-[1.03] hover:bg-primary/5">
                  <div className="trust-icon flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 transition-colors group-hover:bg-primary/10">
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
        <div className="section-divider mx-auto max-w-4xl 2xl:max-w-[1000px] 3xl:max-w-[1200px]" />

        {/* ── Problem Section ────────────────────────── */}
        <section className="px-6 py-20 sm:py-28" aria-label="The problem we solve">
          <div className="mx-auto max-w-6xl 2xl:max-w-[1200px] 3xl:max-w-[1400px]">
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
              <div className="grid gap-4">
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
                    icon: DollarSign,
                  },
                ].map((item, i) => (
                  <AnimatedSection key={item.label} delay={i * 120}>
                    <div className="problem-card group flex cursor-default items-center gap-4 rounded-xl p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 transition-colors duration-300 group-hover:bg-primary/10">
                        <item.icon className="h-4 w-4 text-destructive/70 transition-colors duration-300 group-hover:text-primary" />
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
        <div className="section-divider mx-auto max-w-4xl 2xl:max-w-[1000px] 3xl:max-w-[1200px]" />

        {/* ── How it Works Section ────────────────────── */}
        <section id="how-it-works" className="px-6 py-20 sm:py-28" aria-label="How PathForge works">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Simple Process
            </p>
            <h2 className="font-display mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Three Steps to{" "}
              <span className="gradient-text">Career Clarity</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground lg:text-lg">
              From upload to intelligent matches in minutes, not months.
            </p>
          </AnimatedSection>

          <div className="mx-auto mt-16 max-w-5xl 2xl:max-w-[1100px] 3xl:max-w-[1280px]">
            <div className="grid gap-8 md:grid-cols-3">
              {HOW_IT_WORKS.map((step, i) => (
                <AnimatedSection key={step.step} delay={i * 150}>
                  <div className="step-card relative text-center">
                    {/* Step number */}
                    <div className="mb-6 inline-flex items-center justify-center">
                      <div className="relative">
                        <div className={`step-icon-box flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br ${
                          i === 0 ? "from-violet-500 to-purple-500" :
                          i === 1 ? "from-cyan-500 to-blue-500" :
                          "from-emerald-500 to-teal-500"
                        } shadow-lg`}>
                          <step.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="step-badge absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background text-xs font-bold text-foreground ring-2 ring-border/50">
                          {step.step}
                        </div>
                      </div>
                    </div>

                    {/* Connecting arrow (hidden on last) */}
                    {i < 2 && (
                      <svg className="step-connector pointer-events-none hidden md:block" viewBox="0 0 48 4" aria-hidden="true">
                        <line x1="0" y1="2" x2="48" y2="2" />
                      </svg>
                    )}

                    <h3 className="font-display mb-2 text-lg font-semibold">
                      {step.title}
                    </h3>
                    <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section Divider ─────────────────────────── */}
        <div className="section-divider mx-auto max-w-4xl 2xl:max-w-[1000px] 3xl:max-w-[1200px]" />

        {/* ── Features Section ───────────────────────── */}
        <section id="features" className="px-6 py-20 sm:py-28" aria-label="Platform features">
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

          <div className="mx-auto mt-14 grid max-w-6xl 2xl:max-w-[1200px] 3xl:max-w-[1400px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 80}>
                <SpotlightCard className="glass-card group cursor-default rounded-xl p-6 h-full">
                  <div
                    className={`icon-glow relative z-10 mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${feature.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    style={{
                      boxShadow: "0 4px 14px oklch(0 0 0 / 25%)",
                    }}
                  >
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="relative z-10 font-display mb-2 text-base font-semibold">
                    {feature.title}
                  </h3>
                  <p className="relative z-10 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </SpotlightCard>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* ── Section Divider ─────────────────────────── */}
        <div className="section-divider mx-auto max-w-4xl 2xl:max-w-[1000px] 3xl:max-w-[1200px]" />

        {/* ── Career DNA™ Section ────────────────────── */}
        <section className="px-6 py-20 sm:py-28" aria-label="Career DNA technology">
          <div className="mx-auto max-w-6xl 2xl:max-w-[1200px] 3xl:max-w-[1400px]">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left — Career DNA visualization */}
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

                  {/* Visual bars */}
                  <div className="space-y-4">
                    {DNA_CAPABILITIES.map((cap, i) => (
                      <div key={cap.label}>
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {cap.label}
                          </span>
                          <span className="font-display font-semibold">
                            {cap.value}
                          </span>
                        </div>
                        <AnimatedBar
                          targetWidth={cap.width}
                          colorClass={cap.color}
                          delay={i * 150}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Next move suggestion */}
                  <div className="next-move-card group mt-6 cursor-pointer rounded-xl p-4 transition-all duration-300">
                    <p className="relative z-10 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                      Recommended Next Move
                    </p>
                    <div className="relative z-10 mt-2 flex items-center justify-between">
                      <div>
                        <p className="font-display font-semibold">
                          Staff Engineer
                        </p>
                        <p className="text-xs text-muted-foreground">
                          87% confidence · 8-14 months
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Right — copy */}
              <AnimatedSection delay={200}>
                <div className="mb-3 flex items-center gap-2">
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
                    <li key={item} className="dna-list-item flex items-center gap-3 text-sm">
                      <div className="dna-icon flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
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
        <div className="section-divider mx-auto max-w-4xl 2xl:max-w-[1000px] 3xl:max-w-[1200px]" />

        {/* ── Comparison Table ────────────────────────── */}
        <section id="comparison" className="px-6 py-20 sm:py-28" aria-label="Feature comparison">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Why PathForge
            </p>
            <h2 className="font-display mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              The Complete{" "}
              <span className="gradient-text">Career Platform</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground lg:text-lg">
              See how PathForge compares to existing career tools.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="mx-auto mt-14 max-w-4xl 2xl:max-w-[1000px] 3xl:max-w-[1200px] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    {COMPARISON.headers.map((header, i) => (
                      <th
                        key={header || "feature"}
                        className={`px-4 py-4 font-display font-semibold ${
                          i === 4
                            ? "text-center text-primary pathforge-column-header pathforge-column-cell"
                            : i === 0
                              ? "text-left text-muted-foreground"
                              : "text-center text-muted-foreground/70"
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.rows.map((row) => (
                    <tr
                      key={row.feature}
                      className="comparison-row border-b border-border/10"
                    >
                      <td className="px-4 py-3.5 font-medium">{row.feature}</td>
                      {row.values.map((val, i) => (
                        <td key={i} className={`px-4 py-3.5 text-center ${i === 3 ? "pathforge-column-cell" : ""}`}>
                          {val ? (
                            <Check
                              className={`mx-auto h-4 w-4 ${
                                i === 3 ? "pathforge-check text-emerald-400" : "text-muted-foreground/50"
                              }`}
                            />
                          ) : (
                            <X className="mx-auto h-4 w-4 text-muted-foreground/20" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </section>

        {/* ── Section Divider ─────────────────────────── */}
        <div className="section-divider mx-auto max-w-4xl 2xl:max-w-[1000px] 3xl:max-w-[1200px]" />

        {/* ── Testimonials Section ────────────────────── */}
        <section className="py-20 sm:py-28" aria-label="What people say">
          <AnimatedSection className="mx-auto max-w-3xl px-6 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Early Believers
            </p>
            <h2 className="font-display mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              What People Are Saying
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
              Builders and engineers who share our vision for the future of career intelligence.
            </p>
          </AnimatedSection>

          <div className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1400px] 3xl:max-w-[1600px] 4xl:max-w-[1800px]">
            <TestimonialsMarquee speed="normal">
              {TESTIMONIALS.map((t) => (
                <BorderGlow key={t.name} className="w-[340px] shrink-0 sm:w-[380px]">
                  <div
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card/80 p-6 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {/* Gradient glow line */}
                    {t.featured && (
                      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
                    )}

                    <MessageSquareQuote className="mb-4 h-5 w-5 text-primary/30" />

                    <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>

                    <div className="mt-6 flex items-center justify-between border-t border-border/15 pt-5">
                      <div className="flex items-center gap-3">
                        <TestimonialAvatar
                          name={t.name}
                          image={t.image}
                          gradient={t.gradient}
                          size={80}
                        />
                        <div>
                          <p className="text-[13px] font-semibold">{t.name}</p>
                          <p className="text-xs text-muted-foreground/70">
                            {t.role} · {t.company}
                          </p>
                        </div>
                      </div>
                      {/* LinkedIn link */}
                      {t.linkedin && (
                        <a
                          href={t.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-muted-foreground/40 transition-colors hover:bg-secondary/50 hover:text-primary"
                          aria-label={`View ${t.name} on LinkedIn`}
                        >
                          <Linkedin className="h-6 w-6" />
                        </a>
                      )}
                    </div>
                  </div>
                </BorderGlow>
              ))}
            </TestimonialsMarquee>
          </div>
        </section>

        {/* ── Section Divider ─────────────────────────── */}
        <div className="section-divider mx-auto max-w-4xl 2xl:max-w-[1000px] 3xl:max-w-[1200px]" />

        {/* ── FAQ Section ─────────────────────────────── */}
        <section className="px-6 py-20 sm:py-28" aria-label="Frequently asked questions">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              FAQ
            </p>
            <h2 className="font-display mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Common Questions
            </h2>
          </AnimatedSection>

          <AnimatedSection className="mx-auto mt-12 max-w-2xl">
            <FaqAccordion items={FAQ} />
          </AnimatedSection>
        </section>

        {/* ── Section Divider ─────────────────────────── */}
        <div className="section-divider mx-auto max-w-4xl 2xl:max-w-[1000px] 3xl:max-w-[1200px]" />

        {/* ── Final CTA Section ──────────────────────── */}
        <section id="cta" className="noise-overlay relative overflow-hidden px-6 py-20 sm:py-28" aria-label="Join the waitlist">
          <div
            className="cta-aura pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.7 0.2 270 / 12%) 0%, oklch(0.75 0.15 195 / 6%) 50%, transparent 70%)",
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
      <footer className="relative overflow-hidden border-t border-border/20" role="contentinfo">
        {/* Premium gradient mesh background */}
        <div className="absolute inset-0 bg-linear-to-b from-card/50 via-card/20 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,oklch(0.7_0.18_270/4%),transparent_60%),radial-gradient(ellipse_at_80%_20%,oklch(0.75_0.15_195/3%),transparent_50%)]" />
        {/* Subtle top gradient accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent" />

        <div className="relative mx-auto max-w-7xl 2xl:max-w-[1400px] 3xl:max-w-[1600px] 4xl:max-w-[1800px] px-6 py-16 sm:py-20">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-16">
            {/* Brand — spans 2 columns on lg */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <Image
                  src="/testimonials/pathforge-logo.png"
                  alt="PathForge logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-xl object-contain"
                />
                <span className="gradient-text-animated font-display text-2xl font-bold tracking-tight">
                  PathForge
                </span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Career Intelligence, Intelligently Forged. Decode your unique Career DNA™ and discover opportunities that truly align.
              </p>
              {/* Social icons — large, prominent */}
              <div className="mt-6">
                <div className="mb-4 h-px w-48 bg-linear-to-r from-primary/50 to-accent/50" />
                <div className="flex items-center gap-4">
                  <a href="https://linkedin.com/company/besynclabs" target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-xl text-muted-foreground/70 transition-all duration-200 hover:bg-primary/5 hover:text-primary" aria-label="LinkedIn">
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a href="https://github.com/besync-labs" target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-xl text-muted-foreground/70 transition-all duration-200 hover:bg-primary/5 hover:text-primary" aria-label="GitHub">
                    <Github className="h-6 w-6" />
                  </a>
                  <a href="https://x.com/besynclabs" target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-xl text-muted-foreground/70 transition-all duration-200 hover:bg-primary/5 hover:text-primary" aria-label="X (Twitter)">
                    <X className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <p className="footer-heading mb-4 cursor-default text-xs font-semibold uppercase tracking-widest text-foreground/60">
                Product
              </p>
              <div className="flex flex-col gap-2.5 text-sm">
                <Link href="#features" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">Features</Link>
                <Link href="#how-it-works" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">How it Works</Link>
                <Link href="#comparison" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">Comparison</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <p className="footer-heading mb-4 cursor-default text-xs font-semibold uppercase tracking-widest text-foreground/60">
                Legal
              </p>
              <div className="flex flex-col gap-2.5 text-sm">
                <Link href="/privacy" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</Link>
                <Link href="/terms" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">Terms of Service</Link>
                <Link href="/cookies" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">Cookie Policy</Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <p className="footer-heading mb-4 cursor-default text-xs font-semibold uppercase tracking-widest text-foreground/60">
                Company
              </p>
              <div className="flex flex-col gap-2.5 text-sm">
                <Link href="/about" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">About</Link>
                <Link href="mailto:hello@pathforge.eu" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
                <Link href="/careers" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">Careers</Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative mt-14 pt-8">
            {/* Gradient divider line */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border/40 to-transparent" />
            <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground/50 sm:flex-row">
              <div className="flex items-center gap-1.5">
                <span className="text-sm leading-none">🇳🇱</span>
                <span>Made in Netherlands</span>
              </div>
              <p>
                © {new Date().getFullYear()} PathForge by BesyncLabs
              </p>
              <div className="flex items-center gap-1.5 text-muted-foreground/40 transition-colors hover:text-muted-foreground/60">
                <Globe className="h-3 w-3" />
                <span>English</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <BackToTop />
    </div>
  );
}

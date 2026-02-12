import type { Metadata } from "next";
import { WaitlistForm } from "@/components/waitlist-form";
import { AnimatedSection } from "@/components/animated-sections";
import { SpotlightCard } from "@/components/spotlight-card";
import { APP_NAME } from "@/config/brand";
import { FEATURES } from "@/data/landing-data";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Features",
  description: `Explore ${APP_NAME}'s six AI-powered career intelligence modules: Career DNA™ Analysis, Smart Job Matching, CV Intelligence, Career Threat Radar, Salary Intelligence, and Career Simulation.`,
};

const FEATURE_DETAILS: Record<string, { details: string[]; comingSoon?: boolean }> = {
  "Career DNA™ Analysis": {
    details: [
      "Deep semantic parsing — understands context, not just keywords",
      "Maps transferable skills across industries and roles",
      "Tracks career trajectory and growth velocity over time",
      "Identifies hidden strengths competitors overlook",
    ],
  },
  "Smart Job Matching": {
    details: [
      "Explainable compatibility scores with reasoning",
      "Skill gap analysis with actionable recommendations",
      "Market-fit calibration based on real demand data",
      "Role recommendations beyond your current job title",
    ],
  },
  "CV Intelligence": {
    details: [
      "Auto-tailored resumes for each specific opportunity",
      "ATS-optimized formatting that passes automated filters",
      "Keyword and semantic alignment with job descriptions",
      "Professional PDF generation in under 5 seconds",
    ],
  },
  "Career Threat Radar": {
    details: [
      "AI disruption risk scoring for your current skillset",
      "Market trend analysis with early warning signals",
      "Upskilling path suggestions to stay ahead of change",
      "Industry-specific threat intelligence reports",
    ],
  },
  "Salary Intelligence": {
    details: [
      "Real-time compensation data calibrated to your profile",
      "Regional and industry-specific benchmarking",
      "Total compensation modeling (base + equity + benefits)",
      "Negotiation support with data-backed ranges",
    ],
  },
  "Career Simulation": {
    details: [
      "Model 3–5 year career trajectories with projected outcomes",
      "Compare paths: promotion vs. pivot vs. specialization",
      "Risk/reward analysis for each potential move",
      "Timeline estimates based on real market transitions",
    ],
  },
};

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-20 sm:pt-28">
        <div className="pointer-events-none absolute -left-64 -top-64 h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.7 0.18 270 / 8%), transparent 70%)" }} />
        <div className="pointer-events-none absolute -right-64 -top-32 h-[400px] w-[400px] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.75 0.15 195 / 6%), transparent 70%)" }} />
        <AnimatedSection className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            6 AI-Powered Modules
          </div>
          <h1 className="font-display mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Career Intelligence,{" "}
            <span className="gradient-text">Not Guesswork</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Six modules that work together to understand your complete career picture — skills, trajectory, market position, and growth potential.
          </p>
        </AnimatedSection>
      </section>

      {/* Features grid */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl space-y-8">
          {FEATURES.map((feature, i) => {
            const details = FEATURE_DETAILS[feature.title];
            return (
              <AnimatedSection key={feature.title} delay={i * 100}>
                <SpotlightCard className="glass-card rounded-2xl p-0">
                  <div className="grid items-stretch gap-0 md:grid-cols-2">
                    {/* Left — content */}
                    <div className="relative z-10 p-8 sm:p-10">
                      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${feature.gradient} shadow-lg`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="font-display mb-3 text-2xl font-bold tracking-tight">
                        {feature.title}
                      </h2>
                      <p className="mb-6 text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                      {details && (
                        <ul className="space-y-3">
                          {details.details.map((d) => (
                            <li key={d} className="flex items-start gap-3 text-sm text-muted-foreground">
                              <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-br ${feature.gradient}`} />
                              {d}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Right — visual accent */}
                    <div className="relative hidden min-h-[200px] items-center justify-center md:flex">
                      <div className="absolute inset-0 bg-linear-to-br from-card/50 to-card/20" />
                      <div className={`relative flex h-32 w-32 items-center justify-center rounded-3xl bg-linear-to-br ${feature.gradient} opacity-10`}>
                        <feature.icon className="h-16 w-16 text-white" />
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <h2 className="font-display mb-4 text-3xl font-bold tracking-tight">
            Be the First to Experience It
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join the waitlist for free early access to all six modules.
          </p>
          <WaitlistForm variant="hero" className="mx-auto max-w-md" />
        </AnimatedSection>
      </section>
    </>
  );
}

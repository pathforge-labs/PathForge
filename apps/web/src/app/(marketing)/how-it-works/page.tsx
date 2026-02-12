import type { Metadata } from "next";
import { WaitlistForm } from "@/components/waitlist-form";
import { AnimatedSection } from "@/components/animated-sections";
import { APP_NAME } from "@/config/brand";
import { HOW_IT_WORKS } from "@/data/landing-data";
import { Sparkles, ArrowDown, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "How it Works",
  description: `See how ${APP_NAME} works in three simple steps: Upload your CV, get your Career DNA™ analysis, and receive intelligent career matches with explainable reasoning.`,
};

const STEP_DETAILS: Record<string, string[]> = {
  "Upload your CV": [
    "Drag and drop your resume (PDF, DOCX) or paste your LinkedIn profile URL",
    "Our AI processes your document in seconds — no manual input required",
    "Your data is encrypted end-to-end and never shared with third parties",
    "Supports multiple languages and international career formats",
  ],
  "AI builds your Career DNA™": [
    "Semantic analysis goes beyond keywords to understand your true capabilities",
    "Maps your complete skill graph including hidden transferable skills",
    "Calculates your career trajectory, growth velocity, and market positioning",
    "Identifies your unique strengths that set you apart from other professionals",
  ],
  "Get intelligent matches": [
    "Receive opportunities scored by true compatibility — not keyword overlap",
    "Every match comes with explainable reasoning so you understand why",
    "Get actionable skill gap analysis and upskilling recommendations",
    "Auto-generated, tailored CVs optimized for each specific opportunity",
  ],
};

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-20 sm:pt-28">
        <div className="pointer-events-none absolute -left-64 -top-64 h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.75 0.15 195 / 8%), transparent 70%)" }} />
        <AnimatedSection className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Simple Process
          </div>
          <h1 className="font-display mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            From Upload to{" "}
            <span className="gradient-text">Career Clarity</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Three steps. A few minutes. A lifetime of smarter career decisions.
          </p>
        </AnimatedSection>
      </section>

      {/* Steps */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl space-y-0">
          {HOW_IT_WORKS.map((step, i) => {
            const details = STEP_DETAILS[step.title];
            const gradients = [
              "from-violet-500 to-purple-500",
              "from-cyan-500 to-blue-500",
              "from-emerald-500 to-teal-500",
            ];
            return (
              <div key={step.step}>
                <AnimatedSection delay={i * 150}>
                  <div className="relative rounded-2xl border border-border/30 bg-card/30 p-8 backdrop-blur-sm sm:p-10">
                    {/* Step badge */}
                    <div className="mb-6 flex items-center gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${gradients[i]} shadow-lg`}>
                        <step.icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
                          Step {step.step}
                        </p>
                        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                          {step.title}
                        </h2>
                      </div>
                    </div>

                    <p className="mb-6 text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>

                    {details && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {details.map((d) => (
                          <div key={d} className="flex items-start gap-2.5 rounded-lg bg-background/50 p-3 text-sm">
                            <CheckCircle className={`mt-0.5 h-4 w-4 shrink-0 bg-linear-to-br ${gradients[i]} bg-clip-text text-emerald-400`} />
                            <span className="text-muted-foreground">{d}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AnimatedSection>

                {/* Connector arrow */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="flex justify-center py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/30 bg-card/50">
                      <ArrowDown className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <h2 className="font-display mb-4 text-3xl font-bold tracking-tight">
            Ready to Start?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join the waitlist — the process takes 30 seconds. Your career intelligence awaits.
          </p>
          <WaitlistForm variant="hero" className="mx-auto max-w-md" />
        </AnimatedSection>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { WaitlistForm } from "@/components/waitlist-form";
import { AnimatedSection } from "@/components/animated-sections";
import { APP_NAME } from "@/config/brand";
import { COMPARISON } from "@/data/landing-data";
import { Check, X, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Comparison",
  description: `See how ${APP_NAME} compares to resume builders, job boards, and career coaches. Feature-by-feature breakdown of why Career DNA™ technology delivers superior results.`,
};

const CATEGORY_DETAILS: Record<string, { description: string; limitation: string }> = {
  "Resume Builders": {
    description: "Tools like Canva, Zety, and ResumeGenius help you format your CV — but they know nothing about your career trajectory or the market.",
    limitation: "They optimize formatting, not your career direction.",
  },
  "Job Boards": {
    description: "LinkedIn, Indeed, and Glassdoor aggregate millions of listings — but match by keyword overlap, not true career compatibility.",
    limitation: "They find jobs that match your words, not your potential.",
  },
  "Career Coaches": {
    description: "Human coaches provide personalized guidance — but they're expensive, time-limited, and can only process a fraction of market data.",
    limitation: "Great advice, but $200/hr and limited by human bandwidth.",
  },
};

const WHY_PATHFORGE = [
  {
    title: "Semantic Understanding",
    description: "We read between the lines of your career — understanding context, trajectory, and transferable skills that keyword systems miss.",
  },
  {
    title: "Always Available",
    description: "Career intelligence at 2 AM, during lunch, or whenever inspiration strikes. No scheduling, no waiting rooms.",
  },
  {
    title: "Data-Driven Precision",
    description: "Powered by market intelligence, compensation data, and AI disruption signals — not opinions or hunches.",
  },
  {
    title: "Affordable for Everyone",
    description: "Starting at €0 — forever. Pro is €19/mo and Premium is €39/mo. Career intelligence that was reserved for executives, now accessible to everyone.",
  },
];

export default function ComparisonPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-28 sm:pt-36">
        <div className="pointer-events-none absolute -right-64 -top-64 h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, oklch(0.7 0.18 270 / 8%), transparent 70%)" }} />
        <AnimatedSection className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <Trophy className="h-3.5 w-3.5" />
            Why {APP_NAME}
          </div>
          <h1 className="font-display mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            How We{" "}
            <span className="gradient-text">Compare</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {APP_NAME} isn&apos;t just another career tool — it&apos;s a new category. Here&apos;s how we stack up.
          </p>
        </AnimatedSection>
      </section>

      {/* Comparison table */}
      <section className="px-6 pb-16">
        <AnimatedSection className="mx-auto max-w-4xl">
          <div className="overflow-x-auto rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm">
            <table className="w-full text-sm" style={{ fontVariantNumeric: "tabular-nums" }}>
              <thead>
                <tr className="border-b border-border/30">
                  {COMPARISON.headers.map((h, i) => (
                    <th
                      key={h || "feature"}
                      className={`px-6 py-4 text-left font-semibold ${
                        i === COMPARISON.headers.length - 1
                          ? "bg-primary/5 text-primary"
                          : "text-muted-foreground"
                      } ${i === 0 ? "min-w-[200px]" : "text-center"}`}
                    >
                      {h || "Feature"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.rows.map((row) => (
                  <tr key={row.feature} className="border-b border-border/10 transition-colors hover:bg-card/50">
                    <td className="px-6 py-4 font-medium">{row.feature}</td>
                    {row.values.map((v, vi) => (
                      <td
                        key={`${row.feature}-${vi}`}
                        className={`px-6 py-4 text-center ${
                          vi === row.values.length - 1 ? "bg-primary/5" : ""
                        }`}
                      >
                        {v ? (
                          <Check className={`mx-auto h-5 w-5 ${vi === row.values.length - 1 ? "text-primary" : "text-emerald-400"}`} />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-muted-foreground/30" />
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

      {/* Category breakdowns */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl space-y-6">
          {Object.entries(CATEGORY_DETAILS).map(([name, info], i) => (
            <AnimatedSection key={name} delay={i * 100}>
              <div className="rounded-xl border border-border/20 bg-card/20 p-6 sm:p-8">
                <h3 className="font-display mb-2 text-lg font-semibold">{name}</h3>
                <p className="mb-3 text-sm text-muted-foreground leading-relaxed">{info.description}</p>
                <p className="text-sm font-medium text-muted-foreground/70 italic">
                  &ldquo;{info.limitation}&rdquo;
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Why PathForge */}
      <section className="px-6 pb-16">
        <AnimatedSection className="mx-auto max-w-4xl">
          <h2 className="font-display mb-8 text-center text-3xl font-bold tracking-tight">
            Why <span className="gradient-text">{APP_NAME}</span> Wins
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {WHY_PATHFORGE.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 100}>
                <div className="h-full rounded-xl border border-border/20 bg-card/20 p-6">
                  <h3 className="font-display mb-2 text-base font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
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
            Ready to Switch?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join the waitlist and see for yourself. Free for early adopters.
          </p>
          <WaitlistForm variant="hero" className="mx-auto max-w-md" />
        </AnimatedSection>
      </section>
    </>
  );
}

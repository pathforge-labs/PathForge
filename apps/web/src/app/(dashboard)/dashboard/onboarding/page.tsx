"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOnboarding, type OnboardingStep } from "@/hooks/use-onboarding";
import { MatchCard } from "@/components/match-card";

const STEP_CONFIG: Record<OnboardingStep, { title: string; description: string; icon: string }> = {
  upload: {
    title: "Paste Your Resume",
    description: "Paste your resume text to get started with PathForge.",
    icon: "📄",
  },
  parse: {
    title: "Review Parsed Data",
    description: "AI has extracted structured data from your resume.",
    icon: "🔍",
  },
  embed: {
    title: "Generate Profile",
    description: "Creating your semantic career profile for intelligent matching.",
    icon: "🧬",
  },
  matches: {
    title: "Your First Matches",
    description: "Discover jobs that match your career DNA.",
    icon: "🎯",
  },
};

export default function OnboardingPage() {
  const router = useRouter();
  const onboarding = useOnboarding();
  const config = STEP_CONFIG[onboarding.step];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to PathForge</h1>
        <p className="text-muted-foreground">
          Let&apos;s set up your career intelligence in 4 simple steps.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-2">
        {onboarding.steps.map((step, i) => {
          const s = STEP_CONFIG[step];
          const isActive = i === onboarding.stepIndex;
          const isComplete = i < onboarding.stepIndex;
          return (
            <button
              key={step}
              onClick={() => onboarding.goToStep(step)}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isComplete
                    ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
              disabled={!isComplete && !isActive}
            >
              <span>{isComplete ? "✓" : s.icon}</span>
              <span className="hidden sm:inline">{s.title}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Error Banner */}
      {onboarding.error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
          {onboarding.error}
        </div>
      )}

      {/* Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <CardTitle>{config.title}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Step 1: Upload / Paste Resume */}
          {onboarding.step === "upload" && (
            <div className="space-y-4">
              <textarea
                value={onboarding.rawText}
                onChange={(e) => onboarding.setRawText(e.target.value)}
                placeholder="Paste your resume/CV text here...&#10;&#10;Include your name, experience, skills, education, and any other relevant information."
                className="min-h-[300px] w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {onboarding.rawText.length} characters
                  {onboarding.rawText.length < 50 && " (minimum 50 required)"}
                </p>
                <Button onClick={onboarding.parseResume} disabled={onboarding.loading || onboarding.rawText.length < 50}>
                  {onboarding.loading ? (
                    <><span className="mr-2 animate-spin">⟳</span>Parsing…</>
                  ) : (
                    <>Parse Resume →</>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Parse Preview */}
          {onboarding.step === "parse" && onboarding.parsedResume && (
            <div className="space-y-4">
              {/* Name & Contact */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                  <p className="mt-0.5 text-sm font-semibold">{onboarding.parsedResume.full_name || "—"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <p className="mt-0.5 text-sm">{onboarding.parsedResume.email || "—"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Location</label>
                  <p className="mt-0.5 text-sm">{onboarding.parsedResume.location || "—"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Phone</label>
                  <p className="mt-0.5 text-sm">{onboarding.parsedResume.phone || "—"}</p>
                </div>
              </div>

              {/* Summary */}
              {onboarding.parsedResume.summary && (
                <>
                  <Separator />
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Summary</label>
                    <p className="mt-1 text-sm leading-relaxed">{onboarding.parsedResume.summary}</p>
                  </div>
                </>
              )}

              {/* Skills */}
              {onboarding.parsedResume.skills.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Skills ({onboarding.parsedResume.skills.length})
                    </label>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {onboarding.parsedResume.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Experience */}
              {onboarding.parsedResume.experience.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Experience ({onboarding.parsedResume.experience.length})
                    </label>
                    <div className="mt-2 space-y-2">
                      {onboarding.parsedResume.experience.map((exp, i) => (
                        <div key={i} className="rounded-md border border-border/50 p-3">
                          <p className="text-sm font-medium">{exp.title}</p>
                          <p className="text-xs text-muted-foreground">{exp.company}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Action — in demo mode, skip to dashboard since no real resume ID */}
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => onboarding.goToStep("upload")}>
                  ← Re-paste
                </Button>
                <p className="text-xs text-muted-foreground">
                  Embedding &amp; matching require configured AI keys.
                </p>
                <Button onClick={() => router.push("/dashboard")}>
                  Go to Dashboard →
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Embedding Progress */}
          {onboarding.step === "embed" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-3xl animate-pulse">🧬</span>
              </div>
              <div className="text-center">
                <p className="font-medium">Generating Career Profile</p>
                <p className="text-sm text-muted-foreground">
                  Creating your semantic embedding with Voyage AI…
                </p>
              </div>
              <Button onClick={onboarding.findMatches} disabled={onboarding.loading}>
                {onboarding.loading ? "Finding matches…" : "Find Matches →"}
              </Button>
            </div>
          )}

          {/* Step 4: First Matches */}
          {onboarding.step === "matches" && (
            <div className="space-y-4">
              {onboarding.matches.length > 0 ? (
                <div className="grid gap-3">
                  {onboarding.matches.map((match) => (
                    <MatchCard key={match.job_id} match={match} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <span className="text-4xl">🔍</span>
                  <p className="font-medium">No Matches Found</p>
                  <p className="text-sm text-muted-foreground">
                    Job listings need to be ingested first. Ask your admin to run the ingestion pipeline.
                  </p>
                </div>
              )}
              <Separator />
              <div className="flex justify-end">
                <Button onClick={() => router.push("/dashboard")}>
                  Go to Dashboard →
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">P</span>
            </div>
            <span className="text-lg font-bold tracking-tight">PathForge</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            🧬 Powered by Career DNA™ Technology
          </Badge>
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Your Career,{" "}
            <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
              Intelligently Forged
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            PathForge uses AI to decode your unique Career DNA™ — matching you
            with opportunities that align with your skills, trajectory, and
            ambitions. Not just another job board.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="min-w-[180px] text-base">
                Start Your Journey
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="min-w-[180px] text-base">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="mx-auto mt-32 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "🧬",
              title: "Career DNA™ Analysis",
              description:
                "Deep semantic analysis of your experience, not keyword matching.",
            },
            {
              icon: "🎯",
              title: "Smart Job Matching",
              description:
                "AI-powered matching with explainable scores and skill gap insights.",
            },
            {
              icon: "📄",
              title: "CV Intelligence",
              description:
                "Auto-tailored resumes optimized for each opportunity.",
            },
            {
              icon: "🛡️",
              title: "Career Threat Radar",
              description:
                "Proactive alerts when your skills face disruption.",
            },
            {
              icon: "💰",
              title: "Salary Intelligence",
              description:
                "Real-time compensation benchmarks for your exact profile.",
            },
            {
              icon: "🔮",
              title: "Career Simulation",
              description:
                "Model future career paths before making your move.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-lg"
            >
              <div className="mb-3 text-3xl">{feature.icon}</div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t border-border/40 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PathForge by BesyncLabs. Career
          Intelligence, Intelligently Forged.
        </div>
      </footer>
    </div>
  );
}

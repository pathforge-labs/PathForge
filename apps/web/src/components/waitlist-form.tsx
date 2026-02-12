"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2, Loader2, Shield, Lock } from "lucide-react";

type WaitlistState = "idle" | "loading" | "success" | "error";

interface WaitlistFormProps {
  className?: string;
  variant?: "hero" | "compact";
}

export function WaitlistForm({
  className = "",
  variant = "hero",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<WaitlistState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim()) return;

    setState("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setState("success");
        setMessage(data.message || "You're on the list!");
        setEmail("");
      } else {
        setState("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setState("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (state === "success") {
    return (
      <div
        className={`flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-4 ${className}`}
      >
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
        <p className="text-sm font-medium text-foreground">{message}</p>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <form
        onSubmit={handleSubmit}
        className={`flex items-center gap-2 ${className}`}
      >
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          required
          className="h-11 flex-1 rounded-lg border-input bg-background/50 backdrop-blur-sm"
          aria-label="Email address for waitlist"
        />
        <Button
          type="submit"
          size="lg"
          disabled={state === "loading"}
          className="h-11 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {state === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Join <ArrowRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    );
  }

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-1.5 rounded-full border border-border/40 bg-card/60 p-1.5 backdrop-blur-md transition-all duration-300 focus-within:border-primary/30 focus-within:shadow-lg focus-within:shadow-primary/5"
      >
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          required
          className="h-11 flex-1 bg-transparent pl-5 text-base text-foreground outline-none placeholder:text-muted-foreground/40"
          aria-label="Email address for waitlist"
        />
        <Button
          type="submit"
          size="lg"
          disabled={state === "loading"}
          className="h-11 cursor-pointer rounded-full bg-linear-to-r from-violet-500 via-primary to-cyan-400 px-6 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110"
        >
          {state === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Get Early Access <ArrowRight className="ml-1.5 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      {state === "error" && (
        <p className="mt-2 text-sm text-destructive">{message}</p>
      )}
      <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-muted-foreground/60">
        <span className="flex items-center gap-1"><Shield className="h-3 w-3" />GDPR compliant</span>
        <span className="h-3 w-px bg-border/30" />
        <span className="flex items-center gap-1"><Lock className="h-3 w-3" />No spam, ever</span>
        <span className="h-3 w-px bg-border/30" />
        <span>Free for early adopters</span>
      </div>
    </div>
  );
}

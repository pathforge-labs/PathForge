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
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state === "error") setState("idle");
            }}
            required
            className="h-12 rounded-xl border-border/50 bg-card/50 pl-4 pr-4 text-base backdrop-blur-sm placeholder:text-muted-foreground/40 focus:border-primary/50"
            aria-label="Email address for waitlist"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={state === "loading"}
          className="h-12 min-w-[180px] cursor-pointer rounded-xl bg-white text-base font-semibold text-gray-900 shadow-lg shadow-white/10 transition-all hover:bg-gray-100 hover:shadow-xl hover:shadow-white/15"
        >
          {state === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Join the Waitlist <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      {state === "error" && (
        <p className="mt-2 text-sm text-destructive">{message}</p>
      )}
      <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-muted-foreground/60 sm:justify-start">
        <span className="flex items-center gap-1"><Shield className="h-3 w-3" />GDPR compliant</span>
        <span className="h-3 w-px bg-border/30" />
        <span className="flex items-center gap-1"><Lock className="h-3 w-3" />No spam, ever</span>
        <span className="h-3 w-px bg-border/30" />
        <span>Free for early adopters</span>
      </div>
    </div>
  );
}

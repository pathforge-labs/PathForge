"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/login", label: "Sign In" },
  { href: "/register", label: "Get Started" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] border-border/40 bg-background/95 backdrop-blur-xl"
      >
        <SheetHeader>
          <SheetTitle>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent">
                <span className="text-sm font-bold text-white">P</span>
              </div>
              <span className="font-display text-lg font-bold tracking-tight">
                PathForge
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-6 flex flex-col gap-1 px-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}

          {/* Primary CTA */}
          <div className="mt-4 border-t border-border/30 pt-4">
            <Link
              href="#waitlist"
              onClick={() => setOpen(false)}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Join the Waitlist
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

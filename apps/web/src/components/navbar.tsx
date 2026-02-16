"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ActiveNav } from "@/components/active-nav";
import { MobileNav } from "@/components/mobile-nav";
import { NavScrollEffect } from "@/components/nav-scroll-effect";
import { ThemeToggle } from "@/components/theme-toggle";
import { APP_NAME } from "@/config/brand";

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  return (
    <nav
      ref={navRef}
      className="fixed top-4 left-4 right-4 z-(--z-sticky) mx-auto max-w-7xl rounded-2xl border border-foreground/8 bg-background/70 backdrop-blur-xl transition-all duration-300"
      aria-label="Main navigation"
    >
      <NavScrollEffect navRef={navRef} />
      <div className="grid h-14 grid-cols-[auto_1fr_auto] items-center px-5">
        {/* Logo — left */}
        <Link href="/" className={`flex items-center gap-2.5 rounded-lg ${FOCUS_RING}`} aria-label={`${APP_NAME} home`}>
          <Image
            src="/brand/logo-light.png"
            alt={`${APP_NAME} logo`}
            width={30}
            height={30}
            className="logo-icon h-[30px] w-[30px] rounded-lg object-contain dark:hidden"
          />
          <Image
            src="/brand/logo-dark.png"
            alt={`${APP_NAME} logo`}
            width={30}
            height={30}
            className="logo-icon hidden h-[30px] w-[30px] rounded-lg object-contain dark:block"
          />
          <span className="gradient-text-animated font-display text-xl font-bold tracking-tight">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop nav — centered */}
        <div className="hidden items-center justify-center gap-1 nav:flex">
          <ActiveNav />
        </div>

        {/* CTA Cluster + Mobile — right */}
        <div className="flex items-center justify-end">
          {/* Gradient-bordered CTA pill — border matches brand gradient */}
          <div className="hidden rounded-full bg-linear-to-r from-primary/25 to-accent/25 p-px nav:block">
            <div className="flex items-center gap-1 rounded-full bg-background/80 p-1 backdrop-blur-sm">
              <ThemeToggle />
              {/* Gradient pipe — matches brand gradient */}
              <div className="h-5 w-px bg-linear-to-b from-primary to-accent opacity-40" />
              <Link
                href="#cta"
                className={`cta-button cursor-pointer rounded-full bg-linear-to-r from-primary to-accent px-5 py-1.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 ${FOCUS_RING}`}
              >
                Join Waitlist
              </Link>
            </div>
          </div>
          {/* Mobile nav */}
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}

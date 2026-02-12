import Link from "next/link";
import Image from "next/image";
import { ActiveNav } from "@/components/active-nav";
import { MobileNav } from "@/components/mobile-nav";
import { NavScrollEffect } from "@/components/nav-scroll-effect";
import { APP_NAME } from "@/config/brand";

export function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl transition-all duration-300"
      aria-label="Main navigation"
    >
      <NavScrollEffect />
      <div className="mx-auto flex h-16 max-w-7xl 2xl:max-w-[1400px] 3xl:max-w-[1600px] 4xl:max-w-[1800px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${APP_NAME} home`}>
          <Image
            src="/brand/logo-primary.png"
            alt={`${APP_NAME} logo`}
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg object-contain"
          />
          <span className="gradient-text-animated font-display text-2xl font-bold tracking-tight">
            {APP_NAME}
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
  );
}

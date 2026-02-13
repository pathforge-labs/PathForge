import Link from "next/link";
import Image from "next/image";
import { Globe, Linkedin, Github, X } from "lucide-react";
import {
  APP_NAME,
  APP_COMPANY,
  APP_COUNTRY,
  APP_COUNTRY_FLAG,
  SOCIAL_LINKS,
} from "@/config/brand";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/20" role="contentinfo">
      {/* Premium gradient mesh background */}
      <div className="absolute inset-0 bg-linear-to-b from-card/50 via-card/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,oklch(0.7_0.18_270/4%),transparent_60%),radial-gradient(ellipse_at_80%_20%,oklch(0.75_0.15_195/3%),transparent_50%)]" />
      {/* Subtle top gradient accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent" />

      <div className="relative mx-auto max-w-7xl 2xl:max-w-[1400px] 3xl:max-w-[1600px] 4xl:max-w-[1800px] px-6 py-16 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-16">
          {/* Brand — spans 2 columns on lg */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/logo-light.png"
                alt={`${APP_NAME} logo`}
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl object-contain dark:hidden"
              />
              <Image
                src="/brand/logo-dark.png"
                alt={`${APP_NAME} logo`}
                width={40}
                height={40}
                className="hidden h-10 w-10 rounded-xl object-contain dark:block"
              />
              <span className="gradient-text-animated font-display text-2xl font-bold tracking-tight">
                {APP_NAME}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Career Intelligence, Intelligently Forged. Decode your unique Career DNA™ and discover opportunities that truly align.
            </p>

            {/* Social icons — large, prominent */}
            <div className="mt-6">
              <div className="mb-4 h-px w-48 bg-linear-to-r from-primary/50 to-accent/50" />
              <div className="flex items-center gap-4">
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-xl text-muted-foreground/70 transition-all duration-200 hover:bg-primary/5 hover:text-primary" aria-label="LinkedIn">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-xl text-muted-foreground/70 transition-all duration-200 hover:bg-primary/5 hover:text-primary" aria-label="GitHub">
                  <Github className="h-6 w-6" />
                </a>
                <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-xl text-muted-foreground/70 transition-all duration-200 hover:bg-primary/5 hover:text-primary" aria-label="X (Twitter)">
                  <X className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="footer-heading mb-4 cursor-default text-xs font-semibold uppercase tracking-widest text-foreground/60">
              Product
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/features" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">Features</Link>
              <Link href="/#process" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">The Process</Link>
              <Link href="/comparison" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">Comparison</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="footer-heading mb-4 cursor-default text-xs font-semibold uppercase tracking-widest text-foreground/60">
              Legal
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/privacy" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</Link>
              <Link href="/terms" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">Terms of Service</Link>
              <Link href="/cookies" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">Cookie Policy</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="footer-heading mb-4 cursor-default text-xs font-semibold uppercase tracking-widest text-foreground/60">
              Company
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/about" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">About</Link>
              <Link href="/contact" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
              <Link href="/careers" className="footer-link w-fit cursor-pointer text-muted-foreground transition-colors hover:text-foreground">Careers</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative mt-14 pt-8">
          {/* Gradient divider line */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border/40 to-transparent" />
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground/50 sm:flex-row">
            <div className="flex items-center gap-1.5">
              <span className="text-sm leading-none">{APP_COUNTRY_FLAG}</span>
              <span>Made in {APP_COUNTRY}</span>
            </div>
            <p>
              © {new Date().getFullYear()} {APP_NAME} by {APP_COMPANY}
            </p>
            <div className="flex items-center gap-1.5 text-muted-foreground/40 transition-colors hover:text-muted-foreground/60">
              <Globe className="h-3 w-3" />
              <span>English</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

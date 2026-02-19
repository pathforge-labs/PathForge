"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/config/brand";
import { ThemeToggle } from "@/components/theme-toggle";
// Twitter = X (formerly Twitter) brand logo; X = close/dismiss icon
import { Instagram, Linkedin, Twitter, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/#process", label: "The Process" },
  { href: "/features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

const SOCIAL_LINKS = [
  { href: "https://instagram.com/pathforge", label: "Instagram", icon: Instagram },
  { href: "https://linkedin.com/company/pathforge", label: "LinkedIn", icon: Linkedin },
  { href: "https://x.com/pathforge", label: "X", icon: Twitter },
];

const subscribe = () => () => {};

export function MobileNav() {
  const [open, setOpen] = useState(false);
  // Hydration-safe: returns false on server, true on client (no cascading render)
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape key handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    },
    [open]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Hamburger / X toggle button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative z-(--z-popover) flex h-10 w-10 items-center justify-center rounded-full nav:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <div className="flex h-5 w-6 flex-col items-center justify-center gap-[5px]">
          <span
            className={`block h-[2px] w-5 rounded-full bg-foreground transition-all duration-300 ease-out ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-5 rounded-full bg-foreground transition-all duration-300 ease-out ${
              open ? "scale-x-0 opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-5 rounded-full bg-foreground transition-all duration-300 ease-out ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </div>
      </button>

      {/* Full-screen drawer overlay — Portal escapes navbar's backdrop-filter stacking context */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-(--z-modal) transition-all duration-500 ease-out nav:hidden ${
              open
                ? "pointer-events-auto visible opacity-100"
                : "pointer-events-none invisible opacity-0"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Backdrop — fully opaque, uses explicit colors for guaranteed coverage */}
            <div
              className={`absolute inset-0 bg-background transition-opacity duration-500 ${
                open ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer content */}
            <div className="relative flex h-full flex-col bg-background px-8 pt-24 pb-8">
              {/* Close button — top-4(16) + (h-14−h-10)/2(8) = 24px; right-4(16) + px-5(20) = 36px */}
              <button
                onClick={() => setOpen(false)}
                className={`absolute top-[24px] right-[36px] z-10 flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 transition-all duration-300 hover:bg-foreground/8 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  open ? "scale-100 opacity-100" : "scale-75 opacity-0"
                }`}
                aria-label="Close menu"
                tabIndex={open ? 0 : -1}
              >
                <X className="h-7 w-7" strokeWidth={2.5} />
              </button>
              {/* Logo */}
              <div
                className={`mb-12 flex items-center gap-3 transition-all duration-500 ease-out ${
                  open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
                }`}
              >
                <Image
                  src="/brand/logo-light.png"
                  alt={`${APP_NAME} logo`}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-lg object-contain dark:hidden"
                />
                <Image
                  src="/brand/logo-dark.png"
                  alt={`${APP_NAME} logo`}
                  width={36}
                  height={36}
                  className="hidden h-9 w-9 rounded-lg object-contain dark:block"
                />
                <span className="gradient-text-animated font-display text-2xl font-bold tracking-tight">
                  {APP_NAME}
                </span>
              </div>

              {/* Navigation links */}
              <nav className="flex-1">
                <ul className="space-y-0">
                  {NAV_LINKS.map((link, i) => (
                    <li
                      key={link.href}
                      className={`transition-all duration-500 ease-out ${
                        open
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-8 opacity-0"
                      }`}
                      style={{
                        transitionDelay: open ? `${150 + i * 60}ms` : "0ms",
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-center border-b border-foreground/6 py-5"
                      >
                        <span className="font-display text-xl font-semibold text-foreground/80 transition-colors duration-200 group-hover:text-foreground">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Primary CTA */}
                <div
                  className={`mt-8 transition-all duration-500 ease-out ${
                    open
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                  style={{
                    transitionDelay: open ? `${150 + NAV_LINKS.length * 60 + 80}ms` : "0ms",
                  }}
                >
                  <Link
                    href="/#cta"
                    onClick={() => setOpen(false)}
                    className="cta-button flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-primary to-accent px-6 py-4 text-base font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/20"
                  >
                    Join the Waitlist
                  </Link>
                </div>
              </nav>

              {/* Footer — Contact + Social + ThemeToggle */}
              <div
                className={`flex items-center justify-between border-t border-foreground/6 pt-6 transition-all duration-500 ease-out ${
                  open
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{
                  transitionDelay: open ? `${150 + NAV_LINKS.length * 60 + 160}ms` : "0ms",
                }}
              >
                {/* Contact link — scaled for mobile touch targets */}
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </Link>

                {/* Social icons + theme toggle — scaled for touch targets */}
                <div className="flex items-center gap-4">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground/60 transition-all duration-200 hover:bg-foreground/6 hover:text-foreground"
                      aria-label={social.label}
                    >
                      <social.icon className="h-[22px] w-[22px]" />
                    </a>
                  ))}
                  <div className="ml-1 h-6 w-px bg-foreground/8" />
                  <ThemeToggle size="lg" />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

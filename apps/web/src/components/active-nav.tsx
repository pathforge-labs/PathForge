"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "#how-it-works", label: "How it Works" },
  { href: "#features", label: "Features" },
];

/**
 * Desktop navigation with scroll-based active section highlighting.
 * Observes section[id] elements and highlights the corresponding nav link.
 */
export function ActiveNav() {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((link) => link.href.replace("#", ""));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that is most visible
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0 && visible[0].target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { threshold: 0.2, rootMargin: "-80px 0px -40% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {NAV_LINKS.map((link) => {
        const isActive = activeId === link.href.replace("#", "");
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {link.label}
            <span
              className={`absolute -bottom-px left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-linear-to-r from-primary to-accent transition-all duration-300 ${
                isActive ? "w-4/5 opacity-100" : "w-0 opacity-0"
              }`}
            />
          </Link>
        );
      })}
    </>
  );
}

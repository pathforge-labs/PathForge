"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

/**
 * Premium FAQ accordion with smooth CSS grid height animations.
 * Uses grid-template-rows: 0fr → 1fr trick for smooth open/close.
 * Only one item can be open at a time.
 */
export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <div className="space-y-4">
      {items.map((faq, i) => {
        const isOpen = openIndex === i;

        return (
          <div key={faq.q} className="faq-item glass-card rounded-xl">
            <button
              type="button"
              onClick={() => toggle(i)}
              className="flex w-full cursor-pointer items-center justify-between p-5 text-left text-sm font-semibold transition-colors hover:text-primary"
              aria-expanded={isOpen}
            >
              {faq.q}
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import type { FaqItem } from "@/data/faq";

export function FAQBlock({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <div className="divide-y divide-hairline rounded-2xl border border-hairline bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-medium text-forest-deep">{item.question}</span>
              <span className={cn("text-forest", isOpen && "rotate-45")}>+</span>
            </button>
            {isOpen && (
              <p className="px-5 pb-5 text-sm leading-relaxed text-mist">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

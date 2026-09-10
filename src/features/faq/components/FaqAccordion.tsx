"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqAccordionProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  searchTerm?: string;
  categoryTitle?: string;
}

/**
 * Highlights matches of searchTerm inside text
 */
function HighlightedText({
  text,
  searchTerm = "",
}: {
  text: string;
  searchTerm?: string;
}) {
  if (!searchTerm.trim()) return <>{text}</>;

  const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-amber-200/80 text-forest-deep font-semibold rounded-xs px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function FaqAccordion({
  question,
  answer,
  isOpen,
  onToggle,
  searchTerm = "",
  categoryTitle,
}: FaqAccordionProps) {
  return (
    <div
      className={cn(
        "group rounded-2xl border transition-all duration-200 overflow-hidden bg-white",
        isOpen
          ? "border-forest/30 shadow-md ring-1 ring-forest/10"
          : "border-hairline/80 shadow-2xs hover:border-forest/20 hover:shadow-sm",
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={cn(
          "flex w-full items-start justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer transition-colors select-none",
          isOpen ? "bg-sand-soft/30" : "hover:bg-sand-soft/20",
        )}
      >
        <div className="space-y-1 pr-2">
          {categoryTitle && (
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-forest/80">
              {categoryTitle}
            </span>
          )}
          <h3 className="font-display text-base sm:text-lg font-bold text-forest-deep leading-snug group-hover:text-forest transition-colors">
            <HighlightedText text={question} searchTerm={searchTerm} />
          </h3>
        </div>

        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
            isOpen
              ? "bg-forest text-white rotate-180 shadow-xs"
              : "bg-cream text-forest group-hover:bg-sand-soft",
          )}
        >
          <ChevronDown className="h-4 w-4 stroke-[2.5]" />
        </div>
      </button>

      {/* Expandable Answer Drawer */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-hairline/60 px-5 pb-6 pt-4 sm:px-6 sm:pb-6 text-sm sm:text-base leading-relaxed text-mist whitespace-pre-line">
            <HighlightedText text={answer} searchTerm={searchTerm} />
          </div>
        </div>
      </div>
    </div>
  );
}

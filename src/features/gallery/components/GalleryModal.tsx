"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Star,
  ExternalLink,
  Share2,
  Check,
  Tag as TagIcon,
} from "lucide-react";
import type { Item } from "./Masonry";

interface GalleryModalProps {
  item: Item | null;
  items: Item[];
  onClose: () => void;
  onSelect: (item: Item) => void;
  lang: string;
  dict?: any;
}

export function GalleryModal({
  item,
  items,
  onClose,
  onSelect,
  lang,
  dict,
}: GalleryModalProps) {
  const [copied, setCopied] = useState(false);
  const t = dict?.GalleryPage?.Modal;

  const currentIndex = items.findIndex((i) => i.id === item?.id);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelect(items[currentIndex - 1]);
    } else {
      onSelect(items[items.length - 1]);
    }
  }, [currentIndex, items, onSelect]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      onSelect(items[currentIndex + 1]);
    } else {
      onSelect(items[0]);
    }
  }, [currentIndex, items, onSelect]);

  // Keyboard navigation (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose, handlePrev, handleNext]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (item) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [item]);

  if (!item) return null;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const raw = item.rawItem || {};
  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString(
        lang === "ht" ? "ht-HT" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Floating Close Button Top Right */}
      <button
        type="button"
        onClick={onClose}
        aria-label={t?.Close || "Close preview"}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/90 shadow-lg backdrop-blur-md transition-transform duration-200 hover:scale-110 hover:bg-white/25 hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Modal Dialog Card */}
      <div
        className="relative flex flex-col lg:flex-row w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-4xl bg-white shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: High-Resolution Photo Viewer */}
        <div className="relative flex-1 flex items-center justify-center bg-neutral-950 p-4 sm:p-8 min-h-90 lg:min-h-145 overflow-hidden group">
          <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
            <img
              src={item.img}
              alt={item.title || "Community photo"}
              className="max-h-[65vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl transition-all duration-300 select-none"
            />
          </div>

          {/* Navigation Arrow: Prev */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/50 text-white shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-black/80"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Navigation Arrow: Next */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/50 text-white shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-black/80"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Bottom Left Toolbar: Open Original Photo & Photo Counter */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 flex items-center gap-2">
            <a
              href={item.img}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white/95 backdrop-blur-md transition-colors hover:bg-black/90 cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{t?.ViewOriginal || "Full Resolution"}</span>
            </a>

            {items.length > 1 && (
              <span className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md">
                {currentIndex + 1} / {items.length}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Metadata, Story & Community Context Panel */}
        <div className="w-full lg:w-105 flex flex-col justify-between p-6 sm:p-8 bg-white border-t lg:border-t-0 lg:border-l border-hairline overflow-y-auto">
          <div className="space-y-5">
            {/* Top Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              {item.category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 border border-forest/20 px-3 py-1 text-xs font-bold text-forest">
                  <TagIcon className="h-3 w-3" />
                  <span>{item.category}</span>
                </span>
              )}

              {item.featured && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/60 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-800">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>{t?.Spotlight || "Spotlight"}</span>
                </span>
              )}
            </div>

            {/* Photo Title */}
            <h3 className="font-display text-2xl font-bold leading-snug text-forest-deep">
              {item.title || "Community Field Capture"}
            </h3>

            {/* Metadata Rows: Location & Date */}
            <div className="space-y-2 text-xs text-mist border-y border-hairline/60 py-3">
              {item.location && (
                <div className="flex items-center gap-2 text-mist">
                  <MapPin className="h-4 w-4 text-forest shrink-0" />
                  <span className="font-semibold text-forest-deep">
                    {item.location}
                  </span>
                </div>
              )}

              {formattedDate && (
                <div className="flex items-center gap-2 text-mist">
                  <Calendar className="h-4 w-4 text-forest shrink-0" />
                  <span>
                    {t?.CapturedOn || "Captured on"} {formattedDate}
                  </span>
                </div>
              )}
            </div>

            {/* Field Note / Story Context Box */}
            <div className="rounded-2xl border border-hairline bg-sand-soft/50 p-5 text-xs sm:text-sm">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-forest">
                {t?.StoryNote || "Context & Field Note"}
              </div>
              <p className="leading-relaxed text-forest-deep/90 whitespace-pre-line">
                {raw.description ||
                  "A verified field photograph documenting local micro-grant milestones, community members, and grassroots progress supported by IFundAyiti."}
              </p>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="mt-8 pt-5 border-t border-hairline flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-hairline bg-white py-2.5 px-4 text-xs font-bold text-forest-deep shadow-2xs hover:bg-sand-soft hover:border-forest/30 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-forest" />
                  <span className="text-forest">
                    {t?.Copied || "Link Copied!"}
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 text-mist" />
                  <span>{t?.Share || "Share"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-forest px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-forest-bright transition-colors cursor-pointer"
            >
              {t?.Close || "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

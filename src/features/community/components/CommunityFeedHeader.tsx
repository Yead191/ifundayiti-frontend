"use client";

import * as React from "react";
import { Search, Sparkles, ShieldCheck, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CommunityFeedHeaderProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  lang?: string;
  dict?: any;
}

export function CommunityFeedHeader({
  searchTerm,
  onSearchChange,
  lang = "en",
  dict,
}: CommunityFeedHeaderProps) {
  const isHt = lang === "ht";
  const t = dict?.CommunityPage || {};

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/12 bg-linear-to-br from-forest-deep via-[#0c4030] to-[#07241b] p-5 sm:p-6 text-white shadow-lg">
      {/* Decorative subtle ambient lights */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/15 blur-2xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-amber-500/10 blur-2xl" />

      <div className="relative z-10 space-y-3.5">
        {/* Top Row: Title & Search Bar Side-by-Side on Desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
          <div className="space-y-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>{t.Hero?.Eyebrow || "Community Forum"}</span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
              {t.Hero?.Title || "Community Discussions & Announcements"}
            </h1>
            <p className="text-xs sm:text-sm text-sand-soft/80 max-w-lg leading-relaxed">
              {t.Hero?.Subtitle ||
                "Official announcements from leadership, member reflections, and community dialogue."}
            </p>
          </div>

          {/* Compact Glass Search Input */}
          <div className="relative shrink-0 sm:w-68 md:w-76">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/50" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                t.SearchPlaceholder ||
                "Search discussions..."
              }
              className="h-9.5 rounded-xl border-white/15 bg-white/10 pl-9 pr-8 text-xs text-white placeholder:text-white/40 focus:border-emerald-400 focus:bg-white/15 focus:ring-1 focus:ring-emerald-400/30"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 grid h-4.5 w-4.5 place-items-center rounded-full bg-white/20 text-white/80 hover:bg-white/30 transition cursor-pointer"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        </div>

        {/* Compact Inline Broadcast Notice Strip */}
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-sand-soft/90 backdrop-blur-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">
            <strong className="text-white font-semibold mr-1.5">
              {t.Notice?.Badge || "Official Channel"}:
            </strong>
            {t.Notice?.Text ||
              "Announcements published by iFundAyiti leadership. Verified members can comment & like."}
          </span>
        </div>
      </div>
    </div>
  );
}

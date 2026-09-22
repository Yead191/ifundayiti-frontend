"use client";

import * as React from "react";
import { MessageSquare, Search, Sparkles, ShieldCheck, X } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-3xl border border-hairline/90 bg-linear-to-br from-forest-deep via-[#0d4534] to-[#08291f] p-6 sm:p-10 text-white shadow-xl">
      {/* Decorative ambient elements */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative z-10 max-w-3xl space-y-4">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>{t.Hero?.Eyebrow || "Community Forum & Announcements"}</span>
        </div>

        {/* Display Title */}
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-[1.12]">
          {t.Hero?.Title || "Community Discussions & Official Announcements"}
        </h1>

        {/* Subtitle */}
        <p className="text-sm leading-relaxed text-sand-soft/80 sm:text-base max-w-2xl">
          {t.Hero?.Subtitle ||
            "Stay informed with the latest updates from iFundAyiti leadership, join discussions, and share insights with grassroots builders."}
        </p>

        {/* Admin Broadcast Notice Card */}
        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md text-xs text-sand-soft/90">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-white tracking-wide uppercase text-[11px] block">
              {t.Notice?.Badge || "Official Channel"}
            </span>
            <p className="text-xs text-sand-soft/85 leading-relaxed">
              {t.Notice?.Text ||
                "Official announcements are published by iFundAyiti administrators. All verified members are invited to comment, reply, and interact!"}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative pt-2">
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                t.SearchPlaceholder ||
                "Search announcements and discussions..."
              }
              className="h-11 rounded-2xl border-white/15 bg-white/10 pl-10 pr-9 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:bg-white/15 focus:ring-2 focus:ring-emerald-400/20"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 grid h-5 w-5 place-items-center rounded-full bg-white/20 text-white/80 hover:bg-white/30 transition cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

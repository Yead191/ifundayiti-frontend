"use client";

import React from "react";
import Link from "next/link";
import { MessageSquareText, Search, ArrowRight, Mail } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

interface FaqCtaProps {
  lang: string;
  dict?: any;
}

export function FaqCta({ lang, dict }: FaqCtaProps) {
  const t = dict?.FaqPage?.Cta;

  return (
    <Reveal delay={100}>
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-forest via-forest-deep to-[#051A13] p-8 sm:p-12 md:p-14 text-white shadow-xl">
        {/* Ambient Decorative Auroras */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-forest-bright/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-sand/15 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sand backdrop-blur-md">
              <MessageSquareText className="h-3.5 w-3.5" />
              <span>{t?.Eyebrow || "Need More Help?"}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              {t?.Title || "Still Have Questions?"}
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-white/80 max-w-xl">
              {t?.Subtitle ||
                "Can't find the answer you're looking for? Our community support team and field officers are ready to assist you."}
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs sm:text-sm text-white/70">
              <Mail className="h-4 w-4 text-sand shrink-0" />
              <span>{t?.EmailUs || "Email us at"}:</span>
              <a
                href="mailto:contact@ifundayiti.org"
                className="font-bold text-white hover:text-sand underline transition-colors"
              >
                contact@ifundayiti.org
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
            <Link
              href={`/${lang}/contact`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sand px-6 py-3.5 text-xs sm:text-sm font-bold text-forest-deep shadow-md transition-all duration-200 hover:bg-sand-soft hover:scale-102 hover:shadow-lg text-center cursor-pointer"
            >
              <span>{t?.ContactBtn || "Contact Support"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={`/${lang}/track-application`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all duration-200 hover:bg-white/20 text-center cursor-pointer backdrop-blur-md"
            >
              <Search className="h-4 w-4" />
              <span>{t?.TrackBtn || "Track Application"}</span>
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

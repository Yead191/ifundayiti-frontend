"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Sparkles, BookOpen } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { buildBlogUrl } from "../utils";

interface BlogHeroProps {
  initialSearchTerm?: string;
  activeCategory?: string;
  lang?: string;
  dict?: any;
}

export function BlogHero({
  initialSearchTerm = "",
  activeCategory = "all",
  lang = "en",
  dict,
}: BlogHeroProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildBlogUrl(lang, activeCategory, searchTerm);
    router.replace(url, { scroll: false });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    const url = buildBlogUrl(lang, activeCategory, "");
    router.replace(url, { scroll: false });
  };

  const t = dict?.BlogPage?.Hero;

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-sand-soft/80 via-cream to-cream pb-14 pt-28 md:pb-18 md:pt-36 border-b border-hairline/60">
      {/* Ambient Aurora Glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-full -translate-x-1/2 overflow-hidden">
        <div className="aurora -top-24 left-1/3 h-80 w-xl opacity-35" />
        <div className="aurora top-20 right-1/4 h-72 w-96 opacity-25" />
      </div>

      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow Pill */}
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/85 px-4 py-1.5 shadow-2xs backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-forest-bright animate-pulse" />
              <BookOpen className="h-3.5 w-3.5 text-forest" />
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                {t?.Eyebrow || "Insights & Dispatches · Field Archives"}
              </span>
            </div>
          </Reveal>

          {/* Main Editorial Headline */}
          <Reveal delay={80}>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-forest-deep sm:text-5xl md:text-6xl md:leading-[1.12]">
              <span>{t?.TitlePrefix || "Stories of "}</span>
              <span className="text-gradient">
                {t?.TitleHighlight || "Impact, Transparency"}
              </span>
              <span>{t?.TitleSuffix || " & Hope from Haiti"}</span>
            </h1>
          </Reveal>

          {/* Subheading Narrative */}
          <Reveal delay={140}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              {t?.Subtitle ||
                "Explore authentic dispatches, grassroots milestones, and in-depth stories documenting how local entrepreneurship and community grants shape sustainable futures."}
            </p>
          </Reveal>

          {/* Centered Search Bar */}
          <Reveal delay={200}>
            <div className="mx-auto mt-8 max-w-xl">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center"
              >
                <Search className="absolute left-4 h-4 w-4 text-mist" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    t?.SearchPlaceholder || "Search articles by title, topic, or keyword..."
                  }
                  className="w-full rounded-2xl border border-hairline bg-white/95 py-3.5 pl-11 pr-24 text-sm text-forest-deep placeholder:text-mist/70 shadow-xs focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-20 p-1 text-mist hover:text-forest-deep transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 rounded-xl bg-forest px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-forest-bright transition-colors cursor-pointer"
                >
                  {lang === "ht" ? "Chèche" : "Search"}
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export default BlogHero;

"use client";

import React, { useState, useMemo } from "react";
import { Search, X, HelpCircle, Sparkles, SlidersHorizontal } from "lucide-react";
import type { IFAQ } from "@/types";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { EmptyState } from "@/components/shared/empty-state";
import { FaqAccordion } from "./FaqAccordion";
import { FaqCta } from "./FaqCta";

interface FaqShowcaseProps {
  categories: IFAQ[];
  lang: string;
  dict?: any;
}

export function FaqShowcase({
  categories = [],
  lang = "en",
  dict,
}: FaqShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const t = dict?.FaqPage;

  // Compute total questions count
  const totalQuestions = useMemo(() => {
    return categories.reduce(
      (acc, cat) => acc + (cat.items?.length || 0),
      0,
    );
  }, [categories]);

  // Filtered categories and questions based on active category and search term
  const filteredCategories = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return categories
      .filter((cat) => {
        if (activeCategory === "all") return true;
        return cat._id === activeCategory || cat.title === activeCategory;
      })
      .map((cat) => {
        if (!q) {
          return cat;
        }

        // Search matches against category title, question text, or answer text
        const matchingItems = (cat.items || []).filter((item) => {
          const matchQ = item.question.toLowerCase().includes(q);
          const matchA = item.answer.toLowerCase().includes(q);
          const matchTitle = cat.title.toLowerCase().includes(q);
          return matchQ || matchA || matchTitle;
        });

        return {
          ...cat,
          items: matchingItems,
        };
      })
      .filter((cat) => cat.items && cat.items.length > 0);
  }, [categories, activeCategory, searchTerm]);

  // Count matching questions after filtering
  const matchingQuestionsCount = useMemo(() => {
    return filteredCategories.reduce(
      (acc, cat) => acc + (cat.items?.length || 0),
      0,
    );
  }, [filteredCategories]);

  // Toggle open/close state for a specific question
  const toggleItem = (itemKey: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="w-full">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-sand-soft/80 via-cream to-cream pb-16 pt-28 md:pb-20 md:pt-36 border-b border-hairline/60">
        {/* Ambient Auroras */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-full -translate-x-1/2 overflow-hidden">
          <div className="aurora -top-24 left-1/3 h-80 w-xl opacity-30" />
          <div className="aurora top-20 right-1/4 h-72 w-96 opacity-20" />
        </div>

        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            {/* Eyebrow Pill */}
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/80 px-4 py-1.5 shadow-2xs backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-forest-bright animate-pulse" />
                <HelpCircle className="h-3.5 w-3.5 text-forest" />
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  {t?.Hero?.Eyebrow || "Help & Resources"}
                </span>
              </div>
            </Reveal>

            {/* Display Title */}
            <Reveal delay={80}>
              <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-forest-deep sm:text-5xl md:text-6xl md:leading-[1.12]">
                <span>{t?.Hero?.TitlePrefix || "Questions, "}</span>
                <span className="text-gradient">
                  {t?.Hero?.TitleHighlight || "Answered Clearly."}
                </span>
              </h1>
            </Reveal>

            {/* Subtitle */}
            <Reveal delay={140}>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
                {t?.Hero?.Subtitle ||
                  "Find immediate answers about community grants, application cycles, donations, store orders, and IFundAyiti programs."}
              </p>
            </Reveal>

            {/* Real-time Search Input */}
            <Reveal delay={200}>
              <div className="relative mx-auto mt-8 max-w-xl">
                <div className="relative flex items-center">
                  <Search className="pointer-events-none absolute left-4 h-4 w-4 text-mist" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={
                      t?.Search?.Placeholder ||
                      "Search questions, topics, or answers..."
                    }
                    className="h-13 w-full rounded-2xl border border-hairline bg-white/95 pl-11 pr-24 text-sm text-forest-deep placeholder:text-mist shadow-sm backdrop-blur-md focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 transition-all"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-mist hover:text-forest-deep hover:bg-sand-soft transition-colors cursor-pointer"
                      aria-label={t?.Search?.Clear || "Clear search"}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Main FAQ Content Section */}
      <section className="py-12 md:py-16 bg-sand-soft/20 min-h-[50vh]">
        <Container className="max-w-4xl space-y-10">
          {/* Category Navigation Tabs / Pills */}
          {categories.length > 0 && (
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2 pt-1">
              {/* "All Questions" Tab */}
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeCategory === "all"
                    ? "bg-forest text-white shadow-sm ring-2 ring-forest/30 scale-102"
                    : "bg-white border border-hairline text-forest-deep hover:bg-sand-soft hover:border-forest/20 shadow-2xs"
                }`}
              >
                <span>{t?.Categories?.All || "All Questions"}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                    activeCategory === "all"
                      ? "bg-white/20 text-white"
                      : "bg-cream text-forest"
                  }`}
                >
                  {totalQuestions}
                </span>
              </button>

              {/* Individual Category Tabs */}
              {categories.map((cat) => {
                const isActive =
                  activeCategory === cat._id || activeCategory === cat.title;
                const itemCount = cat.items?.length || 0;

                return (
                  <button
                    key={cat._id || cat.title}
                    type="button"
                    onClick={() => setActiveCategory(cat._id || cat.title)}
                    className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-forest text-white shadow-sm ring-2 ring-forest/30 scale-102"
                        : "bg-white border border-hairline text-forest-deep hover:bg-sand-soft hover:border-forest/20 shadow-2xs"
                    }`}
                  >
                    <span>{cat.title}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-cream text-forest"
                      }`}
                    >
                      {itemCount}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Search Result Summary Indicator */}
          {searchTerm.trim() && (
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-hairline bg-white/80 p-4 shadow-2xs backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-mist">
                <SlidersHorizontal className="h-4 w-4 text-forest" />
                <span>
                  <strong className="text-forest-deep font-bold">
                    {matchingQuestionsCount}
                  </strong>{" "}
                  {matchingQuestionsCount === 1
                    ? t?.Search?.ResultsCountSingle || "question found"
                    : t?.Search?.ResultsCount?.replace(
                        "{count}",
                        matchingQuestionsCount.toString(),
                      ) || "questions found"}
                  {" for "}
                  <span className="font-bold text-forest-deep">
                    &ldquo;{searchTerm}&rdquo;
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleClearSearch}
                className="text-xs font-bold text-forest hover:text-forest-deep transition-colors cursor-pointer"
              >
                {t?.Search?.Clear || "Clear Search"}
              </button>
            </div>
          )}

          {/* Render Categories & Questions or Empty State */}
          {filteredCategories.length === 0 ? (
            <EmptyState
              title={
                searchTerm
                  ? t?.Empty?.Title || "No questions found"
                  : t?.NoFaqs?.Title || "No FAQ Available"
              }
              body={
                searchTerm
                  ? t?.Empty?.Body?.replace("{searchTerm}", searchTerm) ||
                    `We couldn't find any questions matching "${searchTerm}". Try different keywords.`
                  : t?.NoFaqs?.Body ||
                    "Our team is currently updating the FAQ repository. Please check back soon."
              }
              actionLabel={
                searchTerm ? t?.Empty?.ClearBtn || "View All Questions" : undefined
              }
              actionOnClick={searchTerm ? handleClearSearch : undefined}
            />
          ) : (
            <div className="space-y-10">
              {filteredCategories.map((category) => (
                <div key={category._id || category.title} className="space-y-4">
                  {/* Category Section Header */}
                  <div className="flex items-center justify-between border-b border-hairline/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-2.5 w-1 rounded-full bg-forest" />
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-forest-deep">
                        {category.title}
                      </h2>
                    </div>

                    <span className="text-xs font-semibold text-mist">
                      {category.items.length}{" "}
                      {category.items.length === 1
                        ? t?.Accordion?.QuestionCountSingle || "question"
                        : t?.Accordion?.QuestionsCount || "questions"}
                    </span>
                  </div>

                  {/* Accordion List for Category */}
                  <div className="space-y-3">
                    {category.items.map((item, index) => {
                      const itemKey = `${category._id || category.title}-${index}`;
                      // When searching, auto-expand matching questions by default
                      const isAutoExpanded =
                        Boolean(searchTerm.trim()) && openItems[itemKey] !== false;
                      const isOpen =
                        openItems[itemKey] !== undefined
                          ? openItems[itemKey]
                          : isAutoExpanded;

                      return (
                        <FaqAccordion
                          key={itemKey}
                          question={item.question}
                          answer={item.answer}
                          isOpen={isOpen}
                          onToggle={() => toggleItem(itemKey)}
                          searchTerm={searchTerm}
                          categoryTitle={
                            activeCategory === "all" ? undefined : undefined
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* "Still Have Questions?" Bottom CTA Banner */}
          <div className="pt-8">
            <FaqCta lang={lang} dict={dict} />
          </div>
        </Container>
      </section>
    </div>
  );
}

export default FaqShowcase;

"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { GALLERY_CATEGORIES } from "@/features/gallery/constants";

interface GalleryFilterBarProps {
  lang: string;
  activeCategory: string;
  initialSearchTerm?: string;
  totalResults: number;
  dict?: any;
}

export function GalleryFilterBar({
  lang,
  activeCategory,
  initialSearchTerm = "",
  totalResults,
  dict,
}: GalleryFilterBarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const t = dict?.GalleryPage;
  const categoriesMap = (t?.Categories || {}) as Record<string, string>;

  const updateFilters = (newCat: string, newSearch: string) => {
    const params = new URLSearchParams();

    if (newCat && newCat !== "All") {
      params.set("category", newCat);
    }

    if (newSearch && newSearch.trim()) {
      params.set("searchTerm", newSearch.trim());
    }

    startTransition(() => {
      router.push(
        `/${lang}/gallery${params.toString() ? `?${params.toString()}` : ""}`,
        { scroll: false }
      );
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(activeCategory, searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    updateFilters(activeCategory, "");
  };

  const handleCategoryClick = (cat: string) => {
    updateFilters(cat, searchTerm);
  };

  return (
    <div className="space-y-6 mb-12">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-mist" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                t?.SearchPlaceholder || "Search by title, location, category..."
              }
              className="w-full rounded-2xl border border-hairline bg-white py-3.5 pl-11 pr-24 text-sm text-forest-deep placeholder:text-mist/70 shadow-xs focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 transition-all"
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
              disabled={isPending}
              className="absolute right-2 rounded-xl bg-forest px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-forest-bright transition-colors cursor-pointer"
            >
              {isPending ? "..." : lang === "ht" ? "Chèche" : "Search"}
            </button>
          </div>
        </form>

        {/* Results Counter */}
        <div className="flex items-center gap-2 text-xs text-mist shrink-0">
          <SlidersHorizontal className="h-3.5 w-3.5 text-forest" />
          <span>
            <strong className="text-forest-deep font-bold">{totalResults}</strong>{" "}
            {t?.ResultsCount || "photos found"}
          </span>
        </div>
      </div>

      {/* Category Filter Pills (Horizontal Slider) */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto lg:flex-wrap pb-2 pt-1">
        {GALLERY_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const label = categoriesMap[cat] || cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-forest text-white shadow-sm ring-2 ring-forest/30 scale-102"
                  : "bg-white border border-hairline text-forest-deep hover:bg-sand-soft hover:border-forest/20 shadow-2xs"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Active Search Query Indicator */}
      {initialSearchTerm && (
        <div className="flex items-center gap-2 text-xs text-mist">
          <span>
            {lang === "ht" ? "Rezilta rechèch pou" : "Search results for"}:{" "}
            <span className="font-bold text-forest-deep">
              &ldquo;{initialSearchTerm}&rdquo;
            </span>
          </span>
          <button
            type="button"
            onClick={handleClearSearch}
            className="text-forest hover:underline font-semibold cursor-pointer"
          >
            ({lang === "ht" ? "Efase" : "Clear"})
          </button>
        </div>
      )}
    </div>
  );
}

export default GalleryFilterBar;

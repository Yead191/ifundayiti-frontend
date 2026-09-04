"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Check, ChevronDown, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";

import type { ProductCategory } from "@/helpers/next-fetch/shopActions";
import { SHOP_GENDERS, SHOP_SORT_OPTIONS } from "../constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface ShopFiltersBarProps {
  categories: ProductCategory[];
  totalResults: number;
  lang?: string;
  dict?: any;
}

export function ShopFiltersBar({
  categories,
  totalResults,
  lang = "en",
  dict,
}: ShopFiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentGender = searchParams.get("gender") || "all";
  const currentSearch = searchParams.get("searchTerm") || "";
  const currentSort = searchParams.get("sort") || "featured";

  const [searchInput, setSearchInput] = React.useState(currentSearch);

  React.useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const t = dict?.ShopPage?.Filters;

  // Build query string and push without jumping scroll
  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page"); // reset page on filter change

    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "all" || value === "featured") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    const qs = params.toString();
    router.push(`/${lang}/shop${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ searchTerm: searchInput.trim() || null });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    router.push(`/${lang}/shop`, { scroll: false });
  };

  const hasActiveFilters =
    currentCategory !== "all" ||
    currentGender !== "all" ||
    currentSearch !== "" ||
    (currentSort !== "featured" && currentSort !== "");

  const currentSortObj =
    SHOP_SORT_OPTIONS.find((s) => s.value === currentSort) ||
    SHOP_SORT_OPTIONS[0];

  const getSortLabel = (val: string) => {
    switch (val) {
      case "featured":
        return t?.Sort?.featured || "Featured First";
      case "-createdAt":
        return t?.Sort?.newest || "New Arrivals";
      case "price":
        return t?.Sort?.priceAsc || "Price: Low to High";
      case "-price":
        return t?.Sort?.priceDesc || "Price: High to Low";
      case "-sold":
        return t?.Sort?.bestSellers || "Best Sellers";
      default:
        return "Featured First";
    }
  };

  return (
    <div className="space-y-6">
      {/* TOP ROW: Search, Gender Tabs, & Sort Dropdown */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t?.SearchPlaceholder || "Search by title, tag, fabric..."}
            className="h-12 w-full rounded-2xl border-hairline bg-white pl-11 pr-10 text-sm shadow-2xs focus-visible:ring-forest/20"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                updateQuery({ searchTerm: null });
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mist hover:text-forest-deep"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Gender Filter Pills & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
          {/* Gender Pills */}
          <div className="inline-flex rounded-2xl bg-sand-soft/80 p-1 border border-hairline/60">
            {SHOP_GENDERS.map((g) => {
              const isActive = currentGender === g.value;
              const genderLabel =
                t?.Gender?.[g.value as keyof typeof t.Gender] || g.label;
              return (
                <button
                  key={g.value}
                  type="button"
                  onClick={() =>
                    updateQuery({ gender: g.value === "all" ? null : g.value })
                  }
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-forest text-white shadow-xs"
                      : "text-mist hover:text-forest-deep"
                  }`}
                >
                  {genderLabel}
                </button>
              );
            })}
          </div>

          {/* Sort Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-hairline bg-white px-4 text-xs font-semibold text-forest-deep shadow-2xs transition-all hover:bg-sand-soft/50"
              >
                <ArrowUpDown className="h-3.5 w-3.5 text-forest" />
                <span className="text-mist font-normal">
                  {t?.Sort?.label || "Sort by:"}
                </span>
                <span>{getSortLabel(currentSortObj.value)}</span>
                <ChevronDown className="h-3.5 w-3.5 text-mist" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 rounded-2xl border border-hairline bg-white/95 p-1.5 shadow-xl backdrop-blur-xl"
            >
              {SHOP_SORT_OPTIONS.map((opt) => {
                const isSelected = currentSort === opt.value;
                return (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() =>
                      updateQuery({ sort: opt.value === "featured" ? null : opt.value })
                    }
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-sand-soft text-forest font-bold"
                        : "text-forest-deep hover:bg-sand-soft/60"
                    }`}
                  >
                    <span>{getSortLabel(opt.value)}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-forest" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* BOTTOM ROW: Category Tabs & Result Count */}
      <div className="flex items-center justify-between gap-4 border-b border-hairline pb-4 overflow-x-auto">
        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <button
            type="button"
            onClick={() => updateQuery({ category: null })}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              currentCategory === "all"
                ? "bg-forest text-sand shadow-xs"
                : "bg-white/80 text-mist hover:bg-sand-soft hover:text-forest-deep border border-hairline"
            }`}
          >
            {t?.AllCategories || "All Categories"}
          </button>

          {categories.map((cat) => {
            const isActive = currentCategory === cat._id || currentCategory === cat.name;
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => updateQuery({ category: cat._id })}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-forest text-sand shadow-xs"
                    : "bg-white/80 text-mist hover:bg-sand-soft hover:text-forest-deep border border-hairline"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Results Counter & Reset Filter Button */}
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-xs font-medium text-mist hidden sm:inline">
            <strong className="text-forest-deep font-bold">{totalResults}</strong>{" "}
            {totalResults === 1
              ? t?.ResultCountSingular || "garment found"
              : t?.ResultsCount || "garments found"}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-white/80 px-2.5 py-1 text-xs font-semibold text-mist hover:text-forest hover:bg-sand-soft transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{t?.ResetFilters || "Reset"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

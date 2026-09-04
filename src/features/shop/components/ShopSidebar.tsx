"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, SlidersHorizontal, Sparkles, X } from "lucide-react";

import type { ProductCategory } from "@/helpers/next-fetch/shopActions";
import { SHOP_GENDERS } from "../constants";

interface ShopSidebarProps {
  categories: ProductCategory[];
  totalResults: number;
  lang?: string;
  dict?: any;
}

export function ShopSidebar({
  categories,
  totalResults,
  lang = "en",
  dict,
}: ShopSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentGender = searchParams.get("gender") || "all";
  const currentSort = searchParams.get("sort") || "featured";
  const inStockOnly = searchParams.get("inStock") === "true";

  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  const t = dict?.ShopPage?.Filters;

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

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

  const handleResetFilters = () => {
    router.push(`/${lang}/shop`, { scroll: false });
    setMobileDrawerOpen(false);
  };

  const hasActiveFilters =
    currentCategory !== "all" ||
    currentGender !== "all" ||
    inStockOnly ||
    (currentSort !== "featured" && currentSort !== "") ||
    !!searchParams.get("searchTerm");

  const filterContent = (
    <div className="space-y-8">
      {/* 1. CATEGORIES VERTICAL LIST */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-hairline">
          <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-forest-deep">
            {t?.CategoriesHeading || "Categories"}
          </h3>
          {currentCategory !== "all" && (
            <button
              type="button"
              onClick={() => updateQuery({ category: null })}
              className="text-[11px] font-semibold text-forest hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        <ul className="mt-3.5 space-y-1">
          <li>
            <button
              type="button"
              onClick={() => {
                updateQuery({ category: null });
                setMobileDrawerOpen(false);
              }}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                currentCategory === "all"
                  ? "bg-forest text-sand shadow-sm"
                  : "text-mist hover:bg-sand-soft/80 hover:text-forest-deep"
              }`}
            >
              <span>{t?.AllCategories || "All Products"}</span>
            </button>
          </li>

          {categories.map((cat) => {
            const isActive =
              currentCategory === cat._id || currentCategory === cat.name;
            return (
              <li key={cat._id}>
                <button
                  type="button"
                  onClick={() => {
                    updateQuery({ category: cat._id });
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-forest text-sand shadow-sm"
                      : "text-mist hover:bg-sand-soft/80 hover:text-forest-deep"
                  }`}
                >
                  <span className="truncate pr-2">{cat.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 2. GENDER SEGMENTED SELECTOR */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-hairline">
          <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-forest-deep">
            {t?.GenderHeading || "Gender"}
          </h3>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-sand-soft/60 border border-hairline/60">
          {SHOP_GENDERS.map((g) => {
            const isActive = currentGender === g.value;
            const label =
              t?.Gender?.[g.value as keyof typeof t.Gender] || g.label;
            return (
              <button
                key={g.value}
                type="button"
                onClick={() =>
                  updateQuery({ gender: g.value === "all" ? null : g.value })
                }
                className={`rounded-xl py-2 px-3 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-forest text-sand shadow-xs font-bold"
                    : "text-mist hover:text-forest-deep hover:bg-sand-soft"
                } ${g.value === "all" ? "col-span-2" : ""}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. IN-STOCK TOGGLE */}
      <div className="pt-2">
        <label className="flex items-center justify-between cursor-pointer rounded-2xl border border-hairline bg-sand-soft/40 p-3.5 transition-colors hover:bg-sand-soft/70">
          <span className="text-xs font-semibold text-forest-deep">
            {t?.InStockOnly || "In-stock items only"}
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) =>
              updateQuery({ inStock: e.target.checked ? "true" : null })
            }
            className="h-4 w-4 rounded-md border-hairline text-forest focus:ring-forest/20 cursor-pointer accent-forest"
          />
        </label>
      </div>

      {/* 4. CLEAR FILTERS BUTTON */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleResetFilters}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-hairline bg-white/80 py-2.5 px-4 text-xs font-bold text-mist hover:text-forest hover:bg-sand-soft transition-all shadow-2xs"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{t?.ResetFilters || "Clear All Filters"}</span>
        </button>
      )}

      {/* 5. ETHICAL MISSION CARD */}
      <div className="rounded-3xl border border-forest/15 bg-linear-to-br from-sand-soft/60 to-cream p-5 text-left shadow-2xs">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-2.5 py-1 text-[10px] font-bold text-forest">
          <Sparkles className="h-3 w-3" />
          <span>100% Non-Profit</span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-mist">
          Every purchase directly fuels equity-free micro-grants and clean solar
          power in Haiti.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE FILTER TRIGGER BAR */}
      <div className="lg:hidden flex items-center justify-between mb-6 gap-3">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-hairline bg-white px-4 py-3 text-xs font-bold text-forest-deep shadow-xs"
        >
          <SlidersHorizontal className="h-4 w-4 text-forest" />
          <span>{t?.FilterBtn || "Filters & Categories"}</span>
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-forest" />
          )}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-hairline bg-white text-mist shadow-xs hover:text-forest"
            title="Clear filters"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* DESKTOP STICKY SIDEBAR */}
      <aside className="hidden lg:block lg:col-span-3">
        <div className="sticky top-28 rounded-3xl border border-hairline bg-white/85 p-6 shadow-xs backdrop-blur-md">
          {filterContent}
        </div>
      </aside>

      {/* MOBILE DRAWER MODAL */}
      {mobileDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex lg:hidden"
        >
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-forest-deep/60 backdrop-blur-sm transition-opacity"
          />

          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-cream p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <h2 className="font-display text-base font-bold text-forest-deep">
                {t?.FilterBtn || "Filters"}
              </h2>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close filters"
                className="grid h-8 w-8 place-items-center rounded-full bg-sand-soft text-mist hover:text-forest-deep"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex-1">{filterContent}</div>
          </div>
        </div>
      )}
    </>
  );
}

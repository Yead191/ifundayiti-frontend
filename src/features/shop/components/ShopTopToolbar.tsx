"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Check, ChevronDown, Search, X } from "lucide-react";

import { SHOP_SORT_OPTIONS } from "../constants";
import { buildShopUrl, saveShopScroll, usePreserveScroll } from "../utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface ShopTopToolbarProps {
  totalResults: number;
  lang?: string;
  dict?: any;
}

export function ShopTopToolbar({
  totalResults,
  lang = "en",
  dict,
}: ShopTopToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentGender = searchParams.get("gender") || "all";
  const currentSearch = searchParams.get("searchTerm") || "";
  const currentSort = searchParams.get("sort") || "featured";
  const inStockOnly = searchParams.get("inStock") === "true";

  const [searchInput, setSearchInput] = React.useState(currentSearch);

  React.useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Keep scroll position preserved across searches
  usePreserveScroll(searchParams);

  const t = dict?.ShopPage?.Filters;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveShopScroll();
    const targetUrl = buildShopUrl(lang, searchParams, {
      searchTerm: searchInput.trim() || null,
    });
    router.replace(targetUrl, { scroll: false });
  };

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

  const currentSortObj =
    SHOP_SORT_OPTIONS.find((s) => s.value === currentSort) ||
    SHOP_SORT_OPTIONS[0];

  return (
    <div className="space-y-4">
      {/* Search Input & Sort Dropdown Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t?.SearchPlaceholder || "Search by title, tag, fabric..."}
            className="h-11 w-full rounded-2xl border-hairline bg-white/90 pl-10 pr-9 text-xs sm:text-sm shadow-2xs focus-visible:ring-forest/20"
          />
          {searchInput && (
            <Link
              href={buildShopUrl(lang, searchParams, { searchTerm: null })}
              scroll={false}
              prefetch={true}
              replace={true}
              onClick={() => {
                saveShopScroll();
                setSearchInput("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-forest-deep"
            >
              <X className="h-3.5 w-3.5" />
            </Link>
          )}
        </form>

        {/* Sort & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs font-semibold text-mist hidden md:inline">
            <strong className="text-forest-deep font-bold">{totalResults}</strong>{" "}
            {totalResults === 1
              ? t?.ResultCountSingular || "product found"
              : t?.ResultsCount || "products found"}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-hairline bg-white px-3.5 text-xs font-semibold text-forest-deep shadow-2xs transition-all hover:bg-sand-soft/50 focus:outline-none"
              >
                <ArrowUpDown className="h-3.5 w-3.5 text-forest" />
                <span className="text-mist font-normal hidden sm:inline">
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
                  <DropdownMenuItem key={opt.value} asChild>
                    <Link
                      href={buildShopUrl(lang, searchParams, {
                        sort: opt.value === "featured" ? null : opt.value,
                      })}
                      scroll={false}
                      prefetch={true}
                      replace={true}
                      onClick={saveShopScroll}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-sand-soft text-forest font-bold"
                          : "text-forest-deep hover:bg-sand-soft/60"
                      }`}
                    >
                      <span>{getSortLabel(opt.value)}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-forest" />}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(currentCategory !== "all" ||
        currentGender !== "all" ||
        inStockOnly ||
        currentSearch) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mist mr-1">
            Active:
          </span>

          {currentCategory !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-forest/20 bg-forest/10 px-3 py-1 text-xs font-bold text-forest">
              <span>Category</span>
              <Link
                href={buildShopUrl(lang, searchParams, { category: null })}
                scroll={false}
                prefetch={true}
                replace={true}
                onClick={saveShopScroll}
                className="rounded-full hover:bg-forest/20 p-0.5"
              >
                <X className="h-3 w-3" />
              </Link>
            </span>
          )}

          {currentGender !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-forest/20 bg-forest/10 px-3 py-1 text-xs font-bold text-forest capitalize">
              <span>{currentGender}</span>
              <Link
                href={buildShopUrl(lang, searchParams, { gender: null })}
                scroll={false}
                prefetch={true}
                replace={true}
                onClick={saveShopScroll}
                className="rounded-full hover:bg-forest/20 p-0.5"
              >
                <X className="h-3 w-3" />
              </Link>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-forest/20 bg-forest/10 px-3 py-1 text-xs font-bold text-forest">
              <span>In Stock</span>
              <Link
                href={buildShopUrl(lang, searchParams, { inStock: null })}
                scroll={false}
                prefetch={true}
                replace={true}
                onClick={saveShopScroll}
                className="rounded-full hover:bg-forest/20 p-0.5"
              >
                <X className="h-3 w-3" />
              </Link>
            </span>
          )}

          {currentSearch && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-forest/20 bg-forest/10 px-3 py-1 text-xs font-bold text-forest">
              <span>"{currentSearch}"</span>
              <Link
                href={buildShopUrl(lang, searchParams, { searchTerm: null })}
                scroll={false}
                prefetch={true}
                replace={true}
                onClick={() => {
                  saveShopScroll();
                  setSearchInput("");
                }}
                className="rounded-full hover:bg-forest/20 p-0.5"
              >
                <X className="h-3 w-3" />
              </Link>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

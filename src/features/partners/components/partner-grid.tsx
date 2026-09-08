"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Building2, X, Sparkles } from "lucide-react";

import type { Partner, Pagination } from "@/types";
import { Reveal } from "@/components/ui/reveal";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { PartnerCard } from "@/features/partners/components/partner-card";
import { buildPartnersHref } from "@/features/partners/query";

export function PartnerGrid({
  partners,
  pagination,
  lang = "en",
  dict,
}: {
  partners: Partner[];
  pagination?: Pagination;
  lang?: string;
  dict?: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("q") || "";
  const currentOffer = searchParams.get("offer") || "all";
  const [searchInput, setSearchInput] = React.useState(currentSearch);

  // Sync state when URL params change
  React.useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.replace(
      buildPartnersHref(1, pagination?.limit || 12, searchInput, currentOffer, lang),
      { scroll: false }
    );
  };

  const handleOfferSelect = (offer: string) => {
    router.replace(
      buildPartnersHref(1, pagination?.limit || 12, searchInput, offer, lang),
      { scroll: false }
    );
  };

  const handleClearSearch = () => {
    setSearchInput("");
    router.replace(
      buildPartnersHref(1, pagination?.limit || 12, "", currentOffer, lang),
      { scroll: false }
    );
  };

  const handlePageChange = (page: number) => {
    router.replace(
      buildPartnersHref(page, pagination?.limit || 12, searchInput, currentOffer, lang),
      { scroll: true }
    );
  };

  const tFilter = dict?.PartnersPage?.Filter || {};
  const tEmpty = dict?.PartnersPage?.Empty || {};

  // Standard partnership offer areas
  const offerCategories = [
    { key: "all", label: tFilter.AllOffers || "All Areas" },
    { key: "Co-marketing", label: "Co-marketing" },
    { key: "Community Outreach", label: "Community Outreach" },
    { key: "Event Sponsorship", label: "Event Sponsorship" },
    { key: "Mentorship", label: "Mentorship" },
    { key: "Grants Co-funding", label: "Grants Co-funding" },
  ];

  return (
    <div className="w-full">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 max-w-md"
        >
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={tFilter.SearchPlaceholder || "Search partners by name..."}
            className="h-11 w-full rounded-2xl border border-hairline bg-white/90 pl-10 pr-9 text-sm text-forest-deep placeholder:text-mist/70 shadow-2xs backdrop-blur-sm transition-all focus:border-forest/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-mist hover:bg-sand-soft hover:text-forest-deep"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Results Count */}
        {pagination?.total != null && (
          <div className="text-xs font-semibold text-mist">
            {pagination.total} {pagination.total === 1 ? "partner" : "partners"} found
          </div>
        )}
      </div>

      {/* Offer Filter Pills */}
      <div className="mt-4 flex flex-wrap gap-2 pb-2">
        {offerCategories.map((cat) => {
          const active = currentOffer === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => handleOfferSelect(cat.key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                active
                  ? "bg-forest text-white shadow-xs"
                  : "border border-hairline/80 bg-white/70 text-forest-deep hover:border-forest/20 hover:bg-sand-soft/60"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Partner Cards Grid */}
      {partners.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-forest/20 bg-white/60 px-6 py-16 text-center backdrop-blur-sm">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sand-soft text-forest">
            <Building2 className="h-6 w-6" />
          </span>
          <h3 className="mt-4 font-display text-xl font-bold text-forest-deep">
            {tEmpty.Title || "No partners found"}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-mist">
            {tEmpty.Description ||
              "We couldn't find any partners matching your search. Try adjusting your query or check back soon."}
          </p>
          {(searchInput || currentOffer !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                router.replace(buildPartnersHref(1, pagination?.limit || 12, "", "all", lang));
              }}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-forest px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-forest/90"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {partners.map((partner, i) => (
              <Reveal key={partner._id} delay={Math.min(i * 35, 200)}>
                <PartnerCard partner={partner} lang={lang} />
              </Reveal>
            ))}
          </div>

          {pagination && pagination.totalPage > 1 && (
            <div className="mt-10">
              <PaginationControls
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PartnerCardsSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-64 animate-pulse rounded-2xl border border-hairline bg-white/50 p-5"
        />
      ))}
    </div>
  );
}

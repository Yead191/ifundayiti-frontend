"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  MapPin,
  Search,
  ArrowUpDown,
  RotateCcw,
  X,
  BadgeDollarSign,
  ChevronRight,
  Filter,
} from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import { formatPrice } from "@/lib/utils";
import { FinalistModal } from "./finalist-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { useTranslation } from "@/components/providers/translation-provider";

interface FinalistsClientProps {
  periods: any[];
  finalists: any[];
  initialPeriodId?: string;
  lang?: string;
}

export function FinalistsClient({
  periods,
  finalists,
  initialPeriodId = "all",
  lang = "en",
}: FinalistsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(
    searchParams.get("period") || initialPeriodId || "all"
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [selectedFinalist, setSelectedFinalist] = useState<any | null>(null);

  const dict = useTranslation();
  const t = dict.FinalistsPage;

  // Handle cycle/period change & URL synchronization
  const handlePeriodChange = (value: string) => {
    setSelectedPeriodId(value);
    const newUrl =
      value === "all"
        ? `/${lang}/finalists`
        : `/${lang}/finalists?period=${value}`;
    window.history.replaceState(null, "", newUrl);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedPeriodId("all");
    setSearchQuery("");
    setSortOption("newest");
    window.history.replaceState(null, "", `/${lang}/finalists`);
  };

  const isFiltered =
    selectedPeriodId !== "all" ||
    searchQuery.trim() !== "" ||
    sortOption !== "newest";

  // Filter and sort finalists
  const filteredFinalists = useMemo(() => {
    let list = [...finalists];

    // Filter by period
    if (selectedPeriodId !== "all") {
      list = list.filter((f) => {
        const periodId = f.applicationPeriod?._id || f.applicationPeriod;
        return String(periodId) === String(selectedPeriodId);
      });
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((f) => {
        const name = f.personal?.name?.toLowerCase() || "";
        const project = f.grant?.projectName?.toLowerCase() || "";
        const location = f.personal?.location?.toLowerCase() || "";
        const occupation = f.background?.occupation?.toLowerCase() || "";
        const periodTitle = f.applicationPeriod?.title?.toLowerCase() || "";
        return (
          name.includes(q) ||
          project.includes(q) ||
          location.includes(q) ||
          occupation.includes(q) ||
          periodTitle.includes(q)
        );
      });
    }

    // Sort list
    list.sort((a, b) => {
      switch (sortOption) {
        case "oldest":
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );
        case "name-asc":
          return (a.personal?.name || "").localeCompare(b.personal?.name || "");
        case "name-desc":
          return (b.personal?.name || "").localeCompare(a.personal?.name || "");
        case "project-asc":
          return (a.grant?.projectName || "").localeCompare(
            b.grant?.projectName || ""
          );
        case "amount-desc":
          return (
            (Number(b.grant?.requestedAmount) || 0) -
            (Number(a.grant?.requestedAmount) || 0)
          );
        case "newest":
        default:
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
      }
    });

    return list;
  }, [finalists, selectedPeriodId, searchQuery, sortOption]);

  return (
    <div className="w-full">
      {/* Filter and Controls Toolbar */}
      <div className="mb-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-hairline shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-forest-deep flex items-center gap-2.5">
              <span>{t.Client.Heading || "All Finalists"}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest/10 text-forest">
                {filteredFinalists.length}
              </span>
            </h2>
            <p className="text-sm text-mist mt-1">
              {t.Client.Subheading ||
                "Browse and discover outstanding applicants across all grant cycles."}
            </p>
          </div>

          {/* Active status indicator & reset */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 self-start md:self-center px-3.5 py-1.5 rounded-xl border border-hairline bg-sand-soft/50 hover:bg-sand-soft text-forest-deep text-xs font-semibold transition-all hover:scale-102 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-forest" />
              <span>{t.Client.ResetFilters || "Reset Filters"}</span>
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-2 border-t border-hairline/60">
          {/* Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                t.Client.SearchPlaceholder ||
                "Search by name, project, or location..."
              }
              className="w-full h-11 pl-10 pr-9 rounded-xl bg-sand-soft/25 border border-hairline text-sm text-forest-deep placeholder:text-mist/70 focus:outline-none focus:border-forest/40 focus:ring-2 focus:ring-forest/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-forest-deep p-0.5 rounded-full hover:bg-sand-soft transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Period Filter Dropdown */}
          <div className="sm:col-span-1 lg:col-span-4">
            <Select value={selectedPeriodId} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-full h-11 bg-sand-soft/25 border-hairline rounded-xl text-forest-deep text-sm font-medium">
                <div className="flex items-center gap-2 truncate">
                  <Calendar className="h-4 w-4 text-forest/70 shrink-0" />
                  <SelectValue
                    placeholder={
                      t.Client.SelectTriggerPlaceholder || "Select a period"
                    }
                  />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border border-hairline shadow-xl rounded-xl z-50">
                <SelectItem
                  value="all"
                  className="cursor-pointer font-medium text-forest-deep"
                >
                  {t.Client.AllCycles || "All Grant Cycles"}
                </SelectItem>
                {periods.map((period) => (
                  <SelectItem
                    key={period._id}
                    value={period._id}
                    className="cursor-pointer text-forest-deep"
                  >
                    {period.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Dropdown */}
          <div className="sm:col-span-1 lg:col-span-3">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full h-11 bg-sand-soft/25 border-hairline rounded-xl text-forest-deep text-sm font-medium">
                <div className="flex items-center gap-2 truncate">
                  <ArrowUpDown className="h-4 w-4 text-forest/70 shrink-0" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border border-hairline shadow-xl rounded-xl z-50">
                <SelectItem value="newest" className="cursor-pointer">
                  {t.Client.SortNewest || "Newest First"}
                </SelectItem>
                <SelectItem value="oldest" className="cursor-pointer">
                  {t.Client.SortOldest || "Oldest First"}
                </SelectItem>
                <SelectItem value="name-asc" className="cursor-pointer">
                  {t.Client.SortNameAsc || "Name (A - Z)"}
                </SelectItem>
                <SelectItem value="name-desc" className="cursor-pointer">
                  {t.Client.SortNameDesc || "Name (Z - A)"}
                </SelectItem>
                <SelectItem value="project-asc" className="cursor-pointer">
                  {t.Client.SortProjectAsc || "Project (A - Z)"}
                </SelectItem>
                <SelectItem value="amount-desc" className="cursor-pointer">
                  {t.Client.SortAmountDesc || "Highest Amount"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content Rendering */}
      {finalists.length === 0 ? (
        <EmptyState
          title={t.Client.EmptyTitle}
          body={t.Client.EmptyBody}
          actionLabel={t.EmptyState.ActionLabel}
          actionHref={`/${lang}/grants`}
        />
      ) : filteredFinalists.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white/60 rounded-3xl border border-hairline">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-forest/10 text-forest mb-4">
            <Filter className="h-7 w-7" />
          </div>
          <h3 className="font-display text-2xl text-forest-deep mb-2">
            {t.Client.NoMatchTitle || "No matching finalists found"}
          </h3>
          <p className="text-sm text-mist max-w-md mx-auto mb-6">
            {t.Client.NoMatchBody ||
              "Try adjusting your search terms or filter selections to find what you are looking for."}
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-deep text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t.Client.ResetFilters || "Reset Filters"}</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFinalists.map((f: any) => (
            <button
              key={f._id}
              onClick={() => setSelectedFinalist(f)}
              className="group text-left flex flex-col overflow-hidden rounded-4xl bg-white border border-hairline hover:border-forest/20 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-4/3 overflow-hidden w-full">
                <Image
                  src={getImageUrl(f.personal?.image) || ""}
                  alt={f.personal?.name || "Finalist"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-forest-deep tracking-wider shadow-sm">
                  <Calendar className="h-3.5 w-3.5 text-forest" />
                  <span>
                    {f.applicationPeriod?.title || "Grant Finalist"}
                  </span>
                </div>

                {f.grant?.requestedAmount ? (
                  <div className="absolute top-4 right-4 bg-forest/90 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1 text-xs font-semibold text-sand tracking-wider shadow-sm">
                    <BadgeDollarSign className="h-3.5 w-3.5" />
                    <span>{formatPrice(f.grant.requestedAmount)}</span>
                  </div>
                ) : null}
              </div>

              <div className="p-8 flex flex-col flex-1 w-full justify-between">
                <div>
                  <h3 className="font-display text-2xl text-forest-deep group-hover:text-forest transition-colors line-clamp-1">
                    {f.personal?.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-forest/80 line-clamp-2">
                    {f.grant?.projectName}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-hairline flex items-center justify-between text-mist text-sm">
                  <div className="flex items-center gap-1.5 truncate max-w-[65%]">
                    <MapPin className="h-4 w-4 shrink-0 text-forest/70" />
                    <span className="truncate">{f.personal?.location}</span>
                  </div>
                  <div className="text-forest font-medium text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>{t.Client.ViewDetails || "View Details"}</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Modal View */}
      <FinalistModal
        open={!!selectedFinalist}
        onClose={() => setSelectedFinalist(null)}
        finalist={selectedFinalist}
        lang={lang}
      />
    </div>
  );
}

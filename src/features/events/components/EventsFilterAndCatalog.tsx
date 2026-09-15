"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  Filter,
  Grid,
  Search,
  Sparkles,
  Ticket,
  Video,
  X,
} from "lucide-react";
import { type IEvent, type EventCategory, type EventType } from "@/helpers/next-fetch/eventActions";
import { EventCard } from "./EventCard";
import { EventsCalendar } from "@/components/events/events-calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EventsFilterAndCatalogProps {
  events: IEvent[];
  lang: string;
}

const CATEGORIES: { id: EventCategory | "all"; label: string }[] = [
  { id: "all", label: "All Gatherings" },
  { id: "gala", label: "Gala & Banquets" },
  { id: "fundraiser", label: "Fundraisers" },
  { id: "pitch-night", label: "Pitch Nights" },
  { id: "workshop", label: "Workshops" },
];

const FORMATS: { id: EventType | "all"; label: string; icon?: React.ElementType }[] = [
  { id: "all", label: "All Formats" },
  { id: "physical", label: "In-Person" },
  { id: "virtual", label: "Virtual Stream", icon: Video },
  { id: "hybrid", label: "Hybrid" },
];

export function EventsFilterAndCatalog({
  events,
  lang,
}: EventsFilterAndCatalogProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<EventCategory | "all">("all");
  const [selectedFormat, setSelectedFormat] = React.useState<EventType | "all">("all");
  const [selectedPricing, setSelectedPricing] = React.useState<"all" | "free" | "paid">("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "calendar">("calendar");

  // Client filter
  const filteredEvents = React.useMemo(() => {
    return events.filter((evt) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = evt.title?.toLowerCase().includes(query);
        const matchesDesc = evt.description?.toLowerCase().includes(query);
        const matchesLoc = evt.location?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
      }

      // Category
      if (selectedCategory !== "all" && evt.category !== selectedCategory) {
        return false;
      }

      // Format / Type
      if (selectedFormat !== "all" && evt.type !== selectedFormat) {
        return false;
      }

      // Pricing
      if (selectedPricing === "free") {
        if (evt.pricingType !== "free" && evt.price && evt.price > 0) return false;
      } else if (selectedPricing === "paid") {
        if (evt.pricingType === "free" || !evt.price || evt.price === 0) return false;
      }

      return true;
    });
  }, [events, searchTerm, selectedCategory, selectedFormat, selectedPricing]);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedFormat !== "all" ||
    selectedPricing !== "all";

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedFormat("all");
    setSelectedPricing("all");
  }

  return (
    <div className="space-y-8">
      {/* FILTER & VIEW CONTROLS TOOLBAR */}
      <div className="rounded-3xl border border-hairline/90 bg-white p-5 sm:p-7 shadow-sm space-y-5">
        {/* Top Row: Search & View Switcher */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, keynote, city..."
              className="h-11 rounded-2xl border-hairline bg-sand-soft/30 pl-10 pr-9 text-xs sm:text-sm text-forest-deep placeholder:text-mist focus-visible:ring-forest"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-forest-deep cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* View Switcher Pills */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto rounded-2xl border border-hairline bg-sand-soft/50 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-forest-deep shadow-xs"
                  : "text-mist hover:text-forest-deep"
              }`}
            >
              <Grid className="h-3.5 w-3.5" />
              <span>Cards Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 transition-all cursor-pointer ${
                viewMode === "calendar"
                  ? "bg-white text-forest-deep shadow-xs"
                  : "text-mist hover:text-forest-deep"
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Interactive Calendar</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-t border-hairline/60 pt-4">
          <span className="text-xs font-semibold text-mist mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Category:
          </span>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-forest text-white shadow-xs"
                    : "border border-hairline bg-sand-soft/40 text-forest-deep hover:bg-sand-soft hover:border-forest/30"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Format & Pricing Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline/60 pt-4 text-xs">
          {/* Format pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-mist mr-1 font-medium">Format:</span>
            {FORMATS.map((fmt) => {
              const active = selectedFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={`rounded-xl px-3 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-forest-deep text-white"
                      : "border border-hairline bg-white text-mist hover:text-forest-deep hover:bg-sand-soft"
                  }`}
                >
                  {fmt.label}
                </button>
              );
            })}
          </div>

          {/* Pricing pills & Results count */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-mist mr-1 font-medium">Pricing:</span>
              {[
                { id: "all", label: "All" },
                { id: "free", label: "Free RSVP" },
                { id: "paid", label: "Paid" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPricing(p.id as any)}
                  className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                    selectedPricing === p.id
                      ? "bg-forest-deep text-white"
                      : "border border-hairline bg-white text-mist hover:text-forest-deep hover:bg-sand-soft"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-forest underline hover:text-forest-deep cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RESULTS COUNT BANNER */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-mist">
          Showing <span className="text-forest-deep font-bold">{filteredEvents.length}</span>{" "}
          {filteredEvents.length === 1 ? "gathering" : "gatherings"}
          {hasActiveFilters && " matching your criteria"}
        </p>
      </div>

      {/* VIEW CONTENT */}
      {viewMode === "grid" ? (
        filteredEvents.length === 0 ? (
          <div className="rounded-3xl border border-hairline bg-white p-12 text-center space-y-3">
            <CalendarIcon className="mx-auto h-12 w-12 text-mist/60" />
            <h3 className="font-display text-xl font-bold text-forest-deep">
              No matching events found
            </h3>
            <p className="text-xs text-mist max-w-sm mx-auto">
              We couldn't find any gatherings matching your current filter selections. Try clearing your search query or filters.
            </p>
            {hasActiveFilters && (
              <div className="pt-2">
                <Button onClick={clearFilters} variant="outline" className="rounded-xl">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((evt) => (
              <EventCard key={evt._id} event={evt} lang={lang} />
            ))}
          </div>
        )
      ) : (
        /* CALENDAR VIEW */
        <EventsCalendar
          lang={lang}
          apiEvents={filteredEvents}
          categoryFilter={selectedCategory}
          onCategoryChange={setSelectedCategory}
          hideCategoryFilter={true}
        />
      )}
    </div>
  );
}

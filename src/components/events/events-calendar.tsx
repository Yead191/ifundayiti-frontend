"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Heart,
  Info,
  Layers,
  MapPin,
  Sparkles,
  Users,
  Video,
  X,
} from "lucide-react";

import { cn, formatPrice } from "@/lib/utils";
import {
  EVENT_CATEGORIES,
  MOCK_EVENTS,
  type EventCategory,
  type EventItem,
} from "@/data/events";
import { Button } from "@/components/ui/button";
import { EventDetailModal } from "@/components/events/event-detail-modal";
import { Modal } from "@/components/ui/modal";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function EventsCalendar() {
  // Dynamically start at the real current date (e.g. today's month & year)
  const [currentDate, setCurrentDate] = React.useState(() => new Date());
  const [selectedCategory, setSelectedCategory] = React.useState<EventCategory | "all">("all");
  const [selectedEvent, setSelectedEvent] = React.useState<EventItem | null>(MOCK_EVENTS[0]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"month" | "list">("month");

  // Day picker modal when a day has multiple events
  const [selectedDayEvents, setSelectedDayEvents] = React.useState<{
    dateStr: string;
    events: EventItem[];
  } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Dynamic today ISO string (YYYY-MM-DD)
  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  const filteredEvents = MOCK_EVENTS.filter((evt) => {
    if (selectedCategory === "all") return true;
    return evt.category === selectedCategory;
  });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarCells = React.useMemo(() => {
    const cells: { dateStr: string; dayNum: number; currentMonth: boolean }[] = [];

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, day);
      const dateStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({ dateStr, dayNum: day, currentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const mStr = String(month + 1).padStart(2, "0");
      const dStr = String(day).padStart(2, "0");
      const dateStr = `${year}-${mStr}-${dStr}`;
      cells.push({ dateStr, dayNum: day, currentMonth: true });
    }

    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let day = 1; day <= remaining; day++) {
        const nextDate = new Date(year, month + 1, day);
        const dateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        cells.push({ dateStr, dayNum: day, currentMonth: false });
      }
    }

    return cells;
  }, [year, month, firstDayOfMonth, daysInMonth, prevMonthDays]);

  function getEventsForDate(dateStr: string) {
    return filteredEvents.filter((evt) => evt.date === dateStr);
  }

  function handleEventClick(evt: EventItem) {
    setSelectedEvent(evt);
    setModalOpen(true);
  }

  function getCategoryBadgeColor(cat: EventCategory) {
    switch (cat) {
      case "fundraiser":
        return "bg-amber-600 text-white";
      case "pitch-night":
        return "bg-violet-600 text-white";
      case "workshop":
        return "bg-emerald-600 text-white";
      case "gala":
        return "bg-rose-600 text-white";
      default:
        return "bg-forest text-white";
    }
  }

  function renderFormatIcon(type: "physical" | "virtual" | "hybrid") {
    if (type === "virtual") return <Video className="h-3 w-3 text-blue-500 shrink-0" />;
    if (type === "hybrid") return <Video className="h-3 w-3 text-purple-500 shrink-0" />;
    return <MapPin className="h-3 w-3 text-forest shrink-0" />;
  }

  return (
    <div className="space-y-8">
      {/* FILTER & NAVIGATION CONTROLS */}
      <div className="flex flex-col gap-4 rounded-3xl border border-hairline bg-white p-4 sm:p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {EVENT_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer",
                  active
                    ? "bg-forest text-white shadow-xs"
                    : "border border-hairline bg-sand-soft/50 text-forest-deep hover:border-forest/40 hover:bg-sand-soft",
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* View Switcher & Month Navigation */}
        <div className="flex items-center justify-between lg:justify-end gap-3 border-t border-hairline pt-3 lg:border-t-0 lg:pt-0">
          <div className="flex rounded-full border border-hairline bg-sand-soft/50 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("month")}
              className={cn(
                "rounded-full px-3.5 py-1.5 transition-all cursor-pointer",
                viewMode === "month" ? "bg-white text-forest-deep shadow-xs" : "text-mist",
              )}
            >
              Month Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded-full px-3.5 py-1.5 transition-all cursor-pointer",
                viewMode === "list" ? "bg-white text-forest-deep shadow-xs" : "text-mist",
              )}
            >
              List Feed
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="grid h-9 w-9 place-items-center rounded-full border border-hairline bg-white text-forest hover:bg-sand-soft cursor-pointer transition"
              aria-label="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-28 text-center font-display text-base font-bold text-forest-deep">
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="grid h-9 w-9 place-items-center rounded-full border border-hairline bg-white text-forest hover:bg-sand-soft cursor-pointer transition"
              aria-label="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2-COLUMN MAIN LAYOUT */}
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* LEFT COLUMN: MONTH GRID OR LIST */}
        <div className="lg:col-span-8">
          {viewMode === "month" ? (
            <div className="overflow-hidden rounded-3xl border border-hairline bg-white shadow-md">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-hairline bg-sand-soft/60 py-3 text-center text-xs font-bold uppercase tracking-wider text-forest">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7 divide-x divide-y divide-hairline">
                {calendarCells.map((cell) => {
                  const evts = getEventsForDate(cell.dateStr);
                  const isToday = cell.dateStr === todayStr;
                  const hasMultiple = evts.length >= 2;

                  return (
                    <div
                      key={cell.dateStr}
                      className={cn(
                        "min-h-32 p-1.5 sm:p-2 transition-colors flex flex-col justify-between",
                        cell.currentMonth
                          ? "bg-white hover:bg-sand-soft/20"
                          : "bg-sand-soft/30 text-faint",
                      )}
                    >
                      {/* Cell Header Number & Counter */}
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                            isToday
                              ? "bg-forest text-white shadow-xs ring-2 ring-forest/30"
                              : cell.currentMonth
                                ? "text-forest-deep"
                                : "text-faint",
                          )}
                        >
                          {cell.dayNum}
                        </span>

                        {hasMultiple && (
                          <button
                            type="button"
                            onClick={() => setSelectedDayEvents({ dateStr: cell.dateStr, events: evts })}
                            className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-1.5 py-0.5 text-[10px] font-bold text-forest hover:bg-forest hover:text-white transition-colors cursor-pointer"
                            title="View all events on this day"
                          >
                            <Layers className="h-3 w-3" />
                            {evts.length} events
                          </button>
                        )}
                      </div>

                      {/* Stacked Event Pills inside Cell */}
                      <div className="mt-1 space-y-1.5 overflow-hidden">
                        {evts.slice(0, 2).map((evt) => (
                          <button
                            key={evt.id}
                            type="button"
                            onClick={() => handleEventClick(evt)}
                            className={cn(
                              "w-full rounded-lg p-1.5 text-left transition-all cursor-pointer block hover:opacity-90 shadow-2xs",
                              getCategoryBadgeColor(evt.category),
                            )}
                            title={evt.title}
                          >
                            <div className="flex items-center gap-1 text-[10px] opacity-90">
                              {renderFormatIcon(evt.eventType)}
                              <span className="font-semibold">{evt.time.split("–")[0]}</span>
                            </div>
                            <span className="block text-[11px] font-bold truncate leading-tight mt-0.5">
                              {evt.title}
                            </span>
                          </button>
                        ))}

                        {evts.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setSelectedDayEvents({ dateStr: cell.dateStr, events: evts })}
                            className="w-full text-center text-[10px] font-semibold text-forest hover:underline pt-0.5 cursor-pointer"
                          >
                            +{evts.length - 2} more events
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* LIST FEED VIEW */
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="rounded-3xl border border-hairline bg-white p-12 text-center">
                  <CalendarIcon className="mx-auto h-10 w-10 text-mist mb-3" />
                  <p className="font-display text-xl text-forest-deep">No events found</p>
                  <p className="text-xs text-mist mt-1">Try clearing your category filter to browse all upcoming drives.</p>
                </div>
              ) : (
                filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => handleEventClick(evt)}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-hairline bg-white p-5 shadow-xs transition-all hover:shadow-md cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-sand-soft">
                        <Image
                          src={evt.image}
                          alt={evt.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            getCategoryBadgeColor(evt.category)
                          )}>
                            {evt.category.replace("-", " ")}
                          </span>
                          {evt.eventType === "virtual" && (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Video className="h-3 w-3" /> Zoom
                            </span>
                          )}
                          {evt.eventType === "hybrid" && (
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Video className="h-3 w-3" /> Hybrid
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-lg font-semibold text-forest-deep group-hover:text-forest transition-colors truncate">
                          {evt.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-mist">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-3.5 w-3.5 text-forest" />
                            {evt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-forest" />
                            {evt.time}
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="h-3.5 w-3.5 text-forest" />
                            {evt.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button size="sm" variant="outline" className="rounded-xl shrink-0">
                      View Event →
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: STICKY SPOTLIGHT & CENTRAL FUND NOTE */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-28 space-y-6">
            {selectedEvent ? (
              <div className="rounded-3xl border border-hairline bg-white p-6 shadow-md space-y-5">
                <div className="flex items-center justify-between border-b border-hairline pb-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">
                    Event Spotlight
                  </p>
                  <span className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    getCategoryBadgeColor(selectedEvent.category)
                  )}>
                    {selectedEvent.category.replace("-", " ")}
                  </span>
                </div>

                <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-sand-soft">
                  <Image
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                  />
                  {selectedEvent.eventType === "virtual" && (
                    <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold text-white shadow-md">
                      <Video className="h-3 w-3" /> Zoom Virtual
                    </span>
                  )}
                  {selectedEvent.eventType === "hybrid" && (
                    <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-purple-600 px-3 py-1 text-[10px] font-bold text-white shadow-md">
                      <Video className="h-3 w-3" /> Hybrid Event
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-forest-deep leading-snug">
                    {selectedEvent.title}
                  </h3>
                  <div className="mt-3 space-y-1.5 text-xs text-mist">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-forest shrink-0" />
                      <span className="font-semibold text-forest-deep">{selectedEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-forest shrink-0" />
                      <span>{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedEvent.eventType === "virtual" ? (
                        <Video className="h-4 w-4 text-blue-600 shrink-0" />
                      ) : (
                        <MapPin className="h-4 w-4 text-forest shrink-0" />
                      )}
                      <span className="truncate">{selectedEvent.location}</span>
                    </div>
                  </div>
                </div>

                {/* Central Fund Clarification Box */}
                <div className="rounded-2xl border border-hairline bg-sand-soft/50 p-3.5 text-xs text-forest-deep leading-relaxed flex items-start gap-2">
                  <Info className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                  <p>
                    <strong>Central Organization Fund:</strong> All event fundraising benefits the central IFundAyiti Program Fund, allocated to verified grant winners.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-1">
                  <Button
                    onClick={() => setModalOpen(true)}
                    className="w-full rounded-xl"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    RSVP for Event ({selectedEvent.rsvpCount} Registered)
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-xl"
                  >
                    <Link href="/donate">
                      <Heart className="mr-2 h-4 w-4 text-forest" />
                      Donate to IFundAyiti Program Fund
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-hairline bg-white p-6 text-center text-mist">
                Select an event from the calendar grid to view spotlight details.
              </div>
            )}

            {/* Upcoming Drives List */}
            <div className="rounded-3xl border border-hairline bg-sand-soft/60 p-6">
              <div className="flex items-center gap-2 text-forest mb-4">
                <Sparkles className="h-4 w-4" />
                <h4 className="font-display text-sm font-semibold text-forest-deep">
                  Upcoming Community Drives
                </h4>
              </div>

              <div className="space-y-3 divide-y divide-hairline">
                {MOCK_EVENTS.slice(0, 3).map((evt) => (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => {
                      setSelectedEvent(evt);
                      setModalOpen(true);
                    }}
                    className="pt-3 first:pt-0 w-full text-left group flex justify-between items-center gap-3 cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-semibold text-forest-deep group-hover:text-forest transition-colors line-clamp-1">
                        {evt.title}
                      </p>
                      <p className="text-[11px] text-mist">{evt.date} · {evt.location.split("&")[0]}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-mist group-hover:text-forest shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MULTIPLE EVENTS DAY OVERVIEW POPUP MODAL */}
      {selectedDayEvents && (
        <Modal
          open={!!selectedDayEvents}
          onClose={() => setSelectedDayEvents(null)}
          className="max-w-md p-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-forest-deep">
                  Events on {selectedDayEvents.dateStr}
                </h3>
                <p className="text-xs text-mist">
                  {selectedDayEvents.events.length} events scheduled for this day
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {selectedDayEvents.events.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => {
                    setSelectedDayEvents(null);
                    setSelectedEvent(evt);
                    setModalOpen(true);
                  }}
                  className="rounded-2xl border border-hairline bg-sand-soft/30 p-3.5 hover:bg-sand-soft transition cursor-pointer flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold uppercase", getCategoryBadgeColor(evt.category))}>
                        {evt.category.replace("-", " ")}
                      </span>
                      <span className="text-[11px] text-forest font-semibold">{evt.time}</span>
                    </div>
                    <h4 className="font-display text-sm font-semibold text-forest-deep">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-mist truncate mt-0.5">{evt.location}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-mist shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* EVENT DETAIL & RSVP MODAL */}
      <EventDetailModal
        event={selectedEvent}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

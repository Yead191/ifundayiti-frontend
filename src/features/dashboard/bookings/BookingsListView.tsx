"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Ticket,
  Search,
  Calendar,
  CalendarCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";

import type { IUserBooking } from "@/helpers/next-fetch/bookingActions";
import { BookingCard } from "./BookingCard";
import { Button } from "@/components/ui/button";

interface BookingsListViewProps {
  bookings: IUserBooking[];
  lang?: string;
}

type FilterTab = "all" | "upcoming" | "past" | "cancelled";

export function BookingsListView({
  bookings = [],
  lang = "en",
}: BookingsListViewProps) {
  const isHt = lang === "ht";
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const now = useMemo(() => new Date(), []);

  // Filter logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const event = b.event;
      const startDate = event?.startDate ? new Date(event.startDate) : null;
      const endDate = event?.endDate ? new Date(event.endDate) : startDate;

      // Status tab condition
      if (activeTab === "cancelled") {
        if (b.status !== "cancelled") return false;
      } else if (activeTab === "upcoming") {
        if (b.status === "cancelled") return false;
        if (endDate && endDate < now) return false;
      } else if (activeTab === "past") {
        if (b.status === "cancelled") return false;
        if (endDate && endDate >= now && !b.checkedIn) return false;
      }

      // Search condition
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const titleMatch = event?.title?.toLowerCase().includes(q) || false;
        const locationMatch =
          event?.location?.toLowerCase().includes(q) ||
          event?.venueAddress?.toLowerCase().includes(q) ||
          false;
        const codeMatch =
          b.ticketCode?.toLowerCase().includes(q) ||
          b._id.toLowerCase().includes(q);
        const nameMatch = b.customerName?.toLowerCase().includes(q) || false;

        if (!titleMatch && !locationMatch && !codeMatch && !nameMatch) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, activeTab, searchTerm, now]);

  // Tab counts
  const counts = useMemo(() => {
    let upcoming = 0;
    let past = 0;
    let cancelled = 0;

    bookings.forEach((b) => {
      const event = b.event;
      const startDate = event?.startDate ? new Date(event.startDate) : null;
      const endDate = event?.endDate ? new Date(event.endDate) : startDate;

      if (b.status === "cancelled") {
        cancelled++;
      } else if (endDate && endDate < now) {
        past++;
      } else {
        upcoming++;
      }
    });

    return {
      all: bookings.length,
      upcoming,
      past,
      cancelled,
    };
  }, [bookings, now]);

  return (
    <div className="space-y-6">
      {/* 1. HEADER & OVERVIEW BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-hairline/80 bg-white/90 p-6 sm:p-7 shadow-xs backdrop-blur-md">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-3 py-1 text-xs font-bold text-forest mb-2">
            <Ticket className="h-3.5 w-3.5" />
            <span>{isHt ? "Paspò & Rezèvasyon" : "Passes & Reservations"}</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-forest-deep">
            {isHt ? "Rezèvasyon Evènman Mwen Yo" : "My Event Bookings"}
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-mist leading-relaxed max-w-xl">
            {isHt
              ? "Jere tout rezèvasyon ou yo, konsilte detay evènman yo, epi telechaje paspò antre ou."
              : "Manage your reservations, view event details, and download your entry passes."}
          </p>
        </div>

        {/* Stats summary chip */}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0 bg-sand-soft/70 px-4 py-2.5 rounded-2xl border border-hairline/80">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-white shadow-2xs">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="font-display text-xl font-bold text-forest-deep leading-none">
              {counts.all}
            </span>
            <p className="text-[11px] font-semibold text-mist">
              {isHt ? "Total Rezèvasyon" : "Total Bookings"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. FILTER CONTROLS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Segmented Status Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-sand-soft/80 border border-hairline/70 overflow-x-auto no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "all"
                ? "bg-forest text-white shadow-2xs"
                : "text-mist hover:text-forest-deep"
            }`}
          >
            <span>{isHt ? "Tout" : "All Bookings"}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeTab === "all"
                  ? "bg-white/20 text-white"
                  : "bg-forest/10 text-forest"
              }`}
            >
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "upcoming"
                ? "bg-forest text-white shadow-2xs"
                : "text-mist hover:text-forest-deep"
            }`}
          >
            <span>{isHt ? "K ap Vini" : "Upcoming"}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeTab === "upcoming"
                  ? "bg-white/20 text-white"
                  : "bg-forest/10 text-forest"
              }`}
            >
              {counts.upcoming}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("past")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "past"
                ? "bg-forest text-white shadow-2xs"
                : "text-mist hover:text-forest-deep"
            }`}
          >
            <span>{isHt ? "Pase" : "Past Events"}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeTab === "past"
                  ? "bg-white/20 text-white"
                  : "bg-forest/10 text-forest"
              }`}
            >
              {counts.past}
            </span>
          </button>

          {counts.cancelled > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("cancelled")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "cancelled"
                  ? "bg-forest text-white shadow-2xs"
                  : "text-mist hover:text-forest-deep"
              }`}
            >
              <span>{isHt ? "Anile" : "Cancelled"}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === "cancelled"
                    ? "bg-white/20 text-white"
                    : "bg-forest/10 text-forest"
                }`}
              >
                {counts.cancelled}
              </span>
            </button>
          )}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              isHt
                ? "Chèche pa tit, lye oswa kòd…"
                : "Search by title, venue or code…"
            }
            className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-hairline/80 bg-white/95 focus:outline-none focus:ring-2 focus:ring-forest/30 text-forest-deep placeholder:text-mist shadow-2xs"
          />
        </div>
      </div>

      {/* 3. BOOKINGS GRID OR EMPTY STATE */}
      {filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-hairline/80 bg-white/80 shadow-xs backdrop-blur-md space-y-4">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-sand-soft text-forest">
            <Ticket className="h-8 w-8 stroke-[1.5]" />
          </div>

          <div className="space-y-1 max-w-md">
            <h3 className="font-display text-lg font-bold text-forest-deep">
              {searchTerm || activeTab !== "all"
                ? isHt
                  ? "Pa gen okenn rezèvasyon ki koresponn"
                  : "No matching reservations found"
                : isHt
                  ? "Ou poko gen okenn rezèvasyon"
                  : "You haven't reserved any events yet"}
            </h3>
            <p className="text-xs sm:text-sm text-mist leading-relaxed">
              {searchTerm || activeTab !== "all"
                ? isHt
                  ? "Eseye chanje rechèch la oswa chwazi yon lòt filtè."
                  : "Try clearing your search keyword or switching filter tabs."
                : isHt
                  ? "Dekouvri evènman k ap vini yo pou konekte, aprann, epi sipòte inisyativ ayisyen yo."
                  : "Browse our upcoming galas, fundraisers, and pitch nights to connect and make an impact."}
            </p>
          </div>

          {searchTerm || activeTab !== "all" ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setActiveTab("all");
              }}
              className="rounded-xl border-hairline text-xs font-semibold"
            >
              {isHt ? "Reyajiste Filtè Yo" : "Reset Filters"}
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              className="rounded-xl px-5 text-xs font-semibold gap-1.5"
            >
              <Link href={`/${lang}/events`}>
                <span>
                  {isHt ? "Dekouvri Evènman Yo" : "Browse Upcoming Events"}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2  gap-6 items-stretch">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}

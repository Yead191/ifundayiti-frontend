"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Ticket,
  Video,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { type IEvent } from "@/helpers/next-fetch/eventActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { Button } from "@/components/ui/button";

interface FeaturedEventHeroProps {
  event: IEvent | null;
  lang: string;
  badgeLabel?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  status: "upcoming" | "live" | "today" | "ended";
  statusLabel: string;
  relativeTimeText: string;
}

function calculateTimeRemaining(
  startDateStr: string,
  endDateStr?: string,
): TimeRemaining {
  const start = new Date(startDateStr).getTime();
  const now = new Date().getTime();

  if (isNaN(start)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
      status: "ended",
      statusLabel: "Gathering Concluded",
      relativeTimeText: "Date TBA",
    };
  }

  const end = endDateStr ? new Date(endDateStr).getTime() : NaN;
  const isToday =
    new Date(start).toDateString() === new Date(now).toDateString();

  // 1. EVENT IN THE FUTURE (now < start)
  if (now < start) {
    const diff = start - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    let relative = "";
    if (days > 1) relative = `Starts in ${days} days`;
    else if (days === 1) relative = "Starts tomorrow";
    else if (hours > 0) relative = `Starts in ${hours}h ${minutes}m`;
    else relative = `Starts in ${minutes}m ${seconds}s`;

    return {
      days,
      hours,
      minutes,
      seconds,
      isPast: false,
      status: "upcoming",
      statusLabel: "Gathering Begins In",
      relativeTimeText: relative,
    };
  }

  // 2. EVENT IS LIVE NOW (now >= start, and now < effectiveEnd)
  const effectiveEnd = !isNaN(end) ? end : start + 3 * 60 * 60 * 1000;
  if (now >= start && now < effectiveEnd) {
    const diff = effectiveEnd - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return {
      days,
      hours,
      minutes,
      seconds,
      isPast: false,
      status: "live",
      statusLabel: "🔴 Live Now · Concludes In",
      relativeTimeText: "In session now",
    };
  }

  // 3. EVENT TIME HAS ALREADY PASSED
  const startTimeStr = !isNaN(start)
    ? new Date(start).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: true,
    status: "ended",
    statusLabel: "Gathering Concluded",
    relativeTimeText: isToday ? `Ended today (${startTimeStr})` : "Completed",
  };
}

export function FeaturedEventHero({
  event,
  lang,
  badgeLabel,
}: FeaturedEventHeroProps) {
  const [timeLeft, setTimeLeft] = React.useState<TimeRemaining>(() =>
    event
      ? calculateTimeRemaining(event.startDate, event.endDate)
      : {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
          status: "ended",
          statusLabel: "Gathering Concluded",
          relativeTimeText: "",
        },
  );

  React.useEffect(() => {
    if (!event) return;

    // Run immediate check upon mount
    setTimeLeft(calculateTimeRemaining(event.startDate, event.endDate));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(event.startDate, event.endDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [event?.startDate, event?.endDate]);

  if (!event) return null;

  const startDate = new Date(event.startDate);
  const formattedDate = !isNaN(startDate.getTime())
    ? startDate.toLocaleDateString(lang === "ht" ? "fr-HT" : "en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formattedTime = !isNaN(startDate.getTime())
    ? startDate.toLocaleTimeString(lang === "ht" ? "fr-HT" : "en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const isFree =
    event.pricingType === "free" || !event.price || event.price === 0;
  const remaining =
    typeof event.remainingSeats === "number"
      ? event.remainingSeats
      : Math.max(0, (event.capacity || 0) - (event.reservedCount || 0));

  const imageUrl =
    getImageUrl(event.image) ||
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1600";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-hairline bg-white shadow-lg">
      {/* Subtle Background Watermark Graphic & Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          priority
          className="object-cover opacity-[0.07] filter blur-[0.5px] scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-white via-white/95 to-sand-soft/40" />
        <div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-forest/5 blur-3xl" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Main Info (Left 7 cols) */}
          <div className="space-y-5 lg:col-span-7">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-forest/20 bg-forest/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-forest shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-forest" />
                {badgeLabel ||
                  (event.featured
                    ? "Featured Gathering"
                    : "Upcoming Gathering")}
              </span>

              <span className="rounded-full bg-sand-soft/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-forest-deep border border-hairline">
                {event.category.replace("-", " ")}
              </span>

              {event.type === "virtual" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                  <Video className="h-3 w-3" /> Virtual Stream
                </span>
              )}
              {event.type === "hybrid" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-semibold text-purple-700">
                  <Video className="h-3 w-3" /> Hybrid (In-Person + Zoom)
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="font-display text-2xl font-bold tracking-tight text-forest-deep sm:text-3xl lg:text-[2.5rem] leading-[1.15]">
              {event.title}
            </h2>

            {/* Excerpt */}
            <p className="line-clamp-2 text-sm leading-relaxed text-mist sm:text-base max-w-2xl">
              {event.description}
            </p>

            {/* Date & Location Chips */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-forest pt-1">
              <div className="flex items-center gap-2 font-semibold">
                <Calendar className="h-4 w-4 text-forest" />
                <span className="text-forest-deep">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-mist font-medium">
                <Clock className="h-4 w-4 text-forest/70" />
                <span>{formattedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-mist font-medium">
                <MapPin className="h-4 w-4 text-forest/70" />
                <span className="truncate max-w-xs">{event.location}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl bg-forest hover:bg-forest-deep text-white px-8 font-semibold shadow-sm hover:shadow-md cursor-pointer transition-all"
              >
                <Link href={`/${lang}/events/${event._id}`}>
                  <Ticket className="mr-2 h-4 w-4 text-white" />
                  {isFree
                    ? "Reserve Free Spot"
                    : `Get Tickets • $${event.price}`}
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-xl border-hairline bg-white px-6 font-medium text-forest-deep hover:bg-sand-soft hover:text-forest cursor-pointer transition-all shadow-2xs"
              >
                <Link href={`/${lang}/events/${event._id}`}>
                  <span>View Details</span>
                  <ArrowRight className="ml-2 h-4 w-4 text-forest" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Countdown & Ticket Perks Box (Right 5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-hairline bg-sand-soft/50 p-5 sm:p-6 shadow-sm space-y-6">
              {/* Countdown Section */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-hairline">
                  <span className="text-xs font-semibold uppercase tracking-wider text-forest flex items-center gap-1.5">
                    {timeLeft.status === "live" ? (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                      </span>
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-forest" />
                    )}
                    {timeLeft.statusLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    {timeLeft.relativeTimeText && (
                      <span className="rounded-full bg-forest/10 border border-forest/20 px-2.5 py-0.5 text-[10px] font-bold text-forest">
                        {timeLeft.relativeTimeText}
                      </span>
                    )}
                    <span className="text-[11px] text-mist font-medium">
                      {remaining > 0 ? `${remaining} seats left` : "Full"}
                    </span>
                  </div>
                </div>

                {timeLeft.status === "ended" ? (
                  <div className="mt-4 rounded-xl border border-hairline bg-white p-4 text-center">
                    <p className="text-sm font-semibold text-forest-deep">
                      This gathering has concluded.
                    </p>
                    <p className="text-xs text-mist mt-1">
                      Check the schedule below for upcoming community
                      gatherings.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: "Days", value: timeLeft.days },
                      { label: "Hours", value: timeLeft.hours },
                      { label: "Mins", value: timeLeft.minutes },
                      { label: "Secs", value: timeLeft.seconds },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-hairline bg-white p-2.5 sm:p-3 shadow-2xs transition-colors hover:border-forest/40"
                      >
                        <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-forest-deep block tabular-nums">
                          {String(item.value).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-forest/70 block mt-0.5">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Guarantee Strip */}
              <div className="rounded-xl border border-hairline bg-white p-3.5 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-mist block">
                    Admission Type
                  </span>
                  <span className="font-display text-lg font-bold text-forest-deep">
                    {isFree ? "Complimentary RSVP" : `$${event.price}.00 USD`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-forest">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Official Pass</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

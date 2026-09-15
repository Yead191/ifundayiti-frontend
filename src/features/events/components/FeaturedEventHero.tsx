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
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeRemaining(targetDateStr: string): TimeRemaining {
  const target = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0 || isNaN(diff)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isPast: false };
}

export function FeaturedEventHero({ event, lang }: FeaturedEventHeroProps) {
  const [timeLeft, setTimeLeft] = React.useState<TimeRemaining>(() =>
    event ? calculateTimeRemaining(event.startDate) : { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
  );

  React.useEffect(() => {
    if (!event) return;
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(event.startDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [event]);

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

  const isFree = event.pricingType === "free" || !event.price || event.price === 0;
  const remaining =
    typeof event.remainingSeats === "number"
      ? event.remainingSeats
      : Math.max(0, (event.capacity || 0) - (event.reservedCount || 0));

  const imageUrl = getImageUrl(event.image) || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1600";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-[#0E0E10] text-white shadow-2xl">
      {/* Background Graphic & Texture */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          priority
          className="object-cover opacity-25 filter blur-[1px] scale-105 transition-transform duration-1000 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E10] via-[#0E0E10]/90 to-[#0E0E10]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-transparent to-[#0E0E10]/40" />
        {/* Subtle Gold Ambient Radial Glow */}
        <div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 lg:p-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Main Info (Left 7 cols) */}
          <div className="space-y-5 lg:col-span-7">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-3.5 py-1 text-xs font-semibold tracking-wide text-[#F5E6BE] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                Featured Gathering
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-300 backdrop-blur-md border border-white/10">
                {event.category.replace("-", " ")}
              </span>

              {event.type === "virtual" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-semibold text-blue-300">
                  <Video className="h-3 w-3" /> Virtual Stream
                </span>
              )}
              {event.type === "hybrid" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 border border-purple-400/30 px-3 py-1 text-xs font-semibold text-purple-300">
                  <Video className="h-3 w-3" /> Hybrid (In-Person + Zoom)
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.6rem] leading-[1.12]">
              {event.title}
            </h2>

            {/* Excerpt */}
            <p className="line-clamp-2 text-sm leading-relaxed text-neutral-300 sm:text-base max-w-2xl">
              {event.description}
            </p>

            {/* Date & Location Chips */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-neutral-300 pt-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#D4AF37]" />
                <span className="font-medium text-white">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#D4AF37]" />
                <span>{formattedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#D4AF37]" />
                <span className="truncate max-w-xs">{event.location}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B38F26] px-8 font-semibold text-neutral-950 shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 cursor-pointer transition-all"
              >
                <Link href={`/${lang}/events/${event._id}`}>
                  <Ticket className="mr-2 h-4 w-4 text-neutral-900" />
                  {isFree ? "Reserve Free Spot" : `Get Tickets • $${event.price}`}
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-xl border-white/20 bg-white/5 px-6 font-medium text-white hover:bg-white/10 hover:border-white/30 cursor-pointer transition-all"
              >
                <Link href={`/${lang}/events/${event._id}`}>
                  <span>View Details</span>
                  <ArrowRight className="ml-2 h-4 w-4 text-neutral-400" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Countdown & Ticket Perks Box (Right 5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#141418]/90 p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-6">
              {/* Countdown Section */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Gathering Begins In
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {remaining > 0 ? `${remaining} seats left` : "Registration Full"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: "Days", value: timeLeft.days },
                    { label: "Hours", value: timeLeft.hours },
                    { label: "Mins", value: timeLeft.minutes },
                    { label: "Secs", value: timeLeft.seconds },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-black/40 p-2.5 sm:p-3"
                    >
                      <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-[#F5E6BE] block">
                        {String(item.value).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mt-0.5">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Guarantee Strip */}
              <div className="rounded-xl border border-[#D4AF37]/20 bg-gradient-to-r from-[#D4AF37]/10 to-transparent p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                    Admission Type
                  </span>
                  <span className="font-display text-lg font-bold text-white">
                    {isFree ? "Complimentary RSVP" : `$${event.price}.00 USD`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#D4AF37]">
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

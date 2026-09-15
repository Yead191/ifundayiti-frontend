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
  Users,
  Video,
  ArrowRight,
} from "lucide-react";
import { type IEvent } from "@/helpers/next-fetch/eventActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: IEvent;
  lang: string;
}

export function EventCard({ event, lang }: EventCardProps) {
  const startDate = new Date(event.startDate);
  const formattedDate = !isNaN(startDate.getTime())
    ? startDate.toLocaleDateString(lang === "ht" ? "fr-HT" : "en-US", {
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
  const capacity = event.capacity || 100;
  const reserved = event.reservedCount || 0;
  const remaining =
    typeof event.remainingSeats === "number"
      ? event.remainingSeats
      : Math.max(0, capacity - reserved);
  const isSoldOut = remaining <= 0;

  const occupancyPercent = Math.min(100, Math.round((reserved / Math.max(1, capacity)) * 100));

  const imageUrl =
    getImageUrl(event.image) ||
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800";

  function getCategoryBadge(cat: string) {
    switch (cat) {
      case "gala":
        return {
          label: "Gala & Banquet",
          color: "bg-[#D4AF37]/15 text-[#8F721A] border-[#D4AF37]/40 dark:text-[#E5C158]",
        };
      case "fundraiser":
        return {
          label: "Fundraiser",
          color: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
      case "pitch-night":
        return {
          label: "Pitch Night",
          color: "bg-violet-50 text-violet-800 border-violet-200",
        };
      case "workshop":
        return {
          label: "Workshop",
          color: "bg-blue-50 text-blue-800 border-blue-200",
        };
      default:
        return {
          label: cat.replace("-", " "),
          color: "bg-neutral-100 text-neutral-800 border-neutral-200",
        };
    }
  }

  const badge = getCategoryBadge(event.category);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-hairline/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:shadow-xl">
      {/* Banner Media */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-sand-soft">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold backdrop-blur-md ${badge.color}`}
          >
            {badge.label}
          </span>

          <div className="flex items-center gap-1.5">
            {event.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#D4AF37] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black shadow-sm">
                <Sparkles className="h-3 w-3" /> Featured
              </span>
            )}

            {event.type === "virtual" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-600/90 text-white px-2 py-0.5 text-[10px] font-bold shadow-xs">
                <Video className="h-3 w-3" /> Virtual
              </span>
            )}
            {event.type === "hybrid" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-600/90 text-white px-2 py-0.5 text-[10px] font-bold shadow-xs">
                <Video className="h-3 w-3" /> Hybrid
              </span>
            )}
          </div>
        </div>

        {/* Bottom Price Tag on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`inline-block rounded-xl px-3 py-1 text-xs font-bold shadow-md ${
              isFree
                ? "bg-emerald-600 text-white"
                : "bg-neutral-900/90 text-[#F5E6BE] border border-[#D4AF37]/30"
            }`}
          >
            {isFree ? "FREE RSVP" : `$${event.price}.00 USD`}
          </span>

          {isSoldOut ? (
            <span className="rounded-xl bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
              SOLD OUT
            </span>
          ) : (
            <span className="rounded-xl bg-black/60 px-2.5 py-1 text-[11px] font-medium text-neutral-200 backdrop-blur-md">
              {remaining} seats left
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 space-y-4">
        {/* Date & Time Row */}
        <div className="flex items-center gap-4 text-xs font-semibold text-forest">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-forest/70" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-mist">
            <Clock className="h-3.5 w-3.5 text-mist" />
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-bold text-forest-deep transition-colors group-hover:text-forest line-clamp-2 leading-snug">
          <Link href={`/${lang}/events/${event._id}`}>
            {event.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="line-clamp-2 text-xs leading-relaxed text-mist">
          {event.description}
        </p>

        {/* Location chip */}
        <div className="flex items-center gap-1.5 text-xs text-mist pt-1">
          <MapPin className="h-3.5 w-3.5 text-forest shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>

        {/* Capacity Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-hairline/60">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-mist flex items-center gap-1">
              <Users className="h-3 w-3" /> Registration
            </span>
            <span className="font-semibold text-forest-deep">
              {reserved} / {capacity} seats
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand-soft">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                occupancyPercent >= 90
                  ? "bg-red-500"
                  : occupancyPercent >= 70
                  ? "bg-amber-500"
                  : "bg-forest"
              }`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2 mt-auto">
          <Button
            asChild
            className="w-full h-11 rounded-xl font-semibold bg-forest text-white hover:bg-forest-deep group-hover:shadow-md cursor-pointer transition-all"
          >
            <Link href={`/${lang}/events/${event._id}`}>
              <span>View Details & Register</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

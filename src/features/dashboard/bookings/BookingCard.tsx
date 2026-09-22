"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Ticket,
  Video,
  Copy,
  Check,
  QrCode,
  ArrowRight,
  Printer,
  Users,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import type { IUserBooking } from "@/helpers/next-fetch/bookingActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BookingCardProps {
  booking: IUserBooking;
  lang?: string;
  onOpenTicket?: (booking: IUserBooking) => void;
}

export function BookingCard({ booking, lang = "en" }: BookingCardProps) {
  const [copied, setCopied] = useState(false);
  const isHt = lang === "ht";
  const event = booking.event;
  const ticketUrl = `/${lang}/ticket/${booking.ticketCode || booking._id}`;

  const coverUrl = event?.image ? getImageUrl(event.image) : null;
  const startDate = event?.startDate ? new Date(event.startDate) : null;

  const formattedDate = startDate
    ? startDate.toLocaleDateString(isHt ? "fr-HT" : "en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formattedTime = startDate
    ? startDate.toLocaleTimeString(isHt ? "fr-HT" : "en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  const ticketCode =
    booking.ticketCode || `IFA-${booking._id.slice(-6).toUpperCase()}`;

  const isFree = booking.paymentStatus === "free" || booking.price === 0;
  const isCancelled = booking.status === "cancelled";
  const isAttended = booking.checkedIn || booking.status === "attended";

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(ticketCode);
      setCopied(true);
      toast.success(
        isHt ? "Kòd tikè kopye!" : "Ticket code copied to clipboard!",
      );
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(ticketUrl, "_blank");
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-hairline/80 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-forest/40 hover:shadow-xl">
      {/* CARD TOP: COVER IMAGE & STATUS TAGS */}
      <div className="relative aspect-video w-full overflow-hidden bg-sand-soft/60 shrink-0">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={event?.title || "Event Cover"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-forest/10 via-sand-soft/60 to-forest/5 text-forest/30">
            <Ticket className="h-12 w-12 stroke-[1.5]" />
          </div>
        )}

        {/* Soft dark gradient vignette */}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

        {/* Top-Left Category Badge */}
        {event?.category && (
          <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-black/65 px-3 py-1 text-[11px] font-bold text-white shadow-xs backdrop-blur-md border border-white/20 capitalize">
            <span>{event.category}</span>
          </div>
        )}

        {/* Top-Right Format Badge (Physical vs Virtual) */}
        <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[11px] font-bold text-white shadow-xs backdrop-blur-md border border-white/20">
          {event?.type === "virtual" ? (
            <>
              <Video className="h-3 w-3 text-sky-400" />
              <span>{isHt ? "Virtiyèl" : "Virtual"}</span>
            </>
          ) : event?.type === "hybrid" ? (
            <>
              <Video className="h-3 w-3 text-amber-400" />
              <span>Hybrid</span>
            </>
          ) : (
            <>
              <MapPin className="h-3 w-3 text-emerald-400" />
              <span>{isHt ? "Sou Plas" : "In-Person"}</span>
            </>
          )}
        </div>

        {/* Bottom Bar inside image: Event Title */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-tight drop-shadow-md line-clamp-1 group-hover:text-amber-200 transition-colors">
            {event?.title || (isHt ? "Evènman San Tit" : "Untitled Event")}
          </h3>
        </div>
      </div>

      {/* CARD BODY */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 space-y-4">
        <div className="space-y-3">
          {/* Date & Time Row */}
          <div className="flex items-start gap-2.5 text-xs text-mist">
            <Calendar className="h-4 w-4 text-forest shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-forest-deep">
                {formattedDate}
              </span>
              {formattedTime && (
                <span className="text-mist/80"> • {formattedTime}</span>
              )}
            </div>
          </div>

          {/* Venue & Location Row */}
          <div className="flex items-start gap-2.5 text-xs text-mist">
            <MapPin className="h-4 w-4 text-forest shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-forest-deep truncate block">
                {event?.location ||
                  (event?.type === "virtual"
                    ? isHt
                      ? "Reyinyon Virtiyèl"
                      : "Virtual Stream"
                    : isHt
                      ? "Lye a ap kominike"
                      : "Venue to be announced")}
              </span>
              {event?.venueAddress && (
                <span className="text-[11px] text-mist/80 line-clamp-1">
                  {event.venueAddress}
                </span>
              )}
            </div>
          </div>

          {/* Ticket Information Bar */}
          <div className="rounded-2xl bg-sand-soft/60 p-3 flex flex-wrap items-center justify-between gap-2 border border-hairline/60">
            {/* Monospace Ticket Code with Copy Button */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyCode}
                className="group/code inline-flex items-center gap-1 font-mono text-xs font-bold text-forest hover:text-forest-deep bg-white px-2.5 py-1 rounded-lg border border-hairline shadow-2xs transition cursor-pointer"
                title={isHt ? "Kopi kòd la" : "Copy ticket code"}
              >
                <span>{ticketCode}</span>
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3 text-mist group-hover/code:text-forest" />
                )}
              </button>
            </div>

            {/* Admit Count Pill */}
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-forest-deep">
              <Users className="h-3.5 w-3.5 text-mist" />
              <span>
                {booking.quantity}{" "}
                {booking.quantity === 1
                  ? isHt
                    ? "Tikè"
                    : "Ticket"
                  : isHt
                    ? "Tikè"
                    : "Tickets"}
              </span>
            </div>

            {/* Price / RSVP Badge */}
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                isFree
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-forest/10 text-forest"
              }`}
            >
              {isFree
                ? isHt
                  ? "Gratis"
                  : "FREE RSVP"
                : formatPrice(booking.price)}
            </span>
          </div>

          {/* Check-In Status & Cancellation Pill */}
          <div className="flex items-center justify-between gap-2 pt-1 text-xs">
            <span className="text-mist font-medium">
              {isHt ? "Estati Antre" : "Admission"}:
            </span>

            {isCancelled ? (
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
                {isHt ? "Anile" : "Cancelled"}
              </span>
            ) : isAttended ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                <Check className="h-3 w-3" />
                <span>{isHt ? "Antre Valide" : "Checked In"}</span>
              </span>
            ) : (
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-400/20">
                {isHt ? "Pare pou Antre" : "Awaiting Check-in"}
              </span>
            )}
          </div>
        </div>

        {/* CARD ACTIONS ROW */}
        <div className="pt-4 border-t border-hairline/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Primary: Open Official Ticket Page */}
          <Button
            asChild
            size="sm"
            className="flex-1 rounded-xl bg-forest hover:bg-forest-deep text-white font-semibold text-xs gap-1.5 shadow-sm cursor-pointer"
          >
            <Link
              href={ticketUrl}
              title={
                isHt
                  ? "Ouvri tikè ofisyèl la"
                  : "Open official printable ticket"
              }
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>{isHt ? "Wè Tikè Ofisyèl" : "View Ticket Pass"}</span>
              <ArrowRight className="h-3 w-3 opacity-60" />
            </Link>
          </Button>

          {/* Secondary: Details Page */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl border-hairline hover:bg-sand-soft font-semibold text-xs gap-1 cursor-pointer"
          >
            <Link href={`/${lang}/dashboard/my-bookings/${booking._id}`}>
              <span>{isHt ? "Detay" : "Details"}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

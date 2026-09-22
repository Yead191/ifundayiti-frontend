"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Ticket,
  Video,
  ExternalLink,
  Copy,
  Check,
  Printer,
  Download,
  QrCode,
  Sparkles,
  Users,
  CreditCard,
  Mail,
  Phone,
  User,
  Clock,
  ShieldCheck,
  AlertCircle,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

import type { IUserBooking } from "@/helpers/next-fetch/bookingActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardTicketPass } from "./DashboardTicketPass";

interface BookingDetailViewProps {
  booking: IUserBooking;
  lang?: string;
}

export function BookingDetailView({
  booking,
  lang = "en",
}: BookingDetailViewProps) {
  const isHt = lang === "ht";
  const [copiedCode, setCopiedCode] = useState(false);

  const event = booking.event;
  const ticketUrl = `/${lang}/ticket/${booking.ticketCode || booking._id}`;
  const coverUrl = event?.image ? getImageUrl(event.image) : null;
  const startDate = event?.startDate ? new Date(event.startDate) : null;
  const endDate = event?.endDate ? new Date(event.endDate) : null;
  const createdAt = booking.createdAt ? new Date(booking.createdAt) : null;
  const checkedInAt = booking.checkedInAt
    ? new Date(booking.checkedInAt)
    : null;

  const formattedDate = startDate
    ? startDate.toLocaleDateString(isHt ? "fr-HT" : "en-US", {
        weekday: "long",
        month: "long",
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

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(ticketCode);
      setCopiedCode(true);
      toast.success(
        isHt ? "Kòd tikè kopye!" : "Ticket code copied to clipboard!",
      );
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      toast.error("Failed to copy ticket code");
    }
  };

  const handleDownloadQr = () => {
    if (!booking.qrCode) {
      toast.error(
        isHt ? "Pa gen kòd QR ki disponib." : "No QR code available.",
      );
      return;
    }
    const link = document.createElement("a");
    link.href = booking.qrCode;
    link.download = `Ticket-QR-${ticketCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(
      isHt
        ? "Kòd QR telechaje avèk siksè!"
        : "QR Code downloaded successfully!",
    );
  };

  const mapsUrl = event?.venueAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${event.location ? `${event.location}, ` : ""}${event.venueAddress}`,
      )}`
    : null;

  return (
    <div className="space-y-6">
      {/* 1. TOP BREADCRUMB & BACK ACTION */}
      <div className="flex items-center justify-between gap-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 rounded-xl px-2.5 text-xs font-semibold text-forest hover:bg-sand-soft hover:text-forest-deep cursor-pointer"
        >
          <Link href={`/${lang}/dashboard/my-bookings`}>
            <ArrowLeft className="h-4 w-4" />
            <span>
              {isHt ? "Tounen nan Rezèvasyon Mwen Yo" : "Back to My Bookings"}
            </span>
          </Link>
        </Button>

        {/* Quick Ticket Pass Launcher */}
        <Button
          asChild
          size="sm"
          className="rounded-xl bg-forest hover:bg-forest-deep text-white text-xs font-semibold gap-1.5 shadow-sm cursor-pointer"
        >
          <Link
            href={ticketUrl}
            title={
              isHt ? "Ouvri paspò ofisyèl la" : "Open official printable ticket"
            }
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>{isHt ? "Wè Paspò Ofisyèl" : "View Ticket Pass"}</span>
          </Link>
        </Button>
      </div>

      {/* 2. EVENT SUMMARY HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-hairline/80 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Cover Viewport (5 cols) */}
          <div className="relative min-h-60 sm:min-h-70 lg:min-h-full lg:col-span-5 overflow-hidden bg-sand-soft/60">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={event?.title || "Event Cover"}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-forest/15 to-sand-soft text-forest/30">
                <Ticket className="h-16 w-16" />
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

            {/* Badges on cover */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
              {event?.category && (
                <span className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-bold text-white uppercase tracking-wider border border-white/20">
                  {event.category}
                </span>
              )}

              <span className="rounded-full bg-forest/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white capitalize">
                {event?.type || "Physical"}
              </span>
            </div>
          </div>

          {/* Details Column (7 cols) */}
          <div className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-forest-deep leading-snug">
                {event?.title}
              </h1>

              {event?.description && (
                <p className="text-xs sm:text-sm text-mist leading-relaxed line-clamp-3">
                  {event.description}
                </p>
              )}

              {/* Date & Time Highlight */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-forest-deep">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-forest" />
                  <span className="font-bold">{formattedDate}</span>
                </div>
                {formattedTime && (
                  <div className="flex items-center gap-2 text-mist">
                    <Clock className="h-4 w-4 text-forest" />
                    <span className="font-medium">{formattedTime}</span>
                  </div>
                )}
              </div>

              {/* Location with Google Maps / Live Stream link */}
              <div className="flex items-start gap-2 text-xs sm:text-sm text-forest-deep">
                {event?.type === "virtual" ? (
                  <Video className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                ) : (
                  <MapPin className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                )}
                <div className="min-w-0 flex-1">
                  <span className="font-semibold block">
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
                    <p className="text-xs text-mist mt-0.5">
                      {event.venueAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Links (Maps or Virtual Stream) */}
              <div className="pt-1 flex flex-wrap items-center gap-3">
                {mapsUrl && event?.type !== "virtual" && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-deep underline underline-offset-4"
                  >
                    <span>
                      {isHt ? "Ouvri nan Google Maps" : "Open in Google Maps"}
                    </span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}

                {event?.virtualLink && (
                  <a
                    href={event.virtualLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-forest px-3.5 py-1.5 text-xs font-bold text-white hover:bg-forest-deep transition"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>
                      {isHt ? "Antre nan Reyinyon an" : "Join Live Stream"}
                    </span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {/* Dress Code Notice */}
              {event?.dressCode && (
                <div className="mt-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 px-3.5 py-2 text-xs text-amber-900 flex items-center gap-2">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800">
                    {isHt ? "Kòd Rad" : "Dress Code"}:
                  </span>
                  <span>{event.dressCode}</span>
                </div>
              )}
            </div>

            {/* Ticket Code banner */}
            <div className="pt-4 border-t border-hairline/80 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-mist font-bold">
                  {isHt ? "Kòd Tikè Ofisyèl" : "Official Ticket Code"}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-base font-black tracking-wider text-forest-deep">
                    {ticketCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="grid h-7 w-7 place-items-center rounded-lg hover:bg-sand-soft text-mist hover:text-forest transition cursor-pointer"
                    title={isHt ? "Kopi kòd" : "Copy code"}
                  >
                    {copiedCode ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-hairline font-semibold text-xs gap-1.5 cursor-pointer"
                >
                  <Link href={ticketUrl}>
                    <QrCode className="h-3.5 w-3.5 text-forest" />
                    <span>{isHt ? "Wè Tikè Ofisyèl" : "View Ticket Pass"}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 OFFICIAL DASHBOARD TICKET PASS */}
      <section className="print:m-0">
        <DashboardTicketPass booking={booking} lang={lang} />
      </section>

      {/* 3. DOOR CHECK-IN STATUS CARD */}
      <div
        className={`rounded-3xl border p-5 sm:p-6 transition-all ${
          booking.checkedIn
            ? "border-emerald-200 bg-emerald-50/70 text-emerald-950"
            : "border-amber-200/80 bg-amber-50/50 text-amber-950"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
              booking.checkedIn
                ? "bg-emerald-600 text-white"
                : "bg-amber-500 text-white"
            }`}
          >
            {booking.checkedIn ? (
              <ShieldCheck className="h-6 w-6" />
            ) : (
              <Ticket className="h-6 w-6" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-base font-bold">
              {booking.checkedIn
                ? isHt
                  ? "Antre Valide nan Evènman an"
                  : "Admitted into Event"
                : isHt
                  ? "Pare pou Antre nan Evènman an"
                  : "Ready for Event Entry"}
            </h3>

            <p className="text-xs sm:text-sm leading-relaxed opacity-90">
              {booking.checkedIn
                ? isHt
                  ? `Tikè sa a te valide nan antre a ${
                      checkedInAt
                        ? `nan dat ${checkedInAt.toLocaleDateString()} a ${checkedInAt.toLocaleTimeString()}`
                        : "pa ekip sekirite nou an"
                    }.`
                  : `This pass was checked in and confirmed at the venue doors ${
                      checkedInAt
                        ? `on ${checkedInAt.toLocaleDateString()} at ${checkedInAt.toLocaleTimeString()}`
                        : "by event staff"
                    }.`
                : isHt
                  ? "Tanpri prezante kòd QR ki anba a oswa telechaje paspò a pou prezante nan biwo enskripsyon an lè w rive."
                  : "Please present the scannable QR Code below or bring your printed golden ticket to the registration desk upon arrival."}
            </p>
          </div>
        </div>
      </div>

      {/* 4. ATTENDEE INFO, QR CODE & PAYMENT SUMMARY (2-COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ATTENDEE & PAYMENT DETAILS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Attendee Information Card */}
          <div className="rounded-3xl border border-hairline/80 bg-white/90 p-6 sm:p-7 shadow-xs backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-forest-deep border-b border-hairline pb-3">
              <User className="h-4.5 w-4.5 text-forest" />
              <h3 className="font-display text-base font-bold">
                {isHt ? "Enfòmasyon sou Patisipan" : "Attendee Details"}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-[11px] font-semibold text-mist uppercase tracking-wider block">
                  {isHt ? "Non Konplè" : "Full Name"}
                </span>
                <span className="font-bold text-forest-deep mt-0.5 block">
                  {booking.customerName}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-mist uppercase tracking-wider block">
                  {isHt ? "Adrès Imèl" : "Email Address"}
                </span>
                <span className="font-semibold text-forest-deep mt-0.5 block break-all">
                  {booking.customerEmail}
                </span>
              </div>

              {booking.customerPhone && (
                <div>
                  <span className="text-[11px] font-semibold text-mist uppercase tracking-wider block">
                    {isHt ? "Nimewo Telefòn" : "Phone Number"}
                  </span>
                  <span className="font-semibold text-forest-deep mt-0.5 block">
                    {booking.customerPhone}
                  </span>
                </div>
              )}

              <div>
                <span className="text-[11px] font-semibold text-mist uppercase tracking-wider block">
                  {isHt ? "Dat Enskripsyon" : "Registration Date"}
                </span>
                <span className="font-semibold text-forest-deep mt-0.5 block">
                  {createdAt ? createdAt.toLocaleDateString() : "—"}
                </span>
              </div>
            </div>

            {/* Special Request / Dietary Notes */}
            {booking.note && (
              <div className="mt-3 rounded-2xl bg-sand-soft/60 p-3.5 border border-hairline text-xs">
                <span className="font-bold text-forest-deep block mb-1">
                  {isHt ? "Nòt / Rejim Espesyal:" : "Special Requests & Notes:"}
                </span>
                <p className="text-mist leading-relaxed">{booking.note}</p>
              </div>
            )}
          </div>

          {/* Payment & Order Summary Card */}
          <div className="rounded-3xl border border-hairline/80 bg-white/90 p-6 sm:p-7 shadow-xs backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 text-forest-deep border-b border-hairline pb-3">
              <CreditCard className="h-4.5 w-4.5 text-forest" />
              <h3 className="font-display text-base font-bold">
                {isHt ? "Rezime Peman" : "Payment & Order Summary"}
              </h3>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-mist">
                <span>{isHt ? "Pri Pa Tikè" : "Price per Ticket"}</span>
                <span className="font-semibold text-forest-deep">
                  {isFree
                    ? isHt
                      ? "Gratis"
                      : "Free"
                    : formatPrice(
                        booking.price / Math.max(1, booking.quantity),
                      )}
                </span>
              </div>

              <div className="flex justify-between items-center text-mist">
                <span>{isHt ? "Kantite Tikè" : "Quantity"}</span>
                <span className="font-semibold text-forest-deep">
                  {booking.quantity}{" "}
                  {booking.quantity === 1
                    ? isHt
                      ? "Envite"
                      : "Guest"
                    : isHt
                      ? "Envite"
                      : "Guests"}
                </span>
              </div>

              <div className="flex justify-between items-center text-mist">
                <span>{isHt ? "Estati Peman" : "Payment Status"}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                    booking.paymentStatus === "paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : booking.paymentStatus === "free"
                        ? "bg-sky-100 text-sky-800"
                        : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {booking.paymentStatus}
                </span>
              </div>

              <div className="pt-3 border-t border-hairline flex justify-between items-center font-display font-bold text-base text-forest-deep">
                <span>{isHt ? "Total Peye" : "Total Amount"}</span>
                <span className="text-xl text-forest">
                  {isFree
                    ? isHt
                      ? "Gratis"
                      : "FREE"
                    : formatPrice(booking.price)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SCANNABLE QR CODE CARD (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-amber-400/40 bg-[#0E0E10] text-white p-6 sm:p-7 shadow-xl text-center space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                <QrCode className="h-3.5 w-3.5" />
                <span>{isHt ? "Eskane nan Antre a" : "Scan at Entrance"}</span>
              </div>

              <h3 className="font-display text-lg font-bold text-white pt-1">
                {isHt ? "Kòd QR pou Antre" : "Digital Entry Pass"}
              </h3>
            </div>

            {/* High-contrast QR code image */}
            {booking.qrCode ? (
              <div className="p-3 bg-white rounded-2xl shadow-2xl mx-auto inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={booking.qrCode}
                  alt={`QR Code ${ticketCode}`}
                  className="w-44 h-44 object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="w-44 h-44 mx-auto flex items-center justify-center bg-neutral-900 border border-neutral-700 rounded-2xl text-xs text-neutral-400">
                <span>
                  {isHt ? "Kòd QR Pa Disponib" : "QR Code Unavailable"}
                </span>
              </div>
            )}

            {/* Monospace Code Pill */}
            <div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="group inline-flex items-center gap-2 font-mono text-sm font-bold tracking-widest text-amber-400 bg-black/60 px-3.5 py-1.5 rounded-xl border border-amber-400/30 hover:border-amber-400 transition cursor-pointer"
                title={isHt ? "Kopi kòd la" : "Click to copy code"}
              >
                <span>{ticketCode}</span>
                {copiedCode ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-neutral-400 group-hover:text-amber-300" />
                )}
              </button>
              <p className="text-[11px] text-neutral-400 mt-2 max-w-xs mx-auto">
                {isHt
                  ? "Montre kòd sa a sou telefòn ou oswa enprime paspò a."
                  : "Display this pass on your screen or bring a printed copy."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2">
              <Button
                asChild
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs gap-1.5 shadow-sm cursor-pointer"
              >
                <Link href={ticketUrl}>
                  <Printer className="h-3.5 w-3.5" />
                  <span>
                    {isHt ? "Ouvri & Enprime Tikè" : "Open & Print Ticket"}
                  </span>
                </Link>
              </Button>

              {booking.qrCode && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadQr}
                  className="w-full rounded-xl border-neutral-700 hover:bg-white/10 text-white font-semibold text-xs gap-1.5 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>
                    {isHt ? "Telechaje Imaj QR la" : "Download QR Code"}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

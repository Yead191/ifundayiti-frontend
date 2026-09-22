"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import type { IUserBooking } from "@/helpers/next-fetch/bookingActions";

interface DashboardTicketPassProps {
  booking: IUserBooking;
  lang?: string;
}

export function DashboardTicketPass({
  booking,
  lang = "en",
}: DashboardTicketPassProps) {
  const [copied, setCopied] = useState(false);
  const isHt = lang === "ht";
  const event = booking.event;

  const categoryBadge = {
    label: (event?.category || "Gala").toUpperCase(),
  };

  const ticketCode =
    booking.ticketCode || `IFA-${booking._id.slice(-6).toUpperCase()}`;

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(isHt ? "fr-HT" : "en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopyCode = async () => {
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

  const qrSrc =
    booking.qrCode ||
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticketCode)}`;

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-[#D4AF37]/40 bg-[#0E0E10] text-white shadow-2xl transition hover:border-[#D4AF37]/70">
      <div className="flex flex-col lg:flex-row">
        {/* Main Pass Body (Left) */}
        <div className="relative flex-1 p-6 sm:p-8 space-y-5 overflow-hidden">
          {/* Top Brand Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <img
                src="https://res.cloudinary.com/dknmebeee/image/upload/v1789453331/logo-ifundayiti-nav_ea5qml.png"
                alt="iFundAyiti Logo"
                className="h-8 object-contain brightness-110"
              />
              <div className="h-6 w-px bg-white/20" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#D4AF37]">
                Official Invitation Pass
              </span>
            </div>

            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
              {categoryBadge.label}
            </span>
          </div>

          {/* Event Title */}
          <div>
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase block">
              Admit to Gathering
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-tight">
              {event?.title || "iFundAyiti Special Gathering"}
            </h2>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <span className="text-slate-400 block font-medium">
                Date & Schedule
              </span>
              <span className="text-white font-semibold block text-sm mt-0.5">
                {event?.startDate
                  ? formatDateTime(event.startDate)
                  : "See Invitation"}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">
                Venue Location
              </span>
              <span className="text-white font-semibold block text-sm mt-0.5">
                {event?.location || "Private Venue"}
              </span>
              {event?.venueAddress && (
                <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                  {event.venueAddress}
                </span>
              )}
            </div>

            {event?.dressCode && (
              <div>
                <span className="text-slate-400 block font-medium">
                  Dress Code
                </span>
                <span className="text-[#D4AF37] font-semibold block mt-0.5">
                  {event.dressCode}
                </span>
              </div>
            )}

            <div>
              <span className="text-slate-400 block font-medium">
                Reserved Tier
              </span>
              <span className="text-white font-bold block mt-0.5">
                {booking.paymentStatus === "free"
                  ? "Complimentary Guest"
                  : "VIP Ticket Holder"}
              </span>
            </div>
          </div>

          {/* Attendee Name & Admit Count Bar */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                Guest Name
              </span>
              <span className="font-display text-lg font-bold text-[#F7E7CE]">
                {booking.customerName}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Admissions
                </span>
                <span className="text-sm font-extrabold text-[#D4AF37]">
                  ADMIT {booking.quantity || 1}
                </span>
              </div>
            </div>
          </div>

          {/* Botanical Motif Background Accent */}
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#D4AF37]/10 blur-2xl" />
        </div>

        {/* 
          Perforated Tear Notch & Divider (Desktop & Print)
        */}
        <div className="relative flex items-center justify-center lg:flex-col border-t lg:border-t-0 lg:border-l border-dashed border-[#D4AF37]/40 bg-[#0E0E10]">
          {/* Top semicircular notch (Desktop) */}
          <div className="hidden lg:block absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-slate-950 border-b border-[#D4AF37]/40" />
          {/* Bottom semicircular notch (Desktop) */}
          <div className="hidden lg:block absolute -bottom-4 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-slate-950 border-t border-[#D4AF37]/40" />
        </div>

        {/* Right Ticket Stub */}
        <div className="w-full lg:w-72 bg-linear-to-b from-[#18181B] to-[#0E0E10] p-6 flex flex-col items-center justify-between text-center space-y-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase block">
              Entry Pass Stub
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 font-mono text-base font-extrabold text-white mt-1 tracking-wider hover:text-[#D4AF37] transition cursor-pointer"
              title="Click to copy ticket code"
            >
              <span>{ticketCode}</span>
              {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4 text-slate-400" />
              )}
            </button>
          </div>

          {/* QR Code Container */}
          <div className="rounded-2xl border-2 border-[#D4AF37] bg-white p-3 shadow-lg">
            <img
              src={qrSrc}
              alt={`QR Code ${ticketCode}`}
              className="w-27.5 h-27.5 object-contain"
            />
          </div>

          {/* Scan instructions */}
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-400 block">
              Scan at entrance for admission
            </span>
            <span className="text-[10px] text-slate-500 font-mono block">
              Admit {booking.quantity || 1} •{" "}
              {(booking.paymentStatus || "confirmed").toUpperCase()}
            </span>
          </div>

          {/* Stylized Barcode Graphic */}
          <div className="w-full pt-1">
            <div className="flex h-7 items-center justify-center gap-1 opacity-70">
              {[3, 1, 4, 1, 2, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2].map(
                (w, idx) => (
                  <div
                    key={idx}
                    className="bg-[#D4AF37] h-full"
                    style={{ width: `${w * 1.5}px` }}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

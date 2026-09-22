"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { IUserBooking } from "@/helpers/next-fetch/bookingActions";
import { DashboardTicketPass } from "@/features/dashboard/bookings/DashboardTicketPass";

interface TicketPageClientProps {
  booking: IUserBooking;
  lang: string;
}

export function TicketPageClient({ booking, lang }: TicketPageClientProps) {
  const isHt = lang === "ht";
  const ticketCode =
    booking.ticketCode || `IFA-${booking._id.slice(-6).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: `${booking.event?.title || "Event"} Admission Pass`,
          text: `Official Event Ticket Pass #${ticketCode}`,
          url,
        });
      } else {
        navigator.clipboard.writeText(url);
        toast.success(
          isHt
            ? "Lyen paspò a kopye!"
            : "Ticket pass link copied to clipboard!",
        );
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream text-forest-deep flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32">
      {/* ABSOLUTE CIRCULAR GRADIENTS IN LOW OPACITY */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Circle 1: Top-Left */}
        <div className="absolute -top-20 -left-20 h-95 w-95 rounded-full bg-forest/8 blur-3xl" />
        {/* Circle 2: Top-Right */}
        <div className="absolute top-16 -right-24 h-110 w-110 rounded-full bg-forest/[0.07] blur-3xl" />
        {/* Circle 3: Center-Left */}
        <div className="absolute top-1/2 -left-28 h-115 w-115 -translate-y-1/2 rounded-full bg-forest/6 blur-3xl" />
        {/* Circle 4: Bottom-Right */}
        <div className="absolute -bottom-24 -right-16 h-125 w-125 rounded-full bg-forest/8 blur-3xl" />
        {/* Circle 5: Bottom-Center */}
        <div className="absolute -bottom-20 left-1/3 h-100 w-100 rounded-full bg-forest/5 blur-3xl" />
      </div>

      {/* 1. TOP CONTROLS (Padded below navbar, border-free, elevated z-index) */}
      <div className="print:hidden relative z-20 px-4 pb-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Back Action & Title */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl border-hairline bg-white/80 text-forest-deep hover:bg-sand-soft hover:text-forest-deep shadow-xs cursor-pointer"
            >
              <Link href={`/${lang}/dashboard/my-bookings`}>
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                <span>{isHt ? "Rezèvasyon Mwen" : "My Bookings"}</span>
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <span className="font-display text-sm sm:text-base font-bold text-forest-deep hidden sm:inline">
                {isHt ? "Paspò Ofisyèl" : "Official Admission Pass"}
              </span>
              <span className="font-mono text-xs font-bold text-forest bg-forest/10 border border-forest/20 px-2.5 py-0.5 rounded-md">
                {ticketCode}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleShare}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-white/80 px-3.5 py-2 text-xs font-semibold text-forest-deep hover:bg-sand-soft cursor-pointer transition shadow-xs"
            >
              <Share2 className="h-3.5 w-3.5 text-forest" />
              <span>{isHt ? "Pataje" : "Share"}</span>
            </button>

            <Button
              type="button"
              onClick={handlePrint}
              size="sm"
              className="rounded-xl font-bold bg-forest hover:bg-forest-deep text-white shadow-md cursor-pointer transition"
            >
              <Printer className="h-4 w-4 mr-2 text-white" />
              <span>
                {isHt
                  ? "Enprime / Telechaje PDF"
                  : "Print / Download Ticket (PDF)"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. CENTER TICKET DISPLAY */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12">
        <div className="w-full max-w-4xl print:max-w-none print:w-full print:m-0">
          <DashboardTicketPass booking={booking} lang={lang} />
        </div>
      </main>

      {/* 3. FOOTER INSTRUCTIONS (Hidden during print) */}
      <footer className="print:hidden relative z-10 py-6 text-center text-xs text-mist">
        <p>
          {isHt
            ? "Tanpri prezante paspò sa a sou telefòn ou oswa vèsyon enprime a nan biwo enskripsyon an."
            : "Present this pass on your mobile device or printed ticket at the venue check-in desk."}
        </p>
        <p className="text-[11px] text-faint mt-1">
          iFundAyiti • Empowering Haitian Innovation Across the Globe
        </p>
      </footer>
    </div>
  );
}

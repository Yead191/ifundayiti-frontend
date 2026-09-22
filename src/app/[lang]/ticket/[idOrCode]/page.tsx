import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Ticket } from "lucide-react";
import {
  getBookingDetails,
  getMyBookings,
  type IUserBooking,
} from "@/helpers/next-fetch/bookingActions";
import { buildMetadata } from "@/lib/seo";
import { TicketPageClient } from "./TicketPageClient";

interface PageProps {
  params: Promise<{
    lang: string;
    idOrCode: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, idOrCode } = await params;

  return buildMetadata({
    title: `Official Admission Pass | iFundAyiti`,
    description: `Official ticket pass for gathering admission #${idOrCode}.`,
    path: `/${lang}/ticket/${idOrCode}`,
    noIndex: true,
  });
}

export default async function TicketPage({ params }: PageProps) {
  const { lang, idOrCode } = await params;

  let booking: IUserBooking | null = null;

  // 1. Try finding by ID directly
  const res = await getBookingDetails(idOrCode);
  if (res.success && res.data) {
    booking = res.data;
  }

  // 2. If not found by ID (e.g. ticket code was passed), search by code
  if (!booking) {
    const listRes = await getMyBookings({ searchTerm: idOrCode, limit: 1 });
    if (listRes.success && listRes.data && listRes.data.length > 0) {
      booking = listRes.data[0];
    }
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-cream text-forest-deep flex items-center justify-center p-6 pt-28 sm:pt-32">
        <div className="max-w-md w-full text-center space-y-5 rounded-3xl border border-hairline/80 bg-white/90 p-8 shadow-xl backdrop-blur-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest">
            <Ticket className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-forest-deep">
              Ticket Pass Not Found
            </h2>
            <p className="text-xs text-mist mt-2 leading-relaxed">
              We couldn&apos;t locate an admission pass for{" "}
              <strong className="text-forest font-mono">{idOrCode}</strong>.
              Please check your confirmation email or log into your account to access your bookings.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href={`/${lang}/dashboard/my-bookings`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3 text-xs font-bold text-white hover:bg-forest-deep transition shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go to My Bookings</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <TicketPageClient booking={booking} lang={lang} />;
}

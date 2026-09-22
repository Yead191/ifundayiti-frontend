import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Ticket } from "lucide-react";

import { getBookingDetails } from "@/helpers/next-fetch/bookingActions";
import { BookingDetailView } from "@/features/dashboard/bookings/BookingDetailView";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const isHt = lang === "ht";

  try {
    const res = await getBookingDetails(id);
    const booking = res.data;
    const title = booking?.event?.title
      ? `${booking.event.title} · ${isHt ? "Detay Rezèvasyon" : "Booking Details"}`
      : isHt
        ? "Detay Rezèvasyon · Tablodbò"
        : "Booking Details · Dashboard";

    return buildMetadata({
      title,
      description: isHt
        ? "Gade tout detay sou rezèvasyon evènman sa a."
        : "View full details and entry pass for this event reservation.",
      path: `/${lang}/dashboard/my-bookings/${id}`,
      noIndex: true,
    });
  } catch {
    return buildMetadata({
      title: isHt ? "Detay Rezèvasyon" : "Booking Details",
      description: isHt
        ? "Gade tout detay sou rezèvasyon evènman sa a."
        : "View full details and entry pass for this event reservation.",
      path: `/${lang}/dashboard/my-bookings/${id}`,
      noIndex: true,
    });
  }
}

export default async function DashboardBookingDetailPage({
  params,
}: PageProps) {
  const { lang, id } = await params;
  const isHt = lang === "ht";

  const res = await getBookingDetails(id);
  const booking = res.success && res.data ? res.data : null;

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-hairline/80 bg-white/80 shadow-xs backdrop-blur-md space-y-4">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-sand-soft text-forest/50">
          <Ticket className="h-8 w-8 stroke-[1.5]" />
        </div>

        <div className="space-y-1 max-w-md">
          <h2 className="font-display text-lg font-bold text-forest-deep">
            {isHt
              ? "Nou pa jwenn rezèvasyon sa a"
              : "Reservation not found"}
          </h2>
          <p className="text-xs sm:text-sm text-mist leading-relaxed">
            {isHt
              ? "Tikè oswa rezèvasyon sa a pa egziste oswa ou pa gen otorizasyon pou wè l."
              : "This event reservation could not be found or you do not have permission to view it."}
          </p>
        </div>

        <Button asChild size="sm" className="rounded-xl px-4 text-xs font-semibold gap-1.5">
          <Link href={`/${lang}/dashboard/my-bookings`}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isHt ? "Tounen nan Lis la" : "Back to My Bookings"}</span>
          </Link>
        </Button>
      </div>
    );
  }

  return <BookingDetailView booking={booking} lang={lang} />;
}

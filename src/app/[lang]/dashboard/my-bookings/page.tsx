import type { Metadata } from "next";

import { getMyBookings } from "@/helpers/next-fetch/bookingActions";
import { BookingsListView } from "@/features/dashboard/bookings/BookingsListView";
import { DashboardPager } from "@/features/dashboard/pager";
import { buildMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchTerm?: string;
    status?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const isHt = lang === "ht";
  return buildMetadata({
    title: isHt ? "Rezèvasyon Mwen Yo · Tablodbò" : "My Event Bookings · Dashboard",
    description: isHt
      ? "Jere tout tikè ak rezèvasyon evènman ou nan IFundAyiti."
      : "Manage all your event passes and ticket reservations on IFundAyiti.",
    path: `/${lang}/dashboard/my-bookings`,
    noIndex: true,
  });
}

export default async function DashboardMyBookingsPage({
  params,
  searchParams,
}: PageProps) {
  const { lang } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const limit = Math.max(1, Number(sp.limit) || 12);
  const searchTerm = sp.searchTerm;
  const status = sp.status;

  const res = await getMyBookings({
    page,
    limit,
    searchTerm,
    status,
  });

  const bookings = res.success && Array.isArray(res.data) ? res.data : [];

  return (
    <div className="space-y-6">
      <BookingsListView bookings={bookings} lang={lang} />

      {res.pagination && res.pagination.totalPage > 1 && (
        <DashboardPager
          pagination={res.pagination}
          basePath={`/${lang}/dashboard/my-bookings`}
        />
      )}
    </div>
  );
}

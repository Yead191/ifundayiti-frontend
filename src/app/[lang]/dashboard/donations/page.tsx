import type { Metadata } from "next";

import {
  getDonations,
  getMyStats,
} from "@/helpers/next-fetch/donationActions";
import { DonationsView } from "@/features/dashboard/donations-view";
import { DashboardPager } from "@/features/dashboard/pager";
import { buildMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchTerm?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const isHt = lang === "ht";
  return buildMetadata({
    title: isHt ? "Donasyon Mwen Yo" : "My Donations",
    description: isHt
      ? "Gade tout don ak kontribisyon ou nan Fon Pwogram IFundAyiti."
      : "View all your past donations and contributions to the IFundAyiti Program Fund.",
    path: `/${lang}/dashboard/donations`,
    noIndex: true,
  });
}

export default async function DashboardDonationsPage({
  params,
  searchParams,
}: PageProps) {
  const { lang } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const limit = Math.max(1, Number(sp.limit) || 10);
  const searchTerm = sp.searchTerm;

  const [donationsRes, statsRes] = await Promise.all([
    getDonations({ page, limit, searchTerm }),
    getMyStats(),
  ]);

  const donations =
    donationsRes.success && Array.isArray(donationsRes.data)
      ? donationsRes.data
      : [];

  const totalDonation = statsRes.data?.myTotalDonation ?? 0;

  return (
    <div className="space-y-6">
      <DonationsView
        donations={donations}
        totalDonation={totalDonation}
        lang={lang}
      />
      {donationsRes.pagination && (
        <DashboardPager
          pagination={donationsRes.pagination}
          basePath={`/${lang}/dashboard/donations`}
        />
      )}
    </div>
  );
}

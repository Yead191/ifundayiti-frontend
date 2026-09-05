import type { Metadata } from "next";

import { getOrders } from "@/helpers/next-fetch/orderActions";
import { OrdersTable } from "@/features/dashboard/orders-table";
import { DashboardPager } from "@/features/dashboard/pager";
import { getDictionary } from "@/lib/dictionaries";
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
    title: isHt ? "Kòmand Mwen Yo" : "My Orders",
    description: isHt
      ? "Gade tout kòmand ak resi acha ou yo sou IFundAyiti."
      : "View all your past orders and purchase receipts on IFundAyiti.",
    path: `/${lang}/dashboard/orders`,
    noIndex: true,
  });
}

export default async function DashboardOrdersPage({
  params,
  searchParams,
}: PageProps) {
  const { lang } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const limit = Math.max(1, Number(sp.limit) || 10);
  const searchTerm = sp.searchTerm;
  const status = sp.status;

  const [dict, res] = await Promise.all([
    getDictionary(lang),
    getOrders({
      page,
      limit,
      searchTerm,
      status,
    }),
  ]);

  const orders = res.success && Array.isArray(res.data) ? res.data : [];

  return (
    <div className="space-y-6">
      <OrdersTable orders={orders} lang={lang} dict={dict} />
      <DashboardPager
        pagination={res.pagination}
        basePath={`/${lang}/dashboard/orders`}
      />
    </div>
  );
}

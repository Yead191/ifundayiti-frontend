import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Package, ShoppingBag } from "lucide-react";

import { getOrderById } from "@/helpers/next-fetch/orderActions";
import { OrderDetailView } from "@/features/dashboard/orders-table";
import { getDictionary } from "@/lib/dictionaries";
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
  return buildMetadata({
    title: isHt ? `Detay Kòmand #${id}` : `Order Details #${id}`,
    description: isHt
      ? "Detay konplè ak swivi livrezon kòmand ou a."
      : "Complete order details and delivery tracking.",
    path: `/${lang}/dashboard/orders/${id}`,
    noIndex: true,
  });
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { lang, id } = await params;
  const isHt = lang === "ht";

  const [dict, res] = await Promise.all([
    getDictionary(lang),
    getOrderById(id),
  ]);

  if (!res.success || !res.data) {
    return (
      <div className="rounded-3xl border border-hairline/80 bg-panel/50 p-10 text-center backdrop-blur-md sm:p-14">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-500/10 text-rose-400">
          <Package className="h-8 w-8" />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold text-cloud">
          {isHt ? "Nou pa jwenn kòmand sa a" : "Order Not Found"}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-xs text-mist leading-relaxed">
          {isHt
            ? "Kòmand ou t ap chèche a pa egziste oswa ou pa gen otorizasyon pou w wè li."
            : "The order you are looking for does not exist or you may not have permission to view it."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild size="sm" className="rounded-xl bg-forest text-xs font-bold">
            <Link href={`/${lang}/dashboard/orders`}>
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              {isHt ? "Retounen nan Kòmand Yo" : "Back to Orders"}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const order = res.data;
  const t = dict?.DashboardOrders || {};

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${lang}/dashboard/orders`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-mist hover:text-cloud transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.BackToOrders || (isHt ? "Retounen nan Kòmand Yo" : "Back to Orders")}</span>
        </Link>

        <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
          <Link href={`/${lang}/shop`}>
            <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
            {t.ShopNow || (isHt ? "Vizite Boutik la" : "Browse Shop")}
          </Link>
        </Button>
      </div>

      {/* Main Order Detail View */}
      <div className="rounded-3xl border border-hairline/80 bg-panel/60 p-6 backdrop-blur-md sm:p-8 shadow-md">
        <OrderDetailView
          order={order}
          lang={lang}
          dict={dict}
          isStandalone={true}
        />
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  Copy,
  Check,
  MapPin,
  CreditCard,
  Search,
  ArrowLeft,
  Printer,
  Calendar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { cn, formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PRE_ORDER_STATUS,
  type IOrder,
  type IOrderItem,
} from "@/types";

// Backwards-compatible type alias
export type DashboardOrder = IOrder;

interface OrdersTableProps {
  orders: IOrder[];
  lang?: string;
  dict?: any;
}

/**
 * Safely extracts only the first image index for an order item
 */
export function getItemFirstImage(item: IOrderItem): string | null {
  if (item?.image) {
    if (Array.isArray(item.image)) {
      return item.image[0] || null;
    }
    if (typeof item.image === "string" && item.image.trim()) {
      return item.image.trim();
    }
  }

  if (typeof item?.product === "object" && item.product !== null) {
    const prod = item.product as any;
    if (Array.isArray(prod.images) && prod.images.length > 0) {
      return prod.images[0] || null;
    }
    if (typeof prod.images === "string" && prod.images.trim()) {
      return prod.images.trim();
    }
    if (typeof prod.image === "string" && prod.image.trim()) {
      return prod.image.trim();
    }
  }

  return null;
}

export function OrdersTable({ orders = [], lang = "en", dict }: OrdersTableProps) {
  const isHt = lang === "ht";
  const t = dict?.DashboardOrders || {};

  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  function handleCopy(text: string, label: string) {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(
      isHt
        ? `${label} kopye avèk siksè!`
        : `${label} copied to clipboard!`,
    );
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Summary Metrics
  const metrics = React.useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter(
      (o) => (o.status as string) === ORDER_STATUS.DELIVERED,
    ).length;
    const inTransit = orders.filter(
      (o) =>
        (o.status as string) === ORDER_STATUS.SHIPPED ||
        (o.status as string) === ORDER_STATUS.PROCESSING ||
        (o.status as string) === ORDER_STATUS.CONFIRMED,
    ).length;
    const totalSpent = orders.reduce((sum, o) => {
      const price =
        o.price_breakdown?.total_price ??
        (o as any).total_amount ??
        0;
      return sum + (typeof price === "number" ? price : 0);
    }, 0);

    return { total, delivered, inTransit, totalSpent };
  }, [orders]);

  // Client-side filtering
  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== "all") {
        if ((order.status ?? "").toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }
      }

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchesId = (order.order_id || order._id || "")
          .toLowerCase()
          .includes(term);
        const matchesAddress = (order.formatted_address || "")
          .toLowerCase()
          .includes(term);
        const matchesPhone = (order.contact_number || "")
          .toLowerCase()
          .includes(term);
        const matchesItems = (order.items || []).some((i) =>
          (i.name || (i as any).title || "").toLowerCase().includes(term),
        );
        if (!matchesId && !matchesAddress && !matchesPhone && !matchesItems) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-bold tracking-tight text-cloud sm:text-3xl">
          {t.Title || (isHt ? "Kòmand Mwen Yo" : "My Orders")}
        </h1>
        <p className="text-sm text-mist">
          {t.Subtitle ||
            (isHt
              ? "Swiv livrezon ou yo, gade sa ou te achte, epi jwenn resi detaye kòmand ou yo."
              : "Track your shipments, review purchases, and view itemized order receipts.")}
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-hairline/80 bg-panel/80 p-4 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-mist">
              {t.TotalOrders || (isHt ? "Total Kòmand" : "Total Orders")}
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-forest/15 text-forest">
              <ShoppingBag className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-cloud">
            {metrics.total}
          </p>
        </div>

        <div className="rounded-2xl border border-hairline/80 bg-panel/80 p-4 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-mist">
              {t.InTransit || (isHt ? "Sou Wout" : "In Transit")}
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-forest/15 text-forest">
              <Truck className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-forest">
            {metrics.inTransit}
          </p>
        </div>

        <div className="rounded-2xl border border-hairline/80 bg-panel/80 p-4 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-mist">
              {t.Delivered || (isHt ? "Livre" : "Delivered")}
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/15 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600">
            {metrics.delivered}
          </p>
        </div>

        <div className="rounded-2xl border border-hairline/80 bg-panel/80 p-4 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-mist">
              {t.TotalSpent || (isHt ? "Total Depanse" : "Total Spent")}
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-500/15 text-amber-600">
              <CreditCard className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-amber-600">
            {formatPrice(metrics.totalSpent)}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-hairline/80 bg-panel/60 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              t.SearchPlaceholder ||
              (isHt
                ? "Chèche pa Nimewo Kòmand, non atik, oswa destinasyon..."
                : "Search by Order ID, item name, or destination...")
            }
            className="h-10 rounded-xl border-hairline bg-white pl-9 text-xs text-cloud placeholder:text-mist/70 focus:bg-white"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {[
            { id: "all", label: t.FilterAll || (isHt ? "Tout" : "All") },
            { id: "confirmed", label: t.FilterConfirmed || (isHt ? "Konfime" : "Confirmed") },
            { id: "processing", label: t.FilterProcessing || (isHt ? "Preparasyon" : "Processing") },
            { id: "shipped", label: t.FilterShipped || (isHt ? "Ekspedye" : "Shipped") },
            { id: "delivered", label: t.FilterDelivered || (isHt ? "Livre" : "Delivered") },
            { id: "cancelled", label: t.FilterCancelled || (isHt ? "Anile" : "Cancelled") },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                statusFilter === tab.id
                  ? "bg-forest text-white shadow-xs"
                  : "bg-white/60 text-mist hover:bg-white hover:text-forest border border-hairline/50",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-hairline/80 bg-panel/50 p-10 text-center backdrop-blur-md sm:p-14 shadow-xs">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-forest/10 text-forest">
            <Package className="h-8 w-8" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-cloud">
            {t.NoOrdersTitle || (isHt ? "Pa gen kòmand" : "No orders found")}
          </h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-mist leading-relaxed">
            {searchTerm || statusFilter !== "all"
              ? isHt
                ? "Pa gen okenn kòmand ki koresponn ak rechèch ou a. Eseye chanje filtè yo."
                : "No orders match your search or active filter. Try resetting your filters."
              : t.NoOrdersDesc ||
                (isHt
                  ? "Ou poko fè okenn kòmand. Eksplore boutik nou an pou w sipòte kreyatè ayisyen yo."
                  : "You haven't placed any orders yet. Explore our merchandise to support Haitian creators.")}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            {searchTerm || statusFilter !== "all" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="rounded-xl text-xs cursor-pointer"
              >
                {isHt ? "Reyajiste Filtè Yo" : "Reset Filters"}
              </Button>
            ) : (
              <Button asChild size="sm" className="rounded-xl bg-forest text-xs font-bold text-white shadow-xs">
                <Link href={`/${lang}/shop`}>
                  <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                  {t.ShopNow || (isHt ? "Vizite Boutik la" : "Browse Shop")}
                </Link>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const orderId = order.order_id || `#${order._id.slice(-8).toUpperCase()}`;
            const total =
              order.price_breakdown?.total_price ??
              (order as any).total_amount ??
              0;
            const items = order.items || [];
            const hasPreOrder = items.some((i) => i.isPreOrder);
            const detailUrl = `/${lang}/dashboard/orders/${order._id}`;

            return (
              <div
                key={order._id}
                className="group relative overflow-hidden rounded-3xl border border-hairline/80 bg-panel/75 p-5 transition-all duration-200 hover:border-forest/40 hover:bg-panel hover:shadow-md sm:p-6"
              >
                {/* Top bar: Order ID, Date, Badges */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline/60 pb-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={detailUrl}
                      className="font-mono text-sm font-bold text-cloud hover:text-forest transition-colors"
                    >
                      {orderId}
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleCopy(order.order_id || order._id, "Order ID")}
                      className="text-mist hover:text-forest transition-colors cursor-pointer"
                      title={isHt ? "Klike pou kopye" : "Click to copy"}
                    >
                      {copiedId === (order.order_id || order._id) ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {hasPreOrder && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        <Sparkles className="h-3 w-3" />
                        {t.PreOrder || (isHt ? "Pre-Kòmand" : "Pre-Order")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-mist">
                      <Calendar className="h-3.5 w-3.5 text-mist/70" />
                      {formatDate(order.createdAt, isHt)}
                    </span>

                    <OrderStatusBadge status={order.status} isHt={isHt} />
                    <PaymentStatusBadge status={order.payment_status} isHt={isHt} />
                  </div>
                </div>

                {/* Body: Items Preview & Pricing */}
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Item Thumbnails (Uses ONLY first index image) */}
                  <Link href={detailUrl} className="flex items-center gap-3 min-w-0 group/link">
                    <div className="flex -space-x-3 overflow-hidden py-1">
                      {items.slice(0, 4).map((item, idx) => {
                        const firstImage = getItemFirstImage(item);
                        const img = firstImage ? getImageUrl(firstImage) : null;
                        return (
                          <div
                            key={idx}
                            className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-sand-soft/40 shadow-2xs"
                          >
                            {img ? (
                              <Image
                                src={img}
                                alt={item.name || "Item"}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center bg-forest/10 text-forest">
                                <Package className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-cloud group-hover/link:text-forest transition-colors">
                        {items[0]?.name || "Mission Item"}
                        {items.length > 1 && (
                          <span className="ml-1.5 text-xs font-normal text-mist">
                            +{items.length - 1} {isHt ? "lòt" : "more"}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-mist">
                        {order.total_items || items.reduce((sum, i) => sum + (i.quantity || 1), 0)}{" "}
                        {isHt ? "atik total" : "items total"} ·{" "}
                        <span className="text-mist">{order.address_breakdown?.city || "Haiti"}</span>
                      </p>
                    </div>
                  </Link>

                  {/* Pricing and Action Button */}
                  <div className="flex items-center justify-between gap-4 border-t border-hairline/40 pt-3 sm:border-0 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-mist">
                        {t.TotalCol || (isHt ? "Total" : "Total")}
                      </p>
                      <p className="font-display text-lg font-bold text-forest">
                        {formatPrice(total)}
                      </p>
                    </div>

                    <Button
                      asChild
                      size="sm"
                      className="rounded-xl bg-forest hover:bg-forest-bright text-xs font-semibold text-white shadow-xs cursor-pointer"
                    >
                      <Link href={detailUrl}>
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        {t.ViewDetails || (isHt ? "Gade Detay" : "View Details")}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Complete Itemized Order Detail Component (Dedicated Full Page)
 * ------------------------------------------------------------------ */
export function OrderDetailView({
  order,
  lang = "en",
  dict,
}: {
  order: IOrder;
  lang?: string;
  dict?: any;
  onClose?: () => void;
  isStandalone?: boolean;
}) {
  const isHt = lang === "ht";
  const t = dict?.DashboardOrders || {};
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  function copyText(val: string, field: string) {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(val);
    setCopiedField(field);
    toast.success(isHt ? "Kopye avèk siksè!" : "Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  }

  const breakdown = order.price_breakdown;
  const totalPaid = breakdown?.total_price ?? (order as any).total_amount ?? 0;
  const delivery = breakdown?.delivery_charge ?? 0;
  const tax = breakdown?.tax ?? 0;
  const subtotal = breakdown?.subtotal ?? (totalPaid - delivery - tax);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner with Status & Delivery Tracker */}
      <div className="rounded-3xl border border-hairline/80 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-cloud">
                {order.order_id || `#${order._id.slice(-8).toUpperCase()}`}
              </span>
              <button
                type="button"
                onClick={() => copyText(order.order_id || order._id, "order_id")}
                className="text-mist hover:text-forest transition-colors cursor-pointer"
                title={isHt ? "Kopye Nimewo Kòmand" : "Copy Order ID"}
              >
                {copiedField === "order_id" ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-0.5 text-xs text-mist">
              {t.PlacedOn || (isHt ? "Fèt le" : "Placed on")}{" "}
              {formatDate(order.createdAt, isHt)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} isHt={isHt} />
            <PaymentStatusBadge status={order.payment_status} isHt={isHt} />
          </div>
        </div>

        {/* Delivery Progress Timeline Tracker */}
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-mist">
            {t.DeliveryTimeline || (isHt ? "Kalandriye Livrezon" : "Delivery Timeline")}
          </p>
          <DeliveryTimelineTracker status={order.status} isHt={isHt} t={t} />
        </div>
      </div>

      {/* 2. Itemized Product List */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-forest">
          {t.ItemsOrdered || (isHt ? "Atik Ou Kòmande" : "Items Ordered")} (
          {order.items?.length || 0})
        </p>

        <div className="space-y-2.5">
          {(order.items || []).map((item: IOrderItem, index: number) => {
            // Uses only the first image index for each item
            const firstImage = getItemFirstImage(item);
            const image = firstImage ? getImageUrl(firstImage) : null;

            return (
              <div
                key={index}
                className="flex items-center gap-3.5 rounded-2xl border border-hairline/80 bg-white p-3 sm:p-4 shadow-2xs hover:border-forest/30 transition-colors"
              >
                {/* Image (first index) */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-hairline bg-sand-soft/30 shadow-2xs">
                  {image ? (
                    <Image
                      src={image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-forest/10 text-forest">
                      <Package className="h-6 w-6" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-semibold text-cloud truncate">
                      {item.name}
                    </p>

                    {item.isPreOrder && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        <Sparkles className="h-3 w-3" />
                        {t.PreOrder || (isHt ? "Pre-Kòmand" : "Pre-Order")}
                        {item.preOrderStatus === PRE_ORDER_STATUS.READY && (
                          <span className="text-emerald-600 font-bold ml-1">
                            ({t.PreOrderReady || (isHt ? "Pare" : "Ready")})
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Variant Pills */}
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-mist">
                    {item.size && (
                      <span className="rounded-md border border-hairline/60 bg-sand-soft/50 px-1.5 py-0.5 text-[11px] font-medium text-cloud">
                        {t.Size || "Size"}: {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="rounded-md border border-hairline/60 bg-sand-soft/50 px-1.5 py-0.5 text-[11px] font-medium text-cloud">
                        {t.Color || "Color"}: {item.color}
                      </span>
                    )}
                    <span>
                      {t.Qty || "Qty"}: {item.quantity} × {formatPrice(item.price)}
                    </span>
                  </div>

                  {item.isPreOrder && item.expectedAvailableDate && (
                    <p className="mt-1 text-[11px] text-amber-700 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {t.ExpectedDate || (isHt ? "Disponib vè" : "Expected by")}:{" "}
                      {formatDate(String(item.expectedAvailableDate), isHt)}
                    </p>
                  )}
                </div>

                {/* Line Total */}
                <div className="text-right shrink-0">
                  <p className="font-display text-sm font-bold text-forest">
                    {formatPrice(item.total_price || item.price * item.quantity)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Two-Column Grid: Shipping & Pricing */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Shipping Destination */}
        <div className="rounded-2xl border border-hairline/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-hairline/60 pb-2.5">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forest">
              <MapPin className="h-3.5 w-3.5" />
              {t.ShippingDestination || (isHt ? "Adrès Livrezon" : "Shipping Destination")}
            </span>
            <button
              type="button"
              onClick={() => copyText(order.formatted_address, "address")}
              className="flex items-center gap-1 text-[11px] text-mist hover:text-forest transition-colors cursor-pointer"
            >
              {copiedField === "address" ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">
                    {t.AddressCopied || "Copied!"}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>{t.CopyAddress || "Copy"}</span>
                </>
              )}
            </button>
          </div>

          <p className="mt-3 text-sm text-cloud leading-relaxed">
            {order.formatted_address || "—"}
          </p>

          <div className="mt-3 flex items-center gap-2 border-t border-hairline/40 pt-2.5 text-xs text-mist">
            <span className="font-semibold text-cloud">
              {t.ContactPhone || "Phone"}:
            </span>
            <span>{order.contact_number || "—"}</span>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="rounded-2xl border border-hairline/80 bg-white p-4 shadow-2xs">
          <div className="border-b border-hairline/60 pb-2.5">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forest">
              <CreditCard className="h-3.5 w-3.5" />
              {t.PaymentBreakdown || (isHt ? "Detay Peman" : "Payment Breakdown")}
            </span>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between text-mist">
              <span>{t.Subtotal || (isHt ? "Total Pwodui" : "Subtotal")}</span>
              <span className="font-semibold text-cloud">{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between text-mist">
              <span>{t.DeliveryCharge || (isHt ? "Livrezon" : "Delivery")}</span>
              <span className="font-semibold text-cloud">
                {delivery === 0 ? (
                  <span className="text-forest font-bold">
                    {t.Free || "Free"}
                  </span>
                ) : (
                  formatPrice(delivery)
                )}
              </span>
            </div>

            <div className="flex justify-between text-mist">
              <span>{t.Tax || (isHt ? "Taks Estimasyon" : "Tax")}</span>
              <span className="font-semibold text-cloud">{formatPrice(tax)}</span>
            </div>

            {breakdown?.discount_amount && breakdown.discount_amount > 0 ? (
              <div className="flex justify-between text-forest font-semibold">
                <span>Discount</span>
                <span>−{formatPrice(breakdown.discount_amount)}</span>
              </div>
            ) : null}

            <div className="border-t border-hairline/60 pt-2 flex items-baseline justify-between">
              <span className="text-xs font-bold text-cloud uppercase tracking-wider">
                {t.TotalPaid || (isHt ? "Total Peye" : "Total Paid")}
              </span>
              <span className="font-display text-lg font-bold text-forest">
                {formatPrice(totalPaid)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Payment Security & Stripe Reference */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline/80 bg-forest/5 p-3.5 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-forest shrink-0" />
          <span className="text-mist font-medium">
            {t.StripeCard || (isHt ? "Kat Kredi / Debi via Stripe" : "Credit / Debit Card via Stripe")}
          </span>
        </div>

        {order.payment_intent_id && (
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-mist">
            <span>{t.StripeTxn || "Ref"}:</span>
            <span className="text-cloud font-semibold">{order.payment_intent_id.slice(0, 16)}...</span>
          </div>
        )}
      </div>

      {/* 5. Footer Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="rounded-xl border-hairline text-xs font-semibold cursor-pointer"
        >
          <Printer className="mr-1.5 h-3.5 w-3.5" />
          {t.PrintReceipt || (isHt ? "Enprime Resi" : "Print Receipt")}
        </Button>

        <Button asChild size="sm" className="rounded-xl bg-forest hover:bg-forest-bright text-xs font-bold text-white shadow-xs">
          <Link href={`/${lang}/dashboard/orders`}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            {t.BackToOrders || (isHt ? "Retounen nan Kòmand Yo" : "Back to Orders")}
          </Link>
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Delivery Timeline Component
 * ------------------------------------------------------------------ */
function DeliveryTimelineTracker({
  status = ORDER_STATUS.CONFIRMED,
  isHt = false,
  t = {},
}: {
  status?: string;
  isHt?: boolean;
  t?: any;
}) {
  const s = (status ?? "").toLowerCase();
  const isCancelled = s === ORDER_STATUS.CANCELLED;

  const steps = [
    {
      id: "placed",
      label: t.StepPlaced || (isHt ? "Kòmand Fèt" : "Order Placed"),
      icon: CheckCircle2,
    },
    {
      id: "confirmed",
      label: t.StepConfirmed || (isHt ? "Peman Konfime" : "Payment Confirmed"),
      icon: CheckCircle2,
    },
    {
      id: "processing",
      label: t.StepProcessing || (isHt ? "Preparasyon" : "Processing"),
      icon: Clock,
    },
    {
      id: "shipped",
      label: t.StepShipped || (isHt ? "Ekspedye" : "In Transit"),
      icon: Truck,
    },
    {
      id: "delivered",
      label: t.StepDelivered || (isHt ? "Livre" : "Delivered"),
      icon: CheckCircle2,
    },
  ];

  function getStepStatus(stepIndex: number): "completed" | "current" | "upcoming" {
    if (isCancelled) return "upcoming";

    let activeIndex = 1;
    if (s === ORDER_STATUS.PENDING) activeIndex = 0;
    else if (s === ORDER_STATUS.CONFIRMED) activeIndex = 1;
    else if (s === ORDER_STATUS.PROCESSING) activeIndex = 2;
    else if (s === ORDER_STATUS.SHIPPED) activeIndex = 3;
    else if (s === ORDER_STATUS.DELIVERED) activeIndex = 4;

    if (stepIndex < activeIndex) return "completed";
    if (stepIndex === activeIndex) return "current";
    return "upcoming";
  }

  if (isCancelled) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600">
        <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
        <span>
          {t.StepCancelled || (isHt ? "Kòmand sa a te anile." : "This order has been cancelled.")}
        </span>
      </div>
    );
  }

  return (
    <div className="mt-4 relative">
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {steps.map((step, idx) => {
          const state = getStepStatus(idx);
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center text-center">
              {/* Milestone Icon */}
              <div
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full border-2 transition-all duration-300",
                  state === "completed" &&
                    "border-forest bg-forest text-white shadow-xs",
                  state === "current" &&
                    "border-forest bg-forest/20 text-forest ring-4 ring-forest/20 animate-pulse",
                  state === "upcoming" &&
                    "border-hairline bg-sand-soft/40 text-mist/60",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-[10px] sm:text-[11px] font-semibold leading-tight",
                  state === "completed" && "text-forest",
                  state === "current" && "text-forest font-bold",
                  state === "upcoming" && "text-mist/70",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Badges & Formatters
 * ------------------------------------------------------------------ */
function OrderStatusBadge({ status = "pending", isHt = false }: { status?: string; isHt?: boolean }) {
  const s = (status ?? "").toLowerCase();

  const config: Record<string, { label: string; className: string }> = {
    [ORDER_STATUS.CONFIRMED]: {
      label: isHt ? "Konfime" : "Confirmed",
      className: "border-forest/30 bg-forest/10 text-forest",
    },
    [ORDER_STATUS.PROCESSING]: {
      label: isHt ? "Preparasyon" : "Processing",
      className: "border-amber-500/30 bg-amber-500/10 text-amber-700",
    },
    [ORDER_STATUS.SHIPPED]: {
      label: isHt ? "Ekspedye" : "Shipped",
      className: "border-indigo-500/30 bg-indigo-500/10 text-indigo-700",
    },
    [ORDER_STATUS.DELIVERED]: {
      label: isHt ? "Livre" : "Delivered",
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
    },
    [ORDER_STATUS.CANCELLED]: {
      label: isHt ? "Anile" : "Cancelled",
      className: "border-rose-500/30 bg-rose-500/10 text-rose-700",
    },
    [ORDER_STATUS.PENDING]: {
      label: isHt ? "An Atant" : "Pending",
      className: "border-hairline bg-sand-soft/50 text-mist",
    },
  };

  const current = config[s] || {
    label: status.toUpperCase(),
    className: "border-hairline bg-sand-soft/50 text-mist",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
        current.className,
      )}
    >
      {current.label}
    </span>
  );
}

function PaymentStatusBadge({ status = "paid", isHt = false }: { status?: string; isHt?: boolean }) {
  const s = (status ?? "").toLowerCase();
  const isPaid = s === PAYMENT_STATUS.PAID;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        isPaid
          ? "border-forest/30 bg-forest/10 text-forest font-semibold"
          : "border-amber-400/30 bg-amber-400/10 text-amber-700",
      )}
    >
      {isPaid && <Check className="h-3 w-3 text-forest" />}
      {isPaid ? (isHt ? "Peye" : "Paid") : isHt ? "An Atant" : "Pending"}
    </span>
  );
}

function formatDate(iso?: string, isHt = false) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(isHt ? "ht-HT" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

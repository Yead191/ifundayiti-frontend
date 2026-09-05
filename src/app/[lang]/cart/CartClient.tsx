"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import type { CartData, ICartItem, IPriceBreakdown } from "@/types";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  updateCartQuantity,
  removeCartItem,
  clearCart,
} from "@/helpers/next-fetch/cartActions";

interface CartClientProps {
  cart: CartData | null;
  lang: string;
  dict?: any;
}

const CART_FALLBACK_I18N = {
  en: {
    Home: "Home",
    Shop: "Shop",
    Eyebrow: "Shopping Bag",
    Title: "Review Your Cart",
    Subtitle:
      "Verify your selected apparel and variants before continuing to secure checkout.",
    EmptyTitle: "Your bag is currently empty",
    EmptySubtitle:
      "Explore the IFundAyiti apparel collection. Every piece directly funds equity-free micro-grants for Haitian entrepreneurs and neighborhood builders.",
    ExploreBtn: "Explore Collection",
    ReturnHome: "Return to Home",
    FastDelivery: "Fast islandwide delivery",
    EasyExchange: "30-day exchange",
    GrantImpactBadge: "100% grant impact",
    ItemsInBag: "Items in Bag",
    ItemInBag: "Item in Bag",
    ProductDetails: "Product Details",
    Total: "Total",
    Each: "each",
    Size: "Size:",
    Color: "Color:",
    PreOrder: "Pre-Order",
    MaxStockReached: "Max in-stock reached",
    ContinueShopping: "Continue Shopping",
    ClearBag: "Clear entire shopping bag",
    ClearBagBtn: "Clear Bag",
    FreeShippingCongrat:
      "🎉 Congratulations! Your order qualifies for Free Standard Delivery.",
    FreeShippingAddMore:
      "Add [amount] more of merchandise to unlock Free Standard Delivery!",
    Unlocked: "Unlocked",
    ImpactTitle: "100% Transparent Community Impact",
    ImpactDesc:
      "Every dollar generated from IFundAyiti apparel directly sustains our equity-free micro-grant program for local Haitian creators, tradespeople, and innovators.",
    OrderSummary: "Order Summary",
    Subtotal: "Products Subtotal",
    Delivery: "Delivery Charge",
    Free: "Free",
    Tax: "Estimated Tax (8.875%)",
    Discount: "Applied Discount",
    GrandTotal: "Grand Total",
    IncludingTaxDelivery: "Including tax & delivery",
    ProceedToCheckout: "Proceed to Checkout",
    EncryptedStripe: "256-Bit Encrypted & Stripe Secured",
    ExchangeGuarantee: "30-Day Hassle-Free Exchange",
    HaveQuestions: "Questions about your order?",
    ContactSupport: "Contact Support",
    ClearModalTitle: "Clear Shopping Bag",
    ClearModalDesc:
      "Are you sure you want to remove all items from your shopping bag? This cannot be undone.",
    Cancel: "Cancel",
    Clearing: "Clearing...",
    ConfirmClear: "Yes, Clear Bag",
  },
  ht: {
    Home: "Akèy",
    Shop: "Boutik",
    Eyebrow: "Panyen Acha",
    Title: "Revize Panyen Ou",
    Subtitle:
      "Verifye rad ak modèl ou chwazi yo anvan ou kontinye nan peman an sekirite.",
    EmptyTitle: "Panyen ou vid kounye a",
    EmptySubtitle:
      "Eksplore koleksyon rad IFundAyiti. Chak pyès finanse sibvansyon san enterè dirèkteman pou antreprenè ayisyen ak kreyatè lokal yo.",
    ExploreBtn: "Eksplore Koleksyon an",
    ReturnHome: "Retounen nan Akèy",
    FastDelivery: "Livrezon rapid sou tout zile a",
    EasyExchange: "Echanj pandan 30 jou",
    GrantImpactBadge: "100% enpak sibvansyon",
    ItemsInBag: "Atik nan Panyen an",
    ItemInBag: "Atik nan Panyen an",
    ProductDetails: "Detay Pwodwi",
    Total: "Total",
    Each: "pa inite",
    Size: "Gwosè:",
    Color: "Koulè:",
    PreOrder: "Pre-Kòmand",
    MaxStockReached: "Limit stock disponib atenn",
    ContinueShopping: "Kontinye Achte",
    ClearBag: "Vide tout panyen an",
    ClearBagBtn: "Vide Panyen an",
    FreeShippingCongrat:
      "🎉 Felisitasyon! Kòmand ou kalifye pou Livrezon Estanda Gratis.",
    FreeShippingAddMore:
      "Ajoute [amount] ankò nan machandiz pou w debloke Livrezon Estanda Gratis!",
    Unlocked: "Debloke",
    ImpactTitle: "100% Enpak Kominotè Transparan",
    ImpactDesc:
      "Chak dola ki soti nan rad IFundAyiti ale dirèkteman pou soutni pwogram mikwo-sibvansyon san enterè pou kreyatè, atizan ak inovatè ayisyen.",
    OrderSummary: "Rezime Kòmand",
    Subtotal: "Sou-total Pwodwi yo",
    Delivery: "Frè Livrezon",
    Free: "Gratis",
    Tax: "Taks Estimasyon (8.875%)",
    Discount: "Rabè Aplike",
    GrandTotal: "Total Jeneral",
    IncludingTaxDelivery: "Avèk taks ak livrezon ladan l",
    ProceedToCheckout: "Kontinye nan Peman",
    EncryptedStripe: "Chifreman 256-Bit & Sekirize pa Stripe",
    ExchangeGuarantee: "Garanti Echanj pandan 30 Jou",
    HaveQuestions: "Ou gen kesyon sou kòmand ou?",
    ContactSupport: "Kontakte Sipò",
    ClearModalTitle: "Vide Panyen Acha a",
    ClearModalDesc:
      "Èske ou sèten ou vle retire tout atik nan panyen acha w la? Aksyon sa a pa ka defèt.",
    Cancel: "Anile",
    Clearing: "N ap vide...",
    ConfirmClear: "Wi, Vide Panyen an",
  },
};

export function CartClient({ cart: serverCart, lang, dict }: CartClientProps) {
  const router = useRouter();
  const isHt = lang === "ht";
  const defaultI18n = isHt ? CART_FALLBACK_I18N.ht : CART_FALLBACK_I18N.en;
  const t = { ...defaultI18n, ...(dict?.Cart || {}) };

  // Optimistic items & breakdown synced with server
  const [items, setItems] = React.useState<ICartItem[]>(serverCart?.cart ?? []);
  const [priceBreakdown, setPriceBreakdown] = React.useState<
    IPriceBreakdown | undefined
  >(serverCart?.price_breakdown);
  const [updatingIds, setUpdatingIds] = React.useState<Set<string>>(new Set());
  const [clearModalOpen, setClearModalOpen] = React.useState(false);
  const [clearing, setClearing] = React.useState(false);

  React.useEffect(() => {
    setItems(serverCart?.cart ?? []);
    setPriceBreakdown(serverCart?.price_breakdown);
  }, [serverCart]);

  const isBusy = (id: string) => updatingIds.has(id);

  // Compute live breakdown directly from API response
  const subtotal =
    priceBreakdown?.subtotal ??
    priceBreakdown?.products_price ??
    items.reduce(
      (sum, item) =>
        sum + (item.total_price || item.unit_price * item.quantity),
      0,
    );
  const deliveryCharge =
    priceBreakdown != null
      ? priceBreakdown.delivery_charge
      : items.length === 0
        ? 0
        : subtotal >= 150
          ? 0
          : 11.99;
  const tax =
    priceBreakdown != null
      ? priceBreakdown.tax
      : Number((subtotal * 0.08875).toFixed(2));
  const serviceFee = priceBreakdown?.serviceFee ?? 0;
  const discountAmount = priceBreakdown?.discount_amount ?? 0;
  const cartTotal =
    priceBreakdown?.total_price ??
    Math.max(0, subtotal + deliveryCharge + tax + serviceFee - discountAmount);
  const cartCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // Free shipping threshold ($150.00)
  const FREE_SHIPPING_THRESHOLD = 150;
  const shippingFreeProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100),
  );
  const amountNeededForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal,
  );

  async function handleQty(id: string, delta: 1 | -1) {
    const currentItem = items.find((i) => i._id === id);
    if (!currentItem) return;

    // Check stock limit on increase
    if (delta === 1) {
      const variant = currentItem.product?.variants?.find(
        (v) => v.size === currentItem.size && v.color === currentItem.color,
      );
      if (
        variant &&
        variant.stock != null &&
        currentItem.quantity >= variant.stock &&
        !variant.isPreOrder
      ) {
        toast.error(
          isHt
            ? `Limit stock la rive (${variant.stock} disponib).`
            : `Maximum available stock reached (${variant.stock} available).`,
        );
        return;
      }
    }

    setUpdatingIds((prev) => new Set(prev).add(id));

    // Optimistic local update
    const previous = [...items];
    const newQty = currentItem.quantity + delta;
    if (newQty <= 0) {
      setItems((prev) => prev.filter((i) => i._id !== id));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i._id === id
            ? {
                ...i,
                quantity: newQty,
                total_price: Number((i.unit_price * newQty).toFixed(2)),
              }
            : i,
        ),
      );
    }

    try {
      const res = await updateCartQuantity(id, delta);
      if (!res.success) {
        setItems(previous);
        toast.error(
          res.message ||
            (isHt
              ? "Pa t kapab chanje kantite a."
              : "Could not update quantity."),
        );
        return;
      }
      if (res.data?.price_breakdown) {
        setPriceBreakdown(res.data.price_breakdown);
      }
      if (res.data?.cart) {
        setItems(res.data.cart);
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      setItems(previous);
      toast.error(
        isHt
          ? "Erè rezo pandan n ap mete kantite a ajou."
          : "Network error while updating quantity.",
      );
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  async function handleRemove(id: string) {
    setUpdatingIds((prev) => new Set(prev).add(id));
    const previous = [...items];
    setItems((prev) => prev.filter((i) => i._id !== id));

    try {
      const res = await removeCartItem(id);
      if (!res.success) {
        setItems(previous);
        toast.error(
          res.message ||
            (isHt ? "Pa t kapab retire atik la." : "Failed to remove item."),
        );
        return;
      }
      toast.success(
        isHt ? "Atik la retire nan panyen an." : "Item removed from bag.",
      );
      router.refresh();
    } catch (err) {
      console.error(err);
      setItems(previous);
      toast.error(
        isHt
          ? "Erè rezo pandan n ap retire atik la."
          : "Network error while removing item.",
      );
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  async function handleConfirmClear() {
    setClearing(true);
    const previous = [...items];
    setItems([]);

    try {
      const res = await clearCart();
      if (!res.success) {
        setItems(previous);
        toast.error(
          res.message ||
            (isHt ? "Pa t kapab vide panyen an." : "Failed to clear cart."),
        );
        return;
      }
      toast.success(
        isHt ? "Panyen an vide avèk siksè." : "Shopping bag cleared.",
      );
      setClearModalOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      setItems(previous);
      toast.error(
        isHt
          ? "Erè rezo pandan n ap vide panyen an."
          : "Network error while clearing cart.",
      );
    } finally {
      setClearing(false);
    }
  }

  // 1. EMPTY STATE
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-28 pb-24 md:pt-36 md:pb-32">
        <Container>
          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center gap-2 text-xs font-semibold text-mist">
            <Link
              href={`/${lang}`}
              className="hover:text-forest-deep transition-colors"
            >
              {t.Home}
            </Link>
            <span className="text-faint">/</span>
            <Link
              href={`/${lang}/shop`}
              className="hover:text-forest-deep transition-colors"
            >
              {t.Shop}
            </Link>
            <span className="text-faint">/</span>
            <span className="text-forest-deep font-bold">{t.Eyebrow}</span>
          </nav>

          <div className="mx-auto max-w-xl rounded-3xl border border-hairline/80 bg-white/95 p-8 text-center shadow-sm sm:p-14 backdrop-blur-md">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-sand-soft text-forest shadow-inner">
              <ShoppingBag className="h-10 w-10 text-forest" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-forest">
              {t.Eyebrow}
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-forest-deep sm:text-3xl">
              {t.EmptyTitle}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist">
              {t.EmptySubtitle}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto rounded-xl px-8 shadow-sm"
              >
                <Link href={`/${lang}/shop`}>
                  {t.ExploreBtn}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-xl px-8"
              >
                <Link href={`/${lang}`}>{t.ReturnHome}</Link>
              </Button>
            </div>

            {/* Trust guarantees pill */}
            <div className="mt-10 pt-8 border-t border-hairline/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2.5 text-xs text-forest-deep">
                <Truck className="h-4 w-4 text-forest shrink-0" />
                <span>{t.FastDelivery}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-forest-deep">
                <RotateCcw className="h-4 w-4 text-forest shrink-0" />
                <span>{t.EasyExchange}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-forest-deep">
                <Sparkles className="h-4 w-4 text-forest shrink-0" />
                <span>{t.GrantImpactBadge}</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // 2. ACTIVE CART VIEW
  return (
    <div className="min-h-screen bg-cream pt-28 pb-24 md:pt-32 md:pb-32">
      <Container>
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-mist">
          <Link
            href={`/${lang}`}
            className="hover:text-forest-deep transition-colors"
          >
            {t.Home}
          </Link>
          <span className="text-faint">/</span>
          <Link
            href={`/${lang}/shop`}
            className="hover:text-forest-deep transition-colors"
          >
            {t.Shop}
          </Link>
          <span className="text-faint">/</span>
          <span className="text-forest-deep font-bold">{t.Eyebrow}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-hairline/80 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-forest/10 text-forest">
                <ShoppingBag className="h-4 w-4" />
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-forest">
                {t.Eyebrow}
              </p>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-forest-deep sm:text-4xl">
              {t.Title}
            </h1>
            <p className="mt-1 text-sm text-mist">{t.Subtitle}</p>
          </div>

          {/* Header Actions: Items count badge + Noticeable Clear Cart button */}
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-forest/20 bg-forest/5 px-4 py-1.5 text-xs font-bold text-forest">
              {cartCount} {cartCount === 1 ? t.ItemInBag : t.ItemsInBag}
            </span>

            {/* Prominent Clear Cart Button in Page Header */}
            <button
              type="button"
              onClick={() => setClearModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/80 px-3.5 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100 hover:border-red-300 hover:text-red-700 shadow-2xs cursor-pointer active:scale-95"
              title={t.ClearBag}
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
              <span>{t.ClearBagBtn}</span>
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="mb-8 rounded-2xl border border-hairline/80 bg-white/90 p-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-forest-deep font-medium">
              <Truck className="h-4 w-4 text-forest shrink-0" />
              {amountNeededForFreeShipping === 0 ? (
                <span className="font-bold text-forest">
                  {t.FreeShippingCongrat}
                </span>
              ) : (
                <span>
                  {t.FreeShippingAddMore?.includes("[amount]") ? (
                    <>
                      {t.FreeShippingAddMore.split("[amount]")[0]}
                      <strong className="text-forest font-bold">
                        {formatPrice(amountNeededForFreeShipping)}
                      </strong>
                      {t.FreeShippingAddMore.split("[amount]")[1]}
                    </>
                  ) : (
                    <>
                      Add{" "}
                      <strong className="text-forest font-bold">
                        {formatPrice(amountNeededForFreeShipping)}
                      </strong>{" "}
                      more to unlock Free Delivery!
                    </>
                  )}
                </span>
              )}
            </div>
            <span className="text-mist font-semibold shrink-0">
              {shippingFreeProgress}% {t.Unlocked}
            </span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-sand-soft">
            <div
              className="h-full rounded-full bg-forest transition-all duration-500"
              style={{ width: `${shippingFreeProgress}%` }}
            />
          </div>
        </div>

        {/* Main 2-Column Cart Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* LEFT COLUMN: Items List */}
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            <div className="overflow-hidden rounded-3xl border border-hairline/80 bg-white/95 shadow-xs">
              {/* Table Header Bar with Noticeable Clear Cart option */}
              <div className="flex items-center justify-between border-b border-hairline/80 px-6 py-4 bg-sand-soft/30">
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  {t.ProductDetails}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest">
                    {t.Total}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <ul className="divide-y divide-hairline">
                {items.map((item) => {
                  const product = item.product;
                  const title =
                    product?.name || product?.title || "Merchandise";
                  const rawImg = product?.images?.[0] || product?.image || "";
                  const image = getImageUrl(rawImg) || "/placeholder.png";
                  const busy = isBusy(item._id);
                  const itemTotal =
                    item.total_price || item.unit_price * item.quantity;

                  // Stock validation
                  const variant = product?.variants?.find(
                    (v) => v.size === item.size && v.color === item.color,
                  );
                  const isStockMaxed =
                    variant &&
                    variant.stock != null &&
                    item.quantity >= variant.stock &&
                    !variant.isPreOrder;

                  return (
                    <li
                      key={item._id}
                      className="p-6 transition-colors hover:bg-sand-soft/20"
                    >
                      <div className="flex flex-col sm:flex-row gap-5">
                        {/* Product Image */}
                        <Link
                          href={`/${lang}/shop/${product?._id || ""}`}
                          className="group relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl border border-hairline/80 bg-sand-soft"
                        >
                          <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="96px"
                          />
                        </Link>

                        {/* Product Info & Controls */}
                        <div className="flex flex-1 flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <Link
                                  href={`/${lang}/shop/${product?._id || ""}`}
                                  className="font-display text-base font-bold text-forest-deep transition-colors hover:text-forest line-clamp-1"
                                >
                                  {title}
                                </Link>
                                <p className="mt-0.5 text-xs text-mist font-medium">
                                  {formatPrice(item.unit_price)} {t.Each}
                                </p>
                              </div>

                              {/* Remove Button */}
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleRemove(item._id)}
                                className="text-mist transition-colors hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 disabled:opacity-40 cursor-pointer"
                                aria-label={`Remove ${title}`}
                                title={isHt ? "Retire atik la" : "Remove item"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Variant Badges */}
                            <div className="mt-2.5 flex flex-wrap items-center gap-2">
                              {item.size && (
                                <span className="inline-flex items-center gap-1 rounded-md border border-hairline bg-sand-soft px-2.5 py-1 text-xs font-semibold text-forest-deep">
                                  <span className="text-[10px] uppercase text-mist font-bold">
                                    {t.Size}
                                  </span>{" "}
                                  {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="inline-flex items-center gap-1 rounded-md border border-hairline bg-sand-soft px-2.5 py-1 text-xs font-semibold text-forest-deep">
                                  <span className="text-[10px] uppercase text-mist font-bold">
                                    {t.Color}
                                  </span>{" "}
                                  {item.color}
                                </span>
                              )}
                              {variant?.isPreOrder && (
                                <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                                  {t.PreOrder}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Stepper + Item Total */}
                          <div className="mt-4 flex items-center justify-between border-t border-hairline/60 pt-3">
                            <div className="flex items-center gap-3">
                              {/* Quantity Stepper */}
                              <div className="inline-flex items-center rounded-xl border border-hairline bg-white shadow-2xs">
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => handleQty(item._id, -1)}
                                  className="grid h-8 w-8 place-items-center text-forest transition-colors hover:bg-sand-soft rounded-l-xl disabled:opacity-40 cursor-pointer"
                                  aria-label="Decrease quantity"
                                >
                                  {busy ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : item.quantity <= 1 ? (
                                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                  ) : (
                                    <Minus className="h-3.5 w-3.5" />
                                  )}
                                </button>
                                <span className="w-10 text-center text-xs font-bold text-forest-deep">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  disabled={busy || isStockMaxed}
                                  onClick={() => handleQty(item._id, 1)}
                                  className="grid h-8 w-8 place-items-center text-forest transition-colors hover:bg-sand-soft rounded-r-xl disabled:opacity-40 cursor-pointer"
                                  aria-label="Increase quantity"
                                  title={
                                    isStockMaxed
                                      ? t.MaxStockReached
                                      : "Increase quantity"
                                  }
                                >
                                  {busy ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Plus className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </div>

                              {isStockMaxed && (
                                <span className="text-[11px] font-medium text-amber-700">
                                  {t.MaxStockReached}
                                </span>
                              )}
                            </div>

                            {/* Total Line Price */}
                            <span className="font-display text-base font-bold text-forest-deep">
                              {formatPrice(itemTotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Bottom Actions Bar: Noticeable & Prominent Clear Cart */}
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-hairline/80 px-6 py-4 bg-sand-soft/30 gap-3">
                <Link
                  href={`/${lang}/shop`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-forest hover:text-forest-deep transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t.ContinueShopping}
                </Link>

                {/* Highly noticeable Clear Bag button */}
                <button
                  type="button"
                  onClick={() => setClearModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200/80 bg-red-50/60 px-4 py-2 text-xs font-bold text-red-600 transition-all hover:bg-red-100 hover:border-red-300 hover:text-red-700 shadow-2xs cursor-pointer active:scale-95"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  <span>{t.ClearBag}</span>
                </button>
              </div>
            </div>

            {/* Program Impact Banner */}
            <div className="rounded-3xl border border-hairline/80 bg-white/80 p-6 shadow-2xs backdrop-blur-xs flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-forest/10 text-forest">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-forest-deep">
                  {t.ImpactTitle}
                </h3>
                <p className="mt-1 text-xs text-mist leading-relaxed">
                  {t.ImpactDesc}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-3xl border border-hairline-strong/70 bg-white/95 p-6 shadow-md backdrop-blur-md sm:p-8">
                <h2 className="font-display text-xl font-bold tracking-tight text-forest-deep border-b border-hairline/80 pb-4">
                  {t.OrderSummary}
                </h2>

                {/* Price Breakdown */}
                <div className="mt-6 space-y-3.5 text-xs">
                  <div className="flex justify-between text-mist">
                    <span>{t.Subtotal}</span>
                    <span className="font-semibold text-forest-deep">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-mist">
                    <span className="flex items-center gap-1.5">
                      {t.Delivery}
                    </span>
                    <span className="font-semibold text-forest-deep">
                      {deliveryCharge === 0 ? (
                        <span className="text-forest font-bold">{t.Free}</span>
                      ) : (
                        formatPrice(deliveryCharge)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-mist">
                    <span>{t.Tax}</span>
                    <span className="font-semibold text-forest-deep">
                      {formatPrice(tax)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-forest font-semibold">
                      <span>{t.Discount}</span>
                      <span>−{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  {/* Grand Total */}
                  <div className="border-t border-hairline/80 pt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-bold text-forest-deep">
                        {t.GrandTotal}
                      </span>
                      <p className="text-[11px] text-mist">
                        {t.IncludingTaxDelivery}
                      </p>
                    </div>
                    <span className="font-display text-2xl font-bold text-forest">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                {/* Primary CTA: Proceed to Checkout */}
                <Button
                  asChild
                  size="lg"
                  className="mt-6 h-14 w-full rounded-2xl text-base font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <Link
                    href={`/${lang}/checkout`}
                    className="flex items-center justify-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    {t.ProceedToCheckout}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>

                {/* Trust and security badges */}
                <div className="mt-6 rounded-2xl border border-hairline/80 bg-sand-soft/50 p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-forest-deep">
                    <ShieldCheck className="h-4 w-4 text-forest shrink-0" />
                    <span>{t.EncryptedStripe}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-forest-deep">
                    <CheckCircle2 className="h-4 w-4 text-forest shrink-0" />
                    <span>{t.ExchangeGuarantee}</span>
                  </div>
                </div>
              </div>

              {/* Assistance card */}
              <div className="rounded-2xl border border-hairline/80 bg-white/70 p-4 text-xs text-mist flex items-center justify-between">
                <span>{t.HaveQuestions}</span>
                <Link
                  href={`/${lang}/contact`}
                  className="font-bold text-forest hover:underline"
                >
                  {t.ContactSupport} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Clear Cart Confirmation Modal */}
      <Modal
        open={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        className="max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl"
      >
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600 border border-red-200 shadow-xs">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-forest-deep sm:text-2xl">
            {t.ClearModalTitle}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-mist">
            {t.ClearModalDesc}
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => setClearModalOpen(false)}
            disabled={clearing}
            className="w-full sm:w-auto rounded-xl px-5 h-11 text-xs font-semibold"
          >
            {t.Cancel}
          </Button>
          <Button
            type="button"
            onClick={handleConfirmClear}
            disabled={clearing}
            className="w-full sm:w-auto rounded-xl bg-red-600 px-6 h-11 text-white hover:bg-red-700 font-bold shadow-sm text-xs cursor-pointer"
          >
            {clearing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.Clearing}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <Trash2 className="h-3.5 w-3.5" />
                {t.ConfirmClear}
              </span>
            )}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

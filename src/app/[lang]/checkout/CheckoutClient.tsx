"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CreditCard,
  Loader2,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

import type { CartData, ICartItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCartQuantity } from "@/helpers/next-fetch/cartActions";
import { createOrder } from "@/helpers/next-fetch/orderActions";

function resolveStripeUrl(data: unknown): string | undefined {
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    const candidate =
      d.url ??
      d.checkoutUrl ??
      d.paymentUrl ??
      d.stripeUrl ??
      d.sessionUrl ??
      (d.data as Record<string, unknown> | undefined)?.url;
    if (typeof candidate === "string") return candidate;
  }
  return undefined;
}

export function CheckoutClient({
  user,
  cart: serverCart,
  lang,
}: {
  user: any;
  cart: CartData | null;
  lang: string;
}) {
  const router = useRouter();

  // Optimistic items synced with server
  const [items, setItems] = React.useState<ICartItem[]>(serverCart?.cart ?? []);
  const [updatingIds, setUpdatingIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    setItems(serverCart?.cart ?? []);
  }, [serverCart]);

  // Form Fields
  const [fullName, setFullName] = React.useState(user?.name || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [contactNumber, setContactNumber] = React.useState(user?.phone || "");
  const [streetAddress, setStreetAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [country, setCountry] = React.useState("Haiti");
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);

  const [submitting, setSubmitting] = React.useState(false);

  // Live totals calculation
  const subtotal = items.reduce(
    (sum, item) => sum + (item.total_price || item.unit_price * item.quantity),
    0
  );
  const deliveryCharge = items.length === 0 ? 0 : subtotal >= 50 ? 0 : 8.0;
  const tax = Number((subtotal * 0.07).toFixed(2));
  const discountAmount = serverCart?.price_breakdown?.discount_amount ?? 0;
  const cartTotal = Math.max(0, subtotal + deliveryCharge + tax - discountAmount);

  const isBusy = (id: string) => updatingIds.has(id);

  async function handleQty(id: string, delta: 1 | -1) {
    const currentItem = items.find((i) => i._id === id);
    if (!currentItem) return;

    if (delta === 1) {
      const variant = currentItem.product?.variants?.find(
        (v) => v.size === currentItem.size && v.color === currentItem.color
      );
      if (
        variant &&
        variant.stock != null &&
        currentItem.quantity >= variant.stock &&
        !variant.isPreOrder
      ) {
        toast.error(`Maximum available stock reached (${variant.stock} available).`);
        return;
      }
    }

    setUpdatingIds((prev) => new Set(prev).add(id));
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
            : i
        )
      );
    }

    try {
      const res = await updateCartQuantity(id, delta);
      if (!res.success) {
        setItems(previous);
        toast.error(res.message || "Failed to update quantity");
        return;
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      setItems(previous);
      toast.error("Network error while updating quantity");
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setAppliedCoupon(code);
    toast.success(`Coupon "${code}" added to order.`);
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed.");
  }

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your shopping bag is empty.");
      return;
    }

    if (!streetAddress.trim() || !city.trim() || !contactNumber.trim()) {
      toast.error("Please fill in all required shipping fields.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        street_address: streetAddress.trim(),
        city: city.trim(),
        postal_code: postalCode.trim() || "00000",
        country: country.trim() || "Haiti",
        contact_number: contactNumber.trim(),
        ...(appliedCoupon || couponCode.trim()
          ? { coupon: (appliedCoupon || couponCode).trim().toUpperCase() }
          : {}),
      };

      const res = await createOrder(payload);

      if (!res.success) {
        toast.error(res.message || "Failed to create order.");
        setSubmitting(false);
        return;
      }

      const stripeUrl = resolveStripeUrl(res.data);
      if (stripeUrl) {
        toast.success("Redirecting to secure Stripe checkout...");
        window.location.href = stripeUrl;
      } else {
        toast.success(res.message || "Order placed successfully!");
        router.push(`/${lang}/payment/success`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error occurred during checkout.");
      setSubmitting(false);
    }
  }

  // 1. UNAUTHENTICATED VIEW
  if (!user) {
    return (
      <div className="min-h-screen bg-cream pt-28 pb-24 md:pt-36 md:pb-32">
        <Container>
          <div className="mx-auto max-w-lg rounded-3xl border border-hairline/80 bg-white/95 p-8 text-center shadow-lg backdrop-blur-md sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-forest/10 text-forest">
              <Lock className="h-8 w-8 text-forest" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-forest">
              Account Required
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-forest-deep sm:text-3xl">
              Sign In to Checkout
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              Please sign in or create an IFundAyiti account to save your delivery information, apply coupons, and complete your order securely.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Button asChild size="lg" className="rounded-xl shadow-xs">
                <Link href={`/${lang}/auth/login?redirect=/${lang}/checkout`}>
                  Sign In to Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl">
                <Link href={`/${lang}/auth/register?redirect=/${lang}/checkout`}>
                  Create New Account
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // 2. EMPTY BAG VIEW
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-28 pb-24 md:pt-36 md:pb-32">
        <Container>
          <div className="mx-auto max-w-lg rounded-3xl border border-hairline/80 bg-white/95 p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sand-soft text-forest">
              <ShoppingBag className="h-8 w-8 text-forest" />
            </div>
            <h2 className="mt-5 font-display text-2xl font-bold text-forest-deep">
              Your bag is empty
            </h2>
            <p className="mt-2 text-sm text-mist leading-relaxed">
              Add some of our mission merchandise to your shopping bag before proceeding to checkout.
            </p>
            <Button asChild size="lg" className="mt-6 rounded-xl shadow-xs">
              <Link href={`/${lang}/shop`}>
                Browse Apparel Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  // 3. MAIN CHECKOUT EXPERIENCE
  return (
    <div className="min-h-screen bg-cream pt-28 pb-24 md:pt-32 md:pb-32">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-mist">
          <Link href={`/${lang}`} className="hover:text-forest-deep transition-colors">
            Home
          </Link>
          <span className="text-faint">/</span>
          <Link href={`/${lang}/shop`} className="hover:text-forest-deep transition-colors">
            Shop
          </Link>
          <span className="text-faint">/</span>
          <Link href={`/${lang}/cart`} className="hover:text-forest-deep transition-colors">
            Cart
          </Link>
          <span className="text-faint">/</span>
          <span className="text-forest-deep font-bold">Checkout</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-hairline/80 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-forest/10 text-forest">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-forest">
                Secure Checkout
              </p>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-forest-deep sm:text-4xl">
              Complete Your Order
            </h1>
            <p className="mt-1 text-sm text-mist">
              Enter your shipping details below and finalize payment through our encrypted Stripe portal.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-forest bg-white/80 border border-hairline px-3.5 py-2 rounded-full shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-forest" />
            <span>256-Bit Encrypted & Stripe Protected</span>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* LEFT COLUMN: Shipping & Customer Information */}
          <div className="space-y-8 lg:col-span-7 xl:col-span-8">
            {/* Step 1: Customer Contact */}
            <div className="rounded-3xl border border-hairline/80 bg-white/95 p-6 shadow-xs sm:p-8 backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-hairline/80 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-xs font-bold text-white shadow-2xs">
                  1
                </span>
                <h2 className="font-display text-lg font-bold text-forest-deep">
                  Contact Information
                </h2>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="full_name" className="text-xs font-semibold text-forest">
                    Full Name *
                  </Label>
                  <Input
                    id="full_name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jean-Luc Baptiste"
                    className="h-11 rounded-xl border-hairline bg-sand-soft/30 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-forest">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jean@example.com"
                    className="h-11 rounded-xl border-hairline bg-sand-soft/30 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="contact_number" className="text-xs font-semibold text-forest">
                    Contact Phone Number *
                  </Label>
                  <Input
                    id="contact_number"
                    required
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+509 3700 0000 / +1 (518) 555-0199"
                    className="h-11 rounded-xl border-hairline bg-sand-soft/30 focus:bg-white"
                  />
                  <p className="text-[11px] text-mist">
                    Courier dispatch requires an active phone number for island delivery updates.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="rounded-3xl border border-hairline/80 bg-white/95 p-6 shadow-xs sm:p-8 backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-hairline/80 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-xs font-bold text-white shadow-2xs">
                  2
                </span>
                <h2 className="font-display text-lg font-bold text-forest-deep">
                  Shipping Destination
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="street_address" className="text-xs font-semibold text-forest">
                    Street Address / Delivery Location *
                  </Label>
                  <Input
                    id="street_address"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="123 Rue Capois, Building 4B, Apt 2"
                    className="h-11 rounded-xl border-hairline bg-sand-soft/30 focus:bg-white"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="city" className="text-xs font-semibold text-forest">
                      City / Commune *
                    </Label>
                    <Input
                      id="city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Port-au-Prince, Cap-Haïtien, Jacmel, etc."
                      className="h-11 rounded-xl border-hairline bg-sand-soft/30 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="postal_code" className="text-xs font-semibold text-forest">
                      Postal Code
                    </Label>
                    <Input
                      id="postal_code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="HT6110"
                      className="h-11 rounded-xl border-hairline bg-sand-soft/30 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-xs font-semibold text-forest">
                    Country *
                  </Label>
                  <Input
                    id="country"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Haiti"
                    className="h-11 rounded-xl border-hairline bg-sand-soft/30 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="rounded-3xl border border-hairline/80 bg-white/95 p-6 shadow-xs sm:p-8 backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-hairline/80 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-xs font-bold text-white shadow-2xs">
                  3
                </span>
                <h2 className="font-display text-lg font-bold text-forest-deep">
                  Payment Method
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl border-2 border-forest bg-sand-soft/40 p-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-white">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-forest-deep">
                        Credit / Debit Card (Stripe)
                      </p>
                      <p className="text-xs text-mist">
                        Visa, Mastercard, American Express, Apple Pay
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-forest/10 px-2.5 py-1 text-[11px] font-bold text-forest">
                    Secured
                  </span>
                </div>

                <div className="rounded-2xl border border-hairline/80 bg-sand-soft/40 p-4 flex items-start gap-3 text-xs text-mist">
                  <Lock className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                  <span>
                    When you click <strong>Proceed to Payment</strong>, you will be redirected to our PCI-compliant Stripe portal to enter your card details securely.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Order Summary & Coupon */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-3xl border border-hairline-strong/70 bg-white/95 p-6 shadow-md backdrop-blur-md sm:p-8">
                <div className="flex items-center justify-between border-b border-hairline/80 pb-4">
                  <h2 className="font-display text-xl font-bold tracking-tight text-forest-deep">
                    Order Summary
                  </h2>
                  <Link
                    href={`/${lang}/cart`}
                    className="text-xs font-bold text-forest hover:underline"
                  >
                    Edit Bag
                  </Link>
                </div>

                {/* Items preview list with inline stepper */}
                <ul className="mt-4 max-h-60 divide-y divide-hairline/60 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const product = item.product;
                    const title = product?.name || product?.title || "Merchandise";
                    const rawImg = product?.images?.[0] || product?.image || "";
                    const image = getImageUrl(rawImg) || "/placeholder.png";
                    const busy = isBusy(item._id);

                    return (
                      <li key={item._id} className="py-3.5 first:pt-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative h-12 w-11 shrink-0 overflow-hidden rounded-lg border border-hairline bg-sand-soft">
                              <Image src={image} alt={title} fill className="object-cover" sizes="44px" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-forest-deep">
                                {title}
                              </p>
                              <div className="flex items-center gap-1.5 text-[11px] text-mist">
                                {item.size && <span>{item.size}</span>}
                                {item.color && <span>· {item.color}</span>}
                              </div>
                            </div>
                          </div>

                          {/* Stepper + Item Total */}
                          <div className="flex items-center gap-2.5 shrink-0">
                            <div className="inline-flex items-center rounded-md border border-hairline bg-sand-soft/50">
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleQty(item._id, -1)}
                                className="grid h-6 w-6 place-items-center text-forest hover:bg-sand transition-colors rounded-l-md disabled:opacity-40"
                                aria-label="Decrease quantity"
                              >
                                {busy ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Minus className="h-3 w-3" />
                                )}
                              </button>
                              <span className="w-5 text-center text-[11px] font-bold text-forest-deep">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleQty(item._id, 1)}
                                className="grid h-6 w-6 place-items-center text-forest hover:bg-sand transition-colors rounded-r-md disabled:opacity-40"
                                aria-label="Increase quantity"
                              >
                                {busy ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Plus className="h-3 w-3" />
                                )}
                              </button>
                            </div>

                            <span className="text-xs font-bold text-forest-deep min-w-12 text-right">
                              {formatPrice(item.total_price || item.unit_price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Coupon Code Section */}
                <div className="mt-5 border-t border-hairline/80 pt-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-xl bg-forest/10 px-3.5 py-2 text-xs font-semibold text-forest">
                      <span className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" />
                        Code: <strong>{appliedCoupon}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[11px] text-mist hover:text-red-600 transition-colors underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-mist" />
                        <Input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Coupon or Promo Code"
                          className="h-10 rounded-xl border-hairline pl-9 text-xs"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleApplyCoupon}
                        variant="outline"
                        size="sm"
                        className="h-10 rounded-xl text-xs font-semibold"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="mt-5 space-y-3 border-t border-hairline/80 pt-4 text-xs">
                  <div className="flex justify-between text-mist">
                    <span>Products Subtotal</span>
                    <span className="font-semibold text-forest-deep">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-mist">
                    <span>Delivery Charge</span>
                    <span className="font-semibold text-forest-deep">
                      {deliveryCharge === 0 ? (
                        <span className="text-forest font-bold">Free</span>
                      ) : (
                        formatPrice(deliveryCharge)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-mist">
                    <span>Estimated Tax (7%)</span>
                    <span className="font-semibold text-forest-deep">
                      {formatPrice(tax)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-forest font-semibold">
                      <span>Discount</span>
                      <span>−{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  {/* Grand Total */}
                  <div className="border-t border-hairline/80 pt-3 flex items-baseline justify-between">
                    <span className="text-sm font-bold text-forest-deep">Total Due</span>
                    <span className="font-display text-2xl font-bold text-forest">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                {/* Submit CTA Button */}
                <Button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  size="lg"
                  className="mt-6 h-14 w-full rounded-2xl text-base font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connecting to Stripe...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Proceed to Payment · {formatPrice(cartTotal)}
                    </span>
                  )}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-mist">
                  <ShieldCheck className="h-3.5 w-3.5 text-forest" />
                  <span>Stripe protects your payment details with bank-level encryption.</span>
                </div>
              </div>

              {/* Mission Merch Impact Card */}
              <div className="rounded-3xl border border-hairline/80 bg-sand-soft/60 p-6 shadow-2xs">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest">
                  Mission Impact
                </p>
                <p className="mt-2 text-xs leading-relaxed text-mist">
                  Thank you for supporting Haitian entrepreneurship! 100% of proceeds fund our equity-free micro-grant awards for local builders.
                </p>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Lock,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/components/cart/cart-context";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { SHOP_PRODUCTS } from "@/data/shop";
import { ProductCard } from "@/components/shop/shop-experience";

const COUPON_CODES: Record<string, number> = {
  MERCH10: 0.1,
  AYITI15: 0.15,
  FOUNDER: 0.2,
};

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, clearCart, cartTotal } = useCart();

  // Form State
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [country, setCountry] = React.useState("Haiti");
  const [shippingMethod, setShippingMethod] = React.useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "bank" | "cod">("card");

  // Promo Code State
  const [couponInput, setCouponInput] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<{ code: string; discount: number } | null>(null);

  // Flow State
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [orderId, setOrderId] = React.useState("");

  const shippingCost = shippingMethod === "express" ? 12 : 0;
  const discountAmount = appliedCoupon ? cartTotal * appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, cartTotal + shippingCost - discountAmount);
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (COUPON_CODES[code]) {
      const discount = COUPON_CODES[code];
      setAppliedCoupon({ code, discount });
      toast.success(`Coupon "${code}" applied! (${discount * 100}% off)`);
      setCouponInput("");
    } else {
      toast.error("Invalid coupon code. Try 'MERCH10' or 'AYITI15'.");
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    toast.info("Coupon code removed.");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your shopping bag is empty.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const generatedId = `IFA-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setSubmitting(false);
      setDone(true);
      clearCart();
      toast.success("Demo order placed successfully!");
    }, 1200);
  }

  // 1. ORDER COMPLETE VIEW
  if (done) {
    return (
      <div className="bg-cream min-h-screen pt-28 pb-20">
        <Container className="max-w-3xl">
          <div className="rounded-3xl border border-hairline bg-white p-8 text-center shadow-xl sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-forest/10 text-forest">
              <CheckCircle2 className="h-10 w-10 text-forest" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
              Order Confirmation
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-forest-deep sm:text-4xl">
              Thank you for your order!
            </h1>
            <p className="mt-3 text-mist max-w-md mx-auto text-sm sm:text-base">
              Your demo order <span className="font-semibold text-forest-deep">#{orderId}</span> has been processed. A receipt has been saved locally.
            </p>

            <div className="mt-8 rounded-2xl border border-hairline bg-sand-soft/50 p-6 text-left">
              <div className="flex items-center justify-between border-b border-hairline pb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-forest">
                  Order Details
                </span>
                <span className="text-xs text-mist">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <ul className="mt-4 divide-y divide-hairline">
                <li className="flex justify-between py-2 text-sm">
                  <span className="text-mist">Shipping to</span>
                  <span className="font-medium text-forest-deep">{name || "Customer"}, {city || "Haiti"}</span>
                </li>
                <li className="flex justify-between py-2 text-sm">
                  <span className="text-mist">Delivery</span>
                  <span className="font-medium text-forest-deep">
                    {shippingMethod === "express" ? "Express (2–4 days)" : "Standard (5–10 days)"}
                  </span>
                </li>
                <li className="flex justify-between py-2 text-sm font-semibold border-t border-hairline pt-3">
                  <span className="text-forest-deep">Total Paid</span>
                  <span className="text-forest text-base">{formatPrice(finalTotal)}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto rounded-xl px-8">
                <Link href="/shop">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-xl px-8">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // 2. EMPTY CART VIEW
  if (items.length === 0) {
    const featuredItems = SHOP_PRODUCTS.filter((p) => p.featured).slice(0, 3);

    return (
      <>
        <PageHero
          eyebrow="Checkout"
          title="Your Shopping Bag"
          subtitle="Review products in your bag and proceed with checkout."
        />
        <section className="py-14 bg-cream">
          <Container>
            <div className="mx-auto max-w-xl rounded-3xl border border-hairline bg-white p-10 text-center shadow-xs">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sand-soft text-forest">
                <ShoppingBag className="h-8 w-8 text-forest" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold text-forest-deep">
                Your shopping bag is empty
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mist">
                Explore the IFundAyiti collection to add mission merch to your bag. Every item directly supports local business grant programs.
              </p>
              <Button asChild size="lg" className="mt-6 rounded-xl px-8">
                <Link href="/shop">
                  Explore Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {featuredItems.length > 0 && (
              <div className="mt-16 border-t border-hairline pt-12">
                <p className="eyebrow text-center">Featured Merch</p>
                <h3 className="mt-2 text-center font-display text-2xl font-semibold text-forest-deep">
                  Popular pieces in the collection
                </h3>
                <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
                  {featuredItems.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </Container>
        </section>
      </>
    );
  }

  // 3. UNIFIED CART & CHECKOUT PAGE
  return (
    <div className="bg-cream min-h-screen pt-28 pb-24">
      {/* Header Banner */}
      <section className="border-b border-hairline bg-cream pb-8 pt-4">
        <Container>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Checkout</p>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-forest-deep sm:text-4xl">
                Review & Complete Order
              </h1>
              <p className="mt-2 text-sm text-mist">
                Verify your shopping bag, enter delivery details, and place your order.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-forest bg-sand-soft px-3.5 py-2 rounded-full w-fit">
              <ShieldCheck className="h-4 w-4 text-forest" />
              <span>256-Bit Encrypted Checkout</span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, text: "Free delivery on orders $50+" },
              { icon: RotateCcw, text: "30-day hassle-free returns" },
              { icon: Sparkles, text: "100% merch proceeds fund local grants" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-xl border border-hairline/80 bg-white/70 px-4 py-2.5 text-xs font-medium text-forest-deep backdrop-blur-xs"
              >
                <Icon className="h-4 w-4 text-forest shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Main Checkout Content */}
      <section className="py-12">
        <Container>
          <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* LEFT COLUMN: Shopping Bag + Shipping Details */}
            <div className="space-y-10 lg:col-span-7">

              {/* STEP 1: Shopping Bag Items */}
              <div className="rounded-3xl border border-hairline bg-white p-6 shadow-xs sm:p-8">
                <div className="flex items-center justify-between border-b border-hairline pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-xs font-bold text-white">
                      1
                    </span>
                    <h2 className="font-display text-xl font-semibold text-forest-deep">
                      Shopping Bag
                    </h2>
                  </div>
                  <span className="rounded-full bg-sand-soft px-3 py-1 text-xs font-semibold text-forest">
                    {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Items List */}
                <ul className="mt-6 divide-y divide-hairline">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      {/* Image */}
                      <Link
                        href={`/product/${item.slug}`}
                        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-sand-soft border border-hairline"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          sizes="80px"
                        />
                      </Link>

                      {/* Content */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between gap-2">
                            <Link
                              href={`/product/${item.slug}`}
                              className="font-medium text-forest-deep hover:text-forest transition-colors text-sm sm:text-base line-clamp-1"
                            >
                              {item.title}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-mist hover:text-red-600 transition-colors p-1"
                              aria-label={`Remove ${item.title}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="mt-0.5 text-xs text-mist">
                            {formatPrice(item.price)} each
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          {/* Quantity selector */}
                          <div className="inline-flex items-center rounded-lg border border-hairline bg-sand-soft/50">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="grid h-8 w-8 place-items-center text-forest hover:bg-sand-soft transition-colors rounded-l-lg"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-forest-deep">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="grid h-8 w-8 place-items-center text-forest hover:bg-sand-soft transition-colors rounded-r-lg"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <span className="font-semibold text-forest-deep text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Footer action */}
                <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4 text-xs">
                  <Link href="/shop" className="font-semibold text-forest hover:underline">
                    ← Add more merchandise
                  </Link>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-mist hover:text-forest transition-colors"
                  >
                    Clear shopping bag
                  </button>
                </div>
              </div>

              {/* STEP 2: Shipping & Contact Form */}
              <div className="rounded-3xl border border-hairline bg-white p-6 shadow-xs sm:p-8">
                <div className="flex items-center gap-3 border-b border-hairline pb-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-xs font-bold text-white">
                    2
                  </span>
                  <h2 className="font-display text-xl font-semibold text-forest-deep">
                    Shipping & Contact Information
                  </h2>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                      Full Name *
                    </Label>
                    <Input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jean Baptiste"
                      className="h-11 rounded-xl border-hairline bg-sand-soft/20 focus:bg-white"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                        Email Address *
                      </Label>
                      <Input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jean@example.com"
                        className="h-11 rounded-xl border-hairline bg-sand-soft/20 focus:bg-white"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                        Phone Number *
                      </Label>
                      <Input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+509 3700 0000"
                        className="h-11 rounded-xl border-hairline bg-sand-soft/20 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                      Street Address *
                    </Label>
                    <Input
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Rue Capois, Apt 4B"
                      className="h-11 rounded-xl border-hairline bg-sand-soft/20 focus:bg-white"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                        City *
                      </Label>
                      <Input
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Port-au-Prince"
                        className="h-11 rounded-xl border-hairline bg-sand-soft/20 focus:bg-white"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                        Postal Code
                      </Label>
                      <Input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="HT6110"
                        className="h-11 rounded-xl border-hairline bg-sand-soft/20 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
                      Country *
                    </Label>
                    <Input
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Haiti"
                      className="h-11 rounded-xl border-hairline bg-sand-soft/20 focus:bg-white"
                    />
                  </div>

                  {/* Shipping Options */}
                  <div className="mt-6 border-t border-hairline pt-5">
                    <Label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-forest">
                      Delivery Option
                    </Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all",
                          shippingMethod === "standard"
                            ? "border-forest bg-sand-soft/50 ring-1 ring-forest"
                            : "border-hairline bg-white hover:border-forest/30",
                        )}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === "standard"}
                          onChange={() => setShippingMethod("standard")}
                          className="mt-0.5 accent-forest"
                        />
                        <div>
                          <p className="text-sm font-semibold text-forest-deep">
                            Standard Shipping
                          </p>
                          <p className="text-xs text-mist mt-0.5">5–10 Business Days</p>
                          <p className="mt-2 text-xs font-bold text-forest">Free</p>
                        </div>
                      </label>

                      <label
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all",
                          shippingMethod === "express"
                            ? "border-forest bg-sand-soft/50 ring-1 ring-forest"
                            : "border-hairline bg-white hover:border-forest/30",
                        )}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          checked={shippingMethod === "express"}
                          onChange={() => setShippingMethod("express")}
                          className="mt-0.5 accent-forest"
                        />
                        <div>
                          <p className="text-sm font-semibold text-forest-deep">
                            Express Air Delivery
                          </p>
                          <p className="text-xs text-mist mt-0.5">2–4 Business Days</p>
                          <p className="mt-2 text-xs font-bold text-forest-deep">$12.00</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3: Payment Method */}
              <div className="rounded-3xl border border-hairline bg-white p-6 shadow-xs sm:p-8">
                <div className="flex items-center gap-3 border-b border-hairline pb-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-xs font-bold text-white">
                    3
                  </span>
                  <h2 className="font-display text-xl font-semibold text-forest-deep">
                    Payment Method
                  </h2>
                </div>

                <div className="mt-6 space-y-3">
                  <label
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all",
                      paymentMethod === "card"
                        ? "border-forest bg-sand-soft/50 ring-1 ring-forest"
                        : "border-hairline bg-white hover:border-forest/30",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="accent-forest"
                      />
                      <CreditCard className="h-5 w-5 text-forest" />
                      <div>
                        <p className="text-sm font-semibold text-forest-deep">
                          Credit or Debit Card
                        </p>
                        <p className="text-xs text-mist">Secured via Stripe</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-mist">
                      <span>Visa / Mastercard</span>
                    </div>
                  </label>

                  <label
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all",
                      paymentMethod === "bank"
                        ? "border-forest bg-sand-soft/50 ring-1 ring-forest"
                        : "border-hairline bg-white hover:border-forest/30",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "bank"}
                        onChange={() => setPaymentMethod("bank")}
                        className="accent-forest"
                      />
                      <ShieldCheck className="h-5 w-5 text-forest" />
                      <div>
                        <p className="text-sm font-semibold text-forest-deep">
                          Bank Transfer / MonCash
                        </p>
                        <p className="text-xs text-mist">Direct payment info provided after checkout</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Demo notice */}
                <div className="mt-6 rounded-2xl border border-hairline bg-sand-soft/40 p-4 text-xs text-mist flex items-center gap-2.5">
                  <Lock className="h-4 w-4 text-forest shrink-0" />
                  <span>
                    This is a demo checkout mode. No real funds will be deducted.
                  </span>
                </div>

                {/* Primary CTA Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="mt-6 h-14 w-full rounded-2xl text-base font-semibold shadow-md transition-all hover:shadow-lg"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing Order...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Place Order · {formatPrice(finalTotal)}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* RIGHT COLUMN: Sticky Order Summary */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-3xl border border-hairline bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="font-display text-xl font-semibold text-forest-deep">
                    Order Summary
                  </h2>

                  {/* Item List Preview */}
                  <ul className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-hairline/60">
                    {items.map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-3 pt-3 first:pt-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-sand-soft border border-hairline">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                            <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-forest text-[10px] font-bold text-white">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-forest-deep">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-mist">
                              {formatPrice(item.price)} each
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-forest-deep">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Coupon Form */}
                  <div className="mt-6 border-t border-hairline pt-5">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between rounded-xl bg-forest/10 px-3.5 py-2.5 text-xs text-forest font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5" />
                          Code {appliedCoupon.code} ({appliedCoupon.discount * 100}% off)
                        </span>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-mist hover:text-red-600 transition-colors text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-mist" />
                          <Input
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="Promo code (e.g. MERCH10)"
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

                  {/* Cost Breakdown */}
                  <div className="mt-6 space-y-2.5 border-t border-hairline pt-5 text-xs">
                    <div className="flex justify-between text-mist">
                      <span>Subtotal</span>
                      <span className="font-semibold text-forest-deep">{formatPrice(cartTotal)}</span>
                    </div>

                    <div className="flex justify-between text-mist">
                      <span>Shipping</span>
                      <span className="font-semibold text-forest-deep">
                        {shippingCost === 0 ? (
                          <span className="text-forest">Free</span>
                        ) : (
                          formatPrice(shippingCost)
                        )}
                      </span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-forest font-semibold">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>−{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-mist">
                      <span>Estimated Tax</span>
                      <span className="text-mist">Included</span>
                    </div>

                    <div className="flex justify-between border-t border-hairline pt-4 text-base font-bold text-forest-deep">
                      <span>Total Amount</span>
                      <span className="text-lg font-display text-forest">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Impact Card */}
                <div className="rounded-3xl border border-hairline bg-sand-soft/60 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">
                    Program Impact
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-mist">
                    100% of proceeds from IFundAyiti merchandise directly fuel our business grant fund, empowering local Haitian entrepreneurs.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </Container>
      </section>
    </div>
  );
}

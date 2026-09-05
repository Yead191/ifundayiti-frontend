"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import type { CartData, ICartItem, IPriceBreakdown } from "@/types";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCartQuantity } from "@/helpers/next-fetch/cartActions";
import {
  createOrder,
  type CreateOrderPayload,
} from "@/helpers/next-fetch/orderActions";

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

interface CheckoutClientProps {
  user: any;
  cart: CartData | null;
  lang: string;
  dict?: any;
}

const CHECKOUT_I18N = {
  en: {
    Home: "Home",
    Shop: "Shop",
    Cart: "Cart",
    Eyebrow: "Secure Checkout",
    Title: "Complete Your Order",
    Subtitle:
      "Enter your shipping details below and finalize payment through our encrypted Stripe portal.",
    AuthRequiredTitle: "Sign In to Checkout",
    AuthRequiredSubtitle:
      "Please sign in or create an IFundAyiti account to save your delivery information, apply coupons, and complete your order securely.",
    SignInBtn: "Sign In to Continue",
    CreateAccountBtn: "Create New Account",
    EmptyTitle: "Your bag is empty",
    EmptySubtitle:
      "Add some of our mission merchandise to your shopping bag before proceeding to checkout.",
    ReturnToShop: "Return to Shop",
    ContactInfo: "Contact Information",
    FullName: "Full Name",
    Email: "Email Address",
    Phone: "Contact Phone Number",
    PhoneDesc:
      "Courier dispatch requires an active phone number for island delivery updates.",
    ShippingDestination: "Shipping Destination",
    StreetAddress: "Street Address / Delivery Location",
    City: "City / Commune",
    PostalCode: "Postal Code",
    Country: "Country",
    PaymentMethod: "Payment Method",
    CreditCard: "Credit / Debit Card (Stripe)",
    ProceedToPayment: "Proceed to Payment",
    ConnectingStripe: "Connecting to Stripe...",
    OrderSummary: "Order Summary",
    EditBag: "Edit Bag",
    ProductsSubtotal: "Products Subtotal",
    DeliveryCharge: "Delivery Charge",
    ServiceFee: "Service Fee",
    EstimatedTax: "Estimated Tax (8.875%)",
    Discount: "Discount",
    TotalDue: "Total Due",
    Free: "Free",
    SecureNote:
      "When you click Proceed to Payment, you will be redirected to our PCI-compliant Stripe portal to enter your card details securely.",
    StripeProtection:
      "Stripe protects your payment details with bank-level encryption.",
    MissionTitle: "Mission Impact",
    MissionDesc:
      "Thank you for supporting Haitian entrepreneurship! 100% of proceeds fund our equity-free micro-grant awards for local builders.",
  },
  ht: {
    Home: "Akèy",
    Shop: "Boutik",
    Cart: "Panyen",
    Eyebrow: "Peman An Sekirite",
    Title: "Fini Kòmand Ou",
    Subtitle:
      "Mete enfòmasyon livrezon ou anba a epi finalize peman ou sou pòtay Stripe ki an sekirite.",
    AuthRequiredTitle: "Konekte pou w ka Peye",
    AuthRequiredSubtitle:
      "Tanpri konekte oswa kreye yon kont IFundAyiti pou w sove enfòmasyon livrezon ou epi fini kòmand lan an sekirite.",
    SignInBtn: "Konekte pou Kontinye",
    CreateAccountBtn: "Kreye yon Nouvo Kont",
    EmptyTitle: "Panyen ou vid",
    EmptySubtitle:
      "Tanpri mete atik nan panyen w lan anvan ou kontinye nan peman an.",
    ReturnToShop: "Retounen nan Boutik",
    ContactInfo: "Enfòmasyon Kontak",
    FullName: "Non Konplè",
    Email: "Adrès Imèl",
    Phone: "Nimewo Telefòn",
    PhoneDesc:
      "Sèvis livrezon an mande yon nimewo aktif pou yo ka kontakte w lè y ap livre.",
    ShippingDestination: "Adrès Livrezon",
    StreetAddress: "Adrès Lari / Kote Livrezon",
    City: "Vil / Komin",
    PostalCode: "Kòd Postal",
    Country: "Peyi",
    PaymentMethod: "Mwayen Peman",
    CreditCard: "Kat Kredi / Debi (Stripe)",
    ProceedToPayment: "Kontinye nan Peman",
    ConnectingStripe: "N ap konekte ak Stripe...",
    OrderSummary: "Rezime Kòmand",
    EditBag: "Modifye Panyen an",
    ProductsSubtotal: "Sou-total Pwodwi yo",
    DeliveryCharge: "Frè Livrezon",
    ServiceFee: "Frè Sèvis",
    EstimatedTax: "Taks Estimasyon (8.875%)",
    Discount: "Rabè Aplike",
    TotalDue: "Total Pou Peye",
    Free: "Gratis",
    SecureNote:
      "Lè w klike sou Kontinye nan Peman, w ap dirije sou platfòm sekirize Stripe pou w mete kat ou an tout sekirite.",
    StripeProtection:
      "Stripe pwoteje tout enfòmasyon peman w ak yon chifreman nivo labank.",
    MissionTitle: "Enpak Misyon an",
    MissionDesc:
      "Mèsi pou sipò w pou antreprenarya an Ayiti! 100% benefis yo ale dirèkteman nan fon mikwo-sibvansyon pou kreyatè lokal yo.",
  },
};

export function CheckoutClient({
  user,
  cart: serverCart,
  lang,
  dict,
}: CheckoutClientProps) {
  const router = useRouter();
  const isHt = lang === "ht";
  const defaultI18n = isHt ? CHECKOUT_I18N.ht : CHECKOUT_I18N.en;
  const t = { ...defaultI18n, ...(dict?.Checkout || {}) };

  // Items & API Price Breakdown synced with server response
  const [items, setItems] = React.useState<ICartItem[]>(serverCart?.cart ?? []);
  const [priceBreakdown, setPriceBreakdown] = React.useState<
    IPriceBreakdown | undefined
  >(serverCart?.price_breakdown);
  const [updatingIds, setUpdatingIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    setItems(serverCart?.cart ?? []);
    setPriceBreakdown(serverCart?.price_breakdown);
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

  // Price Breakdown: explicitly derived from API response
  const subtotal =
    priceBreakdown?.subtotal ??
    priceBreakdown?.products_price ??
    items.reduce(
      (sum, item) => sum + (item.total_price || item.unit_price * item.quantity),
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
  const serviceFee = priceBreakdown?.serviceFee ?? 0;
  const tax =
    priceBreakdown != null
      ? priceBreakdown.tax
      : Number((subtotal * 0.08875).toFixed(2));
  const discountAmount = priceBreakdown?.discount_amount ?? 0;
  const cartTotal =
    priceBreakdown?.total_price ??
    Math.max(0, subtotal + deliveryCharge + tax + serviceFee - discountAmount);

  const isBusy = (id: string) => updatingIds.has(id);

  async function handleQty(id: string, delta: 1 | -1) {
    const currentItem = items.find((i) => i._id === id);
    if (!currentItem) return;

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
            (isHt ? "Pa t kapab mete kantite a ajou" : "Failed to update quantity"),
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
          ? "Erè rezo pandan n ap mete kantite a ajou"
          : "Network error while updating quantity",
      );
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();

    if (items.length === 0) {
      toast.error(isHt ? "Panyen ou vid." : "Your shopping bag is empty.");
      return;
    }

    if (!user) {
      toast.error(
        isHt
          ? "Tanpri konekte pou w ka finalize kòmand lan."
          : "Please sign in to complete checkout.",
      );
      router.push(`/${lang}/auth/login?redirect=/${lang}/checkout`);
      return;
    }

    // Validation
    if (!streetAddress.trim()) {
      toast.error(
        isHt ? "Tanpri mete adrès livrezon an." : "Please enter your street address.",
      );
      return;
    }
    if (!city.trim()) {
      toast.error(isHt ? "Tanpri mete vil la." : "Please enter your city / commune.");
      return;
    }
    if (!contactNumber.trim()) {
      toast.error(
        isHt
          ? "Tanpri mete yon nimewo telefòn aktif pou livrezon an."
          : "Please enter a valid contact phone number.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload: CreateOrderPayload = {
        street_address: streetAddress.trim(),
        city: city.trim(),
        postal_code: postalCode.trim() || undefined,
        country: country.trim() || "Haiti",
        contact_number: contactNumber.trim(),
        ...(appliedCoupon ? { coupon: appliedCoupon } : {}),
      };

      const res = await createOrder(payload);

      if (!res.success) {
        toast.error(
          res.message ||
            (isHt
              ? "Pa t kapab kòmanse peman an"
              : "Failed to initialize checkout"),
        );
        setSubmitting(false);
        return;
      }

      // Resolve Stripe Portal URL
      const stripeUrl = resolveStripeUrl(res.data);
      if (stripeUrl) {
        toast.success(
          isHt
            ? "N ap dirije w sou pòtay sekirize Stripe la..."
            : "Redirecting to secure Stripe portal...",
        );
        window.location.href = stripeUrl;
      } else {
        toast.success(
          isHt
            ? "Kòmand la fèt avèk siksè!"
            : "Order initiated successfully!",
        );
        router.push(`/${lang}/payment/success`);
      }
    } catch (err) {
      console.error("Order submission error:", err);
      toast.error(
        isHt
          ? "Erè pandan n ap voye kòmand lan. Tanpri eseye ankò."
          : "An error occurred while creating order. Please try again.",
      );
      setSubmitting(false);
    }
  }

  // 1. Unauthenticated state
  if (!user) {
    return (
      <div className="min-h-screen bg-cream pt-28 pb-24 md:pt-36 md:pb-32">
        <Container>
          <div className="mx-auto max-w-md rounded-3xl border border-hairline/80 bg-white/95 p-8 text-center shadow-lg backdrop-blur-md sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-forest/10 text-forest">
              <Lock className="h-8 w-8" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-forest">
              {t.Eyebrow}
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-forest-deep sm:text-3xl">
              {t.AuthRequiredTitle}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              {t.AuthRequiredSubtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Button asChild size="lg" className="rounded-xl shadow-xs">
                <Link href={`/${lang}/auth/login?redirect=/${lang}/checkout`}>
                  {t.SignInBtn}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl">
                <Link href={`/${lang}/auth/join?redirect=/${lang}/checkout`}>
                  {t.CreateAccountBtn}
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // 2. Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-28 pb-24 md:pt-36 md:pb-32">
        <Container>
          <div className="mx-auto max-w-md rounded-3xl border border-hairline/80 bg-white/95 p-8 text-center shadow-sm backdrop-blur-md sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sand-soft text-forest">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-forest-deep">
              {t.EmptyTitle}
            </h2>
            <p className="mt-2 text-sm text-mist leading-relaxed">
              {t.EmptySubtitle}
            </p>
            <Button asChild size="lg" className="mt-6 rounded-xl shadow-xs">
              <Link href={`/${lang}/shop`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.ReturnToShop}
              </Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  // 3. Active Checkout View
  return (
    <div className="min-h-screen bg-cream pt-28 pb-24 md:pt-32 md:pb-32">
      <Container>
        {/* Breadcrumb Navigation */}
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
          <Link
            href={`/${lang}/cart`}
            className="hover:text-forest-deep transition-colors"
          >
            {t.Cart}
          </Link>
          <span className="text-faint">/</span>
          <span className="text-forest-deep font-bold">{t.Eyebrow}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-hairline/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-forest/10 text-forest">
                <Lock className="h-4 w-4" />
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

          <div className="flex items-center gap-2 text-xs font-semibold text-forest bg-forest/5 border border-forest/20 px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="h-4 w-4 text-forest" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <form
          onSubmit={handleSubmitOrder}
          className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12"
        >
          {/* LEFT COLUMN: Shipping & Customer Information */}
          <div className="space-y-8 lg:col-span-7 xl:col-span-8">
            {/* Step 1: Customer Contact */}
            <div className="rounded-3xl border border-hairline/80 bg-white/95 p-6 shadow-xs backdrop-blur-xs sm:p-8">
              <div className="flex items-center gap-3 border-b border-hairline/80 pb-4">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-forest text-xs font-bold text-white">
                  1
                </span>
                <h2 className="font-display text-lg font-bold text-forest-deep">
                  {t.ContactInfo}
                </h2>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="full_name"
                    className="text-xs font-semibold text-forest"
                  >
                    {t.FullName} *
                  </Label>
                  <Input
                    id="full_name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jean Baptiste"
                    className="h-11 rounded-xl border-hairline bg-sand-soft/30 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold text-forest"
                  >
                    {t.Email} *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jean@example.com"
                    className="h-11 rounded-xl border-hairline bg-sand-soft/30 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label
                    htmlFor="contact_number"
                    className="text-xs font-semibold text-forest"
                  >
                    {t.Phone} *
                  </Label>
                  <Input
                    id="contact_number"
                    type="tel"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+509 3123 4567"
                    className="h-11 rounded-xl border-hairline bg-sand-soft/30 focus:bg-white"
                  />
                  <p className="text-[11px] text-mist">{t.PhoneDesc}</p>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="rounded-3xl border border-hairline/80 bg-white/95 p-6 shadow-xs backdrop-blur-xs sm:p-8">
              <div className="flex items-center gap-3 border-b border-hairline/80 pb-4">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-forest text-xs font-bold text-white">
                  2
                </span>
                <h2 className="font-display text-lg font-bold text-forest-deep">
                  {t.ShippingDestination}
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="street_address"
                    className="text-xs font-semibold text-forest"
                  >
                    {t.StreetAddress} *
                  </Label>
                  <Input
                    id="street_address"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="123 Rue Capois, Apt 4"
                    className="h-11 rounded-xl border-hairline bg-sand-soft/30 focus:bg-white"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label
                      htmlFor="city"
                      className="text-xs font-semibold text-forest"
                    >
                      {t.City} *
                    </Label>
                    <Input
                      id="city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Port-au-Prince / Cap-Haïtien / Jacmel"
                      className="h-11 rounded-xl border-hairline bg-sand-soft/30 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="postal_code"
                      className="text-xs font-semibold text-forest"
                    >
                      {t.PostalCode}
                    </Label>
                    <Input
                      id="postal_code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="HT-6110"
                      className="h-11 rounded-xl border-hairline bg-sand-soft/30 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="country"
                    className="text-xs font-semibold text-forest"
                  >
                    {t.Country} *
                  </Label>
                  <Input
                    id="country"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="h-11 rounded-xl border-hairline bg-sand-soft/30 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Info */}
            <div className="rounded-3xl border border-hairline/80 bg-white/95 p-6 shadow-xs backdrop-blur-xs sm:p-8">
              <div className="flex items-center gap-3 border-b border-hairline/80 pb-4">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-forest text-xs font-bold text-white">
                  3
                </span>
                <h2 className="font-display text-lg font-bold text-forest-deep">
                  {t.PaymentMethod}
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl border-2 border-forest bg-forest/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-white">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-forest-deep">
                        {t.CreditCard}
                      </p>
                      <p className="text-xs text-mist">
                        Visa, MasterCard, American Express, Apple Pay, Google Pay
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-forest shrink-0" />
                </div>

                <div className="rounded-2xl border border-hairline/80 bg-sand-soft/40 p-4 flex items-start gap-3 text-xs text-mist">
                  <Lock className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                  <span>{t.SecureNote}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary & API Price Breakdown */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-3xl border border-hairline-strong/70 bg-white/95 p-6 shadow-md backdrop-blur-md sm:p-8">
                <div className="flex items-center justify-between border-b border-hairline/80 pb-4">
                  <h2 className="font-display text-xl font-bold tracking-tight text-forest-deep">
                    {t.OrderSummary}
                  </h2>
                  <Link
                    href={`/${lang}/cart`}
                    className="text-xs font-bold text-forest hover:underline"
                  >
                    {t.EditBag}
                  </Link>
                </div>

                {/* Items preview */}
                <ul className="mt-4 max-h-60 divide-y divide-hairline/60 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const product = item.product;
                    const title =
                      product?.name || product?.title || "Merchandise";
                    const rawImg = product?.images?.[0] || product?.image || "";
                    const image = getImageUrl(rawImg) || "/placeholder.png";
                    const busy = isBusy(item._id);

                    return (
                      <li key={item._id} className="py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative h-12 w-11 shrink-0 overflow-hidden rounded-lg border border-hairline bg-sand-soft">
                              <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover"
                                sizes="44px"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-forest-deep">
                                {title}
                              </p>
                              <p className="text-[11px] text-mist">
                                {[item.size, item.color]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {/* Quantity Controls */}
                            <div className="inline-flex items-center rounded-lg border border-hairline bg-white shadow-2xs">
                              <button
                                type="button"
                                disabled={busy || submitting}
                                onClick={() => handleQty(item._id, -1)}
                                className="grid h-6 w-6 place-items-center text-forest transition-colors hover:bg-sand-soft rounded-l-lg disabled:opacity-40 cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                {busy ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : item.quantity <= 1 ? (
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                ) : (
                                  <Minus className="h-3 w-3" />
                                )}
                              </button>
                              <span className="w-6 text-center text-[11px] font-bold text-forest-deep">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                disabled={busy || submitting}
                                onClick={() => handleQty(item._id, 1)}
                                className="grid h-6 w-6 place-items-center text-forest transition-colors hover:bg-sand-soft rounded-r-lg disabled:opacity-40 cursor-pointer"
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
                              {formatPrice(
                                item.total_price ||
                                  item.unit_price * item.quantity,
                              )}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Price Breakdown directly from API */}
                <div className="mt-5 space-y-3 border-t border-hairline/80 pt-4 text-xs">
                  <div className="flex justify-between text-mist">
                    <span>{t.ProductsSubtotal}</span>
                    <span className="font-semibold text-forest-deep">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-mist">
                    <span>{t.DeliveryCharge}</span>
                    <span className="font-semibold text-forest-deep">
                      {deliveryCharge === 0 ? (
                        <span className="text-forest font-bold">{t.Free}</span>
                      ) : (
                        formatPrice(deliveryCharge)
                      )}
                    </span>
                  </div>

                  {serviceFee > 0 && (
                    <div className="flex justify-between text-mist">
                      <span>{t.ServiceFee}</span>
                      <span className="font-semibold text-forest-deep">
                        {formatPrice(serviceFee)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-mist">
                    <span>{t.EstimatedTax}</span>
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
                  <div className="border-t border-hairline/80 pt-3 flex items-baseline justify-between">
                    <span className="text-sm font-bold text-forest-deep">
                      {t.TotalDue}
                    </span>
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
                  className="mt-6 h-14 w-full rounded-2xl text-base font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t.ConnectingStripe}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      {t.ProceedToPayment}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </span>
                  )}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-mist">
                  <ShieldCheck className="h-3.5 w-3.5 text-forest" />
                  <span>{t.StripeProtection}</span>
                </div>
              </div>

              {/* Social Mission Reminder */}
              <div className="rounded-2xl border border-hairline/80 bg-white/70 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-forest">
                  {t.MissionTitle}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-mist">
                  {t.MissionDesc}
                </p>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Heart,
  ShoppingBag,
  FileText,
  ArrowRight,
  Home,
  Sparkles,
  Share2,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

type PaymentType = "donation" | "order" | "grant" | "subscription";

const PAYMENT_CONFIG: Record<
  PaymentType,
  {
    icon: React.ElementType;
    accentColor: string;
    badgeText: string;
    headline: string;
    subheadline: string;
    body: string;
    primaryCta: { href: string; label: string };
    secondaryCta: { href: string; label: string };
    highlights: { icon: string; label: string; value: string }[];
  }
> = {
  donation: {
    icon: Heart,
    accentColor: "from-forest-bright via-forest to-forest-deep",
    badgeText: "Donation Confirmed",
    headline: "Your generosity is making a real difference.",
    subheadline: "Thank you for fueling the IFundAyiti Program Fund.",
    body: "100% of your donation will be channeled directly into equity-free micro-grants for Haitian entrepreneurs. You will receive a receipt in your inbox shortly.",
    primaryCta: { href: "/impact", label: "See the Impact" },
    secondaryCta: { href: "/donate", label: "Donate Again" },
    highlights: [
      { icon: "🇭🇹", label: "Goes to", value: "Haiti Program Fund" },
      { icon: "🔒", label: "Secured by", value: "Stripe" },
      { icon: "📩", label: "Receipt sent to", value: "your email" },
    ],
  },
  order: {
    icon: ShoppingBag,
    accentColor: "from-amber-600 via-amber-700 to-amber-900",
    badgeText: "Order Confirmed",
    headline: "Your order is confirmed and on its way!",
    subheadline:
      "Thank you for supporting IFundAyiti through our mission shop.",
    body: "Every purchase from our shop directly contributes to the IFundAyiti Program Fund. Your order details and tracking information will be sent to your email.",
    primaryCta: { href: "/shop", label: "Continue Shopping" },
    secondaryCta: { href: "/", label: "Back to Home" },
    highlights: [
      { icon: "📦", label: "Order status", value: "Processing" },
      { icon: "🔒", label: "Secured by", value: "Stripe" },
      { icon: "📩", label: "Confirmation sent to", value: "your email" },
    ],
  },
  grant: {
    icon: FileText,
    accentColor: "from-teal-600 via-teal-700 to-teal-900",
    badgeText: "Application Submitted",
    headline: "Your grant application has been received.",
    subheadline: "IFundAyiti will review your submission with care.",
    body: "Our vetting board will review your application and you will receive a status update via email within 5–10 business days. You can track your application status anytime.",
    primaryCta: { href: "/track-application", label: "Track Application" },
    secondaryCta: { href: "/grants", label: "Read Grant Details" },
    highlights: [
      { icon: "📋", label: "Status", value: "Under Review" },
      { icon: "⏱️", label: "Response time", value: "5–10 business days" },
      { icon: "📩", label: "Updates sent to", value: "your email" },
    ],
  },
  subscription: {
    icon: Sparkles,
    accentColor: "from-violet-600 via-violet-700 to-violet-900",
    badgeText: "Subscription Active",
    headline: "Welcome to the IFundAyiti community!",
    subheadline: "Your recurring support keeps Haitian entrepreneurship alive.",
    body: "Your subscription has been activated. Your monthly contribution will automatically enter the Program Fund and help us fund more grant cycles throughout the year.",
    primaryCta: { href: "/impact", label: "See Our Impact" },
    secondaryCta: { href: "/donate", label: "Manage Giving" },
    highlights: [
      { icon: "🔄", label: "Billing", value: "Monthly auto-renew" },
      { icon: "🔒", label: "Secured by", value: "Stripe" },
      { icon: "📩", label: "Receipt sent to", value: "your email" },
    ],
  },
};

export function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type") ?? "donation";
  const type: PaymentType =
    rawType in PAYMENT_CONFIG ? (rawType as PaymentType) : "donation";

  const config = PAYMENT_CONFIG[type];
  const Icon = config.icon;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "I just supported IFundAyiti 🇭🇹",
        text: "Join me in empowering Haitian entrepreneurs with equity-free micro-grants.",
        url: "https://ifundayiti.org/donate",
      });
    } else {
      navigator.clipboard.writeText("https://ifundayiti.org/donate");
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-6">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="aurora -left-32 -top-32 h-[500px] w-[500px] opacity-20" />
        <div className="aurora -bottom-32 -right-32 h-[400px] w-[400px] opacity-15" />
      </div>

      <Container className="relative z-10 flex min-h-screen flex-col items-center justify-center py-20">
        {/* Card */}
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_32px_80px_-24px_rgba(11,61,46,0.22)]">
          {/* Top gradient band */}
          <div className={`relative h-36 bg-linear-to-r ${config.accentColor}`}>
            {/* Subtle shimmer */}
            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 animate-pulse" />

            {/* Centered success ring */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white shadow-xl">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-inner">
                  <CheckCircle2
                    className="h-9 w-9 text-white"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pb-8 pt-14 text-center sm:px-12">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Icon className="h-3.5 w-3.5" />
              {config.badgeText}
            </span>

            {/* Headline */}
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-forest-deep sm:text-4xl">
              {config.headline}
            </h1>
            <p className="mt-2 text-base font-semibold text-forest">
              {config.subheadline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              {config.body}
            </p>

            {/* Highlights strip */}
            <div className="mt-7 grid grid-cols-3 divide-x divide-hairline rounded-2xl border border-hairline bg-sand-soft/50">
              {config.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-0.5 px-4 py-4"
                >
                  <span className="text-xl">{h.icon}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-mist">
                    {h.label}
                  </span>
                  <span className="text-xs font-bold text-forest-deep">
                    {h.value}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="flex-1 rounded-2xl font-semibold shadow-md"
              >
                <Link href={config.primaryCta.href}>
                  {config.primaryCta.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="flex-1 rounded-2xl border-forest/20 font-semibold"
              >
                <Link href={config.secondaryCta.href}>
                  {config.secondaryCta.label}
                </Link>
              </Button>
            </div>

            {/* Share + Home row */}
            <div className="mt-5 flex items-center justify-center gap-6 border-t border-hairline pt-5">
              {type === "donation" && (
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-xs font-semibold text-forest hover:underline"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share the mission
                </button>
              )}
              <Link
                href="/"
                className="flex items-center gap-2 text-xs font-semibold text-mist hover:text-forest"
              >
                <Home className="h-3.5 w-3.5" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-xs text-mist">
          Questions?{" "}
          <Link
            href="/contact"
            className="font-semibold text-forest hover:underline"
          >
            Contact our team
          </Link>{" "}
          — we are happy to help.
        </p>
      </Container>
    </div>
  );
}

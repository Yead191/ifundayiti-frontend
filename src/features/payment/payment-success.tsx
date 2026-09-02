"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
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
import { useTranslation } from "@/components/providers/translation-provider";

type PaymentType = "donation" | "order" | "grant" | "subscription";

export function PaymentSuccessContent({
  lang: initialLang,
}: {
  lang?: string;
} = {}) {
  const params = useParams();
  const lang = initialLang || (params?.lang as string) || "en";
  const dict = useTranslation();
  const t = dict.PaymentSuccessPage;

  const searchParams = useSearchParams();
  const rawType = searchParams.get("type") ?? "donation";
  const type: PaymentType =
    rawType === "order" || rawType === "grant" || rawType === "subscription"
      ? rawType
      : "donation";

  const config = React.useMemo(() => {
    switch (type) {
      case "donation":
        return {
          icon: Heart,
          accentColor: "from-forest-bright via-forest to-forest-deep",
          badgeText: t.Donation.BadgeText,
          headline: t.Donation.Headline,
          subheadline: t.Donation.Subheadline,
          body: t.Donation.Body,
          primaryCta: { href: `/${lang}/impact`, label: t.Donation.PrimaryCta },
          secondaryCta: { href: `/${lang}/donate`, label: t.Donation.SecondaryCta },
          highlights: [
            { icon: "🇭🇹", label: t.Donation.H1Label, value: t.Donation.H1Val },
            { icon: "🔒", label: t.Donation.H2Label, value: t.Donation.H2Val },
            { icon: "📩", label: t.Donation.H3Label, value: t.Donation.H3Val },
          ],
        };
      case "order":
        return {
          icon: ShoppingBag,
          accentColor: "from-amber-600 via-amber-700 to-amber-900",
          badgeText: t.Order.BadgeText,
          headline: t.Order.Headline,
          subheadline: t.Order.Subheadline,
          body: t.Order.Body,
          primaryCta: { href: `/${lang}/shop`, label: t.Order.PrimaryCta },
          secondaryCta: { href: `/${lang}`, label: t.Order.SecondaryCta },
          highlights: [
            { icon: "📦", label: t.Order.H1Label, value: t.Order.H1Val },
            { icon: "🔒", label: t.Order.H2Label, value: t.Order.H2Val },
            { icon: "📩", label: t.Order.H3Label, value: t.Order.H3Val },
          ],
        };
      case "grant":
        return {
          icon: FileText,
          accentColor: "from-teal-600 via-teal-700 to-teal-900",
          badgeText: t.Grant.BadgeText,
          headline: t.Grant.Headline,
          subheadline: t.Grant.Subheadline,
          body: t.Grant.Body,
          primaryCta: {
            href: `/${lang}/track-application`,
            label: t.Grant.PrimaryCta,
          },
          secondaryCta: { href: `/${lang}/grants`, label: t.Grant.SecondaryCta },
          highlights: [
            { icon: "📋", label: t.Grant.H1Label, value: t.Grant.H1Val },
            { icon: "⏱️", label: t.Grant.H2Label, value: t.Grant.H2Val },
            { icon: "📩", label: t.Grant.H3Label, value: t.Grant.H3Val },
          ],
        };
      case "subscription":
      default:
        return {
          icon: Sparkles,
          accentColor: "from-violet-600 via-violet-700 to-violet-900",
          badgeText: t.Subscription.BadgeText,
          headline: t.Subscription.Headline,
          subheadline: t.Subscription.Subheadline,
          body: t.Subscription.Body,
          primaryCta: { href: `/${lang}/impact`, label: t.Subscription.PrimaryCta },
          secondaryCta: {
            href: `/${lang}/donate`,
            label: t.Subscription.SecondaryCta,
          },
          highlights: [
            { icon: "🔄", label: t.Subscription.H1Label, value: t.Subscription.H1Val },
            { icon: "🔒", label: t.Subscription.H2Label, value: t.Subscription.H2Val },
            { icon: "📩", label: t.Subscription.H3Label, value: t.Subscription.H3Val },
          ],
        };
    }
  }, [type, t, lang]);

  const Icon = config.icon;

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: t.Share.Title,
        text: t.Share.Text,
        url: `${window.location.origin}/${lang}/donate`,
      });
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/${lang}/donate`);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-6">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="aurora -left-32 -top-32 h-125 w-125 opacity-20" />
        <div className="aurora -bottom-32 -right-32 h-100 w-100 opacity-15" />
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
                  className="flex items-center gap-2 text-xs font-semibold text-forest hover:underline cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  {t.Share.Btn}
                </button>
              )}
              <Link
                href={`/${lang}`}
                className="flex items-center gap-2 text-xs font-semibold text-mist hover:text-forest"
              >
                <Home className="h-3.5 w-3.5" />
                {t.BackHome}
              </Link>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-xs text-mist">
          {t.Footer.Questions}{" "}
          <Link
            href={`/${lang}/contact`}
            className="font-semibold text-forest hover:underline"
          >
            {t.Footer.Contact}
          </Link>{" "}
          {t.Footer.Suffix}
        </p>
      </Container>
    </div>
  );
}

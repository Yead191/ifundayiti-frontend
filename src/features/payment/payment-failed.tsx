"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  XCircle,
  Heart,
  ShoppingBag,
  FileText,
  RotateCcw,
  Home,
  Sparkles,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/providers/translation-provider";

type PaymentType = "donation" | "order" | "grant" | "subscription";

export function PaymentFailedContent({
  lang: initialLang,
}: {
  lang?: string;
} = {}) {
  const params = useParams();
  const lang = initialLang || (params?.lang as string) || "en";
  const dict = useTranslation();
  const t = dict.PaymentFailedPage;

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
          accentColor: "from-rose-600 via-rose-700 to-rose-900",
          badgeText: t.Donation.BadgeText,
          headline: t.Donation.Headline,
          subheadline: t.Donation.Subheadline,
          body: t.Donation.Body,
          retryCta: { href: `/${lang}/donate`, label: t.Donation.RetryCta },
          secondaryCta: {
            href: `/${lang}/contact`,
            label: t.Donation.SecondaryCta,
          },
          tips: [t.Donation.Tip1, t.Donation.Tip2, t.Donation.Tip3],
        };
      case "order":
        return {
          icon: ShoppingBag,
          accentColor: "from-orange-600 via-orange-700 to-orange-900",
          badgeText: t.Order.BadgeText,
          headline: t.Order.Headline,
          subheadline: t.Order.Subheadline,
          body: t.Order.Body,
          retryCta: { href: `/${lang}/cart`, label: t.Order.RetryCta },
          secondaryCta: {
            href: `/${lang}/contact`,
            label: t.Order.SecondaryCta,
          },
          tips: [t.Order.Tip1, t.Order.Tip2, t.Order.Tip3],
        };
      case "grant":
        return {
          icon: FileText,
          accentColor: "from-slate-600 via-slate-700 to-slate-900",
          badgeText: t.Grant.BadgeText,
          headline: t.Grant.Headline,
          subheadline: t.Grant.Subheadline,
          body: t.Grant.Body,
          retryCta: { href: `/${lang}/apply`, label: t.Grant.RetryCta },
          secondaryCta: {
            href: `/${lang}/contact`,
            label: t.Grant.SecondaryCta,
          },
          tips: [t.Grant.Tip1, t.Grant.Tip2, t.Grant.Tip3],
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
          retryCta: { href: `/${lang}/donate`, label: t.Subscription.RetryCta },
          secondaryCta: {
            href: `/${lang}/contact`,
            label: t.Subscription.SecondaryCta,
          },
          tips: [t.Subscription.Tip1, t.Subscription.Tip2, t.Subscription.Tip3],
        };
    }
  }, [type, t, lang]);

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-cream">
      {/* Background glows — warmer/reddish tint */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -left-40 -top-40 h-125 w-125 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(244,63,94,0.5), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 h-100 w-100 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(239,68,68,0.4), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <Container className="relative z-10 flex min-h-screen flex-col items-center justify-center py-20">
        {/* Card */}
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_32px_80px_-24px_rgba(11,61,46,0.16)]">
          {/* Top gradient band */}
          <div
            className={`relative h-36 bg-linear-to-r ${config.accentColor}`}
          >
            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/8 to-white/0 overflow-hidden" />

            {/* Centered failed ring */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white shadow-xl">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-rose-400 to-rose-600 shadow-inner">
                  <XCircle className="h-9 w-9 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pb-8 pt-14 text-center sm:px-12">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">
              <Icon className="h-3.5 w-3.5" />
              {config.badgeText}
            </span>

            {/* Headline */}
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-forest-deep sm:text-4xl">
              {config.headline}
            </h1>
            <p className="mt-2 text-base font-semibold text-rose-600">
              {config.subheadline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              {config.body}
            </p>

            {/* Troubleshooting tips */}
            <div className="mt-6 rounded-2xl border border-hairline bg-sand-soft/50 p-5 text-left">
              <div className="mb-3 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-forest" />
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  {t.Troubleshooting}
                </span>
              </div>
              <ul className="space-y-2">
                {config.tips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-forest-deep"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[10px] font-bold text-rose-700">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="flex-1 rounded-2xl font-semibold shadow-md"
              >
                <Link href={config.retryCta.href}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {config.retryCta.label}
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

            {/* Back to home row */}
            <div className="mt-5 flex items-center justify-center gap-6 border-t border-hairline pt-5">
              <Link
                href={`/${lang}`}
                className="flex items-center gap-2 text-xs font-semibold text-mist hover:text-forest"
              >
                <Home className="h-3.5 w-3.5" />
                {t.BackHome}
              </Link>
              <Link
                href={`/${lang}/faq`}
                className="flex items-center gap-2 text-xs font-semibold text-mist hover:text-forest"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t.VisitFaq}
              </Link>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-xs text-mist">
          {t.Footer.Trouble}{" "}
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

"use client";

import * as React from "react";
import { FileText, Heart, Store, Gift, Wallet, TrendingUp } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { useTranslation } from "@/components/providers/translation-provider";
import {
  getFundStats,
  type FundStatsData,
} from "@/helpers/next-fetch/impactActions";
import { cn } from "@/lib/utils";

function formatStatCurrency(amount: number | undefined | null) {
  if (amount === undefined || amount === null) return "...";
  return `$${Number(amount).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
}

export function ImpactStats({
  initialStats,
}: {
  initialStats?: FundStatsData;
}) {
  const dict = useTranslation();
  const t = dict.ImpactStats;

  const [statsData, setStatsData] = React.useState<FundStatsData | null>(
    initialStats || null,
  );

  React.useEffect(() => {
    if (!initialStats) {
      getFundStats().then((res) => {
        if (res.success && res.data) {
          setStatsData(res.data);
        }
      });
    }
  }, [initialStats]);

  const cards = [
    {
      id: "applications",
      label: t?.TotalApplications || "TOTAL APPLICATIONS",
      value: statsData
        ? statsData.totalApplication.toLocaleString("en-US")
        : "...",
      fullValue: statsData ? String(statsData.totalApplication) : undefined,
      icon: FileText,
      iconBoxStyle:
        "bg-[#0B3D2E]/5 text-[#0B3D2E] group-hover:bg-[#0B3D2E] group-hover:text-white",
      hoverBorder: "hover:border-[#0B3D2E]/30",
      accentBar: "from-[#0B3D2E]/70 to-[#0B3D2E]/20",
      subtext: (
        <p
          className="mt-1.5 flex items-center gap-1.5 text-[11px] 2xl:text-xs text-mist truncate"
          title={t?.ReceivedOverall || "Received overall"}
        >
          <TrendingUp className="h-3.5 w-3.5 text-[#0B3D2E]/80 shrink-0" />
          <span className="truncate">
            {t?.ReceivedOverall || "Received overall"}
          </span>
        </p>
      ),
    },
    {
      id: "donations",
      label: t?.TotalDonations || "TOTAL DONATIONS",
      value: statsData ? formatStatCurrency(statsData.totalDonations) : "...",
      fullValue: statsData
        ? formatStatCurrency(statsData.totalDonations)
        : undefined,
      icon: Heart,
      iconBoxStyle:
        "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
      hoverBorder: "hover:border-emerald-500/35",
      accentBar: "from-emerald-500 to-emerald-300",
      subtext: (
        <p
          className="mt-1.5 flex items-center gap-1 text-[11px] 2xl:text-xs text-mist truncate"
          title={`${statsData?.donationCount ?? 0} ${
            statsData?.donationCount === 1
              ? t?.DonationSingle || "donation"
              : t?.DonationsPlural || "donations"
          } ${t?.DonationsFunded || "funded"}`}
        >
          <span className="font-semibold text-emerald-600 shrink-0">
            {statsData ? statsData.donationCount : 0}{" "}
            {statsData?.donationCount === 1
              ? t?.DonationSingle || "donation"
              : t?.DonationsPlural || "donations"}
          </span>
          <span className="truncate">{t?.DonationsFunded || "funded"}</span>
        </p>
      ),
    },
    {
      id: "fundsRaised",
      label: t?.FundsRaised || "FUNDS RAISED",
      value: statsData ? formatStatCurrency(statsData.totalFundRaised) : "...",
      fullValue: statsData
        ? formatStatCurrency(statsData.totalFundRaised)
        : undefined,
      icon: Store,
      iconBoxStyle:
        "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
      hoverBorder: "hover:border-purple-500/35",
      accentBar: "from-purple-500 to-purple-300",
      subtext: (
        <p
          className="mt-1.5 flex items-center gap-1 text-[11px] 2xl:text-xs text-mist truncate"
          title={`${statsData?.fundRaisedCount ?? 0} ${
            statsData?.fundRaisedCount === 1
              ? t?.OrderSingle || "order/sale"
              : t?.OrdersPlural || "orders & sales"
          } ${t?.OrdersSalesRaised || "raised"}`}
        >
          <span className="font-semibold text-purple-600 shrink-0">
            {statsData ? statsData.fundRaisedCount : 0}{" "}
            {statsData?.fundRaisedCount === 1
              ? t?.OrderSingle || "order/sale"
              : t?.OrdersPlural || "orders & sales"}
          </span>
          <span className="truncate">{t?.OrdersSalesRaised || "raised"}</span>
        </p>
      ),
    },
    {
      id: "grants",
      label: t?.AwardedGrants || "AWARDED GRANTS",
      value: statsData ? formatStatCurrency(statsData.totalGrants) : "...",
      fullValue: statsData
        ? formatStatCurrency(statsData.totalGrants)
        : undefined,
      icon: Gift,
      iconBoxStyle:
        "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
      hoverBorder: "hover:border-amber-500/35",
      accentBar: "from-amber-500 to-amber-300",
      subtext: (
        <p
          className="mt-1.5 flex items-center gap-1 text-[11px] 2xl:text-xs text-mist truncate"
          title={`${statsData?.grantCount ?? 0} ${
            statsData?.grantCount === 1
              ? t?.GrantSingle || "grant"
              : t?.GrantsPlural || "grants"
          } ${t?.GrantsDisbursed || "disbursed"}`}
        >
          <span className="font-semibold text-amber-600 shrink-0">
            {statsData ? statsData.grantCount : 0}{" "}
            {statsData?.grantCount === 1
              ? t?.GrantSingle || "grant"
              : t?.GrantsPlural || "grants"}
          </span>
          <span className="truncate">{t?.GrantsDisbursed || "disbursed"}</span>
        </p>
      ),
    },
    {
      id: "programFund",
      label: t?.ProgramFund || "PROGRAM FUND",
      value: statsData ? formatStatCurrency(statsData.totalBalance) : "...",
      fullValue: statsData
        ? formatStatCurrency(statsData.totalBalance)
        : undefined,
      icon: Wallet,
      iconBoxStyle:
        "bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white",
      hoverBorder: "hover:border-sky-500/35",
      accentBar: "from-sky-500 to-sky-300",
      subtext: (
        <p
          className="mt-1.5 flex items-center gap-1 text-[11px] 2xl:text-xs text-mist truncate"
          title={`${t?.TotalBalanceAvailable || "Total balance"} ${
            t?.Available || "available"
          }`}
        >
          <span className="font-semibold text-sky-600 shrink-0">
            {t?.TotalBalanceAvailable || "Total balance"}
          </span>
          <span className="truncate">{t?.Available || "available"}</span>
        </p>
      ),
    },
  ];

  return (
    <section className="relative pt-24 md:pt-32 overflow-hidden">
      {/* Soft ambient background glow */}
      <div className="pointer-events-none absolute -left-28 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-sand/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#0B3D2E]/5 blur-3xl" />

      <Container className="relative">
        <Reveal>
          <div className="flex flex-col items-start gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0B3D2E]/12 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0B3D2E] shadow-xs backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t?.Eyebrow || "Impact"}
            </span>
            <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-forest-deep sm:text-4xl md:text-5xl">
              {t?.Title || "A growing record of community support"}
            </h2>
            <p className="mt-1 max-w-2xl text-sm sm:text-base text-mist leading-relaxed">
              {t?.Notice ||
                "Real-time metrics from active grant programs and community contributions."}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-3.5 2xl:gap-4.5">
          {cards.map((card, i) => (
            <Reveal key={card.id} delay={i * 70}>
              <div
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-hairline bg-white/95 p-4 lg:p-4.5 xl:p-4 2xl:p-5 shadow-[0_4px_20px_-4px_rgba(11,61,46,0.05)] backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgba(11,61,46,0.12)]",
                  card.hoverBorder,
                )}
              >
                {/* Subtle colored accent line on top that illuminates on hover */}
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-[2.5px] bg-linear-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                    card.accentBar,
                  )}
                />

                <div>
                  {/* Card Header: Label & Icon */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-[11px] 2xl:text-xs font-semibold uppercase tracking-wider text-mist truncate"
                      title={card.label}
                    >
                      {card.label}
                    </span>
                    <div
                      className={cn(
                        "flex h-8 w-8 2xl:h-9.5 2xl:w-9.5 shrink-0 items-center justify-center rounded-xl transition-all duration-300 shadow-xs group-hover:scale-105",
                        card.iconBoxStyle,
                      )}
                    >
                      <card.icon className="h-4 w-4 2xl:h-4.5 2xl:w-4.5" />
                    </div>
                  </div>

                  {/* Big Metric Value */}
                  <div className="mt-2.5 xl:mt-3 2xl:mt-4">
                    <h3
                      className="font-display text-2xl xl:text-xl 2xl:text-2xl font-bold text-[#0B3D2E] tracking-tight truncate"
                      title={card.fullValue}
                    >
                      {card.value}
                    </h3>
                    {card.subtext}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

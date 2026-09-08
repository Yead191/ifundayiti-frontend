"use client";

import * as React from "react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { useTranslation } from "@/components/providers/translation-provider";
import {
  getImpactStats,
  type ImpactStatsData,
} from "@/helpers/next-fetch/impactActions";
import { formatPrice } from "@/lib/utils";

export function ImpactStats({
  initialStats,
}: {
  initialStats?: ImpactStatsData;
}) {
  const dict = useTranslation();
  const t = dict.ImpactStats;

  const [statsData, setStatsData] = React.useState<ImpactStatsData | null>(
    initialStats || null,
  );

  React.useEffect(() => {
    if (!initialStats) {
      getImpactStats().then((res) => {
        if (res.success && res.data) {
          setStatsData(res.data);
        }
      });
    }
  }, [initialStats]);

  const stats = [
    {
      label: t.Stat1 || "Applications received",
      value: statsData ? String(statsData.applicationReceived) : "...",
    },
    {
      label: t.Stat2 || "Grants awarded",
      value: statsData ? String(statsData.grantsAwardedCount) : "...",
    },
    {
      label: t.Stat3 || "Projects supported",
      value: statsData ? String(statsData.projectSupported) : "...",
    },
    {
      label: t.Stat4 || "Funds awarded",
      value: statsData ? formatPrice(statsData.totalFundsAwarded) : "...",
    },
    {
      label: t.Stat5 || "Grant cycles",
      value: statsData ? String(statsData.grantCycleCount) : "...",
    },
  ];

  return (
    <section className="py-24 md:py-32">
      <Container>
        <Reveal>
          <p className="eyebrow">{t.Eyebrow}</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-forest-deep md:text-5xl">
            {t.Title}
          </h2>
          <p className="mt-4 text-sm text-faint">{t.Notice}</p>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 md:gap-8">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <p className="font-display text-4xl font-semibold tracking-tight text-forest md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-3 text-sm font-medium text-forest-deep">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

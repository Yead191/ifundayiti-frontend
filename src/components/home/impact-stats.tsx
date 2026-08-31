"use client";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { useTranslation } from "@/components/providers/translation-provider";

export function ImpactStats() {
  const dict = useTranslation();
  const t = dict.ImpactStats;

  const stats = [
    { label: t.Stat1, value: "148" },
    { label: t.Stat2, value: "12" },
    { label: t.Stat3, value: "36" },
    { label: t.Stat4, value: "$11,400" },
  ];

  return (
    <section className="py-24 md:py-32">
      <Container>
        <Reveal>
          <p className="eyebrow">{t.Eyebrow}</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-forest-deep md:text-5xl">
            {t.Title}
          </h2>
          <p className="mt-4 text-sm text-faint">
            {t.Notice}
          </p>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
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

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { IMPACT_STATS } from "@/data/impact-page";
import { getDictionary } from "@/lib/dictionaries";

export async function ImpactMetrics({ lang }: { lang: string }) {
  const dict = await getDictionary(lang);
  const t = dict.ImpactPage.Stats;

  const items = [
    {
      value: "148",
      label: t.Stat1Label,
      detail: t.Stat1Detail,
      note: t.DemoNotice,
    },
    {
      value: "12",
      label: t.Stat2Label,
      detail: t.Stat2Detail,
      note: t.DemoNotice,
    },
    {
      value: "36",
      label: t.Stat3Label,
      detail: t.Stat3Detail,
      note: t.DemoNotice,
    },
    {
      value: "$11.4k",
      label: t.Stat4Label,
      detail: t.Stat4Detail,
      note: t.DemoNotice,
    },
  ];

  return (
    <section
      id={IMPACT_STATS.id}
      className="scroll-mt-24 border-b border-hairline bg-cream py-24 md:py-32"
    >
      <Container>
        <SectionHeading
          align="left"
          eyebrow={t.Eyebrow}
          title={t.Title}
          subtitle={t.Subtitle}
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 70}
              className="group relative overflow-hidden rounded-[1.5rem] border border-hairline bg-white p-7 shadow-[0_20px_50px_-40px_rgba(11,61,46,0.35)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sand-soft opacity-80 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <p className="font-display text-4xl font-semibold tracking-tight text-forest md:text-[2.75rem]">
                  {stat.value}
                </p>
                <p className="mt-3 font-display text-lg font-semibold text-forest-deep">
                  {stat.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-mist">
                  {stat.detail}
                </p>
                {stat.note && (
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
                    {stat.note}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

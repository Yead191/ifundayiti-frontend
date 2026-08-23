import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { IMPACT_FUND_FLOW } from "@/data/impact-page";
import { IMPACT_ICONS } from "@/features/impact/lib/icons";

export function ImpactFundFlow() {
  return (
    <section
      id={IMPACT_FUND_FLOW.id}
      className="scroll-mt-24 py-24 md:py-32"
    >
      <Container>
        <SectionHeading
          align="left"
          eyebrow={IMPACT_FUND_FLOW.eyebrow}
          title={IMPACT_FUND_FLOW.title}
          subtitle={IMPACT_FUND_FLOW.subtitle}
        />

        <ol className="mt-14 space-y-0 divide-y divide-hairline border-y border-hairline">
          {IMPACT_FUND_FLOW.steps.map((item, index) => (
            <Reveal key={item.step} delay={index * 60} as="li">
              <div className="grid gap-4 py-8 md:grid-cols-12 md:items-start md:gap-8">
                <p className="font-display text-sm font-semibold tracking-[0.2em] text-forest md:col-span-2">
                  {item.step}
                </p>
                <h3 className="font-display text-2xl text-forest-deep md:col-span-3">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-mist md:col-span-7">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {IMPACT_FUND_FLOW.pillars.map((item, index) => {
            const Icon = IMPACT_ICONS[item.icon];
            return (
              <Reveal
                key={item.title}
                delay={index * 70}
                className="rounded-[1.5rem] border border-hairline bg-sand-soft/40 p-7 transition-transform duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_-34px_rgba(11,61,46,0.35)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-forest-deep">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  {item.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { DEMO_IMPACT_STATS } from "@/data/grant";
import { DEMO_NOTICE } from "@/data/site";

export function ImpactStats() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Impact"
          title="A growing record of community support"
          subtitle={DEMO_NOTICE}
        />
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-4">
          {DEMO_IMPACT_STATS.map((stat) => (
            <div key={stat.label} className="bg-white px-6 py-8 text-center">
              <p className="font-display text-3xl text-forest md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-forest-deep">
                {stat.label}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-faint">
                {stat.note}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

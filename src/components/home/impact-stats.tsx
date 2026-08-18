import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { DEMO_IMPACT_STATS } from "@/data/grant";

export function ImpactStats() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <Reveal>
          <p className="eyebrow">Impact</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-forest-deep md:text-5xl">
            A growing record of community support
          </h2>
          <p className="mt-4 text-sm text-faint">
            Figures below are replaceable demo values.
          </p>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          {DEMO_IMPACT_STATS.map((stat, i) => (
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

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ABOUT_GOVERNANCE } from "@/data/about";

export function AboutGovernance() {
  return (
    <section className="border-y border-hairline bg-white py-24 md:py-32">
      <Container>
        <SectionHeading
          align="left"
          eyebrow={ABOUT_GOVERNANCE.eyebrow}
          title={ABOUT_GOVERNANCE.title}
          subtitle={ABOUT_GOVERNANCE.subtitle}
        />
        <ol className="mt-14 space-y-0 divide-y divide-hairline border-y border-hairline">
          {ABOUT_GOVERNANCE.steps.map((item, index) => (
            <Reveal key={item.step} delay={index * 60} as="li">
              <div className="grid gap-4 py-8 md:grid-cols-12 md:items-start md:gap-8">
                <p className="font-display text-sm font-semibold tracking-[0.2em] text-forest md:col-span-2">
                  {item.step}
                </p>
                <h3 className="font-display text-2xl text-forest-deep md:col-span-4">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-mist md:col-span-6">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

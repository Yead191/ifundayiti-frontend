import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { HOW_IT_WORKS } from "@/data/grant";

export function HowItWorks() {
  return (
    <section className="bg-sand-soft/60 py-24 md:py-32">
      <Container>
        <SectionHeading
          align="left"
          eyebrow="How it works"
          title="Five steps from idea to impact"
          subtitle="A grant lifecycle designed so applicants always know what happens next."
        />
        <ol className="mt-16 divide-y divide-forest/10 border-t border-forest/10">
          {HOW_IT_WORKS.map((item, i) => (
            <Reveal key={item.step} delay={i * 60} as="li">
              <div className="grid gap-4 py-8 md:grid-cols-12 md:items-baseline md:gap-8">
                <p className="font-display text-sm font-semibold tracking-[0.2em] text-forest md:col-span-2">
                  {item.step}
                </p>
                <h3 className="font-display text-2xl text-forest-deep md:col-span-3">
                  {item.title}
                </h3>
                <p className="max-w-xl text-base leading-relaxed text-mist md:col-span-7">
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

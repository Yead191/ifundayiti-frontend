import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ABOUT_PRINCIPLES } from "@/data/about";
import { ABOUT_ICONS } from "@/features/about/lib/icons";

export function AboutPrinciples() {
  return (
    <section
      id={ABOUT_PRINCIPLES.id}
      className="scroll-mt-24 bg-sand-soft/60 py-24 md:py-32"
    >
      <Container>
        <SectionHeading
          eyebrow={ABOUT_PRINCIPLES.eyebrow}
          title={ABOUT_PRINCIPLES.title}
          subtitle={ABOUT_PRINCIPLES.subtitle}
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {ABOUT_PRINCIPLES.items.map((item, index) => {
            const Icon = ABOUT_ICONS[item.icon];
            return (
              <Reveal
                key={item.title}
                delay={index * 70}
                className="group rounded-[1.5rem] border border-hairline bg-white p-8 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-34px_rgba(11,61,46,0.38)]"
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

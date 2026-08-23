import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ABOUT_AUDIENCES } from "@/data/about";

export function AboutAudiences() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow={ABOUT_AUDIENCES.eyebrow}
          title={ABOUT_AUDIENCES.title}
          subtitle={ABOUT_AUDIENCES.subtitle}
        />
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {ABOUT_AUDIENCES.items.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 80}
              className="flex h-full flex-col rounded-[1.75rem] border border-hairline bg-cream-dark/50 p-8"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest">
                {item.title}
              </p>
              <p className="mt-4 font-display text-2xl leading-snug text-forest-deep">
                {item.emotion}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-mist">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

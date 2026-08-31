import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ABOUT_PRINCIPLES } from "@/data/about";
import { ABOUT_ICONS } from "@/features/about/lib/icons";
import { getDictionary } from "@/lib/dictionaries";

export async function AboutPrinciples({ lang }: { lang: string }) {
  const dict = await getDictionary(lang);
  const t = dict.AboutPage.Principles;

  const items = [
    { icon: "scale" as const, title: t.Principle1Title, body: t.Principle1Body },
    { icon: "shield-check" as const, title: t.Principle2Title, body: t.Principle2Body },
    { icon: "hand-heart" as const, title: t.Principle3Title, body: t.Principle3Body },
    { icon: "landmark" as const, title: t.Principle4Title, body: t.Principle4Body },
  ];

  return (
    <section
      id={ABOUT_PRINCIPLES.id}
      className="scroll-mt-24 bg-sand-soft/60 py-24 md:py-32"
    >
      <Container>
        <SectionHeading
          eyebrow={t.Eyebrow}
          title={t.Title}
          subtitle={t.Subtitle}
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {items.map((item, index) => {
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

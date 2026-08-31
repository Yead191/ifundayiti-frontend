import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/dictionaries";

export async function AboutAudiences({ lang }: { lang: string }) {
  const dict = await getDictionary(lang);
  const t = dict.AboutPage.Audiences;

  const items = [
    { title: t.Audience1Title, emotion: t.Audience1Emotion, body: t.Audience1Body },
    { title: t.Audience2Title, emotion: t.Audience2Emotion, body: t.Audience2Body },
    { title: t.Audience3Title, emotion: t.Audience3Emotion, body: t.Audience3Body },
  ];

  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow={t.Eyebrow}
          title={t.Title}
          subtitle={t.Subtitle}
        />
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 80}
              className="group rounded-[1.75rem] border border-hairline bg-cream-dark/50 p-8"
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

import Image from "next/image";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ABOUT_STORY } from "@/data/about";
import { getDictionary } from "@/lib/dictionaries";

export async function AboutStory({ lang }: { lang: string }) {
  const dict = await getDictionary(lang);
  const t = dict.AboutPage.Story;
  const paragraphs = [t.Paragraph1, t.Paragraph2];

  return (
    <section id={ABOUT_STORY.id} className="scroll-mt-24 py-24 md:py-32">
      <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHeading
            align="left"
            eyebrow={t.Eyebrow}
            title={t.Title}
            subtitle={t.Subtitle}
          />
          <Reveal delay={80}>
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="mt-4 first:mt-8 text-base leading-relaxed text-mist"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>

        <Reveal className="relative lg:col-span-6">
          <div className="relative aspect-4/3 overflow-hidden rounded-[1.75rem] bg-sand-soft shadow-[0_28px_70px_-40px_rgba(11,61,46,0.45)]">
            <Image
              src={ABOUT_STORY.image}
              alt={ABOUT_STORY.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="absolute -bottom-6 -left-4 max-w-64 rounded-2xl border border-hairline bg-white p-5 shadow-[0_20px_50px_-30px_rgba(11,61,46,0.4)] md:-left-8">
            <p className="font-display text-lg leading-snug text-forest-deep">
              {t.Callout}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

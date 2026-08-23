import Image from "next/image";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ABOUT_STORY } from "@/data/about";

export function AboutStory() {
  return (
    <section id={ABOUT_STORY.id} className="scroll-mt-24 py-24 md:py-32">
      <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHeading
            align="left"
            eyebrow={ABOUT_STORY.eyebrow}
            title={ABOUT_STORY.title}
            subtitle={ABOUT_STORY.subtitle}
          />
          <Reveal delay={80}>
            {ABOUT_STORY.paragraphs.map((paragraph, index) => (
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
              {ABOUT_STORY.callout}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

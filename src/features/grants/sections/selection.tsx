import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { GRANTS_SELECTION } from "@/data/grants-page";
import { getDictionary } from "@/lib/dictionaries";

export async function GrantsSelection({ lang }: { lang: string }) {
  const dict = await getDictionary(lang);
  const t = dict.GrantsPage.Selection;

  const steps = [
    { step: "01", title: t.Step1Title, emotion: t.Step1Emotion, body: t.Step1Body },
    { step: "02", title: t.Step2Title, emotion: t.Step2Emotion, body: t.Step2Body },
    { step: "03", title: t.Step3Title, emotion: t.Step3Emotion, body: t.Step3Body },
    { step: "04", title: t.Step4Title, emotion: t.Step4Emotion, body: t.Step4Body },
    { step: "05", title: t.Step5Title, emotion: t.Step5Emotion, body: t.Step5Body },
  ];

  return (
    <section id={GRANTS_SELECTION.id} className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <SectionHeading
          align="left"
          eyebrow={t.Eyebrow}
          title={t.Title}
          subtitle={t.Subtitle}
        />
        <ol className="mt-14 space-y-0 divide-y divide-hairline border-y border-hairline">
          {steps.map((item, index) => (
            <Reveal key={item.step} delay={index * 60} as="li">
              <div className="grid gap-4 py-8 md:grid-cols-12 md:items-start md:gap-8">
                <p className="font-display text-sm font-semibold tracking-[0.2em] text-forest md:col-span-1">
                  {item.step}
                </p>
                <div className="md:col-span-4">
                  <h3 className="font-display text-2xl text-forest-deep">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-display text-base text-forest/80">
                    {item.emotion}
                  </p>
                </div>
                <p className="text-base leading-relaxed text-mist md:col-span-7">
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

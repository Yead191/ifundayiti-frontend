"use client";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { useTranslation } from "@/components/providers/translation-provider";

export function HowItWorks() {
  const dict = useTranslation();
  const t = dict.HowItWorks;

  const steps = [
    { step: "01", title: t.Step1Title, body: t.Step1Body },
    { step: "02", title: t.Step2Title, body: t.Step2Body },
    { step: "03", title: t.Step3Title, body: t.Step3Body },
    { step: "04", title: t.Step4Title, body: t.Step4Body },
    { step: "05", title: t.Step5Title, body: t.Step5Body },
  ];

  return (
    <section className="bg-sand-soft/60 py-24 md:py-32">
      <Container>
        <SectionHeading
          align="left"
          eyebrow={t.Eyebrow}
          title={t.Title}
          subtitle={t.Subtitle}
        />
        <ol className="mt-16 divide-y divide-forest/10 border-t border-forest/10">
          {steps.map((item, i) => (
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

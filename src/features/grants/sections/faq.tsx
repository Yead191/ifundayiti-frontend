import { Container } from "@/components/shared/container";
import { FAQBlock } from "@/components/faq/faq-block";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { GRANTS_FAQ } from "@/data/grants-page";
import { getDictionary } from "@/lib/dictionaries";

export async function GrantsFaq({ lang }: { lang: string }) {
  const dict = await getDictionary(lang);
  const t = dict.GrantsPage.FAQ;

  const items = [
    { question: t.Q1, answer: t.A1 },
    { question: t.Q2, answer: t.A2 },
    { question: t.Q3, answer: t.A3 },
    { question: t.Q4, answer: t.A4 },
    { question: t.Q5, answer: t.A5 },
    { question: t.Q6, answer: t.A6 },
    { question: t.Q7, answer: t.A7 },
  ];

  return (
    <section
      id={GRANTS_FAQ.id}
      className="scroll-mt-24 border-y border-hairline bg-cream-dark py-24 md:py-32"
    >
      <Container>
        <SectionHeading
          eyebrow={t.Eyebrow}
          title={t.Title}
          subtitle={t.Subtitle}
        />
        <Reveal delay={80} className="mx-auto mt-12 max-w-3xl">
          <FAQBlock items={items} />
        </Reveal>
      </Container>
    </section>
  );
}

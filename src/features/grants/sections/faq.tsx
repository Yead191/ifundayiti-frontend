import { Container } from "@/components/shared/container";
import { FAQBlock } from "@/components/faq/faq-block";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { FAQ_GROUPS } from "@/data/faq";
import { GRANTS_FAQ } from "@/data/grants-page";

export function GrantsFaq() {
  const group = FAQ_GROUPS.find((item) => item.id === GRANTS_FAQ.groupId);
  if (!group) return null;

  return (
    <section
      id={GRANTS_FAQ.id}
      className="scroll-mt-24 border-y border-hairline bg-cream-dark py-24 md:py-32"
    >
      <Container>
        <SectionHeading
          eyebrow={GRANTS_FAQ.eyebrow}
          title={GRANTS_FAQ.title}
          subtitle={GRANTS_FAQ.subtitle}
        />
        <Reveal delay={80} className="mx-auto mt-12 max-w-3xl">
          <FAQBlock items={group.items} />
        </Reveal>
      </Container>
    </section>
  );
}

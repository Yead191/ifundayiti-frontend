import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { FAQBlock } from "@/components/faq/faq-block";
import { FAQ_GROUPS } from "@/data/faq";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  description:
    "Answers about IFundAyiti grants, applications, donations, and the shop.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions, answered clearly."
        subtitle="Browse by topic. If you need something else, the contact page is open."
      />
      <section className="py-16">
        <Container className="max-w-3xl space-y-12">
          {FAQ_GROUPS.map((group) => (
            <div key={group.id} id={group.id}>
              <h2 className="mb-4 font-display text-2xl text-forest-deep">
                {group.title}
              </h2>
              <FAQBlock items={group.items} />
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}

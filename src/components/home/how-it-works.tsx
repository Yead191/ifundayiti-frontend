import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { HOW_IT_WORKS } from "@/data/grant";

export function HowItWorks() {
  return (
    <section className="bg-sand-soft/70 py-20">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="From application to impact"
          subtitle="A clear grant lifecycle — designed so applicants know what happens next."
        />
        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {HOW_IT_WORKS.map((item) => (
            <li key={item.step}>
              <p className="font-display text-3xl text-forest/40">{item.step}</p>
              <h3 className="mt-2 font-display text-xl text-forest-deep">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{item.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

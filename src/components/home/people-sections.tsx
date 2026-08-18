import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { LEADERSHIP, VOLUNTEERS, type PersonProfile } from "@/data/people";
import { DEMO_NOTICE } from "@/data/site";

export function LeadershipSection() {
  return (
    <section className="bg-sand-soft/50 py-24 md:py-32">
      <Container>
        <SectionHeading
          align="left"
          eyebrow="Leadership"
          title="The people who steward the mission"
          subtitle={DEMO_NOTICE}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERSHIP.map((person, i) => (
            <Reveal key={person.id} delay={i * 70}>
              <PersonCard person={person} editorial />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function VolunteersSection() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          align="left"
          eyebrow="Community"
          title="Volunteers who keep the work moving"
          subtitle={DEMO_NOTICE}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VOLUNTEERS.map((person, i) => (
            <Reveal key={person.id} delay={i * 70}>
              <PersonCard person={person} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function PersonCard({
  person,
  editorial = false,
}: {
  person: PersonProfile;
  editorial?: boolean;
}) {
  return (
    <article className="group overflow-hidden rounded-[1.5rem] bg-white">
      <div
        className={
          editorial ? "relative aspect-3/4 overflow-hidden" : "relative aspect-square overflow-hidden"
        }
      >
        <Image
          src={person.photoUrl}
          alt={`${person.name} — demo profile`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest">
          {person.role}
        </p>
        <h3 className="mt-1 font-display text-xl text-forest-deep">{person.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-mist">{person.bio}</p>
      </div>
    </article>
  );
}

import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { LEADERSHIP, VOLUNTEERS, type PersonProfile } from "@/data/people";
import { DEMO_NOTICE } from "@/data/site";

export function LeadershipSection() {
  return (
    <section className="bg-sand-soft/70 py-20">
      <Container>
        <SectionHeading
          eyebrow="Leadership"
          title="Meet our leadership"
          subtitle={DEMO_NOTICE}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERSHIP.map((person) => (
            <PersonCard key={person.id} person={person} editorial />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function VolunteersSection() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Community"
          title="Our amazing volunteers"
          subtitle={DEMO_NOTICE}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VOLUNTEERS.map((person) => (
            <PersonCard key={person.id} person={person} />
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
    <article className="overflow-hidden rounded-2xl bg-white">
      <div className={editorial ? "relative aspect-3/4" : "relative aspect-square"}>
        <Image
          src={person.photoUrl}
          alt={`${person.name} — demo profile`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-forest">
          {person.role}
        </p>
        <h3 className="mt-1 font-display text-xl text-forest-deep">{person.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-mist">{person.bio}</p>
      </div>
    </article>
  );
}

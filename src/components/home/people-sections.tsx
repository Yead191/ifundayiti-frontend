import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { LEADERSHIP, VOLUNTEERS, type PersonProfile } from "@/data/people";
import { DEMO_NOTICE } from "@/data/site";
import { getDictionary } from "@/lib/dictionaries";

import { Mail, Linkedin, Twitter, MapPin } from "lucide-react";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { getImageUrl } from "@/lib/getImageUrl";

export async function LeadershipSection({ lang }: { lang: string }) {
  const res = await nextFetch("/team?category=director", { cache: "default" });
  const leaders = res.success ? res.data || [] : [];

  if (leaders.length === 0) return null;

  const dict = await getDictionary(lang);
  const t = dict.People;

  return (
    <section className="bg-sand-soft/50 py-24 md:py-32 relative overflow-hidden">
      {/* Decorative Blur elements */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-forest/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-sand/20 rounded-full blur-[100px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          align="left"
          eyebrow={t.LeadershipEyebrow}
          title={t.LeadershipTitle}
          subtitle={t.LeadershipSubtitle}
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {leaders.map((person: any, i: number) => (
            <Reveal key={person._id} delay={i * 70}>
              <DirectorCard person={person} lang={lang} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export async function VolunteersSection({ lang }: { lang: string }) {
  const res = await nextFetch("/team?category=volunteer", { cache: "default" });
  const volunteers = res.success ? res.data || [] : [];

  if (volunteers.length === 0) return null;

  const dict = await getDictionary(lang);
  const t = dict.People;

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-white/20">
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-forest/3 rounded-full blur-[80px] pointer-events-none" />

      <Container>
        <SectionHeading
          align="left"
          eyebrow={t.CommunityEyebrow}
          title={t.CommunityTitle}
          subtitle={t.CommunitySubtitle}
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {volunteers.map((person: any, i: number) => (
            <Reveal key={person._id} delay={i * 70}>
              <VolunteerCard person={person} lang={lang} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function VolunteerCard({ person, lang }: { person: any; lang: string }) {
  const roleText = lang === "ht" ? "Volontè & Anbasadè" : "Volunteer & Ambassador";
  
  return (
    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/80 bg-white p-5 shadow-[0_15px_40px_-20px_rgba(11,61,46,0.15)] transition-all duration-500 hover:-translate-y-2 hover:border-forest/20 hover:shadow-[0_20px_50px_-20px_rgba(11,61,46,0.25)]">
      <div>
        {/* Profile Image with Hover Zoom */}
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-sand-soft">
          <Image
            src={getImageUrl(person.image) || ""}
            alt={person.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />

          {/* Location Badge */}
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
            <MapPin className="h-3 w-3 text-sand" />
            {person.location?.split(",")[0] || "Haiti"}
          </span>
        </div>

        {/* Member Details */}
        <div className="mt-5">
          <h3 className="font-display text-xl font-bold text-forest-deep transition-colors group-hover:text-forest">
            {person.name}
          </h3>
          <p className="text-xs font-semibold uppercase tracking-wider text-forest/80 mt-1">
            {roleText}
          </p>

          {/* Focus Areas Badges */}
          {person.focusAreas && person.focusAreas.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {person.focusAreas
                .slice(0, 2)
                .map((area: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-[9px] bg-forest/5 rounded border border-forest/10 text-forest font-semibold uppercase tracking-wider"
                  >
                    {area}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4">
        <div className="flex items-center gap-2">
          {person.email && (
            <a
              href={`mailto:${person.email}`}
              className="grid h-8 w-8 place-items-center rounded-lg border border-hairline bg-sand-soft/40 text-forest transition-all hover:bg-forest hover:text-white"
              title="Email Volunteer"
            >
              <Mail className="h-3.5 w-3.5" />
            </a>
          )}
          {person.linkedin && (
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-8 w-8 place-items-center rounded-lg border border-hairline bg-sand-soft/40 text-forest transition-all hover:bg-forest hover:text-white"
              title="LinkedIn Profile"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
          )}
          {person.twitter && (
            <a
              href={person.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-8 w-8 place-items-center rounded-lg border border-hairline bg-sand-soft/40 text-forest transition-all hover:bg-forest hover:text-white"
              title="Twitter Profile"
            >
              <Twitter className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function DirectorCard({ person, lang }: { person: any; lang: string }) {
  const roleText = lang === "ht" ? "Manm Komite" : "Board Director";

  return (
    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/80 bg-white p-5 shadow-[0_15px_40px_-20px_rgba(11,61,46,0.15)] transition-all duration-500 hover:-translate-y-2 hover:border-forest/20 hover:shadow-[0_20px_50px_-20px_rgba(11,61,46,0.25)]">
      <div>
        {/* Profile Image with Hover Zoom */}
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-sand-soft">
          <Image
            src={getImageUrl(person.image) || ""}
            alt={person.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />

          {/* Location Badge */}
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
            <MapPin className="h-3 w-3 text-sand" />
            {person.location?.split(",")[0] || "Haiti"}
          </span>
        </div>

        {/* Member Details */}
        <div className="mt-5">
          <h3 className="font-display text-xl font-bold text-forest-deep transition-colors group-hover:text-forest">
            {person.name}
          </h3>
          <p className="text-xs font-semibold uppercase tracking-wider text-forest/80 mt-1">
            {roleText}
          </p>
          {/* <p className="mt-3 text-sm leading-relaxed text-mist line-clamp-3">
            {person.bio}
          </p> */}
        </div>
      </div>

      {/* Social Links Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4">
        {/* <span className="text-[10px] font-semibold text-faint uppercase tracking-wider">
          Verified Director
        </span> */}
        <div className="flex items-center gap-2">
          {person.email && (
            <a
              href={`mailto:${person.email}`}
              className="grid h-8 w-8 place-items-center rounded-lg border border-hairline bg-sand-soft/40 text-forest transition-all hover:bg-forest hover:text-white"
              title="Email Director"
            >
              <Mail className="h-3.5 w-3.5" />
            </a>
          )}
          {person.linkedin && (
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-8 w-8 place-items-center rounded-lg border border-hairline bg-sand-soft/40 text-forest transition-all hover:bg-forest hover:text-white"
              title="LinkedIn Profile"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
          )}
          {person.twitter && (
            <a
              href={person.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-8 w-8 place-items-center rounded-lg border border-hairline bg-sand-soft/40 text-forest transition-all hover:bg-forest hover:text-white"
              title="Twitter Profile"
            >
              <Twitter className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
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
          editorial
            ? "relative aspect-3/4 overflow-hidden"
            : "relative aspect-square overflow-hidden"
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
        <h3 className="mt-1 font-display text-xl text-forest-deep">
          {person.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-mist">{person.bio}</p>
      </div>
    </article>
  );
}

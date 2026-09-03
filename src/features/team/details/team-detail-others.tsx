import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { getImageUrl } from "@/lib/getImageUrl";
import { ArrowRight, MapPin, Shield, UserCheck, Heart } from "lucide-react";

interface TeamDetailOthersProps {
  others: any[];
  lang: string;
  dict: any;
}

export function TeamDetailOthers({ others, lang, dict }: TeamDetailOthersProps) {
  if (!others || others.length === 0) return null;

  const d = dict.DetailPage;
  const g = dict.Grid;

  return (
    <section className="border-t border-hairline bg-sand-soft/40 py-16 sm:py-24">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              {d.AllTeam}
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-forest-deep">
              {d.MeetOthers}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-mist max-w-xl">
              {d.MeetOthersDesc}
            </p>
          </div>
          <Link
            href={`/${lang}/team`}
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-forest hover:text-forest-bright transition-colors"
          >
            <span>{d.ViewAllMembers || "View All Members"}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((member: any) => {
            const categoryBadge =
              member.category === "director" ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-900">
                  <Shield className="h-2.5 w-2.5" /> {g.BadgeDirector}
                </span>
              ) : member.category === "member" ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                  <UserCheck className="h-2.5 w-2.5" /> {g.BadgeMember}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-teal-300 bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-900">
                  <Heart className="h-2.5 w-2.5" /> {g.BadgeVolunteer}
                </span>
              );

            const plainBio = member.bio
              ? member.bio.replace(/<[^>]*>?/gm, "").trim()
              : "";

            return (
              <Link
                key={member._id || member.id}
                href={`/${lang}/team/${member._id || member.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/80 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-forest/30 hover:shadow-lg"
              >
                <div>
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-sand-soft">
                    <Image
                      src={getImageUrl(member.image) || ""}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      {categoryBadge}
                      {member.location && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                          <MapPin className="h-2.5 w-2.5 text-sand" />
                          {member.location.split(",")[0]}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-display text-lg font-bold leading-tight group-hover:text-sand">
                        {member.name}
                      </h3>
                      {member.title && (
                        <p className="text-xs font-medium text-white/90 mt-0.5">
                          {member.title}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="mt-3.5 text-xs leading-relaxed text-mist line-clamp-2">
                    {plainBio}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-xs font-semibold text-forest">
                  <span>{g.ViewProfile}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

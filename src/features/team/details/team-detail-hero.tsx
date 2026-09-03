import Link from "next/link";
import { ArrowLeft, ChevronRight, Shield, UserCheck, Heart, MapPin, Mail, Linkedin, Twitter, CheckCircle2, Award } from "lucide-react";
import { Container } from "@/components/shared/container";

interface TeamDetailHeroProps {
  member: any;
  lang: string;
  dict: any;
}

export function TeamDetailHero({ member, lang, dict }: TeamDetailHeroProps) {
  const d = dict.DetailPage;
  const g = dict.Grid;

  const categoryBadge =
    member.category === "director" ? (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/80 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-900 shadow-xs">
        <Shield className="h-3.5 w-3.5 text-emerald-700" /> {g.BadgeDirector}
      </span>
    ) : member.category === "member" ? (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-900 shadow-xs">
        <UserCheck className="h-3.5 w-3.5 text-amber-700" /> {g.BadgeMember}
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-300/80 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-900 shadow-xs">
        <Heart className="h-3.5 w-3.5 text-teal-700" /> {g.BadgeVolunteer}
      </span>
    );

  const roleText =
    member.category === "director"
      ? g.RoleDirector
      : member.category === "member"
        ? g.RoleMember
        : g.RoleVolunteer;

  return (
    <section className="relative overflow-hidden pt-32 pb-12 sm:pt-36 sm:pb-16 bg-linear-to-b from-sand-soft/80 via-white to-sand-soft/30 border-b border-hairline">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-forest/5 blur-3xl" />
      <div className="absolute -top-10 left-1/3 -z-10 h-80 w-80 rounded-full bg-amber-500/5 blur-3xl" />

      <Container>
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            href={`/${lang}/team`}
            className="group inline-flex items-center gap-2 rounded-full border border-hairline bg-white/90 px-4 py-2 text-xs sm:text-sm font-semibold text-forest shadow-xs backdrop-blur-md transition-all hover:bg-forest hover:text-white hover:border-forest"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>{d.BackToTeam}</span>
          </Link>

          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-xs text-mist">
            <Link href={`/${lang}`} className="hover:text-forest transition-colors">
              {d.BreadcrumbHome || "Home"}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-mist/60" />
            <Link href={`/${lang}/team`} className="hover:text-forest transition-colors">
              {d.BreadcrumbTeam || "Team"}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-mist/60" />
            <span className="font-medium text-forest-deep truncate max-w-52">
              {member.name}
            </span>
          </nav>
        </div>

        {/* Hero Title & Identity Bar */}
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            {categoryBadge}
            {member.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white px-3.5 py-1 text-xs font-medium text-forest-deep shadow-xs">
                <MapPin className="h-3.5 w-3.5 text-forest" />
                {member.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
              <CheckCircle2 className="h-3.5 w-3.5 text-forest" />
              {d.VerifiedMember}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-forest-deep leading-[1.15]">
            {member.name}
          </h1>

          {/* Title / Designation & Role Banner */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {member.title ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-forest/20 bg-forest/5 px-4 py-1.5 text-base sm:text-lg font-bold text-forest shadow-xs">
                <Award className="h-4 w-4 text-forest" />
                <span>{member.title}</span>
              </div>
            ) : null}
            <span className="text-sm sm:text-base font-medium text-mist">
              {roleText}
            </span>
          </div>

          {/* Social Profiles & Quick Contact */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-forest shadow-xs transition-all hover:bg-forest hover:text-white"
              >
                <Mail className="h-4 w-4" />
                <span>{member.email}</span>
              </a>
            )}
            {member.linkedin && (
              <a
                href={
                  member.linkedin.startsWith("http")
                    ? member.linkedin
                    : `https://${member.linkedin}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[#0A66C2] shadow-xs transition-all hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]"
                title="LinkedIn Profile"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
            )}
            {member.twitter && (
              <a
                href={
                  member.twitter.startsWith("http")
                    ? member.twitter
                    : `https://${member.twitter}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-sky-600 shadow-xs transition-all hover:bg-sky-600 hover:text-white hover:border-sky-600"
                title="Twitter / X Profile"
              >
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

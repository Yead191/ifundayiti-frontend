"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  ExternalLink,
  Shield,
  Briefcase,
  UserCheck,
  Heart,
  HeartHandshake,
  Zap,
  Sparkles,
  ArrowRight,
  X,
  Users,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/getImageUrl";

interface TeamSectionsProps {
  directors: any[];
  staff: any[];
  volunteers: any[];
  coreMembers: any[];
  stats: {
    totalDirectors: number;
    totalStaff?: number;
    totalMembers: number;
    totalVolunteers: number;
  };
  initialSearchQuery?: string;
  lang: string;
  dict: any;
}

export function TeamSections({
  directors,
  staff = [],
  volunteers,
  coreMembers,
  stats,
  initialSearchQuery = "",
  lang,
  dict,
}: TeamSectionsProps) {
  const [searchQuery, setSearchQuery] = React.useState(initialSearchQuery);
  const t = dict?.TeamPage?.Grid || {};

  const currentLang = lang || "en";

  // Filter function for members
  const filterMembers = (list: any[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter((m) => {
      const name = m.name?.toLowerCase() || "";
      const title = m.title?.toLowerCase() || "";
      const role = m.role?.toLowerCase() || "";
      const location = m.location?.toLowerCase() || "";
      const bio = m.bio?.toLowerCase() || "";
      const focus = Array.isArray(m.focusAreas)
        ? m.focusAreas.join(" ").toLowerCase()
        : "";
      return (
        name.includes(q) ||
        title.includes(q) ||
        role.includes(q) ||
        location.includes(q) ||
        bio.includes(q) ||
        focus.includes(q)
      );
    });
  };

  const filteredDirectors = React.useMemo(
    () => filterMembers(directors),
    [directors, searchQuery],
  );

  const filteredStaff = React.useMemo(
    () => filterMembers(staff),
    [staff, searchQuery],
  );

  const filteredVolunteers = React.useMemo(
    () => filterMembers(volunteers),
    [volunteers, searchQuery],
  );

  const filteredCoreMembers = React.useMemo(
    () => filterMembers(coreMembers),
    [coreMembers, searchQuery],
  );

  const totalMatches =
    filteredDirectors.length +
    filteredStaff.length +
    filteredVolunteers.length +
    filteredCoreMembers.length;

  const handleResetSearch = () => {
    setSearchQuery("");
  };

  return (
    <div id="team-grid" className="scroll-mt-20">
      {/* ============================================================
          TOP CONTROL BAR: QUICK JUMP TABS & SEARCH
          ============================================================ */}
      <section className="border-y border-hairline/80 bg-cream/95 py-4 backdrop-blur-xl shadow-xs transition-all">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Quick Section Navigation Pills: Directors -> Staff -> Volunteers -> Members */}
            <div className="flex flex-wrap items-center gap-2">
              {totalMatches > 0 && (
                <span className="hidden text-xs font-bold uppercase tracking-wider text-mist lg:inline-block mr-1">
                  {t.QuickNavLabel || "Sections:"}
                </span>
              )}

              {filteredDirectors.length > 0 && (
                <a
                  href="#directors"
                  className="inline-flex items-center gap-2 rounded-xl border border-hairline/80 bg-white/90 px-3.5 py-2 text-xs font-bold text-forest-deep shadow-2xs transition-all hover:border-forest/40 hover:bg-forest hover:text-white group"
                >
                  <Shield className="h-3.5 w-3.5 text-emerald-600 group-hover:text-white transition-colors" />
                  <span>{t.CatDirLabel || "Board of Directors"}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 group-hover:bg-white/20 group-hover:text-white transition-colors">
                    {filteredDirectors.length}
                  </span>
                </a>
              )}

              {filteredStaff.length > 0 && (
                <a
                  href="#staff"
                  className="inline-flex items-center gap-2 rounded-xl border border-hairline/80 bg-white/90 px-3.5 py-2 text-xs font-bold text-forest-deep shadow-2xs transition-all hover:border-forest/40 hover:bg-forest hover:text-white group"
                >
                  <Briefcase className="h-3.5 w-3.5 text-indigo-600 group-hover:text-white transition-colors" />
                  <span>{t.CatStaffLabel || "Staff"}</span>
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 group-hover:bg-white/20 group-hover:text-white transition-colors">
                    {filteredStaff.length}
                  </span>
                </a>
              )}

              {filteredVolunteers.length > 0 && (
                <a
                  href="#volunteers"
                  className="inline-flex items-center gap-2 rounded-xl border border-hairline/80 bg-white/90 px-3.5 py-2 text-xs font-bold text-forest-deep shadow-2xs transition-all hover:border-forest/40 hover:bg-forest hover:text-white group"
                >
                  <HeartHandshake className="h-3.5 w-3.5 text-teal-600 group-hover:text-white transition-colors" />
                  <span>{t.CatVolLabel || "Volunteers"}</span>
                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 group-hover:bg-white/20 group-hover:text-white transition-colors">
                    {filteredVolunteers.length}
                  </span>
                </a>
              )}

              {filteredCoreMembers.length > 0 && (
                <a
                  href="#members"
                  className="inline-flex items-center gap-2 rounded-xl border border-hairline/80 bg-white/90 px-3.5 py-2 text-xs font-bold text-forest-deep shadow-2xs transition-all hover:border-forest/40 hover:bg-forest hover:text-white group"
                >
                  <Zap className="h-3.5 w-3.5 text-amber-600 group-hover:text-white transition-colors" />
                  <span>{t.CatMemLabel || "Members"}</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 group-hover:bg-white/20 group-hover:text-white transition-colors">
                    {filteredCoreMembers.length}
                  </span>
                </a>
              )}
            </div>

            {/* Instant Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
              <input
                type="text"
                placeholder={t.SearchPlaceholder || "Search team members..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-2xl border border-hairline/80 bg-white py-2 pl-10 pr-9 text-xs font-medium text-forest-deep placeholder:text-mist focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-mist hover:bg-sand-soft hover:text-forest cursor-pointer"
                  title={t.Clear || "Clear search"}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ZERO-RESULTS / EMPTY DIRECTORY CARD */}
      {totalMatches === 0 && (
        <section className="py-20">
          <Container>
            <div className="mx-auto max-w-md rounded-3xl border border-hairline bg-white/95 p-12 text-center shadow-lg backdrop-blur-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sand-soft text-forest">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-forest-deep">
                {t.NoMembersTitle || "No team members found"}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-mist">
                {searchQuery
                  ? `${t.NoMembersDesc || "Try adjusting your search query or clear the filter to see all team members."}`
                  : "Our team directory is currently being updated. Please check back soon."}
              </p>
              {searchQuery && (
                <Button
                  onClick={handleResetSearch}
                  className="mt-6 rounded-xl text-xs font-semibold shadow-sm"
                >
                  {t.ResetFilters || "Reset Search"}
                </Button>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* ============================================================
          SECTION 1: BOARD OF DIRECTORS / DIRECTORS
          ============================================================ */}
      {filteredDirectors.length > 0 && (
        <section
          id="directors"
          className="scroll-mt-36 py-16 md:py-24 bg-linear-to-b from-cream via-sand-soft/25 to-cream border-b border-hairline/60"
        >
          <Container>
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-hairline/80">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-900 shadow-2xs">
                  <Shield className="h-3.5 w-3.5 text-emerald-700" />
                  <span>
                    {t.EyebrowDirectors || "Governance & Stewardship"}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-forest-deep sm:text-4xl md:text-5xl">
                  {t.CatDirLabel || "Board of Directors"}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-mist md:text-base">
                  {t.CatDirDesc ||
                    "Stewardship leaders guiding policy, ethical governance, and transparent fund management."}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-end">
                <span className="rounded-full border border-emerald-200 bg-emerald-100/60 px-4 py-1.5 text-xs font-bold text-emerald-900">
                  {filteredDirectors.length}{" "}
                  {filteredDirectors.length === 1
                    ? t.BadgeDirector || "Director"
                    : `${t.BadgeDirector || "Director"}s`}
                </span>
              </div>
            </div>

            {/* Directors Grid */}
            <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredDirectors.map((member, index) => (
                <DirectorCard
                  key={member._id || member.id}
                  member={member}
                  index={index}
                  currentLang={currentLang}
                  t={t}
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ============================================================
          SECTION 2: STAFF
          ============================================================ */}
      {filteredStaff.length > 0 && (
        <section
          id="staff"
          className="scroll-mt-36 py-16 md:py-24 bg-cream border-b border-hairline/60"
        >
          <Container>
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-hairline/80">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300 bg-indigo-50/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-900 shadow-2xs">
                  <Briefcase className="h-3.5 w-3.5 text-indigo-600" />
                  <span>
                    {t.EyebrowStaff || "Operations & Execution"}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-forest-deep sm:text-4xl md:text-5xl">
                  {t.CatStaffLabel || "Staff"}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-mist md:text-base">
                  {t.CatStaffDesc ||
                    "Dedicated staff members managing program execution, community partnerships, and day-to-day operations."}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-end">
                <span className="rounded-full border border-indigo-200 bg-indigo-100/60 px-4 py-1.5 text-xs font-bold text-indigo-900">
                  {filteredStaff.length}{" "}
                  {filteredStaff.length === 1
                    ? t.BadgeStaff || "Staff Member"
                    : `${t.BadgeStaff || "Staff"} Members`}
                </span>
              </div>
            </div>

            {/* Staff Grid */}
            <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredStaff.map((member, index) => (
                <StaffCard
                  key={member._id || member.id}
                  member={member}
                  index={index}
                  currentLang={currentLang}
                  t={t}
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ============================================================
          SECTION 3: VOLUNTEERS & AMBASSADORS
          ============================================================ */}
      {filteredVolunteers.length > 0 && (
        <section
          id="volunteers"
          className="scroll-mt-36 py-16 md:py-24 bg-sand-soft/35 border-b border-hairline/60"
        >
          <Container>
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-hairline/80">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-300 bg-teal-50/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-900 shadow-2xs">
                  <HeartHandshake className="h-3.5 w-3.5 text-teal-700" />
                  <span>{t.EyebrowVolunteers || "Grassroots Force"}</span>
                </div>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-forest-deep sm:text-4xl md:text-5xl">
                  {t.CatVolLabel || "Volunteers & Ambassadors"}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-mist md:text-base">
                  {t.CatVolDesc ||
                    "Ground-level community forces verifying projects, translating forms, and connecting local talent."}
                </p>
              </div>

              <div className="flex items-center gap-3 self-start md:self-end">
                <span className="rounded-full border border-teal-200 bg-teal-100/60 px-4 py-1.5 text-xs font-bold text-teal-900">
                  {filteredVolunteers.length}{" "}
                  {filteredVolunteers.length === 1
                    ? t.BadgeVolunteer || "Volunteer"
                    : `${t.BadgeVolunteer || "Volunteer"}s`}
                </span>
                <Button
                  asChild
                  size="sm"
                  className="rounded-xl text-xs shadow-xs"
                >
                  <Link href={`/${currentLang}/team/volunteer`}>
                    {t.JoinVolunteerBtn || "Apply to Volunteer"}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Volunteers Grid */}
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
              {filteredVolunteers.map((member, index) => (
                <VolunteerCard
                  key={member._id || member.id}
                  member={member}
                  index={index}
                  currentLang={currentLang}
                  t={t}
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ============================================================
          SECTION 4: MEMBERS
          ============================================================ */}
      {filteredCoreMembers.length > 0 && (
        <section
          id="members"
          className="scroll-mt-36 py-16 md:py-24 bg-cream"
        >
          <Container>
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-hairline/80">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-900 shadow-2xs">
                  <Zap className="h-3.5 w-3.5 text-amber-600" />
                  <span>
                    {t.EyebrowMembers || "Community & Ecosystem"}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-forest-deep sm:text-4xl md:text-5xl">
                  {t.CatMemLabel || "Members"}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-mist md:text-base">
                  {t.CatMemDesc ||
                    "Network members, ecosystem advisors, and community leaders backing our mission."}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-end">
                <span className="rounded-full border border-amber-200 bg-amber-100/60 px-4 py-1.5 text-xs font-bold text-amber-900">
                  {filteredCoreMembers.length}{" "}
                  {filteredCoreMembers.length === 1
                    ? t.BadgeMember || "Member"
                    : `${t.BadgeMember || "Member"}s`}
                </span>
              </div>
            </div>

            {/* Members Grid */}
            <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredCoreMembers.map((member, index) => (
                <CoreMemberCard
                  key={member._id || member.id}
                  member={member}
                  index={index}
                  currentLang={currentLang}
                  t={t}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}

/* ============================================================
   SUB-COMPONENT: DIRECTOR CARD (PREMIUM EXECUTIVE)
   ============================================================ */
function DirectorCard({
  member,
  index,
  currentLang,
  t,
}: {
  member: any;
  index: number;
  currentLang: string;
  t: any;
}) {
  const plainBio = member.bio
    ? member.bio.replace(/<[^>]*>?/gm, "").trim()
    : "";
  const rawImg = member.image || member.photoUrl;
  const image = getImageUrl(rawImg) || rawImg || "/placeholder.png";
  const memberId = member._id || member.id;

  return (
    <Reveal delay={index * 40}>
      <Link
        href={`/${currentLang}/team/${memberId}`}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-hairline/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-forest/40 hover:shadow-2xl"
      >
        <div>
          {/* Portrait Image Container */}
          <div className="relative aspect-4/4 w-full overflow-hidden rounded-2xl bg-sand-soft shadow-inner">
            <Image
              src={image}
              alt={member.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-end">
              {/* <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-white/95 px-3 py-1 text-[11px] font-bold text-emerald-900 shadow-sm backdrop-blur-md">
                <Shield className="h-3 w-3 text-emerald-700" />
                {t.BadgeDirector || "Board Director"}
              </span> */}

              {member.location && (
                <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                  <MapPin className="h-3 w-3 text-sand" />
                  {member.location.split(",")[0]}
                </span>
              )}
            </div>

            {/* Bottom Name & Role on Photo */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
              <h3 className="font-display text-2xl font-bold leading-tight group-hover:text-sand transition-colors">
                {member.name}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-white/90 line-clamp-1">
                {member.title || member.role || t.RoleDirector}
              </p>
            </div>
          </div>

          {/* Focus Areas Badges */}
          {Array.isArray(member.focusAreas) && member.focusAreas.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {member.focusAreas.slice(0, 3).map((area: string) => (
                <span
                  key={area}
                  className="rounded-lg bg-sand-soft/80 border border-hairline/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest-deep"
                >
                  {area}
                </span>
              ))}
            </div>
          )}

          {/* Bio Preview */}
          {plainBio && (
            <p className="mt-3.5 text-xs leading-relaxed text-mist line-clamp-3">
              {plainBio}
            </p>
          )}
        </div>

        {/* Card Footer Link */}
        <div className="mt-6 flex items-center justify-between border-t border-hairline pt-3.5 text-xs font-bold text-forest group-hover:text-forest-deep transition-colors">
          <span>{t.ViewProfile || "View Leadership Profile"}</span>
          <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </Reveal>
  );
}

/* ============================================================
   SUB-COMPONENT: CORE MEMBER CARD (OPERATIONAL EXCELLENCE)
   ============================================================ */
function CoreMemberCard({
  member,
  index,
  currentLang,
  t,
}: {
  member: any;
  index: number;
  currentLang: string;
  t: any;
}) {
  const plainBio = member.bio
    ? member.bio.replace(/<[^>]*>?/gm, "").trim()
    : "";
  const rawImg = member.image || member.photoUrl;
  const image = getImageUrl(rawImg) || rawImg || "/placeholder.png";
  const memberId = member._id || member.id;

  return (
    <Reveal delay={index * 40}>
      <Link
        href={`/${currentLang}/team/${memberId}`}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-hairline/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-forest/40 hover:shadow-2xl"
      >
        <div>
          {/* Portrait Image Container */}
          <div className="relative aspect-4/4 w-full overflow-hidden rounded-2xl bg-sand-soft shadow-inner">
            <Image
              src={image}
              alt={member.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-end">
              {member.location && (
                <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                  <MapPin className="h-3 w-3 text-sand" />
                  {member.location.split(",")[0]}
                </span>
              )}
            </div>

            {/* Bottom Name & Role on Photo */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
              <h3 className="font-display text-2xl font-bold leading-tight group-hover:text-sand transition-colors">
                {member.name}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-white/90 line-clamp-1">
                {member.title || member.role || t.RoleMember}
              </p>
            </div>
          </div>

          {/* Focus Areas Badges */}
          {Array.isArray(member.focusAreas) && member.focusAreas.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {member.focusAreas.slice(0, 3).map((area: string) => (
                <span
                  key={area}
                  className="rounded-lg bg-amber-50/80 border border-amber-200/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900"
                >
                  {area}
                </span>
              ))}
            </div>
          )}

          {/* Bio Preview */}
          {plainBio && (
            <p className="mt-3.5 text-xs leading-relaxed text-mist line-clamp-3">
              {plainBio}
            </p>
          )}
        </div>

        {/* Card Footer Link */}
        <div className="mt-6 flex items-center justify-between border-t border-hairline pt-3.5 text-xs font-bold text-forest group-hover:text-forest-deep transition-colors">
          <span>{t.ViewProfile || "View Member Profile"}</span>
          <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </Reveal>
  );
}

/* ============================================================
   SUB-COMPONENT: VOLUNTEER CARD (GRASSROOTS AMBASSADOR)
   ============================================================ */
function VolunteerCard({
  member,
  index,
  currentLang,
  t,
}: {
  member: any;
  index: number;
  currentLang: string;
  t: any;
}) {
  const plainBio = member.bio
    ? member.bio.replace(/<[^>]*>?/gm, "").trim()
    : "";
  const rawImg = member.image || member.photoUrl;
  const image = getImageUrl(rawImg) || rawImg || "/placeholder.png";
  const memberId = member._id || member.id;

  return (
    <Reveal delay={index * 30}>
      <Link
        href={`/${currentLang}/team/${memberId}`}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-hairline/80 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-forest/40 hover:shadow-xl"
      >
        <div>
          {/* Square/Portrait Image Container */}
          <div className="relative aspect-4/4 w-full overflow-hidden rounded-2xl bg-sand-soft shadow-inner">
            <Image
              src={image}
              alt={member.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-end">
              {member.location && (
                <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                  <MapPin className="h-2.5 w-2.5 text-sand" />
                  {member.location.split(",")[0]}
                </span>
              )}
            </div>

            {/* Bottom Name & Role on Photo */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h4 className="font-display text-lg font-bold leading-snug group-hover:text-sand transition-colors">
                {member.name}
              </h4>
              <p className="mt-0.5 text-[11px] font-medium text-white/90 line-clamp-1">
                {member.title || member.role || t.RoleVolunteer}
              </p>
            </div>
          </div>

          {/* Focus Areas Badges */}
          {Array.isArray(member.focusAreas) && member.focusAreas.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {member.focusAreas.slice(0, 2).map((area: string) => (
                <span
                  key={area}
                  className="rounded-md bg-teal-50/80 border border-teal-200/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-teal-900"
                >
                  {area}
                </span>
              ))}
            </div>
          )}

          {/* Bio Preview */}
          {plainBio && (
            <p className="mt-2.5 text-[11px] leading-relaxed text-mist line-clamp-2">
              {plainBio}
            </p>
          )}
        </div>

        {/* Card Footer Link */}
        <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-[11px] font-bold text-forest group-hover:text-forest-deep transition-colors">
          <span>{t.ViewProfile || "View Profile"}</span>
          <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </Reveal>
  );
}

/* ============================================================
   SUB-COMPONENT: STAFF CARD (OPERATIONAL EXCELLENCE)
   ============================================================ */
function StaffCard({
  member,
  index,
  currentLang,
  t,
}: {
  member: any;
  index: number;
  currentLang: string;
  t: any;
}) {
  const plainBio = member.bio
    ? member.bio.replace(/<[^>]*>?/gm, "").trim()
    : "";
  const rawImg = member.image || member.photoUrl;
  const image = getImageUrl(rawImg) || rawImg || "/placeholder.png";
  const memberId = member._id || member.id;

  return (
    <Reveal delay={index * 40}>
      <Link
        href={`/${currentLang}/team/${memberId}`}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-hairline/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/40 hover:shadow-2xl"
      >
        <div>
          {/* Portrait Image Container */}
          <div className="relative aspect-4/4 w-full overflow-hidden rounded-2xl bg-sand-soft shadow-inner">
            <Image
              src={image}
              alt={member.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-end">
              {member.location && (
                <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                  <MapPin className="h-3 w-3 text-sand" />
                  {member.location.split(",")[0]}
                </span>
              )}
            </div>

            {/* Bottom Name & Role on Photo */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
              <h3 className="font-display text-2xl font-bold leading-tight group-hover:text-sand transition-colors">
                {member.name}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-white/90 line-clamp-1">
                {member.title || member.role || t.RoleStaff || "Staff"}
              </p>
            </div>
          </div>

          {/* Focus Areas Badges */}
          {Array.isArray(member.focusAreas) && member.focusAreas.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {member.focusAreas.slice(0, 3).map((area: string) => (
                <span
                  key={area}
                  className="rounded-lg bg-indigo-50/80 border border-indigo-200/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-900"
                >
                  {area}
                </span>
              ))}
            </div>
          )}

          {/* Bio Preview */}
          {plainBio && (
            <p className="mt-3.5 text-xs leading-relaxed text-mist line-clamp-3">
              {plainBio}
            </p>
          )}
        </div>

        {/* Card Footer Link */}
        <div className="mt-6 flex items-center justify-between border-t border-hairline pt-3.5 text-xs font-bold text-forest group-hover:text-forest-deep transition-colors">
          <span>{t.ViewProfile || "View Staff Profile"}</span>
          <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </Reveal>
  );
}


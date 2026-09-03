"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  ExternalLink,
  UserCheck,
  Shield,
  Heart,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { TEAM_CATEGORIES, type TeamCategory } from "@/data/team";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { getImageUrl } from "@/lib/getImageUrl";

import { useTranslation } from "@/components/providers/translation-provider";

interface TeamGridProps {
  members: any[];
  pagination: any;
  stats: {
    totalDirectors: number;
    totalMembers: number;
    totalVolunteers: number;
  };
  activeCategory: TeamCategory;
  searchQuery: string;
  page: number;
  lang?: string;
}

export function TeamGrid({
  members,
  pagination,
  stats,
  activeCategory,
  searchQuery,
  page,
  lang,
}: TeamGridProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = React.useState(searchQuery);
  const [optimisticCategory, setOptimisticCategory] =
    React.useState<TeamCategory>(activeCategory);

  const dict = useTranslation();
  const t = dict.TeamPage.Grid;

  const currentLang = lang || "en";

  const categoryLabels: Record<string, string> = {
    all: t.CatAllLabel,
    directors: t.CatDirLabel,
    members: t.CatMemLabel,
    volunteers: t.CatVolLabel,
  };

  const categoryDescriptions: Record<string, string> = {
    all: t.CatAllDesc,
    directors: t.CatDirDesc,
    members: t.CatMemDesc,
    volunteers: t.CatVolDesc,
  };

  // Sync state if searchQuery or activeCategory changes from outside
  React.useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  React.useEffect(() => {
    setOptimisticCategory(activeCategory);
  }, [activeCategory]);

  const updateParams = React.useCallback(
    (nextCategory: string, nextSearch: string, nextPage: number) => {
      const params = new URLSearchParams();
      if (nextCategory !== "all") {
        params.set("category", nextCategory);
      }
      if (nextSearch) {
        params.set("q", nextSearch);
      }
      if (nextPage > 1) {
        params.set("page", nextPage.toString());
      }
      router.replace(`/${currentLang}/team?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, currentLang],
  );

  // Debounce search input changes
  React.useEffect(() => {
    if (searchInput === searchQuery) return;

    const handler = setTimeout(() => {
      updateParams(optimisticCategory, searchInput, 1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput, searchQuery, optimisticCategory, updateParams]);

  const getCategoryCount = (categoryId: TeamCategory) => {
    if (categoryId === "all") {
      return stats.totalDirectors + stats.totalMembers + stats.totalVolunteers;
    }
    if (categoryId === "directors") return stats.totalDirectors;
    if (categoryId === "members") return stats.totalMembers;
    if (categoryId === "volunteers") return stats.totalVolunteers;
    return 0;
  };

  const getCategoryHref = React.useCallback(
    (catId: TeamCategory) => {
      const params = new URLSearchParams();
      if (catId !== "all") {
        params.set("category", catId);
      }
      if (searchInput) {
        params.set("q", searchInput);
      }
      const qs = params.toString();
      return `/${currentLang}/team${qs ? `?${qs}` : ""}`;
    },
    [currentLang, searchInput],
  );

  const handlePageChange = (newPage: number) => {
    updateParams(optimisticCategory, searchInput, newPage);
  };

  const handleReset = () => {
    setSearchInput("");
    setOptimisticCategory("all");
    updateParams("all", "", 1);
  };

  const isTransitioning = optimisticCategory !== activeCategory;

  return (
    <section
      id="team-grid"
      className="scroll-mt-24 py-16 md:py-24 bg-sand-soft/30"
    >
      <Container>
        {/* Controls: Search and Tabs */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/80 bg-white/80 p-1.5 shadow-sm backdrop-blur-md">
            {TEAM_CATEGORIES.map((cat) => {
              const active = optimisticCategory === cat.id;
              const count = getCategoryCount(cat.id);
              return (
                <Link
                  key={cat.id}
                  href={getCategoryHref(cat.id)}
                  scroll={false}
                  prefetch={true}
                  onClick={() => setOptimisticCategory(cat.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-forest text-white shadow-md"
                      : "text-forest-deep hover:bg-sand-soft hover:text-forest"
                  }`}
                >
                  {categoryLabels[cat.id] || cat.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold transition-colors ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-sand-soft text-forest"
                    }`}
                  >
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
            <input
              type="text"
              placeholder={t.SearchPlaceholder}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-2xl border border-hairline bg-white py-2.5 pl-10 pr-4 text-sm text-forest-deep placeholder:text-mist focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
            {searchInput && (
              <button
                onClick={handleReset}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-mist hover:text-forest cursor-pointer"
              >
                {t.Clear}
              </button>
            )}
          </div>
        </div>

        {/* Category Description Banner */}
        <div className="mt-6 rounded-2xl border border-hairline bg-white/60 px-5 py-3 text-sm text-mist transition-all duration-200">
          {categoryDescriptions[optimisticCategory]}
        </div>

        {/* Members Grid Container */}
        <div
          className={`transition-opacity duration-200 ${
            isTransitioning ? "opacity-60 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Members Grid */}
          {members.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-dashed border-hairline bg-white p-12 text-center">
              <UserCheck className="mx-auto h-12 w-12 text-mist/60" />
              <h3 className="mt-4 font-display text-lg font-bold text-forest-deep">
                {t.NoMembersTitle}
              </h3>
              <p className="mt-1 text-sm text-mist">{t.NoMembersDesc}</p>
              <button
                onClick={handleReset}
                className="mt-4 inline-flex items-center rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-forest-bright"
              >
                {t.ResetFilters}
              </button>
            </div>
          ) : (
            <>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member, index) => {
                  const categoryBadge =
                    member.category === "director" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-900">
                        <Shield className="h-3 w-3" /> {t.BadgeDirector}
                      </span>
                    ) : member.category === "member" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900">
                        <UserCheck className="h-3 w-3" /> {t.BadgeMember}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-teal-300 bg-teal-100 px-2.5 py-0.5 text-[11px] font-semibold text-teal-900">
                        <Heart className="h-3 w-3" /> {t.BadgeVolunteer}
                      </span>
                    );

                  const mappedRole =
                    member.category === "director"
                      ? t.RoleDirector
                      : member.category === "member"
                        ? t.RoleMember
                        : t.RoleVolunteer;

                  return (
                    <Reveal key={member._id} delay={index * 30}>
                      <Link
                        href={`/${currentLang}/team/${member._id || member.id}`}
                        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-forest/30 hover:shadow-xl"
                      >
                        <div>
                          {/* Avatar & Badges */}
                          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-sand-soft">
                            <Image
                              src={getImageUrl(member.image) || ""}
                              alt={member.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />

                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                              {categoryBadge}
                              <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                                <MapPin className="h-3 w-3 text-sand" />
                                {member.location?.split(",")[0] || "Haiti"}
                              </span>
                            </div>

                            <div className="absolute bottom-3 left-3 right-3 text-white">
                              <h3 className="font-display text-xl font-bold leading-tight group-hover:text-sand">
                                {member.name}
                              </h3>
                              <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-medium text-white/90">
                                  {member.title ?? ""}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Bio preview (HTML stripped) */}
                          <p className="mt-4 text-xs leading-relaxed text-mist line-clamp-3">
                            {member.bio
                              ? member.bio.replace(/<[^>]*>?/gm, "").trim()
                              : ""}
                          </p>
                        </div>

                        {/* Footer / Trigger detail */}
                        <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-xs font-semibold text-forest">
                          <span>{t.ViewProfile}</span>
                          <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>

              <PaginationControls
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </Container>
    </section>
  );
}

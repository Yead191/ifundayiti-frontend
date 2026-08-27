"use client";

import * as React from "react";
import Image from "next/image";
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
import { TeamModal } from "@/features/team/sections/team-modal";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { getTeamMembers } from "@/helpers/next-fetch/teamActions";
import { getImageUrl } from "@/lib/getImageUrl";

interface TeamGridProps {
  initialMembers: any[];
  initialPagination: any;
  stats: {
    totalDirectors: number;
    totalMembers: number;
    totalVolunteers: number;
  };
}

export function TeamGrid({ initialMembers, initialPagination, stats }: TeamGridProps) {
  const [activeCategory, setActiveCategory] = React.useState<TeamCategory>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  const [members, setMembers] = React.useState(initialMembers);
  const [pagination, setPagination] = React.useState(initialPagination);
  const [loading, setLoading] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<any | null>(null);

  // Debounce Search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on new search
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page when category changes
  React.useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  // Fetch Team Members
  React.useEffect(() => {
    let isMounted = true;
    
    // Skip initial fetch on mount since we have initialMembers
    if (
      activeCategory === "all" &&
      debouncedSearch === "" &&
      page === 1 &&
      members === initialMembers
    ) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const res = await getTeamMembers({
        category: activeCategory,
        searchTerm: debouncedSearch,
        page,
        limit: 9,
      });
      if (isMounted && res.success) {
        setMembers(res.data || []);
        setPagination(
          res.pagination || { total: 0, limit: 9, page: 1, totalPage: 1 }
        );
      }
      setLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [activeCategory, debouncedSearch, page]);

  const getCategoryCount = (categoryId: TeamCategory) => {
    if (categoryId === "all") {
      return stats.totalDirectors + stats.totalMembers + stats.totalVolunteers;
    }
    if (categoryId === "directors") return stats.totalDirectors;
    if (categoryId === "members") return stats.totalMembers;
    if (categoryId === "volunteers") return stats.totalVolunteers;
    return 0;
  };

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
              const active = activeCategory === cat.id;
              const count = getCategoryCount(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-forest text-white shadow-md"
                      : "text-forest-deep hover:bg-sand-soft hover:text-forest"
                  }`}
                >
                  {cat.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-sand-soft text-forest"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
            <input
              type="text"
              placeholder="Search by name or focus areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-hairline bg-white py-2.5 pl-10 pr-4 text-sm text-forest-deep placeholder:text-mist focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-mist hover:text-forest"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Description Banner */}
        <div className="mt-6 rounded-2xl border border-hairline bg-white/60 px-5 py-3 text-sm text-mist">
          {TEAM_CATEGORIES.find((c) => c.id === activeCategory)?.description}
        </div>

        {/* Members Grid */}
        {loading ? (
          <div className="mt-12 flex items-center justify-center min-h-[300px]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-forest border-t-transparent" />
          </div>
        ) : members.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-hairline bg-white p-12 text-center">
            <UserCheck className="mx-auto h-12 w-12 text-mist/60" />
            <h3 className="mt-4 font-display text-lg font-bold text-forest-deep">
              No team members found
            </h3>
            <p className="mt-1 text-sm text-mist">
              Try adjusting your search criteria or category filter.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 inline-flex items-center rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-forest-bright"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member, index) => {
                const categoryBadge =
                  member.category === "director" ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-900">
                      <Shield className="h-3 w-3" /> Director
                    </span>
                  ) : member.category === "member" ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900">
                      <UserCheck className="h-3 w-3" /> Core Member
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-teal-300 bg-teal-100 px-2.5 py-0.5 text-[11px] font-semibold text-teal-900">
                      <Heart className="h-3 w-3" /> Volunteer
                    </span>
                  );

                const mappedRole =
                  member.category === "director"
                    ? "Board Director"
                    : member.category === "member"
                      ? "Core Operations Member"
                      : "Volunteer & Ambassador";

                return (
                  <Reveal key={member._id} delay={index * 30}>
                    <article
                      onClick={() => setSelectedMember(member)}
                      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-forest/30 hover:shadow-xl cursor-pointer"
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
                            <p className="text-xs font-semibold tracking-wide text-sand-soft">
                              {mappedRole}
                            </p>
                          </div>
                        </div>

                        {/* Bio preview */}
                        <p className="mt-4 text-xs leading-relaxed text-mist line-clamp-3">
                          {member.bio}
                        </p>
                      </div>

                      {/* Footer / Trigger detail */}
                      <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-xs font-semibold text-forest">
                        <span>View profile & details</span>
                        <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>

            <PaginationControls
              pagination={pagination}
              onPageChange={(p) => setPage(p)}
            />
          </>
        )}

        {/* Modal detail */}
        <TeamModal
          member={selectedMember}
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      </Container>
    </section>
  );
}

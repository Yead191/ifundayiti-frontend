import { TeamHero } from "@/features/team/sections/team-hero";
import { TeamValues } from "@/features/team/sections/team-values";
import { TeamGrid } from "@/features/team/sections/team-grid";
import { TeamCta } from "@/features/team/sections/team-cta";
import { getTeamStats, getTeamMembers } from "@/helpers/next-fetch/teamActions";

export default async function TeamPageContent({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const activeCategory = typeof params.category === "string" ? params.category : "all";
  const searchQuery = typeof params.q === "string" ? params.q : "";
  const page = Number(params.page) || 1;

  const statsRes = await getTeamStats();
  const statsData = statsRes.success && statsRes.data ? statsRes.data : { totalDirectors: 5, totalMembers: 6, totalVolunteers: 50 };

  const membersRes = await getTeamMembers({
    category: activeCategory,
    searchTerm: searchQuery,
    page,
    limit: 9,
  });

  const members = membersRes.success ? membersRes.data || [] : [];
  const pagination = membersRes.success
    ? membersRes.pagination || { total: 0, limit: 9, page: 1, totalPage: 1 }
    : { total: 0, limit: 9, page: 1, totalPage: 1 };

  return (
    <div className="min-h-screen bg-cream">
      <TeamHero stats={statsData} />
      <TeamValues />
      <TeamGrid
        members={members}
        pagination={pagination}
        stats={statsData}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        page={page}
      />
      <TeamCta />
    </div>
  );
}

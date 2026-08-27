import { TeamHero } from "@/features/team/sections/team-hero";
import { TeamValues } from "@/features/team/sections/team-values";
import { TeamGrid } from "@/features/team/sections/team-grid";
import { TeamCta } from "@/features/team/sections/team-cta";
import { getTeamStats, getTeamMembers } from "@/helpers/next-fetch/teamActions";

export default async function TeamPageContent() {
  const statsRes = await getTeamStats();
  const statsData = statsRes.success && statsRes.data ? statsRes.data : { totalDirectors: 5, totalMembers: 6, totalVolunteers: 50 };

  const membersRes = await getTeamMembers({ page: 1, limit: 9 });
  const initialMembers = membersRes.success ? membersRes.data || [] : [];
  const initialPagination = membersRes.success
    ? membersRes.pagination || { total: 0, limit: 9, page: 1, totalPage: 1 }
    : { total: 0, limit: 9, page: 1, totalPage: 1 };

  return (
    <div className="min-h-screen bg-cream">
      <TeamHero stats={statsData} />
      <TeamValues />
      <TeamGrid
        initialMembers={initialMembers}
        initialPagination={initialPagination}
        stats={statsData}
      />
      <TeamCta />
    </div>
  );
}

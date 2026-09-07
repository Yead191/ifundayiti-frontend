import { TeamHero } from "@/features/team/sections/team-hero";
import { TeamValues } from "@/features/team/sections/team-values";
import { TeamSections } from "@/features/team/sections/team-sections";
import { TeamCta } from "@/features/team/sections/team-cta";
import { getTeamStats, getTeamMembers } from "@/helpers/next-fetch/teamActions";
import { getDictionary } from "@/lib/dictionaries";

export default async function TeamPageContent({
  lang,
  searchParams,
}: {
  lang: string;
  searchParams: Promise<any>;
}) {
  const params = await searchParams;
  const searchQuery = typeof params?.q === "string" ? params.q : "";

  // Concurrent fetch for stats, dictionary, and members per category
  const [
    statsRes,
    directorsRes,
    membersRes,
    volunteersRes,
    allMembersRes,
    dict,
  ] = await Promise.all([
    getTeamStats(),
    getTeamMembers({
      category: "directors",
      searchTerm: searchQuery,
      limit: 20,
    }),
    getTeamMembers({ category: "members", searchTerm: searchQuery, limit: 20 }),
    getTeamMembers({
      category: "volunteers",
      searchTerm: searchQuery,
      limit: 20,
    }),
    getTeamMembers({ searchTerm: searchQuery, limit: 20 }),
    getDictionary(lang),
  ]);

  const isDirector = (m: any) =>
    m.category === "director" || m.category === "directors";
  const isCoreMember = (m: any) =>
    m.category === "member" || m.category === "members";
  const isVolunteer = (m: any) =>
    m.category === "volunteer" || m.category === "volunteers";

  // Resolve directors strictly from API
  let directors =
    directorsRes.success && Array.isArray(directorsRes.data)
      ? directorsRes.data
      : [];
  if (
    directors.length === 0 &&
    allMembersRes.success &&
    Array.isArray(allMembersRes.data)
  ) {
    directors = allMembersRes.data.filter(isDirector);
  }

  // Resolve core members strictly from API
  let coreMembers =
    membersRes.success && Array.isArray(membersRes.data) ? membersRes.data : [];
  if (
    coreMembers.length === 0 &&
    allMembersRes.success &&
    Array.isArray(allMembersRes.data)
  ) {
    coreMembers = allMembersRes.data.filter(isCoreMember);
  }

  // Resolve volunteers strictly from API
  let volunteers =
    volunteersRes.success && Array.isArray(volunteersRes.data)
      ? volunteersRes.data
      : [];
  if (
    volunteers.length === 0 &&
    allMembersRes.success &&
    Array.isArray(allMembersRes.data)
  ) {
    volunteers = allMembersRes.data.filter(isVolunteer);
  }

  const statsData = {
    totalDirectors:
      statsRes.success && statsRes.data?.totalDirectors !== undefined
        ? statsRes.data.totalDirectors
        : directors.length,
    totalMembers:
      statsRes.success && statsRes.data?.totalMembers !== undefined
        ? statsRes.data.totalMembers
        : coreMembers.length,
    totalVolunteers:
      statsRes.success && statsRes.data?.totalVolunteers !== undefined
        ? statsRes.data.totalVolunteers
        : volunteers.length,
  };

  // If search query is present, apply filter on members
  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    const filterFn = (m: any) =>
      m.name?.toLowerCase().includes(q) ||
      m.title?.toLowerCase().includes(q) ||
      m.role?.toLowerCase().includes(q) ||
      m.location?.toLowerCase().includes(q) ||
      m.bio?.toLowerCase().includes(q) ||
      (Array.isArray(m.focusAreas) &&
        m.focusAreas.some((f: string) => f.toLowerCase().includes(q)));

    directors = directors.filter(filterFn);
    coreMembers = coreMembers.filter(filterFn);
    volunteers = volunteers.filter(filterFn);
  }

  return (
    <div className="min-h-screen bg-cream">
      <TeamHero stats={statsData} dict={dict.TeamPage.Hero} />
      <TeamValues dict={dict.TeamPage.Values} />
      <TeamSections
        directors={directors}
        coreMembers={coreMembers}
        volunteers={volunteers}
        stats={statsData}
        initialSearchQuery={searchQuery}
        lang={lang}
        dict={dict}
      />
      <TeamCta dict={dict.TeamPage.Cta} lang={lang} />
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  getTeamMemberById,
  getTeamMembers,
} from "@/helpers/next-fetch/teamActions";
import { TeamDetailHero } from "@/features/team/details/team-detail-hero";
import { TeamDetailContent } from "@/features/team/details/team-detail-content";
import { TeamDetailOthers } from "@/features/team/details/team-detail-others";

interface PageProps {
  params: Promise<{ id: string; lang: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, lang } = await params;
  const [res, dict] = await Promise.all([
    getTeamMemberById(id),
    getDictionary(lang),
  ]);
  const member = res.success ? res.data : null;
  const d = dict.TeamPage?.DetailPage;

  if (!member) {
    return buildMetadata({
      title: d?.NotFoundTitle || "Team Member Not Found",
      description:
        d?.NotFoundDesc || "This team member profile could not be found.",
      path: `/${lang}/team/${id}`,
      noIndex: true,
    });
  }

  const plainBio = member.bio
    ? member.bio.replace(/<[^>]*>?/gm, "").trim()
    : "";

  const titleRole = member.title
    ? `${member.title} · `
    : member.role
      ? `${member.role} · `
      : "";

  return buildMetadata({
    title: `${member.name} — ${titleRole}IFundAyiti`,
    description:
      plainBio.slice(0, 160) ||
      `${member.name} serves as ${member.title || member.role || "a key contributor"} at IFundAyiti.`,
    path: `/${lang}/team/${id}`,
    image: getImageUrl(member.image) || "",
    keywords: [
      member.name,
      member.title || "",
      member.role || "",
      "IFundAyiti Team",
      "Haiti micro-grants",
      member.location || "Haiti",
    ].filter(Boolean),
  });
}

export default async function TeamMemberDetailPage({ params }: PageProps) {
  const { id, lang } = await params;

  const [memberRes, othersRes, dict] = await Promise.all([
    getTeamMemberById(id),
    getTeamMembers({ limit: 4 }),
    getDictionary(lang),
  ]);

  const member = memberRes.success ? memberRes.data : null;
  if (!member) notFound();

  const allMembers = othersRes.success && Array.isArray(othersRes.data)
    ? othersRes.data
    : [];

  const otherMembers = allMembers
    .filter((m: any) => (m._id || m.id) !== (member._id || member.id))
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-cream/60">
      <TeamDetailHero member={member} lang={lang} dict={dict.TeamPage} />
      <TeamDetailContent member={member} lang={lang} dict={dict.TeamPage} />
      <TeamDetailOthers
        others={otherMembers}
        lang={lang}
        dict={dict.TeamPage}
      />
    </main>
  );
}

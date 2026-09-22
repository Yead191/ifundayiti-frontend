import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/seo";
import getProfile from "@/helpers/next-fetch/getProfile";
import { getCommunityPosts } from "@/helpers/next-fetch/communityActions";
import { CommunityFeedView } from "@/features/community/components/CommunityFeedView";

interface CommunityPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    searchTerm?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: CommunityPageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict?.CommunityPage;

  return buildMetadata({
    title: t?.Hero?.Title || "Community Forum & Announcements · iFundAyiti",
    description:
      t?.Hero?.Subtitle ||
      "Official announcements from iFundAyiti leadership, open community discussions, and dialogue with grassroots builders.",
    path: `/${lang}/community`,
  });
}

export default async function CommunityPage({
  params,
  searchParams,
}: CommunityPageProps) {
  const { lang } = await params;
  const { searchTerm = "", page = "1" } = await searchParams;

  const [dict, profile, postsRes] = await Promise.all([
    getDictionary(lang),
    getProfile(),
    getCommunityPosts({
      searchTerm,
      page: parseInt(page, 10) || 1,
      limit: 30,
      status: "published",
    }),
  ]);

  const posts =
    postsRes.success && Array.isArray(postsRes.data) ? postsRes.data : [];
  const isLoggedIn = Boolean(profile && (profile._id || profile.email));

  return (
    <CommunityFeedView
      initialPosts={posts}
      lang={lang}
      isLoggedIn={isLoggedIn}
      dict={dict}
    />
  );
}

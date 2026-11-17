import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/seo";
import getProfile from "@/helpers/next-fetch/getProfile";
import {
  getCommunityPosts,
  getMyCommentedPosts,
  getMyLikedPosts,
} from "@/helpers/next-fetch/communityActions";
import type { CommunityTab } from "@/features/community/components/CommunitySidebar";
import { CommunityFeedView } from "@/features/community/components/CommunityFeedView";

interface CommunityPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    searchTerm?: string;
    page?: string;
    tab?: string;
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
  const { searchTerm = "", page = "1", tab: rawTab } = await searchParams;
  const tab: CommunityTab =
    rawTab === "comments" || rawTab === "likes" ? rawTab : "feed";
  const pageNumber = parseInt(page, 10) || 1;

  const [dict, profile] = await Promise.all([
    getDictionary(lang),
    getProfile(),
  ]);
  const isLoggedIn = Boolean(profile && (profile._id || profile.email));
  const activeTab = isLoggedIn ? tab : "feed";

  const [postsRes, commentsMeta, likesMeta] = await Promise.all([
    activeTab === "feed"
      ? getCommunityPosts({
          searchTerm,
          page: pageNumber,
          limit: 30,
          status: "published",
        })
      : Promise.resolve(null),
    isLoggedIn
      ? getMyCommentedPosts(activeTab === "comments" ? pageNumber : 1, activeTab === "comments" ? 30 : 1)
      : Promise.resolve(null),
    isLoggedIn
      ? getMyLikedPosts(activeTab === "likes" ? pageNumber : 1, activeTab === "likes" ? 30 : 1)
      : Promise.resolve(null),
  ]);

  const posts =
    activeTab === "comments"
      ? commentsMeta?.posts || []
      : activeTab === "likes"
        ? likesMeta?.posts || []
        : postsRes?.success && Array.isArray(postsRes.data)
          ? postsRes.data
          : [];

  return (
    <CommunityFeedView
      initialPosts={posts}
      lang={lang}
      isLoggedIn={isLoggedIn}
      user={
        profile
          ? {
              name: profile.name,
              image: profile.image,
              role: profile.role,
            }
          : null
      }
      tab={activeTab}
      commentCount={commentsMeta?.total || 0}
      likeCount={likesMeta?.total || 0}
      dict={dict}
    />
  );
}

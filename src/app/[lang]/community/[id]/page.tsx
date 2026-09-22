import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/seo";
import getProfile from "@/helpers/next-fetch/getProfile";
import {
  getCommunityPostById,
  getCommunityComments,
} from "@/helpers/next-fetch/communityActions";
import { CommunityPostDetailView } from "@/features/community/components/CommunityPostDetailView";

interface PostDetailPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const postRes = await getCommunityPostById(id);

  if (!postRes.success || !postRes.data) {
    return {
      title: "Announcement Not Found · iFundAyiti",
    };
  }

  const post = postRes.data;
  const snippet =
    post.content?.slice(0, 160) || "Join the discussion on iFundAyiti Community Forum.";

  return buildMetadata({
    title: `${post.title || "Community Discussion"} · iFundAyiti`,
    description: snippet,
    path: `/${lang}/community/${id}`,
  });
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { lang, id } = await params;

  const [dict, profile, postRes, commentsRes] = await Promise.all([
    getDictionary(lang),
    getProfile(),
    getCommunityPostById(id),
    getCommunityComments(id, 1, 50),
  ]);

  if (!postRes.success || !postRes.data) {
    notFound();
  }

  const post = postRes.data;
  const initialComments =
    commentsRes.success && Array.isArray(commentsRes.data)
      ? commentsRes.data
      : [];
  const isLoggedIn = Boolean(profile && (profile._id || profile.email));

  return (
    <CommunityPostDetailView
      post={post}
      initialComments={initialComments}
      lang={lang}
      isLoggedIn={isLoggedIn}
      currentUser={profile}
      dict={dict}
    />
  );
}

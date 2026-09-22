"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Pin,
  Lock,
  Share2,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  toggleCommunityPostLike,
  type ICommunityPost,
  type ICommunityComment,
} from "@/helpers/next-fetch/communityActions";
import { CommunityImageGrid } from "./CommunityImageGrid";
import { CommunityCommentsSection } from "./CommunityCommentsSection";

interface CommunityPostDetailViewProps {
  post: ICommunityPost;
  initialComments?: ICommunityComment[];
  lang?: string;
  isLoggedIn?: boolean;
  currentUser?: any;
  dict?: any;
}

export function CommunityPostDetailView({
  post,
  initialComments = [],
  lang = "en",
  isLoggedIn = false,
  currentUser,
  dict,
}: CommunityPostDetailViewProps) {
  const router = useRouter();
  const isHt = lang === "ht";
  const t = dict?.CommunityPage || {};

  // Optimistic like state
  const [hasLiked, setHasLiked] = React.useState(Boolean(post.isLikedByMe));
  const [likeCount, setLikeCount] = React.useState(post.totalLikes || 0);
  const [isLiking, setIsLiking] = React.useState(false);

  React.useEffect(() => {
    setHasLiked(Boolean(post.isLikedByMe));
    setLikeCount(post.totalLikes || 0);
  }, [post.isLikedByMe, post.totalLikes]);

  const author = post.author || {};
  const authorName = author.name || "iFundAyiti Administrator";
  const authorAvatar = author.image ? getImageUrl(author.image) : null;
  const role = (author.role || "").toUpperCase();
  const isAdmin = role === "SUPER_ADMIN" || role === "ADMIN";

  const formattedDate = (() => {
    try {
      const dt = new Date(post.createdAt);
      if (isNaN(dt.getTime())) return "";
      return dt.toLocaleDateString(isHt ? "fr-HT" : "en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  })();

  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      toast.info(
        isHt
          ? "Tanpri konekte pou renmen anons sa a."
          : "Please sign in to like this announcement.",
        {
          action: {
            label: isHt ? "Konekte" : "Sign In",
            onClick: () =>
              router.push(
                `/${lang}/auth/login?redirect=${encodeURIComponent(`/${lang}/community/${post._id}`)}`,
              ),
          },
        },
      );
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    const prevLiked = hasLiked;
    const prevCount = likeCount;

    const nextLiked = !prevLiked;
    const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1);
    setHasLiked(nextLiked);
    setLikeCount(nextCount);

    try {
      const res = await toggleCommunityPostLike(post._id);
      if (res.success && res.data) {
        setHasLiked(res.data.liked);
        setLikeCount(res.data.totalLikes);
      } else {
        setHasLiked(prevLiked);
        setLikeCount(prevCount);
        toast.error(res.message || "Failed to update like status");
      }
    } catch {
      setHasLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error("Failed to update like status");
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    const postUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `/${lang}/community/${post._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title || "iFundAyiti Community Discussion",
          text: post.content?.slice(0, 120),
          url: postUrl,
        });
        return;
      } catch {
        // Fallback
      }
    }

    try {
      await navigator.clipboard.writeText(postUrl);
      toast.success(t.LinkCopied || "Link copied to clipboard!");
    } catch {
      toast.info(postUrl);
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-20 pt-24 sm:pt-28">
      <Container className="max-w-4xl">
        {/* Breadcrumbs Navigation */}
        <div className="mb-6">
          <Link
            href={`/${lang}/community`}
            className="inline-flex items-center gap-2 rounded-xl border border-hairline/80 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-forest-deep shadow-2xs hover:bg-white hover:text-forest transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t.BackToFeed || "Back to Community Feed"}</span>
          </Link>
        </div>

        {/* Main Discussion Article Canvas */}
        <article className="overflow-hidden rounded-3xl border border-hairline/90 bg-white p-6 sm:p-10 shadow-sm space-y-4">
          {/* Header row: Author + Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-full border-2 border-forest/20 bg-forest/5 shadow-xs">
                {authorAvatar ? (
                  <Image
                    src={authorAvatar}
                    alt={authorName}
                    fill
                    className="object-cover"
                    sizes="52px"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-forest font-bold text-base">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-base sm:text-lg font-bold text-forest-deep truncate">
                    {authorName}
                  </h3>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      <ShieldCheck className="h-3 w-3 text-emerald-700" />
                      <span>Admin</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-mist">
                  <Calendar className="h-3.5 w-3.5 text-forest" />
                  <span>{formattedDate}</span>
                  {post.updatedAt && post.updatedAt !== post.createdAt && (
                    <>
                      <span>·</span>
                      <span className="italic opacity-75">
                        {isHt ? "modifye" : "edited"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Badges: Pinned / Locked */}
            <div className="flex items-center gap-2">
              {post.isPinned && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-800 shadow-2xs">
                  <Pin className="h-3.5 w-3.5 fill-amber-700 text-amber-700" />
                  <span>{t.PinnedBadge || "Pinned"}</span>
                </span>
              )}

              {post.isLocked && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sand-soft px-2.5 py-1 text-xs font-semibold text-mist">
                  <Lock className="h-3.5 w-3.5 text-mist" />
                  <span>{t.LockedBadge || "Locked"}</span>
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          {post.title && (
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-forest-deep leading-tight">
              {post.title}
            </h1>
          )}

          {/* Body Content (HTML injected from TipTap) */}
          <div
            className="prose prose-sm sm:prose-base max-w-none text-forest-deep/90 leading-relaxed space-y-4 [&_a]:text-forest [&_a]:underline [&_img]:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Images Grid */}
          {post.images && post.images.length > 0 && (
            <div className="pt-0.5">
              <CommunityImageGrid images={post.images} postTitle={post.title} />
            </div>
          )}

          {/* Engagement Toolbar */}
          <div className="flex items-center justify-between border-t border-hairline pt-5">
            <div className="flex items-center gap-3">
              {/* Like Button */}
              <button
                type="button"
                onClick={handleToggleLike}
                disabled={isLiking}
                className={cn(
                  "group/btn inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                  hasLiked
                    ? "bg-rose-50 text-rose-600 hover:bg-rose-100 ring-1 ring-rose-200"
                    : "bg-sand-soft/70 text-mist hover:bg-sand-soft hover:text-rose-600",
                )}
                title={hasLiked ? "Unlike announcement" : "Like announcement"}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 transition-transform group-hover/btn:scale-115",
                    hasLiked
                      ? "fill-rose-500 text-rose-500"
                      : "text-mist group-hover/btn:text-rose-600",
                  )}
                />
                <span className="font-mono text-sm">{likeCount}</span>
                <span className="hidden sm:inline text-xs font-normal">
                  {hasLiked ? t.Liked || "Liked" : t.Like || "Like"}
                </span>
              </button>

              {/* Comments counter */}
              <div className="inline-flex items-center gap-2 rounded-2xl bg-sand-soft/70 px-4 py-2 text-xs sm:text-sm font-semibold text-mist">
                <MessageSquare className="h-4 w-4 text-forest" />
                <span className="font-mono text-sm">
                  {post.totalComments || 0}
                </span>
                <span className="hidden sm:inline text-xs font-normal">
                  {t.Comments || "Comments"}
                </span>
              </div>
            </div>

            {/* Share Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-xl border-hairline gap-1.5 text-xs font-semibold"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{t.Share || "Share"}</span>
            </Button>
          </div>

          {/* Comments and Nested Replies Section */}
          <CommunityCommentsSection
            postId={post._id}
            initialComments={initialComments}
            initialTotalComments={post.totalComments}
            isLocked={post.isLocked}
            lang={lang}
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            dict={dict}
          />
        </article>
      </Container>
    </div>
  );
}

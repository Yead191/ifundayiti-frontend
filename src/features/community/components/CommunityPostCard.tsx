"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  MessageSquare,
  Pin,
  Lock,
  Share2,
  ShieldCheck,
  User,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  toggleCommunityPostLike,
  type ICommunityPost,
} from "@/helpers/next-fetch/communityActions";
import { CommunityImageGrid } from "./CommunityImageGrid";

interface CommunityPostCardProps {
  post: ICommunityPost;
  lang?: string;
  isLoggedIn?: boolean;
  dict?: any;
}

export function CommunityPostCard({
  post,
  lang = "en",
  isLoggedIn = false,
  dict,
}: CommunityPostCardProps) {
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

  // Relative time format
  const formatTime = (dateStr: string) => {
    try {
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return "";
      const now = new Date();
      const diffMs = now.getTime() - dt.getTime();
      const diffMin = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMin < 1) return isHt ? "Kounye a" : "Just now";
      if (diffMin < 60)
        return isHt ? `${diffMin} min de sa` : `${diffMin}m ago`;
      if (diffHours < 24)
        return isHt ? `${diffHours} èdtan de sa` : `${diffHours}h ago`;
      if (diffDays < 7)
        return isHt ? `${diffDays} jou de sa` : `${diffDays}d ago`;

      return dt.toLocaleDateString(isHt ? "fr-HT" : "en-US", {
        month: "short",
        day: "numeric",
        year: dt.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return "";
    }
  };

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

    // Optimistic toggle
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
        // Rollback
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

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const postUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/${lang}/community/${post._id}`
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
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(postUrl);
      toast.success(t.LinkCopied || "Discussion link copied to clipboard!");
    } catch {
      toast.info(postUrl);
    }
  };

  return (
    <article
      className={cn(
        "group relative rounded-3xl border bg-white p-5 sm:p-7 shadow-xs transition-all hover:shadow-md",
        post.isPinned
          ? "border-amber-400/40 bg-linear-to-b from-amber-50/20 via-white to-white ring-1 ring-amber-400/20"
          : "border-hairline/90 hover:border-forest/20",
      )}
    >
      {/* Top Meta Header: Author + Badges */}
      <div className="flex items-start justify-between gap-3">
        {/* Author Avatar & Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-forest/15 bg-forest/5 shadow-2xs">
            {authorAvatar ? (
              <Image
                src={authorAvatar}
                alt={authorName}
                fill
                className="object-cover"
                sizes="44px"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-forest font-bold text-sm">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm text-forest-deep truncate">
                {authorName}
              </span>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  <ShieldCheck className="h-3 w-3 text-emerald-700" />
                  <span>Admin</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-mist flex items-center gap-1.5">
              <span>{formatTime(post.createdAt)}</span>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <>
                  <span>·</span>
                  <span className="italic opacity-80">
                    {isHt ? "modifye" : "edited"}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right Badges: Pinned & Locked */}
        <div className="flex items-center gap-1.5 shrink-0">
          {post.isPinned && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold text-amber-800 shadow-2xs">
              <Pin className="h-3 w-3 fill-amber-700 text-amber-700" />
              <span>{t.PinnedBadge || "Pinned"}</span>
            </span>
          )}

          {post.isLocked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sand-soft px-2 py-1 text-[10px] font-semibold text-mist">
              <Lock className="h-3 w-3 text-mist" />
              <span className="hidden sm:inline">
                {t.LockedBadge || "Locked"}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-4 space-y-2">
        {post.title && (
          <h2 className="font-display text-lg sm:text-xl font-bold text-forest-deep leading-snug">
            <Link
              href={`/${lang}/community/${post._id}`}
              className="hover:text-forest transition-colors"
            >
              {post.title}
            </Link>
          </h2>
        )}

        {/* Text Snippet / Content (HTML injected from TipTap) */}
        <div
          className="prose prose-sm max-w-none text-xs sm:text-sm text-forest-deep/85 leading-relaxed line-clamp-4 [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Media Attachments Grid */}
      {post.images && post.images.length > 0 && (
        <CommunityImageGrid images={post.images} postTitle={post.title} />
      )}

      {/* Engagement & Footer Toolbar */}
      <div className="mt-5 flex items-center justify-between border-t border-hairline/80 pt-3.5">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={isLiking}
            className={cn(
              "group/btn inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
              hasLiked
                ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                : "bg-sand-soft/60 text-mist hover:bg-sand-soft hover:text-rose-600",
            )}
            title={hasLiked ? "Unlike announcement" : "Like announcement"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-transform group-hover/btn:scale-110",
                hasLiked
                  ? "fill-rose-500 text-rose-500"
                  : "text-mist group-hover/btn:text-rose-600",
              )}
            />
            <span className="font-mono text-xs">{likeCount}</span>
          </button>

          {/* Comment Count / Link */}
          <Link
            href={`/${lang}/community/${post._id}#comments`}
            className="group/comment inline-flex items-center gap-1.5 rounded-xl bg-sand-soft/60 px-3 py-1.5 text-xs font-semibold text-mist hover:bg-sand-soft hover:text-forest transition-all"
          >
            <MessageSquare className="h-4 w-4 text-mist group-hover/comment:text-forest" />
            <span className="font-mono text-xs">
              {post.totalComments || 0}
            </span>
            <span className="hidden sm:inline text-[11px] font-normal">
              {t.Comments || "Comments"}
            </span>
          </Link>

          {/* Locked Notice Indicator */}
          {post.isLocked && (
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-mist italic">
              <Lock className="h-3 w-3" />
              <span>{t.LockedBadge || "Comments locked"}</span>
            </span>
          )}
        </div>

        {/* Right Action: Share & Details */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-xl p-2 text-xs font-semibold text-mist hover:bg-sand-soft hover:text-forest transition cursor-pointer"
            title="Share discussion"
          >
            <Share2 className="h-4 w-4" />
          </button>

          <Link
            href={`/${lang}/community/${post._id}`}
            className="inline-flex items-center gap-1 rounded-xl bg-forest/10 hover:bg-forest hover:text-white px-3 py-1.5 text-xs font-bold text-forest transition cursor-pointer"
          >
            <span>{isHt ? "Wè Diskisyon" : "View Thread"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

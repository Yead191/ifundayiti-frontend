"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Heart, MessageSquare, Share2, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { toggleBlogLike } from "@/helpers/next-fetch/blogActions";

interface BlogEngagementBarProps {
  blogId: string;
  blogSlug: string;
  initialLikes?: number;
  initialLiked?: boolean;
  totalComments?: number;
  isLoggedIn?: boolean;
  lang?: string;
  className?: string;
}

export function BlogEngagementBar({
  blogId,
  blogSlug,
  initialLikes = 0,
  initialLiked = false,
  totalComments = 0,
  isLoggedIn = false,
  lang = "en",
  className,
}: BlogEngagementBarProps) {
  const router = useRouter();
  const [likes, setLikes] = React.useState(initialLikes);
  const [liked, setLiked] = React.useState(initialLiked);
  const [isLiking, setIsLiking] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Sync state if props change
  React.useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  React.useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.info(
        lang === "ht"
          ? "Tanpri konekte pou renmen atik sa a."
          : "Please sign in to like this article.",
        {
          action: {
            label: lang === "ht" ? "Konekte" : "Sign In",
            onClick: () =>
              router.push(
                `/${lang}/auth/login?redirect=${encodeURIComponent(`/${lang}/blogs/${blogSlug}`)}`,
              ),
          },
        },
      );
      return;
    }

    if (isLiking) return;

    // Optimistic UI update
    const previousLiked = liked;
    const previousLikes = likes;
    const nextLiked = !liked;
    const nextLikes = nextLiked ? likes + 1 : Math.max(0, likes - 1);

    setLiked(nextLiked);
    setLikes(nextLikes);
    setIsLiking(true);

    try {
      const res = await toggleBlogLike(blogSlug || blogId);
      if (res.success && res.data) {
        setLiked(res.data.liked);
        setLikes(res.data.totalLikes);
        if (res.data.liked) {
          toast.success(
            lang === "ht"
              ? "Ou renmen atik sa a! ❤️"
              : "Article liked! ❤️",
            { id: "blog-like" },
          );
        }
      } else {
        // Rollback
        setLiked(previousLiked);
        setLikes(previousLikes);
        toast.error(res.message || "Failed to update like status.", {
          id: "blog-like",
        });
      }
    } catch {
      setLiked(previousLiked);
      setLikes(previousLikes);
      toast.error("Network error. Please try again.", { id: "blog-like" });
    } finally {
      setIsLiking(false);
    }
  };

  const scrollToComments = () => {
    const el = document.getElementById("comments");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success(
        lang === "ht" ? "Lyen an kopye!" : "Article link copied to clipboard!",
      );
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-hairline/80 bg-white/90 p-1.5 sm:p-2 shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-lg",
        className,
      )}
    >
      {/* Like Button */}
      <button
        type="button"
        onClick={handleLike}
        disabled={isLiking}
        aria-label="Like article"
        aria-pressed={liked}
        className={cn(
          "group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400",
          liked
            ? "bg-rose-50 text-rose-600 border border-rose-200/80 shadow-2xs"
            : "text-mist hover:bg-neutral-100/80 hover:text-cloud",
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-transform duration-300 group-hover:scale-115",
            liked
              ? "fill-rose-500 text-rose-500 scale-110"
              : "text-mist group-hover:text-rose-500",
          )}
        />
        <span className="font-mono text-xs tabular-nums">{likes}</span>
        <span className="sr-only">
          {liked ? "Unlike article" : "Like article"}
        </span>
      </button>

      <div className="h-4 w-px bg-hairline" />

      {/* Jump to Comments */}
      <button
        type="button"
        onClick={scrollToComments}
        aria-label="View community discussion"
        className="group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold text-mist transition-all duration-200 hover:bg-neutral-100/80 hover:text-cloud cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
      >
        <MessageSquare className="h-4 w-4 transition-transform duration-300 group-hover:scale-115 text-mist group-hover:text-forest" />
        <span className="font-mono text-xs tabular-nums">{totalComments}</span>
        <span className="hidden md:inline text-[11px] text-mist/80 font-normal">
          {lang === "ht" ? "kòmantè" : "comments"}
        </span>
      </button>

      <div className="h-4 w-px bg-hairline" />

      {/* Copy Link / Quick Share */}
      <button
        type="button"
        onClick={handleCopyLink}
        aria-label="Copy link to article"
        title={lang === "ht" ? "Kopye lyen an" : "Copy link"}
        className="group flex h-8 w-8 items-center justify-center rounded-full text-mist transition-all duration-200 hover:bg-neutral-100/80 hover:text-forest cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-600" />
        ) : (
          <Share2 className="h-4 w-4 transition-transform duration-300 group-hover:scale-115" />
        )}
      </button>
    </div>
  );
}

export default BlogEngagementBar;

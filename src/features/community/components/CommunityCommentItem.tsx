"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
  ShieldCheck,
  Check,
  X,
  Send,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  toggleCommentLike,
  updateCommunityComment,
  deleteCommunityComment,
  getCommentReplies,
  replyToCommunityComment,
  type ICommunityComment,
} from "@/helpers/next-fetch/communityActions";
import { CommunityReplyItem } from "./CommunityReplyItem";

interface CommunityCommentItemProps {
  comment: ICommunityComment;
  postId: string;
  isLocked?: boolean;
  lang?: string;
  isLoggedIn?: boolean;
  currentUserId?: string;
  currentUserRole?: string;
  onDeleted?: (commentId: string) => void;
  dict?: any;
}

export function CommunityCommentItem({
  comment,
  postId,
  isLocked = false,
  lang = "en",
  isLoggedIn = false,
  currentUserId,
  currentUserRole,
  onDeleted,
  dict,
}: CommunityCommentItemProps) {
  const router = useRouter();
  const isHt = lang === "ht";
  const t = dict?.CommunityPage || {};

  // Likes state
  const [hasLiked, setHasLiked] = React.useState(Boolean(comment.isLikedByMe));
  const [likeCount, setLikeCount] = React.useState(comment.totalLikes || 0);
  const [isLiking, setIsLiking] = React.useState(false);

  // Edit comment state
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(comment.text);
  const [isSaving, setIsSaving] = React.useState(false);

  // Reply Composer State
  const [showReplyBox, setShowReplyBox] = React.useState(false);
  const [replyText, setReplyText] = React.useState("");
  const [isSubmittingReply, setIsSubmittingReply] = React.useState(false);

  // Nested Replies State
  const [replies, setReplies] = React.useState<ICommunityComment[]>([]);
  const [repliesCount, setRepliesCount] = React.useState(
    comment.totalReplies || 0,
  );
  const [repliesExpanded, setRepliesExpanded] = React.useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = React.useState(false);
  const [hasLoadedReplies, setHasLoadedReplies] = React.useState(false);

  // Deleting state
  const [isDeleting, setIsDeleting] = React.useState(false);

  const author = comment.author || {};
  const authorName = author.name || "Community Member";
  const authorAvatar = author.image ? getImageUrl(author.image) : null;
  const role = (author.role || "").toUpperCase();
  const isAdminAuthor = role === "SUPER_ADMIN" || role === "ADMIN";

  const isMyComment = Boolean(currentUserId && author._id === currentUserId);
  const userRole = (currentUserRole || "").toUpperCase();
  const canModerate =
    userRole === "SUPER_ADMIN" || userRole === "ADMIN" || isMyComment;

  // Format relative timestamp
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
      if (diffMin < 60) return isHt ? `${diffMin}m` : `${diffMin}m ago`;
      if (diffHours < 24) return isHt ? `${diffHours}h` : `${diffHours}h ago`;
      if (diffDays < 7) return isHt ? `${diffDays}d` : `${diffDays}d ago`;

      return dt.toLocaleDateString(isHt ? "fr-HT" : "en-US", {
        month: "short",
        day: "numeric",
        year: dt.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return "";
    }
  };

  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      toast.info(
        isHt
          ? "Tanpri konekte pou renmen kòmantè sa a."
          : "Please sign in to like this comment.",
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
      const res = await toggleCommentLike(comment._id);
      if (res.success && res.data) {
        setHasLiked(res.data.liked);
        setLikeCount(res.data.totalLikes);
      } else {
        setHasLiked(prevLiked);
        setLikeCount(prevCount);
      }
    } catch {
      setHasLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSaveEdit = async () => {
    const trimmed = editText.trim();
    if (!trimmed) {
      toast.error(
        isHt ? "Kòmantè a pa ka vid." : "Comment content cannot be empty.",
      );
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateCommunityComment(comment._id, trimmed, postId);
      if (res.success) {
        toast.success(t.CommentUpdated || "Comment updated successfully");
        setIsEditing(false);
      } else {
        toast.error(res.message || "Failed to update comment");
      }
    } catch {
      toast.error("Failed to update comment");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        t.ConfirmDeleteComment ||
          "Are you sure you want to delete this comment? All replies will also be removed.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteCommunityComment(comment._id, postId);
      if (res.success) {
        toast.success(t.CommentDeleted || "Comment deleted");
        onDeleted?.(comment._id);
      } else {
        toast.error(res.message || "Failed to delete comment");
      }
    } catch {
      toast.error("Failed to delete comment");
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle or Fetch Replies
  const handleToggleReplies = async () => {
    if (repliesExpanded) {
      setRepliesExpanded(false);
      return;
    }

    setRepliesExpanded(true);

    if (!hasLoadedReplies) {
      setIsLoadingReplies(true);
      try {
        const res = await getCommentReplies(comment._id, 1, 50);
        if (res.success && Array.isArray(res.data)) {
          setReplies(res.data);
          setHasLoadedReplies(true);
        }
      } catch {
        toast.error("Failed to load replies");
      } finally {
        setIsLoadingReplies(false);
      }
    }
  };

  // Submit Reply
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.info(
        isHt
          ? "Tanpri konekte pou w ka reponn."
          : "Please sign in to post a reply.",
        {
          action: {
            label: isHt ? "Konekte" : "Sign In",
            onClick: () =>
              router.push(
                `/${lang}/auth/login?redirect=${encodeURIComponent(`/${lang}/community/${postId}#comments`)}`,
              ),
          },
        },
      );
      return;
    }

    const trimmed = replyText.trim();
    if (!trimmed) return;

    setIsSubmittingReply(true);
    try {
      const res = await replyToCommunityComment(comment._id, trimmed, postId);
      if (res.success && res.data) {
        toast.success(isHt ? "Repons lan pibliye!" : "Reply posted!");
        setReplyText("");
        setShowReplyBox(false);

        // Add to replies list
        setReplies((prev) => [...prev, res.data!]);
        setRepliesCount((prev) => prev + 1);
        setRepliesExpanded(true);
        setHasLoadedReplies(true);
      } else {
        toast.error(res.message || "Failed to post reply");
      }
    } catch {
      toast.error("Failed to post reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleReplyDeleted = (replyId: string) => {
    setReplies((prev) => prev.filter((r) => r._id !== replyId));
    setRepliesCount((prev) => Math.max(0, prev - 1));
  };

  if (isDeleting) {
    return (
      <div className="rounded-2xl bg-sand-soft/30 p-4 text-xs text-mist italic opacity-60">
        {isHt ? "Ap efase kòmantè..." : "Deleting comment..."}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-hairline/80 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
      {/* Comment Header: Author & Controls */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-forest/15 bg-forest/5">
            {authorAvatar ? (
              <Image
                src={authorAvatar}
                alt={authorName}
                fill
                className="object-cover"
                sizes="36px"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-xs font-bold text-forest">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs sm:text-sm text-forest-deep truncate">
                {authorName}
              </span>
              {isAdminAuthor && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-100/90 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 uppercase tracking-wider">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  <span>Admin</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-mist">
              {formatTime(comment.createdAt)}
            </p>
          </div>
        </div>

        {/* Menu (Edit/Delete) */}
        {canModerate && !isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="grid h-7 w-7 place-items-center rounded-lg text-mist hover:bg-sand-soft hover:text-forest-deep transition cursor-pointer"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-32 rounded-xl border-hairline p-1 shadow-md text-xs"
            >
              {isMyComment && (
                <DropdownMenuItem
                  onClick={() => {
                    setEditText(comment.text);
                    setIsEditing(true);
                  }}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-forest-deep"
                >
                  <Pencil className="h-3 w-3" />
                  <span>{t.Edit || "Edit"}</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleDelete}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="h-3 w-3" />
                <span>{t.Delete || "Delete"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Body or Inline Edit Mode */}
      {isEditing ? (
        <div className="space-y-2 pt-1">
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
            className="rounded-2xl border-forest/20 text-xs sm:text-sm focus:ring-forest"
          />
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="h-8 text-xs rounded-xl"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              <span>{t.CancelBtn || "Cancel"}</span>
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isSaving}
              onClick={handleSaveEdit}
              className="h-8 text-xs rounded-xl bg-forest text-white"
            >
              {isSaving ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="mr-1 h-3.5 w-3.5" />
              )}
              <span>{t.Save || "Save"}</span>
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-forest-deep/90 leading-relaxed whitespace-pre-line wrap-break-word pl-0.5">
          {comment.text}
        </p>
      )}

      {/* Bottom Actions: Like, Reply toggle */}
      {!isEditing && (
        <div className="flex items-center gap-3 pt-1 border-t border-hairline/60">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleToggleLike}
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer",
              hasLiked
                ? "text-rose-600 font-bold"
                : "text-mist hover:text-rose-600",
            )}
          >
            <Heart
              className={cn(
                "h-3.5 w-3.5",
                hasLiked && "fill-rose-500 text-rose-500",
              )}
            />
            <span className="font-mono text-xs">{likeCount}</span>
          </button>

          {/* Reply Button (if not locked) */}
          {!isLocked && (
            <button
              type="button"
              onClick={() => setShowReplyBox((s) => !s)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-mist hover:text-forest transition cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{t.Reply || "Reply"}</span>
            </button>
          )}

          {/* Expand Replies Button (if replies exist) */}
          {repliesCount > 0 && (
            <button
              type="button"
              onClick={handleToggleReplies}
              className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-forest hover:text-forest-deep transition cursor-pointer"
            >
              <span>
                {repliesExpanded
                  ? t.HideReplies || "Hide replies"
                  : (t.ViewReplies || "View {count} replies").replace(
                      "{count}",
                      String(repliesCount),
                    )}
              </span>
              {repliesExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          )}
        </div>
      )}

      {/* Inline Reply Composer */}
      {showReplyBox && !isLocked && (
        <form onSubmit={handleSubmitReply} className="pt-2">
          <div className="rounded-2xl border border-forest/20 bg-sand-soft/30 p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-mist">
              <span className="font-medium">
                {isHt ? `Reponn ${authorName}:` : `Replying to ${authorName}:`}
              </span>
              <button
                type="button"
                onClick={() => setShowReplyBox(false)}
                className="text-mist hover:text-forest"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={
                t.PostReplyPlaceholder || "Write a thoughtful reply..."
              }
              rows={2}
              className="rounded-xl border-white bg-white text-xs focus:ring-forest"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleSubmitReply(e);
                }
              }}
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyBox(false)}
                className="h-7 text-xs rounded-lg"
              >
                {t.CancelBtn || "Cancel"}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmittingReply || !replyText.trim()}
                className="h-7 text-xs rounded-lg bg-forest text-white"
              >
                {isSubmittingReply ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Send className="mr-1 h-3 w-3" />
                )}
                <span>{t.ReplyBtn || "Reply"}</span>
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Nested Replies Thread */}
      {repliesExpanded && (
        <div className="pt-1 space-y-2 border-t border-hairline/60">
          {isLoadingReplies ? (
            <div className="flex items-center justify-center py-3 text-xs text-mist gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-forest" />
              <span>
                {isHt ? "Ap chaje repons yo..." : "Loading replies..."}
              </span>
            </div>
          ) : replies.length === 0 ? (
            <div className="text-center py-2 text-xs text-mist italic">
              {isHt ? "Poko gen repons." : "No replies yet."}
            </div>
          ) : (
            <div className="space-y-2">
              {replies.map((reply) => (
                <CommunityReplyItem
                  key={reply._id}
                  reply={reply}
                  postId={postId}
                  lang={lang}
                  isLoggedIn={isLoggedIn}
                  currentUserId={currentUserId}
                  currentUserRole={currentUserRole}
                  onDeleted={handleReplyDeleted}
                  dict={dict}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

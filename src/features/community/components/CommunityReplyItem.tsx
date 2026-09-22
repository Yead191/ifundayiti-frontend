"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  MoreHorizontal,
  Pencil,
  Trash2,
  ShieldCheck,
  Check,
  X,
  CornerDownRight,
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
  type ICommunityComment,
} from "@/helpers/next-fetch/communityActions";

interface CommunityReplyItemProps {
  reply: ICommunityComment;
  postId: string;
  lang?: string;
  isLoggedIn?: boolean;
  currentUserId?: string;
  currentUserRole?: string;
  onDeleted?: (replyId: string) => void;
  dict?: any;
}

export function CommunityReplyItem({
  reply,
  postId,
  lang = "en",
  isLoggedIn = false,
  currentUserId,
  currentUserRole,
  onDeleted,
  dict,
}: CommunityReplyItemProps) {
  const router = useRouter();
  const isHt = lang === "ht";
  const t = dict?.CommunityPage || {};

  const [hasLiked, setHasLiked] = React.useState(Boolean(reply.isLikedByMe));
  const [likeCount, setLikeCount] = React.useState(reply.totalLikes || 0);
  const [isLiking, setIsLiking] = React.useState(false);

  // Inline editing state
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(reply.text);
  const [isSaving, setIsSaving] = React.useState(false);

  // Deleting state
  const [isDeleting, setIsDeleting] = React.useState(false);

  const author = reply.author || {};
  const authorName = author.name || "Community Member";
  const authorAvatar = author.image ? getImageUrl(author.image) : null;
  const role = (author.role || "").toUpperCase();
  const isAdminAuthor = role === "SUPER_ADMIN" || role === "ADMIN";

  const isMyReply = Boolean(currentUserId && author._id === currentUserId);
  const userRole = (currentUserRole || "").toUpperCase();
  const canModerate =
    userRole === "SUPER_ADMIN" || userRole === "ADMIN" || isMyReply;

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
      });
    } catch {
      return "";
    }
  };

  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      toast.info(
        isHt
          ? "Tanpri konekte pou renmen repons sa a."
          : "Please sign in to like this reply.",
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
      const res = await toggleCommentLike(reply._id);
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
        isHt ? "Repons la pa ka vid." : "Reply content cannot be empty.",
      );
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateCommunityComment(reply._id, trimmed, postId);
      if (res.success) {
        toast.success(t.CommentUpdated || "Reply updated successfully");
        setIsEditing(false);
      } else {
        toast.error(res.message || "Failed to update reply");
      }
    } catch {
      toast.error("Failed to update reply");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        t.ConfirmDeleteComment || "Are you sure you want to delete this reply?",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteCommunityComment(reply._id, postId);
      if (res.success) {
        toast.success(t.CommentDeleted || "Reply deleted");
        onDeleted?.(reply._id);
      } else {
        toast.error(res.message || "Failed to delete reply");
      }
    } catch {
      toast.error("Failed to delete reply");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isDeleting) {
    return (
      <div className="py-2 text-xs text-mist italic opacity-60">
        {isHt ? "Ap efase repons..." : "Deleting reply..."}
      </div>
    );
  }

  return (
    <div className="group/reply relative flex items-start gap-2.5 pt-3 first:pt-1">
      {/* Indent Thread Line / Connector Icon */}
      <CornerDownRight className="h-3.5 w-3.5 text-mist/40 shrink-0 mt-2 ml-1" />

      {/* Avatar */}
      <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-forest/15 bg-forest/5">
        {authorAvatar ? (
          <Image
            src={authorAvatar}
            alt={authorName}
            fill
            className="object-cover"
            sizes="28px"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-[11px] font-bold text-forest">
            {authorName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 min-w-0 rounded-2xl bg-sand-soft/50 p-3 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="font-bold text-forest-deep truncate">
              {authorName}
            </span>
            {isAdminAuthor && (
              <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-100/90 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 uppercase">
                <ShieldCheck className="h-2.5 w-2.5" />
                <span>Admin</span>
              </span>
            )}
            <span className="text-[10px] text-mist">
              {formatTime(reply.createdAt)}
            </span>
          </div>

          {/* Action Menu (Edit / Delete) */}
          {canModerate && !isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="grid h-6 w-6 place-items-center rounded-lg text-mist hover:bg-sand hover:text-forest-deep transition cursor-pointer"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-32 rounded-xl border-hairline p-1 shadow-md text-xs"
              >
                {isMyReply && (
                  <DropdownMenuItem
                    onClick={() => {
                      setEditText(reply.text);
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

        {/* Reply Body or Edit Mode */}
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              className="rounded-xl border-forest/20 text-xs focus:ring-forest"
            />
            <div className="flex items-center justify-end gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="h-7 text-xs rounded-lg"
              >
                <X className="mr-1 h-3 w-3" />
                <span>{t.CancelBtn || "Cancel"}</span>
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isSaving}
                onClick={handleSaveEdit}
                className="h-7 text-xs rounded-lg bg-forest text-white"
              >
                {isSaving ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Check className="mr-1 h-3 w-3" />
                )}
                <span>{t.Save || "Save"}</span>
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-xs text-forest-deep/90 leading-relaxed whitespace-pre-line wrap-break-word">
            {reply.text}
          </p>
        )}

        {/* Footer actions: Like */}
        {!isEditing && (
          <div className="mt-2 flex items-center gap-3 pt-1 border-t border-hairline/60">
            <button
              type="button"
              onClick={handleToggleLike}
              className={cn(
                "inline-flex items-center gap-1 text-[11px] font-semibold transition cursor-pointer",
                hasLiked
                  ? "text-rose-600 font-bold"
                  : "text-mist hover:text-rose-600",
              )}
            >
              <Heart
                className={cn(
                  "h-3 w-3",
                  hasLiked && "fill-rose-500 text-rose-500",
                )}
              />
              <span className="font-mono">{likeCount}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

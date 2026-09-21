"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Send,
  Loader2,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  createBlogComment,
  deleteBlogComment,
  getBlogComments,
  updateBlogComment,
  type IBlogComment,
} from "@/helpers/next-fetch/blogActions";

interface BlogCommentsSectionProps {
  blogId: string;
  blogSlug: string;
  currentUser?: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  } | null;
  initialTotal?: number;
  lang?: string;
}

function relativeTime(dateStr: string, isHt?: boolean): string {
  if (!dateStr) return "";
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    if (Number.isNaN(diff) || diff < 0) return isHt ? "Kounye a" : "Just now";

    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return isHt ? "Kounye a" : "Just now";
    if (mins < 60) return isHt ? `${mins}m de sa` : `${mins}m ago`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return isHt ? `${hours}è de sa` : `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return isHt ? `${days}j de sa` : `${days}d ago`;

    return new Date(dateStr).toLocaleDateString(isHt ? "fr-HT" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function BlogCommentsSection({
  blogId,
  blogSlug,
  currentUser,
  initialTotal = 0,
  lang = "en",
}: BlogCommentsSectionProps) {
  const router = useRouter();
  const isHt = lang === "ht";
  const userId = currentUser?._id || currentUser?.id;
  const isAdmin =
    currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
  const currentUserAvatar = currentUser?.image
    ? getImageUrl(currentUser.image) || null
    : null;

  const [comments, setComments] = React.useState<IBlogComment[]>([]);
  const [total, setTotal] = React.useState(initialTotal);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [newCommentText, setNewCommentText] = React.useState("");

  // Pagination
  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);
  const [loadingMore, setLoadingMore] = React.useState(false);

  // Editing state
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState("");
  const [updating, setUpdating] = React.useState(false);

  // Deleting state
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Initial fetch
  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await getBlogComments(blogSlug || blogId, 1, 15);
        if (isMounted && res.success) {
          setComments(res.data);
          if (res.pagination) {
            setPage(res.pagination.page);
            setTotalPage(res.pagination.totalPage);
            setTotal(res.pagination.total);
          }
        }
      } catch (err) {
        console.error("Failed to fetch comments", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [blogId, blogSlug]);

  // Load more
  const handleLoadMore = async () => {
    if (page >= totalPage || loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await getBlogComments(blogSlug || blogId, nextPage, 15);
      if (res.success && Array.isArray(res.data)) {
        setComments((prev) => [...prev, ...res.data]);
        if (res.pagination) {
          setPage(res.pagination.page);
          setTotalPage(res.pagination.totalPage);
        }
      }
    } catch {
      toast.error(
        isHt
          ? "Erè pandan chajman kòmantè yo."
          : "Failed to load more comments.",
      );
    } finally {
      setLoadingMore(false);
    }
  };

  // Submit comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.info(
        isHt
          ? "Tanpri konekte pou w ka pibliye yon kòmantè."
          : "Please sign in to publish a comment.",
        {
          action: {
            label: isHt ? "Konekte" : "Sign In",
            onClick: () =>
              router.push(
                `/${lang}/auth/login?redirect=${encodeURIComponent(`/${lang}/blogs/${blogSlug}#comments`)}`,
              ),
          },
        },
      );
      return;
    }

    const trimmed = newCommentText.trim();
    if (!trimmed) {
      toast.error(
        isHt ? "Kòmantè a pa ka vid." : "Comment content cannot be empty.",
      );
      return;
    }

    if (trimmed.length > 1000) {
      toast.error(
        isHt
          ? "Kòmantè a twò long (maksimòm 1,000 karaktè)."
          : "Comment is too long (maximum 1,000 characters).",
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await createBlogComment(blogSlug || blogId, trimmed);
      if (res.success && res.data) {
        setComments((prev) => [res.data!, ...prev]);
        setTotal((prev) => prev + 1);
        setNewCommentText("");
        toast.success(
          isHt
            ? "Kòmantè ou a pibliye avèk siksè! 🎉"
            : "Comment published successfully! 🎉",
        );
      } else {
        toast.error(
          res.message ||
            (isHt ? "Pa ka pibliye kòmantè a." : "Failed to publish comment."),
        );
      }
    } catch {
      toast.error(
        isHt
          ? "Erè rezo. Tanpri eseye ankò."
          : "Network error. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Start edit
  const handleStartEdit = (comment: IBlogComment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  // Save edit
  const handleSaveEdit = async (commentId: string) => {
    const trimmed = editText.trim();
    if (!trimmed) {
      toast.error(isHt ? "Kòmantè a pa ka vid." : "Comment cannot be empty.");
      return;
    }

    setUpdating(true);
    try {
      const res = await updateBlogComment(commentId, trimmed, blogSlug);
      if (res.success && res.data) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? { ...c, text: res.data!.text, updatedAt: res.data!.updatedAt }
              : c,
          ),
        );
        setEditingId(null);
        setEditText("");
        toast.success(
          isHt ? "Kòmantè a modifye!" : "Comment updated successfully!",
        );
      } else {
        toast.error(res.message || "Failed to update comment");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setUpdating(false);
    }
  };

  // Delete comment
  const handleDelete = async (commentId: string) => {
    try {
      const res = await deleteBlogComment(commentId, blogSlug);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        setTotal((prev) => Math.max(0, prev - 1));
        setDeletingId(null);
        toast.success(
          isHt ? "Kòmantè a efase." : "Comment deleted successfully.",
        );
      } else {
        toast.error(res.message || "Failed to delete comment");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <section
      id="comments"
      className="scroll-mt-28 mt-14 pt-10 border-t border-hairline/80"
    >
      {/* Section Title Bar */}
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-forest/10 text-forest shadow-xs">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-forest-deep sm:text-3xl">
              {isHt ? "Echanj ak Kòmantè" : "Community Reflections"}
            </h2>
            <p className="text-xs sm:text-sm text-mist">
              {isHt
                ? "Pataje opinyon w, poze kesyon, epi konekte ak kominote a."
                : "Share reflections, celebrate grassroots milestones, and join the conversation."}
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-forest/20 bg-forest/5 px-3 py-1 font-mono text-xs font-bold text-forest">
          <span>{total}</span>
          <span className="hidden sm:inline font-sans text-[11px] font-medium text-mist">
            {isHt ? "kòmantè" : "responses"}
          </span>
        </span>
      </div>

      {/* New Comment Box / Guest Invitation Card */}
      {userId ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-hairline/90 bg-white/90 p-4 sm:p-6 shadow-sm backdrop-blur-md transition-all focus-within:border-forest/40 focus-within:shadow-md mb-10"
        >
          <div className="flex items-start gap-3.5">
            {/* User Avatar */}
            {currentUserAvatar ? (
              <Image
                src={currentUserAvatar}
                alt={currentUser?.name || "You"}
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-forest/20"
              />
            ) : (
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest text-sm font-bold text-white shadow-xs">
                {(currentUser?.name || "U").charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-forest-deep">
                  {currentUser?.name || "You"}
                </span>
                <span className="text-[11px] text-mist/70">
                  {newCommentText.length}/1000
                </span>
              </div>

              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder={
                  isHt
                    ? "Ki refleksyon ou sou atik sa a? Ekri kòmantè w la isit la..."
                    : "What are your reflections on this initiative? Share your thoughts with the community..."
                }
                className="w-full resize-none rounded-2xl border border-hairline/60 bg-sand-soft/30 p-3.5 text-sm text-cloud placeholder:text-mist/70 focus:border-forest/40 focus:bg-white focus:outline-none transition-all"
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
              />

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-mist hidden sm:inline">
                  {isHt
                    ? "Peze Ctrl+Enter pou w pibliye rapid"
                    : "Tip: Press Ctrl+Enter to submit"}
                </span>

                <Button
                  type="submit"
                  disabled={submitting || !newCommentText.trim()}
                  size="sm"
                  className="ml-auto rounded-xl bg-forest hover:bg-forest-bright text-xs font-bold text-white shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      <span>{isHt ? "Pibliye..." : "Posting..."}</span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                      <span>
                        {isHt ? "Pibliye Kòmantè" : "Post Reflection"}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 overflow-hidden rounded-3xl border border-forest/20 bg-linear-to-r from-forest/5 via-sand-soft/30 to-forest/5 p-6 sm:p-8 backdrop-blur-md text-center shadow-xs">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-forest/10 text-forest shadow-2xs mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-forest-deep">
            {isHt
              ? "Antre nan Diskisyon an"
              : "Join the Community Conversation"}
          </h3>
          <p className="mx-auto mt-1 max-w-md text-xs sm:text-sm text-mist leading-relaxed">
            {isHt
              ? "Konekte sou kont ou pou w ka bay kòmantè, poze kesyon sou pwojè yo, epi sipòte bati kominote Ayiti a."
              : "Sign in to share reflections, ask questions about field initiatives, and connect directly with local Haitian builders."}
          </p>

          <div className="mt-5 flex justify-center">
            <Button
              asChild
              size="sm"
              className="rounded-xl bg-forest hover:bg-forest-bright text-xs font-bold text-white shadow-xs cursor-pointer"
            >
              <Link
                href={`/${lang}/auth/login?redirect=${encodeURIComponent(`/${lang}/blogs/${blogSlug}#comments`)}`}
              >
                <LogIn className="mr-1.5 h-3.5 w-3.5" />
                <span>
                  {isHt ? "Konekte Pou Kòmante" : "Sign In to Comment"}
                </span>
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-mist gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-forest" />
            <p className="text-xs">
              {isHt ? "Chaje kòmantè yo..." : "Loading reflections..."}
            </p>
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-3xl border border-hairline/80 bg-white/60 p-10 text-center backdrop-blur-md sm:p-14 shadow-2xs">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-forest/10 text-forest">
              <MessageSquare className="h-7 w-7" />
            </div>
            <h4 className="mt-4 font-display text-base font-bold text-forest-deep">
              {isHt ? "Poko gen kòmantè" : "No reflections yet"}
            </h4>
            <p className="mx-auto mt-1 max-w-sm text-xs text-mist leading-relaxed">
              {isHt
                ? "Fè premye kòmantè a pou pataje sa ou panse sou atik sa a!"
                : "Be the first community member to share your thoughts or words of encouragement on this story!"}
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const author = comment.author || {};
            const isMyComment = Boolean(userId && author._id === userId);
            const canDelete = isMyComment || isAdmin;
            const isEditingThis = editingId === comment._id;
            const isDeletingThis = deletingId === comment._id;

            const authorName = author.name || "Community Member";
            const authorAvatar = author.image
              ? getImageUrl(author.image)
              : null;
            const roleBadge = author.role;

            return (
              <article
                key={comment._id}
                className="group relative rounded-2xl border border-hairline/80 bg-white/90 p-4 sm:p-5 shadow-2xs backdrop-blur-md transition-all hover:border-forest/30 hover:shadow-xs"
              >
                <div className="flex items-start gap-3.5">
                  {/* Author Avatar */}
                  {authorAvatar ? (
                    <Image
                      src={authorAvatar}
                      alt={authorName}
                      width={38}
                      height={38}
                      className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-forest/15"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/10 text-xs font-bold text-forest shadow-2xs">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    {/* Header: Author Name, Role Badge, Date */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-forest-deep">
                          {authorName}
                        </span>

                        {roleBadge === "SUPER_ADMIN" && roleBadge && (
                          <span className="rounded-full border border-forest/20 bg-forest/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest">
                            Admin
                          </span>
                        )}

                        {isMyComment && (
                          <span className="rounded-full bg-sand-soft px-1.5 py-0.5 text-[10px] font-semibold text-mist">
                            {isHt ? "Ou" : "You"}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Edit / Delete Menu for owner or admin */}
                        {canDelete && !isEditingThis && (
                          <div className="flex flex-row-reverse items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            {isMyComment && (
                              <button
                                type="button"
                                onClick={() => handleStartEdit(comment)}
                                title={isHt ? "Modifye" : "Edit"}
                                className="grid h-7 w-7 place-items-center rounded-lg text-mist hover:bg-forest/10 hover:text-forest transition-colors cursor-pointer"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setDeletingId(comment._id)}
                              title={isHt ? "Efase" : "Delete"}
                              className="grid h-7 w-7 place-items-center rounded-lg text-mist hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                        <span className="text-[11px] text-mist">
                          {relativeTime(comment.createdAt, isHt)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Confirmation Alert Banner */}
                    {isDeletingThis && (
                      <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-900 animate-in fade-in-50">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                          <span className="font-semibold">
                            {isHt
                              ? "Èske w sèten ou vle efase kòmantè sa a?"
                              : "Are you sure you want to delete this reflection?"}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingId(null)}
                            className="h-7 rounded-lg text-xs"
                          >
                            {isHt ? "Anile" : "Cancel"}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleDelete(comment._id)}
                            className="h-7 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs text-white"
                          >
                            {isHt ? "Efase kounye a" : "Delete"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Comment Body / Edit View */}
                    {isEditingThis ? (
                      <div className="mt-2.5 space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={2}
                          maxLength={1000}
                          className="w-full resize-none rounded-xl border border-forest/30 bg-sand-soft/20 p-2.5 text-xs sm:text-sm text-cloud focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingId(null);
                              setEditText("");
                            }}
                            className="h-7 rounded-lg text-xs"
                          >
                            <X className="mr-1 h-3 w-3" />
                            {isHt ? "Anile" : "Cancel"}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            disabled={updating || !editText.trim()}
                            onClick={() => handleSaveEdit(comment._id)}
                            className="h-7 rounded-lg bg-forest text-xs font-semibold text-white shadow-xs"
                          >
                            {updating ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Check className="mr-1 h-3 w-3" />
                            )}
                            {isHt ? "Sove" : "Save"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs sm:text-sm text-cloud/90 leading-relaxed whitespace-pre-line">
                        {comment.text}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}

        {/* Load More Button */}
        {page < totalPage && (
          <div className="pt-4 text-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loadingMore}
              onClick={handleLoadMore}
              className="rounded-xl border-hairline bg-white/80 px-6 text-xs font-semibold text-forest shadow-xs hover:bg-white cursor-pointer"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  <span>{isHt ? "Chaje plis..." : "Loading more..."}</span>
                </>
              ) : (
                <span>
                  {isHt
                    ? `Chaje plis kòmantè (${total - comments.length} ki rete)`
                    : `Load more reflections (${total - comments.length} remaining)`}
                </span>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default BlogCommentsSection;

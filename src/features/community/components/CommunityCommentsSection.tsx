"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Send,
  Lock,
  LogIn,
  Sparkles,
  User,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/getImageUrl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  createCommunityComment,
  type ICommunityComment,
} from "@/helpers/next-fetch/communityActions";
import { CommunityCommentItem } from "./CommunityCommentItem";

interface CommunityCommentsSectionProps {
  postId: string;
  initialComments?: ICommunityComment[];
  initialTotalComments?: number;
  isLocked?: boolean;
  lang?: string;
  isLoggedIn?: boolean;
  currentUser?: any;
  dict?: any;
}

export function CommunityCommentsSection({
  postId,
  initialComments = [],
  initialTotalComments = 0,
  isLocked = false,
  lang = "en",
  isLoggedIn = false,
  currentUser,
  dict,
}: CommunityCommentsSectionProps) {
  const router = useRouter();
  const isHt = lang === "ht";
  const t = dict?.CommunityPage || {};

  const [comments, setComments] =
    React.useState<ICommunityComment[]>(initialComments);
  const [totalCount, setTotalCount] = React.useState(
    initialTotalComments || initialComments.length,
  );
  const [newCommentText, setNewCommentText] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setComments(initialComments);
    setTotalCount(initialTotalComments || initialComments.length);
  }, [initialComments, initialTotalComments]);

  const currentUserId = currentUser?._id;
  const currentUserRole = currentUser?.role;
  const userAvatar = currentUser?.image
    ? getImageUrl(currentUser.image)
    : null;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.info(
        isHt
          ? "Tanpri konekte pou w ka pibliye yon kòmantè."
          : "Please sign in to publish a comment.",
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

    const trimmed = newCommentText.trim();
    if (!trimmed) {
      toast.error(
        isHt ? "Kòmantè a pa ka vid." : "Comment content cannot be empty.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createCommunityComment(postId, trimmed);
      if (res.success && res.data) {
        toast.success(
          isHt
            ? "Kòmantè w la pibliye avèk siksè!"
            : "Comment posted successfully!",
        );
        setNewCommentText("");
        setComments((prev) => [res.data!, ...prev]);
        setTotalCount((prev) => prev + 1);
      } else {
        toast.error(res.message || "Failed to post comment");
      }
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    setTotalCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <section id="comments" className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <div className="flex items-center gap-2 text-forest-deep">
          <MessageSquare className="h-5 w-5 text-forest" />
          <h3 className="font-display text-xl font-bold tracking-tight">
            {t.Comments || "Discussion & Reflections"}
          </h3>
          <span className="rounded-full bg-sand-soft px-2.5 py-0.5 font-mono text-xs font-bold text-forest">
            {totalCount}
          </span>
        </div>
      </div>

      {/* LOCKED NOTICE BANNER */}
      {isLocked && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-900">
          <Lock className="h-4 w-4 shrink-0 text-amber-700" />
          <span>
            {t.LockedNotice ||
              "Comments have been locked by an administrator for this announcement."}
          </span>
        </div>
      )}

      {/* TOP-LEVEL COMMENT COMPOSER (WHEN NOT LOCKED) */}
      {!isLocked && (
        <>
          {isLoggedIn ? (
            <form onSubmit={handleSubmitComment} className="relative">
              <div className="rounded-3xl border border-hairline/90 bg-white p-4 sm:p-5 shadow-xs transition-all focus-within:border-forest/40 focus-within:ring-2 focus-within:ring-forest/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-forest/15 bg-forest/5">
                    {userAvatar ? (
                      <Image
                        src={userAvatar}
                        alt={currentUser?.name || "User"}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-xs font-bold text-forest">
                        {(currentUser?.name || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-forest-deep">
                    {currentUser?.name || "Verified Member"}
                  </span>
                </div>

                <Textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={
                    t.PostCommentPlaceholder ||
                    "Join the discussion or share your feedback..."
                  }
                  rows={3}
                  className="rounded-2xl border-sand-soft bg-sand-soft/30 text-xs sm:text-sm focus:border-forest focus:bg-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleSubmitComment(e);
                    }
                  }}
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-mist hidden sm:inline">
                    {isHt
                      ? "Ide: Peze Ctrl + Enter pou voye"
                      : "Tip: Press Ctrl + Enter to submit"}
                  </span>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting || !newCommentText.trim()}
                    className="h-8.5 rounded-xl bg-forest px-4 text-xs font-bold text-white shadow-xs hover:bg-forest-deep ml-auto"
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    <span>{t.PostBtn || "Post Comment"}</span>
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            /* GUEST INVITATION PROMPT CARD */
            <div className="overflow-hidden rounded-3xl border border-forest/20 bg-linear-to-r from-forest/5 via-sand-soft/30 to-forest/5 p-6 sm:p-8 backdrop-blur-md text-center shadow-xs">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-forest/10 text-forest shadow-2xs mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-forest-deep">
                {t.SignInToInteract || "Sign In to Participate"}
              </h3>
              <p className="mx-auto mt-1 max-w-md text-xs sm:text-sm text-mist leading-relaxed">
                {t.SignInDesc ||
                  "Join the conversation, leave reflections, and connect with Haitian builders."}
              </p>

              <div className="mt-5 flex justify-center">
                <Button
                  asChild
                  size="sm"
                  className="rounded-xl bg-forest hover:bg-forest-deep text-xs font-bold text-white shadow-xs cursor-pointer"
                >
                  <Link
                    href={`/${lang}/auth/login?redirect=${encodeURIComponent(`/${lang}/community/${postId}#comments`)}`}
                  >
                    <LogIn className="mr-1.5 h-3.5 w-3.5" />
                    <span>{t.SignInToInteract || "Sign In to Comment"}</span>
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* COMMENTS LIST */}
      <div className="space-y-4 pt-2">
        {comments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-hairline/90 bg-sand-soft/20 p-8 text-center space-y-2">
            <MessageSquare className="mx-auto h-8 w-8 text-mist/60" />
            <h4 className="font-display text-sm font-bold text-forest-deep">
              {isHt ? "Poko gen kòmantè" : "No comments yet"}
            </h4>
            <p className="text-xs text-mist max-w-sm mx-auto">
              {isHt
                ? "Fè premye kòmantè a pou pataje opinyon w oswa kòmanse yon konvèsasyon!"
                : "Be the first to share your thoughts, reflections, or reflections on this announcement!"}
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommunityCommentItem
              key={comment._id}
              comment={comment}
              postId={postId}
              isLocked={isLocked}
              lang={lang}
              isLoggedIn={isLoggedIn}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              onDeleted={handleCommentDeleted}
              dict={dict}
            />
          ))
        )}
      </div>
    </section>
  );
}

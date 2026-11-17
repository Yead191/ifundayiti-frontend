"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MessageSquare, Newspaper, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/getImageUrl";

export type CommunityTab = "feed" | "comments" | "likes";

interface CommunitySidebarProps {
  lang: string;
  tab: CommunityTab;
  isLoggedIn: boolean;
  user?: {
    name?: string;
    image?: string;
    role?: string;
  } | null;
  commentCount: number;
  likeCount: number;
  dict?: any;
  onTabChange: (tab: CommunityTab) => void;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-sand-soft/80 px-2 py-3 text-center">
      <p className="font-display text-lg font-semibold text-forest-deep tabular-nums">
        {value}
      </p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-mist">
        {label}
      </p>
    </div>
  );
}

export function CommunitySidebar({
  lang,
  tab,
  isLoggedIn,
  user,
  commentCount,
  likeCount,
  dict,
  onTabChange,
}: CommunitySidebarProps) {
  const t = dict?.CommunityPage?.Sidebar || {};
  const name = user?.name || "Member";
  const avatar = user?.image ? getImageUrl(user.image) : "";
  const role = (user?.role || "").toUpperCase();
  const roleLabel =
    role === "SUPER_ADMIN" || role === "ADMIN"
      ? t.Admin || "Admin"
      : t.Member || "Member";

  const items: {
    id: CommunityTab;
    label: string;
    icon: typeof Newspaper;
    count?: number;
  }[] = [
    { id: "feed", label: t.Feed || "Community Feed", icon: Newspaper },
    {
      id: "comments",
      label: t.MyComments || "My Comments",
      icon: MessageSquare,
      count: commentCount,
    },
    {
      id: "likes",
      label: t.MyLikes || "My Likes",
      icon: Heart,
      count: likeCount,
    },
  ];

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      {isLoggedIn ? (
        <div className="overflow-hidden rounded-3xl border border-hairline bg-white shadow-xs">
          <div className="h-16 bg-linear-to-r from-forest-deep to-forest" />
          <div className="px-5 pb-5">
            <div className="-mt-8">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-sand-soft">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-forest">
                    <User className="h-7 w-7" />
                  </div>
                )}
              </div>
            </div>
            <h2 className="mt-3 font-display text-lg font-semibold text-forest-deep">
              {name}
            </h2>
            <span className="mt-1 inline-flex rounded-full bg-forest/10 px-2.5 py-0.5 text-xs font-semibold text-forest">
              {roleLabel}
            </span>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Stat label={t.Comments || "Comments"} value={commentCount} />
              <Stat label={t.Likes || "Likes"} value={likeCount} />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-hairline bg-white p-6 text-center shadow-xs">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-sand-soft text-forest">
            <User className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-mist">
            {t.SignInPrompt ||
              "Sign in to comment, like posts, and see your activity."}
          </p>
          <Button asChild className="mt-4 w-full rounded-xl">
            <Link
              href={`/${lang}/auth/login?redirect=${encodeURIComponent(`/${lang}/community`)}`}
            >
              {t.SignIn || "Sign in"}
            </Link>
          </Button>
        </div>
      )}

      <nav className="rounded-3xl border border-hairline bg-white p-2 shadow-xs">
        {items.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          const locked = !isLoggedIn && item.id !== "feed";
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors",
                active
                  ? "bg-forest text-white"
                  : "text-forest-deep hover:bg-sand-soft",
                locked && "opacity-70",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isLoggedIn && item.count !== undefined ? (
                <span
                  className={cn(
                    "min-w-6 rounded-full px-2 py-0.5 text-center text-xs tabular-nums",
                    active ? "bg-white/20 text-white" : "bg-sand-soft text-mist",
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

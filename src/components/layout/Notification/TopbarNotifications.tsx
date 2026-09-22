"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  CheckCheck,
  Heart,
  Inbox,
  Loader2,
  MessageSquare,
  ShoppingBag,
  FileText,
  Calendar,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { io, type Socket } from "socket.io-client";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  getNotificationsAction,
  readAllNotificationsAction,
  readNotificationAction,
  deleteNotificationAction,
  clearAllNotificationsAction,
  type NotificationItem,
  type NotificationsPayload,
} from "./actions";

interface TopbarNotificationsProps {
  userId?: string;
  lang?: string;
  className?: string;
}

const PAGE_LIMIT = 10;

/**
 * Format relative time localized for English and Haitian Creole.
 */
function formatRelativeTime(iso: string, lang: string = "en") {
  const isHt = lang === "ht";
  const dt = new Date(iso);
  const diff = Date.now() - dt.getTime();
  if (Number.isNaN(diff) || diff < 0) return "";
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return isHt ? "Kounye a" : "Just now";
  if (mins < 60) return isHt ? `${mins}m` : `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return isHt ? `${hours}h` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return isHt ? `${days}d` : `${days}d ago`;

  return dt.toLocaleDateString(isHt ? "fr-HT" : "en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Safely parse notification payload from API.
 */
function parsePayload(data: NotificationsPayload | undefined | null) {
  if (!data || typeof data !== "object") {
    return { list: [] as NotificationItem[], unreadCount: 0 };
  }
  const list = Array.isArray(data.data) ? data.data : [];
  const unreadCount =
    typeof data.unreadCount === "number"
      ? data.unreadCount
      : list.filter((n) => !n.seen).length;
  return { list, unreadCount };
}

/**
 * Language-aware path resolution for iFundAyiti routing.
 */
export function resolveNotificationPath(
  path?: string,
  lang: string = "en",
): string | undefined {
  if (!path) return undefined;

  let clean = path.trim();

  // Strip existing locale if present (e.g. /en/... or /ht/...)
  if (clean.startsWith("/en/") || clean === "/en") {
    clean = clean.replace(/^\/en/, "");
  } else if (clean.startsWith("/ht/") || clean === "/ht") {
    clean = clean.replace(/^\/ht/, "");
  }

  // Ensure starts with /
  if (!clean.startsWith("/")) {
    clean = `/${clean}`;
  }

  // Map legacy / backend shortcuts to active iFundAyiti routes
  if (clean === "/donations" || clean === "/my-donations") {
    clean = "/dashboard/my-donations";
  } else if (clean === "/orders" || clean === "/my-orders") {
    clean = "/dashboard/my-orders";
  } else if (clean === "/subscriptions") {
    clean = "/dashboard";
  } else if (clean === "/applications") {
    clean = "/track-application";
  }

  return `/${lang}${clean === "/" ? "" : clean}`;
}

/**
 * Contextual icon based on notification title or target path.
 */
function getNotificationIcon(title: string = "", path: string = "") {
  const lower = `${title} ${path}`.toLowerCase();

  if (lower.includes("donat") || lower.includes("fund")) {
    return {
      Icon: Heart,
      badgeColor: "bg-emerald-500/10 text-emerald-600",
    };
  }
  if (
    lower.includes("order") ||
    lower.includes("shop") ||
    lower.includes("product") ||
    lower.includes("cart")
  ) {
    return {
      Icon: ShoppingBag,
      badgeColor: "bg-amber-500/10 text-amber-600",
    };
  }
  if (
    lower.includes("community") ||
    lower.includes("comment") ||
    lower.includes("reply") ||
    lower.includes("post") ||
    lower.includes("forum") ||
    lower.includes("blog")
  ) {
    return {
      Icon: MessageSquare,
      badgeColor: "bg-forest/10 text-forest",
    };
  }
  if (
    lower.includes("grant") ||
    lower.includes("apply") ||
    lower.includes("application") ||
    lower.includes("track")
  ) {
    return {
      Icon: FileText,
      badgeColor: "bg-sky-500/10 text-sky-600",
    };
  }
  if (lower.includes("event") || lower.includes("calendar")) {
    return {
      Icon: Calendar,
      badgeColor: "bg-purple-500/10 text-purple-600",
    };
  }

  return {
    Icon: Sparkles,
    badgeColor: "bg-sand-soft text-forest",
  };
}

export function TopbarNotifications({
  userId,
  lang = "en",
  className,
}: TopbarNotificationsProps) {
  const router = useRouter();
  const isHt = lang === "ht";

  const [notifications, setNotifications] = React.useState<NotificationItem[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");
  const [isFetching, setIsFetching] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);

  const pageRef = React.useRef(1);
  const totalPageRef = React.useRef(1);
  const loadingMoreRef = React.useRef(false);
  const fetchingRef = React.useRef(false);
  const openRef = React.useRef(false);
  const fetchGenRef = React.useRef(0);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const syncRef = React.useRef<(opts?: { quiet?: boolean }) => Promise<void>>(
    async () => {},
  );

  const hasMore = page < totalPage;

  // Filtered list
  const displayedNotifications = React.useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((n) => !n.seen);
    }
    return notifications;
  }, [notifications, filter]);

  // Sync latest from server
  const syncFromServer = React.useCallback(
    async (opts?: { quiet?: boolean }) => {
      if (!userId) return;

      const gen = ++fetchGenRef.current;
      fetchingRef.current = true;
      if (!opts?.quiet) setIsFetching(true);

      try {
        const res = await getNotificationsAction(1, PAGE_LIMIT);
        if (gen !== fetchGenRef.current) return;

        if (res.success) {
          const { list, unreadCount: count } = parsePayload(res.data);
          setNotifications(list);
          setUnreadCount(count);

          const nextPage = Number(res.pagination?.page) || 1;
          const nextTotal = Number(res.pagination?.totalPage) || 1;
          pageRef.current = nextPage;
          totalPageRef.current = nextTotal;
          setPage(nextPage);
          setTotalPage(nextTotal);
          loadingMoreRef.current = false;
        } else if (!opts?.quiet) {
          toast.error(res.message || "Failed to load notifications.");
        }
      } catch {
        if (!opts?.quiet && gen === fetchGenRef.current) {
          toast.error("Network error loading notifications.");
        }
      } finally {
        if (gen === fetchGenRef.current) {
          fetchingRef.current = false;
          setIsFetching(false);
        }
      }
    },
    [userId],
  );

  syncRef.current = syncFromServer;

  // Infinite scroll load more
  const loadMore = React.useCallback(async () => {
    if (
      !userId ||
      fetchingRef.current ||
      loadingMoreRef.current ||
      pageRef.current >= totalPageRef.current
    ) {
      return;
    }

    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    const nextPage = pageRef.current + 1;
    const gen = fetchGenRef.current;

    try {
      const res = await getNotificationsAction(nextPage, PAGE_LIMIT);
      if (gen !== fetchGenRef.current) return;

      if (res.success) {
        const { list: incoming, unreadCount: count } = parsePayload(res.data);

        setNotifications((prev) => {
          const seenIds = new Set(prev.map((n) => n._id));
          const fresh = incoming.filter((n) => !seenIds.has(n._id));
          return fresh.length ? [...prev, ...fresh] : prev;
        });
        setUnreadCount(count);

        const resolvedPage = Number(res.pagination?.page) || nextPage;
        const resolvedTotal =
          Number(res.pagination?.totalPage) || totalPageRef.current;
        pageRef.current = resolvedPage;
        totalPageRef.current = resolvedTotal;
        setPage(resolvedPage);
        setTotalPage(resolvedTotal);
      }
    } finally {
      if (gen === fetchGenRef.current) {
        loadingMoreRef.current = false;
        setIsLoadingMore(false);
      }
    }
  }, [userId]);

  const fillViewport = React.useCallback(() => {
    const el = listRef.current;
    if (!el || !openRef.current) return;
    if (fetchingRef.current || loadingMoreRef.current) return;
    if (pageRef.current >= totalPageRef.current) return;
    if (el.scrollHeight <= el.clientHeight + 12) {
      void loadMore();
    }
  }, [loadMore]);

  React.useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => fillViewport());
    return () => cancelAnimationFrame(id);
  }, [open, notifications.length, page, totalPage, isFetching, isLoadingMore, fillViewport]);

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
      void loadMore();
    }
  }

  // Initial fetch on mount
  React.useEffect(() => {
    void syncFromServer({ quiet: true });
  }, [syncFromServer]);

  // Socket.io real-time push notification listener
  React.useEffect(() => {
    if (!userId) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://10.10.26.173:5004";

    if (!socketUrl) return;

    const token = Cookies.get("accessToken");
    const socket: Socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      auth: token ? { token } : undefined,
    });

    const onNotify = (notif?: any) => {
      // 1. Silent sync to update counts & feed list
      void syncRef.current({ quiet: true });

      // 2. Trigger interactive floating toast
      if (notif?.title) {
        const destHref = resolveNotificationPath(notif.path, lang);

        toast(notif.title, {
          description: notif.message,
          action: destHref
            ? {
                label: isHt ? "Wè" : "View",
                onClick: () => router.push(destHref),
              }
            : undefined,
        });
      }
    };

    socket.on(`getNotification::${userId}`, onNotify);
    socket.on(`get-notification::${userId}`, onNotify);
    socket.on("connect_error", (err) => {
      console.warn("Notification socket notice:", err.message);
    });

    return () => {
      socket.off(`getNotification::${userId}`, onNotify);
      socket.off(`get-notification::${userId}`, onNotify);
      socket.disconnect();
    };
  }, [userId, lang, router, isHt]);

  function handleOpenChange(next: boolean) {
    openRef.current = next;
    setOpen(next);
    if (next) {
      void syncFromServer({ quiet: true });
    }
  }

  // Mark single item read and navigate
  const handleReadAndNavigate = async (notification: NotificationItem) => {
    const dest = resolveNotificationPath(notification.path, lang);

    if (!notification.seen) {
      // Optimistic update
      setNotifications((curr) =>
        curr.map((n) =>
          n._id === notification._id ? { ...n, seen: true } : n,
        ),
      );
      setUnreadCount((c) => Math.max(0, c - 1));

      void readNotificationAction(notification._id);
    }

    if (dest) {
      handleOpenChange(false);
      router.push(dest);
    }
  };

  // Mark all read
  const handleReadAll = async () => {
    if (!notifications.length || unreadCount === 0) return;

    setNotifications((curr) => curr.map((n) => ({ ...n, seen: true })));
    setUnreadCount(0);

    const res = await readAllNotificationsAction();
    if (!res.success) {
      toast.error(res.message || "Failed to mark notifications as read.");
      void syncFromServer({ quiet: true });
    }
  };

  // Mark single item read without navigating
  const handleMarkReadOnly = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    const target = notifications.find((n) => n._id === id);
    if (!target || target.seen) return;

    setNotifications((curr) =>
      curr.map((n) => (n._id === id ? { ...n, seen: true } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));

    const res = await readNotificationAction(id);
    if (!res.success) {
      void syncFromServer({ quiet: true });
    }
  };

  // Delete single notification
  const handleDeleteOne = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    const target = notifications.find((n) => n._id === id);
    setNotifications((curr) => curr.filter((n) => n._id !== id));
    if (target && !target.seen) {
      setUnreadCount((c) => Math.max(0, c - 1));
    }

    const res = await deleteNotificationAction(id);
    if (!res.success) {
      toast.error(res.message || "Failed to delete notification.");
      void syncFromServer({ quiet: true });
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    if (!notifications.length) return;

    if (
      !window.confirm(
        isHt
          ? "Èske ou sèten ou vle efase tout notifikasyon yo?"
          : "Are you sure you want to clear all notifications?",
      )
    ) {
      return;
    }

    setNotifications([]);
    setUnreadCount(0);

    const res = await clearAllNotificationsAction();
    if (!res.success) {
      toast.error(res.message || "Failed to clear notifications.");
      void syncFromServer({ quiet: true });
    } else {
      toast.success(isHt ? "Tout notifikasyon efase." : "All notifications cleared.");
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={isHt ? "Notifikasyon" : "Notifications"}
          className={cn(
            "relative grid h-9.5 w-9.5 shrink-0 place-items-center rounded-xl border border-hairline/80 bg-sand-soft/80 text-forest shadow-2xs transition-all hover:bg-sand hover:text-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30 cursor-pointer",
            className,
          )}
          title={isHt ? "Notifikasyon" : "Notifications"}
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-forest px-1 text-[10px] font-bold text-white shadow-xs animate-in zoom-in-50 duration-200">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-84 sm:w-96 rounded-2xl border border-hairline/60 bg-white/98 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in-50 zoom-in-95"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-forest-deep">
              {isHt ? "Notifikasyon" : "Notifications"}
            </span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-bold text-forest">
                {unreadCount} {isHt ? "nouvo" : "new"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void handleReadAll()}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-forest hover:bg-sand-soft transition cursor-pointer"
                title={isHt ? "Make tout kòm li" : "Mark all as read"}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {isHt ? "Li tout" : "Mark all read"}
                </span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={() => void handleClearAll()}
                aria-label={isHt ? "Efase tout" : "Clear all"}
                className="grid h-7 w-7 place-items-center rounded-lg text-mist hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                title={isHt ? "Efase tout notifikasyon" : "Clear all notifications"}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* TABS FILTER: SEGMENTED PILL */}
        {notifications.length > 0 && (
          <div className="flex items-center p-1 mb-1 rounded-xl bg-sand-soft/80 text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "flex-1 rounded-lg py-1 text-center text-xs font-semibold transition-all cursor-pointer",
                filter === "all"
                  ? "bg-white text-forest-deep shadow-2xs"
                  : "text-mist hover:text-forest-deep",
              )}
            >
              {isHt ? "Tout" : "All"} ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={cn(
                "flex-1 rounded-lg py-1 text-center text-xs font-semibold transition-all cursor-pointer",
                filter === "unread"
                  ? "bg-white text-forest-deep shadow-2xs"
                  : "text-mist hover:text-forest-deep",
              )}
            >
              {isHt ? "Pa li" : "Unread"} ({unreadCount})
            </button>
          </div>
        )}

        {/* NOTIFICATIONS LIST CONTAINER */}
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="max-h-96 space-y-1 overflow-y-auto overscroll-contain pr-0.5"
        >
          {isFetching && notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-xs text-mist">
              <Loader2 className="h-5 w-5 animate-spin text-forest" />
              <span>{isHt ? "Ap chaje..." : "Loading notifications…"}</span>
            </div>
          ) : displayedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-10 text-center space-y-2">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sand-soft text-forest/60">
                <Inbox className="h-6 w-6 stroke-[1.5]" />
              </div>
              <p className="text-sm font-bold text-forest-deep">
                {filter === "unread"
                  ? isHt
                    ? "Pa gen notifikasyon ki pa li"
                    : "No unread notifications"
                  : isHt
                    ? "Tout bagay anfòm"
                    : "All caught up"}
              </p>
              <p className="text-xs text-mist max-w-xs leading-relaxed">
                {filter === "unread"
                  ? isHt
                    ? "Ou fin li tout notifikasyon ou yo."
                    : "You have read all of your notifications."
                  : isHt
                    ? "Ou pa gen okenn notifikasyon pou kounye a."
                    : "You have no notifications yet."}
              </p>
            </div>
          ) : (
            <>
              {displayedNotifications.map((notification) => {
                const { Icon, badgeColor } = getNotificationIcon(
                  notification.title,
                  notification.path,
                );
                const senderAvatar = notification.sender?.image
                  ? getImageUrl(notification.sender.image)
                  : null;

                return (
                  <div
                    key={notification._id}
                    onClick={() => void handleReadAndNavigate(notification)}
                    className={cn(
                      "group relative flex items-start gap-3 rounded-xl p-2.5 text-left transition-all duration-150 cursor-pointer",
                      notification.seen
                        ? "hover:bg-sand-soft/60"
                        : "bg-sand-soft/40 hover:bg-sand-soft/80",
                    )}
                  >
                    {/* SENDER AVATAR OR CATEGORY ICON */}
                    <div className="relative shrink-0 mt-0.5">
                      {senderAvatar ? (
                        <div className="relative h-9 w-9 overflow-hidden rounded-xl shadow-2xs">
                          <Image
                            src={senderAvatar}
                            alt={notification.sender?.name || "Sender"}
                            fill
                            className="object-cover"
                            sizes="36px"
                          />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "grid h-9 w-9 place-items-center rounded-xl shadow-2xs transition-colors",
                            badgeColor,
                          )}
                        >
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                      )}

                      {/* Unread indicator dot */}
                      {!notification.seen && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                        </span>
                      )}
                    </div>

                    {/* CONTENT BODY */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-xs leading-snug line-clamp-1",
                            notification.seen
                              ? "font-medium text-forest-deep/85"
                              : "font-bold text-forest-deep",
                          )}
                        >
                          {notification.title}
                        </p>
                        {notification.createdAt && (
                          <span className="text-[10px] text-mist shrink-0 font-medium pt-0.5">
                            {formatRelativeTime(notification.createdAt, lang)}
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-xs text-mist line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>

                    {/* HOVER QUICK ACTIONS */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0">
                      {!notification.seen && (
                        <button
                          type="button"
                          onClick={(e) => void handleMarkReadOnly(e, notification._id)}
                          className="grid h-6 w-6 place-items-center rounded-lg text-forest hover:bg-forest/10 transition cursor-pointer"
                          title={isHt ? "Make kòm li" : "Mark as read"}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteOne(e, notification._id)}
                        className="grid h-6 w-6 place-items-center rounded-lg text-mist hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title={isHt ? "Efase notifikasyon" : "Delete notification"}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* INFINITE SCROLL INDICATOR */}
              {isLoadingMore && (
                <div className="flex items-center justify-center gap-1.5 py-2.5 text-xs text-mist">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-forest" />
                  <span>{isHt ? "Ap chaje lòt..." : "Loading more…"}</span>
                </div>
              )}

              {hasMore && !isLoadingMore && (
                <div className="p-2 text-center">
                  <button
                    type="button"
                    onClick={() => void loadMore()}
                    className="text-xs font-semibold text-forest hover:text-forest-deep py-1"
                  >
                    {isHt ? "Chaje plis notifikasyon" : "Load more notifications"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

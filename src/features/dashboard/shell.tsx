"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { hasActiveSubscription } from "@/lib/forum";
import type { UserSubscription } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DASHBOARD_NAV } from "@/features/dashboard/nav";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

const DASHBOARD_I18N = {
  en: {
    eyebrow: "Member dashboard",
    welcome: "Welcome back",
    subtitle: "Manage your profile and orders in one place.",
    nav: {
      "/dashboard": "Overview",
      "/dashboard/orders": "Orders",
      "/dashboard/profile": "Profile",
    },
  },
  ht: {
    eyebrow: "Tablodbò Manm",
    welcome: "Byenvini ankò",
    subtitle: "Jere pwofil ou ak tout kòmand ou yo nan yon sèl kote.",
    nav: {
      "/dashboard": "Apèsi",
      "/dashboard/orders": "Kòmand",
      "/dashboard/profile": "Profil",
    },
  },
};

export function DashboardShell({
  user,
  children,
}: {
  user: {
    name?: string;
    email?: string;
    image?: string;
    role?: string;
    subscription?: UserSubscription | null;
  };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const activePlan = hasActiveSubscription(user.subscription)
    ? user.subscription
    : null;

  const segments = (pathname || "").split("/").filter(Boolean);
  const locale = segments[0] === "ht" ? "ht" : "en";
  const normalizedPath = pathname.startsWith(`/${locale}`)
    ? pathname.replace(`/${locale}`, "") || "/dashboard"
    : pathname;
  const t = DASHBOARD_I18N[locale];

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    targetHref: string,
  ) {
    if (pathname === targetHref) {
      e.preventDefault();
      return;
    }

    const leavingNestedForOverview =
      (targetHref === "/dashboard" || targetHref === `/${locale}/dashboard`) &&
      normalizedPath.startsWith("/dashboard/");

    if (leavingNestedForOverview) {
      e.preventDefault();
      router.push(targetHref);
      router.refresh();
    }
  }

  return (
    <section className="relative min-h-screen pt-28 pb-16">
      {/* Background ambient gradient matching primary forest brand color */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(11,61,46,0.18),rgba(230,213,184,0.06)_45%,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="mt-1 font-display text-3xl font-bold text-cloud sm:text-4xl">
              {t.welcome}
              {user.name ? (
                <>
                  , <span className="text-gradient">{user.name.split(" ")[0]}</span>
                </>
              ) : null}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-mist">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
          {/*
            Sticky needs a non-overflow-hidden ancestor (removed from <section>).
            top-32 clears the fixed site navbar; z-10 keeps links above page chrome.
          */}
          <aside className="relative z-10 lg:sticky lg:top-32 lg:self-start lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto">
            <div className="border-gradient overflow-hidden rounded-3xl bg-panel/60 backdrop-blur-md">
              <div className="border-b border-hairline bg-white/2 p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-hairline-strong">
                    <AvatarImage
                      src={getImageUrl(user.image || "")}
                      alt={user.name || "Profile"}
                    />
                    <AvatarFallback>
                      {initials(user.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-cloud">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-mist">{user.email}</p>
                    {user.role ? (
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-forest">
                        {user.role}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <nav className="flex flex-col gap-1 p-2">
                {DASHBOARD_NAV.map((item) => {
                  const Icon = item.icon;
                  const targetHref = `/${locale}${item.href}`;
                  const active = isNavActive(normalizedPath, item.href);
                  const label = (t.nav as Record<string, string>)[item.href] || item.label;

                  return (
                    <Link
                      key={item.href}
                      href={targetHref}
                      prefetch
                      onClick={(e) => handleNavClick(e, targetHref)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-forest/10 text-forest ring-1 ring-forest/20 font-semibold"
                          : "text-mist hover:bg-white/4 hover:text-cloud",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4.5 w-4.5 shrink-0",
                          active ? "text-forest" : "text-faint",
                        )}
                      />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div key={pathname} className="min-w-0">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

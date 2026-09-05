"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  FileText,
  UserCircle,
} from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { CartMenu } from "@/components/layout/cart-menu";
import { LanguageSelector } from "@/components/layout/language-selector";
import { useTranslation } from "@/components/providers/translation-provider";
import type { CartData } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function isActive(pathname: string, href: string) {
  const cleanPathname = "/" + pathname.split("/").slice(2).join("/");
  if (href === "/") return cleanPathname === "/";
  const path = href.split("#")[0];
  if (path === "/calendar" && cleanPathname.startsWith("/events")) return true;
  if (path === "/events" && cleanPathname.startsWith("/calendar")) return true;
  return cleanPathname.startsWith(path);
}

export function Navbar({ user, cart }: { user?: any; cart?: CartData }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const dict = useTranslation();

  const isLoggedIn = Boolean(user && (user._id || user.email));

  // Determine current locale prefix
  const segments = pathname.split("/");
  const currentLocale = segments[1] === "ht" ? "ht" : "en";

  const localize = (href: string) => {
    if (href.startsWith("http") || href.startsWith("mailto:")) return href;
    const cleanPath = href === "/" ? "" : href;
    return `/${currentLocale}${cleanPath}`;
  };

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("role");
    toast.success(
      currentLocale === "ht"
        ? "Ou dekonekte avèk siksè"
        : "Logged out successfully",
    );
    router.refresh();
  };

  const t = dict.Navbar || {};
  const authT = dict.Auth || {};

  const navItems = [
    { label: t.Home || "Home", href: "/" },
    {
      label: t.About || "About",
      href: "/about",
      subItems: [
        { label: t.AboutUs || "About Us", href: "/about" },
        { label: t.OurTeam || "Our Team", href: "/team" },
      ],
    },
    {
      label: t.Grants || "Grants",
      href: "/grants",
      subItems: [
        { label: t.Grants || "All Grants", href: "/grants" },
        { label: t.Apply || "Apply for Grant", href: "/apply" },
        { label: t.Track || "Track Application", href: "/track-application" },
      ],
    },
    {
      label: t.Impact || "Impact",
      href: "/impact",
      subItems: [
        { label: t.OurImpact || "Our Impact", href: "/impact" },
        { label: t.Projects || "Projects", href: "/projects" },
        { label: t.Winners || "Winners", href: "/winners" },
        { label: t.Finalists || "Finalists", href: "/finalists" },
        {
          label: t.SuccessStories || "Success Stories",
          href: "/impact#success-stories",
        },
      ],
    },
    {
      label: t.Events || "Events",
      href: "/calendar",
      subItems: [
        { label: t.Calendar || "Calendar", href: "/calendar" },
        { label: t.Gallery || "Gallery", href: "/gallery" },
      ],
    },
    { label: t.Shop || "Shop", href: "/shop" },
    { label: t.Contact || "Contact", href: "/contact" },
  ];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-2 pt-2.5 sm:px-4 sm:pt-3.5">
      <div className="pointer-events-auto relative w-full max-w-6xl lg:px-4 xl:px-8">
        <nav
          className={cn(
            "flex w-full items-center justify-between gap-1.5 sm:gap-2 lg:gap-3 rounded-[16px] border border-white/80 bg-white/85 px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-[0_10px_35px_-15px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-all duration-300",
            scrolled &&
              "bg-white/95 shadow-[0_14px_45px_-12px_rgba(15,23,42,0.24)] border-forest/10",
          )}
        >
          {/* Logo */}
          <Link
            href={localize("/")}
            className="pointer-events-auto shrink-0 transition-opacity hover:opacity-95 pr-1 sm:pr-2"
          >
            <Logo />
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center gap-0.5 lg:flex xl:gap-1.5">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              const linkClass = cn(
                "relative flex items-center gap-0.5 rounded-xl px-2 xl:px-1.5 py-1.5 text-[13px] xl:text-[14px] font-semibold tracking-tight outline-none transition-colors",
                active
                  ? "text-forest"
                  : "text-forest-deep/85 hover:text-forest hover:bg-sand-soft/60",
              );

              if (item.subItems) {
                return (
                  <li key={item.href}>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <button className={linkClass}>
                          <span>{item.label}</span>
                          <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:rotate-180" />
                          {active && (
                            <span className="absolute inset-x-2.5 bottom-0 h-0.5 rounded-full bg-forest" />
                          )}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="center"
                        className="w-52 rounded-2xl border-hairline bg-white/95 p-1.5 shadow-xl backdrop-blur-xl"
                      >
                        {item.subItems.map((subItem) => (
                          <DropdownMenuItem
                            key={subItem.href}
                            asChild
                            className="rounded-xl text-sm font-semibold text-forest-deep focus:bg-sand-soft focus:text-forest"
                          >
                            <Link
                              href={localize(subItem.href)}
                              className="w-full cursor-pointer px-3 py-2"
                            >
                              {subItem.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link href={localize(item.href)} className={linkClass}>
                    <span>{item.label}</span>
                    {active && (
                      <span className="absolute inset-x-2.5 bottom-0 h-0.5 rounded-full bg-forest" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Cart Menu */}
            <CartMenu cart={cart} />

            {/* User Account Button with User Icon / Avatar */}
            {isLoggedIn ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="User account"
                    className="relative grid h-9.5 w-9.5 shrink-0 place-items-center overflow-hidden rounded-xl border border-hairline/80 bg-forest text-sand shadow-2xs transition-all hover:bg-forest/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30"
                    title={user?.name || authT.Account || "Account"}
                  >
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user?.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-4.5 w-4.5" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 rounded-2xl border-hairline bg-white/95 p-1.5 shadow-xl backdrop-blur-xl"
                >
                  {/* User Information Header */}
                  <div className="flex items-center gap-3 border-b border-hairline p-2.5">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user?.name || "User"}
                        className="h-10 w-10 shrink-0 rounded-xl border border-hairline object-cover"
                      />
                    ) : (
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest/10 text-forest">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-bold text-forest-deep">
                          {user?.name}
                        </span>
                        {user?.role && (
                          <span className="shrink-0 rounded bg-forest/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-forest">
                            {user.role}
                          </span>
                        )}
                      </div>
                      <span className="truncate text-xs text-mist">
                        {user?.email}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <DropdownMenuItem
                      asChild
                      className="rounded-xl text-sm font-semibold text-forest-deep focus:bg-sand-soft focus:text-forest"
                    >
                      <Link
                        href={localize("/dashboard/profile")}
                        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2"
                      >
                        <UserCircle className="h-4 w-4 text-forest" />
                        {authT.Profile || "My Profile"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="rounded-xl text-sm font-semibold text-forest-deep focus:bg-sand-soft focus:text-forest"
                    >
                      <Link
                        href={localize("/track-application")}
                        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2"
                      >
                        <FileText className="h-4 w-4 text-forest" />
                        {authT.TrackApplication || "Track Application"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-hairline" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      {authT.SignOut || "Log out"}
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href={localize("/auth/login")}
                aria-label="Sign in"
                title={authT.SignIn || "Sign in"}
                className="grid h-9.5 w-9.5 shrink-0 place-items-center rounded-xl border border-hairline/60 bg-sand-soft/80 text-forest transition-colors hover:bg-sand hover:text-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30"
              >
                <User className="h-4.5 w-4.5" />
              </Link>
            )}

            {/* Donate CTA */}
            <Button
              asChild
              size="sm"
              className="hidden h-9.5 rounded-xl bg-forest px-3.5 text-xs font-bold text-white shadow-none hover:bg-forest/90 sm:inline-flex"
            >
              <Link href={localize("/donate")}>{t.Donate || "Donate"}</Link>
            </Button>

            {/* Apply CTA (compact or large screens) */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden h-9.5 rounded-xl border-forest/20 px-3 text-xs font-semibold text-forest-deep hover:bg-sand-soft xl:inline-flex"
            >
              <Link href={localize("/apply")}>{t.Apply || "Apply"}</Link>
            </Button>

            {/* Mobile Menu Toggle Button */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
              className="grid h-9.5 w-9.5 place-items-center rounded-xl bg-sand-soft text-forest transition-colors hover:bg-sand lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Panel */}
        <div
          className={cn(
            "absolute inset-x-0 top-[calc(100%+8px)] z-40 origin-top transition-all duration-300 lg:hidden",
            mobileOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0",
          )}
        >
          <div className="rounded-[24px] border border-white/80 bg-white/95 p-3 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <ul className="flex flex-col">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                if (item.subItems) {
                  return (
                    <li key={item.href}>
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <button className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-base font-semibold text-forest-deep">
                            {item.label}
                            <ChevronDown className="h-4 w-4 opacity-60 transition-transform group-data-[state=open]:rotate-180" />
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="flex flex-col pb-1">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={localize(subItem.href)}
                                className="ml-2 rounded-xl px-3 py-2 text-sm font-medium text-forest-deep hover:bg-sand-soft hover:text-forest"
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <Link
                      href={localize(item.href)}
                      className={cn(
                        "block rounded-xl px-3 py-2.5 text-base font-semibold",
                        active
                          ? "bg-sand-soft text-forest"
                          : "text-forest-deep hover:bg-sand-soft hover:text-forest",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Account Row */}
            <div className="mt-2 border-t border-hairline pt-3">
              {isLoggedIn ? (
                <div className="flex flex-col gap-2.5 pb-2">
                  <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-sand-soft/50 p-2.5">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user?.name || "User"}
                        className="h-10 w-10 shrink-0 rounded-xl border border-hairline object-cover"
                      />
                    ) : (
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest text-sand">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-bold text-forest-deep">
                          {user?.name}
                        </span>
                        {user?.role && (
                          <span className="shrink-0 rounded bg-forest/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-forest">
                            {user.role}
                          </span>
                        )}
                      </div>
                      <span className="truncate text-xs text-mist">
                        {user?.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <Link
                      href={localize("/dashboard/profile")}
                      className="flex items-center gap-2 text-sm font-semibold text-forest-deep hover:text-forest"
                    >
                      <UserCircle className="h-4.5 w-4.5 text-forest" />
                      {authT.Profile || "My Profile"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-xs font-bold text-destructive hover:underline"
                    >
                      {authT.SignOut || "Log out"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pb-2">
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link href={localize("/login")}>
                      {authT.SignIn || "Sign in"}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link href={localize("/join")}>
                      {authT.SignUp || "Register"}
                    </Link>
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href={localize("/apply")}>{t.Apply || "Apply"}</Link>
                </Button>
                <Button asChild className="rounded-xl bg-forest text-white">
                  <Link href={localize("/donate")}>{t.Donate || "Donate"}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

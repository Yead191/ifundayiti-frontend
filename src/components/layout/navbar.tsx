"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { navItems } from "@/data/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { CartMenu } from "@/components/layout/cart-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  const path = href.split("#")[0];
  return pathname.startsWith(path);
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3  sm:pt-4">
      <div className="pointer-events-auto relative w-full max-w-6xl lg:px-8">
        <nav
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-[12px] border border-white/80 bg-white/80 px-2.5 py-2 shadow-[0_12px_40px_-18px_rgba(15,23,42,0.22)] backdrop-blur-xl transition-shadow duration-300 sm:px-3",
            scrolled &&
              "bg-white/92 shadow-[0_16px_48px_-16px_rgba(15,23,42,0.28)]",
          )}
        >
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              const linkClass = cn(
                "relative flex items-center gap-1 rounded-xl px-3 py-2 text-[15px] font-semibold tracking-tight outline-none transition-colors",
                active ? "text-forest" : "text-forest-deep hover:text-forest",
              );

              if (item.subItems) {
                return (
                  <li key={item.href}>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <button className={linkClass}>
                          {item.label}
                          <ChevronDown className="h-4 w-4 opacity-70" />
                          {active && (
                            <span className="absolute inset-x-3 bottom-0.5 h-0.5 rounded-full bg-forest" />
                          )}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-52">
                        {item.subItems.map((subItem) => (
                          <DropdownMenuItem key={subItem.href} asChild>
                            <Link
                              href={subItem.href}
                              className="w-full text-sm font-semibold text-forest-deep"
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
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                    {active && (
                      <span className="absolute inset-x-3 bottom-0.5 h-0.5 rounded-full bg-forest" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/track-application"
              className="hidden rounded-xl px-3 py-2 text-[15px] font-semibold tracking-tight text-forest-deep transition-colors hover:text-forest xl:inline-flex"
            >
              Track
            </Link>
            <CartMenu />
            <Button
              asChild
              size="sm"
              className="hidden h-10 rounded-xl px-4 shadow-none md:inline-flex"
            >
              <Link href="/donate">Donate</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden h-10 rounded-xl px-4 lg:inline-flex"
            >
              <Link href="/apply">Apply</Link>
            </Button>
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-xl bg-sand-soft text-forest transition-colors hover:bg-sand lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

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
                          <button className="group flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-semibold text-forest-deep">
                            {item.label}
                            <ChevronDown className="h-4 w-4 opacity-60 transition-transform group-data-[state=open]:rotate-180" />
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="flex flex-col pb-1">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="ml-2 rounded-xl px-3 py-2.5 text-sm font-medium text-forest-deep hover:bg-sand-soft hover:text-forest"
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
                      href={item.href}
                      className={cn(
                        "block rounded-xl px-3 py-3 text-base font-semibold",
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
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-hairline pt-3">
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/track-application">Track</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/apply">Apply</Link>
              </Button>
              <Button asChild className="col-span-2 rounded-xl">
                <Link href="/donate">Donate</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

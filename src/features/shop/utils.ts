"use client";

import * as React from "react";

/**
 * Saves current window scroll coordinate to sessionStorage before filter navigation.
 */
export function saveShopScroll() {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("shop_scroll_y", window.scrollY.toString());
    } catch {
      // ignore sessionStorage errors
    }
  }
}

/**
 * Hook to restore window scroll position if Next.js attempts to jump to top upon RSC re-render.
 */
export function usePreserveScroll(dependency: any) {
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = sessionStorage.getItem("shop_scroll_y");
      if (saved) {
        sessionStorage.removeItem("shop_scroll_y");
        const pos = parseInt(saved, 10);
        if (!isNaN(pos)) {
          window.scrollTo({ top: pos, behavior: "instant" });
          requestAnimationFrame(() => {
            window.scrollTo({ top: pos, behavior: "instant" });
          });
        }
      }
    } catch {
      // ignore
    }
  }, [dependency]);
}

/**
 * Builds an updated shop query URL while preserving all other active filters.
 */
export function buildShopUrl(
  lang: string,
  searchParams: { toString(): string },
  updates: Record<string, string | null>,
): string {
  const params = new URLSearchParams(searchParams.toString());
  params.delete("page"); // Reset pagination on filter change

  for (const [key, value] of Object.entries(updates)) {
    if (!value || value === "all" || value === "featured") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  const qs = params.toString();
  return `/${lang}/shop${qs ? `?${qs}` : ""}`;
}

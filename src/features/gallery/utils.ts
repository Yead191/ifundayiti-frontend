"use client";

import * as React from "react";

/**
 * Saves current window scroll coordinate to sessionStorage before category/search navigation.
 */
export function saveGalleryScroll() {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("gallery_scroll_y", window.scrollY.toString());
    } catch {
      // ignore sessionStorage errors
    }
  }
}

/**
 * Hook to restore window scroll position if Next.js attempts to jump to top upon RSC re-render.
 */
export function usePreserveGalleryScroll(dependency: any) {
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = sessionStorage.getItem("gallery_scroll_y");
      if (saved) {
        sessionStorage.removeItem("gallery_scroll_y");
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
 * Builds an updated gallery URL string preserving or resetting category and search term.
 */
export function buildGalleryUrl(
  lang: string,
  category?: string,
  searchTerm?: string,
): string {
  const params = new URLSearchParams();

  if (category && category !== "All") {
    params.set("category", category);
  }

  if (searchTerm && searchTerm.trim()) {
    params.set("searchTerm", searchTerm.trim());
  }

  const qs = params.toString();
  return `/${lang}/gallery${qs ? `?${qs}` : ""}`;
}

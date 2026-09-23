import type { MetadataRoute } from "next";

import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { absoluteUrl } from "@/lib/seo";

const LOCALES = ["en", "ht"] as const;

interface RouteConfig {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}

/**
 * Helper to build Google-compliant hreflang alternates including 'x-default'
 */
function makeAlternates(path: string) {
  return {
    languages: {
      en: absoluteUrl(`/en${path}`),
      ht: absoluteUrl(`/ht${path}`),
      "x-default": absoluteUrl(`/en${path}`),
    },
  };
}

/**
 * Public static pages across IFundAyiti
 */
const STATIC_ROUTES: RouteConfig[] = [
  // Primary Discovery
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.85 },
  { path: "/grants", changeFrequency: "weekly", priority: 0.9 },
  { path: "/apply", changeFrequency: "weekly", priority: 0.9 },
  { path: "/track-application", changeFrequency: "weekly", priority: 0.8 },
  { path: "/impact", changeFrequency: "weekly", priority: 0.85 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.85 },
  { path: "/finalists", changeFrequency: "weekly", priority: 0.8 },
  { path: "/winners", changeFrequency: "weekly", priority: 0.85 },
  { path: "/partners", changeFrequency: "weekly", priority: 0.8 },
  { path: "/team", changeFrequency: "weekly", priority: 0.8 },

  // Content, Events & Community Hubs
  { path: "/blogs", changeFrequency: "daily", priority: 0.9 },
  { path: "/events", changeFrequency: "weekly", priority: 0.85 },
  { path: "/calendar", changeFrequency: "weekly", priority: 0.8 },
  { path: "/community", changeFrequency: "daily", priority: 0.85 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.75 },

  // Commerce & Support
  { path: "/shop", changeFrequency: "daily", priority: 0.85 },
  { path: "/donate", changeFrequency: "weekly", priority: 0.9 },
  { path: "/become-a-volunteer", changeFrequency: "monthly", priority: 0.75 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },

  // Membership & Authentication
  { path: "/auth/join", changeFrequency: "monthly", priority: 0.8 },
  { path: "/auth/login", changeFrequency: "monthly", priority: 0.65 },

  // Legal / Governance (legacy routes)
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund", changeFrequency: "yearly", priority: 0.3 },
];

/**
 * Safe helper to fetch resource IDs/slugs and last updated dates from backend APIs
 */
async function fetchItems(
  url: string,
  keyPreference: "slug" | "id" = "slug",
): Promise<{ id: string; updatedAt?: string }[]> {
  try {
    const res = await nextFetch<any[]>(url, {
      method: "GET",
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 24, // 1 day
      },
    });
    if (!res?.success || !Array.isArray(res.data)) return [];
    return res.data
      .filter((item: any) => item && (item._id || item.id || item.slug))
      .map((item: any) => ({
        id: (keyPreference === "id"
          ? item._id || item.id || item.slug
          : item.slug || item._id || item.id
        ).toString(),
        updatedAt: item.updatedAt || item.createdAt,
      }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Static page entries for root and each supported locale (en, ht)
  const staticEntries: MetadataRoute.Sitemap = [
    // Root URL
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: makeAlternates(""),
    },
    // Localized static routes
    ...STATIC_ROUTES.flatMap((route) =>
      LOCALES.map((locale) => ({
        url: absoluteUrl(`/${locale}${route.path}`),
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority:
          locale === "en"
            ? route.priority
            : Number((route.priority * 0.95).toFixed(2)),
        alternates: makeAlternates(route.path),
      })),
    ),
  ];

  // 2. Fetch dynamic resources in parallel with graceful fallbacks
  const [
    products,
    projects,
    blogs,
    events,
    communityPosts,
    galleryFolders,
    teamMembers,
    partners,
    winners,
  ] = await Promise.all([
    fetchItems("/product?limit=100", "slug"),
    fetchItems("/project?limit=100", "slug"),
    fetchItems("/blog?limit=100", "slug"),
    fetchItems("/event?limit=100", "id"),
    fetchItems("/community?limit=100", "id"),
    fetchItems("/folder?limit=100", "id"),
    fetchItems("/team?limit=100", "id"),
    fetchItems("/partner?limit=100", "id"),
    fetchItems("/application?status=winner&limit=100", "id"),
  ]);

  // 3. Dynamic route entries for detail pages
  const dynamicEntries: MetadataRoute.Sitemap = [
    // Ethical Apparel Products
    ...products.flatMap((p) =>
      LOCALES.map((locale) => ({
        url: absoluteUrl(`/${locale}/shop/${p.id}`),
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.85,
        alternates: makeAlternates(`/shop/${p.id}`),
      })),
    ),

    // Grassroots Projects
    ...projects.flatMap((p) =>
      LOCALES.map((locale) => ({
        url: absoluteUrl(`/${locale}/projects/${p.id}`),
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.85,
        alternates: makeAlternates(`/projects/${p.id}`),
      })),
    ),

    // Published Blog Articles
    ...blogs.flatMap((b) =>
      LOCALES.map((locale) => ({
        url: absoluteUrl(`/${locale}/blogs/${b.id}`),
        lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.85,
        alternates: makeAlternates(`/blogs/${b.id}`),
      })),
    ),

    // Upcoming & Past Gatherings / Events
    ...events.flatMap((e) =>
      LOCALES.map((locale) => ({
        url: absoluteUrl(`/${locale}/events/${e.id}`),
        lastModified: e.updatedAt ? new Date(e.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: makeAlternates(`/events/${e.id}`),
      })),
    ),

    // Community Forum Discussions
    ...communityPosts.flatMap((c) =>
      LOCALES.map((locale) => ({
        url: absoluteUrl(`/${locale}/community/${c.id}`),
        lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.75,
        alternates: makeAlternates(`/community/${c.id}`),
      })),
    ),

    // Photo Gallery Albums
    ...galleryFolders.flatMap((f) =>
      LOCALES.map((locale) => ({
        url: absoluteUrl(`/${locale}/gallery/${f.id}`),
        lastModified: f.updatedAt ? new Date(f.updatedAt) : now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: makeAlternates(`/gallery/${f.id}`),
      })),
    ),

    // Leadership, Staff & Team Profiles
    ...teamMembers.flatMap((m) =>
      LOCALES.map((locale) => ({
        url: absoluteUrl(`/${locale}/team/${m.id}`),
        lastModified: m.updatedAt ? new Date(m.updatedAt) : now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: makeAlternates(`/team/${m.id}`),
      })),
    ),

    // Verified Partners
    ...partners.flatMap((p) =>
      LOCALES.map((locale) => ({
        url: absoluteUrl(`/${locale}/partners/${p.id}`),
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: makeAlternates(`/partners/${p.id}`),
      })),
    ),

    // Grant Winners
    ...winners.flatMap((w) =>
      LOCALES.map((locale) => ({
        url: absoluteUrl(`/${locale}/winners/${w.id}`),
        lastModified: w.updatedAt ? new Date(w.updatedAt) : now,
        changeFrequency: "monthly" as const,
        priority: 0.75,
        alternates: makeAlternates(`/winners/${w.id}`),
      })),
    ),
  ];

  return [...staticEntries, ...dynamicEntries];
}

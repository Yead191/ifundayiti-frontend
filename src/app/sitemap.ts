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
  { path: "/events", changeFrequency: "weekly", priority: 0.8 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.75 },
  { path: "/shop", changeFrequency: "daily", priority: 0.85 },
  { path: "/donate", changeFrequency: "weekly", priority: 0.9 },
  { path: "/become-a-volunteer", changeFrequency: "monthly", priority: 0.75 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },

  // Membership & Authentication
  { path: "/auth/join", changeFrequency: "monthly", priority: 0.8 },
  { path: "/auth/login", changeFrequency: "monthly", priority: 0.65 },

  // Legal / Governance
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund", changeFrequency: "yearly", priority: 0.3 },
];

/**
 * Safe helper to fetch resource IDs and last updated dates from backend APIs
 */
async function fetchItems(
  url: string,
): Promise<{ id: string; updatedAt?: string }[]> {
  try {
    const res = await nextFetch<any[]>(url, {
      method: "GET",
      cache: "no-store",
    });
    if (!res?.success || !Array.isArray(res.data)) return [];
    return res.data
      .filter((item: any) => item && (item._id || item.id || item.slug))
      .map((item: any) => ({
        id: (item.slug || item._id || item.id).toString(),
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
      alternates: {
        languages: {
          en: absoluteUrl("/en"),
          ht: absoluteUrl("/ht"),
        },
      },
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
        alternates: {
          languages: {
            en: absoluteUrl(`/en${route.path}`),
            ht: absoluteUrl(`/ht${route.path}`),
          },
        },
      })),
    ),
  ];

  // 2. Fetch dynamic resources in parallel with graceful fallbacks
  const [products, projects, teamMembers, partners, winners] =
    await Promise.all([
      fetchItems("/product?limit=100"),
      fetchItems("/project?limit=100"),
      fetchItems("/team?limit=100"),
      fetchItems("/partner?limit=100"),
      fetchItems("/application?status=winner&limit=100"),
    ]);

  // 3. Dynamic route entries for detail pages
  const dynamicEntries: MetadataRoute.Sitemap = [
    // Ethical Apparel Products
    ...products.flatMap((p) =>
      LOCALES.map((locale) => ({
        url: absoluteUrl(`/${locale}/shop/${p.id}`),
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: {
          languages: {
            en: absoluteUrl(`/en/shop/${p.id}`),
            ht: absoluteUrl(`/ht/shop/${p.id}`),
          },
        },
      })),
    ),

    // Grassroots Projects
    ...projects.flatMap((p) =>
      LOCALES.map((locale) => ({
        url: absoluteUrl(`/${locale}/projects/${p.id}`),
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: {
          languages: {
            en: absoluteUrl(`/en/projects/${p.id}`),
            ht: absoluteUrl(`/ht/projects/${p.id}`),
          },
        },
      })),
    ),

    // Leadership, Staff & Team Profiles
    ...teamMembers.flatMap((m) =>
      LOCALES.map((locale) => ({
        url: absoluteUrl(`/${locale}/team/${m.id}`),
        lastModified: m.updatedAt ? new Date(m.updatedAt) : now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: {
            en: absoluteUrl(`/en/team/${m.id}`),
            ht: absoluteUrl(`/ht/team/${m.id}`),
          },
        },
      })),
    ),

    // Verified Partners
    ...partners.flatMap((p) =>
      LOCALES.map((locale) => ({
        url: absoluteUrl(`/${locale}/partners/${p.id}`),
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: {
            en: absoluteUrl(`/en/partners/${p.id}`),
            ht: absoluteUrl(`/ht/partners/${p.id}`),
          },
        },
      })),
    ),

    // Grant Winners
    ...winners.flatMap((w) =>
      LOCALES.map((locale) => ({
        url: absoluteUrl(`/${locale}/winners/${w.id}`),
        lastModified: w.updatedAt ? new Date(w.updatedAt) : now,
        changeFrequency: "monthly" as const,
        priority: 0.75,
        alternates: {
          languages: {
            en: absoluteUrl(`/en/winners/${w.id}`),
            ht: absoluteUrl(`/ht/winners/${w.id}`),
          },
        },
      })),
    ),
  ];

  return [...staticEntries, ...dynamicEntries];
}

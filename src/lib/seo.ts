import type { Metadata } from "next";

/** Production site origin. Override with NEXT_PUBLIC_SITE_URL. */
export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://ifundayiti.org";
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200&h=630";

export const SITE_NAME = "IFundAyiti";

export const DEFAULT_KEYWORDS = [
  "IFundAyiti",
  "Haiti grants",
  "micro grants Haiti",
  "Haitian entrepreneurs",
  "community funding Haiti",
  "nonprofit grant program",
  "equity-free grants",
] as const;

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string | null;
  noIndex?: boolean;
  absoluteTitle?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image,
  noIndex = false,
  absoluteTitle = false,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : DEFAULT_OG_IMAGE;

  const mergedKeywords = Array.from(
    new Set([...keywords, ...DEFAULT_KEYWORDS].filter(Boolean)),
  );

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: mergedKeywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: absoluteTitle ? title : `${title} · ${SITE_NAME}`,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle ? title : `${title} · ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : { index: true, follow: true },
  };
}

export function noIndexMetadata(title: string, description?: string): Metadata {
  return buildMetadata({
    title,
    description:
      description || "Private IFundAyiti page. Sign in to access your account.",
    noIndex: true,
    keywords: [],
  });
}

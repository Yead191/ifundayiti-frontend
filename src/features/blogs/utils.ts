/**
 * Calculates estimated reading time for an article (based on ~200 wpm)
 */
export function calculateReadTime(content: string): string {
  if (!content) return "1 min read";
  // Strip HTML tags
  const plainText = content.replace(/<[^>]*>/g, " ").trim();
  const words = plainText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Extracts a clean plain-text excerpt from rich HTML content
 */
export function getExcerpt(content: string, maxLength: number = 160): string {
  if (!content) return "";
  // Strip HTML tags and entities
  const clean = content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trim()}...`;
}

/**
 * Formats a blog publication or creation date nicely
 */
export function formatBlogDate(
  dateStr?: string | Date,
  locale: string = "en"
): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale === "ht" ? "fr-HT" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/**
 * Builds an updated blog directory URL string preserving or resetting category and search term.
 */
export function buildBlogUrl(
  lang: string,
  category?: string,
  searchTerm?: string,
  page?: number
): string {
  const params = new URLSearchParams();

  if (category && category !== "all" && category !== "All") {
    params.set("category", category);
  }

  if (searchTerm && searchTerm.trim()) {
    params.set("searchTerm", searchTerm.trim());
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const qs = params.toString();
  return `/${lang}/blogs${qs ? `?${qs}` : ""}`;
}

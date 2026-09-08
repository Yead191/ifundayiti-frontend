import type { PartnerListParams } from "@/types";

/**
 * Builds localized href for partner detail page.
 */
export function partnerHref(id: string, lang = "en"): string {
  return `/${lang}/partners/${id}`;
}

/**
 * Builds partners directory URL with search, pagination, and filter queries.
 */
export function buildPartnersHref(
  page = 1,
  limit = 12,
  searchTerm?: string,
  offer?: string,
  lang = "en"
): string {
  const searchParams = new URLSearchParams();

  if (page > 1) searchParams.set("page", page.toString());
  if (limit !== 12) searchParams.set("limit", limit.toString());
  if (searchTerm?.trim()) searchParams.set("q", searchTerm.trim());
  if (offer && offer !== "all") searchParams.set("offer", offer.trim());

  const qs = searchParams.toString();
  return `/${lang}/partners${qs ? `?${qs}` : ""}`;
}

/**
 * Safely parses and flattens partner offers.
 * Handles both plain strings and stringified JSON arrays.
 */
export function parsePartnerOffers(offers?: string[] | null): string[] {
  if (!offers || !Array.isArray(offers) || offers.length === 0) return [];

  const flattened: string[] = [];

  for (const item of offers) {
    if (typeof item !== "string") continue;
    const trimmed = item.trim();

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          for (const sub of parsed) {
            if (typeof sub === "string" && sub.trim()) {
              flattened.push(sub.trim());
            }
          }
          continue;
        }
      } catch {
        // Not valid JSON, treat as raw string
      }
    }

    if (trimmed) {
      flattened.push(trimmed);
    }
  }

  // Deduplicate and filter empty
  return Array.from(new Set(flattened));
}

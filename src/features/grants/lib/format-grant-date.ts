/** Format ISO date strings for grant UI copy. */
export function formatGrantDate(
  iso: string,
  style: "long" | "short" = "long",
  lang: string = "en",
) {
  const dateStr = iso.includes("T") ? iso : `${iso}T00:00:00`;
  const locale = lang === "ht" ? "ht-HT" : "en-US";
  return new Date(dateStr).toLocaleDateString(locale, {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}

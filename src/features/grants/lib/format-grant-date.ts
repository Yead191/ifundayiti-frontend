/** Format ISO date strings for grant UI copy. */
export function formatGrantDate(
  iso: string,
  style: "long" | "short" = "long",
) {
  const dateStr = iso.includes("T") ? iso : `${iso}T00:00:00`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}

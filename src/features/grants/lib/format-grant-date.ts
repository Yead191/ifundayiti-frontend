/** Format ISO date strings (YYYY-MM-DD) for grant UI copy. */
export function formatGrantDate(
  iso: string,
  style: "long" | "short" = "long",
) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}

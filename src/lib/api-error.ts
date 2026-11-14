/** Turn API `error` / `errorMessages` into a string React can render. */
export function toErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string" && error.trim()) return error;
  if (Array.isArray(error)) {
    const parts = error
      .map((item) => {
        if (typeof item === "string" && item.trim()) return item;
        if (item && typeof item === "object" && "message" in item) {
          const msg = (item as { message?: unknown }).message;
          return typeof msg === "string" && msg.trim() ? msg : null;
        }
        return null;
      })
      .filter((part): part is string => Boolean(part));
    if (parts.length) return [...new Set(parts)].join(". ");
  }
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return fallback;
}

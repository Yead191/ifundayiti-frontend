import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-24 w-full rounded-xl border border-input bg-white px-4 py-3 text-sm text-cloud transition-colors duration-200",
        "placeholder:text-faint resize-none",
        "focus-visible:outline-none focus-visible:border-forest/50 focus-visible:ring-2 focus-visible:ring-forest/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

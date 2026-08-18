import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  body,
  actionLabel,
  actionHref,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-hairline-strong bg-white px-6 py-14 text-center">
      <h3 className="font-display text-2xl text-forest-deep">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist">
        {body}
      </p>
      {actionHref && actionLabel && (
        <Button asChild className="mt-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}

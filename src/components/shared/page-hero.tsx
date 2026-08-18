import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-hairline bg-sand-soft/60 pt-28 pb-14 md:pt-32 md:pb-16",
        className,
      )}
    >
      <Container className="relative">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-forest-deep sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}

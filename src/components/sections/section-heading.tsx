import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  light = false,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && <span className={cn("eyebrow", light && "text-sand-soft")}>{eyebrow}</span>}
      <h2 className={cn("max-w-3xl text-balance font-display text-3xl font-semibold leading-[1.12] text-forest-deep sm:text-4xl md:text-[2.6rem]", light && "text-white")}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn("max-w-2xl text-base leading-relaxed text-mist sm:text-lg", light && "text-white/80")}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

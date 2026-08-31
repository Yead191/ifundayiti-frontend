import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn, formatPrice } from "@/lib/utils";
import type { PublicProject } from "@/data/projects";

export function ProjectCard({
  project,
  featured = false,
  lang = "en",
  viewWorkLabel,
}: {
  project: PublicProject;
  featured?: boolean;
  lang?: string;
  viewWorkLabel?: string;
}) {
  const label = viewWorkLabel || (lang === "ht" ? "Gade travay la" : "View work");

  return (
    <Link
      href={`/${lang}/projects/${project.slug}`}
      className={cn(
        "group relative isolate flex flex-col overflow-hidden rounded-[1.75rem] bg-forest text-white",
        featured ? "min-h-[28rem] lg:min-h-[36rem]" : "min-h-[22rem]",
      )}
    >
      <Image
        src={project.imageUrl}
        alt=""
        fill
        className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
        sizes={featured ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 1024px) 100vw, 40vw"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/35 to-transparent" />
      <div className="relative mt-auto flex flex-col gap-3 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sand">
          <span>{project.category}</span>
          <span className="h-1 w-1 rounded-full bg-sand/70" />
          <span>{project.location}</span>
        </div>
        <h3
          className={cn(
            "font-display font-semibold leading-[1.12] text-white",
            featured ? "text-3xl md:text-4xl" : "text-2xl",
          )}
        >
          {project.name}
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-sand/90 line-clamp-2">
          {project.description}
        </p>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="font-semibold text-sand">
            {formatPrice(project.grantAmount)}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-white">
            {label}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";

import { cn, formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import type { Project } from "@/helpers/next-fetch/projectActions";

export function ProjectCard({
  project,
  featured = false,
  lang = "en",
  viewWorkLabel,
  dict,
}: {
  project: Project | any;
  featured?: boolean;
  lang?: string;
  viewWorkLabel?: string;
  dict?: any;
}) {
  const t = dict?.ProjectsPage;
  const label =
    viewWorkLabel ||
    t?.ViewWork ||
    (lang === "ht" ? "Gade travay la" : "View work");
  const projectId = project._id || project.id || project.slug;

  const categoriesMap = (t?.Categories || {}) as Record<string, string>;
  const categoryLabel =
    categoriesMap[project.category] || project.category || "Community";

  const imageSrc = project.image
    ? getImageUrl(project.image) || ""
    : project.imageUrl || "";

  return (
    <Link
      href={`/${lang}/projects/${projectId}`}
      className={cn(
        "group relative isolate flex flex-col overflow-hidden rounded-[1.75rem] bg-forest text-white",
        featured ? "min-h-112 lg:min-h-144" : "min-h-88",
      )}
    >
      {/* Glowing Star Icon for Featured Projects */}
      {Boolean(project?.featured) && (
        <div className="absolute top-5 right-5 z-10 flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-black/45 px-3 py-1 text-xs font-semibold text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.65)] backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
            {lang === "ht" ? "Vedèt" : "Featured"}
          </span>
        </div>
      )}

      {imageSrc && (
        <Image
          src={imageSrc}
          alt={project.name || ""}
          fill
          className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
          sizes={
            featured
              ? "(max-width: 1024px) 100vw, 60vw"
              : "(max-width: 1024px) 100vw, 40vw"
          }
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-forest via-forest/35 to-transparent" />
      <div className="relative mt-auto flex flex-col gap-3 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sand">
          <span>{categoryLabel}</span>
          {project.location && (
            <>
              <span className="h-1 w-1 rounded-full bg-sand/70" />
              <span>{project.location}</span>
            </>
          )}
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
            {project.grantAmount ? formatPrice(project.grantAmount) : "—"}
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

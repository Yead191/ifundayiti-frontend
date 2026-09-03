import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Calendar, Award } from "lucide-react";
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
    (lang === "ht" ? "Li Istwa Enpak la" : "Read Impact Story");
  const projectId = project._id || project.id || project.slug;

  // Category translation
  const categoriesMap = (t?.Categories || {}) as Record<string, string>;
  const categoryLabel =
    categoriesMap[project.category] || project.category || "Community";

  return (
    <Link
      href={`/${lang}/projects/${projectId}`}
      className={cn(
        "group relative isolate flex flex-col justify-between overflow-hidden rounded-3xl border border-hairline bg-white shadow-xs transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:border-forest/30",
        featured ? "min-h-112 lg:min-h-136" : "min-h-96",
      )}
    >
      {/* Cover Media Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-sand-soft/50">
        {project?.image ? (
          <Image
            src={getImageUrl(project?.image) || ""}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-108"
            sizes={
              featured
                ? "(max-width: 1024px) 100vw, 60vw"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-forest/5 text-forest font-display font-semibold">
            IFundAyiti Project
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-forest/85 px-3 py-1 text-xs font-semibold text-white shadow-xs backdrop-blur-md">
            {categoryLabel}
          </span>
          {project.featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs backdrop-blur-md">
              ★ {lang === "ht" ? "Vedèt" : "Featured"}
            </span>
          )}
        </div>

        {/* Bottom Bar on Image: Grant Amount */}
        {project.grantAmount ? (
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/60 px-3 py-1 text-xs font-bold text-sand backdrop-blur-md">
            <Award className="h-3.5 w-3.5 text-sand" />
            <span>{formatPrice(project.grantAmount)}</span>
          </div>
        ) : null}
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* Metadata details row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mist">
            {project.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3 text-forest" />
                <span className="truncate max-w-40">{project.location}</span>
              </span>
            )}
            {project.year && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3 text-mist/70" />
                <span>{project.year}</span>
              </span>
            )}
          </div>

          <h3
            className={cn(
              "mt-3 font-display font-bold leading-snug text-forest-deep transition-colors group-hover:text-forest",
              featured ? "text-2xl sm:text-3xl" : "text-xl",
            )}
          >
            {project.name}
          </h3>

          <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-mist line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Action Link Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4 text-xs sm:text-sm">
          {project.founder ? (
            <span className="truncate max-w-44 text-xs text-mist font-medium">
              {lang === "ht" ? "Pa" : "By"} {project.founder}
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1.5 font-bold text-forest group-hover:text-forest-bright transition-colors">
            <span>{label}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

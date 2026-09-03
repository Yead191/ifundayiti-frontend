import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, MapPin, Calendar, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import type { Project } from "@/helpers/next-fetch/projectActions";

interface ProjectFeaturedSpotlightProps {
  projects: Project[];
  lang: string;
  dict: any;
}

export function ProjectFeaturedSpotlight({
  projects,
  lang,
  dict,
}: ProjectFeaturedSpotlightProps) {
  if (!projects || projects.length === 0) return null;

  const t = dict.ProjectsPage;
  const mainProject = projects[0];
  const sideProjects = projects.slice(1, 3);

  const categoriesMap = (t?.Categories || {}) as Record<string, string>;
  const mainCategory =
    categoriesMap[mainProject.category] || mainProject.category;

  return (
    <section className="py-12 sm:py-16 bg-sand-soft/40 border-b border-hairline">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>{t.SpotlightBadge}</span>
            </div>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-forest-deep">
              {t.SpotlightTitle}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-mist max-w-xl">
              {t.SpotlightSubtitle}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-stretch">
          {/* Main Spotlight Featured Card (8 cols) */}
          <div className="lg:col-span-8">
            <div className="group relative isolate flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-hairline bg-white shadow-sm transition-all duration-500 hover:shadow-xl">
              <div className="relative aspect-video w-full min-h-70 sm:min-h-95 overflow-hidden bg-sand-soft">
                {mainProject.image && (
                  <Image
                    src={getImageUrl(mainProject.image) || ""}
                    alt={mainProject.name}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-forest/90 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md">
                    {mainCategory}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-xs">
                    ★ {lang === "ht" ? "Inisyativ Vedèt" : "Spotlight"}
                  </span>
                </div>

                {/* Overlaid Title & Details on Image Bottom */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-sand font-medium mb-2">
                    {mainProject.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {mainProject.location}
                      </span>
                    )}
                    {mainProject.year && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {mainProject.year}
                      </span>
                    )}
                    {mainProject.grantAmount ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-md">
                        <Award className="h-3.5 w-3.5 text-sand" />
                        {formatPrice(mainProject.grantAmount)}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                    {mainProject.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-sand/90 line-clamp-2 max-w-2xl">
                    {mainProject.description}
                  </p>

                  <div className="mt-4">
                    <Link
                      href={`/${lang}/projects/${mainProject._id || mainProject.id || mainProject.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-sand px-5 py-2.5 text-xs sm:text-sm font-bold text-forest-deep shadow-md hover:bg-white transition-colors"
                    >
                      <span>{t.ViewWork}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Spotlight Stack (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {sideProjects.map((p) => {
              const pImg = p.image || p.imageUrl;

              const cat = categoriesMap[p.category] || p.category;

              return (
                <Link
                  key={p._id || p.id || p.slug}
                  href={`/${lang}/projects/${p._id || p.id || p.slug}`}
                  className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-hairline bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-forest/30"
                >
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-sand-soft">
                      {p.image && (
                        <Image
                          src={getImageUrl(p.image) || ""}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="100px"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-forest">
                        {cat}
                      </span>
                      <h4 className="mt-1 font-display text-base sm:text-lg font-bold text-forest-deep truncate group-hover:text-forest transition-colors">
                        {p.name}
                      </h4>
                      <p className="mt-1 text-xs text-mist line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-xs">
                    <span className="font-bold text-forest">
                      {p.grantAmount ? formatPrice(p.grantAmount) : p.location}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-forest group-hover:text-forest-bright">
                      <span>{lang === "ht" ? "Li plis" : "Read"}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

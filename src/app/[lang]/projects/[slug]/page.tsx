import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Award,
  User,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  Quote,
  ChevronRight,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectSidebar } from "@/features/projects/components/project-sidebar";
import { ProjectGalleryLightbox } from "@/features/projects/components/project-gallery-lightbox";
import {
  getProjectById,
  getProjects,
  type Project,
} from "@/helpers/next-fetch/projectActions";
import { formatPrice } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string; lang: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const [res, dict] = await Promise.all([
    getProjectById(slug),
    getDictionary(lang),
  ]);
  const project = res.data;
  const t = dict.ProjectsPage;

  if (!project) {
    return buildMetadata({
      title: t?.NotFoundTitle || "Project not found",
      description:
        t?.NotFoundDesc || "This IFundAyiti project could not be found.",
      path: `/${lang}/projects/${slug}`,
      noIndex: true,
    });
  }

  const ogImage = project.image ? getImageUrl(project.image) : undefined;

  return buildMetadata({
    title: `${project.name} — ${t.Eyebrow} · IFundAyiti`,
    description: project.description,
    path: `/${lang}/projects/${slug}`,
    image: ogImage,
    keywords: [
      project.name,
      project.location,
      project.category,
      "IFundAyiti project",
      "community micro-grant",
    ],
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug, lang } = await params;

  const [res, dict] = await Promise.all([
    getProjectById(slug),
    getDictionary(lang),
  ]);

  if (!res.success || !res.data) {
    notFound();
  }

  const project: Project = res.data;
  const t = dict.ProjectsPage;

  // Fetch related projects in same category
  const relatedRes = await getProjects({
    category: project.category,
    limit: 4,
  });

  const related = (relatedRes.data || [])
    .filter(
      (p) =>
        (p._id || p.id || p.slug) !==
        (project._id || project.id || project.slug),
    )
    .slice(0, 3);

  const categoriesMap = (t?.Categories || {}) as Record<string, string>;
  const categoryLabel = categoriesMap[project.category] || project.category;

  const cycleTitle =
    typeof project.applicationPeriod === "object" &&
    project.applicationPeriod !== null
      ? project.applicationPeriod.title
      : null;

  return (
    <article className="min-h-screen bg-sand-soft/20 pb-20">
      {/* Hero Header Section with project.image as Background */}
      <section className="relative min-h-[70vh] overflow-hidden bg-forest pt-32 pb-16 text-white md:pt-40 md:pb-24 flex flex-col justify-end">
        {project?.image && (
          <Image
            src={getImageUrl(project.image) || ""}
            alt={project.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-forest via-forest/75 to-forest/35" />

        <Container className="relative">
          {/* Breadcrumb Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link
              href={`/${lang}/projects`}
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sand hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>{t.BackToAll}</span>
            </Link>

            <nav
              aria-label="Breadcrumb"
              className="hidden sm:flex items-center gap-2 text-xs text-sand/70"
            >
              <Link
                href={`/${lang}`}
                className="hover:text-sand transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-sand/40" />
              <Link
                href={`/${lang}/projects`}
                className="hover:text-sand transition-colors"
              >
                {dict.Navbar.Projects}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-sand/40" />
              <span className="font-medium text-white truncate max-w-56">
                {project.name}
              </span>
            </nav>
          </div>

          {/* Identity & Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-sand backdrop-blur-md">
              {categoryLabel}
            </span>
            {project.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5 text-sand" />
                {project.location}
              </span>
            )}
            {project.year && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                <Calendar className="h-3.5 w-3.5 text-sand" />
                {project.year}
              </span>
            )}
            {project.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/90 px-3 py-1 text-xs font-bold text-white shadow-xs">
                ★ {lang === "ht" ? "Inisyativ Vedèt" : "Spotlight"}
              </span>
            )}
          </div>

          {/* Title & Tagline */}
          <h1 className="max-w-4xl font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight text-white">
            {project.name}
          </h1>

          <p className="mt-5 max-w-3xl text-base sm:text-xl leading-relaxed text-sand/90">
            {project.description}
          </p>

          {/* Key Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 border-t border-white/15 pt-8">
            {project.grantAmount ? (
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-sand">
                  <Award className="h-3.5 w-3.5" />
                  <span>{t.Grant}</span>
                </div>
                <div className="mt-1 font-display text-xl sm:text-2xl font-bold text-white">
                  {formatPrice(project.grantAmount)}
                </div>
              </div>
            ) : null}

            {project.founder ? (
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-sand">
                  <User className="h-3.5 w-3.5" />
                  <span>{t.Lead}</span>
                </div>
                <div className="mt-1 font-display text-sm sm:text-base font-bold text-white truncate">
                  {project.founder}
                </div>
              </div>
            ) : null}

            {cycleTitle ? (
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-sand">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{t.Cycle}</span>
                </div>
                <div className="mt-1 font-display text-sm sm:text-base font-bold text-white truncate">
                  {cycleTitle}
                </div>
              </div>
            ) : null}

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-sand">
                <MapPin className="h-3.5 w-3.5" />
                <span>{t.Location}</span>
              </div>
              <div className="mt-1 font-display text-sm sm:text-base font-bold text-white truncate">
                {project.location || "Haiti"}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content & Story Section */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-start">
            {/* Main Narrative Column */}
            <div className="lg:col-span-8 space-y-10">


              {/* The Challenge (Callout Box with Alert Accent) */}
              {project.challenge && (
                <div className="rounded-3xl border border-amber-500/30 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-800">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                        {lang === "ht" ? "Pwoblèm Lokal la" : "Local Problem"}
                      </span>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-forest-deep">
                        {t.TheChallenge}
                      </h2>
                    </div>
                  </div>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-forest-deep/90 whitespace-pre-line">
                    {project.challenge}
                  </p>
                </div>
              )}

              {/* Strategy & Approach */}
              {project.approach && (
                <div className="rounded-3xl border border-hairline bg-white p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-3 mb-4 border-b border-hairline pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-forest">
                        {lang === "ht"
                          ? "Solisyon & Enplemantasyon"
                          : "Solution & Implementation"}
                      </span>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-forest-deep">
                        {t.TheApproach}
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-mist whitespace-pre-line">
                    {project.approach}
                  </p>
                </div>
              )}

              {/* Measurable Impact & Outcomes */}
              {project.outcome && (
                <div className="rounded-3xl border border-forest/20 bg-linear-to-r from-forest-deep to-forest p-6 sm:p-8 text-white shadow-lg">
                  <div className="flex items-center gap-3 mb-4 border-b border-white/15 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-sand">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-sand">
                        {lang === "ht"
                          ? "Rezilta nan Katye a"
                          : "Grassroots Results"}
                      </span>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                        {t.TheOutcome}
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-sand/95 whitespace-pre-line">
                    {project.outcome}
                  </p>
                </div>
              )}

              {/* The Human Story / Founder Narrative */}
              {project.story && (
                <div className="rounded-3xl border border-hairline bg-sand-soft/50 p-6 sm:p-8 shadow-xs relative overflow-hidden">
                  <Quote className="absolute top-6 right-6 h-16 w-16 text-forest/10 pointer-events-none" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-forest">
                        {lang === "ht" ? "Vwa Fondatè a" : "Founder Voice"}
                      </span>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-forest-deep">
                        {t.TheStory}
                      </h2>
                    </div>
                  </div>
                  <div className="text-sm sm:text-base leading-relaxed text-forest-deep/90 whitespace-pre-line italic">
                    &ldquo;{project.story}&rdquo;
                  </div>
                  {project.founder && (
                    <div className="mt-4 pt-3 border-t border-forest/10 text-xs font-bold text-forest">
                      — {project.founder}
                      {project.location ? `, ${project.location}` : ""}
                    </div>
                  )}
                </div>
              )}

              {/* Photo Gallery Lightbox */}
              {Array.isArray(project.gallery) && project.gallery.length > 0 && (
                <ProjectGalleryLightbox
                  gallery={project.gallery}
                  projectName={project.name}
                  lang={lang}
                  title={t.Gallery}
                />
              )}
            </div>

            {/* Sidebar Sticky Column */}
            <div className="lg:col-span-4">
              <ProjectSidebar project={project} lang={lang} dict={dict} />
            </div>
          </div>
        </Container>
      </section>

      {/* Related Projects Section */}
      {related.length > 0 && (
        <section className="border-t border-hairline bg-white py-16 sm:py-24 mt-12">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  {t.MoreProjectsIn} {categoryLabel}
                </span>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-forest-deep">
                  {t.MoreWork}
                </h2>
              </div>
              <Link
                href={`/${lang}/projects?category=${encodeURIComponent(project.category)}`}
                className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-forest hover:text-forest-bright transition-colors"
              >
                <span>{t.Archive}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProjectCard
                  key={p._id || p.id || p.slug}
                  project={p}
                  lang={lang}
                  dict={dict}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}

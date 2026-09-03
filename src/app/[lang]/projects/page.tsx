import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ProjectSearchFilter } from "@/features/projects/components/project-search-filter";
import { ProjectPagination } from "@/features/projects/components/project-pagination";
import { getProjects } from "@/helpers/next-fetch/projectActions";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";
import { Users, DollarSign, ShieldCheck } from "lucide-react";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    category?: string;
    searchTerm?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.ProjectsPage;

  return buildMetadata({
    title: `${dict.Navbar.Projects} — ${t.Eyebrow} · IFundAyiti`,
    description: t.Subtitle,
    path: `/${lang}/projects`,
    keywords: [
      "Haiti grassroots projects",
      "community micro-grants",
      "funded initiatives",
      "IFundAyiti",
    ],
  });
}

export default async function ProjectsPage({
  params,
  searchParams,
}: PageProps) {
  const { lang } = await params;
  const { category, searchTerm, page } = await searchParams;

  const activeCategory = category?.trim() || "All";
  const activeSearch = searchTerm?.trim() || "";
  const currentPage = Math.max(1, parseInt(page || "1", 10));

  const dict = await getDictionary(lang);
  const t = dict.ProjectsPage;

  const projectsRes = await getProjects({
    category: activeCategory,
    searchTerm: activeSearch,
    page: currentPage,
    limit: 12,
  });

  const projects = projectsRes.data || [];
  const pagination = projectsRes.pagination || {
    page: currentPage,
    limit: 12,
    total: projects.length,
    totalPage: 1,
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-forest pt-32 pb-20 text-white md:pt-40 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-forest-bright)_0%,transparent_60%)] opacity-30 pointer-events-none" />
        <Container className="relative">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sand/30 bg-sand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sand backdrop-blur-md">
              {t.Eyebrow}
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl">
              {t.Title1}
              <span className="block text-sand">{t.TitleAccent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-sand/90 sm:text-lg">
              {t.Subtitle}
            </p>

            {/* Quick Impact Stat Pills */}
            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white backdrop-blur-md">
                <Users className="h-4 w-4 text-sand" />
                <span>{t.StatCommunities}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white backdrop-blur-md">
                <DollarSign className="h-4 w-4 text-sand" />
                <span>{t.StatDeployed}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white backdrop-blur-md">
                <ShieldCheck className="h-4 w-4 text-sand" />
                <span>{t.StatGrassroots}</span>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Interactive Explorer & Projects Grid */}
      <section className="py-16 sm:py-24 bg-sand-soft/30" id="directory">
        <Container>
          {/* Search & Category Filter Bar */}
          <Suspense fallback={null}>
            <ProjectSearchFilter
              lang={lang}
              t={t}
              activeCategory={activeCategory}
              initialSearchTerm={activeSearch}
              totalResults={pagination.total}
            />
          </Suspense>

          {/* Projects Card Grid */}
          {projects.length === 0 ? (
            <div className="mt-16">
              <EmptyState
                title={t.EmptyTitle}
                body={t.EmptyBody}
                actionLabel={t.BackToAllBtn}
                actionHref={`/${lang}/projects`}
              />
            </div>
          ) : (
            <>
              <div className="mt-12 grid gap-5 sm:grid-cols-2">
                {projects?.map((project, i) => (
                  <Reveal
                    key={project._id || project.id || project.slug || i}
                    delay={i * 50}
                  >
                    <ProjectCard
                      project={project}
                      featured={i === 0}
                      lang={lang}
                      dict={dict}
                    />
                  </Reveal>
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPage > 1 && (
                <ProjectPagination pagination={pagination} lang={lang} />
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  FEATURED_PROJECTS,
  PROJECT_CATEGORIES,
} from "@/data/projects";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return buildMetadata({
    title: dict.Navbar.Projects,
    description: dict.ProjectsPage.Subtitle,
    path: `/${lang}/projects`,
  });
}

export default async function ProjectsPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const { category } = await searchParams;
  const active = category?.trim() || "All";
  const projects =
    active === "All"
      ? FEATURED_PROJECTS
      : FEATURED_PROJECTS.filter((p) => p.category === active);

  const dict = await getDictionary(lang);
  const t = dict.ProjectsPage;

  return (
    <>
      <section className="relative overflow-hidden bg-forest pt-32 pb-20 text-white md:pt-40 md:pb-28">
        <Container>
          <Reveal>
            <p className="eyebrow text-sand">{t.Eyebrow}</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl">
              {t.Title1}
              <span className="block text-sand">{t.TitleAccent}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-sand/90 sm:text-lg">
              {t.Subtitle}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <div className="flex flex-wrap gap-2">
            {PROJECT_CATEGORIES.map((cat) => {
              const href = cat === "All" ? `/${lang}/projects` : `/${lang}/projects?category=${encodeURIComponent(cat)}`;
              const isActive = active === cat;
              
              let label: string = cat;
              if (cat === "All") label = t.All;
              else if (cat === "Food" && lang === "ht") label = "Manje";
              else if (cat === "Energy" && lang === "ht") label = "Enèji";
              else if (cat === "Water" && lang === "ht") label = "Dlo";
              else if (cat === "Craft" && lang === "ht") label = "Atizana";
              else if (cat === "Livelihood" && lang === "ht") label = "Aktivite yo";

              return (
                <Link
                  key={cat}
                  href={href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-forest text-white"
                      : "bg-sand-soft text-forest-deep hover:bg-sand"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {projects.length === 0 ? (
            <div className="mt-14">
              <EmptyState
                title={t.EmptyTitle}
                body={t.EmptyBody}
                actionLabel={t.BackToAllBtn}
                actionHref={`/${lang}/projects`}
              />
            </div>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {projects.map((project, i) => (
                <Reveal key={project.id} delay={i * 50}>
                  <ProjectCard
                    project={project}
                    featured={i === 0 && active === "All"}
                    lang={lang}
                    viewWorkLabel={t.ViewWork}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

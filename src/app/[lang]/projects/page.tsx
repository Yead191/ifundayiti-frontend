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

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Explore IFundAyiti-supported projects across food, energy, water, craft, and livelihoods in Haitian communities.",
  path: "/projects",
});

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const active = category?.trim() || "All";
  const projects =
    active === "All"
      ? FEATURED_PROJECTS
      : FEATURED_PROJECTS.filter((p) => p.category === active);

  return (
    <>
      <section className="relative overflow-hidden bg-forest pt-32 pb-20 text-white md:pt-40 md:pb-28">
        <Container>
          <Reveal>
            <p className="eyebrow text-sand">Our work</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl">
              Projects that stay
              <span className="block text-sand">in the neighborhood.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-sand/90 sm:text-lg">
              A public archive of ideas IFundAyiti has put in view — food, light,
              water, craft, and livelihoods. Demo case studies until live data is connected.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <div className="flex flex-wrap gap-2">
            {PROJECT_CATEGORIES.map((cat) => {
              const href = cat === "All" ? "/projects" : `/projects?category=${encodeURIComponent(cat)}`;
              const isActive = active === cat;
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
                  {cat}
                </Link>
              );
            })}
          </div>

          {projects.length === 0 ? (
            <div className="mt-14">
              <EmptyState
                title="No projects in this category"
                body="Try another filter, or view the full archive."
                actionLabel="All projects"
                actionHref="/projects"
              />
            </div>
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {projects.map((project, i) => (
                <Reveal key={project.id} delay={i * 50}>
                  <ProjectCard project={project} featured={i === 0 && active === "All"} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

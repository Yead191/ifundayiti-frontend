"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { FEATURED_PROJECTS } from "@/data/projects";
import { useTranslation } from "@/components/providers/translation-provider";

export function FeaturedProjects({ id }: { id?: string }) {
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] === "ht" ? "ht" : "en";
  const dict = useTranslation();
  const t = dict.FeaturedProjects;

  const [lead, ...rest] = FEATURED_PROJECTS.filter((p) => p.featured).slice(0, 3);
  const side = rest.slice(0, 2);

  if (!lead) return null;

  return (
    <section id={id} className="scroll-mt-28 py-24 md:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">{t.Eyebrow}</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-semibold tracking-tight text-forest-deep md:text-5xl">
              {t.Title}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <Link
              href={`/${currentLocale}/projects`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-forest transition-colors hover:text-forest-bright"
            >
              {t.AllProjects}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ProjectCard project={lead} featured />
          </Reveal>
          <div className="grid gap-5 lg:col-span-5">
            {side.map((project, i) => (
              <Reveal key={project.id} delay={100 + i * 80}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

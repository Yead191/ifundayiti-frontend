import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { getFeaturedProjects } from "@/helpers/next-fetch/projectActions";
import { getDictionary } from "@/lib/dictionaries";

export async function FeaturedProjects({
  id,
  lang = "en",
}: {
  id?: string;
  lang?: string;
}) {
  const [projects, dict] = await Promise.all([
    getFeaturedProjects(3),
    getDictionary(lang),
  ]);

  const t = dict.FeaturedProjects;

  if (!projects || projects.length === 0) return null;

  const [lead, ...rest] = projects;
  const side = rest.slice(0, 2);

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
              href={`/${lang}/projects`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-forest transition-colors hover:text-forest-bright"
            >
              {t.AllProjects}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ProjectCard project={lead} featured lang={lang} dict={dict} />
          </Reveal>
          <div className="grid gap-5 lg:col-span-5">
            {side.map((project, i) => (
              <Reveal
                key={project._id || project.id || project.slug || i}
                delay={100 + i * 80}
              >
                <ProjectCard project={project} lang={lang} dict={dict} />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

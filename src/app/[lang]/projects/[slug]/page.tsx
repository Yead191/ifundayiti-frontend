import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import {
  FEATURED_PROJECTS,
  getProjectBySlug,
  getRelatedProjects,
} from "@/data/projects";
import { formatPrice } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";

interface PageProps {
  params: Promise<{ slug: string; lang: string }>;
}

export async function generateStaticParams() {
  const locales = ["en", "ht"];
  return FEATURED_PROJECTS.flatMap((p) =>
    locales.map((lang) => ({ lang, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return buildMetadata({
      title: "Project not found",
      description: "This IFundAyiti project could not be found.",
      path: `/${lang}/projects/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: project.name,
    description: project.description,
    path: `/${lang}/projects/${slug}`,
    image: project.imageUrl,
    keywords: [
      project.name,
      project.location,
      project.category,
      "IFundAyiti project",
    ],
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug, lang } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = getRelatedProjects(project);

  const dict = await getDictionary(lang);
  const t = dict.ProjectsPage;

  const statusLabel =
    lang === "ht"
      ? project.status === "Winner"
        ? "Laureya"
        : project.status === "Finalist"
          ? "Finalis"
          : "Apwouve"
      : project.status;

  const specs = [
    [t.Grant, formatPrice(project.grantAmount)],
    [t.Status, statusLabel],
    [t.Cycle, project.period],
    [t.Lead, project.founder],
  ];

  const blocks = [
    [t.Challenge, project.challenge],
    [t.Approach, project.approach],
    [t.Outcome, project.outcome],
  ];

  return (
    <article>
      <section className="relative min-h-[72vh] overflow-hidden bg-forest pt-28 text-white">
        <Image
          src={project.imageUrl}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-forest via-forest/55 to-forest/20" />
        <Container className="relative flex min-h-[calc(72vh-4rem)] flex-col justify-end pb-16 pt-10">
          <Link
            href={`/${lang}/projects`}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-sand hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.BackToAll}
          </Link>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sand">
            {project.category} · {project.location} · {project.year}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-sand/90 sm:text-lg">
            {project.description}
          </p>
        </Container>
      </section>

      <section className="border-b border-hairline bg-white py-10">
        <Container className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {specs.map(([label, value]) => (
            <div key={label}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest">
                {label}
              </p>
              <p className="mt-2 font-display text-xl text-forest-deep">
                {value}
              </p>
            </div>
          ))}
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">{t.TheStory}</p>
            <p className="mt-5 text-lg leading-relaxed text-mist">
              {project.story}
            </p>
            <div className="mt-12 grid gap-10">
              {blocks.map(([title, body]) => (
                <div key={title} className="border-t border-hairline pt-8">
                  <h2 className="font-display text-2xl text-forest-deep">
                    {title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-mist">{body}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="rounded-[1.5rem] bg-sand-soft p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest">
                {t.SupportFund}
              </p>
              <p className="mt-3 font-display text-2xl text-forest-deep">
                {t.SupportFundBody}
              </p>
              <Button asChild className="mt-6">
                <Link href={`/${lang}/donate`}>{dict.Navbar.Donate}</Link>
              </Button>
            </div>
          </aside>
        </Container>
      </section>

      {project.gallery.length > 0 && (
        <section className="pb-8">
          <Container
            className={`grid gap-4 ${project.gallery.length > 1 ? "md:grid-cols-2" : ""}`}
          >
            {project.gallery.map((src) => (
              <div
                key={src}
                className="relative aspect-4/3 overflow-hidden rounded-[1.5rem]"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            ))}
          </Container>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-20 md:py-28">
          <Container>
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl text-forest-deep">
                {t.MoreWork}
              </h2>
              <Link
                href={`/${lang}/projects`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-forest"
              >
                {t.Archive}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  lang={lang}
                  viewWorkLabel={t.ViewWork}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}

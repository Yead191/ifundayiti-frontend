import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { FEATURED_PROJECTS } from "@/data/projects";
import { formatPrice } from "@/lib/utils";

export function FeaturedProjects({ id }: { id?: string }) {
  return (
    <section id={id} className="scroll-mt-24 py-20">
      <Container>
        <SectionHeading
          eyebrow="Projects"
          title="Ideas already in public view"
          subtitle="A curated look at approved and finalist projects. Demo cards — replace with public application data."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_PROJECTS.map((project) => (
            <article
              key={project.id}
              className="group overflow-hidden rounded-2xl border border-hairline bg-white"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-forest">
                  {project.status} · {project.location}
                </p>
                <h3 className="mt-1 font-display text-lg text-forest-deep">
                  {project.name}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mist">
                  {project.description}
                </p>
                <p className="mt-3 text-sm font-semibold text-forest">
                  {formatPrice(project.grantAmount)}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link href="/impact#projects" className="text-sm font-semibold text-forest hover:underline">
            See more projects
          </Link>
        </p>
      </Container>
    </section>
  );
}

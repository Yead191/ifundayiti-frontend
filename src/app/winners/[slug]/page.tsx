import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "@/components/shared/container";
import { getWinnerBySlug, WINNERS } from "@/data/projects";
import { formatPrice } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return WINNERS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const winner = getWinnerBySlug(slug);
  if (!winner) {
    return buildMetadata({
      title: "Winner not found",
      description: "This winner story could not be found.",
      path: `/winners/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${winner.name} — ${winner.projectName}`,
    description: winner.story.slice(0, 160),
    path: `/winners/${slug}`,
    image: winner.photoUrl,
  });
}

export default async function WinnerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const winner = getWinnerBySlug(slug);
  if (!winner) notFound();

  return (
    <article className="pt-28 pb-20">
      <Container className="max-w-4xl">
        <p className="eyebrow">{winner.period}</p>
        <h1 className="mt-3 font-display text-4xl text-forest-deep sm:text-5xl">
          {winner.name}
        </h1>
        <p className="mt-3 text-mist">
          {winner.projectName} · {winner.location} ·{" "}
          {formatPrice(winner.awardedAmount)}
        </p>
        <div className="relative mt-10 aspect-4/5 overflow-hidden rounded-2xl sm:aspect-4/3">
          <Image
            src={winner.photoUrl}
            alt=""
            fill
            className="object-cover"
            sizes="800px"
            priority
          />
        </div>
        <p className="mt-10 text-lg leading-relaxed text-mist">{winner.story}</p>
        {winner.gallery.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {winner.gallery.map((src) => (
              <div key={src} className="relative aspect-4/3 overflow-hidden rounded-2xl">
                <Image src={src} alt="" fill className="object-cover" sizes="400px" />
              </div>
            ))}
          </div>
        )}
      </Container>
    </article>
  );
}

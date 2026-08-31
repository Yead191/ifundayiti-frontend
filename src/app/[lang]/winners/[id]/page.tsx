import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { WinnerHero } from "@/features/winners/components/winner-hero";
import { WinnerIdentity } from "@/features/winners/components/winner-identity";
import { WinnerStory } from "@/features/winners/components/winner-story";
import { WinnerGallery } from "@/features/winners/components/winner-gallery";
import { getImageUrl } from "@/lib/getImageUrl";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { buildMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ id: string; lang: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, lang } = await params;
  const res = await nextFetch("/application/" + id, { cache: "no-store" });
  const winner = res.success ? res.data : null;

  if (!winner) {
    return buildMetadata({
      title: "Winner not found",
      description: "This winner story could not be found.",
      path: `/${lang}/winners/${id}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${winner.personal?.name} — ${winner.grant?.projectName}`,
    description: winner.successStory?.slice(0, 160) || "",
    path: `/${lang}/winners/${id}`,
    image: getImageUrl(winner.personal?.image) || "",
  });
}

export default async function WinnerDetailPage({ params }: PageProps) {
  const { id, lang } = await params;
  const res = await nextFetch("/application/" + id, { cache: "no-store" });
  const winner = res.success ? res.data : null;
  if (!winner) notFound();

  return (
    <article className="min-h-screen bg-sand-soft/10 pb-24">
      <WinnerHero lang={lang} />
      <WinnerIdentity winner={winner} lang={lang} />

      {/* Story & Gallery */}
      <Container className="mt-20">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <WinnerStory winner={winner} lang={lang} />
          <WinnerGallery winner={winner} lang={lang} />
        </div>
      </Container>
    </article>
  );
}

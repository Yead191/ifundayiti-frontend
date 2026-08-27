import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  BadgeDollarSign,
  Calendar,
  Quote,
  ImageIcon,
  User,
  Rocket,
  Sparkles,
} from "lucide-react";

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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
    <article className="min-h-screen bg-sand-soft/10 pb-24">
      {/* Typography Cover Hero */}
      <div className="relative h-[40vh] min-h-87.5 w-full bg-forest-deep flex items-center justify-center overflow-hidden">
        {/* Gradient and Pattern */}
        <div className="absolute inset-0 bg-linear-to-br from-forest-deep via-forest to-forest-deep opacity-60" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Massive WINNER text */}
        <div className="relative z-10 font-display font-black text-[18vw] leading-none text-white/25 select-none tracking-tighter mix-blend-overlay">
          WINNER
        </div>

        <Container className="absolute inset-x-0 top-0 pt-10 h-full flex flex-col z-20">
          <Link
            href="/winners"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors uppercase tracking-wider text-xs font-semibold self-start bg-white/10 px-4 py-2 rounded-full backdrop-blur-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Winners
          </Link>
        </Container>
      </div>

      {/* Profile & Identity Section (Overlapping the hero) */}
      <div className="relative z-30">
        <Container>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* DP Profile */}
            <div className="relative h-48 w-48 sm:h-56 sm:w-56 rounded-[2.5rem] border-8 border-sand-soft/10 bg-white overflow-hidden shadow-2xl shrink-0 -mt-24 sm:-mt-32 rotate-3 transition-transform hover:rotate-0 duration-500 z-30">
              <Image
                src={winner.photoUrl}
                alt={winner.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 250px, 300px"
                priority
                draggable={false}
              />
            </div>

            {/* Name and Project */}
            <div className="text-center md:text-left flex-1 md:-mt-11 pb-4">
              <div className="inline-flex items-center gap-2 bg-forest text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
                <Calendar className="h-4 w-4" />
                {winner.period}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-forest-deep leading-tight mb-2">
                {winner.name}
              </h1>
              <p className="text-xl sm:text-2xl text-mist font-medium">
                {winner.projectName}
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Stats Row */}
      <div className="relative z-20 mt-12">
        <Container>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 bg-white p-6 sm:p-8 rounded-4xl shadow-sm border border-hairline max-w-5xl mx-auto">
            <div className="flex items-center gap-4 flex-1">
              <div className="h-12 w-12 rounded-full bg-forest/10 flex items-center justify-center text-forest shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-mist uppercase tracking-wider">
                  Location
                </p>
                <p className="text-lg font-medium text-forest-deep truncate">
                  {winner.location}
                </p>
              </div>
            </div>

            <div className="hidden sm:block w-px bg-hairline" />

            <div className="flex items-center gap-4 flex-1">
              <div className="h-12 w-12 rounded-full bg-forest/10 flex items-center justify-center text-forest shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-mist uppercase tracking-wider">
                  Occupation
                </p>
                <p className="text-lg font-medium text-forest-deep truncate">
                  {winner.occupation}
                </p>
              </div>
            </div>

            <div className="hidden sm:block w-px bg-hairline" />

            <div className="flex items-center gap-4 flex-1">
              <div className="h-12 w-12 rounded-full bg-forest/10 flex items-center justify-center text-forest shrink-0">
                <BadgeDollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-mist uppercase tracking-wider">
                  Awarded
                </p>
                <p className="text-lg font-medium text-forest-deep truncate">
                  {formatPrice(winner.awardedAmount)}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Story & Gallery */}
      <Container className="mt-20">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-7 space-y-16">
            {/* Project Overview Blocks */}
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-3xl border border-hairline shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-forest/10 text-forest">
                    <Rocket className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-forest-deep uppercase tracking-wider text-sm">
                    Fund Usage
                  </h3>
                </div>
                <p className="text-mist text-sm leading-relaxed">
                  {winner.fundUsage}
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-hairline shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-forest/10 text-forest">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-forest-deep uppercase tracking-wider text-sm">
                    Expected Impact
                  </h3>
                </div>
                <p className="text-mist text-sm leading-relaxed">
                  {winner.expectedImpact}
                </p>
              </div>
            </div>

            {/* Success Story */}
            <div>
              <div className="flex gap-4 mb-8">
                <Quote className="h-12 w-12 text-forest/20 shrink-0 transform -scale-x-100" />
                <h2 className="font-display text-3xl text-forest-deep">
                  The Story Behind the Impact
                </h2>
              </div>

              <div className="prose prose-lg prose-p:text-mist prose-p:leading-loose">
                {/* Using drop cap styling for the first letter */}
                <p className="first-letter:text-6xl first-letter:font-display first-letter:font-bold first-letter:text-forest first-letter:mr-3 first-letter:float-left">
                  {winner.story}
                </p>
              </div>
            </div>
          </div>

          {/* Gallery Sidebar */}
          {winner.gallery.length > 0 && (
            <div className="lg:col-span-5 space-y-8">
              <div className="flex items-center gap-2 border-b border-hairline pb-4">
                <ImageIcon className="h-5 w-5 text-forest" />
                <h3 className="font-semibold text-forest-deep uppercase tracking-wider">
                  Project Gallery
                </h3>
              </div>

              <div className="grid gap-6">
                {winner.gallery.map((src, idx) => (
                  <div
                    key={src}
                    className="group relative aspect-4/3 overflow-hidden rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <Image
                      src={src}
                      alt={`${winner.projectName} gallery image ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 400px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </article>
  );
}

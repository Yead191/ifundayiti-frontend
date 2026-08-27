import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  MapPin,
  BadgeDollarSign,
  ChevronRight,
  Calendar,
} from "lucide-react";

import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { WINNERS } from "@/data/projects";
import { formatPrice } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Winners",
  description:
    "Celebrate IFundAyiti grant winners and read how awarded projects moved from idea to community outcome.",
  path: "/winners",
});

export default function WinnersPage() {
  const [current, ...previous] = WINNERS;

  return (
    <>
      <PageHero
        eyebrow="Our Winners"
        title="Celebrating the people behind the impact."
        subtitle="Discover the inspiring stories of our grant recipients who are turning bold ideas into thriving community realities."
      />

      <section className="py-20 relative">
        <Container>
          {!current ? (
            <EmptyState
              title="Winner stories will appear here"
              body="Winner stories will appear here after the current grant cycle concludes."
              actionLabel="View grants"
              actionHref="/grants"
            />
          ) : (
            <div className="relative isolate group">
              <Link
                href={`/winners/${current.slug}`}
                className="grid overflow-hidden rounded-[2.5rem] bg-forest text-white lg:grid-cols-12 shadow-2xl transition-transform hover:-translate-y-1 duration-500"
              >
                <div className="relative min-h-100 lg:min-h-full lg:col-span-7 overflow-hidden">
                  <Image
                    src={current.photoUrl}
                    alt={current.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-r from-forest/80 via-forest/20 to-transparent lg:hidden" />
                </div>
                <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center lg:col-span-5 relative z-10 bg-forest lg:bg-linear-to-l lg:from-forest lg:to-forest/95">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-sand text-forest-deep shadow-lg">
                      <Trophy className="h-4 w-4" />
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">
                      Featured Winner
                    </p>
                  </div>

                  <h2 className="font-display text-4xl lg:text-5xl leading-tight">
                    {current.name}
                  </h2>
                  <h3 className="mt-2 text-xl font-medium text-sand/90">
                    {current.projectName}
                  </h3>

                  <div className="mt-8 flex flex-col gap-3 text-sand/80">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-sand" />
                      <span>{current.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BadgeDollarSign className="h-5 w-5 text-sand" />
                      <span>{formatPrice(current.awardedAmount)} Grant</span>
                    </div>
                  </div>

                  <p className="mt-8 line-clamp-4 text-sm leading-relaxed text-sand/70">
                    {current.story}
                  </p>

                  <div className="mt-10 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-sand group-hover:text-white transition-colors">
                    Read full story
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>
          )}
        </Container>
      </section>

      {previous.length > 0 && (
        <section className="py-24 bg-sand-soft/30 border-t border-hairline">
          <Container>
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-4xl text-forest-deep">
                Previous Winners
              </h2>
              <p className="mt-4 text-mist">
                Explore the archive of past grant recipients who have made a
                lasting impact in their communities.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {previous.map((w) => (
                <Link
                  key={w.id}
                  href={`/winners/${w.slug}`}
                  className="group flex flex-col overflow-hidden rounded-4xl bg-white border border-hairline hover:border-forest/20 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-4/3 overflow-hidden">
                    <Image
                      src={w.photoUrl}
                      alt={w.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-forest-deep uppercase tracking-wider shadow-sm">
                      <Calendar className="h-3.5 w-3.5" />
                      {w.period}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="font-display text-2xl text-forest-deep group-hover:text-forest transition-colors">
                      {w.name}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-forest/80 line-clamp-1">
                      {w.projectName}
                    </p>

                    <div className="mt-6 pt-6 border-t border-hairline  flex items-center justify-between text-mist text-sm">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>{w.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-forest-deep">
                        <BadgeDollarSign className="h-4 w-4" />
                        <span>{formatPrice(w.awardedAmount)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { ImpactStats } from "@/components/home/impact-stats";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { SuccessStory } from "@/components/home/success-story";
import { DonationCta } from "@/components/home/donation-cta";
import { WINNERS } from "@/data/projects";
import { formatPrice } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Impact",
  description:
    "See the community impact of IFundAyiti grants — projects supported, winner stories, and how program funds are used.",
  path: "/impact",
});

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Impact"
        title="What these grants make possible."
        subtitle="Visual stories of projects and winners. Figures on this page are replaceable demo values until official reporting is connected."
      />
      <ImpactStats />
      <FeaturedProjects id="projects" />
      <SuccessStory id="success-stories" />

      <section className="py-16">
        <Container>
          <h2 className="font-display text-3xl text-forest-deep">
            Grant distribution
          </h2>
          <p className="mt-3 max-w-2xl text-mist">
            Donations go to the IFundAyiti Program Fund. Grants are awarded from
            that fund — not earmarked to a donor-selected applicant.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Program Fund", "Pooled gifts power each cycle"],
              ["Awards", "Up to $1,000 per winner"],
              ["One winner", "Per application period"],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl bg-sand-soft p-6">
                <h3 className="font-display text-xl text-forest-deep">{title}</h3>
                <p className="mt-2 text-sm text-mist">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-cream-dark py-16">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-forest-deep">Winners</h2>
            <Link href="/winners" className="text-sm font-semibold text-forest hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {WINNERS.map((w) => (
              <Link
                key={w.id}
                href={`/winners/${w.slug}`}
                className="rounded-2xl border border-hairline bg-white p-6 hover:border-forest/30"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-forest">
                  {w.period}
                </p>
                <h3 className="mt-2 font-display text-2xl text-forest-deep">
                  {w.name}
                </h3>
                <p className="mt-1 text-sm text-mist">
                  {w.projectName} · {formatPrice(w.awardedAmount)}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="rounded-2xl bg-forest px-8 py-12 text-center text-white">
          <h2 className="font-display text-3xl">Community impact</h2>
          <p className="mx-auto mt-3 max-w-xl text-sand/90">
            Grants are meant to stay local — food, energy, water, craft, and
            livelihoods that neighbors can see.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <Link href="/donate">Support the Program Fund</Link>
          </Button>
        </Container>
      </section>
      <DonationCta />
    </>
  );
}

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
import { FeaturedWinnerCard } from "@/features/winners/components/featured-winner-card";
import { PreviousWinnersGrid } from "@/features/winners/components/previous-winners-grid";
import { getImageUrl } from "@/lib/getImageUrl";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { formatPrice } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Winners",
  description:
    "Celebrate IFundAyiti grant winners and read how awarded projects moved from idea to community outcome.",
  path: "/winners",
});

export default async function WinnersPage() {
  const res = await nextFetch("/application?status=winner", { cache: "no-store" });
  const winnersData = res.success ? res.data || [] : [];
  
  const [current, ...previous] = winnersData;

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
            <FeaturedWinnerCard winner={current} />
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

            <PreviousWinnersGrid winners={previous} />
          </Container>
        </section>
      )}
    </>
  );
}

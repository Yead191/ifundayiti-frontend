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
import { getDictionary } from "@/lib/dictionaries";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return buildMetadata({
    title: dict.Navbar.Winners,
    description: dict.WinnersPage.Hero.Subtitle,
    path: `/${lang}/winners`,
  });
}

export default async function WinnersPage({ params }: PageProps) {
  const { lang } = await params;
  const res = await nextFetch("/application?status=winner", { cache: "no-store" });
  const winnersData = res.success ? res.data || [] : [];
  
  const [current, ...previous] = winnersData;

  const dict = await getDictionary(lang);
  const t = dict.WinnersPage;

  return (
    <>
      <PageHero
        eyebrow={t.Hero.Eyebrow}
        title={t.Hero.Title}
        subtitle={t.Hero.Subtitle}
      />

      <section className="py-20 relative">
        <Container>
          {!current ? (
            <EmptyState
              title={t.EmptyState.Title}
              body={t.EmptyState.Body}
              actionLabel={t.EmptyState.ActionLabel}
              actionHref={`/${lang}/grants`}
            />
          ) : (
            <FeaturedWinnerCard winner={current} lang={lang} />
          )}
        </Container>
      </section>

      {previous.length > 0 && (
        <section className="py-24 bg-sand-soft/30 border-t border-hairline">
          <Container>
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-display text-4xl text-forest-deep">
                {t.PreviousWinners.Title}
              </h2>
              <p className="mt-4 text-mist">
                {t.PreviousWinners.Subtitle}
              </p>
            </div>

            <PreviousWinnersGrid winners={previous} lang={lang} />
          </Container>
        </section>
      )}
    </>
  );
}

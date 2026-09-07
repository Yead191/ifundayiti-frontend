import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { buildMetadata } from "@/lib/seo";
import { FinalistsClient } from "@/features/finalists/components/finalists-client";
import { EmptyState } from "@/components/shared/empty-state";
import { getDictionary } from "@/lib/dictionaries";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return buildMetadata({
    title: dict.Navbar.Finalists,
    description: dict.FinalistsPage.Hero.Subtitle,
    path: `/${lang}/finalists`,
  });
}

export default async function FinalistsPage({
  params,
  searchParams,
}: PageProps) {
  const { lang } = await params;
  const sp = await searchParams;

  // 1. Concurrently fetch all periods and all finalists
  const [periodsRes, finalistsRes] = await Promise.all([
    nextFetch("/period", { cache: "no-store" }),
    nextFetch("/application?status=finalist", { cache: "no-store" }),
  ]);

  const periods = periodsRes.success ? periodsRes.data || [] : [];
  const finalists = finalistsRes.success ? finalistsRes.data || [] : [];

  // Determine initial period based on search param or default to "all" to show all finalists at once
  const initialPeriodId =
    typeof sp.period === "string" ? sp.period : "all";

  const dict = await getDictionary(lang);
  const t = dict.FinalistsPage;

  return (
    <>
      <PageHero
        eyebrow={t.Hero.Eyebrow}
        title={t.Hero.Title}
        subtitle={t.Hero.Subtitle}
      />

      <section className="py-20 relative bg-sand-soft/30 min-h-[60vh]">
        <Container>
          {periods.length === 0 && finalists.length === 0 ? (
            <EmptyState
              title={t.EmptyState.Title}
              body={t.EmptyState.Body}
              actionLabel={t.EmptyState.ActionLabel}
              actionHref={`/${lang}/grants`}
            />
          ) : (
            <FinalistsClient
              periods={periods}
              finalists={finalists}
              initialPeriodId={initialPeriodId}
              lang={lang}
            />
          )}
        </Container>
      </section>
    </>
  );
}

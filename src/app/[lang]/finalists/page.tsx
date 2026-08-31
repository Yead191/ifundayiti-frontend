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

export default async function FinalistsPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const sp = await searchParams;
  
  // 1. Fetch all periods
  const periodsRes = await nextFetch("/period", { cache: "no-store" });
  const periods = periodsRes.success ? periodsRes.data || [] : [];
  
  // Filter for valid periods (e.g. WinnerSelection, Closed, etc.) or just use all.
  // The user requested to automatically select the latest application period.
  // We'll use the first period returned by the API as the default latest.
  const latestPeriod = periods.length > 0 ? periods[0] : null;

  // Determine current period based on search param or fallback to latest
  const currentPeriodId = 
    typeof sp.period === "string" ? sp.period : (latestPeriod?._id || "");

  // 2. Fetch finalists for the selected period
  let finalists: any[] = [];
  if (currentPeriodId) {
    const finalistsRes = await nextFetch(`/application?applicationPeriod=${currentPeriodId}&status=finalist`, { cache: "no-store" });
    finalists = finalistsRes.success ? finalistsRes.data || [] : [];
  }

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
          {periods.length === 0 ? (
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
              currentPeriodId={currentPeriodId} 
              lang={lang}
            />
          )}
        </Container>
      </section>
    </>
  );
}

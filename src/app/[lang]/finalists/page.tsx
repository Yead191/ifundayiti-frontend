import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { buildMetadata } from "@/lib/seo";
import { FinalistsClient } from "@/features/finalists/components/finalists-client";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = buildMetadata({
  title: "Finalists",
  description:
    "Meet the finalists of the IFundAyiti grant cycles. Explore their inspiring projects and expected community impact.",
  path: "/finalists",
});

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FinalistsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  // 1. Fetch all periods
  const periodsRes = await nextFetch("/period", { cache: "no-store" });
  const periods = periodsRes.success ? periodsRes.data || [] : [];
  
  // Filter for valid periods (e.g. WinnerSelection, Closed, etc.) or just use all.
  // The user requested to automatically select the latest application period.
  // We'll use the first period returned by the API as the default latest.
  const latestPeriod = periods.length > 0 ? periods[0] : null;

  // Determine current period based on search param or fallback to latest
  const currentPeriodId = 
    typeof params.period === "string" ? params.period : (latestPeriod?._id || "");

  // 2. Fetch finalists for the selected period
  let finalists: any[] = [];
  if (currentPeriodId) {
    const finalistsRes = await nextFetch(`/application?applicationPeriod=${currentPeriodId}&status=finalist`, { cache: "no-store" });
    finalists = finalistsRes.success ? finalistsRes.data || [] : [];
  }

  return (
    <>
      <PageHero
        eyebrow="Our Finalists"
        title="Meet the visionaries behind the ideas."
        subtitle="Explore the outstanding applicants who made it to the final stages of our grant cycles."
      />

      <section className="py-20 relative bg-sand-soft/30 min-h-[60vh]">
        <Container>
          {periods.length === 0 ? (
            <EmptyState
              title="No grant cycles available"
              body="We don't have any grant cycles to display finalists for right now."
              actionLabel="View all grants"
              actionHref="/grants"
            />
          ) : (
            <FinalistsClient 
              periods={periods} 
              finalists={finalists} 
              currentPeriodId={currentPeriodId} 
            />
          )}
        </Container>
      </section>
    </>
  );
}

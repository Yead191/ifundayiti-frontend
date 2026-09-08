import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { HomeHero } from "@/components/home/hero";
import { FloatingDonationCard } from "@/components/home/floating-donation-card";
import { CurrentGrant } from "@/components/home/current-grant";
import { WhatWeDo } from "@/components/home/what-we-do";
import { HowItWorks } from "@/components/home/how-it-works";
import { ImpactStats } from "@/components/home/impact-stats";
import { FeaturedProjects } from "@/components/home/featured-projects";
import {
  LeadershipSection,
  VolunteersSection,
} from "@/components/home/people-sections";
import { SuccessStory } from "@/components/home/success-story";
import { DonationCta } from "@/components/home/donation-cta";
import { absoluteUrl, buildMetadata, getSiteUrl, SITE_NAME } from "@/lib/seo";
import { SITE } from "@/data/site";
import { getImpactStats } from "@/helpers/next-fetch/impactActions";
import { getPartnerLogos } from "@/helpers/next-fetch/partnerActions";
import { getDictionary } from "@/lib/dictionaries";
import { PartnerLogoCarousel } from "@/features/partners/components/partner-logo-carousel";

export const metadata: Metadata = buildMetadata({
  title: "IFundAyiti — Grants that grow Haitian ideas",
  absoluteTitle: true,
  description: SITE.summary,
  path: "/",
  keywords: [
    "IFundAyiti homepage",
    "Haiti micro grants",
    "apply for a grant Haiti",
  ],
});

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const site = getSiteUrl();

  const [impactStatsRes, partnerLogosRes, dict] = await Promise.all([
    getImpactStats(),
    getPartnerLogos(),
    getDictionary(lang),
  ]);
  const impactStats = impactStatsRes.success ? impactStatsRes.data : undefined;
  const partnerLogos =
    partnerLogosRes.success && Array.isArray(partnerLogosRes.data)
      ? partnerLogosRes.data
      : [];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "NGO",
              "@id": `${site}/#organization`,
              name: SITE_NAME,
              url: site,
              description: SITE.summary,
            },
            {
              "@type": "WebSite",
              "@id": `${site}/#website`,
              url: site,
              name: SITE_NAME,
              publisher: { "@id": `${site}/#organization` },
            },
          ],
        }}
      />
      <HomeHero lang={lang} />
      <FloatingDonationCard />
      <CurrentGrant lang={lang} />
      <WhatWeDo />
      <HowItWorks />
      <ImpactStats initialStats={impactStats} />
      <FeaturedProjects lang={lang} />
      {/* <LeadershipSection lang={lang} />
      <VolunteersSection lang={lang} /> */}
      <SuccessStory lang={lang} />
      <PartnerLogoCarousel logos={partnerLogos} lang={lang} dict={dict} />
      <DonationCta />
    </>
  );
}

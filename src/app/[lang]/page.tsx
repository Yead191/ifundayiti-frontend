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
      <ImpactStats />
      <FeaturedProjects lang={lang} />
      <LeadershipSection lang={lang} />
      <VolunteersSection lang={lang} />
      <SuccessStory lang={lang} />
      <DonationCta />
    </>
  );
}

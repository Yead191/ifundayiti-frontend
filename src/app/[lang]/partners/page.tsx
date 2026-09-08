import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";
import { getPartners } from "@/helpers/next-fetch/partnerActions";
import { PartnerHero } from "@/features/partners/sections/partner-hero";
import { PartnerGrid } from "@/features/partners/components/partner-grid";
import { parsePartnerOffers } from "@/features/partners/query";
import { Handshake } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict?.PartnersPage?.Metadata || {};

  return buildMetadata({
    title: t.Title || "Our Partners — IFundAyiti",
    description:
      t.Description ||
      "Discover the dedicated organizations, institutions, and advocates partnering with IFundAyiti to empower grassroots Haitian entrepreneurs and innovators.",
    path: `/${lang}/partners`,
    keywords: [
      "IFundAyiti Partners",
      "Haiti NGO partners",
      "Haitian business sponsors",
      "microgrant co-funding Haiti",
      "Haiti community advocates",
    ],
  });
}

export default async function PartnersPage({
  params,
  searchParams,
}: PageProps) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;

  const page =
    typeof resolvedSearchParams?.page === "string"
      ? parseInt(resolvedSearchParams.page, 10)
      : 1;
  const searchTerm =
    typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";
  const offerFilter =
    typeof resolvedSearchParams?.offer === "string"
      ? resolvedSearchParams.offer
      : "all";

  const [partnersRes, dict] = await Promise.all([
    getPartners({
      page: isNaN(page) ? 1 : page,
      limit: 12,
      searchTerm,
    }),
    getDictionary(lang),
  ]);

  let partners =
    partnersRes.success && Array.isArray(partnersRes.data)
      ? partnersRes.data
      : [];

  // If offer category filter is selected, filter in memory
  if (offerFilter && offerFilter !== "all") {
    partners = partners.filter((p) => {
      const parsed = parsePartnerOffers(p.offers);
      return parsed.some(
        (o) => o.toLowerCase() === offerFilter.toLowerCase()
      );
    });
  }

  const pagination = partnersRes.pagination;

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <PartnerHero
        totalPartners={pagination?.total ?? partners.length}
        lang={lang}
        dict={dict}
      />

      {/* Main Partners Explorer */}
      <div className="mx-auto max-w-6xl px-6 pb-24">
        <PartnerGrid
          partners={partners}
          pagination={pagination}
          lang={lang}
          dict={dict}
        />

        {/* Bottom CTA Band */}
        <div className="mt-20 overflow-hidden rounded-3xl border border-forest/15 bg-linear-to-br from-forest to-forest-deep p-8 text-white shadow-xl sm:p-12">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-sand">
                <Handshake className="h-3.5 w-3.5" />
                Join the Coalition
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to amplify Haitian innovation with us?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Partner with IFundAyiti to co-fund grants, sponsor impactful events, or provide direct mentorship to community founders across Haiti.
              </p>
            </div>
            <div className="shrink-0">
              <Button
                asChild
                className="h-12 rounded-2xl bg-sand px-6 text-sm font-bold text-forest-deep shadow-md transition hover:bg-white"
              >
                <Link href={`/${lang}/contact`}>Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

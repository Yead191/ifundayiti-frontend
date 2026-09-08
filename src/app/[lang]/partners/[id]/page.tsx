import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Calendar,
  Sparkles,
  Share2,
} from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";
import { getImageUrl } from "@/lib/getImageUrl";
import { getPartnerById, getPartners } from "@/helpers/next-fetch/partnerActions";
import { parsePartnerOffers } from "@/features/partners/query";
import { PartnerCard } from "@/features/partners/components/partner-card";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const partnerRes = await getPartnerById(id);

  if (!partnerRes.success || !partnerRes.data) {
    return buildMetadata({
      title: "Partner Not Found — IFundAyiti",
      description: "The requested partner profile could not be found.",
      path: `/${lang}/partners/${id}`,
    });
  }

  const partner = partnerRes.data;

  return buildMetadata({
    title: `${partner.name} — IFundAyiti Partner`,
    description:
      partner.description ||
      `Learn about ${partner.name} and their collaboration with IFundAyiti to support grassroots entrepreneurs in Haiti.`,
    path: `/${lang}/partners/${id}`,
    keywords: [
      partner.name,
      "IFundAyiti partner",
      "Haiti business partner",
      "Haiti community grants",
    ],
  });
}

export default async function PartnerDetailPage({ params }: PageProps) {
  const { lang, id } = await params;

  const [partnerRes, othersRes, dict] = await Promise.all([
    getPartnerById(id),
    getPartners({ limit: 4 }),
    getDictionary(lang),
  ]);

  if (!partnerRes.success || !partnerRes.data) {
    notFound();
  }

  const partner = partnerRes.data;
  const logoSrc = getImageUrl(partner.image);
  const offers = parsePartnerOffers(partner.offers);

  const websiteUrl = partner.website
    ? partner.website.startsWith("http")
      ? partner.website
      : `https://${partner.website}`
    : null;

  // Filter out current partner from other partners
  const otherPartners = (
    othersRes.success && Array.isArray(othersRes.data) ? othersRes.data : []
  ).filter((p) => p._id !== partner._id).slice(0, 3);

  const joinedDate = partner.createdAt
    ? new Date(partner.createdAt).toLocaleDateString(lang === "ht" ? "ht-HT" : "en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-cream pt-28 pb-24 sm:pt-36">
      <div className="mx-auto max-w-6xl px-6">
        {/* Back Link & Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-mist">
          <Link
            href={`/${lang}/partners`}
            className="inline-flex items-center gap-1 text-forest hover:text-forest-deep hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Partners</span>
          </Link>
          <span>/</span>
          <span className="truncate text-forest-deep">{partner.name}</span>
        </div>

        {/* Partner Banner Card */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-hairline bg-white/90 p-6 shadow-[0_10px_35px_-15px_rgba(11,61,46,0.12)] backdrop-blur-md sm:p-10">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            {/* Logo & Name */}
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-hairline bg-sand-soft/60 p-3 shadow-2xs sm:h-28 sm:w-28">
                {logoSrc ? (
                  <Image
                    src={logoSrc}
                    alt={partner.name}
                    fill
                    sizes="112px"
                    className="object-contain p-2"
                  />
                ) : (
                  <span className="font-display text-2xl font-bold text-forest">
                    {partner.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-forest/20 bg-forest/8 px-2.5 py-0.5 text-xs font-bold text-forest">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Partner
                  </span>
                  {partner.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                      <Sparkles className="h-3 w-3 text-amber-600" />
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-forest-deep sm:text-3xl md:text-4xl">
                  {partner.name}
                </h1>

                {joinedDate && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-mist">
                    <Calendar className="h-3.5 w-3.5 text-forest/70" />
                    Partner since {joinedDate}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {websiteUrl && (
                <Button
                  asChild
                  className="h-11 rounded-xl bg-forest px-5 text-xs font-bold text-white shadow-md hover:bg-forest/90"
                >
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {partner.contactEmail && (
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-xl border-forest/20 px-4 text-xs font-semibold text-forest-deep hover:bg-sand-soft"
                >
                  <a
                    href={`mailto:${partner.contactEmail}`}
                    className="inline-flex items-center gap-1.5"
                  >
                    <Mail className="h-4 w-4 text-forest" />
                    <span>Email</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Mission & Profile Card */}
            <div className="rounded-3xl border border-hairline bg-white/85 p-6 shadow-2xs backdrop-blur-sm sm:p-8">
              <h2 className="font-display text-lg font-bold text-forest-deep sm:text-xl">
                Organization Profile & Mission
              </h2>
              <div className="mt-4 text-sm leading-relaxed text-mist whitespace-pre-line">
                {partner.description ||
                  `${partner.name} is proud to collaborate with IFundAyiti to expand opportunities, mentorship, and resources for local entrepreneurs and community projects in Haiti.`}
              </div>
            </div>

            {/* Partnership Scope & Offers */}
            <div className="rounded-3xl border border-hairline bg-white/85 p-6 shadow-2xs backdrop-blur-sm sm:p-8">
              <h2 className="font-display text-lg font-bold text-forest-deep sm:text-xl">
                Partnership Scope & Services
              </h2>
              <p className="mt-1 text-xs text-mist">
                Key collaborative focus areas and capabilities provided in conjunction with IFundAyiti.
              </p>

              {offers.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {offers.map((offer, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 rounded-2xl border border-forest/15 bg-sand-soft/60 px-3.5 py-2 text-xs font-semibold text-forest-deep shadow-2xs"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                      {offer}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-xs italic text-mist">
                  Active in community outreach, entrepreneurship advisory, and grassroots support.
                </p>
              )}
            </div>

            {/* Impact Callout */}
            <div className="rounded-3xl border border-forest/15 bg-linear-to-r from-forest/5 via-sand-soft/40 to-forest/5 p-6 sm:p-8">
              <div className="flex items-start gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest text-white">
                  <Building2 className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-forest-deep">
                    Empowering Community Innovation
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-mist">
                    Partners like {partner.name} enable IFundAyiti to deliver non-repayable microgrants, specialized training, and sustainable community solutions across Haiti’s 10 departments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact & Info Card */}
            <div className="rounded-3xl border border-hairline bg-white/85 p-6 shadow-2xs backdrop-blur-sm">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-forest-deep">
                Partner Details
              </h3>

              <div className="mt-4 divide-y divide-hairline text-xs">
                {websiteUrl && (
                  <div className="py-3">
                    <span className="font-medium text-mist">Website</span>
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 block truncate font-bold text-forest hover:underline"
                    >
                      {partner.website}
                    </a>
                  </div>
                )}

                {partner.contactEmail && (
                  <div className="py-3">
                    <span className="font-medium text-mist">Contact Email</span>
                    <a
                      href={`mailto:${partner.contactEmail}`}
                      className="mt-0.5 block truncate font-bold text-forest hover:underline"
                    >
                      {partner.contactEmail}
                    </a>
                  </div>
                )}

                {partner.contactPhone && (
                  <div className="py-3">
                    <span className="font-medium text-mist">Phone Number</span>
                    <a
                      href={`tel:${partner.contactPhone}`}
                      className="mt-0.5 block font-bold text-forest hover:underline"
                    >
                      {partner.contactPhone}
                    </a>
                  </div>
                )}

                <div className="py-3">
                  <span className="font-medium text-mist">Status</span>
                  <span className="mt-0.5 block font-bold text-emerald-800">
                    Active & Approved
                  </span>
                </div>
              </div>
            </div>

            {/* Partnership CTA card */}
            <div className="rounded-3xl border border-hairline bg-sand-soft/60 p-6 text-center shadow-2xs">
              <h4 className="font-display text-base font-bold text-forest-deep">
                Interested in Partnering?
              </h4>
              <p className="mt-1.5 text-xs text-mist leading-relaxed">
                Join our growing network of mission-aligned organizations making a real impact on Haitian businesses.
              </p>
              <Button
                asChild
                className="mt-4 w-full rounded-xl bg-forest text-xs font-bold text-white shadow-sm hover:bg-forest/90"
              >
                <Link href={`/${lang}/partners`}>Apply to Become a Partner</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Other Partners Section */}
        {otherPartners.length > 0 && (
          <div className="mt-20 border-t border-hairline pt-12">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-forest-deep sm:text-2xl">
                  More Trusted Partners
                </h3>
                <p className="text-xs text-mist">
                  Explore other organizations supporting IFundAyiti grantees.
                </p>
              </div>
              <Link
                href={`/${lang}/partners`}
                className="text-xs font-bold text-forest hover:underline"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherPartners.map((p) => (
                <PartnerCard key={p._id} partner={p} lang={lang} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

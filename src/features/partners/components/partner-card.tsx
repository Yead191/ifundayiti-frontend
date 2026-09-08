"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowUpRight, Sparkles, Building2 } from "lucide-react";

import type { Partner } from "@/types";
import { getImageUrl } from "@/lib/getImageUrl";
import { partnerHref, parsePartnerOffers } from "@/features/partners/query";

export function PartnerCard({
  partner,
  lang = "en",
}: {
  partner: Partner;
  lang?: string;
}) {
  const logoSrc = getImageUrl(partner.image);
  const detailHref = partnerHref(partner._id, lang);
  const offers = parsePartnerOffers(partner.offers);

  const websiteUrl = partner.website
    ? partner.website.startsWith("http")
      ? partner.website
      : `https://${partner.website}`
    : null;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-hairline bg-white/80 p-5 shadow-[0_4px_20px_-8px_rgba(11,61,46,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-forest/30 hover:bg-white hover:shadow-[0_16px_36px_-12px_rgba(11,61,46,0.18)]">
      {/* Top ambient highlight on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-forest/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div>
        {/* Header: Logo and Featured tag */}
        <div className="flex items-start justify-between gap-3">
          <Link
            href={detailHref}
            className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-hairline/80 bg-sand-soft/50 p-2 shadow-2xs transition-transform duration-300 group-hover:scale-105"
          >
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={partner.name}
                fill
                sizes="64px"
                className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="font-display text-lg font-bold text-forest">
                {partner.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </Link>

          {partner.featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/80 bg-amber-50/90 px-2.5 py-1 text-[11px] font-bold text-amber-800 shadow-2xs">
              <Sparkles className="h-3 w-3 text-amber-600" />
              Featured
            </span>
          )}
        </div>

        {/* Partner Name */}
        <div className="mt-4">
          <Link
            href={detailHref}
            className="group/title inline-block font-display text-lg font-bold text-forest-deep transition-colors hover:text-forest"
          >
            <span className="line-clamp-1">{partner.name}</span>
          </Link>

          {/* Partner Description */}
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-mist">
            {partner.description ||
              "Supporting the Haitian entrepreneurial ecosystem through collaborative resources and grassroots initiatives."}
          </p>
        </div>

        {/* Offers / Capabilities Chips */}
        {offers.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {offers.slice(0, 3).map((offer, idx) => (
              <span
                key={idx}
                className="rounded-lg border border-forest/15 bg-sand-soft/60 px-2 py-0.5 text-[10.5px] font-medium text-forest-deep"
              >
                {offer}
              </span>
            ))}
            {offers.length > 3 && (
              <span className="rounded-lg bg-cream px-1.5 py-0.5 text-[10.5px] font-medium text-faint">
                +{offers.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-hairline/70 pt-3.5">
        {websiteUrl ? (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:text-forest-deep hover:underline"
          >
            <span>Website</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-faint">
            <Building2 className="h-3 w-3" />
            Partner
          </span>
        )}

        <Link
          href={detailHref}
          className="inline-flex items-center gap-1 rounded-xl bg-forest/8 px-3 py-1.5 text-xs font-bold text-forest transition-colors hover:bg-forest hover:text-white"
        >
          <span>View Profile</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

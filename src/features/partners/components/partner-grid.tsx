"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Sparkles } from "lucide-react";

import type { Partner, Pagination } from "@/types";
import { Reveal } from "@/components/ui/reveal";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { getImageUrl } from "@/lib/getImageUrl";
import { partnerHref, buildPartnersHref } from "@/features/partners/query";

export function PartnerGrid({
  partners,
  pagination,
  lang = "en",
  dict,
}: {
  partners: Partner[];
  pagination?: Pagination;
  lang?: string;
  dict?: any;
}) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.replace(
      buildPartnersHref(
        page,
        pagination?.limit || 20,
        undefined,
        undefined,
        lang,
      ),
      { scroll: true },
    );
  };

  const tEmpty = dict?.PartnersPage?.Empty || {};

  if (partners.length === 0) {
    return (
      <div className="mt-12 rounded-3xl border border-dashed border-forest/20 bg-white/60 px-6 py-16 text-center backdrop-blur-sm">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sand-soft text-forest">
          <Building2 className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-display text-xl font-bold text-forest-deep">
          {tEmpty.Title || "No partners found"}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-mist">
          {tEmpty.Description ||
            "Check back soon — new community and organization partners are added regularly."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Sub-header with total partners count */}
      {pagination?.total != null && (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-forest/80">
            {pagination.total} {pagination.total === 1 ? "Partner" : "Partners"}
          </p>
        </div>
      )}

      {/* Grid of Logo Tiles */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
        {partners.map((partner, i) => (
          <Reveal key={partner._id} delay={Math.min(i * 35, 200)}>
            <PartnerLogoCard partner={partner} lang={lang} />
          </Reveal>
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPage > 1 && (
        <div className="mt-12">
          <PaginationControls
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

function PartnerLogoCard({
  partner,
  lang = "en",
}: {
  partner: Partner;
  lang?: string;
}) {
  const src = getImageUrl(partner.image);
  const href = partnerHref(partner._id, lang);

  return (
    <Link
      href={href}
      className="group relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-hairline/80 bg-white/85 p-6 shadow-[0_4px_20px_-8px_rgba(11,61,46,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-forest/40 hover:bg-white hover:shadow-[0_20px_40px_-12px_rgba(11,61,46,0.2)] sm:rounded-3xl"
    >
      {/* Featured spark pill */}
      {partner.featured && (
        <span className="absolute right-3 top-3 z-10 grid h-6 w-6 place-items-center rounded-full bg-amber-50 border border-amber-300 text-amber-600 shadow-2xs">
          <Sparkles className="h-3 w-3" />
        </span>
      )}

      {/* Ambient gradient line on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-forest/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Main Logo Container */}
      <div className="relative flex h-full w-full items-center justify-center">
        {src ? (
          <div className="relative h-20 w-full max-w-35 sm:h-24 sm:max-w-40">
            <Image
              src={src}
              alt={partner.name}
              fill
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 240px"
              className="object-contain opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
            />
          </div>
        ) : (
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-sand-soft font-display text-xl font-bold text-forest sm:h-20 sm:w-20 sm:text-2xl">
            {partner.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Slide-up Name Overlay on Hover */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-forest-deep/95 via-forest-deep/85 to-transparent px-3 pb-3.5 pt-8 text-center text-xs font-bold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:text-sm">
        <span className="line-clamp-1">{partner.name}</span>
      </span>
    </Link>
  );
}

export function PartnerCardsSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square animate-pulse rounded-2xl border border-hairline bg-white/60 sm:rounded-3xl"
        />
      ))}
    </div>
  );
}

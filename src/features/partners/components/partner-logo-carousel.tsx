"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import type { PartnerLogo } from "@/types";
import { getImageUrl } from "@/lib/getImageUrl";
import { partnerHref } from "@/features/partners/query";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";

/** Repeat logos so one strip is wide enough to scroll smoothly on large screens. */
function buildMarqueeStrip(logos: PartnerLogo[], minItems = 8): PartnerLogo[] {
  if (logos.length === 0) return [];
  const repeats = Math.max(1, Math.ceil(minItems / logos.length));
  return Array.from({ length: repeats }, () => logos).flat();
}

/** Infinite marquee of partner logos — pauses on hover; click opens detail. */
export function PartnerLogoCarousel({
  logos,
  lang = "en",
  dict,
}: {
  logos: PartnerLogo[];
  lang?: string;
  dict?: any;
}) {
  const [paused, setPaused] = React.useState(false);
  const strip = React.useMemo(
    () => (logos && logos.length > 0 ? buildMarqueeStrip(logos) : []),
    [logos]
  );
  const duration = `${Math.max(strip.length * 4.5, 26)}s`;

  if (!logos || logos.length === 0) return null;

  const t = dict?.PartnersPage?.Carousel || {};

  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      {/* Soft gradient edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-cream via-cream/80 to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-cream via-cream/80 to-transparent sm:w-28" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow={t.Eyebrow || "Partners"}
            title={t.Title || "Meet Our Trusted Partners"}
            subtitle={
              t.Subtitle ||
              "Discover the businesses, foundations, and professionals supporting Haitian entrepreneurs with valuable resources, expertise, and community impact."
            }
            align="center"
          />
        </Reveal>
      </div>

      <div
        className="relative mt-12 overflow-hidden py-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div
          className="partner-marquee-track"
          data-paused={paused ? "true" : "false"}
          style={
            {
              "--partner-marquee-duration": duration,
            } as React.CSSProperties
          }
        >
          <MarqueeStrip logos={strip} lang={lang} ariaHidden={false} />
          <MarqueeStrip logos={strip} lang={lang} ariaHidden />
        </div>
      </div>

      {/* Link to view all partners */}
      <div className="relative mx-auto mt-8 flex justify-center">
        <Link
          href={`/${lang}/partners`}
          className="inline-flex items-center gap-1.5 rounded-full border border-forest/20 bg-white/80 px-5 py-2 text-xs font-bold text-forest shadow-2xs backdrop-blur-sm transition-all duration-300 hover:border-forest/40 hover:bg-forest hover:text-white hover:shadow-md"
        >
          <span>Explore All Partners</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}

function MarqueeStrip({
  logos,
  lang,
  ariaHidden = false,
}: {
  logos: PartnerLogo[];
  lang: string;
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-5 pr-5 sm:gap-6 sm:pr-6"
      aria-hidden={ariaHidden || undefined}
    >
      {logos.map((logo, index) => (
        <PartnerLogoTile
          key={`${logo._id}-${index}`}
          partner={logo}
          lang={lang}
          tabIndex={ariaHidden ? -1 : undefined}
        />
      ))}
    </div>
  );
}

function PartnerLogoTile({
  partner,
  lang,
  tabIndex,
}: {
  partner: PartnerLogo;
  lang: string;
  tabIndex?: number;
}) {
  const src = getImageUrl(partner.image);
  const href = partnerHref(partner._id, lang);

  return (
    <Link
      href={href}
      tabIndex={tabIndex}
      className="group relative flex h-24 w-40 shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-hairline bg-white/90 px-4 py-3 shadow-[0_4px_16px_-6px_rgba(11,61,46,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-forest/35 hover:bg-white hover:shadow-[0_16px_36px_-10px_rgba(11,61,46,0.22)] sm:h-28 sm:w-48"
    >
      <div className="relative h-12 w-full sm:h-14">
        {src ? (
          <Image
            src={src}
            alt={partner.name}
            fill
            sizes="192px"
            className="object-contain p-1 opacity-85 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : (
          <span className="grid h-full place-items-center font-display text-base font-bold text-forest">
            {partner.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Slide-up partner name overlay on hover */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-forest-deep/95 via-forest-deep/85 to-transparent px-2.5 pb-2.5 pt-6 text-center text-[11px] font-bold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <span className="line-clamp-1">{partner.name}</span>
      </span>
    </Link>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  MapPin,
  Calendar,
  Images,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react";
import type { GalleryFolder } from "@/helpers/next-fetch/galleryActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { Reveal } from "@/components/ui/reveal";

interface FeaturedSpotlightProps {
  folders: GalleryFolder[];
  lang?: string;
  dict?: any;
}

export function FeaturedSpotlight({
  folders = [],
  lang = "en",
  dict,
}: FeaturedSpotlightProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!folders || folders.length === 0) return null;

  const activeFolder = folders[currentIndex] || folders[0];
  const coverUrl = activeFolder.image ? getImageUrl(activeFolder.image) : null;

  const displayDate = activeFolder.date || activeFolder.createdAt;
  const formattedDate = displayDate
    ? new Date(displayDate).toLocaleDateString(
        lang === "ht" ? "fr-HT" : "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        },
      )
    : null;

  const count = activeFolder.galleryCount ?? 0;
  const countText =
    count === 1
      ? dict?.GalleryPage?.PhotoSingle || "1 Photo"
      : `${count} ${dict?.GalleryPage?.PhotoPlural || "Photos"}`;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : folders.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < folders.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="mb-12 w-full">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-forest/15 bg-linear-to-br from-forest-deep via-[#0d4736] to-[#07241b] text-white shadow-xl">
          {/* Ambient Lighting Background */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="aurora -top-20 -left-20 h-96 w-96 opacity-30" />
            <div className="aurora -bottom-20 -right-20 h-96 w-96 opacity-20" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: Cover Image Viewport */}
            <div className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] lg:col-span-7 overflow-hidden bg-black/40">
              {coverUrl ? (
                <>
                  <Image
                    src={coverUrl}
                    alt={activeFolder.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent lg:bg-linear-to-r lg:from-transparent lg:to-[#07241b]/90 pointer-events-none" />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-forest/30 p-8 text-center">
                  <Images className="h-16 w-16 text-sand/40 animate-pulse" />
                </div>
              )}

              {/* Floating Spotlight Badge */}
              <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-black/60 px-3.5 py-1.5 text-xs font-bold text-amber-300 shadow-md backdrop-blur-md">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                <span className="uppercase tracking-wider">
                  {dict?.GalleryPage?.Spotlight || "Featured Album"}
                </span>
              </div>

              {/* Photo Count Badge on Image */}
              <div className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                <Images className="h-3.5 w-3.5 text-sand" />
                <span>{countText}</span>
              </div>
            </div>

            {/* Right: Album Story Details & CTA */}
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 lg:col-span-5">
              <div className="space-y-4">
                {/* Meta Row: Category, Location, Date */}
                <div className="flex flex-wrap items-center gap-2">
                  {activeFolder.category && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-sand-soft backdrop-blur-sm border border-white/10">
                      <Tag className="h-3 w-3 text-sand" />
                      <span>{activeFolder.category}</span>
                    </span>
                  )}

                  {activeFolder.location && (
                    <span className="inline-flex items-center gap-1 text-xs text-white/80">
                      <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{activeFolder.location}</span>
                    </span>
                  )}

                  {formattedDate && (
                    <span className="inline-flex items-center gap-1 text-xs text-white/60">
                      <Calendar className="h-3.5 w-3.5 text-white/60" />
                      <span>{formattedDate}</span>
                    </span>
                  )}
                </div>

                {/* Album Title */}
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  {activeFolder.name}
                </h2>

                {/* Album Description Narrative */}
                {activeFolder.description && (
                  <p className="text-sm sm:text-base text-white/80 line-clamp-3 leading-relaxed">
                    {activeFolder.description}
                  </p>
                )}
              </div>

              {/* Action Buttons & Carousel Navigation */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                <Link
                  href={`/${lang}/gallery/${activeFolder._id || activeFolder.id}`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-forest-deep shadow-lg hover:bg-amber-300 transition-all hover:scale-102"
                >
                  <span>{dict?.GalleryPage?.ExploreAlbum || "Explore Album"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Carousel Controls if multiple featured albums */}
                {folders.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60 font-semibold mr-1">
                      {currentIndex + 1} / {folders.length}
                    </span>

                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous featured album"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next featured album"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export default FeaturedSpotlight;

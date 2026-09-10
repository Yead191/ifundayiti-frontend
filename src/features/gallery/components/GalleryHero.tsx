"use client";

import React from "react";
import Link from "next/link";
import { Camera, ArrowLeft } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";

interface GalleryHeroProps {
  currentFolder?: {
    _id: string;
    name: string;
    galleryCount?: number;
  } | null;
  totalFolders?: number;
  totalPhotos?: number;
  lang?: string;
  dict?: any;
}

export function GalleryHero({
  currentFolder,
  lang = "en",
  dict,
}: GalleryHeroProps) {
  const t = dict?.GalleryPage;
  const isInsideFolder = Boolean(currentFolder);

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-sand-soft/80 via-cream to-cream pb-16 pt-28 md:pb-20 md:pt-36 border-b border-hairline/60">
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-full -translate-x-1/2 overflow-hidden">
        <div className="aurora -top-24 left-1/3 h-80 w-xl opacity-30" />
        <div className="aurora top-20 right-1/4 h-72 w-96 opacity-20" />
      </div>

      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Top Breadcrumb / Eyebrow */}
          <Reveal>
            {isInsideFolder ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white/90 px-4 py-1.5 shadow-2xs backdrop-blur-md">
                <Link
                  href={`/${lang}/gallery`}
                  scroll={false}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-forest transition-colors hover:text-forest-deep"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{t?.BackToFolders || "All Albums"}</span>
                </Link>
                <span className="text-mist/40">/</span>
                <span className="text-xs font-bold text-forest-deep truncate max-w-50 sm:max-w-xs">
                  {currentFolder?.name}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/80 px-4 py-1.5 shadow-2xs backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-forest-bright animate-pulse" />
                <Camera className="h-3.5 w-3.5 text-forest" />
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  {t?.Hero?.Eyebrow || "Field Archives · Community Impact"}
                </span>
              </div>
            )}
          </Reveal>

          {/* Main Title */}
          <Reveal delay={80}>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-forest-deep sm:text-5xl md:text-6xl md:leading-[1.12]">
              {isInsideFolder ? (
                <>
                  <span className="block text-xl sm:text-2xl font-semibold text-mist uppercase tracking-widest mb-2">
                    {t?.AlbumLabel || "Field Album"}
                  </span>
                  <span>{currentFolder?.name}</span>
                </>
              ) : (
                <>
                  <span>{t?.Hero?.TitlePrefix || "Moments of "}</span>
                  <span className="text-gradient">
                    {t?.Hero?.TitleHighlight || "Grassroots Impact"}
                  </span>
                </>
              )}
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay={140}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              {isInsideFolder
                ? t?.AlbumSubtitle ||
                  "Verified photographs documenting local progress, community work, and beneficiaries in this project album."
                : t?.Hero?.Subtitle ||
                  "Explore authentic field photographs of community projects, grant ceremonies, workshops, and local builders creating sustainable futures across Haiti."}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

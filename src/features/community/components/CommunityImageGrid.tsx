"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import { Modal } from "@/components/ui/modal";

interface CommunityImageGridProps {
  images?: string[];
  postTitle?: string;
}

export function CommunityImageGrid({
  images,
  postTitle = "Announcement image",
}: CommunityImageGridProps) {
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const validImages = images
    .map((img) => getImageUrl(img))
    .filter((url): url is string => Boolean(url));

  if (validImages.length === 0) return null;

  const handleOpen = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx(idx);
  };

  const handleClose = () => setActiveIdx(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((activeIdx - 1 + validImages.length) % validImages.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((activeIdx + 1) % validImages.length);
    }
  };

  return (
    <>
      {/* 1 IMAGE */}
      {validImages.length === 1 && (
        <div
          onClick={(e) => handleOpen(e, 0)}
          className="group relative mt-3.5 aspect-video w-full max-h-96 overflow-hidden rounded-2xl bg-sand-soft border border-hairline/80 cursor-pointer shadow-xs"
        >
          <Image
            src={validImages[0]}
            alt={postTitle}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-103"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/50 text-white p-2 backdrop-blur-xs">
              <Maximize2 className="h-4 w-4" />
            </span>
          </div>
        </div>
      )}

      {/* 2 IMAGES */}
      {validImages.length === 2 && (
        <div className="mt-3.5 grid grid-cols-2 gap-2 overflow-hidden rounded-2xl">
          {validImages.map((src, idx) => (
            <div
              key={idx}
              onClick={(e) => handleOpen(e, idx)}
              className="group relative aspect-4/3 overflow-hidden bg-sand-soft border border-hairline/80 cursor-pointer"
            >
              <Image
                src={src}
                alt={`${postTitle} preview ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 400px"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/50 text-white p-1.5 backdrop-blur-xs">
                  <Maximize2 className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3 IMAGES */}
      {validImages.length === 3 && (
        <div className="mt-0.5 grid grid-cols-3 gap-2 overflow-hidden rounded-2xl">
          {validImages.map((src, idx) => (
            <div
              key={idx}
              onClick={(e) => handleOpen(e, idx)}
              className="group relative aspect-square overflow-hidden bg-sand-soft border border-hairline/80 cursor-pointer"
            >
              <Image
                src={src}
                alt={`${postTitle} preview ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 33vw, 280px"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/50 text-white p-1.5 backdrop-blur-xs">
                  <Maximize2 className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4+ IMAGES */}
      {validImages.length >= 4 && (
        <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 overflow-hidden rounded-2xl">
          {validImages.slice(0, 4).map((src, idx) => {
            const isLast = idx === 3 && validImages.length > 4;
            const extraCount = validImages.length - 4;

            return (
              <div
                key={idx}
                onClick={(e) => handleOpen(e, idx)}
                className="group relative aspect-square overflow-hidden bg-sand-soft border border-hairline/80 cursor-pointer"
              >
                <Image
                  src={src}
                  alt={`${postTitle} preview ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 200px"
                />
                {isLast ? (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center text-white font-bold text-base">
                    +{extraCount} more
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/50 text-white p-1.5 backdrop-blur-xs">
                      <Maximize2 className="h-3.5 w-3.5" />
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activeIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all animate-in fade-in"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close preview"
            className="absolute right-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Navigation Arrows */}
          {validImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 transition cursor-pointer"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 transition cursor-pointer"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Active Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-[85vh] w-[90vw] max-w-5xl"
          >
            <Image
              src={validImages[activeIdx]}
              alt={`${postTitle} enlarged view`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Counter pill */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {activeIdx + 1} / {validImages.length}
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";

interface ProjectGalleryLightboxProps {
  gallery: string[];
  projectName: string;
  lang: string;
  title?: string;
}

export function ProjectGalleryLightbox({
  gallery,
  projectName,
  lang,
  title,
}: ProjectGalleryLightboxProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!gallery || gallery.length === 0) return null;

  const images = gallery.map((item) => getImageUrl(item) || "");

  const handleOpen = (idx: number) => setActiveIdx(idx);
  const handleClose = () => setActiveIdx(null);
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((activeIdx - 1 + images.length) % images.length);
    }
  };
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((activeIdx + 1) % images.length);
    }
  };

  return (
    <section className="border-t border-hairline pt-10">
      <div className="flex items-center gap-2 mb-6">
        <Camera className="h-5 w-5 text-forest" />
        <h2 className="font-display text-2xl font-bold text-forest-deep">
          {title || (lang === "ht" ? "Galri Foto Pwojè a" : "Project Gallery")}
        </h2>
        <span className="ml-2 rounded-full bg-sand-soft px-2.5 py-0.5 text-xs font-semibold text-mist">
          {images.length}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((src, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleOpen(idx)}
            className="group relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-sand-soft border border-hairline focus:outline-none focus:ring-2 focus:ring-forest cursor-pointer"
          >
            <Image
              src={src}
              alt={`${projectName} photo ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-108"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-white/85 p-2 text-forest-deep shadow-md">
                <Maximize2 className="h-4 w-4" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeIdx !== null && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] max-w-4xl w-full aspect-16/10 overflow-hidden rounded-2xl bg-black"
          >
            <Image
              src={images[activeIdx]}
              alt={`${projectName} lightbox preview`}
              fill
              priority
              className="object-contain"
            />
            <div className="absolute bottom-3 left-4 rounded-md bg-black/60 px-3 py-1 text-xs text-sand backdrop-blur-md">
              {activeIdx + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

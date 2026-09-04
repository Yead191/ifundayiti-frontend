"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import { ProductLightboxModal } from "./ProductLightboxModal";

interface ProductGalleryProps {
  productName: string;
  images: string[];
  hasDiscount?: boolean;
  discountPercent?: number;
  saleBadgeText?: string;
}

export function ProductGallery({
  productName,
  images,
  hasDiscount = false,
  discountPercent = 0,
  saleBadgeText = "OFF",
}: ProductGalleryProps) {
  const [activeImgIdx, setActiveImgIdx] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  const safeImages = images.length > 0 ? images : ["/images/placeholder.webp"];
  const activeRaw = safeImages[activeImgIdx] || safeImages[0] || "";
  const activeImage = getImageUrl(activeRaw) || activeRaw;

  const onPrev = React.useCallback(() => {
    setActiveImgIdx((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  }, [safeImages.length]);

  const onNext = React.useCallback(() => {
    setActiveImgIdx((prev) => (prev + 1) % safeImages.length);
  }, [safeImages.length]);

  return (
    <>
      <div className="flex flex-col-reverse gap-4 sm:flex-row">
        {/* Thumbnails strip */}
        {safeImages.length > 1 && (
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-145 scrollbar-none py-1 px-1">
            {safeImages.map((img, idx) => {
              const resolved = getImageUrl(img) || img;
              const isSelected = activeImgIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImgIdx(idx)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                    isSelected
                      ? "border-forest shadow-md ring-2 ring-forest/20 scale-105"
                      : "border-hairline/80 opacity-70 hover:opacity-100 hover:border-forest/40"
                  }`}
                >
                  <Image
                    src={resolved}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Main Image Viewport */}
        <div className="relative aspect-3/4 flex-1 overflow-hidden rounded-3xl border border-hairline bg-sand-soft shadow-md group">
          <Image
            src={activeImage}
            alt={productName}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
            sizes="(max-width: 1024px) 100vw, 60vw"
          />

          {/* High-Contrast Discount Badge */}
          {hasDiscount && (
            <div className="absolute left-4 top-4 z-10">
              <span className="inline-flex items-center rounded-full bg-[#b91c1c] px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-lg border border-white/25">
                −{discountPercent}% {saleBadgeText}
              </span>
            </div>
          )}

          {/* Zoom Trigger Button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Zoom image"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-2xl bg-white/90 text-forest-deep shadow-md backdrop-blur-md transition-colors hover:bg-forest hover:text-white z-10"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          {/* Navigation Chevrons */}
          {safeImages.length > 1 && (
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous image"
                className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-white/85 text-forest-deep shadow-md backdrop-blur-sm transition-colors hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Next image"
                className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-white/85 text-forest-deep shadow-md backdrop-blur-sm transition-colors hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <ProductLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        productName={productName}
        images={safeImages}
        activeImgIdx={activeImgIdx}
        onSelectImage={(idx) => setActiveImgIdx(idx)}
        onPrev={onPrev}
        onNext={onNext}
      />
    </>
  );
}

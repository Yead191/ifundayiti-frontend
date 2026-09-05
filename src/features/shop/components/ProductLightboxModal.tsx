"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";

interface ProductLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  images: string[];
  activeImgIdx: number;
  onSelectImage: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function ProductLightboxModal({
  isOpen,
  onClose,
  productName,
  images,
  activeImgIdx,
  onSelectImage,
  onPrev,
  onNext,
}: ProductLightboxModalProps) {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onPrev, onNext, onClose]);

  if (!isOpen) return null;

  const currentImg = images[activeImgIdx] || images[0] || "";
  const resolvedActive = getImageUrl(currentImg) || currentImg;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-forest-deep/95 backdrop-blur-2xl p-4 sm:p-6 animate-in fade-in"
    >
      {/* Top Bar with Counter and Close Button */}
      <div className="w-full flex items-center justify-between z-20">
        <span className="text-xs font-bold uppercase tracking-widest text-sand/80">
          {productName} ({activeImgIdx + 1} / {images.length})
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative flex-1 w-full max-w-5xl my-4 flex items-center justify-center">
        <div className="relative h-[65vh] sm:h-[75vh] w-full max-w-4xl overflow-hidden rounded-2xl sm:rounded-3xl">
          <Image
            src={resolvedActive}
            alt={productName}
            fill
            priority
            className="object-contain"
            sizes="(max-width: 1200px) 95vw, 1200px"
          />
        </div>

        {/* Navigation Chevrons */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous image"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/70 z-20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next image"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/70 z-20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnail Navigation Strip */}
      {images.length > 1 && (
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto lg:overflow-x-hidden flex-nowrap max-w-full pb-2 z-20">
          {images.map((img, idx) => {
            const resolved = getImageUrl(img) || img;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectImage(idx)}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  activeImgIdx === idx
                    ? "border-sand shadow-md scale-105"
                    : "border-white/20 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={resolved}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

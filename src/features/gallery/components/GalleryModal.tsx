"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Info,
  MapPin,
  Calendar,
  Star,
  ExternalLink,
  Share2,
  Check,
  Tag as TagIcon,
} from "lucide-react";
import type { Item } from "./Masonry";
import Image from "next/image";

interface GalleryModalProps {
  item: Item | null;
  items: Item[];
  onClose: () => void;
  onSelect: (item: Item) => void;
  lang: string;
  dict?: any;
}

export function GalleryModal({
  item,
  items,
  onClose,
  onSelect,
  lang,
  dict,
}: GalleryModalProps) {
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showDetails, setShowDetails] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const t = dict?.GalleryPage?.Modal;

  const currentIndex = items.findIndex((i) => i.id === item?.id);

  // Reset zoom & pan when image changes
  const resetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handlePrev = useCallback(() => {
    resetZoom();
    if (currentIndex > 0) {
      onSelect(items[currentIndex - 1]);
    } else {
      onSelect(items[items.length - 1]);
    }
  }, [currentIndex, items, onSelect, resetZoom]);

  const handleNext = useCallback(() => {
    resetZoom();
    if (currentIndex < items.length - 1) {
      onSelect(items[currentIndex + 1]);
    } else {
      onSelect(items[0]);
    }
  }, [currentIndex, items, onSelect, resetZoom]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3.5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleToggleZoom = () => {
    if (zoom > 1) {
      resetZoom();
    } else {
      setZoom(2);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoom > 1) {
          resetZoom();
        } else {
          onClose();
        }
      }
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
      if (e.key === "0") resetZoom();
      if (e.key === "i" || e.key === "I") setShowDetails((prev) => !prev);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose, handlePrev, handleNext, zoom, resetZoom]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (item) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [item]);

  // Reset zoom on unmount or item change
  useEffect(() => {
    resetZoom();
  }, [item?.id, resetZoom]);

  if (!item) return null;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Mouse pan handlers when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const raw = item.rawItem || {};
  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString(
        lang === "ht" ? "ht-HT" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )
    : null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex h-screen w-screen flex-col bg-black select-none animate-in fade-in duration-200"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      role="dialog"
      aria-modal="true"
    >
      {/* Top Controls Bar (Facebook Style) */}
      <div className="absolute top-0 inset-x-0 z-40 flex items-center justify-between p-4 sm:p-5 bg-linear-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
        {/* Left Side: Close Button & Counter */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label={t?.Close || "Close preview"}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer backdrop-blur-md"
          >
            <X className="h-5 w-5" />
          </button>

          {items.length > 1 && (
            <span className="text-xs sm:text-sm font-semibold text-white/80 tracking-wide">
              {currentIndex + 1} / {items.length}
            </span>
          )}
        </div>

        {/* Right Side: Zoom, Fullscreen, Info Toggle & Share */}
        <div className="flex items-center gap-2">
          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 3.5}
            title="Zoom In (+)"
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer backdrop-blur-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            title="Zoom Out (-)"
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer backdrop-blur-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Reset Zoom indicator (shows when zoomed) */}
          {zoom > 1 && (
            <button
              type="button"
              onClick={resetZoom}
              title="Reset Zoom (0)"
              className="flex h-10 px-3 items-center gap-1.5 rounded-full bg-forest/80 text-white hover:bg-forest transition-all cursor-pointer backdrop-blur-md text-xs font-bold"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{Math.round(zoom * 100)}%</span>
            </button>
          )}

          {/* Toggle Details Panel */}
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            title={showDetails ? "Hide Details" : "Show Details"}
            className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all cursor-pointer backdrop-blur-md ${
              showDetails
                ? "bg-forest text-white shadow-sm"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Info className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen"
            className="hidden sm:flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer backdrop-blur-md"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Fullscreen Viewer Canvas */}
      <div
        className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden cursor-default"
        onMouseDown={handleMouseDown}
      >
        <div
          className="relative flex items-center justify-center w-full h-full"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
              position.y / zoom
            }px)`,
            transition: isDragging
              ? "none"
              : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
          }}
          onDoubleClick={handleToggleZoom}
        >
          <Image
            src={item.img}
            alt={item.title || "Community photo"}
            draggable={false}
            width={1000}
            height={1000}
            className="max-h-[92vh] max-w-[96vw] w-auto h-auto object-contain select-none drop-shadow-2xl"
          />
        </div>

        {/* Navigation Arrow: Prev */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous photo"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-black/50 text-white hover:bg-white/25 hover:scale-110 border border-white/10 backdrop-blur-md transition-all cursor-pointer shadow-lg"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        )}

        {/* Navigation Arrow: Next */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next photo"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-black/50 text-white hover:bg-white/25 hover:scale-110 border border-white/10 backdrop-blur-md transition-all cursor-pointer shadow-lg"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
        )}
      </div>

      {/* Floating Bottom Details Overlay (Facebook Style) */}
      <div
        className={`absolute bottom-0 inset-x-0 z-30 transition-all duration-300 pointer-events-auto ${
          showDetails
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <div className="bg-linear-to-t from-black/95 via-black/75 to-transparent pt-16 pb-6 px-6 sm:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              {/* Left Column: Title, Metadata, Description */}
              <div className="space-y-2 max-w-3xl">
                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2">
                  {item.category && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 border border-white/20 px-3 py-0.5 text-xs font-semibold text-white/95 backdrop-blur-md">
                      <TagIcon className="h-3 w-3 text-sand" />
                      <span>{item.category}</span>
                    </span>
                  )}

                  {item.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-400/40 px-3 py-0.5 text-xs font-semibold text-amber-300">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{t?.Spotlight || "Spotlight"}</span>
                    </span>
                  )}

                  {item.location && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80">
                      <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{item.location}</span>
                    </span>
                  )}

                  {formattedDate && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60">
                      <Calendar className="h-3.5 w-3.5 text-white/60" />
                      <span>{formattedDate}</span>
                    </span>
                  )}
                </div>

                {/* Photo Title */}
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md">
                  {item.title || "Community Field Capture"}
                </h2>

                {/* Description / Field Note */}
                {raw.description && (
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-2xl drop-shadow-sm">
                    {raw.description}
                  </p>
                )}
              </div>

              {/* Right Column: Actions (Original Resolution & Share) */}
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-end">
                <a
                  href={item.img}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/25 transition-colors backdrop-blur-md"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>{t?.ViewOriginal || "Full Resolution"}</span>
                </a>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/25 transition-colors backdrop-blur-md cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">
                        {t?.Copied || "Link Copied!"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5" />
                      <span>{t?.Share || "Share"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GalleryModal;

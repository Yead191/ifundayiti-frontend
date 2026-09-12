"use client";

import React from "react";
import Link from "next/link";
import {
  Images,
  Folder as FolderIcon,
  ArrowRight,
  Calendar,
  MapPin,
  Star,
  Tag,
} from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import Image from "next/image";

export interface FolderProps {
  id?: string;
  name?: string;
  description?: string;
  image?: string; // Optional cover photo
  category?: string;
  location?: string;
  date?: string;
  featured?: boolean;
  galleryCount?: number;
  createdAt?: string;
  href?: string;
  color?: string; // Default primary: #0B3D2E
  size?: number;
  items?: React.ReactNode[];
  className?: string;
  onClick?: () => void;
  lang?: string;
  dict?: any;
}

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(color.slice(0, 6), 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
};

/**
 * Visual 3D Folder Icon with subtle hover peek animation
 * (If cover image is supplied, the top peeking sheet showcases the real photograph print)
 */
export const FolderVisual: React.FC<{
  color?: string;
  size?: number;
  className?: string;
  items?: React.ReactNode[];
  image?: string;
}> = ({
  color = "#0B3D2E",
  size = 1.05,
  className = "",
  items = [],
  image,
}) => {
  const folderBackColor = darkenColor(color, 0.15);
  const paper1 = "#FAF6F0";
  const paper2 = "#F5EFE6";
  const paper3 = "#FFFFFF";

  const resolvedImg = image ? getImageUrl(image) : null;

  const papers = [items[0] || null, items[1] || null, items[2] || null];

  return (
    <div
      style={{ transform: `scale(${size})` }}
      className={`relative inline-block select-none ${className}`}
    >
      <div className="relative w-29 h-21.5 transition-transform duration-300 ease-out group-hover:-translate-y-1">
        {/* Back Folder Wall */}
        <div
          className="relative w-full h-full rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] shadow-sm"
          style={{ backgroundColor: folderBackColor }}
        >
          {/* Top Folder Tab */}
          <span
            className="absolute bottom-[98%] left-0 w-10.5 h-3 rounded-tl-[6px] rounded-tr-[6px]"
            style={{ backgroundColor: folderBackColor }}
          />

          {/* Paper Sheets / Photo Print peeking out */}
          {papers.map((customItem, i) => {
            let widthClasses = "w-[76%] h-[74%]";
            if (i === 1) widthClasses = "w-[82%] h-[68%]";
            if (i === 2) widthClasses = "w-[88%] h-[60%]";

            const bgColor = i === 0 ? paper1 : i === 1 ? paper2 : paper3;

            return (
              <div
                key={i}
                className={`absolute z-20 bottom-[10%] left-1/2 -translate-x-1/2 rounded-[6px] border border-black/5 shadow-xs transition-all duration-300 ease-out group-hover:-translate-y-2.5 overflow-hidden ${widthClasses}`}
                style={{
                  backgroundColor: bgColor,
                  transformOrigin: "bottom center",
                }}
              >
                {/* If first paper and cover image exists: render authentic photograph print */}
                {i === 0 && resolvedImg ? (
                  <div className="h-full w-full relative bg-neutral-900">
                    <img
                      src={resolvedImg}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  customItem || (
                    <div className="h-full w-full p-1.5 flex flex-col justify-between opacity-50">
                      <div className="h-1 w-2/3 rounded-full bg-mist/30" />
                      <div className="h-1 w-full rounded-full bg-mist/20" />
                      <div className="h-1 w-4/5 rounded-full bg-mist/20" />
                    </div>
                  )
                )}
              </div>
            );
          })}

          {/* Front Folder Cover (Angled Front Flap) */}
          <div
            className="absolute z-30 inset-x-0 bottom-0 h-[82%] rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] rounded-tl-lg shadow-inner transition-all duration-300 ease-out origin-bottom group-hover:transform-[skew(-6deg)_scaleY(0.92)]"
            style={{
              backgroundColor: color,
              backgroundImage:
                "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.15) 100%)",
            }}
          >
            {/* Subtle Folder Lip Accent */}
            <div className="absolute top-0 inset-x-0 h-0.5 bg-white/25 rounded-t" />
            <div className="absolute bottom-2 right-2.5 opacity-30">
              <Images className="h-3.5 w-3.5 text-sand" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Folder Component:
 * - If `image` is provided: Renders a luxury photo album card with cover viewport,
 *   floating badges, smooth hover zoom, and folder metadata.
 * - If `image` is not provided: Gracefully falls back to the 3D `FolderVisual`.
 * - Clicking navigates smoothly without full-page reloads or jumping.
 */
export const Folder: React.FC<FolderProps> = ({
  id,
  name,
  description,
  image,
  category,
  location,
  date,
  featured = false,
  galleryCount = 0,
  createdAt,
  href,
  color = "#0B3D2E",
  size = 1.05,
  items = [],
  className = "",
  onClick,
  lang = "en",
  dict,
}) => {
  // If no folder name or href is provided, render only the visual icon
  if (!name && !href) {
    return (
      <FolderVisual
        color={color}
        size={size}
        className={className}
        items={items}
        image={image}
      />
    );
  }

  const resolvedImg = image ? getImageUrl(image) : null;

  // Format date preferring event date, then createdAt
  const displayDate = date || createdAt;
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

  const countText =
    galleryCount === 1
      ? dict?.GalleryPage?.PhotoSingle || "1 Photo"
      : `${galleryCount} ${dict?.GalleryPage?.PhotoPlural || "Photos"}`;

  const CardContent = (
    <div
      onClick={onClick}
      className={`group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl border border-hairline/80 bg-white/95 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-forest/40 hover:shadow-xl cursor-pointer ${className}`}
    >
      {/* Visual Section: Exact identical aspect-[16/11] header height for all cards */}
      {resolvedImg ? (
        <div className="relative aspect-16/11 w-full shrink-0 overflow-hidden bg-forest/5">
          {/* Ambient blurred glow in background */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-lg opacity-25 scale-110 transition-opacity duration-300 group-hover:opacity-40"
            style={{ backgroundImage: `url(${resolvedImg})` }}
          />

          {/* Sharp High-Resolution Cover Image */}
          <Image
            src={resolvedImg}
            alt={name || "Album cover"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="relative z-10 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-106"
            loading="lazy"
          />

          {/* Dark Gradient Overlay for Contrast */}
          <div className="absolute inset-0 z-20 bg-linear-to-t from-black/75 via-black/15 to-black/35 pointer-events-none" />

          {/* Top-Left: Category Badge */}
          {category && (
            <div className="absolute top-2.5 left-2.5 z-30 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-white shadow-xs backdrop-blur-md border border-white/20">
              <Tag className="h-2.5 w-2.5 text-sand" />
              <span className="truncate max-w-[120px]">{category}</span>
            </div>
          )}

          {/* Top-Right: Featured Star Badge */}
          {featured && (
            <div className="absolute top-2.5 right-2.5 z-30 inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-white shadow-xs backdrop-blur-md border border-amber-300/40">
              <Star className="h-2.5 w-2.5 fill-white" />
              <span>{dict?.GalleryPage?.Featured || "Featured"}</span>
            </div>
          )}

          {/* Bottom-Right: Photo Count Pill */}
          <div className="absolute bottom-2.5 right-2.5 z-30 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs backdrop-blur-md border border-white/20">
            <Images className="h-3 w-3 text-sand" />
            <span>{countText}</span>
          </div>
        </div>
      ) : (
        /* Fallback to 3D FolderVisual with same aspect-[16/11] container */
        <div className="relative aspect-16/11 w-full shrink-0 overflow-hidden bg-sand-soft/40 border-b border-hairline/50 flex items-center justify-center">
          <FolderVisual color={color} size={size} items={items} />

          {/* Top-Left: Category Badge */}
          {category && (
            <div className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-forest/80 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-white shadow-xs backdrop-blur-md border border-forest/20">
              <Tag className="h-2.5 w-2.5 text-sand" />
              <span className="truncate max-w-[120px]">{category}</span>
            </div>
          )}

          {/* Top-Right: Featured Star Badge */}
          {featured && (
            <div className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-white shadow-xs backdrop-blur-md border border-amber-300/40">
              <Star className="h-2.5 w-2.5 fill-white" />
              <span>{dict?.GalleryPage?.Featured || "Featured"}</span>
            </div>
          )}

          {/* Bottom-Right: Photo Count Pill */}
          <div className="absolute bottom-2.5 right-2.5 z-10 inline-flex items-center gap-1.5 rounded-full bg-forest/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs backdrop-blur-md border border-forest/20">
            <Images className="h-3 w-3 text-sand" />
            <span>{countText}</span>
          </div>
        </div>
      )}

      {/* Details Container */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div className="space-y-1.5">
          {/* Folder / Album Name */}
          <h3 className="font-display text-base sm:text-lg font-bold text-forest-deep transition-colors group-hover:text-forest line-clamp-1 w-full text-left">
            {name}
          </h3>

          {/* Location & Date Row */}
          {(location || formattedDate) && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mist">
              {location && (
                <span className="inline-flex items-center gap-1 truncate max-w-[150px]">
                  <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{location}</span>
                </span>
              )}
              {formattedDate && (
                <span className="inline-flex items-center gap-1 shrink-0">
                  <Calendar className="h-3 w-3 text-mist/70 shrink-0" />
                  <span>{formattedDate}</span>
                </span>
              )}
            </div>
          )}

          {/* Description snippet */}
          {description && (
            <p className="text-xs text-mist/80 line-clamp-2 leading-relaxed text-left pt-0.5">
              {description}
            </p>
          )}
        </div>

        {/* Footer: Date and CTA */}
        <div className="mt-3.5 flex items-center justify-between border-t border-hairline/60 pt-2.5 text-[11px] sm:text-xs text-mist">
          <span className="inline-flex items-center gap-1 text-faint">
            {countText}
          </span>

          <span className="inline-flex items-center gap-1 font-bold text-forest group-hover:text-forest-deep transition-all group-hover:translate-x-0.5">
            <span>{dict?.GalleryPage?.OpenAlbum || "Open Album"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} scroll={false} className="block h-full w-full">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

export default Folder;

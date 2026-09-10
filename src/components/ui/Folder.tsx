"use client";

import React from "react";
import Link from "next/link";
import { Images } from "lucide-react";

export interface FolderProps {
  id?: string;
  name?: string;
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
 * (No flying papers on click - click navigates smoothly)
 */
export const FolderVisual: React.FC<{
  color?: string;
  size?: number;
  className?: string;
  items?: React.ReactNode[];
}> = ({ color = "#0B3D2E", size = 1.05, className = "", items = [] }) => {
  const folderBackColor = darkenColor(color, 0.15);
  const paper1 = "#FAF6F0";
  const paper2 = "#F5EFE6";
  const paper3 = "#FFFFFF";

  const papers = [items[0] || null, items[1] || null, items[2] || null];

  return (
    <div
      style={{ transform: `scale(${size})` }}
      className={`relative inline-block select-none ${className}`}
    >
      <div className="relative w-[116px] h-[86px] transition-transform duration-300 ease-out group-hover:-translate-y-1">
        {/* Back Folder Wall */}
        <div
          className="relative w-full h-full rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] shadow-sm"
          style={{ backgroundColor: folderBackColor }}
        >
          {/* Top Folder Tab */}
          <span
            className="absolute bottom-[98%] left-0 w-[42px] h-[12px] rounded-tl-[6px] rounded-tr-[6px]"
            style={{ backgroundColor: folderBackColor }}
          />

          {/* Paper Sheets peeking out (Smooth lift on card hover) */}
          {papers.map((customItem, i) => {
            let widthClasses = "w-[76%] h-[74%]";
            if (i === 1) widthClasses = "w-[82%] h-[68%]";
            if (i === 2) widthClasses = "w-[88%] h-[60%]";

            const bgColor = i === 0 ? paper1 : i === 1 ? paper2 : paper3;

            return (
              <div
                key={i}
                className={`absolute z-20 bottom-[10%] left-1/2 -translate-x-1/2 rounded-[6px] border border-black/5 shadow-xs transition-all duration-300 ease-out group-hover:-translate-y-2.5 ${widthClasses}`}
                style={{
                  backgroundColor: bgColor,
                  transformOrigin: "bottom center",
                }}
              >
                {customItem || (
                  <div className="h-full w-full p-1.5 flex flex-col justify-between opacity-50">
                    <div className="h-1 w-2/3 rounded-full bg-mist/30" />
                    <div className="h-1 w-full rounded-full bg-mist/20" />
                    <div className="h-1 w-4/5 rounded-full bg-mist/20" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Front Folder Cover (Angled Front Flap) */}
          <div
            className="absolute z-30 inset-x-0 bottom-0 h-[82%] rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] rounded-tl-[4px] shadow-inner transition-all duration-300 ease-out origin-bottom group-hover:[transform:skew(-6deg)_scaleY(0.92)]"
            style={{
              backgroundColor: color,
              backgroundImage:
                "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.15) 100%)",
            }}
          >
            {/* Subtle Folder Lip Accent */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-white/25 rounded-t" />
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
 * - If `name` or `href` is supplied, renders as a full, interactive Folder Card with folder visual,
 *   folder name, photo count badge, and creation date.
 * - Clicking navigates directly to the folder page without opening 3 loose papers.
 * - Uses primary color `#0B3D2E` by default.
 */
export const Folder: React.FC<FolderProps> = ({
  id,
  name,
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
      />
    );
  }

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(
        lang === "ht" ? "fr-HT" : "en-US",
        {
          month: "short",
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
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-hairline/80 bg-white/95 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-forest/40 hover:shadow-xl cursor-pointer text-center ${className}`}
    >
      {/* Visual Folder Icon Centered */}
      <div className="flex w-full items-center justify-center py-4">
        <FolderVisual color={color} size={size} items={items} />
      </div>

      {/* Details Container */}
      <div className="mt-2 flex flex-1 flex-col items-center justify-between">
        {/* Folder Name */}
        <h3 className="font-display text-lg font-bold text-forest-deep transition-colors group-hover:text-forest line-clamp-1 w-full">
          {name}
        </h3>

        {/* Photo Count Badge */}
        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-sand-soft/80 border border-hairline/80 px-3 py-1 text-xs font-bold text-forest group-hover:bg-forest group-hover:text-white transition-colors shadow-2xs">
          <Images className="h-3.5 w-3.5" />
          <span>{countText}</span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} scroll={false} className="block h-full">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

export default Folder;

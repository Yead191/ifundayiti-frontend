"use client";

import React, { useState } from "react";
import Masonry, { type Item } from "./Masonry";
import { GalleryModal } from "./GalleryModal";
import type { GalleryItem, GalleryFolder } from "@/helpers/next-fetch/galleryActions";
import { getImageUrl } from "@/lib/getImageUrl";

interface PhotoAlbumProps {
  galleryItems?: GalleryItem[];
  folderInfo?: GalleryFolder | null;
  lang?: string;
  dict?: any;
}

const HEIGHT_PATTERNS = [
  420, 380, 460, 520, 400, 370, 500, 480, 340, 540, 460, 510,
];

export default function PhotoAlbum({
  galleryItems = [],
  folderInfo,
  lang = "en",
  dict,
}: PhotoAlbumProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const sourceItems: Item[] = galleryItems.map((item, index) => {
    const height = HEIGHT_PATTERNS[index % HEIGHT_PATTERNS.length];
    const resolvedImg = getImageUrl(item.image) || item.image;

    const folderObj = typeof item.folder === "object" ? item.folder : null;
    const category = folderObj?.category || folderInfo?.category || item.category;
    const location = folderObj?.location || folderInfo?.location || item.location;
    const date = folderObj?.date || folderInfo?.date || item.date || item.createdAt;
    const featured = Boolean(folderObj?.featured ?? folderInfo?.featured ?? item.featured);
    const title = item.caption || item.title || folderInfo?.name || `Photo ${index + 1}`;

    return {
      id: item._id || item.id || `photo-${index}`,
      img: resolvedImg,
      height,
      title,
      category,
      location,
      date,
      featured,
      rawItem: {
        ...item,
        caption: item.caption,
        folder: folderObj || folderInfo,
      },
    };
  });

  return (
    <div className="w-full">
      <Masonry
        items={sourceItems}
        onItemClick={(item) => setSelectedItem(item)}
        ease="power3.out"
        duration={0.6}
        stagger={0.05}
        animateFrom="bottom"
        scaleOnHover={true}
        hoverScale={0.96}
        blurToFocus={true}
        colorShiftOnHover={false}
      />

      {/* Premium Lightbox Modal */}
      <GalleryModal
        item={selectedItem}
        items={sourceItems}
        onClose={() => setSelectedItem(null)}
        onSelect={(item) => setSelectedItem(item)}
        lang={lang}
        dict={dict}
      />
    </div>
  );
}

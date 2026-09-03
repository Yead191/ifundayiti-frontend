"use client";

import React, { useState } from "react";
import Masonry, { type Item } from "./Masonry";
import { GalleryModal } from "./GalleryModal";
import type { GalleryItem } from "@/helpers/next-fetch/galleryActions";
import { getImageUrl } from "@/lib/getImageUrl";
import photoAlbums from "@/data/photos";

interface PhotoAlbumProps {
  galleryItems?: GalleryItem[];
  lang?: string;
  dict?: any;
}

const HEIGHT_PATTERNS = [
  420, 380, 460, 520, 400, 370, 500, 480, 340, 540, 460, 510,
];

export default function PhotoAlbum({
  galleryItems = [],
  lang = "en",
  dict,
}: PhotoAlbumProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // If no items provided from API, fall back to local photoAlbums
  const sourceItems: Item[] = galleryItems.map((item, index) => {
    const height = HEIGHT_PATTERNS[index % HEIGHT_PATTERNS.length];
    const resolvedImg = getImageUrl(item.image) || item.image;

    return {
      id: item._id || item.id || `photo-${index}`,
      img: resolvedImg,
      height,
      title: item.title,
      category: item.category,
      location: item.location,
      date: item.date,
      featured: item.featured,
      rawItem: item,
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

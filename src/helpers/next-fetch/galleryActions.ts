"use server";

import { nextFetch } from "./NextFetch";
import photoAlbums from "@/data/photos";

export interface GalleryItem {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  image: string;
  category?: string;
  location?: string;
  date?: string | Date;
  status: "Draft" | "Published" | "Archived" | string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleriesResponse {
  success: boolean;
  message?: string;
  data: GalleryItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

import { GALLERY_CATEGORIES, type GalleryCategory } from "@/features/gallery/constants";
export type { GalleryCategory };

// Fallback items generated from local photoAlbums if backend has no published photos yet
const FALLBACK_CATEGORIES = [
  "Food & Agriculture",
  "Community Outreach",
  "Education",
  "Grant Programs",
  "Healthcare",
  "Community Development",
  "Entrepreneurship",
  "Environment",
  "Events",
  "Volunteering",
  "Success Stories",
];

const FALLBACK_LOCATIONS = [
  "Port-au-Prince, Ouest",
  "Cap-Haïtien, Nord",
  "Les Cayes, Sud",
  "Saint-Marc, Artibonite",
  "Jacmel, Sud-Est",
  "Gonaïves, Artibonite",
  "Hinche, Centre",
  "Ouanaminthe, Nord-Est",
];

const FALLBACK_GALLERY_ITEMS: GalleryItem[] = photoAlbums.map((photo, i) => {
  const cat = FALLBACK_CATEGORIES[i % FALLBACK_CATEGORIES.length];
  const loc = FALLBACK_LOCATIONS[i % FALLBACK_LOCATIONS.length];
  return {
    _id: `fallback-${photo.id}`,
    id: photo.id,
    title: `Community Initiative in ${loc.split(",")[0]}`,
    description:
      "Grassroots community members gathering during field verification, collaborative workshops, and grant award milestones supported by IFundAyiti.",
    image: photo.img,
    category: cat,
    location: loc,
    date: new Date(2026, 7 - (i % 6), 15 - (i % 12)).toISOString(),
    status: "Published",
    featured: i % 4 === 0,
  };
});

/**
 * Fetch published gallery items with optional category and search filters.
 */
export async function getGalleries({
  page = 1,
  limit = 50,
  searchTerm = "",
  category = "",
  featured,
  sort = "-createdAt",
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
  featured?: boolean;
  sort?: string;
} = {}): Promise<GalleriesResponse> {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  if (searchTerm && searchTerm.trim()) params.set("searchTerm", searchTerm.trim());
  if (category && category !== "All") params.set("category", category);
  if (typeof featured === "boolean") params.set("featured", String(featured));
  if (sort) params.set("sort", sort);

  try {
    const res = await nextFetch<GalleryItem[]>(`/gallery?${params.toString()}`, {
      next: {
        revalidate: 60,
      },
    });

    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return {
        success: true,
        data: res.data,
        pagination: res.pagination,
      };
    }
  } catch {
    // API failure fallback
  }

  // Fallback to local high-resolution community album
  let filtered = [...FALLBACK_GALLERY_ITEMS];

  if (category && category !== "All") {
    filtered = filtered.filter(
      (item) => item.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (searchTerm && searchTerm.trim()) {
    const q = searchTerm.toLowerCase().trim();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q)
    );
  }

  if (typeof featured === "boolean") {
    filtered = filtered.filter((item) => item.featured === featured);
  }

  return {
    success: true,
    message: "Fallback galleries returned",
    data: filtered,
    pagination: {
      page: 1,
      limit,
      total: filtered.length,
      totalPage: 1,
    },
  };
}

/**
 * Fetch single gallery item by MongoDB ID
 */
export async function getSingleGallery(id: string): Promise<{
  success: boolean;
  data: GalleryItem | null;
}> {
  try {
    const res = await nextFetch<GalleryItem>(`/gallery/${id}`, {
      next: {
        revalidate: 60,
      },
    });
    if (res.success && res.data) {
      return { success: true, data: res.data };
    }
  } catch {}

  const fallback = FALLBACK_GALLERY_ITEMS.find((item) => item._id === id || item.id === id);
  return { success: !!fallback, data: fallback || null };
}

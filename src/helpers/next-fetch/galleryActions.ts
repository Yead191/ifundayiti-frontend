"use server";

import { nextFetch } from "./NextFetch";
import {
  GALLERY_CATEGORIES,
  type GalleryCategory,
} from "@/features/gallery/constants";

export type { GalleryCategory };

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

/**
 * Fetch published gallery items directly from backend API
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
  if (searchTerm && searchTerm.trim())
    params.set("searchTerm", searchTerm.trim());
  if (category && category !== "All") params.set("category", category);
  if (typeof featured === "boolean") params.set("featured", String(featured));
  if (sort) params.set("sort", sort);

  try {
    const res = await nextFetch<GalleryItem[]>(
      `/gallery?${params.toString()}`,
      {
        next: {
          revalidate: 60,
        },
      },
    );

    if (res.success && Array.isArray(res.data)) {
      return {
        success: true,
        data: res.data,
        pagination: res.pagination,
      };
    }

    return {
      success: false,
      message: res.message || "Failed to fetch galleries",
      data: [],
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
      data: [],
    };
  }
}

/**
 * Fetch single gallery item by MongoDB ID directly from backend API
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

    return { success: false, data: null };
  } catch {
    return { success: false, data: null };
  }
}

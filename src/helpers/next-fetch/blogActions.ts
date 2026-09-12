"use server";

import { nextFetch } from "./NextFetch";

export type BLOG_STATUS = "draft" | "published" | "archived";

export interface IBlogCategory {
  _id: string;
  name: string;
  slug: string;
  blogCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBlogAuthor {
  _id: string;
  name: string;
  email?: string;
  image?: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  contain?: string;
  image?: string;
  category: IBlogCategory | string;
  author?: IBlogAuthor | string;
  tags?: string[];
  status: BLOG_STATUS | string;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogsResponse {
  success: boolean;
  message?: string;
  data: IBlog[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface BlogCategoriesResponse {
  success: boolean;
  message?: string;
  data: IBlogCategory[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

/**
 * Fetch all published blogs from backend API
 */
export async function getBlogs({
  page = 1,
  limit = 12,
  searchTerm = "",
  category = "",
  isFeatured,
  sort = "-publishedAt -createdAt",
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
  isFeatured?: boolean;
  sort?: string;
} = {}): Promise<BlogsResponse> {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  if (searchTerm && searchTerm.trim()) {
    params.set("searchTerm", searchTerm.trim());
  }
  if (category && category !== "all" && category !== "All") {
    params.set("category", category);
  }
  if (typeof isFeatured === "boolean") {
    params.set("isFeatured", String(isFeatured));
  }
  if (sort) params.set("sort", sort);

  try {
    const tags = ["blogs"];
    if (category) tags.push(`blogs-category-${category}`);

    const res = await nextFetch<IBlog[]>(`/blog?${params.toString()}`, {
      cache: "force-cache",
      next: {
        revalidate: 60,
        tags,
      },
    });

    if (res.success && Array.isArray(res.data)) {
      return {
        success: true,
        data: res.data,
        pagination: res.pagination,
      };
    }

    return {
      success: false,
      message: res.message || "Failed to fetch blogs",
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
 * Fetch a single blog post by slug or MongoDB ID
 */
export async function getSingleBlog(slugOrId: string): Promise<{
  success: boolean;
  data: IBlog | null;
  message?: string;
}> {
  try {
    const res = await nextFetch<IBlog>(`/blog/${slugOrId}`, {
      cache: "force-cache",
      next: {
        revalidate: 60,
        tags: ["blogs", `blog-${slugOrId}`],
      },
    });

    if (res.success && res.data) {
      return { success: true, data: res.data };
    }

    return { success: false, data: null, message: res.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Fetch all public blog categories with article counts
 */
export async function getBlogCategories({
  searchTerm = "",
  sort = "name",
}: {
  searchTerm?: string;
  sort?: string;
} = {}): Promise<BlogCategoriesResponse> {
  const params = new URLSearchParams();
  if (searchTerm && searchTerm.trim()) {
    params.set("searchTerm", searchTerm.trim());
  }
  if (sort) params.set("sort", sort);

  try {
    const res = await nextFetch<IBlogCategory[]>(
      `/blog-category?${params.toString()}`,
      {
        cache: "force-cache",
        next: {
          revalidate: 60,
          tags: ["blog-categories"],
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
      message: res.message || "Failed to fetch categories",
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

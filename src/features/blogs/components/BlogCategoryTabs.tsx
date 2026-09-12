"use client";

import React from "react";
import Link from "next/link";
import type { IBlogCategory } from "@/helpers/next-fetch/blogActions";
import { buildBlogUrl } from "../utils";

interface BlogCategoryTabsProps {
  categories: IBlogCategory[];
  activeCategory?: string;
  searchTerm?: string;
  totalArticles: number;
  lang?: string;
  dict?: any;
}

export function BlogCategoryTabs({
  categories = [],
  activeCategory = "all",
  searchTerm = "",
  totalArticles = 0,
  lang = "en",
  dict,
}: BlogCategoryTabsProps) {
  const isAll = !activeCategory || activeCategory.toLowerCase() === "all";

  return (
    <div className="w-full mb-8">
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2 pt-1 lg:flex-wrap">
        {/* "All Articles" Tab */}
        <Link
          href={buildBlogUrl(lang, "all", searchTerm)}
          scroll={false}
          prefetch={true}
          className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
            isAll
              ? "bg-forest text-white shadow-sm ring-2 ring-forest/30 scale-102"
              : "bg-white border border-hairline text-forest-deep hover:bg-sand-soft hover:border-forest/20 shadow-2xs"
          }`}
        >
          <span>{dict?.BlogPage?.AllArticles || "All Articles"}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              isAll
                ? "bg-white/20 text-white"
                : "bg-forest/10 text-forest"
            }`}
          >
            {totalArticles}
          </span>
        </Link>

        {/* Dynamic Category Tabs from Backend */}
        {categories.map((cat) => {
          const isActive =
            activeCategory === cat.slug ||
            activeCategory === cat._id ||
            activeCategory.toLowerCase() === cat.name.toLowerCase();

          return (
            <Link
              key={cat._id}
              href={buildBlogUrl(lang, cat.slug, searchTerm)}
              scroll={false}
              prefetch={true}
              className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-forest text-white shadow-sm ring-2 ring-forest/30 scale-102"
                  : "bg-white border border-hairline text-forest-deep hover:bg-sand-soft hover:border-forest/20 shadow-2xs"
              }`}
            >
              <span>{cat.name}</span>
              {typeof cat.blogCount === "number" && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-forest/10 text-forest"
                  }`}
                >
                  {cat.blogCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default BlogCategoryTabs;

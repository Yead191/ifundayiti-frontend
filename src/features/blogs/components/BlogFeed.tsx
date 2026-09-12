import React, { Suspense } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { getBlogs, getBlogCategories } from "@/helpers/next-fetch/blogActions";
import { FeaturedBlogSpotlight } from "./FeaturedBlogSpotlight";
import { BlogCategoryTabs } from "./BlogCategoryTabs";
import { BlogGrid } from "./BlogGrid";

interface BlogFeedProps {
  lang: string;
  category?: string;
  searchTerm?: string;
  page?: string;
  dict?: any;
}

export async function BlogFeed({
  lang,
  category = "all",
  searchTerm = "",
  page = "1",
  dict,
}: BlogFeedProps) {
  const t = dict?.BlogPage;

  // Fetch blogs & categories in parallel
  const [blogsRes, categoriesRes] = await Promise.all([
    getBlogs({
      category: category === "all" ? "" : category,
      searchTerm,
      page: Number(page) || 1,
      limit: 12,
      sort: "-publishedAt -createdAt",
    }),
    getBlogCategories({ sort: "name" }),
  ]);

  const blogs = blogsRes.data || [];
  const categories = categoriesRes.data || [];
  const totalArticles = blogsRes.pagination?.total || blogs.length;

  const isFiltering =
    Boolean(searchTerm) || (category !== "all" && category !== "All");

  // Choose the spotlight article: highest priority to isFeatured, fallback to first article
  const featuredBlog =
    !isFiltering && blogs.length > 0
      ? blogs.find((b) => b.isFeatured) || blogs[0]
      : null;

  // Remaining articles for the grid
  const gridBlogs = featuredBlog
    ? blogs.filter((b) => b._id !== featuredBlog._id)
    : blogs;

  return (
    <>
      {/* Top Featured Article Spotlight (when on home/unfiltered view) */}
      {featuredBlog && (
        <FeaturedBlogSpotlight
          blog={featuredBlog}
          lang={lang}
          dict={dict}
        />
      )}

      {/* Category Navigation Tabs */}
      <Suspense fallback={null}>
        <BlogCategoryTabs
          categories={categories}
          activeCategory={category}
          searchTerm={searchTerm}
          totalArticles={totalArticles}
          lang={lang}
          dict={dict}
        />
      </Suspense>

      {/* Empty State or Article Grid */}
      {blogs.length === 0 ? (
        <EmptyState
          title={t?.Empty?.Title || "No articles found"}
          body={
            isFiltering
              ? t?.Empty?.FilteredBody ||
                "We couldn't find any articles matching your search or category filter. Try clearing your search or browsing all topics."
              : t?.Empty?.NoArticlesBody ||
                "Our editorial team is currently drafting field dispatches. Check back soon for new articles!"
          }
          actionLabel={
            isFiltering ? t?.Empty?.ResetBtn || "Reset filters" : undefined
          }
          actionHref={isFiltering ? `/${lang}/blogs` : undefined}
        />
      ) : (
        <BlogGrid blogs={gridBlogs} lang={lang} dict={dict} />
      )}
    </>
  );
}

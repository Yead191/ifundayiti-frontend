import React, { Suspense } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { getBlogs, getBlogCategories } from "@/helpers/next-fetch/blogActions";
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

  // Keep all blogs in uniform grid; surface featured articles at the top with a star mark
  const sortedBlogs = [...blogs].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  return (
    <>
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
      {sortedBlogs.length === 0 ? (
        <EmptyState
          title={
            t?.Empty?.Title ||
            (lang === "ht" ? "Pa gen atik yo jwenn" : "No articles found")
          }
          body={
            isFiltering
              ? t?.Empty?.FilteredBody ||
                (lang === "ht"
                  ? "Nou pa jwenn okenn atik ki koresponn ak rechèch ou an. Eseye efase filtè yo."
                  : "We couldn't find any articles matching your search or category filter. Try clearing your search or browsing all topics.")
              : t?.Empty?.NoArticlesBody ||
                (lang === "ht"
                  ? "Ekip nou an ap prepare nouvo atik. Tounen talè pou dekouvri yo!"
                  : "Our editorial team is currently drafting field dispatches. Check back soon for new articles!")
          }
          actionLabel={
            isFiltering
              ? t?.Empty?.ResetBtn ||
                (lang === "ht" ? "Reyajiste filtè yo" : "Reset filters")
              : undefined
          }
          actionHref={isFiltering ? `/${lang}/blogs` : undefined}
        />
      ) : (
        <BlogGrid blogs={sortedBlogs} lang={lang} dict={dict} />
      )}
    </>
  );
}

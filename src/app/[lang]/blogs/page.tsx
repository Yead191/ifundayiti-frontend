import { Suspense } from "react";
import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/seo";

import { BlogHero } from "@/features/blogs/components/BlogHero";
import { BlogFeed } from "@/features/blogs/components/BlogFeed";
import { BlogContentSkeleton } from "@/features/blogs/components/BlogSkeleton";

interface BlogsPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    category?: string;
    searchTerm?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict?.BlogPage;

  return buildMetadata({
    title: t?.Meta?.Title || "Blogs & Insights · IFundAyiti",
    description:
      t?.Meta?.Description ||
      "Discover authentic field dispatches, grassroots milestones, and impact stories from community projects across Haiti.",
    path: `/${lang}/blogs`,
  });
}

export default async function BlogsPage({
  params,
  searchParams,
}: BlogsPageProps) {
  const { lang } = await params;
  const { category = "all", searchTerm = "", page = "1" } = await searchParams;

  const dict = await getDictionary(lang);

  const isFiltering =
    Boolean(searchTerm) || (category !== "all" && category !== "All");

  return (
    <>
      {/* Editorial Hero Section - Renders immediately with zero delay */}
      <BlogHero
        initialSearchTerm={searchTerm}
        activeCategory={category}
        lang={lang}
        dict={dict}
      />

      {/* Main Articles Showcase - Progressively streamed under Suspense */}
      <section className="py-12 md:py-16 bg-sand-soft/20 min-h-[60vh]">
        <Container>
          <Suspense
            key={`${category}-${searchTerm}-${page}`}
            fallback={<BlogContentSkeleton showSpotlight={!isFiltering} />}
          >
            <BlogFeed
              lang={lang}
              category={category}
              searchTerm={searchTerm}
              page={page}
              dict={dict}
            />
          </Suspense>
        </Container>
      </section>
    </>
  );
}


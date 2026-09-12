import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { getFolders } from "@/helpers/next-fetch/galleryActions";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/seo";

import { GalleryHero } from "@/features/gallery/components/GalleryHero";
import { FoldersDirectory } from "@/features/gallery/components/FoldersDirectory";
import { GalleryFilterBar } from "@/features/gallery/components/GalleryFilterBar";
import { FeaturedSpotlight } from "@/features/gallery/components/FeaturedSpotlight";

interface GalleryPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    folder?: string;
    category?: string;
    searchTerm?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: GalleryPageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict?.GalleryPage;

  return buildMetadata({
    title: t?.Hero?.TitlePrefix ? `${t.Hero.TitlePrefix}${t.Hero.TitleHighlight || "Pictures"}` : "Our Impact in Pictures | Photo Albums",
    description:
      t?.Hero?.Subtitle ||
      "Browse photo stories and community initiatives across Haiti.",
    path: `/${lang}/gallery`,
  });
}

export default async function GalleryPage({
  params,
  searchParams,
}: GalleryPageProps) {
  const { lang } = await params;
  const {
    folder,
    category = "All",
    searchTerm = "",
    page = "1",
  } = await searchParams;

  // Backwards compatibility: If legacy ?folder=id query is used, redirect to dedicated page
  if (folder) {
    redirect(`/${lang}/gallery/${folder}`);
  }

  const dict = await getDictionary(lang);
  const t = dict?.GalleryPage;

  // Fetch albums from backend
  const foldersRes = await getFolders({
    category: category === "All" ? "" : category,
    searchTerm,
    page: Number(page) || 1,
    limit: 100,
    sort: "-featured -createdAt",
  });

  const folders = foldersRes?.data || [];
  const featuredFolders = folders.filter((f) => f.featured);

  // Show spotlight when not filtered by specific search or category
  const showSpotlight =
    featuredFolders.length > 0 &&
    !searchTerm &&
    (!category || category === "All");

  return (
    <>
      <GalleryHero lang={lang} dict={dict} />

      <section className="py-12 md:py-16 bg-sand-soft/20 min-h-[60vh]">
        <Container>
          {/* Featured Album Spotlight Carousel */}
          {showSpotlight && (
            <FeaturedSpotlight
              folders={featuredFolders}
              lang={lang}
              dict={dict}
            />
          )}

          {/* Interactive Search & Category Filter Bar */}
          <Suspense fallback={null}>
            <GalleryFilterBar
              lang={lang}
              activeCategory={category}
              initialSearchTerm={searchTerm}
              totalResults={folders.length}
              itemType="albums"
              dict={dict}
            />
          </Suspense>

          {/* Albums Grid Showcase or Empty State */}
          {folders.length === 0 ? (
            <EmptyState
              title={t?.EmptyAlbums?.Title || "No photo albums found"}
              body={
                searchTerm || (category && category !== "All")
                  ? t?.EmptyAlbums?.FilteredBody ||
                    "There are no photo albums matching your current search or category filter."
                  : t?.EmptyAlbums?.EmptyBody ||
                    "There are currently no published photo albums available."
              }
              actionLabel={
                searchTerm || (category && category !== "All")
                  ? t?.Empty?.ResetBtn || "Reset filters"
                  : undefined
              }
              actionHref={
                searchTerm || (category && category !== "All")
                  ? `/${lang}/gallery`
                  : undefined
              }
            />
          ) : (
            <FoldersDirectory folders={folders} lang={lang} dict={dict} />
          )}
        </Container>
      </section>
    </>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";

import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { getGalleries } from "@/helpers/next-fetch/galleryActions";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/seo";

import PhotoAlbum from "@/features/gallery/components/PhotoAlbum";
import { GalleryFilterBar } from "@/features/gallery/components/GalleryFilterBar";

interface GalleryPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
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
    title: t?.Hero?.Title || "Community Gallery",
    description:
      t?.Hero?.Subtitle ||
      "Witness authentic field photographs of community projects and grassroots builders across Haiti.",
    path: `/${lang}/gallery`,
  });
}

export default async function GalleryPage({
  params,
  searchParams,
}: GalleryPageProps) {
  const { lang } = await params;
  const { category = "All", searchTerm = "", page = "1" } = await searchParams;

  const [dict, galleriesRes] = await Promise.all([
    getDictionary(lang),
    getGalleries({
      category: category === "All" ? "" : category,
      searchTerm,
      page: Number(page) || 1,
      limit: 60,
    }),
  ]);

  const t = dict?.GalleryPage;
  const photos = galleriesRes?.data || [];
  const total = galleriesRes?.pagination?.total || photos.length;

  return (
    <>
      <PageHero
        eyebrow={t?.Hero?.Eyebrow || "Community Gallery"}
        title={t?.Hero?.Title || "Moments of Grassroots Impact"}
        subtitle={
          t?.Hero?.Subtitle ||
          "Witness authentic field photographs of community projects, grant ceremonies, workshops, and local builders creating sustainable futures across Haiti."
        }
      />

      <section className="py-12 md:py-16 bg-sand-soft/20 min-h-[60vh]">
        <Container>
          {/* Interactive Search & Category Filter Bar */}
          <Suspense fallback={null}>
            <GalleryFilterBar
              lang={lang}
              activeCategory={category}
              initialSearchTerm={searchTerm}
              totalResults={total}
              dict={dict}
            />
          </Suspense>

          {/* Gallery Showcase or Empty State */}
          {photos.length === 0 ? (
            <EmptyState
              title={t?.Empty?.Title || "No photos found"}
              body={
                t?.Empty?.Body ||
                "There are no published photos matching your current search or category filter."
              }
              actionLabel={t?.Empty?.ResetBtn || "View all photos"}
              actionHref={`/${lang}/gallery`}
            />
          ) : (
            <PhotoAlbum
              galleryItems={photos}
              lang={lang}
              dict={dict}
            />
          )}
        </Container>
      </section>
    </>
  );
}

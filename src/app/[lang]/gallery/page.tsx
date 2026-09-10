import { Suspense } from "react";
import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import {
  getGalleries,
  getFolders,
  getFolderById,
} from "@/helpers/next-fetch/galleryActions";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/seo";

import { GalleryHero } from "@/features/gallery/components/GalleryHero";
import { FoldersDirectory } from "@/features/gallery/components/FoldersDirectory";
import PhotoAlbum from "@/features/gallery/components/PhotoAlbum";
import { GalleryFilterBar } from "@/features/gallery/components/GalleryFilterBar";

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
  searchParams,
}: GalleryPageProps): Promise<Metadata> {
  const { lang } = await params;
  const { folder } = await searchParams;
  const dict = await getDictionary(lang);
  const t = dict?.GalleryPage;

  if (folder) {
    try {
      const folderRes = await getFolderById(folder);
      if (folderRes.success && folderRes.data) {
        return buildMetadata({
          title: `${folderRes.data.name} | ${t?.AlbumLabel || "Field Album"}`,
          description:
            t?.AlbumSubtitle ||
            `Verified field photographs from ${folderRes.data.name} in Haiti.`,
          path: `/${lang}/gallery?folder=${folder}`,
        });
      }
    } catch {
      // fallback
    }
  }

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
  const {
    folder,
    category = "All",
    searchTerm = "",
    page = "1",
  } = await searchParams;

  const dict = await getDictionary(lang);
  const t = dict?.GalleryPage;

  // Case 1: Inside a specific Folder / Album
  if (folder) {
    const [folderRes, galleriesRes] = await Promise.all([
      getFolderById(folder),
      getGalleries({
        folder,
        category: category === "All" ? "" : category,
        searchTerm,
        page: Number(page) || 1,
        limit: 60,
      }),
    ]);

    const currentFolder = folderRes.data || {
      _id: folder,
      name: t?.AlbumLabel || "Photo Album",
      galleryCount: galleriesRes.pagination?.total ?? galleriesRes.data?.length,
    };

    const photos = galleriesRes?.data || [];
    const total = galleriesRes?.pagination?.total ?? photos.length;

    return (
      <>
        <GalleryHero
          currentFolder={currentFolder}
          lang={lang}
          dict={dict}
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
                folder={folder}
                dict={dict}
              />
            </Suspense>

            {/* Photos Showcase or Empty State */}
            {photos.length === 0 ? (
              <EmptyState
                title={t?.Empty?.Title || "No photos found"}
                body={
                  searchTerm || category !== "All"
                    ? t?.Empty?.Body ||
                      "There are no photos matching your current search or filter in this album."
                    : "There are currently no published photos inside this album."
                }
                actionLabel={
                  searchTerm || category !== "All"
                    ? t?.Empty?.ResetBtn || "Reset filters"
                    : t?.BackToFolders || "Back to all albums"
                }
                actionHref={
                  searchTerm || category !== "All"
                    ? `/${lang}/gallery?folder=${folder}`
                    : `/${lang}/gallery`
                }
              />
            ) : (
              <PhotoAlbum galleryItems={photos} lang={lang} dict={dict} />
            )}
          </Container>
        </section>
      </>
    );
  }

  // Case 2: Root Folders Directory View (Default Folder-First Experience)
  const foldersRes = await getFolders({ limit: 100, sort: "-createdAt" });
  const folders = foldersRes?.data || [];

  return (
    <>
      <GalleryHero lang={lang} dict={dict} />

      <section className="py-12 md:py-16 bg-sand-soft/20 min-h-[60vh]">
        <Container>
          <FoldersDirectory folders={folders} lang={lang} dict={dict} />
        </Container>
      </section>
    </>
  );
}

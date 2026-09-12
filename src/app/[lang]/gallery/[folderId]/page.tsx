import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Star, Tag, Images } from "lucide-react";

import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/ui/reveal";
import {
  getFolderById,
  getGalleries,
} from "@/helpers/next-fetch/galleryActions";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/seo";
import PhotoAlbum from "@/features/gallery/components/PhotoAlbum";
import { getImageUrl } from "@/lib/getImageUrl";

interface AlbumPageProps {
  params: Promise<{ lang: string; folderId: string }>;
}

export async function generateMetadata({
  params,
}: AlbumPageProps): Promise<Metadata> {
  const { lang, folderId } = await params;
  const dict = await getDictionary(lang);
  const t = dict?.GalleryPage;

  try {
    const folderRes = await getFolderById(folderId);
    if (folderRes.success && folderRes.data) {
      const folder = folderRes.data;
      const imageUrl = folder.image ? getImageUrl(folder.image) : undefined;

      return buildMetadata({
        title: `${folder.name} | ${t?.AlbumLabel || "Photo Album"}`,
        description:
          folder.description ||
          t?.AlbumSubtitle ||
          `Verified field photographs from ${folder.name} in Haiti.`,
        path: `/${lang}/gallery/${folderId}`,
        ...(imageUrl && {
          openGraph: {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: folder.name,
              },
            ],
          },
        }),
      });
    }
  } catch {
    // fallback
  }

  return buildMetadata({
    title: t?.AlbumLabel || "Photo Album",
    description:
      "Verified field photographs of community projects across Haiti.",
    path: `/${lang}/gallery/${folderId}`,
  });
}

export default async function GalleryAlbumPage({ params }: AlbumPageProps) {
  const { lang, folderId } = await params;
  const dict = await getDictionary(lang);
  const t = dict?.GalleryPage;

  // Fetch album metadata & photos in parallel
  const [folderRes, galleriesRes] = await Promise.all([
    getFolderById(folderId),
    getGalleries({
      folder: folderId,
      limit: 100,
      sort: "-createdAt",
    }),
  ]);

  const folder = folderRes?.data;
  const photos = galleriesRes?.data || [];

  // If album does not exist
  if (!folder) {
    return (
      <section className="py-24 bg-sand-soft/20 min-h-[70vh] flex items-center">
        <Container>
          <EmptyState
            title={t?.AlbumNotFoundTitle || "Photo Album Not Found"}
            body={
              t?.AlbumNotFoundBody ||
              "The album you are looking for does not exist or has been removed."
            }
            actionLabel={t?.BackToFolders || "Back to All Albums"}
            actionHref={`/${lang}/gallery`}
          />
        </Container>
      </section>
    );
  }

  const displayDate = folder.date || folder.createdAt;
  const formattedDate = displayDate
    ? new Date(displayDate).toLocaleDateString(
        lang === "ht" ? "fr-HT" : "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        },
      )
    : null;

  const photoCount = folder.galleryCount ?? photos.length;
  const countText =
    photoCount === 1
      ? dict?.GalleryPage?.PhotoSingle || "1 Photo"
      : `${photoCount} ${dict?.GalleryPage?.PhotoPlural || "Photos"}`;

  return (
    <>
      {/* Top Header / Album Story Hero */}
      <section className="relative overflow-hidden bg-linear-to-b from-sand-soft/80 via-cream to-cream pb-14 pt-28 md:pb-18 md:pt-36 border-b border-hairline/60">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-full -translate-x-1/2 overflow-hidden">
          <div className="aurora -top-24 left-1/3 h-80 w-xl opacity-30" />
          <div className="aurora top-20 right-1/4 h-72 w-96 opacity-20" />
        </div>

        <Container className="relative z-10">
          <div className="mx-auto max-w-4xl">
            {/* Top Navigation: Back to All Albums */}
            <Reveal>
              <div className="mb-6 inline-flex">
                <Link
                  href={`/${lang}/gallery`}
                  className="group inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/90 px-4 py-2 text-xs sm:text-sm font-bold text-forest shadow-2xs backdrop-blur-md transition-all hover:bg-forest hover:text-white hover:border-forest"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  <span>{t?.BackToFolders || "Back to All Albums"}</span>
                </Link>
              </div>
            </Reveal>

            {/* Badges Row: Category, Featured, Location, Date, Photo Count */}
            <Reveal delay={40}>
              <div className="flex flex-wrap items-center gap-2.5">
                {folder.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 border border-forest/20 px-3 py-1 text-xs font-bold text-forest backdrop-blur-xs">
                    <Tag className="h-3 w-3 text-forest" />
                    <span>{folder.category}</span>
                  </span>
                )}

                {folder.featured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 px-3 py-1 text-xs font-bold text-amber-700">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>{t?.Featured || "Featured Album"}</span>
                  </span>
                )}

                {folder.location && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-forest-deep/80 bg-white/80 border border-hairline/60 rounded-full px-3 py-1">
                    <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>{folder.location}</span>
                  </span>
                )}

                {formattedDate && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-mist bg-white/80 border border-hairline/60 rounded-full px-3 py-1">
                    <Calendar className="h-3 w-3 text-mist/80 shrink-0" />
                    <span>{formattedDate}</span>
                  </span>
                )}

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest-deep bg-sand-soft/80 border border-hairline/60 rounded-full px-3 py-1">
                  <Images className="h-3 w-3 text-forest shrink-0" />
                  <span>{countText}</span>
                </span>
              </div>
            </Reveal>

            {/* Album Title */}
            <Reveal delay={80}>
              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-forest-deep sm:text-4xl md:text-5xl lg:text-6xl md:leading-[1.12]">
                {folder.name}
              </h1>
            </Reveal>

            {/* Full Story Narrative / Description */}
            {folder.description && (
              <Reveal delay={120}>
                <p className="mt-5 max-w-3xl text-base sm:text-lg leading-relaxed text-mist">
                  {folder.description}
                </p>
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      {/* Photos Grid / Showcase */}
      <section className="py-12 md:py-16 bg-sand-soft/20 min-h-[60vh]">
        <Container>
          {photos.length === 0 ? (
            <EmptyState
              title={t?.EmptyAlbumPhotosTitle || "No photos in this album yet"}
              body={
                t?.EmptyAlbumPhotosBody ||
                "Our field team is uploading photographs for this album. Please check back soon!"
              }
              actionLabel={t?.BackToFolders || "Back to All Albums"}
              actionHref={`/${lang}/gallery`}
            />
          ) : (
            <PhotoAlbum
              galleryItems={photos}
              folderInfo={folder}
              lang={lang}
              dict={dict}
            />
          )}
        </Container>
      </section>
    </>
  );
}

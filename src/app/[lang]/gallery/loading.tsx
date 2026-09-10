import { Container } from "@/components/shared/container";
import { MasonrySkeleton } from "@/features/gallery/components/MasonrySkeleton";

export default function GalleryLoading() {
  return (
    <>
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden bg-linear-to-b from-sand-soft/80 via-cream to-cream pb-16 pt-28 md:pb-20 md:pt-36 border-b border-hairline/60">
        <Container>
          <div className="mx-auto max-w-4xl text-center space-y-4 flex flex-col items-center">
            <div className="h-6 w-36 rounded-full bg-forest/10 animate-pulse" />
            <div className="h-12 w-3/4 max-w-md rounded-2xl bg-forest/15 animate-pulse" />
            <div className="h-5 w-full max-w-lg rounded-xl bg-forest/10 animate-pulse" />
            <div className="flex gap-3 pt-4">
              <div className="h-9 w-28 rounded-2xl bg-forest/10 animate-pulse" />
              <div className="h-9 w-28 rounded-2xl bg-forest/10 animate-pulse" />
            </div>
          </div>
        </Container>
      </div>

      {/* Grid Skeleton */}
      <section className="py-12 md:py-16 bg-sand-soft/20 min-h-[60vh]">
        <Container>
          {/* Filter Bar Skeleton */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
            <div className="h-12 max-w-xl flex-1 rounded-2xl bg-sand-soft/60 animate-pulse" />
            <div className="h-5 w-28 rounded-full bg-sand-soft/60 animate-pulse" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-24 shrink-0 rounded-full bg-sand-soft/60 animate-pulse"
              />
            ))}
          </div>

          {/* Masonry Skeleton Grid */}
          <MasonrySkeleton count={8} />
        </Container>
      </section>
    </>
  );
}

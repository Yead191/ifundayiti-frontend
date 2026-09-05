import { Container } from "@/components/shared/container";
import { MasonrySkeleton } from "@/features/gallery/components/MasonrySkeleton";

export default function GalleryLoading() {
  return (
    <>
      {/* Hero Skeleton */}
      <div className="bg-forest pt-32 pb-20 text-white">
        <Container>
          <div className="max-w-2xl space-y-4">
            <div className="h-6 w-36 rounded-full bg-white/10 animate-pulse" />
            <div className="h-12 w-3/4 rounded-2xl bg-white/15 animate-pulse" />
            <div className="h-5 w-full rounded-xl bg-white/10 animate-pulse" />
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

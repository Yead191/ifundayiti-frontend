import { Container } from "@/components/shared/container";

export default function FaqLoading() {
  return (
    <div className="w-full">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden bg-linear-to-b from-sand-soft/80 via-cream to-cream pb-16 pt-28 md:pb-20 md:pt-36 border-b border-hairline/60">
        <Container>
          <div className="mx-auto max-w-3xl text-center flex flex-col items-center space-y-4">
            <div className="h-6 w-36 rounded-full bg-forest/10 animate-pulse" />
            <div className="h-12 w-3/4 max-w-md rounded-2xl bg-forest/15 animate-pulse" />
            <div className="h-5 w-full max-w-lg rounded-xl bg-forest/10 animate-pulse" />
            <div className="mt-4 h-13 w-full max-w-xl rounded-2xl bg-white shadow-sm animate-pulse" />
          </div>
        </Container>
      </div>

      {/* Accordion Skeletons */}
      <section className="py-12 md:py-16 bg-sand-soft/20 min-h-[50vh]">
        <Container className="max-w-4xl space-y-10">
          {/* Category Tabs Skeleton */}
          <div className="flex gap-2 pb-2 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-28 rounded-full bg-white border border-hairline shadow-2xs animate-pulse shrink-0"
              />
            ))}
          </div>

          {/* Q&A Items Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-32 rounded-lg bg-sand-soft/60 animate-pulse mb-6" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-18 rounded-2xl bg-white border border-hairline/80 shadow-2xs animate-pulse"
              />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

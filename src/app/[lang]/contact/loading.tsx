import { Container } from "@/components/shared/container";

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Skeleton Hero */}
      <section className="relative overflow-hidden border-b border-hairline bg-cream pt-24 pb-14 sm:pt-28 sm:pb-16">
        <Container className="text-center">
          <div className="mx-auto h-4 w-28 animate-pulse rounded-full bg-forest/10" />
          <div className="mx-auto mt-4 h-10 w-72 animate-pulse rounded-2xl bg-forest-deep/10 sm:h-12 sm:w-96" />
          <div className="mx-auto mt-3 h-5 w-80 animate-pulse rounded-lg bg-mist/20 sm:w-md" />
        </Container>
      </section>

      {/* Skeleton Main Section */}
      <section className="py-14 lg:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column Skeleton */}
            <div className="space-y-8 lg:col-span-5">
              <div className="rounded-3xl border border-hairline bg-white p-6 shadow-xs sm:p-8">
                <div className="h-3 w-24 animate-pulse rounded bg-forest/10" />
                <div className="mt-3 h-7 w-48 animate-pulse rounded-lg bg-forest-deep/10" />
                <div className="mt-2 h-4 w-full animate-pulse rounded bg-mist/15" />
                <div className="mt-6 space-y-4">
                  <div className="h-20 w-full animate-pulse rounded-2xl bg-sand-soft/50" />
                  <div className="h-20 w-full animate-pulse rounded-2xl bg-sand-soft/50" />
                  <div className="h-20 w-full animate-pulse rounded-2xl bg-sand-soft/50" />
                </div>
              </div>
              <div className="h-36 w-full animate-pulse rounded-3xl border border-hairline bg-sand-soft/40" />
            </div>

            {/* Right Column (Form) Skeleton */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-hairline bg-white p-6 shadow-md sm:p-10">
                <div className="h-7 w-40 animate-pulse rounded-lg bg-forest-deep/10" />
                <div className="mt-2 h-4 w-64 animate-pulse rounded bg-mist/15" />
                <div className="mt-6 h-14 w-full animate-pulse rounded-2xl bg-sand-soft/50" />
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="h-12 w-full animate-pulse rounded-xl bg-sand-soft/40" />
                  <div className="h-12 w-full animate-pulse rounded-xl bg-sand-soft/40" />
                </div>
                <div className="mt-4 h-12 w-full animate-pulse rounded-xl bg-sand-soft/40" />
                <div className="mt-4 h-32 w-full animate-pulse rounded-xl bg-sand-soft/40" />
                <div className="mt-6 h-13 w-full animate-pulse rounded-2xl bg-forest/15" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

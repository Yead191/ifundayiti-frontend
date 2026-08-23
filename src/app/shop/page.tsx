import type { Metadata } from "next";
import { Suspense } from "react";

import { Container } from "@/components/shared/container";
import { ShopExperience } from "@/components/shop/shop-experience";
import { buildMetadata } from "@/lib/seo";
import Loader from "@/components/layout/loader";

export const metadata: Metadata = buildMetadata({
  title: "Shop",
  description:
    "IFundAyiti merchandise — Forest Green and Warm Sand pieces that carry the mission into everyday life.",
  path: "/shop",
});

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filters = {
    category: sp.category?.trim() ?? "",
    search: sp.search?.trim() ?? "",
    sort: sp.sort?.trim() ?? "featured",
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline bg-cream pt-28 pb-14 md:pt-32 md:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-sand-soft via-cream to-cream" />
        <div className="aurora -right-20 top-10 h-72 w-72 opacity-40" />
        <Container className="relative">
          <p className="eyebrow">Merchandise</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.06] tracking-tight text-forest-deep sm:text-5xl lg:text-[3.25rem]">
            Wear the mission.
            <span className="mt-1 block text-forest">Fund the work.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            Forest Green and Warm Sand pieces designed for everyday life — every
            purchase strengthens the Program Fund that powers the next grant
            cycle.
          </p>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <Suspense fallback={<Loader />}>
            <ShopExperience filters={filters} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { ShopExperience } from "@/components/shop/shop-experience";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shop",
  description:
    "IFundAyiti merchandise — Forest Green and Warm Sand pieces that extend the mission.",
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
      <PageHero
        eyebrow="Shop"
        title="Mission merch, made to feel like IFundAyiti."
        subtitle="Demo catalog. Category filters live in the URL so they can be shared — for example /shop?category=t-shirts."
      />
      <section className="py-14">
        <Container>
          <Suspense>
            <ShopExperience filters={filters} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}

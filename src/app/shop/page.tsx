import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Heart, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";

import { Container } from "@/components/shared/container";
import { ShopExperience } from "@/components/shop/shop-experience";
import { buildMetadata } from "@/lib/seo";
import Loader from "@/components/layout/loader";

export const metadata: Metadata = buildMetadata({
  title: "Shop Purpose Merch",
  description:
    "Wear the movement — IFundAyiti Forest Green and Warm Sand apparel that directly funds equity-free micro-grants for Haitian entrepreneurs.",
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
      {/* PREMIUM EMOTIONAL SHOP HERO */}
      <section className="relative overflow-hidden border-b border-hairline bg-cream pt-28 pb-16 md:pt-32 md:pb-20">
        {/* Background Ambient Effects */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-sand-soft/80 via-cream to-cream" />
        <div className="aurora -right-20 top-10 h-96 w-96 opacity-35" />
        <div className="aurora -left-20 bottom-0 h-72 w-72 opacity-25" />

        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* LEFT COLUMN: Emotional Narrative & Impact Highlights */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-sand-soft/80 px-3.5 py-1.5 text-xs font-semibold text-forest shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-forest" />
                <span>Purpose-Driven Merchandise</span>
              </div>

              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-forest-deep sm:text-5xl lg:text-[3.25rem]">
                Wear the movement.
                <span className="mt-1 block text-forest">Empower local dreams.</span>
              </h1>

              <p className="mt-5 text-base leading-relaxed text-mist sm:text-lg">
                When you wear IFundAyiti merchandise, you aren&apos;t just making a style statement — you are directly fueling equity-free micro-grants for visionary Haitian entrepreneurs. Designed in our signature Forest Green and Warm Sand palette, every piece represents resilience, community pride, and economic empowerment.
              </p>

              {/* Feature Badges / Direct Impact Pills */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2.5 rounded-2xl border border-hairline/80 bg-white/80 p-3 text-xs font-medium text-forest-deep shadow-2xs backdrop-blur-xs">
                  <Heart className="h-4 w-4 shrink-0 text-forest fill-forest/20" />
                  <span>100% Proceeds to Grant Pool</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl border border-hairline/80 bg-white/80 p-3 text-xs font-medium text-forest-deep shadow-2xs backdrop-blur-xs">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-forest" />
                  <span>Ethical Quality Materials</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl border border-hairline/80 bg-white/80 p-3 text-xs font-medium text-forest-deep shadow-2xs backdrop-blur-xs col-span-2 sm:col-span-1">
                  <Truck className="h-4 w-4 shrink-0 text-forest" />
                  <span>Worldwide Delivery</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Featured Merchandise Spotlight Card */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="relative rounded-3xl border border-hairline bg-white/90 p-5 shadow-xl backdrop-blur-md transition-all hover:shadow-2xl">
                <div className="absolute -top-3 -right-3 rounded-full border border-forest/30 bg-forest px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sand shadow-md">
                  Top Featured
                </div>

                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-sand-soft">
                  <Image
                    src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200&h=1500"
                    alt="Forest Hoodie"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-forest">
                      Featured Piece
                    </p>
                    <h3 className="font-display text-lg font-semibold text-forest-deep">
                      Forest Green Heavyweight Hoodie
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-lg font-bold text-forest">
                      $58.00
                    </span>
                    <span className="block text-[11px] text-faint line-through">
                      $68.00
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-xs text-mist line-clamp-2">
                  Heavyweight cotton fleece in Forest Green. Every purchase directly powers upcoming micro-grant cycles.
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-xs">
                  <span className="flex items-center gap-1 font-medium text-forest-deep">
                    <Star className="h-3.5 w-3.5 fill-forest text-forest" />
                    4.9 (18 reviews)
                  </span>
                  <Link
                    href="/product/forest-hoodie"
                    className="font-semibold text-forest hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SHOP EXPERIENCE SECTION */}
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

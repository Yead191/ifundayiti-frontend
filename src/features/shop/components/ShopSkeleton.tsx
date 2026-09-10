import * as React from "react";
import { Container } from "@/components/shared/container";

/**
 * Skeleton for an individual product card
 * Matches the dimensions and styling of ProductCard
 */
export function ProductCardSkeleton() {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-hairline bg-white p-2.5 sm:p-4 shadow-2xs">
      {/* Garment Image Box Skeleton */}
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl sm:rounded-2xl bg-sand-soft/80 animate-pulse">
        {/* Top Badges Skeletons */}
        <div className="absolute left-2.5 top-2.5 h-4 sm:h-5 w-14 sm:w-16 rounded-full bg-sand-soft/90 border border-hairline/60" />
        <div className="absolute right-2.5 top-2.5 h-4 sm:h-5 w-12 sm:w-14 rounded-full bg-sand-soft/90 border border-hairline/60" />
      </div>

      {/* Metrics & Details Skeleton */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          {/* Category & Gender */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-16 sm:w-20 rounded-md bg-sand-soft/80 animate-pulse" />
            <div className="h-3 w-10 sm:w-12 rounded-md bg-sand-soft/70 animate-pulse" />
          </div>

          {/* Product Title */}
          <div className="mt-2 space-y-1">
            <div className="h-4 sm:h-5 w-4/5 rounded-md bg-sand-soft animate-pulse" />
            <div className="h-3 w-1/2 rounded-md bg-sand-soft/60 animate-pulse hidden sm:block" />
          </div>

          {/* Color Swatches Skeleton */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-sand-soft/90 animate-pulse" />
            <div className="h-3 w-3 rounded-full bg-sand-soft/90 animate-pulse" />
            <div className="h-3 w-3 rounded-full bg-sand-soft/90 animate-pulse" />
          </div>
        </div>

        {/* Pricing & Units Sold */}
        <div className="mt-3.5 flex items-end justify-between border-t border-hairline/80 pt-2.5">
          <div className="space-y-1">
            <div className="h-4 sm:h-5 w-16 rounded-md bg-sand-soft animate-pulse" />
            <div className="h-2.5 w-12 rounded bg-sand-soft/60 animate-pulse" />
          </div>
          <div className="h-3 w-14 rounded-md bg-sand-soft/70 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of product card skeletons
 */
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Skeleton for the left category and filters sidebar
 */
export function ShopSidebarSkeleton() {
  return (
    <aside className="hidden lg:block lg:col-span-3">
      <div className="rounded-3xl border border-hairline bg-white/95 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <div className="h-4 w-20 rounded-md bg-sand-soft animate-pulse" />
          <div className="h-3 w-12 rounded-md bg-sand-soft/70 animate-pulse" />
        </div>

        <div className="mt-6 space-y-6">
          {/* Categories List */}
          <div>
            <div className="h-3 w-24 rounded-md bg-sand-soft/80 animate-pulse mb-3" />
            <div className="space-y-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div className="h-3.5 w-28 rounded-md bg-sand-soft animate-pulse" />
                  <div className="h-3.5 w-7 rounded-full bg-sand-soft/70 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div className="pt-4 border-t border-hairline">
            <div className="h-3 w-20 rounded-md bg-sand-soft/80 animate-pulse mb-3" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-16 rounded-xl bg-sand-soft animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* In-Stock Toggle */}
          <div className="pt-4 border-t border-hairline flex items-center justify-between">
            <div className="h-3.5 w-24 rounded-md bg-sand-soft animate-pulse" />
            <div className="h-5 w-9 rounded-full bg-sand-soft/80 animate-pulse" />
          </div>
        </div>
      </div>
    </aside>
  );
}

/**
 * Skeleton for the top search & sorting toolbar
 */
export function ShopTopToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-hairline/80 bg-white/90 p-3 sm:p-4 shadow-2xs backdrop-blur-md">
      {/* Search Input Skeleton */}
      <div className="relative flex-1 sm:max-w-md">
        <div className="h-10 w-full rounded-xl bg-sand-soft animate-pulse" />
      </div>

      {/* Results & Sort Skeleton */}
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <div className="h-4 w-20 rounded-md bg-sand-soft/70 animate-pulse" />
        <div className="h-9 w-32 rounded-xl bg-sand-soft animate-pulse" />
      </div>
    </div>
  );
}

/**
 * Full page skeleton used by loading.tsx
 */
export function ShopPageSkeleton() {
  return (
    <>
      {/* BRAND HERO SECTION SKELETON */}
      <section className="relative overflow-hidden border-b border-hairline bg-cream pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-sand-soft/90 via-cream to-cream" />
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Narrative Skeleton */}
            <div className="lg:col-span-7 space-y-4">
              <div className="h-6 w-44 rounded-full bg-sand-soft animate-pulse" />
              <div className="h-12 w-4/5 rounded-2xl bg-sand-soft animate-pulse" />
              <div className="h-12 w-3/5 rounded-2xl bg-sand-soft animate-pulse" />
              <div className="h-5 w-full max-w-xl rounded-xl bg-sand-soft/70 animate-pulse mt-3" />
              <div className="h-5 w-2/3 max-w-xl rounded-xl bg-sand-soft/60 animate-pulse" />

              {/* Trust Badges Skeleton */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 pt-4">
                <div className="h-12 rounded-2xl border border-hairline/80 bg-white/80 animate-pulse" />
                <div className="h-12 rounded-2xl border border-hairline/80 bg-white/80 animate-pulse" />
                <div className="h-12 rounded-2xl border border-hairline/80 bg-white/80 animate-pulse col-span-2 sm:col-span-1" />
              </div>
            </div>

            {/* Right Featured Spotlight Skeleton */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="rounded-3xl border border-hairline bg-white/95 p-5 shadow-xl">
                <div className="aspect-4/3 w-full rounded-2xl bg-sand-soft animate-pulse" />
                <div className="mt-4 flex items-center justify-between">
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-20 rounded bg-sand-soft animate-pulse" />
                    <div className="h-5 w-3/4 rounded-md bg-sand-soft animate-pulse" />
                  </div>
                  <div className="h-5 w-16 rounded bg-sand-soft animate-pulse" />
                </div>
                <div className="mt-4 border-t border-hairline pt-3 flex justify-between items-center">
                  <div className="h-3.5 w-28 rounded bg-sand-soft animate-pulse" />
                  <div className="h-3.5 w-20 rounded bg-sand-soft animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CATALOG SECTION SKELETON */}
      <section className="py-12 md:py-20 min-h-[60vh]">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <ShopSidebarSkeleton />

            <div className="lg:col-span-9">
              <ShopTopToolbarSkeleton />
              <ProductGridSkeleton count={6} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

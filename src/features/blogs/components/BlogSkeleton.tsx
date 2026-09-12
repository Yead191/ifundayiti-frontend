import React from "react";
import { Container } from "@/components/shared/container";

/**
 * Skeleton for an individual blog card in the grid
 */
export function BlogCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-hairline/70 bg-white/90 shadow-sm p-0">
      {/* 16:10 Aspect Ratio Cover Image Shimmer */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-sand-soft/80 animate-pulse">
        <div className="absolute top-4 left-4 h-6 w-24 rounded-full bg-white/60" />
      </div>

      {/* Body Content Shimmer */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {/* Date and Read Time Meta */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-3.5 w-20 rounded-md bg-sand-soft animate-pulse" />
          <div className="h-2 w-2 rounded-full bg-sand-soft/60" />
          <div className="h-3.5 w-16 rounded-md bg-sand-soft animate-pulse" />
        </div>

        {/* Title Shimmer */}
        <div className="space-y-2 mb-3">
          <div className="h-5 w-11/12 rounded-lg bg-forest/15 animate-pulse" />
          <div className="h-5 w-3/4 rounded-lg bg-forest/10 animate-pulse" />
        </div>

        {/* Excerpt Shimmer */}
        <div className="space-y-2 mb-6 flex-1">
          <div className="h-3.5 w-full rounded-md bg-sand-soft animate-pulse" />
          <div className="h-3.5 w-4/5 rounded-md bg-sand-soft/70 animate-pulse" />
        </div>

        {/* Author Footer Shimmer */}
        <div className="flex items-center justify-between border-t border-hairline/80 pt-4 mt-auto">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-forest/15 animate-pulse" />
            <div className="h-3.5 w-24 rounded-md bg-sand-soft animate-pulse" />
          </div>
          <div className="h-4 w-16 rounded-md bg-forest/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of blog card skeletons
 */
export function BlogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Skeleton for the Featured Blog Spotlight Hero card
 */
export function BlogSpotlightSkeleton() {
  return (
    <div className="mb-14 w-full overflow-hidden rounded-3xl border border-forest/15 bg-linear-to-br from-forest-deep via-[#0c3f30] to-[#062018] shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[380px] lg:min-h-[420px]">
        {/* Left Cover Image Shimmer */}
        <div className="relative min-h-[260px] sm:min-h-[320px] lg:min-h-full lg:col-span-7 bg-white/5 animate-pulse">
          <div className="absolute top-6 left-6 h-7 w-32 rounded-full bg-white/15" />
        </div>

        {/* Right Content Shimmer */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 lg:col-span-5 bg-forest-deep/60">
          <div>
            {/* Category & Date Pill */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-32 rounded-full bg-white/15 animate-pulse" />
              <div className="h-4 w-20 rounded-md bg-white/10 animate-pulse" />
            </div>

            {/* Title Shimmer */}
            <div className="space-y-3 mb-4">
              <div className="h-7 w-full rounded-xl bg-white/20 animate-pulse" />
              <div className="h-7 w-4/5 rounded-xl bg-white/15 animate-pulse" />
              <div className="h-7 w-3/5 rounded-xl bg-white/10 animate-pulse" />
            </div>

            {/* Excerpt Shimmer */}
            <div className="space-y-2 mb-6">
              <div className="h-3.5 w-full rounded-md bg-white/10 animate-pulse" />
              <div className="h-3.5 w-11/12 rounded-md bg-white/10 animate-pulse" />
              <div className="h-3.5 w-3/4 rounded-md bg-white/10 animate-pulse" />
            </div>
          </div>

          {/* Author & Button Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/15 animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-24 rounded-md bg-white/20 animate-pulse" />
                <div className="h-3 w-16 rounded-md bg-white/10 animate-pulse" />
              </div>
            </div>
            <div className="h-11 w-36 rounded-full bg-amber-500/30 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for the Category Navigation Tabs
 */
export function BlogCategoryTabsSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
      <div className="h-10 w-28 shrink-0 rounded-full bg-sand-soft/80 animate-pulse" />
      <div className="h-10 w-44 shrink-0 rounded-full bg-sand-soft/70 animate-pulse" />
      <div className="h-10 w-36 shrink-0 rounded-full bg-sand-soft/70 animate-pulse" />
      <div className="h-10 w-40 shrink-0 rounded-full bg-sand-soft/70 animate-pulse" />
      <div className="h-10 w-32 shrink-0 rounded-full bg-sand-soft/70 animate-pulse" />
    </div>
  );
}

/**
 * Combined skeleton for the main blog content area
 */
export function BlogContentSkeleton({
  showSpotlight = true,
}: {
  showSpotlight?: boolean;
}) {
  return (
    <div>
      {showSpotlight && <BlogSpotlightSkeleton />}
      <BlogCategoryTabsSkeleton />
      <BlogGridSkeleton count={6} />
    </div>
  );
}

/**
 * Full page skeleton for the Blogs Directory (/blogs)
 * Used in loading.tsx for instant streaming
 */
export function BlogDirectorySkeleton() {
  return (
    <>
      {/* Editorial Hero Skeleton */}
      <section className="relative overflow-hidden bg-linear-to-b from-sand-soft/80 via-cream to-cream pb-16 pt-28 md:pb-24 md:pt-36 border-b border-hairline/60">
        <Container className="relative z-10">
          <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
            {/* Eyebrow Pill */}
            <div className="h-7 w-48 rounded-full bg-forest/10 animate-pulse mb-6" />

            {/* Headline */}
            <div className="space-y-3 w-full max-w-2xl mb-6">
              <div className="h-10 sm:h-12 w-11/12 mx-auto rounded-2xl bg-forest/15 animate-pulse" />
              <div className="h-10 sm:h-12 w-3/4 mx-auto rounded-2xl bg-forest/10 animate-pulse" />
            </div>

            {/* Subtitle */}
            <div className="space-y-2 w-full max-w-xl mb-8">
              <div className="h-4 w-full rounded-md bg-forest/10 animate-pulse" />
              <div className="h-4 w-5/6 mx-auto rounded-md bg-forest/10 animate-pulse" />
            </div>

            {/* Search Bar Skeleton */}
            <div className="h-14 w-full max-w-xl rounded-full bg-white/90 border border-hairline/80 shadow-md animate-pulse" />
          </div>
        </Container>
      </section>

      {/* Main Content Area */}
      <section className="py-12 md:py-16 bg-sand-soft/20 min-h-[60vh]">
        <Container>
          <BlogSpotlightSkeleton />
          <BlogCategoryTabsSkeleton />
          <BlogGridSkeleton count={6} />
        </Container>
      </section>
    </>
  );
}

/**
 * Skeleton for the Single Blog Reading Page (/blogs/[slug])
 * Used in [slug]/loading.tsx
 */
export function BlogDetailSkeleton() {
  return (
    <>
      {/* Top Header & Breadcrumbs Skeleton */}
      <section className="relative overflow-hidden bg-linear-to-b from-sand-soft/80 via-cream to-cream pb-12 pt-28 md:pb-16 md:pt-36 border-b border-hairline/60">
        <Container className="relative z-10">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb Skeleton */}
            <div className="h-4 w-44 rounded-md bg-forest/10 animate-pulse mb-6" />

            {/* Badge Shimmer */}
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-28 rounded-full bg-forest/15 animate-pulse" />
              <div className="h-6 w-24 rounded-full bg-amber-500/15 animate-pulse" />
            </div>

            {/* Large H1 Headline Skeleton */}
            <div className="space-y-3 mb-8">
              <div className="h-10 sm:h-12 w-11/12 rounded-2xl bg-forest/20 animate-pulse" />
              <div className="h-10 sm:h-12 w-4/5 rounded-2xl bg-forest/15 animate-pulse" />
            </div>

            {/* Author, Date & Share Controls Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-hairline/80 pt-6">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-forest/15 animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 rounded-md bg-forest/15 animate-pulse" />
                  <div className="h-3 w-40 rounded-md bg-sand-soft animate-pulse" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-9 rounded-full bg-sand-soft animate-pulse" />
                <div className="h-9 w-9 rounded-full bg-sand-soft animate-pulse" />
                <div className="h-9 w-9 rounded-full bg-sand-soft animate-pulse" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Reading Body Skeleton */}
      <section className="py-12 md:py-16 bg-cream/30 min-h-screen">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Cover Hero Image Shimmer */}
            <div className="relative aspect-16/9 w-full overflow-hidden rounded-3xl bg-sand-soft/80 border border-hairline/70 mb-12 animate-pulse" />

            {/* Article Prose Shimmer */}
            <div className="mx-auto max-w-3xl space-y-6">
              <div className="space-y-2.5">
                <div className="h-4 w-full rounded-md bg-sand-soft/90 animate-pulse" />
                <div className="h-4 w-full rounded-md bg-sand-soft/90 animate-pulse" />
                <div className="h-4 w-11/12 rounded-md bg-sand-soft/80 animate-pulse" />
                <div className="h-4 w-4/5 rounded-md bg-sand-soft/70 animate-pulse" />
              </div>

              {/* Subheading Shimmer */}
              <div className="pt-4">
                <div className="h-7 w-3/5 rounded-lg bg-forest/15 animate-pulse mb-3" />
                <div className="space-y-2.5">
                  <div className="h-4 w-full rounded-md bg-sand-soft/90 animate-pulse" />
                  <div className="h-4 w-11/12 rounded-md bg-sand-soft/80 animate-pulse" />
                  <div className="h-4 w-3/4 rounded-md bg-sand-soft/70 animate-pulse" />
                </div>
              </div>

              {/* Blockquote Shimmer */}
              <div className="rounded-2xl border-l-4 border-forest/30 bg-sand-soft/40 p-6 space-y-2">
                <div className="h-4 w-11/12 rounded-md bg-sand-soft animate-pulse" />
                <div className="h-4 w-3/4 rounded-md bg-sand-soft animate-pulse" />
              </div>

              {/* Another paragraph block */}
              <div className="space-y-2.5 pt-2">
                <div className="h-4 w-full rounded-md bg-sand-soft/90 animate-pulse" />
                <div className="h-4 w-10/12 rounded-md bg-sand-soft/80 animate-pulse" />
              </div>

              {/* Author Bio Card Skeleton */}
              <div className="mt-12 rounded-3xl border border-hairline/80 bg-white/80 p-6 sm:p-8 animate-pulse flex gap-5">
                <div className="h-16 w-16 rounded-full bg-forest/10 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-36 rounded-md bg-forest/15" />
                  <div className="h-3.5 w-full rounded-md bg-sand-soft" />
                  <div className="h-3.5 w-3/4 rounded-md bg-sand-soft" />
                </div>
              </div>
            </div>

            {/* Related Stories Skeleton */}
            <div className="mt-20 pt-16 border-t border-hairline/80">
              <div className="flex justify-between items-center mb-8">
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded-md bg-forest/15 animate-pulse" />
                  <div className="h-7 w-64 rounded-xl bg-forest/20 animate-pulse" />
                </div>
                <div className="h-4 w-28 rounded-md bg-forest/15 animate-pulse" />
              </div>
              <BlogGridSkeleton count={3} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/**
 * Skeleton for the Related Stories section specifically
 */
export function RelatedBlogsSkeleton() {
  return (
    <section className="mt-20 pt-16 border-t border-hairline/80">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded-md bg-forest/15 animate-pulse" />
          <div className="h-7 w-64 rounded-xl bg-forest/20 animate-pulse" />
        </div>
        <div className="h-4 w-28 rounded-md bg-forest/15 animate-pulse" />
      </div>
      <BlogGridSkeleton count={3} />
    </section>
  );
}


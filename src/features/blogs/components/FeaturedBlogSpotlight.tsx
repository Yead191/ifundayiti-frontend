"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, Star, Tag, Sparkles } from "lucide-react";
import type { IBlog } from "@/helpers/next-fetch/blogActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { calculateReadTime, formatBlogDate, getExcerpt } from "../utils";
import { Reveal } from "@/components/ui/reveal";

interface FeaturedBlogSpotlightProps {
  blog: IBlog;
  lang?: string;
  dict?: any;
}

export function FeaturedBlogSpotlight({
  blog,
  lang = "en",
  dict,
}: FeaturedBlogSpotlightProps) {
  if (!blog) return null;

  const rawContent = blog.content || blog.contain || "";
  const coverUrl = blog.image ? getImageUrl(blog.image) : null;
  const readTime = calculateReadTime(rawContent);
  const formattedDate = formatBlogDate(blog.publishedAt || blog.createdAt, lang);
  const excerpt = getExcerpt(rawContent, 220);

  const categoryName =
    typeof blog.category === "object" && blog.category
      ? blog.category.name
      : undefined;

  const authorName =
    typeof blog.author === "object" && blog.author
      ? blog.author.name
      : "IFundAyiti Editorial";

  const authorAvatar =
    typeof blog.author === "object" && blog.author?.image
      ? getImageUrl(blog.author.image)
      : null;

  return (
    <div className="mb-14 w-full">
      <Reveal>
        <div className="group relative overflow-hidden rounded-3xl border border-forest/15 bg-linear-to-br from-forest-deep via-[#0c3f30] to-[#062018] text-white shadow-xl transition-all duration-300 hover:shadow-2xl">
          {/* Ambient Lighting Background */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="aurora -top-24 -left-24 h-96 w-96 opacity-30" />
            <div className="aurora -bottom-24 -right-24 h-96 w-96 opacity-25" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Column: Cover Image Viewport */}
            <div className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] lg:col-span-7 overflow-hidden bg-black/40">
              {coverUrl ? (
                <>
                  <Image
                    src={coverUrl}
                    alt={blog.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent lg:bg-linear-to-r lg:from-transparent lg:to-[#062018]/95 pointer-events-none" />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-forest/30 p-8 text-center">
                  <Tag className="h-16 w-16 text-sand/30 animate-pulse" />
                </div>
              )}

              {/* Floating Spotlight Badge */}
              <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-black/65 px-3.5 py-1.5 text-xs font-bold text-amber-300 shadow-md backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                <span className="uppercase tracking-wider">
                  {dict?.BlogPage?.SpotlightBadge || "Featured Dispatch"}
                </span>
              </div>
            </div>

            {/* Right Column: Editorial Narrative & CTA */}
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 lg:col-span-5">
              <div className="space-y-4">
                {/* Meta Row: Category, Date, Read Time */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {categoryName && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold text-sand-soft backdrop-blur-xs border border-white/10">
                      <Tag className="h-3 w-3 text-sand" />
                      <span>{categoryName}</span>
                    </span>
                  )}

                  {formattedDate && (
                    <span className="inline-flex items-center gap-1 text-white/70">
                      <Calendar className="h-3 w-3 text-white/60" />
                      <span>{formattedDate}</span>
                    </span>
                  )}

                  <span className="text-white/40">·</span>

                  <span className="inline-flex items-center gap-1 text-white/70">
                    <Clock className="h-3 w-3 text-white/60" />
                    <span>{readTime}</span>
                  </span>
                </div>

                {/* Article Headline */}
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight transition-colors group-hover:text-amber-200">
                  <Link
                    href={`/${lang}/blogs/${blog.slug}`}
                    className="focus:outline-none"
                  >
                    {blog.title}
                  </Link>
                </h2>

                {/* Article Excerpt */}
                {excerpt && (
                  <p className="text-sm sm:text-base text-white/80 line-clamp-3 sm:line-clamp-4 leading-relaxed">
                    {excerpt}
                  </p>
                )}
              </div>

              {/* Author Row & Button CTA */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                {/* Author Avatar & Name */}
                <div className="flex items-center gap-3">
                  {authorAvatar ? (
                    <Image
                      src={authorAvatar}
                      alt={authorName}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-white/20"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-bold text-white">
                      {authorName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <span className="block text-xs font-semibold text-white">
                      {authorName}
                    </span>
                    <span className="block text-[11px] text-white/60">
                      IFundAyiti
                    </span>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <Link
                  href={`/${lang}/blogs/${blog.slug}`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-forest-deep shadow-lg hover:bg-amber-300 transition-all hover:scale-102"
                >
                  <span>
                    {dict?.BlogPage?.ReadFullStory || "Read Full Story"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export default FeaturedBlogSpotlight;

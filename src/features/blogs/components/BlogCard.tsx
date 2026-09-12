"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, Star, Tag } from "lucide-react";
import type { IBlog } from "@/helpers/next-fetch/blogActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { calculateReadTime, formatBlogDate, getExcerpt } from "../utils";

interface BlogCardProps {
  blog: IBlog;
  lang?: string;
  dict?: any;
}

export function BlogCard({ blog, lang = "en", dict }: BlogCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const rawContent = blog.content || blog.contain || "";
  const coverUrl = blog.image ? getImageUrl(blog.image) : null;
  const readTime = calculateReadTime(rawContent);
  const formattedDate = formatBlogDate(blog.publishedAt || blog.createdAt, lang);
  const excerpt = getExcerpt(rawContent, 140);

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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-hairline/70 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-forest/30 hover:shadow-xl">
      {/* Visual Cover Viewport with 16:10 Aspect Ratio */}
      <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden bg-sand-soft/60">
        {coverUrl ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-sand-soft/80 animate-pulse" />
            )}
            <Image
              src={coverUrl}
              alt={blog.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-all duration-500 ease-out group-hover:scale-106 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/15 pointer-events-none" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-sand-soft/50 to-cream">
            <Tag className="h-10 w-10 text-forest/20" />
          </div>
        )}

        {/* Top-Left Category Badge */}
        {categoryName && (
          <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs backdrop-blur-md border border-white/20">
            <span className="truncate max-w-35">{categoryName}</span>
          </div>
        )}

        {/* Top-Right Featured Star Badge */}
        {blog.isFeatured && (
          <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs backdrop-blur-md border border-amber-300/40">
            <Star className="h-3 w-3 fill-white" />
            <span>Featured</span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div className="space-y-2.5">
          {/* Metadata Row: Date & Read Time */}
          <div className="flex items-center gap-3 text-xs text-mist">
            {formattedDate && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-mist/70 shrink-0" />
                <span>{formattedDate}</span>
              </span>
            )}
            <span className="text-mist/40">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-mist/70 shrink-0" />
              <span>{readTime}</span>
            </span>
          </div>

          {/* Article Title */}
          <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-forest-deep transition-colors group-hover:text-forest line-clamp-2 leading-snug">
            <Link
              href={`/${lang}/blogs/${blog.slug}`}
              className="focus:outline-none"
            >
              {blog.title}
            </Link>
          </h3>

          {/* Article Excerpt */}
          {excerpt && (
            <p className="text-xs sm:text-sm text-mist/85 line-clamp-2 leading-relaxed">
              {excerpt}
            </p>
          )}
        </div>

        {/* Footer: Author Info & CTA Glide Arrow */}
        <div className="mt-5 flex items-center justify-between border-t border-hairline/60 pt-3.5">
          <div className="flex items-center gap-2.5">
            {authorAvatar ? (
              <Image
                src={authorAvatar}
                alt={authorName}
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-forest/20"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-forest/10 text-xs font-bold text-forest">
                {authorName.charAt(0)}
              </div>
            )}
            <span className="text-xs font-semibold text-forest-deep truncate max-w-32 sm:max-w-40">
              {authorName}
            </span>
          </div>

          <Link
            href={`/${lang}/blogs/${blog.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-forest transition-all group-hover:translate-x-1 group-hover:text-forest-deep"
            aria-label={`Read article: ${blog.title}`}
          >
            <span>{dict?.BlogPage?.ReadArticle || "Read"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default BlogCard;

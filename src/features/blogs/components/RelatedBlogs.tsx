"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { IBlog } from "@/helpers/next-fetch/blogActions";
import { BlogCard } from "./BlogCard";
import { Reveal } from "@/components/ui/reveal";

interface RelatedBlogsProps {
  blogs: IBlog[];
  currentBlogId?: string;
  lang?: string;
  dict?: any;
}

export function RelatedBlogs({
  blogs = [],
  currentBlogId,
  lang = "en",
  dict,
}: RelatedBlogsProps) {
  // Filter out the current active post and take top 3
  const related = blogs
    .filter((b) => b._id !== currentBlogId)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-20 pt-16 border-t border-hairline/80">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest mb-2">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{dict?.BlogPage?.RelatedEyebrow || "More Field Updates"}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-forest-deep tracking-tight">
            {dict?.BlogPage?.RelatedTitle || "Related Stories & Dispatches"}
          </h2>
        </div>

        <Link
          href={`/${lang}/blogs`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-forest hover:text-forest-deep transition-all group cursor-pointer"
        >
          <span>{dict?.BlogPage?.ViewAllArticles || "View all articles"}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {related.map((blog, idx) => (
          <Reveal key={blog._id} delay={idx * 50} className="h-full">
            <BlogCard blog={blog} lang={lang} dict={dict} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default RelatedBlogs;

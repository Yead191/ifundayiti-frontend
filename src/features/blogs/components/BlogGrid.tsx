"use client";

import React from "react";
import type { IBlog } from "@/helpers/next-fetch/blogActions";
import { BlogCard } from "./BlogCard";
import { Reveal } from "@/components/ui/reveal";

interface BlogGridProps {
  blogs: IBlog[];
  lang?: string;
  dict?: any;
}

export function BlogGrid({ blogs = [], lang = "en", dict }: BlogGridProps) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
      {blogs.map((blog, index) => (
        <Reveal key={blog._id} delay={index * 50} className="h-full">
          <BlogCard blog={blog} lang={lang} dict={dict} />
        </Reveal>
      ))}
    </div>
  );
}

export default BlogGrid;

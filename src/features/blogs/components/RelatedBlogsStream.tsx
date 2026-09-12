import React from "react";
import { getBlogs } from "@/helpers/next-fetch/blogActions";
import { RelatedBlogs } from "./RelatedBlogs";

interface RelatedBlogsStreamProps {
  categorySlug?: string;
  currentBlogId: string;
  lang: string;
  dict?: any;
}

export async function RelatedBlogsStream({
  categorySlug,
  currentBlogId,
  lang,
  dict,
}: RelatedBlogsStreamProps) {
  const relatedRes = await getBlogs({
    category: categorySlug || "",
    limit: 4,
    sort: "-publishedAt -createdAt",
  });
  const relatedBlogs = relatedRes.data || [];

  return (
    <RelatedBlogs
      blogs={relatedBlogs}
      currentBlogId={currentBlogId}
      lang={lang}
      dict={dict}
    />
  );
}

export default RelatedBlogsStream;

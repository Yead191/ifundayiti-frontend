"use client";

import React from "react";

interface BlogContentRendererProps {
  content: string;
  className?: string;
}

export function BlogContentRenderer({
  content,
  className = "",
}: BlogContentRendererProps) {
  if (!content) return null;

  return (
    <div
      className={`blog-content-prose max-w-none text-forest-deep/85 ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default BlogContentRenderer;

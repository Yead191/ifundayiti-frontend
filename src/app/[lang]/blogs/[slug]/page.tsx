import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Tag as TagIcon,
  ShieldCheck,
  Share2,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import {
  getSingleBlog,
} from "@/helpers/next-fetch/blogActions";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata, getSiteUrl } from "@/lib/seo";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  calculateReadTime,
  formatBlogDate,
  getExcerpt,
} from "@/features/blogs/utils";
import { BlogContentRenderer } from "@/features/blogs/components/BlogContentRenderer";
import { BlogShareButtons } from "@/features/blogs/components/BlogShareButtons";
import { BlogAuthorBio } from "@/features/blogs/components/BlogAuthorBio";
import { RelatedBlogsStream } from "@/features/blogs/components/RelatedBlogsStream";
import { RelatedBlogsSkeleton } from "@/features/blogs/components/BlogSkeleton";

interface BlogDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const res = await getSingleBlog(slug);

  if (!res.success || !res.data) {
    return buildMetadata({
      title: "Article Not Found · IFundAyiti",
      description: "The article you are looking for does not exist.",
      path: `/${lang}/blogs/${slug}`,
      noIndex: true,
    });
  }

  const blog = res.data;
  const rawContent = blog.content || blog.contain || "";
  const imageUrl = blog.image ? getImageUrl(blog.image) : undefined;
  const description = getExcerpt(rawContent, 180) || "Field story from Haiti.";

  return buildMetadata({
    title: `${blog.title} · IFundAyiti Blog`,
    description,
    path: `/${lang}/blogs/${blog.slug}`,
    image: imageUrl,
  });
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang);
  const t = dict?.BlogPage;

  const res = await getSingleBlog(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  const blog = res.data;
  const rawContent = blog.content || blog.contain || "";
  const coverUrl = blog.image ? getImageUrl(blog.image) : null;
  const readTime = calculateReadTime(rawContent);
  const formattedDate = formatBlogDate(blog.publishedAt || blog.createdAt, lang);

  const categoryName =
    typeof blog.category === "object" && blog.category
      ? blog.category.name
      : undefined;

  const categorySlug =
    typeof blog.category === "object" && blog.category
      ? blog.category.slug
      : undefined;

  const authorName =
    typeof blog.author === "object" && blog.author
      ? blog.author.name
      : "IFundAyiti Editorial";

  const authorAvatar =
    typeof blog.author === "object" && blog.author?.image
      ? getImageUrl(blog.author.image)
      : null;

  // JSON-LD Schema for rich search engine results
  const siteUrl = getSiteUrl();
  const articleUrl = `${siteUrl}/${lang}/blogs/${blog.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: getExcerpt(rawContent, 180),
    image: coverUrl ? [coverUrl] : undefined,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "IFundAyiti",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo-seo.jpg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  return (
    <>
      {/* Search Engine Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Header / Breadcrumbs & Title Hero */}
      <section className="relative overflow-hidden bg-linear-to-b from-sand-soft/80 via-cream to-cream pb-12 pt-28 md:pb-16 md:pt-36 border-b border-hairline/60">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-full -translate-x-1/2 overflow-hidden">
          <div className="aurora -top-24 left-1/3 h-80 w-xl opacity-30" />
          <div className="aurora top-20 right-1/4 h-72 w-96 opacity-20" />
        </div>

        <Container className="relative z-10">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumbs */}
            <Reveal>
              <div className="mb-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold">
                <Link
                  href={`/${lang}/blogs`}
                  className="group inline-flex items-center gap-1.5 text-forest hover:text-forest-deep transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  <span>{t?.BackToArticles || "All Articles"}</span>
                </Link>

                {categoryName && (
                  <>
                    <span className="text-mist/40">/</span>
                    <Link
                      href={`/${lang}/blogs?category=${categorySlug || ""}`}
                      className="text-mist hover:text-forest transition-colors truncate max-w-50"
                    >
                      {categoryName}
                    </Link>
                  </>
                )}
              </div>
            </Reveal>

            {/* Badges Row */}
            <Reveal delay={40}>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {categoryName && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 border border-forest/20 px-3.5 py-1 text-xs font-bold text-forest backdrop-blur-xs">
                    <TagIcon className="h-3 w-3 text-forest" />
                    <span>{categoryName}</span>
                  </span>
                )}

                {blog.isFeatured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 px-3.5 py-1 text-xs font-bold text-amber-700">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>{t?.Featured || "Featured Spotlight"}</span>
                  </span>
                )}
              </div>
            </Reveal>

            {/* Main Headline */}
            <Reveal delay={80}>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-forest-deep sm:text-4xl md:text-5xl lg:text-6xl md:leading-[1.14]">
                {blog.title}
              </h1>
            </Reveal>

            {/* Author, Meta & Share Controls Bar */}
            <Reveal delay={120}>
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-hairline/80 pt-6">
                {/* Author Info & Date */}
                <div className="flex items-center gap-3">
                  {authorAvatar ? (
                    <Image
                      src={authorAvatar}
                      alt={authorName}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-forest/20 shadow-xs"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-forest text-sm font-bold text-white shadow-xs">
                      {authorName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <span className="block text-sm font-bold text-forest-deep">
                      {authorName}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-mist">
                      {formattedDate && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-mist/70" />
                          <span>{formattedDate}</span>
                        </span>
                      )}
                      <span className="text-mist/40">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3 text-mist/70" />
                        <span>{readTime}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social Share Buttons */}
                <BlogShareButtons
                  title={blog.title}
                  url={articleUrl}
                  lang={lang}
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Main Reading Section */}
      <section className="py-12 md:py-16 bg-cream/30">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Featured Cover Hero Image */}
            {coverUrl && (
              <Reveal>
                <div className="relative aspect-16/9 w-full overflow-hidden rounded-3xl bg-neutral-900 shadow-xl border border-hairline/70 mb-12">
                  <Image
                    src={coverUrl}
                    alt={blog.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 900px"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            )}

            {/* Injected TipTap Rich Content */}
            <div className="mx-auto max-w-3xl">
              <Reveal delay={60}>
                <BlogContentRenderer content={rawContent} />
              </Reveal>

              {/* Tag Chips */}
              {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-hairline/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-mist mr-1">
                      {lang === "ht" ? "Tags" : "Tags"}:
                    </span>
                    {blog.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-sand-soft px-3 py-1 text-xs font-semibold text-forest-deep border border-hairline/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio Card */}
              <div className="mt-12">
                <BlogAuthorBio author={blog.author} lang={lang} />
              </div>

              {/* Bottom Social Share Bar */}
              <div className="mt-8 flex items-center justify-between border-t border-b border-hairline/70 py-4">
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  {lang === "ht" ? "Ou renmen atik sa a?" : "Enjoyed this article?"}
                </span>
                <BlogShareButtons
                  title={blog.title}
                  url={articleUrl}
                  lang={lang}
                />
              </div>
            </div>

            {/* Related Field Dispatches - Streamed under Suspense */}
            <Suspense fallback={<RelatedBlogsSkeleton />}>
              <RelatedBlogsStream
                categorySlug={categorySlug}
                currentBlogId={blog._id}
                lang={lang}
                dict={dict}
              />
            </Suspense>
          </div>
        </Container>
      </section>
    </>
  );
}

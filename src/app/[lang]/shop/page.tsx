import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";
import {
  getProductCategories,
  getProducts,
} from "@/helpers/next-fetch/shopActions";
import { ProductCard } from "@/features/shop/components/ProductCard";
import { ShopSidebar } from "@/features/shop/components/ShopSidebar";
import { ShopTopToolbar } from "@/features/shop/components/ShopTopToolbar";
import { getImageUrl } from "@/lib/getImageUrl";
import { formatPrice } from "@/lib/utils";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    category?: string;
    searchTerm?: string;
    gender?: string;
    sort?: string;
    page?: string;
    inStock?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict?.ShopPage;

  return buildMetadata({
    title: t?.Hero?.Title
      ? `${t.Hero.Title} | IFundAyiti Store`
      : "Ethical Haitian Apparel & Merch | IFundAyiti Store",
    description:
      t?.Hero?.Subtitle ||
      "100% organic cotton garments and streetwear. Every purchase directly powers community development and clean energy in Haiti.",
    path: `/${lang}/shop`,
  });
}

export default async function ShopPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const sp = await searchParams;

  const category = sp.category?.trim() || "";
  const searchTerm = sp.searchTerm?.trim() || "";
  const gender = sp.gender?.trim() || "";
  const sort = sp.sort?.trim() || "featured";
  const inStock = sp.inStock === "true";
  const page = Number(sp.page) || 1;

  // Concurrent data fetching
  const [dict, categoriesRes, productsRes, featuredRes] = await Promise.all([
    getDictionary(lang),
    getProductCategories(),
    getProducts({
      category: category === "all" ? "" : category,
      searchTerm,
      gender: gender === "all" ? "" : gender,
      sort,
      page,
      limit: 12,
    }),
    getProducts({ featured: true, limit: 1 }),
  ]);

  const t = dict?.ShopPage;
  const categories = categoriesRes?.data || [];
  let products = productsRes?.data || [];

  // In-stock client filter if requested
  if (inStock) {
    products = products.filter((p) =>
      p.variants?.some((v) => v.stock > 0 || v.isPreOrder)
    );
  }

  const pagination = productsRes?.pagination || {
    page: 1,
    limit: 12,
    total: products.length,
    totalPage: 1,
  };

  const featuredProduct = featuredRes?.data?.[0] || products[0] || null;
  const featuredImage = featuredProduct?.images?.[0]
    ? getImageUrl(featuredProduct.images[0]) || featuredProduct.images[0]
    : "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200&h=1500";

  const featuredHasDiscount =
    !!featuredProduct?.compareAtPrice &&
    featuredProduct.compareAtPrice > featuredProduct.price;
  const featuredDiscountPercent = featuredHasDiscount
    ? Math.round(
        ((featuredProduct!.compareAtPrice! - featuredProduct!.price) /
          featuredProduct!.compareAtPrice!) *
          100
      )
    : 0;

  return (
    <>
      {/* BRAND HERO SECTION */}
      <section className="relative overflow-hidden border-b border-hairline bg-cream pt-28 pb-16 md:pt-32 md:pb-20">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-sand-soft/90 via-cream to-cream" />
        <div className="aurora -right-20 top-10 h-96 w-96 opacity-40" />
        <div className="aurora -left-20 bottom-0 h-72 w-72 opacity-25" />

        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* LEFT COLUMN: Mission Narrative & Impact Badges */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-sand-soft/80 px-4 py-1.5 text-xs font-bold text-forest shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-forest" />
                <span>{t?.Hero?.Eyebrow || "Purpose-Driven Merchandise"}</span>
              </div>

              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-forest-deep sm:text-5xl lg:text-[3.25rem]">
                {t?.Hero?.Title || "Wear the Mission."}
                <span className="mt-1 block text-forest">
                  {t?.Hero?.TitleHighlight || "Ethical Haitian Apparel."}
                </span>
              </h1>

              <p className="mt-5 text-base leading-relaxed text-mist sm:text-lg max-w-2xl">
                {t?.Hero?.Subtitle ||
                  "100% organic cotton garments and embroidered streetwear. Every purchase directly powers community development, clean solar energy, and equity-free micro-grants in Haiti."}
              </p>

              {/* Trust & Impact Badges */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2.5 rounded-2xl border border-hairline/80 bg-white/85 p-3.5 text-xs font-semibold text-forest-deep shadow-2xs backdrop-blur-xs">
                  <Heart className="h-4 w-4 shrink-0 text-forest fill-forest/20" />
                  <span>{t?.Hero?.Badge1 || "100% Non-Profit Impact"}</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl border border-hairline/80 bg-white/85 p-3.5 text-xs font-semibold text-forest-deep shadow-2xs backdrop-blur-xs">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-forest" />
                  <span>{t?.Hero?.Badge2 || "Ethically Handcrafted"}</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl border border-hairline/80 bg-white/85 p-3.5 text-xs font-semibold text-forest-deep shadow-2xs backdrop-blur-xs col-span-2 sm:col-span-1">
                  <Truck className="h-4 w-4 shrink-0 text-forest" />
                  <span>{t?.Hero?.Badge3 || "Worldwide Shipping"}</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Featured Spotlight Card */}
            {featuredProduct && (
              <div className="hidden lg:block lg:col-span-5">
                <div className="relative rounded-3xl border border-hairline bg-white/95 p-5 shadow-xl backdrop-blur-md transition-all hover:shadow-2xl group">
                  <div className="absolute -top-3 -right-3 rounded-full border border-forest/30 bg-forest px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-sand shadow-md z-10">
                    Top Spotlight
                  </div>

                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-sand-soft">
                    <Image
                      src={featuredImage}
                      alt={featuredProduct.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />

                    {/* High-Contrast Discount Badge on Spotlight */}
                    {featuredHasDiscount && (
                      <div className="absolute left-3 top-3 z-10">
                        <span className="inline-flex items-center rounded-full bg-[#b91c1c] px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md border border-white/20">
                          −{featuredDiscountPercent}% {t?.Card?.SaleBadge || "OFF"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest">
                        {typeof featuredProduct.category === "object"
                          ? featuredProduct.category.name
                          : featuredProduct.category || "Apparel"}
                      </p>
                      <h3 className="font-display text-lg font-semibold text-forest-deep truncate max-w-[240px]">
                        {featuredProduct.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-lg font-bold text-forest">
                        {formatPrice(featuredProduct.price)}
                      </span>
                      {featuredHasDiscount && (
                        <span className="block text-[11px] text-faint line-through">
                          {formatPrice(featuredProduct.compareAtPrice!)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-xs">
                    {typeof featuredProduct.sold === "number" &&
                    featuredProduct.sold > 0 ? (
                      <span className="flex items-center gap-1 font-bold text-forest-deep">
                        <Flame className="h-3.5 w-3.5 text-terracotta" />
                        {featuredProduct.sold} {t?.Card?.UnitsSold || "sold"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-semibold text-forest-deep">
                        <Star className="h-3.5 w-3.5 fill-forest text-forest" />
                        4.9 (Verified Quality)
                      </span>
                    )}
                    <Link
                      href={`/${lang}/shop/${featuredProduct._id}`}
                      className="font-bold text-forest hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* SHOP CATALOG SECTION WITH LEFT SIDEBAR */}
      <section className="py-12 md:py-20 min-h-[60vh]">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            {/* LEFT SIDEBAR: Category selection, gender, in-stock */}
            <Suspense fallback={null}>
              <ShopSidebar
                categories={categories}
                totalResults={pagination.total}
                lang={lang}
                dict={dict}
              />
            </Suspense>

            {/* RIGHT CONTENT AREA: Top Toolbar + Product Grid */}
            <div className="lg:col-span-9">
              {/* Top search & sort toolbar */}
              <Suspense fallback={null}>
                <ShopTopToolbar
                  totalResults={pagination.total}
                  lang={lang}
                  dict={dict}
                />
              </Suspense>

              {/* Product Grid or Empty State */}
              {products.length === 0 ? (
                <div className="mt-12 rounded-3xl border border-dashed border-hairline bg-sand-soft/30 px-8 py-20 text-center">
                  <p className="font-display text-2xl text-forest-deep font-semibold">
                    {t?.Empty?.Title || "No products found"}
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-mist leading-relaxed">
                    {t?.Empty?.Body ||
                      "Try changing your search term, adjusting filters, or switching categories to explore the collection."}
                  </p>
                  <Link
                    href={`/${lang}/shop`}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-forest px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-forest/90"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>{t?.Empty?.ResetBtn || "Explore All Products"}</span>
                  </Link>
                </div>
              ) : (
                /* 2-Column on Mobile & Tablet, 3-Column on Desktop! */
                <div className="mt-8 grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      lang={lang}
                      dict={dict}
                    />
                  ))}
                </div>
              )}

              {/* PAGINATION CONTROLS */}
              {pagination.totalPage > 1 && (
                <div className="mt-14 flex items-center justify-center gap-2 border-t border-hairline pt-8">
                  {/* Prev Button */}
                  {pagination.page > 1 ? (
                    <Link
                      href={`/${lang}/shop?page=${pagination.page - 1}${
                        category ? `&category=${category}` : ""
                      }${gender ? `&gender=${gender}` : ""}${
                        searchTerm ? `&searchTerm=${searchTerm}` : ""
                      }${sort ? `&sort=${sort}` : ""}${
                        inStock ? `&inStock=true` : ""
                      }`}
                      scroll={false}
                      className="flex h-10 items-center gap-1 rounded-xl border border-hairline bg-white px-3 text-xs font-semibold text-forest-deep shadow-2xs hover:bg-sand-soft"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Prev</span>
                    </Link>
                  ) : null}

                  {/* Page Numbers */}
                  {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map(
                    (p) => (
                      <Link
                        key={p}
                        href={`/${lang}/shop?page=${p}${
                          category ? `&category=${category}` : ""
                        }${gender ? `&gender=${gender}` : ""}${
                          searchTerm ? `&searchTerm=${searchTerm}` : ""
                        }${sort ? `&sort=${sort}` : ""}${
                          inStock ? `&inStock=true` : ""
                        }`}
                        scroll={false}
                        className={`grid h-10 w-10 place-items-center rounded-xl text-xs font-bold transition-colors ${
                          p === pagination.page
                            ? "bg-forest text-white shadow-xs"
                            : "border border-hairline bg-white text-forest-deep hover:bg-sand-soft"
                        }`}
                      >
                        {p}
                      </Link>
                    )
                  )}

                  {/* Next Button */}
                  {pagination.page < pagination.totalPage ? (
                    <Link
                      href={`/${lang}/shop?page=${pagination.page + 1}${
                        category ? `&category=${category}` : ""
                      }${gender ? `&gender=${gender}` : ""}${
                        searchTerm ? `&searchTerm=${searchTerm}` : ""
                      }${sort ? `&sort=${sort}` : ""}${
                        inStock ? `&inStock=true` : ""
                      }`}
                      scroll={false}
                      className="flex h-10 items-center gap-1 rounded-xl border border-hairline bg-white px-3 text-xs font-semibold text-forest-deep shadow-2xs hover:bg-sand-soft"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

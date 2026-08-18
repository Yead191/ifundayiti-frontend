import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/shop/product-detail";
import { getProductBySlug, SHOP_PRODUCTS } from "@/data/shop";
import { buildMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SHOP_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return buildMetadata({
      title: "Product not found",
      description: "This IFundAyiti product could not be found.",
      path: `/product/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: product.name,
    description: product.description.slice(0, 160),
    path: `/product/${slug}`,
    image: product.images[0],
    keywords: [product.name, "IFundAyiti shop", product.category],
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}

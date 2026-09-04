import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getProducts,
  getSingleProduct,
  type ApparelProduct,
} from "@/helpers/next-fetch/shopActions";
import { ProductDetailView } from "@/features/shop/components/ProductDetailView";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const productRes = await getSingleProduct(slug);
  const product = productRes.data;

  if (!product) {
    return buildMetadata({
      title: "Product Not Found | IFundAyiti",
      description: "The requested apparel product could not be found.",
      path: `/${lang}/shop/${slug}`,
      noIndex: true,
    });
  }

  const categoryName =
    typeof product.category === "object" && product.category
      ? product.category.name
      : product.category || "Apparel";

  // Strip HTML tags for clean meta description
  const cleanDescription = product.description
    ? product.description.replace(/<[^>]*>?/gm, "").slice(0, 160)
    : "Ethical apparel handcrafted to power grassroots Haitian development.";

  return buildMetadata({
    title: `${product.name} | IFundAyiti Store`,
    description: cleanDescription,
    path: `/${lang}/shop/${slug}`,
    image: product.images?.[0] || undefined,
    keywords: [
      product.name,
      categoryName,
      "IFundAyiti apparel",
      "ethical streetwear Haiti",
    ],
  });
}

export default async function ShopDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;

  // Concurrent fetch for product and dictionary
  const [dict, productRes] = await Promise.all([
    getDictionary(lang),
    getSingleProduct(slug),
  ]);

  const product = productRes.data;
  if (!product) {
    notFound();
  }

  // Fetch related products in the same category
  const categoryId =
    typeof product.category === "object" && product.category
      ? product.category._id
      : product.category;

  const relatedRes = await getProducts({
    category: categoryId,
    limit: 6,
  });

  let relatedProducts: ApparelProduct[] = (relatedRes?.data || []).filter(
    (p) => p._id !== product._id,
  );

  // If fewer than 4 related in the same category, fetch additional general products
  if (relatedProducts.length < 4) {
    const fallbackRes = await getProducts({ limit: 8 });
    const fallbackList = (fallbackRes?.data || []).filter(
      (p) =>
        p._id !== product._id && !relatedProducts.some((r) => r._id === p._id),
    );
    relatedProducts = [...relatedProducts, ...fallbackList].slice(0, 4);
  } else {
    relatedProducts = relatedProducts.slice(0, 4);
  }

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
      lang={lang}
      dict={dict}
    />
  );
}

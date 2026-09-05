import type { Metadata } from "next";
import { getCart } from "@/helpers/next-fetch/cartActions";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { CartClient } from "./CartClient";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const isHt = lang === "ht";
  return buildMetadata({
    title: isHt ? "Panyen Acha | IFundAyiti" : "Shopping Bag | IFundAyiti",
    description: isHt
      ? "Revize atik ak rad ou chwazi nan panyen IFundAyiti ou anvan ou finalize kòmand lan."
      : "Review your selected apparel items in your IFundAyiti shopping bag before checkout.",
    path: `/${lang}/cart`,
    noIndex: true,
  });
}

export default async function CartPage({ params }: PageProps) {
  const { lang } = await params;
  const [cartRes, dict] = await Promise.all([
    getCart(),
    getDictionary(lang),
  ]);
  const cart = cartRes.success && cartRes.data ? cartRes.data : null;

  return <CartClient cart={cart} lang={lang} dict={dict} />;
}

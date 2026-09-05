import type { Metadata } from "next";
import { getCart } from "@/helpers/next-fetch/cartActions";
import getProfile from "@/helpers/next-fetch/getProfile";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { CheckoutClient } from "./CheckoutClient";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const isHt = lang === "ht";
  return buildMetadata({
    title: isHt ? "Peman An Sekirite | IFundAyiti" : "Secure Checkout | IFundAyiti",
    description: isHt
      ? "Finalize kòmand ou an sekirite sou IFundAyiti."
      : "Complete your order securely through IFundAyiti.",
    path: `/${lang}/checkout`,
    noIndex: true,
  });
}

export default async function CheckoutPage({ params }: PageProps) {
  const { lang } = await params;
  const [user, cartRes, dict] = await Promise.all([
    getProfile(),
    getCart(),
    getDictionary(lang),
  ]);
  const cart = cartRes.success && cartRes.data ? cartRes.data : null;

  return <CheckoutClient user={user} cart={cart} lang={lang} dict={dict} />;
}

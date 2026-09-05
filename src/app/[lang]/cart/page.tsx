import { getCart } from "@/helpers/next-fetch/cartActions";
import { CartClient } from "./CartClient";

export default async function CartPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const res = await getCart();
  const cart = res.success && res.data ? res.data : null;

  return <CartClient cart={cart} lang={lang} />;
}

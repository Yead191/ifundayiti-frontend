import { getCart } from "@/helpers/next-fetch/cartActions";
import getProfile from "@/helpers/next-fetch/getProfile";
import { CheckoutClient } from "./CheckoutClient";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const user = await getProfile();
  const cartRes = await getCart();
  const cart = cartRes.success && cartRes.data ? cartRes.data : null;

  return <CheckoutClient user={user} cart={cart} lang={lang} />;
}

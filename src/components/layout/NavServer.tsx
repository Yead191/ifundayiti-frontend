import getProfile from "@/helpers/next-fetch/getProfile";
import { Navbar } from "./navbar";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import type { CartData } from "@/types";

export default async function NavServer() {
  const user = await getProfile();
  let cart: CartData | null = null;
  if (user) {
    const res = await nextFetch<CartData>("/cart", {
      method: "GET",
      cache: "no-store",
      tags: ["cart"],
    });
    if (res.success && res.data) cart = res.data;
  }
  return <Navbar user={user} cart={cart} />;
}

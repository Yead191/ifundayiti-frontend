import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PaymentSuccessRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const cookieStore = await cookies();
  const localeCookie =
    cookieStore.get("NEXT_LOCALE")?.value || cookieStore.get("lang")?.value;

  let lang = "en";
  if (localeCookie === "ht") {
    lang = "ht";
  } else if (!localeCookie) {
    const headerList = await headers();
    const acceptLang = headerList.get("accept-language") || "";
    if (acceptLang.toLowerCase().includes("ht")) {
      lang = "ht";
    }
  }

  const params = await searchParams;
  const queryString = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      queryString.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => queryString.append(key, v));
    }
  }

  const qs = queryString.toString();
  redirect(`/${lang}/payment/success${qs ? `?${qs}` : ""}`);
}

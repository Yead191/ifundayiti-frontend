import { redirect } from "next/navigation";

export default async function BlogRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang } = await params;
  const sp = await searchParams;
  const urlParams = new URLSearchParams();

  Object.entries(sp).forEach(([key, val]) => {
    if (typeof val === "string") {
      urlParams.set(key, val);
    }
  });

  const qs = urlParams.toString();
  redirect(`/${lang}/blogs${qs ? `?${qs}` : ""}`);
}

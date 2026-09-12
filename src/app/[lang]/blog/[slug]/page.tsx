import { redirect } from "next/navigation";

export default async function SingleBlogRedirectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  redirect(`/${lang}/blogs/${slug}`);
}

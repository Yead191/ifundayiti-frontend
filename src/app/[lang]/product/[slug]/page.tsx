import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function LegacyProductPage({ params }: PageProps) {
  const { lang, slug } = await params;
  redirect(`/${lang}/shop/${slug}`);
}

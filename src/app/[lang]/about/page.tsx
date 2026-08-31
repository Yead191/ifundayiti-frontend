import type { Metadata } from "next";

import AboutPageContent from "@/features/about";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return buildMetadata({
    title: dict.Navbar.About,
    description: dict.AboutPage.Story.Subtitle,
    path: `/${lang}/about`,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <AboutPageContent lang={lang} />;
}

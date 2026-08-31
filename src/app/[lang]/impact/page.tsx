import type { Metadata } from "next";

import ImpactPageContent from "@/features/impact";
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
    title: dict.Navbar.Impact,
    description: dict.ImpactPage.Hero.Subtitle,
    path: `/${lang}/impact`,
  });
}

export default async function ImpactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <ImpactPageContent lang={lang} />;
}

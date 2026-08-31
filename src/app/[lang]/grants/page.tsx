import type { Metadata } from "next";

import GrantsPageContent from "@/features/grants";
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
    title: dict.Navbar.Grants,
    description: dict.GrantsPage.Hero.Subtitle,
    path: `/${lang}/grants`,
  });
}

export default async function GrantsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <GrantsPageContent lang={lang} />;
}

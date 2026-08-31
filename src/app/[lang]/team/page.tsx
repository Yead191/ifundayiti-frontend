import type { Metadata } from "next";

import TeamPageContent from "@/features/team";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.TeamPage.Metadata;

  return buildMetadata({
    title: t.Title,
    description: t.Description,
    path: `/${lang}/team`,
    keywords: [
      "IFundAyiti Team",
      "Haiti micro-grant board",
      "Haiti volunteers",
      "Haitian non-profit directors",
      "community leaders Haiti",
    ],
  });
}

export default async function TeamPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  return <TeamPageContent lang={lang} searchParams={searchParams} />;
}

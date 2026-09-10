import type { Metadata } from "next";
import { getFaqs } from "@/helpers/next-fetch/faqActions";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { FAQ_GROUPS } from "@/data/faq";
import type { IFAQ } from "@/types";
import { FaqShowcase } from "@/features/faq/components/FaqShowcase";

interface FaqPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: FaqPageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict?.FaqPage;

  return buildMetadata({
    title: t?.Hero?.Title || "Frequently Asked Questions",
    description:
      t?.Hero?.Subtitle ||
      "Answers about IFundAyiti grants, applications, donations, and the community shop.",
    path: `/${lang}/faq`,
  });
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { lang } = await params;

  const [dict, faqsRes] = await Promise.all([
    getDictionary(lang),
    getFaqs({ limit: 100 }),
  ]);

  // Use API categories if available; fallback to default FAQ_GROUPS if API data is not yet seeded
  const apiCategories = faqsRes?.data || [];
  const categories: IFAQ[] =
    apiCategories.length > 0
      ? apiCategories
      : FAQ_GROUPS.map((group, index) => ({
          _id: group.id,
          title: group.title,
          items: group.items,
          isActive: true,
          order: index,
        }));

  return (
    <FaqShowcase categories={categories} lang={lang} dict={dict} />
  );
}

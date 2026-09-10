import { Suspense } from "react";
import type { Metadata } from "next";
import { getFaqs } from "@/helpers/next-fetch/faqActions";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/seo";
import type { IFAQ } from "@/types";
import { FaqShowcase } from "@/features/faq/components/FaqShowcase";
import FaqLoading from "./loading";

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

async function FaqDataLoader({ lang }: { lang: string }) {
  const [dict, faqsRes] = await Promise.all([
    getDictionary(lang),
    getFaqs({ limit: 100 }),
  ]);

  // Use only live API data, no demo data fallback
  const categories: IFAQ[] = faqsRes?.data || [];

  return <FaqShowcase categories={categories} lang={lang} dict={dict} />;
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { lang } = await params;

  return (
    <Suspense fallback={<FaqLoading />}>
      <FaqDataLoader lang={lang} />
    </Suspense>
  );
}

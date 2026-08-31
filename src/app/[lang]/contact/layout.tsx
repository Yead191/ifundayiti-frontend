import type { Metadata } from "next";
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
    title: dict.Navbar.Contact,
    description: dict.ContactPage.Hero.Subtitle,
    path: `/${lang}/contact`,
  });
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

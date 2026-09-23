import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";
import { ContactClient } from "./ContactClient";

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return buildMetadata({
    title: dict?.Navbar?.Contact
      ? `${dict.Navbar.Contact} | IFundAyiti`
      : "Contact IFundAyiti",
    description:
      dict?.ContactPage?.Hero?.Subtitle ||
      "Have questions about grants, donations, or merchandise? We are here to help.",
    path: `/${lang}/contact`,
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <ContactClient lang={lang} dict={dict} />;
}

import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/legal-layout";
import { buildMetadata } from "@/lib/seo";
import { getDisclaimer } from "@/helpers/next-fetch/getDisclaimer";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using the IFundAyiti website, grant applications, donations, and shop.",
  path: "/terms",
  keywords: ["IFundAyiti terms", "terms and conditions", "user terms"],
});

export default async function TermsPage() {
  const html = await getDisclaimer("user-terms");
  return <LegalLayout title="Terms & Conditions" html={html} />;
}

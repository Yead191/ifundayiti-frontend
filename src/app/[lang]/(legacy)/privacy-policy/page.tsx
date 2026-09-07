import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/legal-layout";
import { buildMetadata } from "@/lib/seo";
import { getDisclaimer } from "@/helpers/next-fetch/getDisclaimer";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How IFundAyiti collects, uses, and protects personal information submitted through applications, donations, and the shop.",
  path: "/privacy-policy",
});

export default async function PrivacyPolicyPage() {
  const html = await getDisclaimer("privacy");
  return <LegalLayout title="Privacy Policy" html={html}></LegalLayout>;
}

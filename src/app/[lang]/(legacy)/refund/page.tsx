import type { Metadata } from "next";

import { LegalLayout } from "@/components/layout/legal-layout";
import { getDisclaimer } from "@/helpers/next-fetch/getDisclaimer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Refund Policy",
  description:
    "Understand IFundAyiti refund guidelines for donations, grants, and shop purchases.",
  path: "/refund",
  keywords: ["IFundAyiti refund policy", "donation refunds", "return policy"],
});

export default async function RefundPolicyPage() {
  const html = await getDisclaimer("refund");

  return <LegalLayout title="Refund Policy" html={html} />;
}

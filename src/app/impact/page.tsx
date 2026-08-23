import type { Metadata } from "next";

import ImpactPageContent from "@/features/impact";
import { IMPACT_PAGE } from "@/data/impact-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(IMPACT_PAGE.metadata);

export default function ImpactPage() {
  return <ImpactPageContent />;
}

import type { Metadata } from "next";

import GrantsPageContent from "@/features/grants";
import { GRANTS_PAGE } from "@/data/grants-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(GRANTS_PAGE.metadata);

export default function GrantsPage() {
  return <GrantsPageContent />;
}

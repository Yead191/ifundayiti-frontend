import type { Metadata } from "next";

import AboutPageContent from "@/features/about";
import { ABOUT_PAGE } from "@/data/about";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(ABOUT_PAGE.metadata);

export default function AboutPage() {
  return <AboutPageContent />;
}

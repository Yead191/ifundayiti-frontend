import type { Metadata } from "next";

import TeamPageContent from "@/features/team";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our Team — Directors, Members & Volunteers",
  description:
    "Meet the board of directors, core operations team, and community volunteers driving transparent micro-grants across Haiti and the diaspora with IFundAyiti.",
  path: "/team",
  keywords: [
    "IFundAyiti Team",
    "Haiti micro-grant board",
    "Haiti volunteers",
    "Haitian non-profit directors",
    "community leaders Haiti",
  ],
});

export default function TeamPage() {
  return <TeamPageContent />;
}

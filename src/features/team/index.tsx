import { TeamHero } from "@/features/team/sections/team-hero";
import { TeamValues } from "@/features/team/sections/team-values";
import { TeamGrid } from "@/features/team/sections/team-grid";
import { TeamCta } from "@/features/team/sections/team-cta";

export default function TeamPageContent() {
  return (
    <div className="min-h-screen bg-cream">
      <TeamHero />
      <TeamValues />
      <TeamGrid />
      <TeamCta />
    </div>
  );
}

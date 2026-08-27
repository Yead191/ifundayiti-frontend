import { FeaturedProjects } from "@/components/home/featured-projects";
import { ImpactCta } from "@/features/impact/sections/cta";
import { ImpactFundFlow } from "@/features/impact/sections/fund-flow";
import { ImpactHero } from "@/features/impact/sections/hero";
import { ImpactMetrics } from "@/features/impact/sections/metrics";
import { ImpactSuccessStory } from "@/features/impact/sections/success-story";
import { ImpactWinners } from "@/features/impact/sections/winners";
import { ImpactFinalists } from "@/features/impact/sections/finalists";

export default function ImpactPageContent() {
  return (
    <>
      <ImpactHero />
      <ImpactMetrics />
      <FeaturedProjects id="projects" />
      <ImpactSuccessStory />
      <ImpactFundFlow />
      <ImpactWinners />
      <ImpactFinalists />
      <ImpactCta />
    </>
  );
}

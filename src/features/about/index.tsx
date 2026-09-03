import { AboutAudiences } from "@/features/about/sections/audiences";
import { AboutConnectCta } from "@/features/about/sections/connect-cta";
import { AboutGovernance } from "@/features/about/sections/governance";
import { AboutHero } from "@/features/about/sections/hero";
import { AboutPrinciples } from "@/features/about/sections/principles";
import { AboutStory } from "@/features/about/sections/story";
import { AboutTeam } from "@/features/about/sections/team";

export default function AboutPageContent({ lang }: { lang: string }) {
  return (
    <>
      <AboutHero lang={lang} />
      <AboutStory lang={lang} />
      <AboutPrinciples lang={lang} />
      <AboutAudiences lang={lang} />
      <AboutGovernance lang={lang} />
      <AboutConnectCta lang={lang} />
      {/* <AboutTeam lang={lang} /> */}
    </>
  );
}

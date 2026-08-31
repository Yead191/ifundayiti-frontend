import { LeadershipSection } from "@/components/home/people-sections";
import { ABOUT_TEAM } from "@/data/about";

export function AboutTeam({ lang }: { lang: string }) {
  return (
    <div id={ABOUT_TEAM.id} className="scroll-mt-24">
      <LeadershipSection lang={lang} />
    </div>
  );
}

import { GrantsApplyCta } from "@/features/grants/sections/apply-cta";
import { GrantsCurrentCycle } from "@/features/grants/sections/current-cycle";
import { GrantsFaq } from "@/features/grants/sections/faq";
import { GrantsHero } from "@/features/grants/sections/hero";
import { GrantsHistory } from "@/features/grants/sections/history";
import { GrantsPrepare } from "@/features/grants/sections/prepare";
import { GrantsSelection } from "@/features/grants/sections/selection";

export default function GrantsPageContent({ lang }: { lang: string }) {
  return (
    <>
      <GrantsHero lang={lang} />
      <GrantsCurrentCycle lang={lang} />
      <GrantsPrepare lang={lang} />
      <GrantsSelection lang={lang} />
      <GrantsFaq lang={lang} />
      <GrantsHistory lang={lang} />
      <GrantsApplyCta lang={lang} />
    </>
  );
}

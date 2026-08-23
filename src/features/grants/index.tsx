import { GrantsApplyCta } from "@/features/grants/sections/apply-cta";
import { GrantsCurrentCycle } from "@/features/grants/sections/current-cycle";
import { GrantsFaq } from "@/features/grants/sections/faq";
import { GrantsHero } from "@/features/grants/sections/hero";
import { GrantsHistory } from "@/features/grants/sections/history";
import { GrantsPrepare } from "@/features/grants/sections/prepare";
import { GrantsSelection } from "@/features/grants/sections/selection";

export default function GrantsPageContent() {
  return (
    <>
      <GrantsHero />
      <GrantsCurrentCycle />
      <GrantsPrepare />
      <GrantsSelection />
      <GrantsFaq />
      <GrantsHistory />
      <GrantsApplyCta />
    </>
  );
}

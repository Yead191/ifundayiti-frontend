import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { CURRENT_PERIOD } from "@/data/grant";
import { GRANTS_CTA } from "@/data/grants-page";

export function GrantsApplyCta() {
  const open = CURRENT_PERIOD.status === "Open";

  return (
    <section className="pb-24 md:pb-32">
      <Container>
        <Reveal className="overflow-hidden rounded-[1.75rem] border border-hairline bg-white p-8 shadow-[0_24px_60px_-40px_rgba(11,61,46,0.4)] md:p-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="font-display text-3xl font-semibold leading-snug text-forest-deep md:text-4xl">
                {open ? GRANTS_CTA.openTitle : GRANTS_CTA.closedTitle}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-mist">
                {open ? GRANTS_CTA.openBody : GRANTS_CTA.closedBody}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:flex-col">
              <Button asChild size="lg" className="rounded-xl">
                <Link href={open ? GRANTS_CTA.primaryOpen.href : GRANTS_CTA.primaryClosed.href}>
                  {open ? GRANTS_CTA.primaryOpen.label : GRANTS_CTA.primaryClosed.label}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <Link href={open ? GRANTS_CTA.secondaryOpen.href : GRANTS_CTA.secondaryClosed.href}>
                  {open ? GRANTS_CTA.secondaryOpen.label : GRANTS_CTA.secondaryClosed.label}
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

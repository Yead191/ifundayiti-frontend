import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { ABOUT_CONNECT } from "@/data/about";

export function AboutConnectCta() {
  return (
    <section className="py-20 md:py-24">
      <Container>
        <Reveal className="overflow-hidden rounded-[1.75rem] border border-hairline bg-linear-to-br from-forest via-forest to-forest-deep p-8 text-white md:p-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sand">
                <Users className="h-3.5 w-3.5" />
                {ABOUT_CONNECT.eyebrow}
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-snug md:text-4xl">
                {ABOUT_CONNECT.title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-sand/90">
                {ABOUT_CONNECT.body}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:flex-col">
              <Button asChild size="lg" variant="secondary" className="rounded-xl">
                <Link href={ABOUT_CONNECT.primaryCta.href}>
                  {ABOUT_CONNECT.primaryCta.label}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/15"
              >
                <Link href={ABOUT_CONNECT.secondaryCta.href}>
                  {ABOUT_CONNECT.secondaryCta.label}
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

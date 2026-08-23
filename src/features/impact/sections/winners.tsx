import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { IMPACT_WINNERS } from "@/data/impact-page";
import { WINNERS } from "@/data/projects";
import { formatPrice } from "@/lib/utils";

export function ImpactWinners() {
  return (
    <section
      id={IMPACT_WINNERS.id}
      className="scroll-mt-24 border-y border-hairline bg-cream-dark py-24 md:py-32"
    >
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            className="sm:max-w-2xl"
            eyebrow={IMPACT_WINNERS.eyebrow}
            title={IMPACT_WINNERS.title}
            subtitle={IMPACT_WINNERS.subtitle}
          />
          <Link
            href={IMPACT_WINNERS.viewAllHref}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-forest transition-colors hover:text-forest-deep"
          >
            {IMPACT_WINNERS.viewAllLabel}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {WINNERS.map((winner, index) => (
            <Reveal key={winner.id} delay={index * 80}>
              <Link
                href={`/winners/${winner.slug}`}
                className="group flex h-full overflow-hidden rounded-[1.5rem] border border-hairline bg-white shadow-[0_20px_50px_-40px_rgba(11,61,46,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-forest/25 hover:shadow-[0_28px_60px_-36px_rgba(11,61,46,0.4)]"
              >
                <div className="relative hidden w-36 shrink-0 sm:block md:w-40">
                  <Image
                    src={winner.photoUrl}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="160px"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest">
                    {winner.period}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-forest-deep">
                    {winner.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-mist">
                    {winner.projectName}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-sm">
                    <span className="font-display text-lg font-semibold text-forest">
                      {formatPrice(winner.awardedAmount)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-faint">
                      <MapPin className="h-3.5 w-3.5" />
                      {winner.location}
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

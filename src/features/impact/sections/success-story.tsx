import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { IMPACT_SUCCESS } from "@/data/impact-page";
import { WINNERS } from "@/data/projects";
import { formatPrice } from "@/lib/utils";

export function ImpactSuccessStory() {
  const winner = WINNERS[0];
  if (!winner) return null;

  return (
    <section
      id={IMPACT_SUCCESS.id}
      className="scroll-mt-24 overflow-hidden bg-sand-soft/50 py-24 md:py-32"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="relative lg:col-span-6">
            <div className="group relative aspect-4/5 overflow-hidden rounded-[1.75rem] bg-sand-soft shadow-[0_28px_70px_-40px_rgba(11,61,46,0.45)] sm:aspect-4/3 lg:aspect-4/5">
              <Image
                src={winner.photoUrl}
                alt={winner.name}
                fill
                className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-forest/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-8">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sand/85">
                  <MapPin className="h-3.5 w-3.5" />
                  {winner.location}
                </p>
                <p className="mt-2 font-display text-2xl font-semibold text-white">
                  {winner.name}
                </p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-6">
            <Reveal>
              <span className="eyebrow">{IMPACT_SUCCESS.eyebrow}</span>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-forest-deep md:text-5xl">
                {winner.projectName}
              </h2>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-forest">
                {winner.period} · {formatPrice(winner.awardedAmount)}
              </p>
              <p className="mt-6 text-lg leading-relaxed text-mist">
                {winner.story}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <blockquote className="mt-8 flex gap-3 rounded-2xl border border-hairline bg-white/80 p-5">
                <Quote className="mt-0.5 h-5 w-5 shrink-0 text-forest/40" />
                <p className="font-display text-lg leading-snug text-forest-deep">
                  {IMPACT_SUCCESS.pullQuote}
                </p>
              </blockquote>
              <Button asChild size="lg" className="mt-8 rounded-xl">
                <Link href={`/winners/${winner.slug}`}>
                  {IMPACT_SUCCESS.ctaLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

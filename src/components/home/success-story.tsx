import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { WINNERS } from "@/data/projects";
import { formatPrice } from "@/lib/utils";

export function SuccessStory({ id }: { id?: string }) {
  const winner = WINNERS[0];
  if (!winner) return null;

  return (
    <section id={id} className="scroll-mt-28 bg-cream-dark py-24 md:py-32">
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <div className="relative aspect-4/5 overflow-hidden rounded-[1.75rem] sm:aspect-4/3 lg:aspect-[4/5]">
            <Image
              src={winner.photoUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Reveal>
        <Reveal delay={80} className="lg:col-span-6">
          <p className="eyebrow">Winner story</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-forest-deep md:text-5xl">
            {winner.name}
          </h2>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-forest">
            {winner.projectName} · {formatPrice(winner.awardedAmount)}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-mist">{winner.story}</p>
          <Button asChild className="mt-10" size="lg">
            <Link href={`/winners/${winner.slug}`}>Read the full story</Link>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}

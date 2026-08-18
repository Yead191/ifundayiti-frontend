import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { WINNERS } from "@/data/projects";
import { formatPrice } from "@/lib/utils";

export function SuccessStory({ id }: { id?: string }) {
  const winner = WINNERS[0];
  if (!winner) return null;

  return (
    <section id={id} className="scroll-mt-24 bg-cream-dark py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative aspect-4/5 overflow-hidden rounded-2xl sm:aspect-4/3 lg:aspect-4/5">
          <Image
            src={winner.photoUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="eyebrow">Winner story</p>
          <h2 className="mt-3 font-display text-3xl text-forest-deep sm:text-4xl">
            {winner.name}
          </h2>
          <p className="mt-2 text-sm font-semibold text-forest">
            {winner.projectName} · {formatPrice(winner.awardedAmount)}
          </p>
          <p className="mt-5 text-base leading-relaxed text-mist">{winner.story}</p>
          <Button asChild className="mt-8">
            <Link href={`/winners/${winner.slug}`}>Read full story</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

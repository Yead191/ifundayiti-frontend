import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { getImageUrl } from "@/lib/getImageUrl";
import { formatPrice } from "@/lib/utils";

export async function SuccessStory({ id }: { id?: string }) {
  const res = await nextFetch("/application?status=winner&limit=1", {
    cache: "default",
  });
  const winners = res.success ? res.data || [] : [];
  const winner = winners[0];

  if (!winner) return null;

  return (
    <section id={id} className="scroll-mt-28 bg-cream-dark py-24 md:py-32">
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <div className="relative aspect-4/5 overflow-hidden rounded-[1.75rem] sm:aspect-4/3 lg:aspect-4/5">
            <Image
              src={getImageUrl(winner.personal?.image) || ""}
              alt={winner.personal?.name || ""}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Reveal>
        <Reveal delay={80} className="lg:col-span-6">
          <p className="eyebrow">Winner story</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-forest-deep md:text-5xl">
            {winner.personal?.name}
          </h2>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-forest">
            {winner.grant?.projectName} ·{" "}
            {formatPrice(winner.awardedAmount || winner.grant?.budget || 0)}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-mist">
            {winner.successStory || winner.grant?.expectedImpact}
          </p>
          <Button asChild className="mt-10" size="lg">
            <Link href={`/winners/${winner._id}`}>Read the full story</Link>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}

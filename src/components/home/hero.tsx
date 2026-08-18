import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { CURRENT_PERIOD } from "@/data/grant";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1600&h=1100";

export function HomeHero() {
  const open = CURRENT_PERIOD.status === "Open";

  return (
    <section className="relative overflow-hidden bg-forest pt-24 text-white md:pt-28">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Community gathering in Haiti"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/75 to-forest/45" />
      </div>

      <Container className="relative pb-28 pt-10 md:pb-36 md:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sand">
          IFundAyiti Grant Program
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.06] text-white sm:text-5xl md:text-6xl">
          Funding Haitian ideas that feed, light, and lift communities.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-sand/95 sm:text-lg">
          IFundAyiti awards equity-free micro-grants of up to $1,000 so local
          builders can turn practical ideas into lasting impact.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="secondary">
            <Link href={open ? "/apply" : "/grants"}>Apply for a Grant</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="border-white/30 bg-white/10 text-white hover:bg-white/20"
          >
            <Link href="/donate">Support Our Mission</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

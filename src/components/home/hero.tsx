import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { CURRENT_PERIOD } from "@/data/grant";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1800&h=1200";

export function HomeHero() {
  const open = CURRENT_PERIOD.status === "Open";

  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-forest pt-24 text-white md:min-h-[82vh] ">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Community gathering in Haiti"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-forest via-forest/75 to-forest/25" />
        <div className="absolute inset-0 bg-linear-to-t from-forest via-transparent to-forest/40" />
      </div>

      <Container className="relative flex min-h-[calc(88vh-8rem)] flex-col justify-center pb-32 pt-16 md:min-h-[calc(40vh-7rem)] md:pb-40 md:pt-6">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sand backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-sand" />
            {open ? "Applications open" : "Grant program"}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 max-w-3xl font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
            Capital for ideas
            <span className="block text-sand">rooted in Ayiti.</span>
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-sand/95 sm:text-lg">
            Equity-free micro-grants of up to $1,000 for Haitian builders —
            food, light, water, craft, and livelihoods that stay in the neighborhood.
          </p>
        </Reveal>
        <Reveal delay={200} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="secondary">
            <Link href={open ? "/apply" : "/grants"}>Apply for a Grant</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="border border-white/25 bg-white/10 text-white hover:bg-white/20"
          >
            <Link href="/projects">Explore the work</Link>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}

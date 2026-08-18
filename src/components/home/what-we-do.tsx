import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";

export function WhatWeDo() {
  return (
    <section className="py-24 md:py-32">
      <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="relative lg:col-span-6">
          <div className="relative aspect-4/5 overflow-hidden rounded-[1.75rem] bg-sand-soft sm:aspect-4/3 lg:aspect-[4/5]">
            <Image
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1200&h=1500"
              alt="Agricultural work in a community field"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Reveal>
        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow">What we do</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-forest-deep md:text-5xl">
              Small grants. Local hands. Visible change.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-mist">
              IFundAyiti moves practical capital to Haitian entrepreneurs and
              community builders — without equity, and without tying a gift to
              one applicant.
            </p>
            <blockquote className="mt-8 border-l-2 border-forest pl-5 font-display text-xl leading-snug text-forest-deep">
              Donations fund the program. Grants fund the work.
            </blockquote>
            <Button asChild className="mt-10" size="lg">
              <Link href="/about">Our story</Link>
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

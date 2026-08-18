import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";

export function WhatWeDo() {
  return (
    <section className="py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-sand-soft sm:aspect-4/3 lg:aspect-4/5">
          <Image
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1000&h=1200"
            alt="Agricultural work in a community field"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <SectionHeading
            align="left"
            eyebrow="What we do"
            title="A grant program for people building where they live."
            subtitle="IFundAyiti exists to move small, practical capital to Haitian entrepreneurs and community builders — without equity, and without tying gifts to a single applicant."
          />
          <Button asChild className="mt-8">
            <Link href="/about">Learn more</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

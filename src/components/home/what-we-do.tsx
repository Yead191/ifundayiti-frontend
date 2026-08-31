"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { useTranslation } from "@/components/providers/translation-provider";

export function WhatWeDo() {
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] === "ht" ? "ht" : "en";
  const dict = useTranslation();
  const t = dict.WhatWeDo;

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
            <p className="eyebrow">{t.Eyebrow}</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-forest-deep md:text-5xl">
              {t.Title}
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-mist">
              {t.Description}
            </p>
            <blockquote className="mt-8 border-l-2 border-forest pl-5 font-display text-xl leading-snug text-forest-deep">
              {t.Quote}
            </blockquote>
            <Button asChild className="mt-10" size="lg">
              <Link href={`/${currentLocale}/about`}>{t.OurStory}</Link>
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

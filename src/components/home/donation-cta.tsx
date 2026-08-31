"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { useTranslation } from "@/components/providers/translation-provider";

export function DonationCta() {
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] === "ht" ? "ht" : "en";
  const dict = useTranslation();
  const t = dict.DonationCta;

  return (
    <section className="pb-24 pt-8 md:pb-32">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-forest px-8 py-16 text-center md:px-20 md:py-24">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sand/15 blur-3xl" />
            <h2 className="relative font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              {t.Title1}
              <span className="block text-sand">{t.Title2}</span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-sand/85">
              {t.Subtitle}
            </p>
            <Button asChild size="lg" variant="secondary" className="relative mt-10">
              <Link href={`/${currentLocale}/donate`}>{t.DonateNow}</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

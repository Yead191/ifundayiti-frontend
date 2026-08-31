import Image from "next/image";
import Link from "next/link";
import { ArrowDown, MapPin } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { ABOUT_HERO } from "@/data/about";
import { getDictionary } from "@/lib/dictionaries";

export async function AboutHero({ lang }: { lang: string }) {
  const dict = await getDictionary(lang);
  const t = dict.AboutPage.Hero;

  const highlights = [
    { label: t.Origin, value: t.OriginVal },
    { label: t.Focus, value: t.FocusVal },
    { label: t.Model, value: t.ModelVal },
  ];

  const navLinks = [
    { href: "#story", label: t.OurStory },
    { href: "#principles", label: t.Principles },
    { href: "#team", label: t.Team },
  ];

  const locationCard = {
    label: t.BasedInAyiti,
    quote: t.BasedInAyitiQuote,
  };

  const [primaryNav, ...secondaryNav] = navLinks;

  return (
    <section className="relative overflow-hidden border-b border-hairline bg-cream">
      <div className="grid lg:min-h-160 lg:grid-cols-2">
        <div className="relative flex flex-col justify-center px-4 pb-14 pt-28 sm:px-6 md:pb-16 md:pt-32 lg:px-8 lg:py-24 xl:px-12">
          <div className="aurora -left-16 top-12 h-64 w-64 opacity-35" />
          <Container className="relative max-w-none px-0 lg:max-w-xl lg:px-0">
            <Reveal>
              <span className="eyebrow">{t.Eyebrow}</span>
              <h1 className="mt-5 font-display text-[2.65rem] font-semibold leading-[1.02] tracking-tight text-forest-deep sm:text-5xl lg:text-[3.5rem]">
                {t.Title}
                <span className="mt-1 block text-forest">
                  {t.TitleAccent}
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-mist">
                {t.Tagline} {t.SubtitleSuffix}
              </p>
            </Reveal>

            <Reveal delay={100} className="mt-10 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-hairline bg-white/80 px-4 py-4 shadow-[0_16px_40px_-32px_rgba(11,61,46,0.35)] backdrop-blur-sm"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest/70">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold leading-snug text-forest-deep">
                    {item.value}
                  </p>
                </div>
              ))}
            </Reveal>

            <Reveal delay={160} className="mt-10 flex flex-wrap gap-4 text-sm font-semibold">
              <Link
                href={primaryNav.href}
                className="inline-flex items-center gap-2 text-forest transition-colors hover:text-forest-deep"
              >
                {primaryNav.label}
                <ArrowDown className="h-4 w-4" />
              </Link>
              {secondaryNav.map((link) => (
                <span key={link.href} className="flex items-center gap-4">
                  <span className="text-hairline-strong">·</span>
                  <Link
                    href={link.href}
                    className="text-forest transition-colors hover:text-forest-deep"
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </Reveal>
          </Container>
        </div>

        <Reveal delay={80} className="relative min-h-90 lg:min-h-full">
          <Image
            src={ABOUT_HERO.image}
            alt={ABOUT_HERO.imageAlt}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-forest/50 via-forest/10 to-transparent lg:bg-linear-to-l lg:from-cream/20 lg:via-transparent lg:to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-xs">
            <div className="rounded-xl border border-white/20 bg-white/12 p-5 text-white backdrop-blur-md">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sand/90">
                <MapPin className="h-3.5 w-3.5" />
                {locationCard.label}
              </div>
              <p className="mt-2 font-display text-lg leading-snug">
                {locationCard.quote}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

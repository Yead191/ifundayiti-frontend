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
                <span className="mt-1 block text-forest">{t.TitleAccent}</span>
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

            <Reveal
              delay={160}
              className="mt-10 flex flex-wrap gap-4 text-sm font-semibold"
            >
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

        {/* Visual Showcase Right Column */}
        <Reveal
          delay={80}
          className="relative flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12"
        >
          {/* Subtle ambient glows */}
          <div className="aurora -top-10 -right-10 h-72 w-72 opacity-25" />
          <div className="aurora -bottom-10 -left-10 h-64 w-64 opacity-20" />

          <div className="group relative aspect-4/3 w-full min-h-100 sm:min-h-120 lg:aspect-auto lg:h-full lg:min-h-140 overflow-hidden rounded-4xl border border-forest/15 bg-sand-soft/60 shadow-[0_25px_60px_-25px_rgba(11,61,46,0.35)]">
            <Image
              src={ABOUT_HERO.image}
              alt={ABOUT_HERO.imageAlt}
              fill
              priority
              className="object-cover object-[center_35%] transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Seamless gradients for depth and text legibility */}
            <div className="absolute inset-0 bg-linear-to-t from-forest-deep/85 via-forest-deep/20 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-forest-deep/30 via-transparent to-transparent hidden lg:block" />

            {/* Floating Location Card */}
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 lg:max-w-sm">
              <div className="rounded-2xl border border-white/20 bg-forest-deep/80 p-5 text-white shadow-2xl backdrop-blur-xl sm:p-6">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-sand">
                  <span className="flex h-2 w-2 rounded-full bg-forest-bright animate-pulse" />
                  <MapPin className="h-3.5 w-3.5 text-sand" />
                  {locationCard.label}
                </div>
                <p className="mt-2.5 font-display text-base font-medium leading-snug sm:text-lg text-white/95">
                  {locationCard.quote}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

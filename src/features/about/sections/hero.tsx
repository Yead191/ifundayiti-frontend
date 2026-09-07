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
        {/* Left Column: Content */}
        <div className="relative flex flex-col justify-center px-4 pt-24 pb-8 sm:px-6 sm:pt-28 sm:pb-12 md:pt-32 md:pb-16 lg:px-8 lg:py-20 xl:px-12">
          <div className="aurora -left-16 top-12 h-64 w-64 opacity-35" />
          <Container className="relative w-full max-w-none px-0 lg:max-w-xl lg:px-0">
            <Reveal>
              <span className="eyebrow inline-block text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                {t.Eyebrow}
              </span>
              <h1 className="mt-3 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold leading-[1.12] sm:leading-[1.05] tracking-tight text-forest-deep wrap-break-word">
                {t.Title}
                <span className="mt-1 block text-forest">{t.TitleAccent}</span>
              </h1>
              <p className="mt-4 sm:mt-6 max-w-lg text-sm sm:text-base lg:text-lg leading-relaxed text-mist">
                {t.Tagline} {t.SubtitleSuffix}
              </p>
            </Reveal>

            <Reveal
              delay={100}
              className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3"
            >
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl sm:rounded-2xl border border-hairline bg-white/80 p-3.5 sm:p-4 shadow-[0_12px_30px_-20px_rgba(11,61,46,0.25)] sm:shadow-[0_16px_40px_-32px_rgba(11,61,46,0.35)] backdrop-blur-sm transition-all hover:border-forest/30"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest/70">
                    {item.label}
                  </p>
                  <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm font-semibold leading-snug text-forest-deep">
                    {item.value}
                  </p>
                </div>
              ))}
            </Reveal>

            <Reveal
              delay={160}
              className="mt-6 sm:mt-8 lg:mt-10 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold"
            >
              <Link
                href={primaryNav.href}
                className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3.5 py-1.5 text-forest transition-all hover:bg-forest hover:text-white"
              >
                <span>{primaryNav.label}</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </Link>
              {secondaryNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center rounded-full border border-hairline bg-white/80 px-3.5 py-1.5 text-mist transition-all hover:border-forest/40 hover:bg-white hover:text-forest-deep"
                >
                  {link.label}
                </Link>
              ))}
            </Reveal>
          </Container>
        </div>

        {/* Right Column: Visual Showcase */}
        <Reveal
          delay={80}
          className="relative flex items-center justify-center p-4 pt-0 sm:p-6 sm:pt-0 md:p-8 lg:p-0  overflow-hidden"
        >
          {/* Subtle ambient glows */}
          <div className="aurora -top-10 -right-10 h-72 w-72 opacity-25" />
          <div className="aurora -bottom-10 -left-10 h-64 w-64 opacity-20" />

          <div className="group relative w-full h-80 xs:h-96 sm:h-112 lg:h-full lg:min-h-140 overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-none border border-forest/15 bg-sand-soft/60 shadow-[0_20px_50px_-20px_rgba(11,61,46,0.3)]">
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
            <div className="absolute bottom-3 left-3 right-3 xs:bottom-4 xs:left-4 xs:right-4 sm:bottom-6 sm:left-6 sm:right-6 lg:bottom-8 lg:left-8 lg:right-auto lg:max-w-sm">
              <div className="rounded-xl sm:rounded-2xl border border-white/20 bg-forest-deep/85 p-3.5 xs:p-4 sm:p-6 text-white shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-sand">
                  <span className="flex h-2 w-2 rounded-full bg-forest-bright animate-pulse" />
                  <MapPin className="h-3.5 w-3.5 text-sand" />
                  {locationCard.label}
                </div>
                <p className="mt-1.5 sm:mt-2.5 font-display text-xs xs:text-sm sm:text-base font-medium leading-snug sm:leading-normal text-white/95">
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

import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { GRANTS_HERO } from "@/data/grants-page";

export function GrantsHero() {
  const [primaryNav, ...secondaryNav] = GRANTS_HERO.navLinks;

  return (
    <section className="relative overflow-hidden border-b border-hairline bg-forest text-white">
      <div className="absolute inset-0">
        <Image
          src={GRANTS_HERO.image}
          alt={GRANTS_HERO.imageAlt}
          fill
          priority
          className="object-cover object-center opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-forest via-forest/92 to-forest/55" />
        <div className="absolute inset-0 bg-linear-to-t from-forest via-transparent to-forest/40" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      <Container className="relative px-4 pb-16 pt-28 sm:px-6 md:pb-20 md:pt-32">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sand/85">
                {GRANTS_HERO.eyebrow}
              </span>
              <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-[3.35rem]">
                {GRANTS_HERO.title}
                <span className="mt-1 block text-sand">{GRANTS_HERO.titleAccent}</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-sand/90 sm:text-lg">
                {GRANTS_HERO.subtitle}
              </p>
            </Reveal>

            <Reveal delay={100} className="mt-10 flex flex-wrap gap-4 text-sm font-semibold">
              <Link
                href={primaryNav.href}
                className="inline-flex items-center gap-2 text-sand transition-colors hover:text-white"
              >
                {primaryNav.label}
                <ArrowDown className="h-4 w-4" />
              </Link>
              {secondaryNav.map((link) => (
                <span key={link.href} className="flex items-center gap-4">
                  <span className="text-white/25">·</span>
                  <Link
                    href={link.href}
                    className="text-sand/90 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </Reveal>
          </div>

          <Reveal delay={80} className="lg:col-span-5">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {GRANTS_HERO.highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/12 bg-white/8 p-5 backdrop-blur-md"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sand/75">
                    {item.label}
                  </p>
                  <p className="mt-1.5 font-display text-xl font-semibold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 hidden font-display text-lg leading-snug text-sand/90 lg:block">
              &ldquo;{GRANTS_HERO.imageQuote}&rdquo;
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

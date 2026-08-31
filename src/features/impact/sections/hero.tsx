import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, MapPin, Sparkles } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/dictionaries";

export async function ImpactHero({ lang }: { lang: string }) {
  const dict = await getDictionary(lang);
  const t = dict.ImpactPage.Hero;

  const chapters = [
    { href: "#metrics", label: t.Chapter1, hint: lang === "ht" ? "Chif yo" : "The numbers" },
    { href: "#projects", label: t.Chapter2, hint: lang === "ht" ? "Travay nan je" : "Work in view" },
    { href: "#success-stories", label: t.Chapter3, hint: lang === "ht" ? "Lavi ki chanje" : "Lives changed" },
    { href: "#winners", label: t.Chapter4, hint: lang === "ht" ? "Moun ki finanse" : "Who was funded" },
  ];

  const collage = [
    {
      src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=900&h=1100",
      alt: "Neighbors gathered in community",
      caption: t.Community,
      className: "col-span-7 row-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=700&h=500",
      alt: "Local agricultural work",
      caption: t.Livelihoods,
      className: "col-span-5",
    },
    {
      src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=700&h=500",
      alt: "People working side by side",
      caption: t.Builders,
      className: "col-span-5",
    },
  ];

  const proofStrip = [
    { value: "12", label: t.StatWinners },
    { value: "36", label: t.StatProjects },
    { value: "$11.4k", label: t.StatFund },
    { value: "1", label: t.StatCycle },
  ];

  return (
    <section className="relative overflow-hidden border-b border-hairline bg-cream">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-sand-soft/90 via-cream to-cream" />
      <div className="aurora -left-24 top-16 h-80 w-80 opacity-45" />
      <div className="aurora -right-16 top-1/3 h-72 w-72 opacity-30 [animation-delay:-5s]" />

      <Container className="relative px-4 pb-0 pt-28 sm:px-6 md:pt-32">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5 lg:pt-2">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/12 bg-white/80 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest shadow-[0_12px_28px_-16px_rgba(11,61,46,0.4)] backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                {t.Eyebrow}
              </div>
              <h1 className="mt-7 font-display text-[2.75rem] font-semibold leading-[1.02] tracking-tight text-forest-deep sm:text-5xl lg:text-[3.35rem]">
                {t.Title}
                <span className="mt-1 block italic text-forest">
                  {t.TitleAccent}
                </span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-mist sm:text-lg">
                {t.Subtitle}
              </p>
            </Reveal>

            <Reveal delay={90}>
              <blockquote className="relative mt-8 overflow-hidden rounded-2xl border border-hairline bg-white/70 p-5 shadow-[0_16px_40px_-28px_rgba(11,61,46,0.3)] backdrop-blur-sm">
                <div className="absolute left-0 top-0 h-full w-1 bg-sand" />
                <p className="pl-3 font-display text-lg leading-snug text-forest-deep sm:text-xl">
                  &ldquo;{t.Quote}&rdquo;
                </p>
                <p className="mt-3 pl-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-forest/55">
                  {t.QuoteAttribution}
                </p>
              </blockquote>
            </Reveal>

            <Reveal delay={140} className="mt-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">
                {lang === "ht" ? "Nan rapò sa a" : "In this report"}
              </p>
              <nav className="mt-3 overflow-hidden rounded-2xl border border-hairline bg-white/60 backdrop-blur-sm">
                {chapters.map((chapter, index) => (
                  <Link
                    key={chapter.href}
                    href={chapter.href}
                    className={`group flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-sand-soft/60 ${
                      index > 0 ? "border-t border-hairline" : ""
                    }`}
                  >
                    <span className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
                      <span className="font-display text-sm font-semibold text-forest-deep transition-colors group-hover:text-forest">
                        {chapter.label}
                      </span>
                      <span className="truncate text-xs text-mist">
                        {chapter.hint}
                      </span>
                    </span>
                    <ArrowDownRight className="h-4 w-4 shrink-0 text-forest/35 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-forest" />
                  </Link>
                ))}
              </nav>
            </Reveal>
          </div>

          <Reveal delay={80} className="relative lg:col-span-7">
            <div className="absolute -left-3 top-6 z-10 hidden -rotate-6 rounded-xl border border-hairline bg-white px-3 py-2 shadow-[0_16px_40px_-20px_rgba(11,61,46,0.4)] sm:block">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest">
                <MapPin className="h-3 w-3" />
                Ayiti · on the ground
              </p>
            </div>

            <div className="grid grid-cols-12 grid-rows-[minmax(150px,20vw)_minmax(150px,20vw)] gap-3 sm:gap-4 md:grid-rows-[230px_230px] lg:grid-rows-[250px_250px]">
              {collage.map((frame, index) => (
                <figure
                  key={frame.src}
                  className={`group relative overflow-hidden rounded-[1.35rem] bg-sand-soft shadow-[0_28px_70px_-40px_rgba(11,61,46,0.45)] ${frame.className}`}
                >
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    fill
                    priority={index === 0}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 90vw, 55vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-forest/60 via-forest/5 to-transparent" />
                  <figcaption className="absolute bottom-3 left-3 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    {frame.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={160} className="relative mt-12 md:mt-14">
          <div className="overflow-hidden rounded-t-[1.5rem] border border-b-0 border-hairline bg-forest text-white shadow-[0_-12px_48px_-28px_rgba(11,61,46,0.4)]">
            <div className="flex flex-col gap-1 border-b border-white/10 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sand/85">
                {lang === "ht" ? "Bann prèv enpak · chif demonstrasyon" : "Impact proof strip · demo figures"}
              </p>
              <p className="text-xs text-sand/65">
                {lang === "ht" ? "Ranplase ak chif ofisyèl yo lè yo pare" : "Swap for official reporting when ready"}
              </p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-y divide-white/10 sm:grid-cols-4 sm:divide-y-0">
              {proofStrip.map((item) => (
                <div
                  key={item.label}
                  className="px-6 py-6 transition-colors hover:bg-white/5 sm:px-8 sm:py-8"
                >
                  <p className="font-display text-3xl font-semibold tracking-tight text-sand md:text-[2.5rem]">
                    {item.value}
                  </p>
                  <p className="mt-2 text-xs font-medium leading-snug text-white/70">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

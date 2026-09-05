import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { formatPrice } from "@/lib/utils";
import { getCurrentApplicationPeriod } from "@/helpers/next-fetch/periodActions";
import { getDictionary } from "@/lib/dictionaries";

const HERO_IMAGE = "/assets/images/hero/hero-bg.png";

function formatDate(iso: string) {
  return new Date(`${iso}`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export async function HomeHero({ lang }: { lang: string }) {
  const currentPeriod = await getCurrentApplicationPeriod();
  const open = currentPeriod?.status === "Open";
  const dict = await getDictionary(lang);
  const t = dict.Hero;

  return (
    <section className="relative min-h-180 overflow-hidden bg-forest pt-24 text-white md:min-h-195 lg:min-h-210">
      {/* Background & Middle-Right Focused Hero Image */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base dark forest background */}
        <div className="absolute inset-0 bg-forest" />

        {/* Middle-Right Image with natural portrait aspect ratio framing */}
        <div className="absolute right-0 top-0 h-full w-full opacity-40 sm:opacity-60 md:opacity-85 lg:w-7/12 xl:w-1/2 lg:opacity-95 transition-opacity">
          <Image
            src={HERO_IMAGE}
            alt="Children in Haiti smiling and celebrating community"
            fill
            priority
            className="object-cover object-right md:object-[center_35%] lg:object-[center_30%]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
          />
          {/* Subtle multi-directional gradients to seamlessly blend image into forest background */}
          <div className="absolute inset-0 bg-linear-to-r from-forest via-forest/40 md:via-forest/20 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-forest via-transparent to-forest/30" />
          <div className="absolute inset-0 bg-linear-to-b from-forest/40 via-transparent to-forest/80" />
        </div>

        {/* Text contrast gradient shield on left side */}
        <div className="absolute inset-0 bg-linear-to-r from-forest via-forest/90 to-transparent lg:w-3/5" />

        {/* Subtle decorative dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <Container className="relative z-10 flex h-full w-full flex-col justify-center pb-32 pt-8 md:pb-36 md:pt-6">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {/* Nonprofit Trust Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-sand/35 bg-forest-deep/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-sand shadow-md backdrop-blur-md transition-all hover:bg-forest-deep/95">
                  <ShieldCheck className="h-4 w-4 text-sand shrink-0" />
                  <span>
                    {t.NonprofitNotice ||
                      "IFundAyiti is a nonprofit organization. 501(c)(3) pending"}
                  </span>
                </div>

                {/* Application Period Status Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sand/90 backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-sand" />
                  {open ? t.ApplicationsOpen : t.GrantProgram}
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-7 max-w-2xl font-display text-[2.75rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
                {t.Title1}
                <span className="mt-1 block text-sand">{t.Title2}</span>
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-sand/90 sm:text-lg">
                {t.Subtitle}
              </p>
            </Reveal>

            <Reveal
              delay={200}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-xl px-7"
              >
                <Link href={open ? `/${lang}/apply` : `/${lang}/grants`}>
                  {open ? t.ApplyBtn : t.ViewGrantsBtn}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-xl border border-white/20 bg-white/8 px-7 text-white backdrop-blur-sm hover:bg-white/15"
              >
                <Link href={`/${lang}/projects`}>{t.ExploreBtn}</Link>
              </Button>
            </Reveal>
          </div>

          {currentPeriod && (
            <Reveal delay={120} className="lg:col-span-5">
              <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-6 backdrop-blur-md md:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sand/80">
                  {t.CurrentCycle} · {currentPeriod.status}
                </p>
                <p className="mt-2 font-display text-2xl font-semibold text-white">
                  {currentPeriod.title}
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-5 border-t border-white/10 pt-6">
                  <div>
                    <dt className="text-xs text-sand/70">{t.MaximumGrant}</dt>
                    <dd className="mt-1 font-display text-2xl text-sand">
                      {formatPrice(currentPeriod.maximumGrantAmount)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-sand/70">{t.Window}</dt>
                    <dd className="mt-1 text-sm font-medium leading-snug text-white">
                      {formatDate(currentPeriod.startDate)} –{" "}
                      {formatDate(currentPeriod.endDate)}
                    </dd>
                  </div>
                </dl>
                <p className="mt-5 text-xs leading-relaxed text-sand/75">
                  {t.CycleNotice}
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/dictionaries";

export async function ImpactCta({ lang }: { lang: string }) {
  const dict = await getDictionary(lang);
  const t = dict.ImpactPage.CTA;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[1.75rem] bg-brand-gradient p-8 text-white shadow-[0_32px_80px_-40px_rgba(11,61,46,0.55)] md:p-12 lg:p-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "26px 26px",
            }}
          />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sand/20 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sand">
                <Sparkles className="h-3.5 w-3.5" />
                {t.Eyebrow}
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-snug md:text-4xl lg:text-[2.65rem]">
                {t.Title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-sand/90">
                {t.Body}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:flex-col">
              <Button asChild size="lg" variant="secondary" className="rounded-xl">
                <Link href={`/${lang}/donate`}>
                  {t.DonateBtn}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/15"
              >
                <Link href={`/${lang}/grants`}>
                  {t.GrantsBtn}
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

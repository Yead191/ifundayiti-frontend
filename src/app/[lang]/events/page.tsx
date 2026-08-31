import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Heart,
  Info,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  Zap,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { EventsCalendar } from "@/components/events/events-calendar";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return buildMetadata({
    title: dict.Navbar.Events,
    description: dict.EventsPage.Hero.Subtitle,
    path: `/${lang}/events`,
  });
}

export default async function EventsPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.EventsPage;

  const metricHighlights = [
    {
      icon: Zap,
      title: t.Metrics.AllocationTitle,
      desc: t.Metrics.AllocationDesc,
    },
    {
      icon: Video,
      title: t.Metrics.AccessTitle,
      desc: t.Metrics.AccessDesc,
    },
    {
      icon: Users,
      title: t.Metrics.VoicesTitle,
      desc: t.Metrics.VoicesDesc,
    },
    {
      icon: ShieldCheck,
      title: t.Metrics.FundTitle,
      desc: t.Metrics.FundDesc,
    },
  ];

  return (
    <div className="bg-cream min-h-screen">
      {/* ULTRA-PREMIUM EMOTIONAL HERO SECTION */}
      <section className="relative overflow-hidden border-b border-hairline bg-cream pt-28 pb-16 md:pt-32 md:pb-20">
        {/* Background Ambient Effects */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-sand-soft/80 via-cream to-cream" />
        <div className="aurora -right-20 top-10 h-96 w-96 opacity-35" />
        <div className="aurora -left-20 bottom-0 h-72 w-72 opacity-25" />

        <Container className="relative">
          <div className="max-w-3xl">
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-sand-soft/80 px-3.5 py-1.5 text-xs font-semibold text-forest shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-forest" />
              <span>{t.Hero.Eyebrow}</span>
            </div>

            {/* Display Title */}
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-forest-deep sm:text-5xl lg:text-[3.25rem]">
              {t.Hero.Title}
            </h1>

            {/* Emotional Story Narrative */}
            <p className="mt-5 text-base leading-relaxed text-mist sm:text-lg">
              {t.Hero.Subtitle}
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-xl px-7">
                <Link href="#calendar">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {t.Hero.CalendarBtn}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl px-7">
                <Link href={`/${lang}/donate`}>
                  <Heart className="mr-2 h-4 w-4 text-forest" />
                  {t.Hero.DonateBtn}
                </Link>
              </Button>
            </div>
          </div>

          {/* Metric Highlights Bar */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {metricHighlights.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-2xl border border-hairline/80 bg-white/80 p-4 shadow-2xs backdrop-blur-xs"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sand-soft text-forest">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-forest-deep">{title}</p>
                  <p className="text-[11px] text-mist">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Organization Fund Clarification Notice */}
          <div className="mt-8 rounded-2xl border border-hairline bg-white/90 p-4 shadow-xs flex items-start gap-3 text-xs text-forest-deep max-w-4xl">
            <Info className="h-4.5 w-4.5 text-forest shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-forest">{t.Notice.Title}</strong>{" "}
              <span>{t.Notice.Body}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* MAIN CALENDAR SECTION */}
      <section id="calendar" className="py-12 lg:py-16">
        <Container>
          <EventsCalendar lang={lang} />
        </Container>
      </section>
    </div>
  );
}

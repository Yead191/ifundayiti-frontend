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
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";
import { getEvents, getUpcomingEvent, type IEvent } from "@/helpers/next-fetch/eventActions";
import { FeaturedEventHero } from "@/features/events/components/FeaturedEventHero";
import { EventsFilterAndCatalog } from "@/features/events/components/EventsFilterAndCatalog";

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
    title: dict.Navbar?.Events || "Community Gatherings & Events",
    description: dict.EventsPage?.Hero?.Subtitle || "Join IFundAyiti community gatherings, galas, workshops, and pitch nights.",
    path: `/${lang}/events`,
  });
}

export default async function EventsPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.EventsPage;

  // Fetch published events and nearest upcoming event (today or closest upcoming nearby event)
  const [eventsRes, upcomingRes] = await Promise.all([
    getEvents({ status: "published", limit: 50 }),
    getUpcomingEvent(),
  ]);

  const events = eventsRes.success && Array.isArray(eventsRes.data) ? eventsRes.data : [];

  // Helper to ensure an event hasn't already finished (e.g. AM time passed)
  const now = Date.now();
  const isEventUpcomingOrLive = (evt: IEvent | null | undefined): boolean => {
    if (!evt || !evt.startDate) return false;
    const start = new Date(evt.startDate).getTime();
    if (isNaN(start)) return false;
    const end = evt.endDate ? new Date(evt.endDate).getTime() : start + 3 * 60 * 60 * 1000;
    return end >= now;
  };

  const upcomingCandidate = upcomingRes.success ? upcomingRes.data : null;

  // Pick nearest upcoming event whose time hasn't already passed;
  // If the candidate from /event/upcoming already passed (e.g. morning event), pick the next upcoming event from the catalog
  const upcomingEvent =
    (isEventUpcomingOrLive(upcomingCandidate) ? upcomingCandidate : null) ||
    events.find((e) => isEventUpcomingOrLive(e)) ||
    upcomingCandidate ||
    events.find((e) => e.featured) ||
    (events.length > 0 ? events[0] : null);

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
      <section className="relative overflow-hidden border-b border-hairline bg-cream pt-28 pb-14 md:pt-32 md:pb-16">
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
                <Link href="#catalog">
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

      {/* UPCOMING EVENT SPOTLIGHT (Nearest upcoming or today's event) */}
      {upcomingEvent && (
        <section className="pt-10 lg:pt-14">
          <Container>
            <FeaturedEventHero
              event={upcomingEvent}
              lang={lang}
              badgeLabel={lang === "ht" ? "Pwochen Evènman K ap Vini" : "Next Upcoming Gathering"}
            />
          </Container>
        </section>
      )}

      {/* EVENTS CATALOG & CALENDAR SECTION */}
      <section id="catalog" className="py-12 lg:py-16">
        <Container>
          <div className="mb-8">
            <div className="flex items-center gap-2 text-forest mb-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Gathering Schedule
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-forest-deep sm:text-4xl">
              Explore Upcoming Gatherings
            </h2>
            <p className="mt-1.5 text-sm text-mist max-w-2xl">
              Discover donor galas, founder pitch nights, entrepreneurship workshops, and community fundraisers.
            </p>
          </div>

          <EventsFilterAndCatalog events={events} lang={lang} />
        </Container>
      </section>
    </div>
  );
}

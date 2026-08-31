import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Globe,
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

export const metadata: Metadata = buildMetadata({
  title: "Fundraising & Events Calendar",
  description:
    "Explore upcoming IFundAyiti community fundraisers, grant pitch nights, donor galas, and Zoom masterclasses that power equity-free micro-grants for Haitian entrepreneurs.",
  path: "/events",
});

export default function EventsPage() {
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
              <span>Gather. Connect. Empower.</span>
            </div>

            {/* Display Title */}
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-forest-deep sm:text-5xl lg:text-[3.25rem]">
              Where Haitian dreams meet the capital to rise.
            </h1>

            {/* Emotional Story Narrative */}
            <p className="mt-5 text-base leading-relaxed text-mist sm:text-lg">
              Every pitch night, community workshop, and fundraising drive brings us one step closer to a self-sustaining, economically empowered Haiti. Whether you join us in person in Port-au-Prince or virtually via Zoom from anywhere across the globe — <strong>100% of event contributions strengthen our central Program Fund.</strong>
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-xl px-7">
                <Link href="#calendar">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Explore Calendar Events
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl px-7">
                <Link href="/donate">
                  <Heart className="mr-2 h-4 w-4 text-forest" />
                  Donate to Central Program Fund
                </Link>
              </Button>
            </div>
          </div>

          {/* Metric Highlights Bar */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                icon: Zap,
                title: "100% Direct Allocation",
                desc: "All event gifts fund micro-grants",
              },
              {
                icon: Video,
                title: "Physical & Zoom Access",
                desc: "In-person & global virtual streaming",
              },
              {
                icon: Users,
                title: "1,500+ Community Voices",
                desc: "Entrepreneurs, donors & mentors",
              },
              {
                icon: ShieldCheck,
                title: "Central Program Fund",
                desc: "Managed with 100% transparency",
              },
            ].map(({ icon: Icon, title, desc }) => (
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
              <strong className="font-semibold text-forest">How Event Fundraising Works:</strong>{" "}
              <span>
                Donations made during events are not locked to individual presentations; they flow directly into the central IFundAyiti Program Fund. Our independent selection board allocates 100% of these resources to verified micro-grant winners during quarterly grant cycles.
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* MAIN CALENDAR SECTION */}
      <section id="calendar" className="py-12 lg:py-16">
        <Container>
          <EventsCalendar />
        </Container>
      </section>
    </div>
  );
}

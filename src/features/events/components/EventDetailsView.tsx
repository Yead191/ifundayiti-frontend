"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Heart,
  Info,
  Layers,
  MapPin,
  Navigation,
  Share2,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { type IEvent } from "@/helpers/next-fetch/eventActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { EventBookingWidget } from "./EventBookingWidget";

interface EventDetailsViewProps {
  event: IEvent;
  lang: string;
  profile?: {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  } | null;
}

export function EventDetailsView({
  event,
  lang,
  profile,
}: EventDetailsViewProps) {
  const startDate = new Date(event.startDate);
  const formattedDate = !isNaN(startDate.getTime())
    ? startDate.toLocaleDateString(lang === "ht" ? "fr-HT" : "en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formattedTime = !isNaN(startDate.getTime())
    ? startDate.toLocaleTimeString(lang === "ht" ? "fr-HT" : "en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const isFree =
    event.pricingType === "free" ||
    !event.price ||
    event.price === 0 ||
    event.type === "virtual";

  const imageUrl =
    getImageUrl(event.image) ||
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1600";

  const googleMapsUrl = event.venueAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${event.location} ${event.venueAddress}`,
      )}`
    : undefined;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: event.title,
          text: event.description,
          url,
        });
      } else {
        navigator.clipboard.writeText(url);
        toast.success("Event link copied to clipboard!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* CINEMATIC OBSIDIAN & GOLD HERO BANNER */}
      <section className="relative overflow-hidden bg-[#0E0E10] text-white pt-24 pb-16 md:pt-28 md:pb-24">
        {/* Background Image Layer with Luxury Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={event.title}
            fill
            priority
            className="object-cover opacity-20 filter blur-[1px] scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0E0E10] via-[#0E0E10]/80 to-[#0E0E10]/95" />
          <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />
        </div>

        <Container className="relative z-10">
          {/* Breadcrumbs & Navigation Back */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-neutral-400 mb-6">
            <nav className="flex items-center gap-2">
              <Link
                href={`/${lang}/events`}
                className="flex items-center gap-1 text-[#D4AF37] hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Events
              </Link>
              <span>/</span>
              <span className="capitalize">
                {event.category.replace("-", " ")}
              </span>
              <span>/</span>
              <span className="text-white truncate max-w-xs">
                {event.title}
              </span>
            </nav>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-300 hover:bg-white/10 cursor-pointer transition"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share Gathering</span>
            </button>
          </div>

          {/* Title & Metadata Hero Content */}
          <div className="max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#F5E6BE]">
                <Sparkles className="h-3 w-3 text-[#D4AF37]" />
                {event.category.replace("-", " ")}
              </span>

              {event.featured && (
                <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                  Featured
                </span>
              )}

              {event.type === "virtual" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-semibold text-blue-300">
                  <Video className="h-3 w-3" /> Virtual Live Stream
                </span>
              )}
              {event.type === "hybrid" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 border border-purple-400/30 px-3 py-1 text-xs font-semibold text-purple-300">
                  <Video className="h-3 w-3" /> Hybrid (In-Person + Zoom)
                </span>
              )}

              {event.dressCode && (
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-neutral-300">
                  Dress Code: {event.dressCode}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-[1.12]">
              {event.title}
            </h1>

            {/* Quick highlights bar */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs sm:text-sm text-neutral-300 pt-2">
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-[#D4AF37]" />
                <span className="font-semibold text-white">
                  {formattedDate}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-[#D4AF37]" />
                <span>{formattedTime}</span>
              </div>

              <div className="flex items-center gap-2.5">
                {event.type === "virtual" ? (
                  <Video className="h-4 w-4 text-blue-400" />
                ) : (
                  <MapPin className="h-4 w-4 text-[#D4AF37]" />
                )}
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2-COLUMN MAIN CONTENT & BOOKING SIDEBAR */}
      <section className="py-12 lg:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            {/* LEFT COLUMN: ABOUT, SPEAKERS, VENUE (8 cols) */}
            <div className="space-y-10 lg:col-span-8">
              {/* Event Main Banner Image Showcase */}
              <div className="relative aspect-21/9 w-full overflow-hidden rounded-3xl border border-hairline bg-sand-soft shadow-md">
                <Image
                  src={imageUrl}
                  alt={event.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* About the Event */}
              <div className="rounded-3xl border border-hairline/80 bg-white p-7 sm:p-9 shadow-sm space-y-4">
                <h2 className="font-display text-2xl font-bold text-forest-deep flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-forest" />
                  About This Gathering
                </h2>
                <div className="prose prose-neutral max-w-none text-mist leading-relaxed text-sm sm:text-base space-y-4">
                  <p className="whitespace-pre-line">{event.description}</p>
                </div>

                {/* Central Fund Note */}
                <div className="mt-6 rounded-2xl border border-hairline bg-sand-soft/50 p-4 sm:p-5 flex items-start gap-3.5 text-xs text-forest-deep leading-relaxed">
                  <Info className="h-5 w-5 text-forest shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-forest">
                      Central Program Fund Impact:
                    </strong>{" "}
                    <span>
                      100% of proceeds from tickets and event contributions
                      directly support the central IFundAyiti Program Fund. Our
                      independent selection committee deploys these resources as
                      non-dilutive micro-grants to verified Haitian
                      entrepreneurs during quarterly cycles.
                    </span>
                  </div>
                </div>
              </div>

              {/* Distinguished Speakers Section */}
              {event.speakers && event.speakers.length > 0 && (
                <div className="rounded-3xl border border-hairline/80 bg-white p-7 sm:p-9 shadow-sm space-y-6">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-forest block">
                      Thought Leaders & Keynotes
                    </span>
                    <h2 className="font-display text-2xl font-bold text-forest-deep mt-1">
                      Distinguished Speakers
                    </h2>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {event.speakers.map((speaker, idx) => {
                      const avatarUrl =
                        getImageUrl(speaker.avatar) ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";

                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-4 rounded-2xl border border-hairline bg-sand-soft/30 p-4 transition-colors hover:bg-sand-soft"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-[#D4AF37] shadow-sm">
                            <Image
                              src={avatarUrl}
                              alt={speaker.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-display font-semibold text-forest-deep truncate text-base">
                              {speaker.name}
                            </h3>
                            <p className="text-xs text-mist font-medium mt-0.5">
                              {speaker.role}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Venue & Directions Section */}
              <div className="rounded-3xl border border-hairline/80 bg-white p-7 sm:p-9 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-forest block">
                    Location & Access
                  </span>
                  <h2 className="font-display text-2xl font-bold text-forest-deep mt-1">
                    Venue & Directions
                  </h2>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3 text-forest-deep">
                    <Building2 className="h-5 w-5 text-forest shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-semibold text-forest-deep">
                        {event.location}
                      </strong>
                      {event.venueAddress && (
                        <p className="text-mist text-xs mt-0.5">
                          {event.venueAddress}
                        </p>
                      )}
                    </div>
                  </div>

                  {googleMapsUrl && (
                    <div className="pt-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-hairline bg-sand-soft/40 hover:bg-sand-soft"
                      >
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-forest font-semibold"
                        >
                          <Navigation className="h-3.5 w-3.5" />
                          <span>Open in Google Maps</span>
                          <ExternalLink className="h-3 w-3 ml-0.5" />
                        </a>
                      </Button>
                    </div>
                  )}

                  {/* Virtual Meeting banner if Virtual or Hybrid */}
                  {(event.type === "virtual" || event.type === "hybrid") && (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold">
                        <Video className="h-4 w-4 text-blue-600" />
                        <span>Zoom Live Stream Included</span>
                      </div>
                      <p className="text-blue-800 text-[11px] leading-relaxed">
                        Registered virtual attendees receive their unique
                        streaming link directly by email upon RSVP confirmation.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: STICKY BOOKING WIDGET (4 cols) */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              <EventBookingWidget
                event={event}
                lang={lang}
                initialProfile={profile}
              />

              {/* Support or Assistance Box */}
              <div className="rounded-3xl border border-hairline bg-sand-soft/50 p-6 text-xs text-center space-y-2">
                <p className="font-semibold text-forest-deep">
                  Have inquiries about this event?
                </p>
                <p className="text-mist text-[11px]">
                  Contact our gathering coordination team for accessibility,
                  sponsor tables, or group tickets.
                </p>
                <div className="pt-1">
                  <Button
                    asChild
                    variant="link"
                    size="sm"
                    className="text-forest hover:underline font-semibold"
                  >
                    <Link href={`/${lang}/contact`}>Contact Event Team →</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  ExternalLink,
  Heart,
  Info,
  Loader2,
  MapPin,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import type { EventItem } from "@/data/events";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EventDetailModal({
  event,
  open,
  onClose,
}: {
  event: EventItem | null;
  open: boolean;
  onClose: () => void;
}) {
  const [rsvpName, setRsvpName] = React.useState("");
  const [rsvpEmail, setRsvpEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [registered, setRegistered] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setRegistered(false);
      setRsvpName("");
      setRsvpEmail("");
    }
  }, [open]);

  if (!event) return null;

  function handleRsvp(e: React.FormEvent) {
    e.preventDefault();
    if (!rsvpEmail.trim() || !rsvpName.trim()) {
      toast.error("Please provide your name and email.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setRegistered(true);
      toast.success(`You're registered for "${event?.title}"! Confirmation sent to ${rsvpEmail}.`);
    }, 800);
  }

  function renderEventTypeBadge() {
    if (event?.eventType === "virtual") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white shadow-xs">
          <Video className="h-3.5 w-3.5" /> Zoom Virtual Meeting
        </span>
      );
    }
    if (event?.eventType === "hybrid") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-3 py-1 text-[11px] font-bold text-white shadow-xs">
          <Video className="h-3.5 w-3.5" /> Hybrid (In-Person + Zoom)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1 text-[11px] font-bold text-white shadow-xs">
        <MapPin className="h-3.5 w-3.5" /> Physical In-Person Event
      </span>
    );
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-2xl p-0 overflow-hidden">
      <div className="flex flex-col max-h-[85vh] overflow-y-auto">
        {/* Event Banner Image */}
        <div className="relative aspect-21/9 w-full shrink-0 overflow-hidden bg-sand-soft">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-forest-deep/90 via-forest-deep/40 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute bottom-4 left-5 right-5 space-y-2">
            <div className="flex flex-wrap gap-2">
              <span className="inline-block rounded-full bg-sand px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest">
                {event.category.replace("-", " ")}
              </span>
              {renderEventTypeBadge()}
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Date & Location Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-hairline bg-sand-soft/50 p-3.5 text-xs">
            <div className="flex items-center gap-2.5 text-forest-deep">
              <CalendarIcon className="h-4 w-4 text-forest shrink-0" />
              <div>
                <p className="font-semibold">{event.date}</p>
                <p className="text-[11px] text-mist">Date</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-forest-deep">
              <Clock className="h-4 w-4 text-forest shrink-0" />
              <div>
                <p className="font-semibold">{event.time}</p>
                <p className="text-[11px] text-mist">Time</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-forest-deep">
              {event.eventType === "virtual" ? (
                <Video className="h-4 w-4 text-blue-600 shrink-0" />
              ) : (
                <MapPin className="h-4 w-4 text-forest shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-semibold truncate">{event.location}</p>
                <p className="text-[11px] text-mist">Venue Format</p>
              </div>
            </div>
          </div>

          {/* Physical Address / Zoom Link Banner */}
          {(event.venueAddress || event.virtualLink) && (
            <div className="rounded-2xl border border-hairline bg-white p-4 space-y-2 text-xs">
              {event.venueAddress && (
                <div className="flex items-start gap-2.5 text-forest-deep">
                  <Building2 className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-forest">Venue Address:</span>{" "}
                    <span className="text-mist">{event.venueAddress}</span>
                  </div>
                </div>
              )}
              {event.virtualLink && (
                <div className="flex items-center justify-between gap-2 text-blue-700 bg-blue-50 border border-blue-200/80 p-2.5 rounded-xl">
                  <div className="flex items-center gap-2 min-w-0">
                    <Video className="h-4 w-4 shrink-0 text-blue-600" />
                    <span className="font-semibold truncate">Zoom Meeting Room Available</span>
                  </div>
                  <a
                    href={event.virtualLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold hover:underline shrink-0 text-xs"
                  >
                    Open Link <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-forest mb-1.5">
              Event Description & Purpose
            </h4>
            <p className="text-sm leading-relaxed text-mist">
              {event.description}
            </p>
          </div>

          {/* Organization Central Fund Notice */}
          <div className="rounded-2xl border border-hairline bg-sand-soft/60 p-4 text-xs text-forest-deep leading-relaxed flex items-start gap-2.5">
            <Info className="h-4 w-4 text-forest shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-forest">Central Program Fund Allocation:</strong>{" "}
              <span>
                All donations support the central IFundAyiti Program Fund. Our selection committee awards 100% of these contributions directly to verified Haitian entrepreneurs during quarterly grant cycles.
              </span>
            </div>
          </div>

          {/* Speakers Spotlight */}
          {event.speakers && event.speakers.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-forest mb-2.5">
                Featured Speakers & Hosts
              </h4>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {event.speakers.map((sp) => (
                  <div
                    key={sp.name}
                    className="flex items-center gap-3 rounded-2xl border border-hairline bg-sand-soft/30 p-3"
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-forest/30">
                      <Image
                        src={sp.avatar}
                        alt={sp.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-forest-deep">{sp.name}</p>
                      <p className="text-[11px] text-mist">{sp.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RSVP Registration Form or Confirmation */}
          <div className="border-t border-hairline pt-5">
            {registered ? (
              <div className="rounded-2xl bg-forest/10 border border-forest/20 p-6 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-forest mb-2" />
                <h4 className="font-display font-semibold text-lg text-forest-deep">
                  Registration Confirmed!
                </h4>
                <p className="text-xs text-mist mt-1 max-w-md mx-auto">
                  You are registered for <strong>{event.title}</strong>. A confirmation pass has been sent to <strong>{rsvpEmail}</strong>.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <Button asChild size="sm" className="rounded-xl">
                    <Link href="/donate" onClick={onClose}>
                      <Heart className="mr-1.5 h-3.5 w-3.5" />
                      Donate to IFundAyiti Program Fund
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRsvp} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-semibold text-base text-forest-deep flex items-center gap-2">
                    <Users className="h-4 w-4 text-forest" />
                    <span>RSVP for Event</span>
                  </h4>
                  <span className="text-xs text-mist">{event.rsvpCount} people registered</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="rsvp-name" className="text-xs font-semibold uppercase tracking-wider text-forest mb-1 block">
                      Full Name *
                    </Label>
                    <Input
                      id="rsvp-name"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="e.g. Jean-Luc"
                      className="h-11 rounded-xl border-hairline bg-sand-soft/20 text-xs"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rsvp-email" className="text-xs font-semibold uppercase tracking-wider text-forest mb-1 block">
                      Email Address *
                    </Label>
                    <Input
                      id="rsvp-email"
                      required
                      type="email"
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      placeholder="jean@domain.com"
                      className="h-11 rounded-xl border-hairline bg-sand-soft/20 text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    size="lg"
                    className="w-full sm:flex-1 rounded-xl"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Registering...
                      </span>
                    ) : (
                      "Confirm RSVP & Reserve Spot"
                    )}
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full sm:flex-1 rounded-xl"
                  >
                    <Link href="/donate" onClick={onClose}>
                      <Heart className="mr-1.5 h-4 w-4 text-forest" />
                      Donate to Program Fund
                    </Link>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  ExternalLink,
  Heart,
  Info,
  Loader2,
  Lock,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import type { EventItem } from "@/data/events";
import { bookEventTicket } from "@/helpers/next-fetch/eventActions";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/providers/translation-provider";

interface EventDetailModalProps {
  event: EventItem | null;
  open: boolean;
  onClose: () => void;
  lang?: string;
}

export function EventDetailModal({
  event,
  open,
  onClose,
  lang = "en",
}: EventDetailModalProps) {
  const [submitting, setSubmitting] = React.useState(false);
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [bookingSuccess, setBookingSuccess] = React.useState<{
    ticketCode?: string;
    bookingId?: string;
  } | null>(null);

  const dict = useTranslation();
  const t = dict.EventsPage.Modal;

  React.useEffect(() => {
    if (!open) {
      setBookingSuccess(null);
      setSubmitting(false);
    }
  }, [open]);

  if (!event) return null;

  const isFree =
    event.eventType === "virtual" ||
    (event as any).pricingType === "free" ||
    !event.fundraisingGoal; // Fallback

  async function handleQuickRsvp() {
    if (!event) return;
    setSubmitting(true);

    try {
      const res = await bookEventTicket({
        event: event.id,
        quantity: 1,
      });

      if (!res.success) {
        if (res.statusCode === 401 || res.statusCode === 403) {
          setAuthModalOpen(true);
          toast.error("Please sign in to reserve your ticket.");
          return;
        }
        toast.error(res.message || "Failed to reserve ticket.");
        return;
      }

      if (res.data?.isPaid && res.data.checkoutUrl) {
        toast.success("Redirecting to secure Stripe checkout...");
        window.location.href = res.data.checkoutUrl;
        return;
      }

      const code =
        res.data?.ticketCode ||
        res.data?.booking?.ticketCode ||
        res.data?.booking?._id ||
        "IFA-CONFIRMED";
      const bookingId = res.data?.booking?._id || code;

      setBookingSuccess({ ticketCode: code, bookingId });
      toast.success("Spot reserved successfully! Official pass generated.");
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function getCategoryLabel(catId: string) {
    const cal = dict.EventsPage.Calendar;
    switch (catId) {
      case "all":
        return cal.CategoryAll;
      case "fundraiser":
        return cal.CategoryFundraiser;
      case "pitch-night":
        return cal.CategoryPitchNight;
      case "workshop":
        return cal.CategoryWorkshop;
      case "gala":
        return cal.CategoryGala;
      default:
        return catId;
    }
  }

  function renderEventTypeBadge() {
    if (event?.eventType === "virtual") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white shadow-xs">
          <Video className="h-3.5 w-3.5" /> {t.ZoomMeeting}
        </span>
      );
    }
    if (event?.eventType === "hybrid") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-3 py-1 text-[11px] font-bold text-white shadow-xs">
          <Video className="h-3.5 w-3.5" /> {t.HybridMeeting}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1 text-[11px] font-bold text-white shadow-xs">
        <MapPin className="h-3.5 w-3.5" /> {t.PhysicalMeeting}
      </span>
    );
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        className="max-w-2xl p-0 overflow-hidden rounded-3xl"
      >
        <div className="flex flex-col max-h-[88vh] overflow-y-auto">
          {/* Event Banner Image */}
          <div className="relative aspect-21/9 w-full shrink-0 overflow-hidden bg-sand-soft">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0E0E10]/95 via-[#0E0E10]/40 to-transparent" />

            {/* Badges & Title Overlay */}
            <div className="absolute bottom-4 left-5 right-5 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block rounded-full bg-[#D4AF37] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                  {getCategoryLabel(event.category)}
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
            {/* Date & Location Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-hairline bg-sand-soft/50 p-3.5 text-xs">
              <div className="flex items-center gap-2.5 text-forest-deep">
                <CalendarIcon className="h-4 w-4 text-forest shrink-0" />
                <div>
                  <p className="font-semibold">{event.date}</p>
                  <p className="text-[11px] text-mist">{t.Date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-forest-deep">
                <Clock className="h-4 w-4 text-forest shrink-0" />
                <div>
                  <p className="font-semibold">{event.time}</p>
                  <p className="text-[11px] text-mist">{t.Time}</p>
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
                  <p className="text-[11px] text-mist">{t.VenueFormat}</p>
                </div>
              </div>
            </div>

            {/* Venue Address / Virtual Meeting Link */}
            {(event.venueAddress || event.virtualLink) && (
              <div className="rounded-2xl border border-hairline bg-white p-4 space-y-2 text-xs">
                {event.venueAddress && (
                  <div className="flex items-start gap-2.5 text-forest-deep">
                    <Building2 className="h-4 w-4 text-forest shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-forest">
                        {t.VenueAddress}:
                      </span>{" "}
                      <span className="text-mist">{event.venueAddress}</span>
                    </div>
                  </div>
                )}
                {event.virtualLink && (
                  <div className="flex items-center justify-between gap-2 text-blue-700 bg-blue-50 border border-blue-200/80 p-2.5 rounded-xl">
                    <div className="flex items-center gap-2 min-w-0">
                      <Video className="h-4 w-4 shrink-0 text-blue-600" />
                      <span className="font-semibold truncate">
                        {t.ZoomMeetingRoom}
                      </span>
                    </div>
                    <a
                      href={event.virtualLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-bold hover:underline shrink-0 text-xs"
                    >
                      {t.OpenLink} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-forest mb-1.5">
                {t.DescriptionTitle}
              </h4>
              <p className="text-sm leading-relaxed text-mist line-clamp-4">
                {event.description}
              </p>
            </div>

            {/* Central Fund Transparency Notice */}
            <div className="rounded-2xl border border-hairline bg-sand-soft/60 p-4 text-xs text-forest-deep leading-relaxed flex items-start gap-2.5">
              <Info className="h-4 w-4 text-forest shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-forest">
                  {t.CentralNoticeTitle}
                </strong>{" "}
                <span>{t.CentralNoticeBody}</span>
              </div>
            </div>

            {/* Speakers Spotlight (If present) */}
            {event.speakers && event.speakers.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-forest mb-2.5">
                  {t.SpeakersTitle}
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
                        <p className="text-xs font-semibold text-forest-deep">
                          {sp.name}
                        </p>
                        <p className="text-[11px] text-mist">{sp.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUCCESS CONFIRMATION STATE */}
            {bookingSuccess ? (
              <div className="rounded-2xl bg-forest/10 border border-forest/20 p-6 text-center space-y-3">
                <CheckCircle2 className="mx-auto h-9 w-9 text-forest" />
                <h4 className="font-display font-semibold text-xl text-forest-deep">
                  Reservation Confirmed!
                </h4>
                <p className="text-xs text-mist max-w-sm mx-auto">
                  Your admission pass has been officially registered under your
                  verified profile.
                </p>

                <div className="inline-block font-mono text-xs font-bold text-forest bg-white px-3 py-1.5 rounded-lg border border-hairline my-2">
                  Pass Code: {bookingSuccess.ticketCode}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    asChild
                    size="sm"
                    className="w-full sm:w-auto rounded-xl bg-linear-to-r from-[#D4AF37] via-[#E5C158] to-[#B38F26] text-neutral-950 font-bold"
                  >
                    <Link
                      href={`/${lang}/ticket/${bookingSuccess.ticketCode || bookingSuccess.bookingId}`}
                      target="_blank"
                    >
                      <QrCode className="mr-1.5 h-4 w-4" />
                      View Golden Ticket
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    className="w-full sm:w-auto rounded-xl"
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              /* PRIMARY ACTION BUTTONS */
              <div className="border-t border-hairline pt-5 space-y-3">
                {/* 1. DEDICATED DETAILS PAGE CTA (PRIMARY) */}
                <Button
                  asChild
                  size="lg"
                  className="w-full h-12 rounded-2xl bg-forest text-white hover:bg-forest-deep shadow-md font-semibold text-sm cursor-pointer transition-all"
                >
                  <Link
                    href={`/${lang}/events/${event.id || event.slug}`}
                    onClick={onClose}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>View Full Details & Register</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                {/* 2. SECONDARY ROW: QUICK RSVP & DONATE */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleQuickRsvp}
                    disabled={submitting}
                    className="w-full sm:flex-1 h-10 rounded-xl border-forest/30 text-forest font-semibold hover:bg-sand-soft text-xs"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                        Reserving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Ticket className="h-3.5 w-3.5 text-forest" /> Quick
                        RSVP
                      </span>
                    )}
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:flex-1 h-10 rounded-xl border-hairline text-mist hover:text-forest-deep text-xs"
                  >
                    <Link href={`/${lang}/donate`} onClick={onClose}>
                      <Heart className="mr-1.5 h-3.5 w-3.5 text-forest" />
                      {dict.EventsPage.Calendar.DonateBtn.split(" ")[0]} to
                      Program Fund
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* AUTH REQUIRED MODAL TRIGGER */}
      <AuthRequiredModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        actionTitle="Reserve Event Ticket"
        lang={lang}
      />
    </>
  );
}

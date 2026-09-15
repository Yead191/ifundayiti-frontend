"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  Info,
  Loader2,
  Lock,
  Minus,
  Plus,
  QrCode,
  ShieldCheck,
  Sparkles,
  Ticket,
  User,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { type IEvent, bookEventTicket } from "@/helpers/next-fetch/eventActions";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EventBookingWidgetProps {
  event: IEvent;
  lang: string;
  initialProfile?: {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  } | null;
}

export function EventBookingWidget({
  event,
  lang,
  initialProfile,
}: EventBookingWidgetProps) {
  const router = useRouter();
  const [profile, setProfile] = React.useState(initialProfile || null);
  const [quantity, setQuantity] = React.useState(1);
  const [phone, setPhone] = React.useState(initialProfile?.phone || "");
  const [note, setNote] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [authModalOpen, setAuthModalOpen] = React.useState(false);

  // Success modal state
  const [successBooking, setSuccessBooking] = React.useState<{
    ticketCode?: string;
    bookingId?: string;
    quantity: number;
    isVirtual: boolean;
    virtualLink?: string;
  } | null>(null);

  const isFree =
    event.pricingType === "free" ||
    !event.price ||
    event.price === 0 ||
    event.type === "virtual";

  const capacity = event.capacity || 100;
  const reserved = event.reservedCount || 0;
  const remaining =
    typeof event.remainingSeats === "number"
      ? event.remainingSeats
      : Math.max(0, capacity - reserved);
  const isSoldOut = remaining <= 0;

  const occupancyPercent = Math.min(
    100,
    Math.round((reserved / Math.max(1, capacity)) * 100)
  );

  const totalPrice = isFree ? 0 : (event.price || 0) * quantity;

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();

    if (!profile) {
      setAuthModalOpen(true);
      return;
    }

    if (isSoldOut) {
      toast.error("This gathering has reached full capacity.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await bookEventTicket({
        event: event._id,
        customerPhone: phone.trim() || undefined,
        quantity,
        note: note.trim() || undefined,
      });

      if (!res.success) {
        if (res.statusCode === 401 || res.statusCode === 403) {
          setAuthModalOpen(true);
          toast.error("Please sign in to complete your reservation.");
          return;
        }
        toast.error(res.message || "Failed to reserve ticket. Please try again.");
        return;
      }

      // If Paid: redirect to Stripe Checkout
      if (res.data?.isPaid && res.data.checkoutUrl) {
        toast.success("Redirecting to secure Stripe checkout...");
        window.location.href = res.data.checkoutUrl;
        return;
      }

      // If Free or Virtual: show instant success modal
      const code =
        res.data?.ticketCode ||
        res.data?.booking?.ticketCode ||
        res.data?.booking?._id ||
        "IFA-CONFIRMED";
      const bookingId = res.data?.booking?._id || code;

      setSuccessBooking({
        ticketCode: code,
        bookingId,
        quantity,
        isVirtual: event.type === "virtual",
        virtualLink: event.virtualLink,
      });

      toast.success(
        event.type === "virtual"
          ? "Virtual access reserved! Confirmation sent to your email."
          : "Ticket confirmed! Official pass generated."
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-hairline/90 bg-white p-6 sm:p-7 shadow-lg space-y-6">
      {/* Header & Price Banner */}
      <div className="space-y-3 border-b border-hairline pb-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-forest flex items-center gap-1.5">
            <Ticket className="h-4 w-4" /> Admission Pass
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              isFree
                ? "bg-emerald-100 text-emerald-800"
                : "bg-[#D4AF37]/20 text-[#8F721A] border border-[#D4AF37]/40"
            }`}
          >
            {isFree ? "Complimentary" : "Official Ticket"}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl sm:text-4xl font-extrabold text-forest-deep">
            {isFree ? "Complimentary" : `$${event.price}.00`}
          </span>
          {!isFree && <span className="text-xs text-mist font-medium">USD / person</span>}
        </div>

        {event.type === "virtual" && (
          <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200/70 rounded-xl p-2.5 flex items-center gap-2">
            <Video className="h-4 w-4 shrink-0 text-blue-600" />
            <span>Virtual attendance via Zoom stream is complimentary for all members.</span>
          </p>
        )}
      </div>

      {/* Seat Capacity Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-mist flex items-center gap-1.5 font-medium">
            <Users className="h-3.5 w-3.5 text-forest" /> Capacity Status
          </span>
          <span className="font-semibold text-forest-deep">
            {isSoldOut ? (
              <span className="text-red-600 font-bold">Sold Out</span>
            ) : (
              `${remaining} seats remaining`
            )}
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-sand-soft">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              occupancyPercent >= 90
                ? "bg-red-500"
                : occupancyPercent >= 70
                ? "bg-amber-500"
                : "bg-forest"
            }`}
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleBooking} className="space-y-5 pt-1">
        {/* Quantity Stepper */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-forest block">
              Number of Tickets
            </Label>
            <span className="text-xs text-mist font-medium">Max 5 per order</span>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-hairline bg-sand-soft/30 p-2">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || submitting}
              className="grid h-9 w-9 place-items-center rounded-xl bg-white text-forest-deep shadow-xs hover:bg-sand-soft disabled:opacity-40 cursor-pointer transition"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="font-display text-base font-bold text-forest-deep">
              {quantity} {quantity === 1 ? "Ticket" : "Tickets"}
            </span>

            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(Math.min(5, remaining), q + 1))}
              disabled={quantity >= 5 || quantity >= remaining || submitting}
              className="grid h-9 w-9 place-items-center rounded-xl bg-white text-forest-deep shadow-xs hover:bg-sand-soft disabled:opacity-40 cursor-pointer transition"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* User Profile Badge or Login Prompt */}
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-forest block mb-2">
            Attendee Information
          </Label>

          {profile ? (
            <div className="rounded-2xl border border-hairline bg-sand-soft/50 p-3.5 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-forest-deep flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-forest" />
                  {profile.name || "Authenticated Attendee"}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </span>
              </div>
              <p className="text-mist truncate">{profile.email}</p>
              <p className="text-[11px] text-mist/80 pt-1">
                Your name & email will be officially encoded on your golden pass.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#D4AF37]/50 bg-[#D4AF37]/10 p-4 space-y-3 text-xs">
              <div className="flex items-start gap-2.5 text-forest-deep">
                <Lock className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-forest-deep">
                    Account sign-in required
                  </p>
                  <p className="text-mist text-[11px] mt-0.5">
                    Your official admission pass will be securely linked to your IFundAyiti account.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                variant="outline"
                size="sm"
                className="w-full rounded-xl border-[#D4AF37]/60 bg-white font-semibold text-forest-deep hover:bg-[#D4AF37]/10"
              >
                Sign In to Reserve
              </Button>
            </div>
          )}
        </div>

        {/* Optional Contact Phone */}
        <div>
          <Label
            htmlFor="phone-input"
            className="text-xs font-semibold uppercase tracking-wider text-forest block mb-1.5"
          >
            Phone Number <span className="text-mist font-normal lowercase">(optional for SMS reminder)</span>
          </Label>
          <Input
            id="phone-input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (305) 555-0199"
            className="h-11 rounded-xl border-hairline bg-sand-soft/30 text-xs text-forest-deep"
          />
        </div>

        {/* Optional Special Notes / Dietary */}
        <div>
          <Label
            htmlFor="note-input"
            className="text-xs font-semibold uppercase tracking-wider text-forest block mb-1.5"
          >
            Special Notes <span className="text-mist font-normal lowercase">(dietary, seating, requests)</span>
          </Label>
          <Textarea
            id="note-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Vegetarian, wheelchair accessible, guest names..."
            rows={2}
            className="rounded-xl border-hairline bg-sand-soft/30 text-xs text-forest-deep resize-none"
          />
        </div>

        {/* Total calculation row if paid */}
        {!isFree && (
          <div className="rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/10 via-sand-soft to-transparent p-4 flex items-center justify-between text-xs">
            <div>
              <span className="text-mist block">Total Investment</span>
              <span className="text-[11px] text-mist">{quantity} × ${event.price}.00</span>
            </div>
            <div className="text-right">
              <span className="font-display text-2xl font-bold text-forest-deep block">
                ${totalPrice}.00 USD
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                <ShieldCheck className="h-3 w-3" /> Secure Stripe Checkout
              </span>
            </div>
          </div>
        )}

        {/* Primary Submit Button */}
        <Button
          type="submit"
          disabled={submitting || isSoldOut}
          className={`w-full h-12 rounded-2xl font-semibold shadow-md cursor-pointer transition-all ${
            isFree
              ? "bg-forest text-white hover:bg-forest-deep"
              : "bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B38F26] text-neutral-950 hover:brightness-110 shadow-[#D4AF37]/25"
          }`}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isFree ? "Reserving Your Pass..." : "Opening Secure Checkout..."}
            </span>
          ) : isSoldOut ? (
            "Registration Full"
          ) : isFree ? (
            "Confirm Free Reservation"
          ) : (
            `Proceed to Secure Checkout ($${totalPrice}.00)`
          )}
        </Button>

        {/* Guarantee note */}
        <p className="text-center text-[11px] text-mist flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-forest" />
          <span>Instant digital confirmation & PDF ticket pass</span>
        </p>
      </form>

      {/* AUTH REQUIRED MODAL */}
      <AuthRequiredModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        actionTitle="Reserve Event Ticket"
        lang={lang}
      />

      {/* SUCCESS CONFIRMATION MODAL */}
      {successBooking && (
        <Modal
          open={!!successBooking}
          onClose={() => setSuccessBooking(null)}
          className="max-w-lg p-6 sm:p-8 overflow-hidden rounded-3xl"
        >
          <div className="text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-inner">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3 py-0.5 text-xs font-bold text-[#8F721A]">
                <Sparkles className="h-3 w-3" /> Confirmed Reservation
              </span>
              <h3 className="font-display text-2xl font-bold text-forest-deep mt-2">
                You're Officially Registered!
              </h3>
              <p className="text-xs text-mist mt-1">
                We're excited to welcome you to <strong className="text-forest-deep">{event.title}</strong>.
              </p>
            </div>

            {/* Ticket Code Card */}
            <div className="rounded-2xl border border-hairline bg-sand-soft/50 p-4 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="text-mist">Ticket Code</span>
                <span className="font-mono text-sm font-bold text-forest tracking-wider bg-white px-2.5 py-1 rounded-lg border border-hairline">
                  {successBooking.ticketCode}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-hairline/60">
                <span className="text-mist">Admission</span>
                <span className="font-semibold text-forest-deep">
                  Admit {successBooking.quantity} {successBooking.quantity === 1 ? "Person" : "Persons"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-hairline/60">
                <span className="text-mist">Registered To</span>
                <span className="font-semibold text-forest-deep">
                  {profile?.name || "Attendee"}
                </span>
              </div>
            </div>

            {/* Virtual Link note if virtual */}
            {successBooking.isVirtual && successBooking.virtualLink && (
              <div className="rounded-2xl bg-blue-50 border border-blue-200 p-3.5 text-left text-xs text-blue-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-blue-600" /> Private Virtual Meeting Link
                </p>
                <p className="text-[11px] text-blue-800 break-all">
                  {successBooking.virtualLink}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-2">
              <Button
                asChild
                className="w-full h-12 rounded-xl font-semibold bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B38F26] text-neutral-950 shadow-md hover:brightness-110"
              >
                <Link
                  href={`/${lang}/ticket/${successBooking.ticketCode || successBooking.bookingId}`}
                  target="_blank"
                >
                  <QrCode className="mr-2 h-4 w-4 text-neutral-900" />
                  View & Print Official Golden Ticket
                </Link>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setSuccessBooking(null)}
                className="w-full rounded-xl border-hairline"
              >
                Close & Return to Gathering
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

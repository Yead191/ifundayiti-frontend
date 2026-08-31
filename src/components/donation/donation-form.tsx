"use client";

import * as React from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Heart, Loader2, Lock, Sparkles } from "lucide-react";

import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDonation } from "@/helpers/next-fetch/donationActions";
import { useTranslation } from "@/components/providers/translation-provider";

export function DonationForm({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const dict = useTranslation();
  const t = dict.DonationForm;

  const presets = [
    { amount: 25, impact: t.Preset1 },
    { amount: 50, impact: t.Preset2 },
    { amount: 100, impact: t.Preset3 },
    { amount: 250, impact: t.Preset4 },
    { amount: 1000, impact: t.Preset5 },
  ];

  const donationSchema = z.object({
    name: z.string().min(2, t.ErrName),
    email: z.string().email(t.ErrEmail),
    amount: z.number().min(5, t.ErrAmount),
  });

  const [selected, setSelected] = React.useState<number | "custom">(100);
  const [custom, setCustom] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const amount = selected === "custom" ? Number(custom) || 0 : selected;

  function getImpactText(val: number) {
    if (val >= 1000) return t.Impact1000;
    if (val >= 500) return t.Impact500;
    if (val >= 250) return t.Impact250;
    if (val >= 100) return t.Impact100;
    if (val >= 50) return t.Impact50;
    if (val >= 25) return t.Impact25;
    return t.ImpactDefault;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = donationSchema.safeParse({ name, email, amount });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || t.ErrGeneric);
      return;
    }

    setSubmitting(true);
    try {
      const result = await createDonation({ name, email, amount });

      if (!result.success || !result.data?.paymentUrl) {
        toast.error(result.message || "Failed to create donation session. Please try again.");
        return;
      }

      // Redirect to Stripe checkout
      window.location.href = result.data.paymentUrl;
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className={cn("space-y-6", className)}>
      {/* Preset Amounts Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-forest">
            {t.SelectAmount}
          </Label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {presets.map((p) => {
            const active = selected === p.amount;
            return (
              <button
                key={p.amount}
                type="button"
                onClick={() => setSelected(p.amount)}
                className={cn(
                  "flex flex-col items-start justify-between rounded-2xl border p-3 text-left transition-all cursor-pointer",
                  active
                    ? "border-forest bg-forest text-white shadow-sm ring-1 ring-forest"
                    : "border-hairline bg-white hover:border-forest/40 hover:bg-sand-soft/30 text-forest-deep",
                )}
              >
                <span className="text-lg font-bold font-display">
                  ${p.amount}
                </span>
                <span
                  className={cn(
                    "text-[11px] mt-1 leading-tight",
                    active ? "text-sand/90" : "text-mist",
                  )}
                >
                  {p.impact}
                </span>
              </button>
            );
          })}

          {/* Custom Option */}
          <button
            type="button"
            onClick={() => setSelected("custom")}
            className={cn(
              "flex flex-col items-start justify-between rounded-2xl border p-3 text-left transition-all cursor-pointer",
              selected === "custom"
                ? "border-forest bg-forest text-white shadow-sm ring-1 ring-forest"
                : "border-hairline bg-white hover:border-forest/40 hover:bg-sand-soft/30 text-forest-deep",
            )}
          >
            <span className="text-sm font-bold">{t.Custom}</span>
            <span className={cn("text-[11px] mt-1", selected === "custom" ? "text-sand/90" : "text-mist")}>
              {t.AnyAmount}
            </span>
          </button>
        </div>

        {/* Custom Input */}
        {selected === "custom" && (
          <div className="mt-3 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-forest">
              $
            </span>
            <Input
              type="number"
              min={5}
              placeholder={t.EnterCustom}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              className="h-12 rounded-xl border-hairline pl-8 font-semibold"
            />
          </div>
        )}

        {/* Live Emotional Impact Banner */}
        <div className="mt-4 rounded-2xl border border-hairline bg-sand-soft/60 p-3.5 text-xs text-forest-deep leading-relaxed flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 text-forest shrink-0 mt-0.5" />
          <span>{getImpactText(amount)}</span>
        </div>
      </div>

      {/* Donor Personal Information */}
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="donor-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
              {t.YourName}
            </Label>
            <Input
              id="donor-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.PlaceholderName}
              className="h-11 rounded-xl border-hairline bg-sand-soft/20 focus:bg-white"
            />
          </div>
          <div>
            <Label htmlFor="donor-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
              {t.EmailAddress}
            </Label>
            <Input
              id="donor-email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean@example.com"
              className="h-11 rounded-xl border-hairline bg-sand-soft/20 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Guarantee & Submit */}
      <div className="space-y-3 pt-2">
        <Button
          type="submit"
          disabled={submitting}
          size="lg"
          className="h-14 w-full rounded-2xl text-base font-semibold shadow-md transition-all hover:shadow-lg"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              {t.Redirecting}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4 fill-white/20" />
              {t.FuelFund} {amount > 0 ? formatPrice(amount) : t.Donate}
            </span>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-mist">
          <Lock className="h-3.5 w-3.5 text-forest" />
          <span>{t.SecureCheckout}</span>
        </div>
      </div>
    </form>
  );
}

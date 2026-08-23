"use client";

import * as React from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PRESETS = [25, 50, 100, 250, 500];

const donationSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  amount: z.number().min(5, "Minimum donation is $5"),
});

export function DonationForm({
  compact = false,
  presets = [25, 50, 100, 250],
  className,
}: {
  compact?: boolean;
  presets?: number[];
  className?: string;
}) {
  const amounts = presets.length ? presets : PRESETS;
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [selected, setSelected] = React.useState<number | "custom">(50);
  const [custom, setCustom] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const amount =
    selected === "custom" ? Number(custom) || 0 : selected;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = donationSchema.safeParse({ name, email, amount });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || "Please complete the form");
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    toast.success("Thank you. This demo donation was recorded locally.");
    setName("");
    setEmail("");
    setCustom("");
    setSelected(50);
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className={cn("space-y-4", className)}
    >
      <div className={cn("grid gap-3", compact ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
        <div>
          <Label htmlFor="donor-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
            Donor name
          </Label>
          <Input
            id="donor-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
        <div>
          <Label htmlFor="donor-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-forest">
            Email
          </Label>
          <Input
            id="donor-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-forest">
          Amount
        </p>
        <div className="flex flex-wrap gap-2">
          {amounts.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSelected(n)}
              className={cn(
                "rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors",
                selected === n
                  ? "border-forest bg-forest text-white"
                  : "border-hairline bg-white text-forest hover:border-forest/40",
              )}
            >
              ${n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelected("custom")}
            className={cn(
              "rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors",
              selected === "custom"
                ? "border-forest bg-forest text-white"
                : "border-hairline bg-white text-forest hover:border-forest/40",
            )}
          >
            Custom
          </button>
        </div>
        {selected === "custom" && (
          <Input
            className="mt-3"
            type="number"
            min={5}
            placeholder="Enter amount"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
        )}
      </div>

      {!compact && (
        <p className="text-xs leading-relaxed text-mist">
          Donations go to the IFundAyiti Program Fund and are not linked to individual applicants.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="animate-spin" />
            Processing…
          </>
        ) : (
          `Donate${amount > 0 ? ` $${amount}` : ""} Now`
        )}
      </Button>
    </form>
  );
}

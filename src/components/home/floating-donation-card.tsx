import { Heart, ShieldCheck } from "lucide-react";

import { DonationForm } from "@/components/donation/donation-form";
import { Container } from "@/components/shared/container";

const TRUST_POINTS = [
  "Gifts go to the IFundAyiti Program Fund",
  "Not linked to an individual applicant",
  "Demo flow — replace with live payment later",
];

export function FloatingDonationCard() {
  return (
    <Container className="relative z-20 -mt-[132px] md:-mt-[148px]">
      <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-[0_32px_90px_-36px_rgba(11,61,46,0.55)] ring-1 ring-forest/8">
        <div className="grid lg:grid-cols-12">
          <aside className="relative overflow-hidden bg-sand-soft px-7 py-9 md:px-9 md:py-10 lg:col-span-4">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sand/80 blur-2xl" />
            <div className="relative">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-forest text-white shadow-[0_12px_28px_-14px_rgba(11,61,46,0.65)]">
                <Heart className="h-5 w-5 fill-white/20" />
              </div>
              <p className="eyebrow mt-6">Program Fund</p>
              <h2 className="mt-3 font-display text-[2rem] font-semibold leading-[1.08] tracking-tight text-forest-deep">
                Give in a minute
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-mist">
                A quick way to support the next grant cycle — warm, simple, and
                built for trust.
              </p>
              <ul className="mt-8 space-y-3">
                {TRUST_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm text-forest-deep/85"
                  >
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="border-t border-hairline bg-white px-7 py-9 md:px-9 md:py-10 lg:col-span-8 lg:border-l lg:border-t-0">
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest">
                  Quick donate
                </p>
                <p className="mt-1 font-display text-xl text-forest-deep">
                  Choose an amount and leave your details
                </p>
              </div>
              <p className="text-xs text-mist">Secure demo · no payment yet</p>
            </div>
            <DonationForm compact />
          </div>
        </div>
      </div>
    </Container>
  );
}

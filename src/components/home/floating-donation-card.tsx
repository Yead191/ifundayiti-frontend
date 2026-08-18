import { DonationForm } from "@/components/donation/donation-form";
import { Container } from "@/components/shared/container";

export function FloatingDonationCard() {
  return (
    <Container className="relative z-20 -mt-20 md:-mt-24">
      <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_24px_60px_-28px_rgba(11,61,46,0.35)] md:grid md:grid-cols-12">
        <div className="bg-sand-soft px-6 py-6 md:col-span-4 md:px-8 md:py-8">
          <p className="eyebrow">Program Fund</p>
          <h2 className="mt-2 font-display text-2xl text-forest-deep md:text-3xl">
            Give in a minute
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-mist">
            Your gift strengthens the IFundAyiti Program Fund — not a single applicant.
          </p>
        </div>
        <div className="px-6 py-6 md:col-span-8 md:px-8 md:py-8">
          <DonationForm compact />
        </div>
      </div>
    </Container>
  );
}

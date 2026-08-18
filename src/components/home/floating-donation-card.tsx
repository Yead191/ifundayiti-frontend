import { DonationForm } from "@/components/donation/donation-form";
import { Container } from "@/components/shared/container";

export function FloatingDonationCard() {
  return (
    <Container className="relative z-20 -mt-24 md:-mt-28 ">
      <div className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white shadow-[0_30px_80px_-32px_rgba(11,61,46,0.45)] md:grid md:grid-cols-12">
        <div className="relative bg-sand-soft px-7 py-8 md:col-span-4 md:px-9 md:py-10">
          <p className="eyebrow">Program Fund</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-forest-deep md:text-[2.1rem]">
            Give in a minute
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-mist">
            Your gift strengthens the IFundAyiti Program Fund — never a single applicant.
          </p>
        </div>
        <div className="px-7 py-8 md:col-span-8 md:px-9 md:py-10">
          <DonationForm compact />
        </div>
      </div>
    </Container>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { DonationForm } from "@/components/donation/donation-form";
import { FAQBlock } from "@/components/faq/faq-block";
import { FAQ_GROUPS } from "@/data/faq";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Donate",
  description:
    "Support the IFundAyiti Program Fund. Gifts are not linked to individual applicants.",
  path: "/donate",
});

export default function DonatePage() {
  const donationFaq = FAQ_GROUPS.find((g) => g.id === "donations");

  return (
    <>
      <PageHero
        eyebrow="Donate"
        title="Fuel the Program Fund."
        subtitle="Your gift helps open the next grant cycle. Donations are not tied to a single applicant."
      />

      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-hairline bg-white p-6 sm:p-8">
              <h2 className="font-display text-2xl text-forest-deep">
                Make a donation
              </h2>
              <p className="mt-2 text-sm text-mist">
                Choose an amount and leave your details. Payment processing will
                connect to the live donation backend when it is available.
              </p>
              <DonationForm className="mt-6" presets={[25, 50, 100, 250, 500]} />
            </div>
          </div>
          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl bg-sand-soft p-6">
              <h3 className="font-display text-xl text-forest-deep">
                Where your donation goes
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                Gifts pool into the IFundAyiti Program Fund. That fund awards
                equity-free grants of up to $1,000 during open cycles.
              </p>
            </div>
            <div className="rounded-2xl bg-forest p-6 text-white">
              <h3 className="font-display text-xl">Impact</h3>
              <p className="mt-3 text-sm leading-relaxed text-sand/90">
                One gift cannot pick a winner. Together, gifts keep the program
                able to review, select, and award.
              </p>
            </div>
            {donationFaq && <FAQBlock items={donationFaq.items} />}
          </aside>
        </Container>
      </section>
    </>
  );
}

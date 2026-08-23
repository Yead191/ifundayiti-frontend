import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Heart,
  HelpCircle,
  Quote,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { DonationForm } from "@/components/donation/donation-form";
import { FAQBlock } from "@/components/faq/faq-block";
import { FAQ_GROUPS } from "@/data/faq";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Donate & Support",
  description:
    "Empower Haitian entrepreneurs with non-dilutive equity-free micro-grants. 100% of public donations directly fund local business grants.",
  path: "/donate",
});

export default function DonatePage() {
  const donationFaq = FAQ_GROUPS.find((g) => g.id === "donations");

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Banner */}
      <PageHero
        eyebrow="🌱 Empower Haitian Innovation"
        title="Every dollar plants a seed. Every grant transforms a life."
        subtitle="100% of public donations directly fund non-dilutive, equity-free micro-grants of up to $1,000 for visionary Haitian entrepreneurs, local creators, and community builders."
      />

      {/* Trust & Transparency Badges */}
      <section className="-mt-6 border-y border-hairline bg-white/80 py-4 backdrop-blur-xs">
        <Container>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "100% Direct Allocation", desc: "Every public dollar enters the grant pool" },
              { icon: Zap, title: "$1,000 Micro-Grants", desc: "Catalytic seed funding for local businesses" },
              { icon: Award, title: "0% Equity Taken", desc: "Pure non-dilutive community capital" },
              { icon: Users, title: "Grassroots First", desc: "Driven by Haitian builders on the ground" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sand-soft text-forest">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-forest-deep">{title}</p>
                  <p className="text-[11px] text-mist">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Main Donation Section */}
      <section className="py-14 lg:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* LEFT COLUMN: Emotional Narrative + Upgraded Donation Form */}
            <div className="lg:col-span-7 space-y-8">
              <div className="rounded-3xl border border-hairline bg-white p-6 shadow-md sm:p-10">
                <div className="flex items-center gap-2 text-forest">
                  <Heart className="h-5 w-5 fill-forest" />
                  <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                    Make an Impactful Gift
                  </span>
                </div>
                <h2 className="mt-2 font-display text-2xl font-semibold text-forest-deep sm:text-3xl">
                  Fuel the Program Fund
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  Behind every micro-grant is a Haitian dream waiting to take root — a bakery expanding, a solar kiosk powering a village, an eco-textile workshop training local youth. Select a gift amount below to empower the next batch of builders.
                </p>

                {/* Interactive Donation Form Component */}
                <div className="mt-8">
                  <DonationForm />
                </div>
              </div>

              {/* Emotional Story Spotlight Box */}
              <div className="rounded-3xl border border-hairline bg-linear-to-br from-sand-soft/80 via-cream to-sand-soft/40 p-6 sm:p-8 relative overflow-hidden">
                <Quote className="absolute -right-4 -bottom-4 h-32 w-32 text-forest/5 pointer-events-none" />
                <div className="flex items-center gap-2 text-forest">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Real Entrepreneur Story
                  </span>
                </div>
                <blockquote className="mt-3 font-display text-base font-semibold leading-relaxed text-forest-deep sm:text-lg">
                  &ldquo;The $1,000 micro-grant from IFundAyiti allowed our bakery to purchase our first solar power inverter. During grid outages, we stayed open, baked fresh bread, and kept 4 young bakers employed.&rdquo;
                </blockquote>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-forest text-white font-bold flex items-center justify-center text-xs">
                    JP
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-forest-deep">Jean-Marc P.</p>
                    <p className="text-[11px] text-mist">Founder of Solèy Bakery · Cap-Haïtien</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Transparency & Impact Breakdown */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card 1: Fund Allocation Breakdown */}
              <div className="rounded-3xl border border-hairline bg-white p-6 shadow-xs sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">
                  Transparency Guarantee
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-forest-deep">
                  Where your money goes
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-mist">
                  We believe in 100% financial transparency. Every contribution is pooled into the Program Fund and audited for maximum community impact.
                </p>

                {/* Progress Visualizer */}
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-forest-deep">Direct Micro-Grants</span>
                      <span className="text-forest font-bold">85%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-sand-soft overflow-hidden">
                      <div className="h-full bg-forest rounded-full" style={{ width: "85%" }} />
                    </div>
                    <p className="text-[11px] text-mist mt-1">Direct equity-free grants to selected Haitian applicants</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-forest-deep">Mentorship & Technical Incubator</span>
                      <span className="text-forest font-bold">10%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-sand-soft overflow-hidden">
                      <div className="h-full bg-forest/80 rounded-full" style={{ width: "10%" }} />
                    </div>
                    <p className="text-[11px] text-mist mt-1">Business coaching, financial literacy & workshops</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-forest-deep">Verification & Field Due Diligence</span>
                      <span className="text-forest font-bold">5%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-sand-soft overflow-hidden">
                      <div className="h-full bg-forest/50 rounded-full" style={{ width: "5%" }} />
                    </div>
                    <p className="text-[11px] text-mist mt-1">On-the-ground project evaluation and reporting</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Impact Highlights */}
              <div className="rounded-3xl border border-hairline bg-forest p-6 sm:p-8 text-white">
                <div className="flex items-center gap-2 text-sand">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Our Shared Collective Impact
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold text-white">
                  Why non-dilutive grants matter
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-sand/90">
                  Traditional loans burden early-stage Haitian entrepreneurs with high interest rates. IFundAyiti micro-grants require <strong className="text-white">zero debt and zero equity</strong>, giving founders full freedom to grow.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-sand/90 border-t border-white/20 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sand shrink-0" />
                    <span>$1,000 covers equipment, inventory, or first payroll</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sand shrink-0" />
                    <span>Quarterly grant cycles keep momentum continuous</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sand shrink-0" />
                    <span>Direct accountability through community tracking</span>
                  </li>
                </ul>
              </div>

              {/* Card 3: Explore Shop Link */}
              <div className="rounded-3xl border border-hairline bg-sand-soft/60 p-6">
                <h3 className="font-display text-base font-semibold text-forest-deep">
                  Prefer to shop mission merchandise?
                </h3>
                <p className="mt-1.5 text-xs text-mist leading-relaxed">
                  Every purchase from our shop directly contributes to the central Program Fund.
                </p>
                <Link
                  href="/shop"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:underline"
                >
                  Browse Merch Shop
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ SECTION */}
          {donationFaq && (
            <div className="mt-20 border-t border-hairline pt-16">
              <div className="max-w-2xl text-center mx-auto mb-10">
                <p className="eyebrow">Donor Questions</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-forest-deep">
                  Frequently Asked Questions
                </h2>
                <p className="mt-2 text-sm text-mist">
                  Everything you need to know about donating to the IFundAyiti Program Fund.
                </p>
              </div>

              <div className="max-w-3xl mx-auto rounded-3xl border border-hairline bg-white p-6 shadow-xs sm:p-8">
                <FAQBlock items={donationFaq.items} />
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

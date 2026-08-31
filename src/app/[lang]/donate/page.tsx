import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Heart,
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
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return buildMetadata({
    title: dict.Navbar.Donate,
    description: dict.DonatePage.Hero.Subtitle,
    path: `/${lang}/donate`,
  });
}

export default async function DonatePage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.DonatePage;

  const trustBadges = [
    { icon: ShieldCheck, title: t.Badges.DirectTitle, desc: t.Badges.DirectDesc },
    { icon: Zap, title: t.Badges.GrantTitle, desc: t.Badges.GrantDesc },
    { icon: Award, title: t.Badges.EquityTitle, desc: t.Badges.EquityDesc },
    { icon: Users, title: t.Badges.GrassrootsTitle, desc: t.Badges.GrassrootsDesc },
  ];

  const localizedFaqItems = [
    { question: t.FAQ.Q1, answer: t.FAQ.A1 },
    { question: t.FAQ.Q2, answer: t.FAQ.A2 },
    { question: t.FAQ.Q3, answer: t.FAQ.A3 },
  ];

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Banner */}
      <PageHero
        eyebrow={t.Hero.Eyebrow}
        title={t.Hero.Title}
        subtitle={t.Hero.Subtitle}
      />

      {/* Trust & Transparency Badges */}
      <section className="-mt-6 border-y border-hairline bg-white/80 py-4 backdrop-blur-xs">
        <Container>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {trustBadges.map(({ icon: Icon, title, desc }) => (
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
                    {t.Narrative.Eyebrow}
                  </span>
                </div>
                <h2 className="mt-2 font-display text-2xl font-semibold text-forest-deep sm:text-3xl">
                  {t.Narrative.Title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  {t.Narrative.Body}
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
                    {t.Story.Eyebrow}
                  </span>
                </div>
                <blockquote className="mt-3 font-display text-base font-semibold leading-relaxed text-forest-deep sm:text-lg">
                  {t.Story.Quote}
                </blockquote>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-forest text-white font-bold flex items-center justify-center text-xs">
                    {t.Story.Author.split("-").map((part: string) => part[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-forest-deep">{t.Story.Author}</p>
                    <p className="text-[11px] text-mist">{t.Story.AuthorRole}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Transparency & Impact Breakdown */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card 1: Fund Allocation Breakdown */}
              <div className="rounded-3xl border border-hairline bg-white p-6 shadow-xs sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">
                  {t.Transparency.Eyebrow}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-forest-deep">
                  {t.Transparency.Title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-mist">
                  {t.Transparency.Body}
                </p>

                {/* Progress Visualizer */}
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-forest-deep">{t.Transparency.DirectGrants}</span>
                      <span className="text-forest font-bold">85%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-sand-soft overflow-hidden">
                      <div className="h-full bg-forest rounded-full" style={{ width: "85%" }} />
                    </div>
                    <p className="text-[11px] text-mist mt-1">{t.Transparency.DirectGrantsDesc}</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-forest-deep">{t.Transparency.Mentorship}</span>
                      <span className="text-forest font-bold">10%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-sand-soft overflow-hidden">
                      <div className="h-full bg-forest/80 rounded-full" style={{ width: "10%" }} />
                    </div>
                    <p className="text-[11px] text-mist mt-1">{t.Transparency.MentorshipDesc}</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-forest-deep">{t.Transparency.Verification}</span>
                      <span className="text-forest font-bold">5%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-sand-soft overflow-hidden">
                      <div className="h-full bg-forest/50 rounded-full" style={{ width: "5%" }} />
                    </div>
                    <p className="text-[11px] text-mist mt-1">{t.Transparency.VerificationDesc}</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Impact Highlights */}
              <div className="rounded-3xl border border-hairline bg-forest p-6 sm:p-8 text-white">
                <div className="flex items-center gap-2 text-sand">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {t.WhyGrants.Eyebrow}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold text-white">
                  {t.WhyGrants.Title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-sand/90">
                  {t.WhyGrants.Body}
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-sand/90 border-t border-white/20 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sand shrink-0" />
                    <span>{t.WhyGrants.Item1}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sand shrink-0" />
                    <span>{t.WhyGrants.Item2}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sand shrink-0" />
                    <span>{t.WhyGrants.Item3}</span>
                  </li>
                </ul>
              </div>

              {/* Card 3: Explore Shop Link */}
              <div className="rounded-3xl border border-hairline bg-sand-soft/60 p-6">
                <h3 className="font-display text-base font-semibold text-forest-deep">
                  {t.ShopMerch.Title}
                </h3>
                <p className="mt-1.5 text-xs text-mist leading-relaxed">
                  {t.ShopMerch.Body}
                </p>
                <Link
                  href={`/${lang}/shop`}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:underline"
                >
                  {t.ShopMerch.LinkBtn}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ SECTION */}
          <div className="mt-20 border-t border-hairline pt-16">
            <div className="max-w-2xl text-center mx-auto mb-10">
              <p className="eyebrow">{t.FAQ.Eyebrow}</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-forest-deep">
                {t.FAQ.Title}
              </h2>
              <p className="mt-2 text-sm text-mist">
                {t.FAQ.Subtitle}
              </p>
            </div>

            <div className="max-w-3xl mx-auto rounded-3xl border border-hairline bg-white p-6 shadow-xs sm:p-8">
              <FAQBlock items={localizedFaqItems} />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

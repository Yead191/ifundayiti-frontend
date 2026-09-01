import type { Metadata } from "next";
import Link from "next/link";
import {
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
  Clock,
  ArrowLeft,
} from "lucide-react";

import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { ApplyExperience } from "@/components/application/apply-experience";
import { getCurrentApplicationPeriod } from "@/helpers/next-fetch/periodActions";
import { formatGrantDate } from "@/features/grants/lib/format-grant-date";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
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
    title: dict.Navbar.Apply,
    description: dict.ApplyPage.Hero.Subtitle,
    path: `/${lang}/apply`,
  });
}

export default async function ApplyPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.ApplyPage;

  const currentPeriod = await getCurrentApplicationPeriod();

  if (!currentPeriod) {
    return (
      <div className="bg-cream min-h-screen flex flex-col items-center justify-center py-20">
        <Container className="max-w-2xl text-center">
          <h1 className="font-display text-3xl font-semibold text-forest-deep">
            {t.NoCycles.Title}
          </h1>
          <p className="mt-4 text-mist">
            {t.NoCycles.Desc}
          </p>
          <Button asChild className="mt-8 rounded-xl">
            <Link href={`/${lang}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {t.NoCycles.BackHome}
            </Link>
          </Button>
        </Container>
      </div>
    );
  }

  const isOpen = currentPeriod.status === "Open";

  return (
    <div className="bg-cream min-h-screen">
      {/* Page Hero */}
      <PageHero
        eyebrow={t.Hero.Eyebrow}
        title={t.Hero.Title}
        subtitle={`${currentPeriod.title} · ${t.Hero.Subtitle}`}
      />

      {/* Trust & Guarantee Bar */}
      <section className="-mt-6 border-y border-hairline bg-white/80 py-4 backdrop-blur-xs relative z-10">
        <Container>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                icon: Zap,
                title: t.Badges.MaxGrantTitle,
                desc: t.Badges.MaxGrantDesc,
              },
              {
                icon: ShieldCheck,
                title: t.Badges.EquityTitle,
                desc: t.Badges.EquityDesc,
              },
              {
                icon: Sparkles,
                title: t.Badges.QuarterlyTitle,
                desc: t.Badges.QuarterlyDesc,
              },
              {
                icon: Lock,
                title: t.Badges.SecureTitle,
                desc: t.Badges.SecureDesc,
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sand-soft text-forest">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-forest-deep">
                    {title}
                  </p>
                  <p className="text-[11px] text-mist">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Main Guided Application Experience OR Closed State */}
      <section className="py-12 lg:py-20 relative">
        <Container>
          {isOpen ? (
            <ApplyExperience />
          ) : (
            <div className="mx-auto max-w-3xl overflow-hidden rounded-4xl border border-hairline bg-white shadow-sm">
              <div className="bg-sand-soft/50 px-8 py-12 text-center sm:px-12">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-forest/10 text-forest">
                  <Clock className="h-10 w-10" />
                </div>
                <h2 className="mt-6 font-display text-3xl font-semibold text-forest-deep sm:text-4xl">
                  {t.ClosedState.Title.replace(
                    "[status]",
                    (dict.GrantsPage?.StatusLabels?.[currentPeriod.status as keyof typeof dict.GrantsPage.StatusLabels] || currentPeriod.status).toLowerCase(),
                  )}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-mist">
                  {t.ClosedState.NotOpen.replace("[title]", currentPeriod.title)}
                  {currentPeriod.status === "Upcoming" &&
                    ` ${t.ClosedState.OpenOn.replace("[date]", formatGrantDate(currentPeriod.startDate, "long", lang))}`}
                  {currentPeriod.status === "Closed" &&
                    ` ${t.ClosedState.ClosedOn.replace("[date]", formatGrantDate(currentPeriod.endDate, "long", lang))}`}
                  {currentPeriod.status === "Review" &&
                    ` ${t.ClosedState.Reviewing.replace("[date]", formatGrantDate(currentPeriod.endDate, "long", lang))}`}
                  {currentPeriod.status === "WinnerSelection" &&
                    ` ${t.ClosedState.Selecting.replace("[date]", formatGrantDate(currentPeriod.endDate, "long", lang))}`}
                </p>
              </div>

              <div className="grid gap-px bg-hairline sm:grid-cols-2">
                <div className="bg-white p-8">
                  <div className="flex items-center gap-3 text-forest-deep">
                    <Sparkles className="h-5 w-5 text-forest" />
                    <h3 className="font-semibold">{t.ClosedState.TrackTitle}</h3>
                  </div>
                  <p className="mt-2 text-sm text-mist leading-relaxed">
                    {t.ClosedState.TrackDesc}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 w-full rounded-xl border-forest/20"
                  >
                    <Link href={`/${lang}/track-application`}>
                      {t.ClosedState.TrackBtn}
                    </Link>
                  </Button>
                </div>
                <div className="bg-white p-8">
                  <div className="flex items-center gap-3 text-forest-deep">
                    <ShieldCheck className="h-5 w-5 text-forest" />
                    <h3 className="font-semibold">{t.ClosedState.GuidelinesTitle}</h3>
                  </div>
                  <p className="mt-2 text-sm text-mist leading-relaxed">
                    {t.ClosedState.GuidelinesDesc}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 w-full rounded-xl border-forest/20"
                  >
                    <Link href={`/${lang}/grants`}>
                      {t.ClosedState.GuidelinesBtn}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

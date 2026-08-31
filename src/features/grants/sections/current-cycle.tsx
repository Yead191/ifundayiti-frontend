import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { GRANTS_CYCLE, GRANTS_STATUS_LABELS } from "@/data/grants-page";
import { formatGrantDate } from "@/features/grants/lib/format-grant-date";
import { cn, formatPrice } from "@/lib/utils";
import { getCurrentApplicationPeriod } from "@/helpers/next-fetch/periodActions";
import { getDictionary } from "@/lib/dictionaries";

const STATUS_STYLES = {
  open: "bg-emerald-500/15 text-emerald-100 border-emerald-400/25",
  review: "bg-amber-500/15 text-amber-100 border-amber-400/25",
  closed: "bg-white/10 text-sand border-white/15",
  neutral: "bg-white/10 text-sand border-white/15",
};

export async function GrantsCurrentCycle({ lang }: { lang: string }) {
  const currentPeriod = await getCurrentApplicationPeriod();
  if (!currentPeriod) return null;

  const dict = await getDictionary(lang);
  const t = dict.GrantsPage.Cycle;

  const open = currentPeriod.status === "Open";
  const statusMeta = GRANTS_STATUS_LABELS[currentPeriod.status] ?? GRANTS_STATUS_LABELS.Closed;
  const statusLabel = (dict.GrantsPage.StatusLabels as any)[currentPeriod.status] ?? dict.GrantsPage.StatusLabels.Closed;

  return (
    <section id={GRANTS_CYCLE.id} className="scroll-mt-24 py-20 md:py-24">
      <Container>
        <Reveal className="overflow-hidden rounded-[1.75rem] bg-brand-gradient text-white shadow-[0_32px_80px_-40px_rgba(11,61,46,0.55)]">
          <div className="grid lg:grid-cols-12">
            <div className="border-b border-white/10 p-8 md:p-10 lg:col-span-8 lg:border-b-0 lg:border-r">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sand/80">
                  {open ? t.Opportunity : t.Status}
                </span>
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                    STATUS_STYLES[statusMeta.tone],
                  )}
                >
                  {statusLabel}
                </span>
              </div>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-snug md:text-4xl">
                {currentPeriod.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-sand/90">
                {open ? t.OpenLead : t.ClosedLead}
              </p>
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/12 bg-white/8 p-5">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-sand" />
                <p className="text-sm leading-relaxed text-sand/90">
                  {t.Window}{" "}
                  <strong className="font-semibold text-white">
                    {formatGrantDate(currentPeriod.startDate, "long", lang)} –{" "}
                    {formatGrantDate(currentPeriod.endDate, "long", lang)}
                  </strong>
                </p>
              </div>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="mt-8 rounded-xl"
              >
                <Link href={open ? `/${lang}/apply` : `/${lang}/track-application`}>
                  {open ? t.ApplyForThis : dict.Navbar.Track}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-col justify-center bg-forest-deep/30 p-8 md:p-10 lg:col-span-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sand/75">
                {t.MaxGrant}
              </p>
              <p className="mt-2 font-display text-5xl font-semibold tracking-tight text-sand">
                {formatPrice(currentPeriod.maximumGrantAmount)}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-sand/85">
                {t.MaxGrantNote}
              </p>
              <dl className="mt-8 space-y-4 border-t border-white/10 pt-6 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-sand/70">{t.Winners}</dt>
                  <dd className="font-medium text-white">{t.WinnersVal}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-sand/70">{t.Equity}</dt>
                  <dd className="font-medium text-white">{t.EquityVal}</dd>
                </div>
                {open ||
                  (currentPeriod.status === "Closed" && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-sand/70">{t.ApplicationsReceived}</dt>
                      <dd className="font-medium text-white">
                        {currentPeriod.totalApplicationsSubmitted}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

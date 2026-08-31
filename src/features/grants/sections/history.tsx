import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { formatGrantDate } from "@/features/grants/lib/format-grant-date";
import { cn } from "@/lib/utils";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { getDictionary } from "@/lib/dictionaries";

export async function GrantsHistory({ lang }: { lang: string }) {
  const res = await nextFetch("/period", { cache: "no-store" });
  let periods = res.success ? res.data || [] : [];

  if (periods.length > 0) {
    const firstStatus = periods[0].status;
    if (firstStatus === "Open" || firstStatus === "Review") {
      periods = periods.slice(1);
    }
  }

  if (periods.length === 0) return null;

  const dict = await getDictionary(lang);
  const t = dict.GrantsPage.History;

  return (
    <section className="py-20 md:py-24">
      <Container>
        <SectionHeading
          align="left"
          eyebrow={t.Eyebrow}
          title={t.Title}
          subtitle={t.Subtitle}
        />
        <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-hairline bg-white shadow-[0_20px_50px_-36px_rgba(11,61,46,0.35)]">
          {periods?.map((period: any, index: number) => {
            const statusLabel =
              (dict.GrantsPage.StatusLabels as any)[period.status] ||
              period.status;
            return (
              <Reveal
                key={period._id}
                delay={index * 50}
                className={cn(
                  "flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8",
                  index > 0 && "border-t border-hairline",
                )}
              >
                <div>
                  <p className="font-display text-lg font-semibold text-forest-deep">
                    {period.title}
                  </p>
                  <p className="mt-1 text-sm text-mist">
                    {formatGrantDate(period.startDate, "short", lang)} –{" "}
                    {formatGrantDate(period.endDate, "short", lang)}
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full border border-hairline bg-sand-soft/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-forest">
                  {statusLabel}
                </span>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { GRANTS_HISTORY } from "@/data/grants-page";
import { formatGrantDate } from "@/features/grants/lib/format-grant-date";
import { cn } from "@/lib/utils";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";

export async function GrantsHistory() {
  const res = await nextFetch("/period", { cache: "no-store" });
  let periods = res.success ? res.data || [] : [];

  if (periods.length > 0) {
    const firstStatus = periods[0].status;
    if (firstStatus === "Open" || firstStatus === "Review") {
      periods = periods.slice(1);
    }
  }

  if (periods.length === 0) return null;

  return (
    <section className="py-20 md:py-24">
      <Container>
        <SectionHeading
          align="left"
          eyebrow={GRANTS_HISTORY.eyebrow}
          title={GRANTS_HISTORY.title}
          subtitle={GRANTS_HISTORY.subtitle}
        />
        <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-hairline bg-white shadow-[0_20px_50px_-36px_rgba(11,61,46,0.35)]">
          {periods.map((period: any, index: number) => (
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
                  {formatGrantDate(period.startDate, "short")} –{" "}
                  {formatGrantDate(period.endDate, "short")}
                </p>
              </div>
              <span className="inline-flex w-fit rounded-full border border-hairline bg-sand-soft/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-forest">
                {period.status}
              </span>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

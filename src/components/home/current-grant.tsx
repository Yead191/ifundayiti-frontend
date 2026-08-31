import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { formatPrice } from "@/lib/utils";
import { getCurrentApplicationPeriod } from "@/helpers/next-fetch/periodActions";
import { getDictionary } from "@/lib/dictionaries";

function formatDate(iso: string, locale: string) {
  return new Date(`${iso}`).toLocaleDateString(locale === "ht" ? "fr-FR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function CurrentGrant({ lang }: { lang: string }) {
  const currentPeriod = await getCurrentApplicationPeriod();
  if (!currentPeriod) return null;

  const open = currentPeriod.status === "Open";
  const dict = await getDictionary(lang);
  const t = dict.CurrentGrant;

  return (
    <section className="pt-24 pb-6">
      <Container>
        <Reveal>
          <div className="overflow-hidden rounded-[1.75rem] bg-forest text-white">
            <div className="grid gap-10 px-7 py-10 md:grid-cols-12 md:items-end md:px-12 md:py-14">
              <div className="md:col-span-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sand">
                  {t.CurrentCycle} · {currentPeriod.status}
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl text-white">
                  {currentPeriod.title}
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-sand/90 md:text-base">
                  {t.SubtitlePre}
                  {formatPrice(currentPeriod.maximumGrantAmount)}.
                </p>
              </div>
              <div className="flex flex-col gap-6 md:col-span-5 md:items-end">
                <dl className="grid w-full grid-cols-2 gap-6 text-sm">
                  <div>
                    <dt className="text-sand/70">{t.Opens}</dt>
                    <dd className="mt-1 font-display text-lg text-white">
                      {formatDate(currentPeriod.startDate, lang)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sand/70">{t.Closes}</dt>
                    <dd className="mt-1 font-display text-lg text-white">
                      {formatDate(currentPeriod.endDate, lang)}
                    </dd>
                  </div>
                </dl>
                <Button asChild variant="secondary" size="lg">
                  <Link href={open ? `/${lang}/apply` : `/${lang}/grants`}>
                    {open ? t.ApplyNow : t.ViewDetails}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

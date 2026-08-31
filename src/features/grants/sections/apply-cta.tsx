import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { getCurrentApplicationPeriod } from "@/helpers/next-fetch/periodActions";
import { getDictionary } from "@/lib/dictionaries";

export async function GrantsApplyCta({ lang }: { lang: string }) {
  const currentPeriod = await getCurrentApplicationPeriod();
  const open = currentPeriod?.status === "Open";

  const dict = await getDictionary(lang);
  const t = dict.GrantsPage.CTA;

  return (
    <section className="pb-24 md:pb-32">
      <Container>
        <Reveal className="overflow-hidden rounded-[1.75rem] border border-hairline bg-white p-8 shadow-[0_24px_60px_-40px_rgba(11,61,46,0.4)] md:p-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="font-display text-3xl font-semibold leading-snug text-forest-deep md:text-4xl">
                {open ? t.OpenTitle : t.ClosedTitle}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-mist">
                {open ? t.OpenBody : t.ClosedBody}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:flex-col">
              <Button asChild size="lg" className="rounded-xl">
                <Link href={open ? `/${lang}/apply` : `/${lang}/track-application`}>
                  {open ? t.StartApplication : t.TrackApplication}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <Link href={open ? `/${lang}/track-application` : `/${lang}/donate`}>
                  {open ? t.TrackInstead : t.SupportFund}
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

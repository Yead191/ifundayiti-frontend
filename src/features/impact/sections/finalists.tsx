import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, MapPin } from "lucide-react";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { getImageUrl } from "@/lib/getImageUrl";
import { getDictionary } from "@/lib/dictionaries";

export async function ImpactFinalists({ lang }: { lang: string }) {
  // 1. Fetch latest period
  const periodRes = await nextFetch("/period?limit=1", { cache: "no-store" });
  const periods = periodRes.success ? periodRes.data || [] : [];
  const latestPeriod = periods[0];

  if (!latestPeriod) return null;

  // 2. Fetch finalists for this period
  const finalistsRes = await nextFetch(
    `/application?applicationPeriod=${latestPeriod._id}&status=finalist&limit=4`,
    { cache: "no-store" },
  );
  const finalists = finalistsRes.success ? finalistsRes.data || [] : [];

  if (finalists.length === 0) return null;

  const dict = await getDictionary(lang);
  const t = dict.ImpactPage.Finalists;

  return (
    <section className="py-24 md:py-32 bg-forest-deep relative overflow-hidden text-white">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-200 h-200 bg-forest/40 rounded-full blur-[120px] mix-blend-screen opacity-50 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-150 h-150 bg-forest-bright/20 rounded-full blur-[100px] mix-blend-screen opacity-30 translate-y-1/3 -translate-x-1/4" />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-16">
          <SectionHeading
            align="left"
            eyebrow={t.Eyebrow}
            title={t.Title}
            subtitle={`${t.SubtitlePre}${latestPeriod.title}${t.SubtitlePost}`}
            className="sm:max-w-2xl text-white"
            light={true}
          />
          <Link
            href={`/${lang}/finalists`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20 hover:scale-105 backdrop-blur-md border border-white/10"
          >
            {t.ViewAll}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {finalists.map((finalist: any, index: number) => (
            <Reveal key={finalist._id} delay={index * 100}>
              <div className="group relative h-100 w-full overflow-hidden rounded-3xl bg-forest border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]">
                <Image
                  src={getImageUrl(finalist.personal?.image) || ""}
                  alt={finalist.personal?.name || ""}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Gradient overlay to ensure text is readable */}
                <div className="absolute inset-0 bg-linear-to-t from-forest-deep via-forest-deep/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-sand-soft mb-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100 delay-100">
                      <Sparkles className="h-3 w-3" />
                      {t.Label}
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-white mb-1">
                      {finalist.personal?.name}
                    </h3>
                    <p className="text-sm text-white/80 line-clamp-2 mb-4 font-medium">
                      {finalist.grant?.projectName}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-white/60">
                      <MapPin className="h-3.5 w-3.5" />
                      {finalist.personal?.location}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

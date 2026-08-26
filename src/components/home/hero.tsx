import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { formatPrice } from "@/lib/utils";
import { getCurrentApplicationPeriod } from "@/helpers/next-fetch/periodActions";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1800&h=1200";

function formatDate(iso: string) {
  return new Date(`${iso}`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export async function HomeHero() {
  const currentPeriod = await getCurrentApplicationPeriod();
  const open = currentPeriod?.status === "Open";

  return (
    <section className="relative h-180 overflow-hidden bg-forest pt-24 text-white md:h-195 lg:h-210">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Community gathering in Haiti"
          fill
          priority
          className="object-cover object-[center_30%] scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-forest via-forest/88 to-forest/35" />
        <div className="absolute inset-0 bg-linear-to-t from-forest via-forest/20 to-forest/55" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <Container className="relative flex h-full flex-col justify-center pb-40 pt-8 md:pb-45 md:pt-4">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sand backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-sand" />
                {open ? "Applications open now" : "Grant program"}
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-7 max-w-2xl font-display text-[2.75rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
                Capital for ideas
                <span className="mt-1 block text-sand">rooted in Ayiti.</span>
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-sand/90 sm:text-lg">
                Equity-free micro-grants of up to $1,000 for Haitian builders —
                food, light, water, craft, and livelihoods that stay in the
                neighborhood.
              </p>
            </Reveal>

            <Reveal delay={200} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="rounded-xl px-7">
                <Link href={open ? "/apply" : "/grants"}>
                  {open ? "Apply for a Grant" : "View Grant Details"}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-xl border border-white/20 bg-white/8 px-7 text-white backdrop-blur-sm hover:bg-white/15"
              >
                <Link href="/projects">Explore the work</Link>
              </Button>
            </Reveal>
          </div>

          {currentPeriod && (
            <Reveal delay={120} className="lg:col-span-5">
              <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-6 backdrop-blur-md md:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sand/80">
                  Current cycle · {currentPeriod.status}
                </p>
                <p className="mt-2 font-display text-2xl font-semibold text-white">
                  {currentPeriod.title}
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-5 border-t border-white/10 pt-6">
                  <div>
                    <dt className="text-xs text-sand/70">Maximum grant</dt>
                    <dd className="mt-1 font-display text-2xl text-sand">
                      {formatPrice(currentPeriod.maximumGrantAmount)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-sand/70">Window</dt>
                    <dd className="mt-1 text-sm font-medium leading-snug text-white">
                      {formatDate(currentPeriod.startDate)} –{" "}
                      {formatDate(currentPeriod.endDate)}
                    </dd>
                  </div>
                </dl>
                <p className="mt-5 text-xs leading-relaxed text-sand/75">
                  One winner per cycle. Donations fuel the Program Fund — not a
                  single applicant.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}

import Link from "next/link";
import {
  Users,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { TEAM_STATS } from "@/data/team";

export function TeamHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-sand-soft/80 via-cream to-cream pb-16 pt-28 md:pb-24 md:pt-36">
      {/* Glow Auroras */}
      <div className="aurora -top-24 left-1/2 h-96 w-96 -translate-x-1/2 opacity-30" />
      <div className="aurora top-40 right-10 h-72 w-72 opacity-20" />

      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-forest-bright animate-pulse" />
              <span className="eyebrow text-xs tracking-wider text-forest font-semibold">
                People Behind IFundAyiti
              </span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-forest-deep sm:text-5xl md:text-6xl md:leading-[1.12]">
              Meet our <span className="text-gradient">Directors,</span> Core{" "}
              <span className="text-gradient">Members</span> & Dedicated{" "}
              <span className="text-gradient">Volunteers</span>
            </h1>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-6 text-lg text-mist md:text-xl md:leading-relaxed">
              From Port-au-Prince to Cap-Haïtien and the Diaspora, our team of
              directors, operational staff, and grassroots volunteers work
              tirelessly to deliver transparent, equity-free micro-grants to
              Haitian entrepreneurs and community builders.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-6 font-semibold shadow-md"
              >
                <a href="#team-grid">
                  Explore Team <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-xl border-forest/20 px-6 font-semibold"
              >
                <a href="#volunteer-cta">Join as a Volunteer</a>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Stats Grid */}
        <Reveal delay={250}>
          <div className="mt-16 grid grid-cols-2 gap-4 rounded-3xl border border-white/80 bg-white/70 p-6 shadow-xl backdrop-blur-xl sm:grid-cols-4 md:p-8">
            {TEAM_STATS.map((stat, i) => (
              <div
                key={i}
                className="text-center sm:border-r sm:border-hairline sm:last:border-r-0"
              >
                <div className="font-display text-3xl font-bold text-forest-deep md:text-4xl">
                  {stat.value}
                  <span className="text-forest">{stat.suffix}</span>
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-mist">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

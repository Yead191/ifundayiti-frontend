"use client";

import Image from "next/image";
import {
  HeartHandshake,
  Landmark,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { Reveal } from "@/components/ui/reveal";

const STORY_IMAGE =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200&h=900";

const REQUIREMENTS = [
  {
    icon: Users,
    title: "Rooted in Haiti",
    body: "You live here permanently — this is home, not a temporary address on paper.",
  },
  {
    icon: ShieldCheck,
    title: "Verified identity",
    body: "You hold a valid National Identification Number (NIF / CIN) and can share it when asked.",
  },
  {
    icon: HeartHandshake,
    title: "Work on the ground",
    body: "You run or propose a local micro-business or community project that neighbors can see and feel.",
  },
  {
    icon: Landmark,
    title: "Right-sized ask",
    body: "Your grant request stays at or below $1,000 USD — enough to move, not enough to disappear.",
  },
  {
    icon: ShieldCheck,
    title: "Ready to show proof",
    body: "You can upload proof of address and identification — accountability protects everyone in the cycle.",
  },
];

export function IFundAyitiAbout() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-linear-to-b from-cream via-sand-soft/50 to-cream" />
      <div className="aurora -right-20 top-16 h-80 w-80 animate-drift opacity-40" />
      <div className="aurora -left-24 bottom-8 h-64 w-64 animate-drift opacity-30 [animation-delay:-4s]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow">Why we&apos;re here</span>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-forest-deep sm:text-5xl">
              Capital that respects
              <span className="block text-forest">where you stand.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-mist">
              Behind every application is someone who already shows up for their
              block — feeding families, fixing a roof, lighting a lane, keeping
              a stall open. IFundAyiti exists so that effort can be seen, trusted,
              and funded with dignity.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal
            delay={80}
            className="group overflow-hidden rounded-[1.75rem] border border-hairline bg-white shadow-[0_28px_70px_-40px_rgba(11,61,46,0.45)] lg:col-span-7"
          >
            <div className="relative aspect-16/10 overflow-hidden sm:aspect-video">
              <Image
                src={STORY_IMAGE}
                alt="Community members gathered in Haiti"
                fill
                className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-forest/80 via-forest/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sand/85">
                  The heart of the program
                </p>
                <p className="mt-2 max-w-md font-display text-2xl font-semibold leading-snug text-white">
                  &ldquo;Dreams don&apos;t need a collateral file.&rdquo;
                </p>
              </div>
            </div>

            <div className="p-8 md:p-9">
              <div className="inline-flex items-center gap-2 rounded-full bg-forest/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest">
                <Sparkles className="h-3.5 w-3.5" />
                What is IFundAyiti?
              </div>
              <p className="mt-5 text-base leading-relaxed text-mist">
                IFundAyiti is a Hubology initiative built to bootstrap
                Haitian-owned micro-businesses, agricultural projects, and
                clean-energy ideas — the kind of work that keeps a neighborhood
                fed, lit, and employed.
              </p>
              <p className="mt-4 text-base leading-relaxed text-mist">
                Instead of matching donors to individual campaigns,{" "}
                <strong className="font-semibold text-forest-deep">
                  100% of public donations flow into one shared Program Fund
                </strong>
                . A local vetting board reads every file with care, selects
                finalists, and puts debt-free capital in the hands of people who
                were already building before we arrived.
              </p>
              <blockquote className="mt-8 border-l-2 border-sand bg-sand-soft/60 py-4 pl-5 pr-4 font-display text-lg leading-snug text-forest-deep">
                Trust stays with the mission — not a single profile.
              </blockquote>
            </div>
          </Reveal>

          <Reveal delay={120} className="flex flex-col gap-8 lg:col-span-5">
            <div className="relative overflow-hidden rounded-[1.75rem] bg-brand-gradient p-8 text-white shadow-[0_28px_70px_-36px_rgba(11,61,46,0.55)] md:p-9">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sand/80">
                  The micro-grant
                </p>
                <p className="mt-3 font-display text-2xl font-semibold leading-snug">
                  When the math doesn&apos;t work, the idea still might.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-sand/90">
                  Local builders face interest rates above 35%, collateral walls,
                  and paperwork that treats small plans like big risks. We
                  bypass that — with a grant sized for real first steps.
                </p>
                <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-sand/75">
                    Maximum award
                  </p>
                  <p className="mt-2 font-display text-5xl font-semibold tracking-tight text-sand">
                    $1,000
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/85">
                    Equity-free. One winner per cycle. Paid directly to verified
                    recipients — not through public individual profiles.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-amber-200/80 bg-linear-to-br from-amber-50 to-white p-6 shadow-sm md:p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-forest-deep">
                    A note on safety
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-mist">
                    We don&apos;t run direct funding campaigns on personal
                    profiles. Capital is transferred manually to selected
                    winners outside the platform — so every payout is verified,
                    traceable, and protected.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={160} className="mt-14 md:mt-16">
          <div className="rounded-[1.75rem] border border-hairline bg-white p-8 shadow-[0_24px_60px_-42px_rgba(11,61,46,0.4)] md:p-10">
            <div className="max-w-2xl">
              <span className="eyebrow">Eligibility</span>
              <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-forest-deep">
                You belong here if&hellip;
              </h3>
              <p className="mt-4 text-base leading-relaxed text-mist">
                We don&apos;t ask you to perform poverty. We ask you to show us
                the work — and the documents that keep the whole community safe.
              </p>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {REQUIREMENTS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.title}
                    className="group rounded-2xl border border-hairline bg-sand-soft/35 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest/20 hover:bg-white hover:shadow-[0_16px_40px_-28px_rgba(11,61,46,0.35)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-white shadow-[0_10px_24px_-14px_rgba(11,61,46,0.65)] transition-transform duration-300 group-hover:scale-105">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h4 className="mt-4 font-display text-lg font-semibold text-forest-deep">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-mist">
                      {item.body}
                    </p>
                  </li>
                );
              })}
            </ul>

            <p className="mt-10 border-t border-hairline pt-8 text-center font-display text-xl leading-snug text-forest-deep md:text-2xl">
              If you&apos;re already building where you live, you&apos;re exactly
              who this program was made for.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

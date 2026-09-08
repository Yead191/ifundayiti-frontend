"use client";

import * as React from "react";
import {
  Handshake,
  Users,
  Sparkles,
  Building2,
  PlusCircle,
} from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { BecomePartnerModal } from "@/features/partners/components/become-partner-modal";

interface PartnerHeroProps {
  totalPartners?: number;
  lang?: string;
  dict?: any;
}

export function PartnerHero({
  totalPartners = 0,
  lang = "en",
  dict,
}: PartnerHeroProps) {
  const [modalOpen, setModalOpen] = React.useState(false);

  const tHero = dict?.PartnersPage?.Hero || {};
  const tStats = tHero.Stats || {};

  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-full -translate-x-1/2 overflow-hidden">
        <div className="aurora -top-24 left-1/4 h-80 w-xl opacity-35" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow Pill */}
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white/70 px-4 py-1.5 shadow-2xs backdrop-blur-md">
              <Handshake className="h-4 w-4 text-forest" />
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                {tHero.Eyebrow || "Collaborative Impact"}
              </span>
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal delay={60}>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-forest-deep sm:text-5xl md:text-6xl">
              {tHero.Title || "Meet Our Trusted Partners"}
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay={120}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
              {tHero.Subtitle ||
                "Working hand-in-hand with pioneering businesses, foundations, and community allies to fuel grassroots progress and back Haitian entrepreneurs."}
            </p>
          </Reveal>

          {/* Action CTA */}
          <Reveal delay={180}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Button
                onClick={() => setModalOpen(true)}
                className="h-12 rounded-2xl bg-forest px-6 text-sm font-bold text-white shadow-lg shadow-forest/20 transition-all hover:-translate-y-0.5 hover:bg-forest/90"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {tHero.ApplyButton || "Become a Partner"}
              </Button>
            </div>
          </Reveal>

          {/* Quick Metrics Bar */}
          <Reveal delay={240}>
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6">
              <div className="flex flex-col items-center rounded-2xl border border-hairline bg-white/80 px-6 py-4 shadow-2xs backdrop-blur-sm sm:px-8 sm:py-5">
                <span className="font-display text-2xl font-extrabold text-forest-deep sm:text-3xl">
                  {totalPartners > 0 ? `${totalPartners}+` : "12+"}
                </span>
                <span className="mt-1 text-xs font-semibold text-mist">
                  {tStats.Partners || "Active Partners"}
                </span>
              </div>

              <div className="flex flex-col items-center rounded-2xl border border-hairline bg-white/80 px-6 py-4 shadow-2xs backdrop-blur-sm sm:px-8 sm:py-5">
                <span className="font-display text-2xl font-extrabold text-forest sm:text-3xl">
                  10+
                </span>
                <span className="mt-1 text-xs font-semibold text-mist">
                  Departments Reached
                </span>
              </div>

              <div className="col-span-2 flex flex-col items-center rounded-2xl border border-hairline bg-white/80 px-6 py-4 shadow-2xs backdrop-blur-sm sm:col-span-1 sm:px-8 sm:py-5">
                <span className="font-display text-2xl font-extrabold text-forest-deep sm:text-3xl">
                  100%
                </span>
                <span className="mt-1 text-xs font-semibold text-mist">
                  {tStats.Initiatives || "Grassroots Backed"}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Become a partner modal */}
      <BecomePartnerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        lang={lang}
        dict={dict}
      />
    </section>
  );
}

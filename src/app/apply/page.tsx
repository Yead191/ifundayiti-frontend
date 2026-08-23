import type { Metadata } from "next";
import { Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { ApplyExperience } from "@/components/application/apply-experience";
import { CURRENT_PERIOD } from "@/data/grant";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Apply for a Micro-Grant",
  description:
    "Apply for an IFundAyiti equity-free micro-grant of up to $1,000. Complete your personal, project, and document details in a guided 7-step application.",
  path: "/apply",
});

export default function ApplyPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Page Hero */}
      <PageHero
        eyebrow="🎯 Equity-Free Micro-Grant Application"
        title="Turn your vision into reality."
        subtitle={`${CURRENT_PERIOD.title} · Request up to $1,000 equity-free funding for your business or community initiative. Follow our guided application below.`}
      />

      {/* Trust & Guarantee Bar */}
      <section className="-mt-6 border-y border-hairline bg-white/80 py-4 backdrop-blur-xs">
        <Container>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                icon: Zap,
                title: "$1,000 Max Grant",
                desc: "Equity-free seed funding",
              },
              {
                icon: ShieldCheck,
                title: "0% Equity Taken",
                desc: "Non-dilutive community capital",
              },
              {
                icon: Sparkles,
                title: "Quarterly Cycle",
                desc: "Active review & selection",
              },
              {
                icon: Lock,
                title: "Encrypted & Secure",
                desc: "Confidential application review",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sand-soft text-forest">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-forest-deep">
                    {title}
                  </p>
                  <p className="text-[11px] text-mist">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Main Guided Application Experience */}
      <section className="py-12 lg:py-16">
        <Container>
          <ApplyExperience />
        </Container>
      </section>
    </div>
  );
}

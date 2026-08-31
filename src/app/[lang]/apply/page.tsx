import type { Metadata } from "next";
import Link from "next/link";
import {
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
  Clock,
  ArrowLeft,
} from "lucide-react";

import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { ApplyExperience } from "@/components/application/apply-experience";
import { getCurrentApplicationPeriod } from "@/helpers/next-fetch/periodActions";
import { formatGrantDate } from "@/features/grants/lib/format-grant-date";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Apply for a Micro-Grant",
  description:
    "Apply for an IFundAyiti equity-free micro-grant of up to $1,000. Complete your personal, project, and document details in a guided 7-step application.",
  path: "/apply",
});

export default async function ApplyPage() {
  const currentPeriod = await getCurrentApplicationPeriod();

  if (!currentPeriod) {
    return (
      <div className="bg-cream min-h-screen flex flex-col items-center justify-center py-20">
        <Container className="max-w-2xl text-center">
          <h1 className="font-display text-3xl font-semibold text-forest-deep">
            No active grant cycles
          </h1>
          <p className="mt-4 text-mist">
            Please check back later for upcoming grant opportunities.
          </p>
          <Button asChild className="mt-8 rounded-xl">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </Container>
      </div>
    );
  }

  const isOpen = currentPeriod.status === "Open";

  return (
    <div className="bg-cream min-h-screen">
      {/* Page Hero */}
      <PageHero
        eyebrow="🎯 Equity-Free Micro-Grant Application"
        title="Turn your vision into reality."
        subtitle={`${currentPeriod.title} · Request up to $1,000 equity-free funding for your business or community initiative. Follow our guided application below.`}
      />

      {/* Trust & Guarantee Bar */}
      <section className="-mt-6 border-y border-hairline bg-white/80 py-4 backdrop-blur-xs relative z-10">
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

      {/* Main Guided Application Experience OR Closed State */}
      <section className="py-12 lg:py-20 relative">
        <Container>
          {isOpen ? (
            <ApplyExperience />
          ) : (
            <div className="mx-auto max-w-3xl overflow-hidden rounded-4xl border border-hairline bg-white shadow-sm">
              <div className="bg-sand-soft/50 px-8 py-12 text-center sm:px-12">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-forest/10 text-forest">
                  <Clock className="h-10 w-10" />
                </div>
                <h2 className="mt-6 font-display text-3xl font-semibold text-forest-deep sm:text-4xl">
                  Applications are currently{" "}
                  {currentPeriod.status.toLowerCase()}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-mist">
                  The application window for the{" "}
                  <strong className="text-forest-deep">
                    {currentPeriod.title}
                  </strong>{" "}
                  is not open at this time.
                  {currentPeriod.status === "Upcoming" &&
                    ` It will open on ${formatGrantDate(currentPeriod.startDate)}.`}
                  {currentPeriod.status === "Closed" &&
                    ` The window closed on ${formatGrantDate(currentPeriod.endDate)}.`}
                  {currentPeriod.status === "Review" &&
                    ` We are currently reviewing applications. The window closed on ${formatGrantDate(currentPeriod.endDate)}.`}
                  {currentPeriod.status === "WinnerSelection" &&
                    ` We are finalizing our winner selection. The window closed on ${formatGrantDate(currentPeriod.endDate)}.`}
                </p>
              </div>

              <div className="grid gap-px bg-hairline sm:grid-cols-2">
                <div className="bg-white p-8">
                  <div className="flex items-center gap-3 text-forest-deep">
                    <Sparkles className="h-5 w-5 text-forest" />
                    <h3 className="font-semibold">Track your application</h3>
                  </div>
                  <p className="mt-2 text-sm text-mist leading-relaxed">
                    Already applied for a grant? You can check the live status
                    of your submission at any time.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 w-full rounded-xl border-forest/20"
                  >
                    <Link href="/track-application">Track Status</Link>
                  </Button>
                </div>
                <div className="bg-white p-8">
                  <div className="flex items-center gap-3 text-forest-deep">
                    <ShieldCheck className="h-5 w-5 text-forest" />
                    <h3 className="font-semibold">Program guidelines</h3>
                  </div>
                  <p className="mt-2 text-sm text-mist leading-relaxed">
                    Read about our selection criteria, eligibility requirements,
                    and the impact of the IFundAyiti program.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 w-full rounded-xl border-forest/20"
                  >
                    <Link href="/grants">Read Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { FAQBlock } from "@/components/faq/faq-block";
import {
  CURRENT_PERIOD,
  ELIGIBILITY,
  HOW_IT_WORKS,
  PREVIOUS_PERIODS,
  REQUIREMENTS,
} from "@/data/grant";
import { FAQ_GROUPS } from "@/data/faq";
import { formatPrice } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Grants",
  description:
    "Learn about the current IFundAyiti grant cycle, eligibility, documents, timeline, and how to apply for up to $1,000.",
  path: "/grants",
});

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function GrantsPage() {
  const open = CURRENT_PERIOD.status === "Open";
  const grantFaqs = FAQ_GROUPS.find((g) => g.id === "grants");

  return (
    <>
      <PageHero
        eyebrow="Grants"
        title="Everything you need before you apply."
        subtitle="Review the current cycle, eligibility, documents, and how selection works — then submit during an open window."
      />

      <section className="py-16">
        <Container className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-2xl bg-forest p-8 text-white lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">
              Current grant opportunity
            </p>
            <h2 className="mt-3 font-display text-3xl">{CURRENT_PERIOD.title}</h2>
            <p className="mt-3 text-sand/90">
              Status: {CURRENT_PERIOD.status}. Applications{" "}
              {formatDate(CURRENT_PERIOD.startDate)} –{" "}
              {formatDate(CURRENT_PERIOD.endDate)}.
            </p>
            <Button asChild variant="secondary" className="mt-6">
              <Link href={open ? "/apply" : "/track-application"}>
                {open ? "Apply now" : "Track an application"}
              </Link>
            </Button>
          </div>
          <div className="rounded-2xl border border-hairline bg-white p-8">
            <p className="text-sm text-mist">Maximum grant</p>
            <p className="mt-2 font-display text-4xl text-forest">
              {formatPrice(CURRENT_PERIOD.maximumGrantAmount)}
            </p>
            <p className="mt-3 text-sm text-mist">
              Requests above this amount cannot be considered.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-sand-soft/70 py-16">
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-forest-deep">Who can apply</h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-mist">
              {ELIGIBILITY.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl text-forest-deep">What you need</h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-mist">
              {REQUIREMENTS.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Selection"
            title="How selection works"
            subtitle="Applications move through submitted → under review → approved or rejected. Outstanding approved applicants may become finalists. One winner is selected per period."
          />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {HOW_IT_WORKS.map((item) => (
              <li key={item.step} className="border-t border-forest/20 pt-4">
                <p className="text-xs font-semibold text-forest">{item.step}</p>
                <h3 className="mt-2 font-display text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-mist">{item.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {grantFaqs && (
        <section className="bg-cream-dark py-16">
          <Container>
            <SectionHeading eyebrow="FAQ" title="Grant questions" />
            <div className="mx-auto mt-10 max-w-3xl">
              <FAQBlock items={grantFaqs.items} />
            </div>
          </Container>
        </section>
      )}

      <section className="py-16">
        <Container>
          <h2 className="font-display text-2xl text-forest-deep">
            Previous grant cycles
          </h2>
          <div className="mt-6 divide-y divide-hairline rounded-2xl border border-hairline bg-white">
            {PREVIOUS_PERIODS.map((period) => (
              <div
                key={period.id}
                className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-forest-deep">{period.title}</p>
                  <p className="text-sm text-mist">
                    {formatDate(period.startDate)} – {formatDate(period.endDate)}
                  </p>
                </div>
                <p className="text-sm text-mist">{period.status}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link href="/apply">Apply for this cycle</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

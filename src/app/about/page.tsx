import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import {
  LeadershipSection,
  VolunteersSection,
} from "@/components/home/people-sections";
import { DonationCta } from "@/components/home/donation-cta";
import { HOW_IT_WORKS } from "@/data/grant";
import { DEMO_NOTICE } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Learn about IFundAyiti — a grant program supporting Haitian entrepreneurs and community builders with equity-free micro-grants.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A program built around trust, community, and practical capital."
        subtitle="IFundAyiti helps Haitian builders turn workable ideas into local impact — through a public grant cycle that is easy to understand and follow."
      />

      <section className="py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our story"
              title="From a grant module to a public platform."
              subtitle="IFundAyiti began as a grant and application workflow. It is now a standalone public website for applicants, donors, and the communities those grants are meant to serve."
            />
            <p className="mt-6 text-sm text-faint">{DEMO_NOTICE}</p>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=1200&h=900"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Container>
      </section>

      <section className="bg-sand-soft/70 py-20">
        <Container className="grid gap-10 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8">
            <h2 className="font-display text-2xl text-forest-deep">Mission</h2>
            <p className="mt-3 leading-relaxed text-mist">
              Put small, equity-free grants in the hands of Haitian entrepreneurs
              and community builders whose ideas can improve daily life where they live.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-8">
            <h2 className="font-display text-2xl text-forest-deep">Vision</h2>
            <p className="mt-3 leading-relaxed text-mist">
              A public, trustworthy grant platform where applying, tracking, and
              supporting the mission all feel human and clear.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="What we believe"
            title="Clarity over complexity."
          />
          <blockquote className="mx-auto mt-10 max-w-3xl text-center font-display text-2xl leading-snug text-forest-deep md:text-3xl">
            “Donations fund the program. Grants fund the work. Communities feel the difference.”
          </blockquote>
        </Container>
      </section>

      <section className="bg-cream-dark py-20">
        <Container>
          <SectionHeading
            eyebrow="How we create impact"
            title="A simple grant lifecycle"
          />
          <ol className="mt-12 grid gap-6 md:grid-cols-5">
            {HOW_IT_WORKS.map((item) => (
              <li key={item.step} className="rounded-2xl bg-white p-5">
                <p className="text-xs font-semibold text-forest">{item.step}</p>
                <h3 className="mt-2 font-display text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-mist">{item.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16">
        <Container className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-hairline bg-white px-8 py-10 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl text-forest-deep">
              The grant program
            </h2>
            <p className="mt-2 max-w-xl text-mist">
              Open cycles accept applications for up to $1,000. One winner is selected per period.
            </p>
          </div>
          <Button asChild>
            <Link href="/grants">Review grant details</Link>
          </Button>
        </Container>
      </section>

      <LeadershipSection />
      <VolunteersSection />
      <DonationCta />
    </>
  );
}

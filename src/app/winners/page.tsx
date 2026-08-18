import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { WINNERS } from "@/data/projects";
import { formatPrice } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Winners",
  description:
    "Celebrate IFundAyiti grant winners and read how awarded projects moved from idea to community outcome.",
  path: "/winners",
});

export default function WinnersPage() {
  const [current, ...previous] = WINNERS;

  return (
    <>
      <PageHero
        eyebrow="Winners"
        title="Celebrating the people behind the grants."
        subtitle="One winner is selected per application period. Stories below are demo content until live winner data is connected."
      />

      <section className="py-16">
        <Container>
          {!current ? (
            <EmptyState
              title="Winner stories will appear here"
              body="Winner stories will appear here after the current grant cycle concludes."
              actionLabel="View grants"
              actionHref="/grants"
            />
          ) : (
            <Link
              href={`/winners/${current.slug}`}
              className="grid overflow-hidden rounded-2xl bg-forest text-white lg:grid-cols-2"
            >
              <div className="relative min-h-72">
                <Image
                  src={current.photoUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-8 md:p-12">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">
                  Current featured winner
                </p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl">
                  {current.name}
                </h2>
                <p className="mt-2 text-sand">
                  {current.projectName} · {current.location} ·{" "}
                  {formatPrice(current.awardedAmount)}
                </p>
                <p className="mt-5 line-clamp-5 text-sm leading-relaxed text-sand/90">
                  {current.story}
                </p>
              </div>
            </Link>
          )}
        </Container>
      </section>

      {previous.length > 0 && (
        <section className="pb-20">
          <Container>
            <h2 className="font-display text-2xl text-forest-deep">
              Previous winners
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {previous.map((w) => (
                <Link
                  key={w.id}
                  href={`/winners/${w.slug}`}
                  className="overflow-hidden rounded-2xl border border-hairline bg-white"
                >
                  <div className="relative aspect-4/3">
                    <Image
                      src={w.photoUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-forest">
                      {w.period}
                    </p>
                    <h3 className="mt-1 font-display text-xl">{w.name}</h3>
                    <p className="mt-1 text-sm text-mist">
                      {w.projectName} · {formatPrice(w.awardedAmount)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

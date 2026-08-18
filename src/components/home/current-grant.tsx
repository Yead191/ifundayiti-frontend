import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { CURRENT_PERIOD } from "@/data/grant";
import { formatPrice } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CurrentGrant() {
  const open = CURRENT_PERIOD.status === "Open";

  return (
    <section className="pt-24 pb-6">
      <Container>
        <Reveal>
          <div className="overflow-hidden rounded-[1.75rem] bg-forest text-white">
            <div className="grid gap-10 px-7 py-10 md:grid-cols-12 md:items-end md:px-12 md:py-14">
              <div className="md:col-span-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sand">
                  Current cycle · {CURRENT_PERIOD.status}
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl text-white">
                  {CURRENT_PERIOD.title}
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-sand/90 md:text-base">
                  A single open window. One winner. Grants up to{" "}
                  {formatPrice(CURRENT_PERIOD.maximumGrantAmount)}.
                </p>
              </div>
              <div className="flex flex-col gap-6 md:col-span-5 md:items-end">
                <dl className="grid w-full grid-cols-2 gap-6 text-sm">
                  <div>
                    <dt className="text-sand/70">Opens</dt>
                    <dd className="mt-1 font-display text-lg text-white">
                      {formatDate(CURRENT_PERIOD.startDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sand/70">Closes</dt>
                    <dd className="mt-1 font-display text-lg text-white">
                      {formatDate(CURRENT_PERIOD.endDate)}
                    </dd>
                  </div>
                </dl>
                <Button asChild variant="secondary" size="lg">
                  <Link href={open ? "/apply" : "/grants"}>
                    {open ? "Apply now" : "View grant details"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

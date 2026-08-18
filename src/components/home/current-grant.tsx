import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { CURRENT_PERIOD } from "@/data/grant";
import { formatPrice } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function CurrentGrant() {
  const open = CURRENT_PERIOD.status === "Open";

  return (
    <section className="pt-20 pb-8">
      <Container>
        <div className="grid items-center gap-8 rounded-2xl bg-forest px-6 py-8 text-white md:grid-cols-12 md:px-10 md:py-10">
          <div className="md:col-span-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">
              Current grant cycle
            </p>
            <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">
              {CURRENT_PERIOD.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-sand/90">
              Applications {open ? "are open" : "are not open"} from{" "}
              {formatDate(CURRENT_PERIOD.startDate)} to{" "}
              {formatDate(CURRENT_PERIOD.endDate)}. Maximum grant{" "}
              {formatPrice(CURRENT_PERIOD.maximumGrantAmount)}.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:col-span-4 md:items-end">
            <p className="font-display text-4xl text-sand">
              {formatPrice(CURRENT_PERIOD.maximumGrantAmount)}
            </p>
            <Button asChild variant="secondary">
              <Link href={open ? "/apply" : "/grants"}>
                {open ? "Apply Now" : "View grant details"}
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

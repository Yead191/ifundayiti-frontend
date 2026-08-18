import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

export function DonationCta() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-2xl bg-sand px-8 py-14 text-center md:px-16">
          <h2 className="font-display text-3xl text-forest-deep sm:text-4xl md:text-5xl">
            Your support can help turn the next great idea into impact.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-mist">
            Gifts go to the IFundAyiti Program Fund — fueling the next open grant cycle.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/donate">Donate Now</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

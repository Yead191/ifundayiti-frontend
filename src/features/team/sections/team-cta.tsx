import Link from "next/link";
import { HeartHandshake, ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export function TeamCta() {
  const benefits = [
    "Verify & support local micro-grant applicants in your city",
    "Translate application forms & community documentation",
    "Connect Haitian diaspora communities with grassroots projects",
    "Help build open-source tools for grant transparency",
  ];

  return (
    <section id="volunteer-cta" className="scroll-mt-24 py-16 md:py-24 bg-cream">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 text-white shadow-2xl md:p-14">
            {/* Background elements */}
            <div className="aurora -right-20 -top-20 h-80 w-80 opacity-30" />
            <div className="aurora -left-20 -bottom-20 h-80 w-80 opacity-20" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-sand backdrop-blur-md">
                  <HeartHandshake className="h-3.5 w-3.5 text-sand" />
                  Volunteers & Community Force
                </div>

                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-tight text-white">
                  Want to serve Haitian builders with us?
                </h2>

                <p className="mt-4 text-base leading-relaxed text-sand-soft md:text-lg">
                  Whether you are based in Port-au-Prince, Cap-Haïtien, Jacmel, or the global diaspora, 
                  we are always looking for passionate volunteers, local ambassadors, and contributors.
                </p>

                <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sand" />
                      <span className="text-sm font-medium text-white/90">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 lg:text-right">
                <div className="inline-flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                  <p className="text-sm text-sand font-medium text-left">
                    Ready to join as a Volunteer, Ambassador, or Core Member?
                  </p>
                  <Button asChild size="lg" className="rounded-xl bg-sand text-forest-deep hover:bg-white font-bold shadow-lg">
                    <Link href="/contact?subject=Join%20Team%20or%20Volunteer">
                      Get In Touch <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="rounded-xl border-white/30 text-white hover:bg-white/20">
                    <Link href="/about">Learn About Our Mission</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

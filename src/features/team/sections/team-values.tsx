import { ShieldCheck, MapPin, HeartHandshake, Globe } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { TEAM_VALUES } from "@/data/team";

const ICON_MAP = {
  ShieldCheck,
  MapPin,
  HeartHandshake,
  Globe,
};

export function TeamValues({ dict }: { dict: any }) {
  const values = [
    { icon: "ShieldCheck", title: dict.Val1Title, description: dict.Val1Desc },
    { icon: "MapPin", title: dict.Val2Title, description: dict.Val2Desc },
    { icon: "HeartHandshake", title: dict.Val3Title, description: dict.Val3Desc },
    { icon: "Globe", title: dict.Val4Title, description: dict.Val4Desc },
  ];

  return (
    <section className="py-16 md:py-24 bg-cream">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={dict.Eyebrow}
          title={dict.Title}
          subtitle={dict.Subtitle}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item, index) => {
            const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP] || ShieldCheck;
            return (
              <Reveal key={index} delay={index * 80}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-hairline bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-forest/30 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sand-soft text-forest transition-colors group-hover:bg-forest group-hover:text-white">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-forest-deep">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { GRANTS_PREPARE } from "@/data/grants-page";
import type { GrantsContentBlock } from "@/data/grants-page";
import { GRANTS_ICONS } from "@/features/grants/lib/icons";
import { getDictionary } from "@/lib/dictionaries";

function PrepareColumn({
  title,
  intro,
  items,
  delayOffset = 0,
}: {
  title: string;
  intro: string;
  items: readonly GrantsContentBlock[];
  delayOffset?: number;
}) {
  return (
    <div>
      <h3 className="font-display text-2xl font-semibold text-forest-deep">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-mist">{intro}</p>
      <ul className="mt-8 space-y-4">
        {items.map((item, index) => {
          const Icon = GRANTS_ICONS[item.icon];
          return (
            <Reveal key={item.title} delay={delayOffset + index * 60} as="li">
              <div className="flex gap-4 rounded-2xl border border-hairline bg-white p-5 transition-shadow hover:shadow-[0_16px_40px_-30px_rgba(11,61,46,0.3)]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-semibold text-forest-deep">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-mist">
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}

export async function GrantsPrepare({ lang }: { lang: string }) {
  const dict = await getDictionary(lang);
  const t = dict.GrantsPage.Prepare;

  const eligibility = {
    title: t.EligTitle,
    intro: t.EligIntro,
    items: [
      { icon: "map-pin" as const, title: t.EligItem1Title, body: t.EligItem1Body },
      { icon: "target" as const, title: t.EligItem2Title, body: t.EligItem2Body },
      { icon: "shield-check" as const, title: t.EligItem3Title, body: t.EligItem3Body },
      { icon: "hand-coins" as const, title: t.EligItem4Title, body: t.EligItem4Body },
    ],
  };

  const documents = {
    title: t.DocTitle,
    intro: t.DocIntro,
    items: [
      { icon: "file-check" as const, title: t.DocItem1Title, body: t.DocItem1Body },
      { icon: "home" as const, title: t.DocItem2Title, body: t.DocItem2Body },
      { icon: "clipboard" as const, title: t.DocItem3Title, body: t.DocItem3Body },
      { icon: "sparkles" as const, title: t.DocItem4Title, body: t.DocItem4Body },
      { icon: "image" as const, title: t.DocItem5Title, body: t.DocItem5Body },
    ],
  };

  return (
    <section
      id={GRANTS_PREPARE.id}
      className="scroll-mt-24 bg-sand-soft/60 py-24 md:py-32"
    >
      <Container>
        <SectionHeading
          eyebrow={t.Eyebrow}
          title={t.Title}
          subtitle={t.Subtitle}
        />
        <div className="mt-14 grid gap-14 lg:grid-cols-2">
          <PrepareColumn
            title={eligibility.title}
            intro={eligibility.intro}
            items={eligibility.items}
          />
          <PrepareColumn
            title={documents.title}
            intro={documents.intro}
            items={documents.items}
            delayOffset={40}
          />
        </div>
      </Container>
    </section>
  );
}

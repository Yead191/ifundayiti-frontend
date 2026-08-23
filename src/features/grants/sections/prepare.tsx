import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { GRANTS_PREPARE } from "@/data/grants-page";
import type { GrantsContentBlock } from "@/data/grants-page";
import { GRANTS_ICONS } from "@/features/grants/lib/icons";

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

export function GrantsPrepare() {
  return (
    <section
      id={GRANTS_PREPARE.id}
      className="scroll-mt-24 bg-sand-soft/60 py-24 md:py-32"
    >
      <Container>
        <SectionHeading
          eyebrow={GRANTS_PREPARE.eyebrow}
          title={GRANTS_PREPARE.title}
          subtitle={GRANTS_PREPARE.subtitle}
        />
        <div className="mt-14 grid gap-14 lg:grid-cols-2">
          <PrepareColumn
            title={GRANTS_PREPARE.eligibility.title}
            intro={GRANTS_PREPARE.eligibility.intro}
            items={GRANTS_PREPARE.eligibility.items}
          />
          <PrepareColumn
            title={GRANTS_PREPARE.documents.title}
            intro={GRANTS_PREPARE.documents.intro}
            items={GRANTS_PREPARE.documents.items}
            delayOffset={40}
          />
        </div>
      </Container>
    </section>
  );
}

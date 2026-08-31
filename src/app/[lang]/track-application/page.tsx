import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { ApplicationTracker } from "@/components/tracking/application-tracker";
import { buildMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.TrackingPage.Metadata;

  return buildMetadata({
    title: t.Title,
    description: t.Description,
    path: `/${lang}/track-application`,
  });
}

export default async function TrackApplicationPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.TrackingPage.Hero;

  return (
    <>
      <PageHero
        eyebrow={t.Eyebrow}
        title={t.Title}
        subtitle={t.Subtitle}
      />
      <section className="py-14">
        <Container>
          <ApplicationTracker lang={lang} />
        </Container>
      </section>
    </>
  );
}

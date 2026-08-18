import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { ApplicationTracker } from "@/components/tracking/application-tracker";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Track Application",
  description:
    "Check your IFundAyiti grant application status using the email and date of birth from your submission.",
  path: "/track-application",
});

export default function TrackApplicationPage() {
  return (
    <>
      <PageHero
        eyebrow="Status"
        title="Track your application"
        subtitle="Enter the email and date of birth used on your submission. Sensitive identification and documents are never shown here."
      />
      <section className="py-14">
        <Container>
          <ApplicationTracker />
        </Container>
      </section>
    </>
  );
}

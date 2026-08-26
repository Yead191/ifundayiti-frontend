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
        eyebrow="Application Status"
        title="Track Your Journey"
        subtitle="Stay updated on your IFundAyiti grant application. Enter your registered email and date of birth below to view your real-time status and next steps securely."
      />
      <section className="py-14">
        <Container>
          <ApplicationTracker />
        </Container>
      </section>
    </>
  );
}

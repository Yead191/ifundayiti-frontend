import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/shared/container";
import { ApplyExperience } from "@/components/application/apply-experience";
import { CURRENT_PERIOD } from "@/data/grant";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Apply",
  description:
    "Apply for an IFundAyiti micro-grant of up to $1,000. Complete your personal, project, and document details in a guided application.",
  path: "/apply",
});

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Apply"
        title="Submit your grant application"
        subtitle={`${CURRENT_PERIOD.title}. Maximum request $1,000. After you submit, track your status with your email and date of birth.`}
      />
      <section className="py-14">
        <Container className="max-w-3xl">
          <ApplyExperience />
        </Container>
      </section>
    </>
  );
}

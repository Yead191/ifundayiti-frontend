import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/legal-layout";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description:
    "Terms for using the IFundAyiti website, grant applications, donations, and shop.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions">
      <p>
        Placeholder terms for the public IFundAyiti website. Replace with the
        official terms before launch.
      </p>
      <p>
        Submitting an application does not guarantee funding. One winner is
        selected per application period. Donations support the Program Fund and
        are not assigned to individual applicants.
      </p>
    </LegalLayout>
  );
}

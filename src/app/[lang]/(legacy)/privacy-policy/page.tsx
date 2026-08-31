import type { Metadata } from "next";
import { LegalLayout } from "@/components/layout/legal-layout";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How IFundAyiti collects, uses, and protects personal information submitted through applications, donations, and the shop.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        This is placeholder legal copy for the public IFundAyiti website. Replace
        it with the official privacy policy before launch.
      </p>
      <p>
        Application tracking uses email and date of birth verification. National
        ID, passport numbers, private documents, and financial background are not
        shown on public status pages.
      </p>
      <p>
        Donation forms collect name, email, and amount. Payment details are
        processed only through the designated payment provider.
      </p>
    </LegalLayout>
  );
}

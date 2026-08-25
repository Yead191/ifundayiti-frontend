import { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PaymentFailedContent } from "@/features/payment/payment-failed";

export const metadata: Metadata = buildMetadata({
  title: "Payment Failed",
  description: "Something went wrong with your payment. No charge was made — please try again.",
  path: "/payment/failed",
  noIndex: true,
});

export default function PaymentFailedPage() {
  return (
    <Suspense>
      <PaymentFailedContent />
    </Suspense>
  );
}

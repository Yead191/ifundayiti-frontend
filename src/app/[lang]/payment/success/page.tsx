import { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PaymentSuccessContent } from "@/features/payment/payment-success";

export const metadata: Metadata = buildMetadata({
  title: "Payment Successful",
  description: "Your payment was processed successfully. Thank you for supporting IFundAyiti.",
  path: "/payment/success",
  noIndex: true,
});

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessContent />
    </Suspense>
  );
}

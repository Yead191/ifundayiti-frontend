import { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PaymentSuccessContent } from "@/features/payment/payment-success";
import { getDictionary } from "@/lib/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.PaymentSuccessPage?.Metadata;

  return buildMetadata({
    title: t?.Title || "Payment Successful",
    description:
      t?.Description ||
      "Your payment was processed successfully. Thank you for supporting IFundAyiti.",
    path: `/${lang}/payment/success`,
    noIndex: true,
  });
}

export default async function PaymentSuccessPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <Suspense>
      <PaymentSuccessContent lang={lang} />
    </Suspense>
  );
}

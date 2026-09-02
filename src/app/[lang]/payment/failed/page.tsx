import { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PaymentFailedContent } from "@/features/payment/payment-failed";
import { getDictionary } from "@/lib/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.PaymentFailedPage?.Metadata;

  return buildMetadata({
    title: t?.Title || "Payment Failed",
    description:
      t?.Description ||
      "Something went wrong with your payment. No charge was made — please try again.",
    path: `/${lang}/payment/failed`,
    noIndex: true,
  });
}

export default async function PaymentFailedPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <Suspense>
      <PaymentFailedContent lang={lang} />
    </Suspense>
  );
}

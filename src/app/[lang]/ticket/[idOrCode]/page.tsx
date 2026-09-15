import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Printer, Share2, Sparkles, Ticket } from "lucide-react";
import { getTicketHtml } from "@/helpers/next-fetch/eventActions";
import { buildMetadata } from "@/lib/seo";
import { TicketPrintClient } from "./TicketPrintClient";

interface PageProps {
  params: Promise<{
    lang: string;
    idOrCode: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, idOrCode } = await params;

  return buildMetadata({
    title: `Official Gathering Admission Pass | IFundAyiti`,
    description: `View and print your official admission ticket pass for IFundAyiti gathering #${idOrCode}.`,
    path: `/${lang}/ticket/${idOrCode}`,
    noIndex: true,
  });
}

export default async function TicketPage({ params }: PageProps) {
  const { lang, idOrCode } = await params;
  const res = await getTicketHtml(idOrCode);

  if (!res.success || !res.html) {
    return (
      <div className="min-h-screen bg-[#0E0E10] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-5 rounded-3xl border border-[#D4AF37]/30 bg-[#141418] p-8 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
            <Ticket className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              Ticket Pass Not Found
            </h2>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              We couldn't locate an admission pass with code or ID{" "}
              <strong className="text-[#D4AF37] font-mono">{idOrCode}</strong>.
              Please check your confirmation email or log into your account to access your bookings.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href={`/${lang}/events`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-xs font-bold text-neutral-950 hover:brightness-110 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Gatherings</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TicketPrintClient
      html={res.html}
      idOrCode={idOrCode}
      lang={lang}
    />
  );
}

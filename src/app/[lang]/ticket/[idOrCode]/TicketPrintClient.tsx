"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Printer,
  Share2,
  Sparkles,
  Ticket,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface TicketPrintClientProps {
  html: string;
  idOrCode: string;
  lang: string;
}

export function TicketPrintClient({
  html,
  idOrCode,
  lang,
}: TicketPrintClientProps) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = React.useState("900px");

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    } else {
      window.print();
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: "My Official IFundAyiti Gathering Pass",
          text: `Here is my admission ticket pass #${idOrCode}`,
          url,
        });
      } else {
        navigator.clipboard.writeText(url);
        toast.success("Pass link copied to clipboard!");
      }
    }
  };

  // Adjust height on load
  const handleIframeLoad = () => {
    try {
      if (iframeRef.current?.contentDocument) {
        const bodyHeight =
          iframeRef.current.contentDocument.body.scrollHeight ||
          iframeRef.current.contentDocument.documentElement.scrollHeight;
        if (bodyHeight > 400) {
          setIframeHeight(`${bodyHeight + 50}px`);
        }
      }
    } catch {
      // Cross-origin fallback
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-neutral-100 flex flex-col">
      {/* LUXURY CONTROLS TOPBAR (Hidden when printing) */}
      <header className="print:hidden sticky top-0 z-50 border-b border-[#D4AF37]/30 bg-[#0E0E10]/95 backdrop-blur-xl px-4 py-3.5 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Back & Title */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl border-white/20 bg-white/5 text-neutral-200 hover:bg-white/10"
            >
              <Link href={`/${lang}/events`}>
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                <span>Events</span>
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <span className="font-display text-sm sm:text-base font-bold text-white hidden sm:inline">
                Official Admission Pass
              </span>
              <span className="font-mono text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-2.5 py-0.5 rounded-md">
                {idOrCode}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:bg-white/10 cursor-pointer transition"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>

            <Button
              onClick={handlePrint}
              size="sm"
              className="rounded-xl font-semibold bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#B38F26] text-neutral-950 shadow-md hover:brightness-110 cursor-pointer"
            >
              <Printer className="h-4 w-4 mr-2 text-neutral-900" />
              <span>Print Ticket / Save PDF</span>
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN TICKET PRESENTATION CANVAS */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 md:p-10">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-[#D4AF37]/40 bg-[#121216] shadow-2xl shadow-black/80">
          <iframe
            ref={iframeRef}
            srcDoc={html}
            title="Official Admission Pass"
            className="w-full border-0 block"
            style={{ height: iframeHeight, minHeight: "750px" }}
            onLoad={handleIframeLoad}
          />
        </div>
      </main>

      {/* FOOTER CONTROLS / INSTRUCTIONS */}
      <footer className="print:hidden border-t border-white/10 bg-[#0E0E10] py-6 text-center text-xs text-neutral-400">
        <p>
          Present this pass on your mobile device or printed ticket at the venue check-in desk.
        </p>
        <p className="text-[11px] text-neutral-500 mt-1">
          IFundAyiti • Empowering Haitian Innovation Across the Globe
        </p>
      </footer>
    </div>
  );
}

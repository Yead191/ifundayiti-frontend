"use client";

import * as React from "react";
import Link from "next/link";
import {
  Heart,
  CheckCircle2,
  Copy,
  Check,
  CreditCard,
  Search,
  Sparkles,
  ShieldCheck,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IDonationItem } from "@/helpers/next-fetch/donationActions";

interface DonationsViewProps {
  donations: IDonationItem[];
  totalDonation: number;
  lang?: string;
}

function formatDate(dateStr?: string, isHt?: boolean): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(isHt ? "fr-HT" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function DonationsView({
  donations = [],
  totalDonation = 0,
  lang = "en",
}: DonationsViewProps) {
  const isHt = lang === "ht";
  const [searchTerm, setSearchTerm] = React.useState("");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  function handleCopy(text: string, label: string) {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(
      isHt
        ? `${label} kopye avèk siksè!`
        : `${label} copied to clipboard!`,
    );
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Filter donations
  const filteredDonations = React.useMemo(() => {
    if (!searchTerm.trim()) return donations;
    const term = searchTerm.toLowerCase().trim();
    return donations.filter((d) => {
      const txnId = (d.transactionId || d._id || "").toLowerCase();
      const amountStr = String(d.amount || "");
      const nameStr = (d.name || "").toLowerCase();
      return (
        txnId.includes(term) ||
        amountStr.includes(term) ||
        nameStr.includes(term)
      );
    });
  }, [donations, searchTerm]);

  const donationCount = donations.length;
  const computedTotal =
    totalDonation > 0
      ? totalDonation
      : donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header & Donate Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-cloud sm:text-3xl">
            {isHt ? "Donasyon Mwen Yo" : "My Donations"}
          </h1>
          <p className="mt-1 text-sm text-mist">
            {isHt
              ? "Istorik kontribisyon ou yo nan Fon Pwogram IFundAyiti pou sipòte kreyatè lokal yo."
              : "Your contribution history supporting Haitian grassroots builders through the IFundAyiti Program Fund."}
          </p>
        </div>

        <Button
          asChild
          size="sm"
          className="rounded-xl bg-forest hover:bg-forest-bright text-xs font-bold text-white shadow-xs self-start sm:self-auto"
        >
          <Link href={`/${lang}/donate`}>
            <Heart className="mr-1.5 h-3.5 w-3.5 fill-current text-rose-300" />
            {isHt ? "Fè Yon Lòt Don" : "Make a Donation"}
          </Link>
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <div className="rounded-2xl border border-hairline/80 bg-panel/80 p-4 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-mist">
              {isHt ? "Total Bay" : "Total Contributed"}
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-500/10 text-rose-500">
              <Heart className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-forest">
            {formatPrice(computedTotal)}
          </p>
          <p className="mt-1 text-[11px] text-mist">
            {isHt
              ? "100% ale dirèkteman nan sibvansyon"
              : "100% goes directly to equity-free grants"}
          </p>
        </div>

        <div className="rounded-2xl border border-hairline/80 bg-panel/80 p-4 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-mist">
              {isHt ? "Kantite Don" : "Contributions"}
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-forest/10 text-forest">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-cloud">
            {donationCount}
          </p>
          <p className="mt-1 text-[11px] text-mist">
            {isHt
              ? "Tranzaksyon ki konfime"
              : "Confirmed payment records"}
          </p>
        </div>

        <div className="rounded-2xl border border-hairline/80 bg-panel/80 p-4 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-mist">
              {isHt ? "Enpak Kominotè" : "Grant Impact"}
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600">
            {isHt ? "Verifye" : "Verified"}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-forest font-semibold">
            <Link
              href={`/${lang}/winners`}
              className="hover:underline flex items-center gap-1"
            >
              <span>{isHt ? "Gade gayan sibvansyon yo" : "See grant winners"}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      {donations.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-hairline/80 bg-panel/60 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4 shadow-xs">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                isHt
                  ? "Chèche pa Nimewo Tranzaksyon oswa montan..."
                  : "Search by Transaction ID or amount..."
              }
              className="h-10 rounded-xl border-hairline bg-white pl-9 text-xs text-cloud placeholder:text-mist/70 focus:bg-white"
            />
          </div>
          {searchTerm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="rounded-xl text-xs cursor-pointer"
            >
              {isHt ? "Efase rechèch" : "Clear Search"}
            </Button>
          )}
        </div>
      )}

      {/* Donations List / Empty State */}
      {filteredDonations.length === 0 ? (
        <div className="rounded-3xl border border-hairline/80 bg-panel/50 p-10 text-center backdrop-blur-md sm:p-14 shadow-xs">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-500/10 text-rose-500">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold text-cloud">
            {searchTerm
              ? isHt
                ? "Pa gen okenn don ki koresponn"
                : "No matching donations found"
              : isHt
                ? "Ou poko fè okenn don"
                : "No donations recorded yet"}
          </h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-mist leading-relaxed">
            {searchTerm
              ? isHt
                ? "Eseye retire tèm rechèch ou a pou w wè tout lis la."
                : "Try resetting your search query to view all donation records."
              : isHt
                ? "Chak dola ou bay antre dirèkteman nan Fon Pwogram IFundAyiti pou sipòte kreyatè, antreprenè, ak etidyan ayisyen."
                : "Every dollar donated directly fuels equity-free micro-grants for Haitian grassroots innovators and local community leaders."}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            {searchTerm ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="rounded-xl text-xs cursor-pointer"
              >
                {isHt ? "Reyajiste Rechèch" : "Reset Search"}
              </Button>
            ) : (
              <Button
                asChild
                size="sm"
                className="rounded-xl bg-forest hover:bg-forest-bright text-xs font-bold text-white shadow-xs"
              >
                <Link href={`/${lang}/donate`}>
                  <Heart className="mr-1.5 h-3.5 w-3.5 fill-current text-rose-300" />
                  {isHt ? "Fè Premye Don Ou" : "Make Your First Donation"}
                </Link>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDonations.map((item) => {
            const displayId =
              item.transactionId ||
              `#${item._id.slice(-8).toUpperCase()}`;
            const amount = item.amount || 0;

            return (
              <div
                key={item._id}
                className="group relative overflow-hidden rounded-2xl border border-hairline/80 bg-panel/75 p-4 sm:p-5 transition-all duration-200 hover:border-forest/40 hover:bg-panel hover:shadow-md"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left: Transaction ID and Date */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cloud">
                        {displayId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(displayId, "Transaction ID")}
                        className="text-mist hover:text-forest transition-colors cursor-pointer"
                        title={isHt ? "Klike pou kopye" : "Click to copy"}
                      >
                        {copiedId === displayId ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        {item.payment_status === "paid"
                          ? (isHt ? "Peye" : "Paid")
                          : (isHt ? "Konfime" : "Completed")}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-mist">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-mist/70" />
                        {formatDate(item.createdAt, isHt)}
                      </span>
                      {item.name ? (
                        <>
                          <span>·</span>
                          <span>{item.name}</span>
                        </>
                      ) : null}
                      <span>·</span>
                      <span className="text-forest font-medium">
                        IFundAyiti Program Fund
                      </span>
                    </div>
                  </div>

                  {/* Right: Amount */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-hairline/40 pt-2 sm:border-0 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-mist">
                        {isHt ? "Montan Donasyon" : "Donation Amount"}
                      </p>
                      <p className="font-display text-lg font-bold text-forest">
                        {formatPrice(amount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

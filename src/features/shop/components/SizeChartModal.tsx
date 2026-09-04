"use client";

import * as React from "react";
import { Ruler, X } from "lucide-react";
import { APPAREL_SIZE_CHART } from "../constants";

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  dict?: any;
}

export function SizeChartModal({ isOpen, onClose, dict }: SizeChartModalProps) {
  const [unit, setUnit] = React.useState<"in" | "cm">("in");
  const t = dict?.ShopPage?.SizeModal;

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-forest-deep/60 backdrop-blur-md transition-opacity animate-in fade-in"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-hairline bg-white shadow-2xl transition-all animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5 bg-sand-soft/30">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-forest/10 text-forest">
              <Ruler className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-forest-deep">
                {t?.Title || "Garment Size Guide"}
              </h3>
              <p className="text-xs text-mist">
                {t?.Subtitle || "Find your perfect tailored fit. Pre-shrunk for maximum comfort."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t?.Close || "Close"}
            className="grid h-9 w-9 place-items-center rounded-full bg-sand-soft/80 text-mist transition-colors hover:bg-sand hover:text-forest-deep"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Unit Toggle */}
          <div className="flex items-center justify-between pb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-forest">
              Measurement Unit
            </span>
            <div className="inline-flex rounded-full bg-sand-soft p-1 border border-hairline/60">
              <button
                type="button"
                onClick={() => setUnit("in")}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  unit === "in"
                    ? "bg-forest text-white shadow-xs"
                    : "text-mist hover:text-forest-deep"
                }`}
              >
                {t?.Inches || "Inches (in)"}
              </button>
              <button
                type="button"
                onClick={() => setUnit("cm")}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  unit === "cm"
                    ? "bg-forest text-white shadow-xs"
                    : "text-mist hover:text-forest-deep"
                }`}
              >
                {t?.Centimeters || "Centimeters (cm)"}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline bg-sand-soft/50 text-xs font-bold uppercase tracking-wider text-forest-deep">
                <tr>
                  <th className="px-4 py-3">{t?.Size || "Size"}</th>
                  <th className="px-4 py-3">{t?.Chest || "Chest Width"}</th>
                  <th className="px-4 py-3">{t?.Length || "Body Length"}</th>
                  <th className="px-4 py-3">{t?.Sleeve || "Sleeve Length"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline text-mist font-medium">
                {APPAREL_SIZE_CHART.map((row) => (
                  <tr
                    key={row.size}
                    className="transition-colors hover:bg-sand-soft/30 hover:text-forest-deep"
                  >
                    <td className="px-4 py-3 font-semibold text-forest-deep">
                      {row.size}
                    </td>
                    <td className="px-4 py-3">
                      {unit === "in" ? `${row.chestIn}″` : `${row.chestCm} cm`}
                    </td>
                    <td className="px-4 py-3">
                      {unit === "in" ? `${row.lengthIn}″` : `${row.lengthCm} cm`}
                    </td>
                    <td className="px-4 py-3">
                      {unit === "in" ? `${row.sleeveIn}″` : `${row.sleeveCm} cm`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Note */}
          <div className="mt-5 rounded-2xl bg-sand-soft/40 p-4 text-xs text-mist leading-relaxed border border-hairline/60">
            <strong className="font-semibold text-forest-deep">Fitting Tip:</strong>{" "}
            For a more relaxed, oversized streetwear look, order one size up. For a true-to-body tailored silhouette, select your standard size.
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-hairline px-6 py-4 bg-sand-soft/20 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-forest px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-forest/90"
          >
            {t?.Close || "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}

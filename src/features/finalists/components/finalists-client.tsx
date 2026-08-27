"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, ChevronDown } from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import { FinalistModal } from "./finalist-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";

interface FinalistsClientProps {
  periods: any[];
  finalists: any[];
  currentPeriodId: string;
}

export function FinalistsClient({ periods, finalists, currentPeriodId }: FinalistsClientProps) {
  const router = useRouter();
  const [selectedFinalist, setSelectedFinalist] = useState<any | null>(null);

  const handlePeriodChange = (value: string) => {
    router.push(`/finalists?period=${value}`);
  };

  return (
    <div className="w-full">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-hairline shadow-sm">
        <div>
          <h2 className="font-display text-2xl text-forest-deep mb-2">
            Select Grant Cycle
          </h2>
          <p className="text-sm text-mist">
            Browse finalists from our current and previous application periods.
          </p>
        </div>
        <div className="w-full md:w-72">
          <Select value={currentPeriodId} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-full bg-sand-soft/30 border-hairline h-12 rounded-xl text-forest-deep font-medium">
              <SelectValue placeholder="Select a period" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period._id} value={period._id}>
                  {period.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {finalists.length === 0 ? (
        <EmptyState
          title="No finalists announced yet"
          body="Finalists for this grant cycle have not been announced yet. Please check back later."
          actionLabel="View all grants"
          actionHref="/grants"
        />
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {finalists.map((f: any) => (
            <button
              key={f._id}
              onClick={() => setSelectedFinalist(f)}
              className="group text-left flex flex-col overflow-hidden rounded-4xl bg-white border border-hairline hover:border-forest/20 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-4/3 overflow-hidden w-full">
                <Image
                  src={getImageUrl(f.personal?.image) || ""}
                  alt={f.personal?.name || "Finalist"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-forest-deep uppercase tracking-wider shadow-sm">
                  <Calendar className="h-3.5 w-3.5" />
                  {f.applicationPeriod?.title}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1 w-full">
                <h3 className="font-display text-2xl text-forest-deep group-hover:text-forest transition-colors">
                  {f.personal?.name}
                </h3>
                <p className="mt-2 text-sm font-medium text-forest/80 line-clamp-1">
                  {f.grant?.projectName}
                </p>

                <div className="mt-6 pt-6 border-t border-hairline flex items-center justify-between text-mist text-sm">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{f.personal?.location}</span>
                  </div>
                  <div className="text-forest font-medium text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Details
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <FinalistModal
        open={!!selectedFinalist}
        onClose={() => setSelectedFinalist(null)}
        finalist={selectedFinalist}
      />
    </div>
  );
}

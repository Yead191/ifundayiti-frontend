import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, BadgeDollarSign } from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import { formatPrice } from "@/lib/utils";

interface PreviousWinnersGridProps {
  winners: any[];
  lang?: string;
}

export function PreviousWinnersGrid({ winners, lang = "en" }: PreviousWinnersGridProps) {
  if (winners.length === 0) return null;

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {winners.map((w: any) => (
        <Link
          key={w._id}
          href={`/${lang}/winners/${w._id}`}
          className="group flex flex-col overflow-hidden rounded-4xl bg-white border border-hairline hover:border-forest/20 shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <div className="relative aspect-4/3 overflow-hidden">
            <Image
              src={getImageUrl(w.personal?.image) || ""}
              alt={w.personal?.name || "Winner"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-forest-deep uppercase tracking-wider shadow-sm">
              <Calendar className="h-3.5 w-3.5" />
              {w.applicationPeriod?.title}
            </div>
          </div>
          <div className="p-8 flex flex-col flex-1">
            <h3 className="font-display text-2xl text-forest-deep group-hover:text-forest transition-colors">
              {w.personal?.name}
            </h3>
            <p className="mt-2 text-sm font-medium text-forest/80 line-clamp-1">
              {w.grant?.projectName}
            </p>

            <div className="mt-6 pt-6 border-t border-hairline flex items-center justify-between text-mist text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{w.personal?.location}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-forest-deep">
                <BadgeDollarSign className="h-4 w-4" />
                <span>{formatPrice(w.awardedAmount)}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

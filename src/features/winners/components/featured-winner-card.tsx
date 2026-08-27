import Image from "next/image";
import Link from "next/link";
import { Trophy, MapPin, BadgeDollarSign, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import { formatPrice } from "@/lib/utils";

interface FeaturedWinnerCardProps {
  winner: any;
}

export function FeaturedWinnerCard({ winner }: FeaturedWinnerCardProps) {
  return (
    <div className="relative isolate group">
      <Link
        href={`/winners/${winner._id}`}
        className="grid overflow-hidden rounded-[2.5rem] bg-forest text-white lg:grid-cols-12 shadow-2xl transition-transform hover:-translate-y-1 duration-500"
      >
        <div className="relative min-h-100 lg:min-h-full lg:col-span-7 overflow-hidden">
          <Image
            src={getImageUrl(winner.personal?.image) || ""}
            alt={winner.personal?.name || "Winner"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-forest/80 via-forest/20 to-transparent lg:hidden" />
        </div>
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center lg:col-span-5 relative z-10 bg-forest lg:bg-linear-to-l lg:from-forest lg:to-forest/95">
          <div className="flex items-center gap-2 mb-6">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-sand text-forest-deep shadow-lg">
              <Trophy className="h-4 w-4" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">
              Featured Winner
            </p>
          </div>

          <h2 className="font-display text-4xl lg:text-5xl leading-tight">
            {winner.personal?.name}
          </h2>
          <h3 className="mt-2 text-xl font-medium text-sand/90">
            {winner.grant?.projectName}
          </h3>

          <div className="mt-8 flex flex-col gap-3 text-sand/80">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-sand" />
              <span>{winner.personal?.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <BadgeDollarSign className="h-5 w-5 text-sand" />
              <span>{formatPrice(winner.awardedAmount)} Grant</span>
            </div>
          </div>

          <p className="mt-8 line-clamp-4 text-sm leading-relaxed text-sand/70">
            {winner.successStory}
          </p>

          <div className="mt-10 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-sand group-hover:text-white transition-colors">
            Read full story
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </div>
  );
}

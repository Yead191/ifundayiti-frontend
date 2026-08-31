import Image from "next/image";
import { Calendar, MapPin, User, BadgeDollarSign } from "lucide-react";
import { Container } from "@/components/shared/container";
import { getImageUrl } from "@/lib/getImageUrl";
import { formatPrice } from "@/lib/utils";
import { getDictionary } from "@/lib/dictionaries";

interface WinnerIdentityProps {
  winner: any;
  lang?: string;
}

export async function WinnerIdentity({ winner, lang = "en" }: WinnerIdentityProps) {
  const dict = await getDictionary(lang);
  const t = dict.WinnersPage.Identity;

  return (
    <>
      {/* Profile & Identity Section (Overlapping the hero) */}
      <div className="relative z-30">
        <Container>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* DP Profile */}
            <div className="relative h-48 w-48 sm:h-56 sm:w-56 rounded-[2.5rem] border-8 border-sand-soft/10 bg-white overflow-hidden shadow-2xl shrink-0 -mt-24 sm:-mt-32 rotate-3 transition-transform hover:rotate-0 duration-500 z-30">
              <Image
                src={getImageUrl(winner.personal?.image) || ""}
                alt={winner.personal?.name || "Winner"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 250px, 300px"
                priority
                draggable={false}
              />
            </div>

            {/* Name and Project */}
            <div className="text-center md:text-left flex-1 md:-mt-11 pb-4">
              <div className="inline-flex items-center gap-2 bg-forest text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
                <Calendar className="h-4 w-4" />
                {winner.applicationPeriod?.title}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-forest-deep leading-tight mb-2">
                {winner.personal?.name}
              </h1>
              <p className="text-xl sm:text-2xl text-mist font-medium">
                {winner.grant?.projectName}
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Stats Row */}
      <div className="relative z-20 mt-12">
        <Container>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 bg-white p-6 sm:p-8 rounded-4xl shadow-sm border border-hairline max-w-5xl mx-auto">
            <div className="flex items-center gap-4 flex-1">
              <div className="h-12 w-12 rounded-full bg-forest/10 flex items-center justify-center text-forest shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-mist uppercase tracking-wider">
                  {t.Location}
                </p>
                <p className="text-lg font-medium text-forest-deep truncate">
                  {winner.personal?.location}
                </p>
              </div>
            </div>

            <div className="hidden sm:block w-px bg-hairline" />

            <div className="flex items-center gap-4 flex-1">
              <div className="h-12 w-12 rounded-full bg-forest/10 flex items-center justify-center text-forest shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-mist uppercase tracking-wider">
                  {lang === "ht" ? "Okipasyon" : "Occupation"}
                </p>
                <p className="text-lg font-medium text-forest-deep truncate">
                  {winner.background?.occupation}
                </p>
              </div>
            </div>

            <div className="hidden sm:block w-px bg-hairline" />

            <div className="flex items-center gap-4 flex-1">
              <div className="h-12 w-12 rounded-full bg-forest/10 flex items-center justify-center text-forest shrink-0">
                <BadgeDollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-mist uppercase tracking-wider">
                  {lang === "ht" ? "Kantite Lajan" : "Awarded"}
                </p>
                <p className="text-lg font-medium text-forest-deep truncate">
                  {formatPrice(winner.awardedAmount)}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import { getDictionary } from "@/lib/dictionaries";

interface WinnerGalleryProps {
  winner: any;
  lang?: string;
}

export async function WinnerGallery({ winner, lang = "en" }: WinnerGalleryProps) {
  if (!winner.projectGallery || winner.projectGallery.length === 0) {
    return null;
  }

  const dict = await getDictionary(lang);
  const t = dict.WinnersPage.Gallery;

  return (
    <div className="lg:col-span-5 space-y-8">
      <div className="flex items-center gap-2 border-b border-hairline pb-4">
        <ImageIcon className="h-5 w-5 text-forest" />
        <h3 className="font-semibold text-forest-deep uppercase tracking-wider">
          {t.Gallery}
        </h3>
      </div>

      <div className="grid gap-6">
        {winner.projectGallery.map((src: string, idx: number) => (
          <div
            key={src}
            className="group relative aspect-4/3 overflow-hidden rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <Image
              src={getImageUrl(src) || ""}
              alt={`${winner.grant?.projectName} gallery image ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 400px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

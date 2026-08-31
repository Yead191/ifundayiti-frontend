import { Quote, Rocket, Sparkles } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";

interface WinnerStoryProps {
  winner: any;
  lang?: string;
}

export async function WinnerStory({ winner, lang = "en" }: WinnerStoryProps) {
  const dict = await getDictionary(lang);
  const t = dict.WinnersPage.Story;

  return (
    <div className="lg:col-span-7 space-y-16">
      {/* Project Overview Blocks */}
      <div className="grid sm:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-hairline shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-forest/10 text-forest">
              <Rocket className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-forest-deep uppercase tracking-wider text-sm">
              {lang === "ht" ? "Itilizasyon Fon" : "Fund Usage"}
            </h3>
          </div>
          <p className="text-mist text-sm leading-relaxed">
            {winner.grant?.fundUsage}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-hairline shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-forest/10 text-forest">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-forest-deep uppercase tracking-wider text-sm">
              {t.ExpectedImpact}
            </h3>
          </div>
          <p className="text-mist text-sm leading-relaxed">
            {winner.grant?.expectedImpact}
          </p>
        </div>
      </div>

      {/* Success Story */}
      <div>
        <div className="flex gap-4 mb-8">
          <Quote className="h-12 w-12 text-forest/20 shrink-0 transform -scale-x-100" />
          <h2 className="font-display text-3xl text-forest-deep">
            {t.TheStory}
          </h2>
        </div>

        <div className="prose prose-lg prose-p:text-mist prose-p:leading-loose">
          {/* Using drop cap styling for the first letter */}
          <p className="first-letter:text-6xl first-letter:font-display first-letter:font-bold first-letter:text-forest first-letter:mr-3 first-letter:float-left">
            {winner.successStory}
          </p>
        </div>
      </div>
    </div>
  );
}

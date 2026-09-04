"use client";

import * as React from "react";
import { Heart, Ruler } from "lucide-react";
import type { ApparelProduct } from "@/helpers/next-fetch/shopActions";

interface ProductStoryTabsProps {
  product: ApparelProduct;
  onOpenSizeChart: () => void;
  dict?: any;
}

export function ProductStoryTabs({
  product,
  onOpenSizeChart,
  dict,
}: ProductStoryTabsProps) {
  const [activeTab, setActiveTab] = React.useState<"specs" | "impact" | "fit">(
    "specs"
  );
  const t = dict?.ShopPage?.Detail;

  return (
    <div className="mt-16 sm:mt-24 border-t border-hairline pt-12">
      {/* Tab navigation headers */}
      <div className="flex items-center gap-3 border-b border-hairline pb-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("specs")}
          className={`rounded-2xl px-5 py-2.5 text-sm font-bold transition-all ${
            activeTab === "specs"
              ? "bg-forest text-white shadow-xs"
              : "text-mist hover:bg-sand-soft hover:text-forest-deep"
          }`}
        >
          {t?.Tabs?.Description || "Fabric & Specifications"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("impact")}
          className={`rounded-2xl px-5 py-2.5 text-sm font-bold transition-all ${
            activeTab === "impact"
              ? "bg-forest text-white shadow-xs"
              : "text-mist hover:bg-sand-soft hover:text-forest-deep"
          }`}
        >
          {t?.Tabs?.Impact || "The Social Impact"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("fit")}
          className={`rounded-2xl px-5 py-2.5 text-sm font-bold transition-all ${
            activeTab === "fit"
              ? "bg-forest text-white shadow-xs"
              : "text-mist hover:bg-sand-soft hover:text-forest-deep"
          }`}
        >
          {t?.Tabs?.SizeFit || "Size & Fit Guide"}
        </button>
      </div>

      {/* Tab 1: Fabric & Specifications (Renders HTML description from editor) */}
      {activeTab === "specs" && (
        <div className="mt-8 max-w-4xl animate-in fade-in">
          {product.description ? (
            <div
              className="prose prose-stone max-w-none text-mist leading-relaxed text-sm sm:text-base [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>h1]:text-2xl [&>h1]:font-display [&>h1]:font-bold [&>h1]:text-forest-deep [&>h2]:text-xl [&>h2]:font-display [&>h2]:font-bold [&>h2]:text-forest-deep [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-forest-deep [&>strong]:text-forest-deep [&>a]:text-forest [&>a]:underline"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <p className="text-mist text-sm">
              100% combed ringspun organic cotton. Pre-shrunk for a structured,
              comfortable fit. High-density embroidered accents. Machine wash cold,
              tumble dry low.
            </p>
          )}

          {/* Tag Pills */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-hairline">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-sand-soft/80 border border-hairline/80 px-3 py-1 text-xs font-semibold text-forest-deep"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: The Social Impact */}
      {activeTab === "impact" && (
        <div className="mt-8 max-w-3xl animate-in fade-in space-y-4">
          <div className="rounded-3xl border border-forest/20 bg-sand-soft/40 p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-3 py-1 text-xs font-bold text-forest">
              <Heart className="h-3.5 w-3.5 fill-forest" />
              <span>100% Non-Profit Proceeds</span>
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-forest-deep">
              Wear the mission. Power grassroots Haitian independence.
            </h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-mist">
              {t?.ImpactStory ||
                "100% of store profits from this product directly fund community grants, solar power installations, and clean water projects across Haiti. By wearing this piece, you're directly fueling local sustainable independence."}
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Size & Fit Guide */}
      {activeTab === "fit" && (
        <div className="mt-8 max-w-3xl animate-in fade-in space-y-4">
          <p className="text-sm sm:text-base leading-relaxed text-mist">
            {t?.ModelStats ||
              "Model is 6'1\" wearing size Large in a relaxed fit. Pre-shrunk organic cotton ensures consistent fit after washing."}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenSizeChart}
              className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-forest/90"
            >
              <Ruler className="h-4 w-4" />
              <span>View Measurements Table</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

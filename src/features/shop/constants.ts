export const SHOP_GENDERS = [
  { value: "all", label: "All" },
  { value: "unisex", label: "Unisex" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
] as const;

export type ShopGender = (typeof SHOP_GENDERS)[number]["value"];

export const SHOP_SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "-createdAt", label: "New Arrivals" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-sold", label: "Best Sellers" },
] as const;

export type ShopSortOption = (typeof SHOP_SORT_OPTIONS)[number]["value"];

/** Common color swatches mapper for apparel */
export const COLOR_HEX_MAP: Record<string, string> = {
  "caribbean navy": "#1b2a47",
  "navy": "#1e293b",
  "vintage black": "#18181b",
  "black": "#09090b",
  "oatmeal heather": "#e2ded6",
  "oatmeal": "#e7e2d7",
  "heather grey": "#9ca3af",
  "grey": "#71717a",
  "palm green": "#1c3829",
  "forest green": "#1e3a29",
  "green": "#15803d",
  "cream": "#fdfbf7",
  "warm sand": "#dfd6c5",
  "sand": "#d7cbba",
  "white": "#ffffff",
  "crimson": "#991b1b",
  "red": "#dc2626",
  "terracotta": "#c25e40",
  "clay": "#b45309",
  "sun yellow": "#eab308",
  "caribbean blue": "#0284c7",
  "royal blue": "#1d4ed8",
  "earth brown": "#5c3d2e",
};

export function getColorHex(colorName: string): string {
  if (!colorName) return "#64748b";
  const normalized = colorName.toLowerCase().trim();
  if (COLOR_HEX_MAP[normalized]) return COLOR_HEX_MAP[normalized];
  for (const [key, hex] of Object.entries(COLOR_HEX_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return hex;
    }
  }
  return "#475569";
}

/** Standard Apparel Size Chart (Hoodies, T-Shirts, Outerwear) */
export interface SizeChartRow {
  size: string;
  chestIn: string;
  chestCm: string;
  lengthIn: string;
  lengthCm: string;
  sleeveIn: string;
  sleeveCm: string;
}

export const APPAREL_SIZE_CHART: SizeChartRow[] = [
  { size: "XS", chestIn: "34–36", chestCm: "86–91", lengthIn: "27", lengthCm: "68", sleeveIn: "32.5", sleeveCm: "82" },
  { size: "S", chestIn: "36–38", chestCm: "91–96", lengthIn: "28", lengthCm: "71", sleeveIn: "33.5", sleeveCm: "85" },
  { size: "M", chestIn: "38–41", chestCm: "96–104", lengthIn: "29", lengthCm: "73", sleeveIn: "34.5", sleeveCm: "87" },
  { size: "L", chestIn: "42–45", chestCm: "106–114", lengthIn: "30", lengthCm: "76", sleeveIn: "35.5", sleeveCm: "90" },
  { size: "XL", chestIn: "46–49", chestCm: "116–124", lengthIn: "31", lengthCm: "78", sleeveIn: "36.5", sleeveCm: "92" },
  { size: "XXL", chestIn: "50–53", chestCm: "127–134", lengthIn: "32", lengthCm: "81", sleeveIn: "37.5", sleeveCm: "95" },
];

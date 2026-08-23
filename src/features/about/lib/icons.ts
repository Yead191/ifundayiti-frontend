import {
  HandHeart,
  Landmark,
  Scale,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import type { AboutIconId } from "@/data/about";

export const ABOUT_ICONS: Record<AboutIconId, LucideIcon> = {
  scale: Scale,
  "shield-check": ShieldCheck,
  "hand-heart": HandHeart,
  landmark: Landmark,
};

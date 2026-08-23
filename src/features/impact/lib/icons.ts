import {
  Award,
  HeartHandshake,
  Landmark,
  MapPin,
  Sparkles,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import type { ImpactIconId } from "@/data/impact-page";

export const IMPACT_ICONS: Record<ImpactIconId, LucideIcon> = {
  wallet: Wallet,
  award: Award,
  users: Users,
  "heart-handshake": HeartHandshake,
  landmark: Landmark,
  sparkles: Sparkles,
  "map-pin": MapPin,
};

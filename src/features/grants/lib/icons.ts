import {
  Award,
  Calendar,
  Clipboard,
  FileCheck,
  HandCoins,
  Home,
  Image,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { GrantsIconId } from "@/data/grants-page";

export const GRANTS_ICONS: Record<GrantsIconId, LucideIcon> = {
  "map-pin": MapPin,
  users: Users,
  target: Target,
  "shield-check": ShieldCheck,
  "file-check": FileCheck,
  home: Home,
  clipboard: Clipboard,
  sparkles: Sparkles,
  image: Image,
  calendar: Calendar,
  search: Search,
  award: Award,
  "hand-coins": HandCoins,
};

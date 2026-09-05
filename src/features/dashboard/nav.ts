import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  BookOpen,
  Package,
  Crown,
  Lock,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export const DASHBOARD_NAV: DashboardNavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Your IFundAyiti account at a glance",
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: Package,
    description: "Order history & shipment tracking",
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
    description: "Personal details & password",
  },
];

export const DASHBOARD_SECURITY_NAV: DashboardNavItem = {
  label: "Password",
  href: "/dashboard/profile#password",
  icon: Lock,
  description: "Update your sign-in password",
};

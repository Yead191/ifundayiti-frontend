export interface NavItem {
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Donate", href: "/donate" },

  {
    label: "Shop",
    href: "/store",
  },

  { label: "Contact", href: "/contact" },
];

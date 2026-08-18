export interface NavItem {
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Grants", href: "/grants" },
  {
    label: "Impact",
    href: "/impact",
    subItems: [
      { label: "Our Impact", href: "/impact" },
      { label: "Projects", href: "/projects" },
      { label: "Winners", href: "/winners" },
      { label: "Success Stories", href: "/impact#success-stories" },
    ],
  },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  explore: [
    { label: "About", href: "/about" },
    { label: "Grants", href: "/grants" },
    { label: "Impact", href: "/impact" },
    { label: "Projects", href: "/projects" },
    { label: "Winners", href: "/winners" },
  ],
  participate: [
    { label: "Apply", href: "/apply" },
    { label: "Track Application", href: "/track-application" },
    { label: "Donate", href: "/donate" },
    { label: "Shop", href: "/shop" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "FAQ", href: "/faq" },
  ],
};

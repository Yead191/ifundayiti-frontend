export interface PublicProject {
  id: string;
  slug: string;
  name: string;
  description: string;
  location: string;
  grantAmount: number;
  status: "Approved" | "Finalist" | "Winner";
  imageUrl: string;
  period: string;
}

/** Publicly visible demo projects. Replace with approved-application API data. */
export const FEATURED_PROJECTS: PublicProject[] = [
  {
    id: "p1",
    slug: "eco-grow-hydroponics",
    name: "Eco-Grow Hydroponics",
    description:
      "Urban hydroponic farming to supply fresh leafy greens using water-efficient systems.",
    location: "Port-au-Prince",
    grantAmount: 950,
    status: "Approved",
    imageUrl:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=900&h=700",
    period: "Summer 2027 Grant Cycle",
  },
  {
    id: "p2",
    slug: "soleil-clean-energy",
    name: "Soleil Clean Energy",
    description:
      "A solar charging kiosk for affordable phone charging and clean lighting.",
    location: "Cap-Haïtien",
    grantAmount: 800,
    status: "Finalist",
    imageUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=900&h=700",
    period: "Summer 2027 Grant Cycle",
  },
  {
    id: "p3",
    slug: "atelye-kreyatif",
    name: "Atelye Kreyatif Jacmel",
    description:
      "A workshop training youth in papier-mâché and recycled art.",
    location: "Jacmel",
    grantAmount: 1000,
    status: "Finalist",
    imageUrl:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=900&h=700",
    period: "Summer 2027 Grant Cycle",
  },
  {
    id: "p4",
    slug: "cayes-clean-water",
    name: "Cayes Clean Water Station",
    description:
      "A gravity-based filtration station offering affordable drinking water.",
    location: "Les Cayes",
    grantAmount: 900,
    status: "Approved",
    imageUrl:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=900&h=700",
    period: "Summer 2027 Grant Cycle",
  },
];

export interface WinnerStory {
  id: string;
  slug: string;
  name: string;
  projectName: string;
  awardedAmount: number;
  period: string;
  location: string;
  story: string;
  photoUrl: string;
  gallery: string[];
}

export const WINNERS: WinnerStory[] = [
  {
    id: "w1",
    slug: "fabienne-bastien-cocoa",
    name: "Fabienne Bastien",
    projectName: "Bastien Cocoa Processing",
    awardedAmount: 1000,
    period: "Spring 2026 Grant Cycle",
    location: "Saint-Marc",
    story:
      "A $1,000 grant helped purchase grinding equipment and packaging tools. Weekly cocoa processing grew from a small handmade batch to a regional supply of chocolate and cocoa powder, and two local women joined the packaging team.",
    photoUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800&h=900",
    gallery: [
      "https://images.unsplash.com/photo-1511381939415-e44015466831?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800&h=600",
    ],
  },
  {
    id: "w2",
    slug: "luc-desir-carpentry",
    name: "Luc Desir",
    projectName: "Desir Carpentry & Repair",
    awardedAmount: 950,
    period: "Winter 2025 Grant Cycle",
    location: "Jacmel",
    story:
      "With a micro-grant, Luc added safer power tools to a hand-tool workshop. The shop has since built school benches and repaired storm-damaged roof timbers, and now hosts weekend woodcraft sessions for high-school students.",
    photoUrl:
      "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=800&h=900",
    gallery: [
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800&h=600",
    ],
  },
];

export function getWinnerBySlug(slug: string) {
  return WINNERS.find((w) => w.slug === slug) ?? null;
}

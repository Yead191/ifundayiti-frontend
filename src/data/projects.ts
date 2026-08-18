export interface PublicProject {
  id: string;
  slug: string;
  name: string;
  description: string;
  location: string;
  grantAmount: number;
  status: "Approved" | "Finalist" | "Winner";
  category: string;
  founder: string;
  year: string;
  imageUrl: string;
  period: string;
  challenge: string;
  approach: string;
  outcome: string;
  story: string;
  gallery: string[];
  featured?: boolean;
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
    category: "Food",
    founder: "Jean-Baptiste Pierre",
    year: "2027",
    imageUrl:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1400&h=1000",
    period: "Summer 2027 Grant Cycle",
    challenge:
      "Imported vegetables were expensive in Delmas, and rooftop space was the only land available.",
    approach:
      "A compact hydroponic rack, solar-assisted pumps, and locally sourced piping turned a roof into a growing floor.",
    outcome:
      "The model is designed to reach fifty local families with leafy greens while using far less water than soil beds.",
    story:
      "Eco-Grow began as a single rack on a Delmas rooftop. The grant is meant to buy pumps, solar cells, and nutrient solution so the system can feed neighbors instead of relying on costly imports. This is demo project copy — replace with a verified public case study.",
    gallery: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=1200&h=800",
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=1200&h=800",
    ],
    featured: true,
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
    category: "Energy",
    founder: "Marie-Claire Augustin",
    year: "2027",
    imageUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1400&h=1000",
    period: "Summer 2027 Grant Cycle",
    challenge:
      "Daily blackouts closed a neighborhood kiosk at sunset and left children studying by candlelight.",
    approach:
      "Two solar panels, a deep-cycle battery, and a wooden kiosk keep phones charged and lamps lit after dark.",
    outcome:
      "The kiosk is planned as a safe evening light source for street vendors and nearby households.",
    story:
      "Soleil Clean Energy is a market-side charging point. The grant covers panels, a battery, and a simple structure so evening trade does not depend on kerosene. Demo copy — replace with official project notes.",
    gallery: [
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1200&h=800",
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=1200&h=800",
    ],
    featured: true,
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
    category: "Craft",
    founder: "Dieudonné Joseph",
    year: "2027",
    imageUrl:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=1400&h=1000",
    period: "Summer 2027 Grant Cycle",
    challenge:
      "Youth in Jacmel had few paid paths in a city known for carnival craft but short on workshop tools.",
    approach:
      "A shared studio with tables, paint, wire mesh, and a small showcase space for finished work.",
    outcome:
      "The studio is designed to mentor ten young people through a three-month craft cycle.",
    story:
      "Atelye Kreyatif treats papier-mâché as both heritage and income. Grant funds buy materials and a place to teach. Demo copy — replace before launch.",
    gallery: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200&h=800",
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=1200&h=800",
    ],
    featured: true,
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
    category: "Water",
    founder: "Lourdes Chery",
    year: "2027",
    imageUrl:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=1400&h=1000",
    period: "Summer 2027 Grant Cycle",
    challenge:
      "Clean drinking water remained scarce in La Savane, with bottled water priced beyond many households.",
    approach:
      "Ceramic filters, storage tanks, and reusable jugs sold at a neighborhood station.",
    outcome:
      "The station is planned to serve more than a hundred nearby households with cheaper, safer water.",
    story:
      "The Cayes station uses gravity filtration rather than diesel pumps. Demo copy for the public works archive.",
    gallery: [
      "https://images.unsplash.com/photo-1521207411485-19603277adc0?auto=format&fit=crop&q=80&w=1200&h=800",
    ],
  },
  {
    id: "p5",
    slug: "bernard-poultry",
    name: "Bernard Poultry Hatchery",
    description:
      "A small hatchery supplying eggs and chicks without long-distance commercial transport.",
    location: "Gonaïves",
    grantAmount: 750,
    status: "Approved",
    category: "Food",
    founder: "Roody Bernard",
    year: "2027",
    imageUrl:
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=1400&h=1000",
    period: "Summer 2027 Grant Cycle",
    challenge:
      "Protein prices in Raboteau rose faster than casual port work could cover.",
    approach:
      "An incubator, feed, fencing, and vaccines for a modest backyard hatchery.",
    outcome:
      "Local egg production is meant to stay in the neighborhood instead of arriving by long truck routes.",
    story:
      "Bernard Poultry is a micro hatchery built close to the people it feeds. Demo copy — replace with a verified public story.",
    gallery: [
      "https://images.unsplash.com/photo-1569428034239-f0557cd99c1d?auto=format&fit=crop&q=80&w=1200&h=800",
    ],
  },
  {
    id: "p6",
    slug: "bastien-cocoa",
    name: "Bastien Cocoa Processing",
    description:
      "Small-batch cocoa grinding and packaging that grew a family kitchen into a regional supply.",
    location: "Saint-Marc",
    grantAmount: 1000,
    status: "Winner",
    category: "Livelihood",
    founder: "Fabienne Bastien",
    year: "2026",
    imageUrl:
      "https://images.unsplash.com/photo-1511381939415-e44015466831?auto=format&fit=crop&q=80&w=1400&h=1000",
    period: "Spring 2026 Grant Cycle",
    challenge:
      "Cocoa was ground by hand, capping production at a few kilos a week.",
    approach:
      "A grinding machine and sealers turned a home process into packaged cocoa and chocolate.",
    outcome:
      "Weekly volume rose sharply, with two local women hired for packing and three grocers supplied.",
    story:
      "Bastien Cocoa is the public winner story for Spring 2026. Demo figures — replace with official reporting.",
    gallery: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200&h=800",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200&h=800",
    ],
    featured: true,
  },
];

export const PROJECT_CATEGORIES = [
  "All",
  "Food",
  "Energy",
  "Water",
  "Craft",
  "Livelihood",
] as const;

export function getProjectBySlug(slug: string) {
  return FEATURED_PROJECTS.find((p) => p.slug === slug) ?? null;
}

export function getRelatedProjects(project: PublicProject, limit = 3) {
  return FEATURED_PROJECTS.filter(
    (p) => p.id !== project.id && (p.category === project.category || p.featured),
  ).slice(0, limit);
}

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

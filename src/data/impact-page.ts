export type ImpactIconId =
  | "wallet"
  | "award"
  | "users"
  | "heart-handshake"
  | "landmark"
  | "sparkles"
  | "map-pin";

export interface ImpactStat {
  value: string;
  label: string;
  detail: string;
  note?: string;
}

export interface ImpactFundStep {
  step: string;
  title: string;
  body: string;
}

export interface ImpactPillar {
  icon: ImpactIconId;
  title: string;
  body: string;
}

export const IMPACT_PAGE = {
  metadata: {
    title: "Impact",
    description:
      "See the community impact of IFundAyiti grants — projects supported, winner stories, and how program funds are used.",
    path: "/impact",
  },
} as const;

export const IMPACT_HERO = {
  eyebrow: "Field notes · Impact",
  title: "Proof you can",
  titleAccent: "walk past.",
  subtitle:
    "Not a pitch deck — a record of what grants left behind: stalls still open, roofs that hold, and livelihoods neighbors notice on the way home.",
  quote: "Impact is a walk home that feels different.",
  quoteAttribution: "IFundAyiti field principle",
  chapters: [
    { href: "#metrics", label: "01 · Metrics", hint: "The numbers" },
    { href: "#projects", label: "02 · Projects", hint: "Work in view" },
    { href: "#success-stories", label: "03 · Stories", hint: "Lives changed" },
    { href: "#winners", label: "04 · Winners", hint: "Who was funded" },
  ],
  collage: [
    {
      src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=900&h=1100",
      alt: "Neighbors gathered in community",
      caption: "Community",
      className: "col-span-7 row-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=700&h=500",
      alt: "Local agricultural work",
      caption: "Livelihoods",
      className: "col-span-5",
    },
    {
      src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=700&h=500",
      alt: "People working side by side",
      caption: "Builders",
      className: "col-span-5",
    },
  ],
  proofStrip: [
    { value: "12", label: "Grants awarded" },
    { value: "36", label: "Projects in view" },
    { value: "$11.4k", label: "Put to work" },
    { value: "1", label: "Winner / cycle" },
  ],
} as const;

export const IMPACT_STATS = {
  id: "metrics",
  eyebrow: "By the numbers",
  title: "A growing record — still early, already local.",
  subtitle:
    "Figures below are replaceable demo values until official reporting is connected. They show the shape of the program, not a finished ledger.",
  items: [
    {
      value: "148",
      label: "Applications received",
      detail: "Ideas submitted across open cycles",
      note: "Demo figure",
    },
    {
      value: "12",
      label: "Grants awarded",
      detail: "Winners funded with equity-free capital",
      note: "Demo figure",
    },
    {
      value: "36",
      label: "Projects supported",
      detail: "Builders whose work reached a public page",
      note: "Demo figure",
    },
    {
      value: "$11.4k",
      label: "Funds awarded",
      detail: "Pooled Program Fund dollars put to work",
      note: "Demo figure",
    },
  ] satisfies ImpactStat[],
} as const;

export const IMPACT_SUCCESS = {
  id: "success-stories",
  eyebrow: "Winner story",
  pullQuote:
    "A small grant does not rewrite a whole economy. It can rewrite one week of work — and that is where trust begins.",
  ctaLabel: "Read the full story",
} as const;

export const IMPACT_FUND_FLOW = {
  id: "fund",
  eyebrow: "How money moves",
  title: "Donations fund the program. Grants fund the work.",
  subtitle:
    "Gifts are never tied to a single applicant profile. They pool into one Program Fund, then leave as verified awards to selected winners.",
  steps: [
    {
      step: "01",
      title: "Program Fund",
      body: "Public donations and partners contribute to a shared pool — not to individual crowdfunding campaigns.",
    },
    {
      step: "02",
      title: "Cycle award",
      body: "During each period, one winner is selected. The maximum award remains $1,000, equity-free.",
    },
    {
      step: "03",
      title: "Verified payout",
      body: "Funds are transferred manually to verified recipients so capital stays accountable and protected.",
    },
  ] satisfies ImpactFundStep[],
  pillars: [
    {
      icon: "landmark",
      title: "One shared fund",
      body: "Trust belongs to the mission — not a single profile chasing donations in public.",
    },
    {
      icon: "award",
      title: "One winner per cycle",
      body: "Focus stays sharp. Communities can follow a clear result instead of endless campaigns.",
    },
    {
      icon: "heart-handshake",
      title: "Local, visible change",
      body: "Food, energy, water, craft, and livelihoods that neighbors can see on a walk home.",
    },
  ] satisfies ImpactPillar[],
} as const;

export const IMPACT_WINNERS = {
  id: "winners",
  eyebrow: "Recent winners",
  title: "People whose ideas already left a mark.",
  subtitle:
    "Each winner represents a full grant cycle — reviewed, selected, and funded from the Program Fund.",
  viewAllHref: "/winners",
  viewAllLabel: "View all winners",
} as const;

export const IMPACT_CTA = {
  eyebrow: "Keep the fund moving",
  title: "Help turn the next idea into something neighbors can feel.",
  body: "Your gift strengthens the Program Fund for the next open cycle — not a one-off campaign, but a continuing promise to Haitian builders.",
  primary: { href: "/donate", label: "Support the Program Fund" },
  secondary: { href: "/grants", label: "How grants work" },
} as const;

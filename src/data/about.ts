export type AboutIconId =
  | "scale"
  | "shield-check"
  | "hand-heart"
  | "landmark";

export interface AboutHighlight {
  label: string;
  value: string;
}

export interface AboutNavLink {
  href: string;
  label: string;
}

export interface AboutPrinciple {
  icon: AboutIconId;
  title: string;
  body: string;
}

export interface AboutAudience {
  title: string;
  emotion: string;
  body: string;
}

export interface AboutGovernanceStep {
  step: string;
  title: string;
  body: string;
}

export const ABOUT_PAGE = {
  metadata: {
    title: "About",
    description:
      "Learn about IFundAyiti — a grant program supporting Haitian entrepreneurs and community builders with equity-free micro-grants.",
    path: "/about",
  },
} as const;

export const ABOUT_HERO = {
  eyebrow: "About IFundAyiti",
  title: "The people and principles",
  titleAccent: "behind every grant.",
  subtitleSuffix: "This page is for the story, the standards, and the team — not the application form.",
  image:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1400&h=1600",
  imageAlt: "Hands working together on a community project",
  highlights: [
    { label: "Origin", value: "Hubology initiative" },
    { label: "Focus", value: "Haiti-first grants" },
    { label: "Model", value: "Public by design" },
  ] satisfies AboutHighlight[],
  navLinks: [
    { href: "#story", label: "Our story" },
    { href: "#principles", label: "Principles" },
    { href: "#team", label: "Team" },
  ] satisfies AboutNavLink[],
  locationCard: {
    label: "Based in Ayiti",
    quote:
      "Programs should feel close to the streets they serve — not distant in a dashboard.",
  },
} as const;

export const ABOUT_STORY = {
  id: "story",
  eyebrow: "Our story",
  title: "A grant workflow that grew into something public.",
  subtitle:
    "IFundAyiti started inside Hubology as a way to review local ideas with care. It became its own site so applicants, donors, and communities could share one clear record.",
  paragraphs: [
    "That evolution was intentional. Private spreadsheets and closed inboxes make hope feel fragile. A public platform lets families track an application, lets donors see how gifts are used, and lets winners be celebrated without exposing every personal detail online.",
    "We are still early — much of this site runs on demo content while official program details are finalized. The commitment is already real: run grants with transparency, respect, and a Haiti-first point of view.",
  ],
  image:
    "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=1200&h=900",
  imageAlt: "Community members collaborating in Haiti",
  callout: "Small teams. Clear rules. Real names behind the work.",
} as const;

export const ABOUT_PRINCIPLES = {
  id: "principles",
  eyebrow: "What we stand for",
  title: "Four principles that do not bend.",
  subtitle:
    "Not slogans for a homepage — standards we use when reviewing files, speaking with donors, and choosing winners.",
  items: [
    {
      icon: "scale",
      title: "Open by default",
      body: "Application status, finalists, and winners are visible on a public site — not hidden behind private threads or opaque approvals.",
    },
    {
      icon: "shield-check",
      title: "Local eyes on every file",
      body: "A vetting board reads each submission with neighborhood context in mind. Capital follows judgment, not algorithms alone.",
    },
    {
      icon: "hand-heart",
      title: "Dignity in the process",
      body: "We ask for verification without spectacle. Proof protects the community; it should never feel like a performance of hardship.",
    },
    {
      icon: "landmark",
      title: "One fund, many futures",
      body: "Donations pool into a single Program Fund. Grants go to selected winners — not to individual crowdfunding profiles.",
    },
  ] satisfies AboutPrinciple[],
} as const;

export const ABOUT_AUDIENCES = {
  eyebrow: "Who this is for",
  title: "Three groups, one shared outcome.",
  subtitle:
    "IFundAyiti only works when builders, supporters, and neighbors all recognize themselves in the process.",
  items: [
    {
      title: "Builders & vendors",
      emotion: "You already carry the risk.",
      body: "Street cooks, plot tenders, repair crews, and corner inventors who need a first push — not another loan with impossible terms.",
    },
    {
      title: "Donors near and far",
      emotion: "You want proof, not pressure.",
      body: "Give to a program you can explain to a friend: where money pools, how winners are chosen, and why names stay protected.",
    },
    {
      title: "Neighbors who feel the result",
      emotion: "Impact should be visible on the block.",
      body: "Better light, cleaner water, fuller stalls, safer lanes — the kind of change you notice on a walk home, not in a press release.",
    },
  ] satisfies AboutAudience[],
} as const;

export const ABOUT_GOVERNANCE = {
  eyebrow: "How decisions are made",
  title: "Governance without mystery.",
  subtitle:
    "The home page walks through the grant lifecycle. Here is the accountability layer underneath it.",
  steps: [
    {
      step: "01",
      title: "Applications arrive",
      body: "During an open cycle, builders submit ideas, IDs, and supporting documents through a structured public form.",
    },
    {
      step: "02",
      title: "Board review",
      body: "The vetting board checks completeness, feasibility, and community fit. Approved applicants may appear as public finalists.",
    },
    {
      step: "03",
      title: "Winner & payout",
      body: "One winner is selected per period. Funds are transferred manually to verified recipients — outside individual campaign pages.",
    },
  ] satisfies AboutGovernanceStep[],
} as const;

export const ABOUT_CONNECT = {
  eyebrow: "Stay connected",
  title: "Ready to go deeper?",
  body: "Grant rules and timelines live on the grants page. Questions about the program — or how to partner with us — belong in a conversation, not a repeated homepage pitch.",
  primaryCta: { href: "/grants", label: "Read grant details" },
  secondaryCta: { href: "/contact", label: "Contact the team" },
} as const;

export const ABOUT_TEAM = {
  id: "team",
} as const;

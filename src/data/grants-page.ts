export type GrantsIconId =
  | "map-pin"
  | "users"
  | "target"
  | "shield-check"
  | "file-check"
  | "home"
  | "clipboard"
  | "sparkles"
  | "image"
  | "calendar"
  | "search"
  | "award"
  | "hand-coins";

export interface GrantsContentBlock {
  icon: GrantsIconId;
  title: string;
  body: string;
}

export interface GrantsSelectionStep {
  step: string;
  title: string;
  body: string;
  emotion: string;
}

export interface GrantsNavLink {
  href: string;
  label: string;
}

export const GRANTS_PAGE = {
  metadata: {
    title: "Grants",
    description:
      "Learn about the current IFundAyiti grant cycle, eligibility, documents, timeline, and how to apply for up to $1,000.",
    path: "/grants",
  },
} as const;

export const GRANTS_HERO = {
  eyebrow: "Grant program",
  title: "Read the cycle",
  titleAccent: "before you apply.",
  subtitle:
    "One open window, one winner, up to $1,000 in equity-free capital. This page is your checklist — eligibility, documents, selection, and what happens after you submit.",
  highlights: [
    { label: "Maximum award", value: "$1,000 USD" },
    { label: "Winners per cycle", value: "One" },
    { label: "Equity taken", value: "None" },
  ],
  navLinks: [
    { href: "#cycle", label: "Current cycle" },
    { href: "#prepare", label: "Prepare" },
    { href: "#selection", label: "Selection" },
    { href: "#faq", label: "FAQ" },
  ] satisfies GrantsNavLink[],
  image:
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1400&h=1200",
  imageAlt: "Community agricultural work in Haiti",
  imageQuote:
    "A clear process turns a good idea into a fair shot — not a guessing game.",
} as const;

export const GRANTS_CYCLE = {
  id: "cycle",
  eyebrow: "Current opportunity",
  closedEyebrow: "Cycle status",
  openLead: "The window is open — submit while dates allow.",
  closedLead: "Applications are closed for this period. Track status or prepare for the next cycle.",
  maxGrantNote:
    "Requests above the maximum cannot be reviewed. Plan for materials, tools, stock, or launch costs you can show on paper.",
} as const;

export const GRANTS_PREPARE = {
  id: "prepare",
  eyebrow: "Before you start",
  title: "Prepare your file with care.",
  subtitle:
    "Incomplete applications slow everyone down. Gather these pieces first so your story reads clearly on the first pass.",
  eligibility: {
    title: "Who can apply",
    intro:
      "We look for builders rooted in Haiti with a project neighbors can recognize — not slide decks aimed at distant investors.",
    items: [
      {
        icon: "map-pin",
        title: "Based in Haiti",
        body: "You live and work locally, and you can carry out the proposed project where the community will feel it.",
      },
      {
        icon: "target",
        title: "Community-facing work",
        body: "Livelihoods, food, energy, water, education, craft, or similar needs — projects that improve daily life on the ground.",
      },
      {
        icon: "shield-check",
        title: "Verified identity",
        body: "Valid government ID and proof of address. Verification protects applicants, donors, and the vetting board alike.",
      },
      {
        icon: "hand-coins",
        title: "Right-sized request",
        body: "Your ask stays at or below $1,000 USD. Show exactly how each dollar moves the project forward.",
      },
    ] satisfies GrantsContentBlock[],
  },
  documents: {
    title: "What to gather",
    intro:
      "Required items are non-negotiable. Optional materials help reviewers picture your plan faster.",
    items: [
      {
        icon: "file-check",
        title: "Government-issued ID",
        body: "Required — confirms you are the applicant behind the file.",
      },
      {
        icon: "home",
        title: "Proof of address",
        body: "Required — ties the project to a real place reviewers can understand.",
      },
      {
        icon: "clipboard",
        title: "Project description & fund-use plan",
        body: "Required — what you will do, what you need, and how funds will be spent.",
      },
      {
        icon: "sparkles",
        title: "Expected community impact",
        body: "Required — who benefits, how soon, and why it matters on your block.",
      },
      {
        icon: "image",
        title: "Business plan or photos",
        body: "Optional but strongly recommended — sketches, stall photos, or a simple plan go a long way.",
      },
    ] satisfies GrantsContentBlock[],
  },
} as const;

export const GRANTS_SELECTION = {
  id: "selection",
  eyebrow: "After you submit",
  title: "How selection actually works.",
  subtitle:
    "No hidden stages. Your status moves in public view — from first submission to one funded winner per cycle.",
  steps: [
    {
      step: "01",
      title: "Submitted",
      emotion: "Your file enters the queue.",
      body: "You receive confirmation and can track status with the email and date of birth used on the form.",
    },
    {
      step: "02",
      title: "Under review",
      emotion: "Real people read your plan.",
      body: "The team checks completeness, feasibility, and community impact. Missing pieces may delay a decision.",
    },
    {
      step: "03",
      title: "Approved or not",
      emotion: "Every applicant deserves a clear answer.",
      body: "Strong approved applications may appear as public finalists for the current cycle.",
    },
    {
      step: "04",
      title: "Finalists",
      emotion: "The field narrows with transparency.",
      body: "Up to five finalists are highlighted publicly. One winner is chosen per period.",
    },
    {
      step: "05",
      title: "Winner & payout",
      emotion: "Capital meets verified work.",
      body: "The selected winner receives up to $1,000. Funds are transferred manually to verified recipients — not through individual campaign pages.",
    },
  ] satisfies GrantsSelectionStep[],
} as const;

export const GRANTS_FAQ = {
  id: "faq",
  eyebrow: "FAQ",
  title: "Grant questions, answered plainly.",
  subtitle: "Still unsure? Read the cycle above or contact the team before the window closes.",
  groupId: "grants",
} as const;

export const GRANTS_HISTORY = {
  eyebrow: "Archive",
  title: "Previous grant cycles",
  subtitle: "Past windows stay visible so donors and applicants can see how the program runs over time.",
} as const;

export const GRANTS_CTA = {
  openTitle: "Ready when you are.",
  openBody:
    "If your documents are in order and your idea serves your community, the Apply page walks you through each step.",
  closedTitle: "This window has closed.",
  closedBody:
    "Track an existing application or support the Program Fund while the next cycle is prepared.",
  primaryOpen: { href: "/apply", label: "Start application" },
  primaryClosed: { href: "/track-application", label: "Track application" },
  secondaryOpen: { href: "/track-application", label: "Track instead" },
  secondaryClosed: { href: "/donate", label: "Support the fund" },
} as const;

export const GRANTS_STATUS_LABELS: Record<
  string,
  { label: string; tone: "open" | "review" | "closed" | "neutral" }
> = {
  Open: { label: "Applications open", tone: "open" },
  Upcoming: { label: "Opening soon", tone: "neutral" },
  Review: { label: "Under review", tone: "review" },
  WinnerSelection: { label: "Selecting winner", tone: "review" },
  Closed: { label: "Cycle closed", tone: "closed" },
};

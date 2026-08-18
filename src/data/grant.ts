export type PeriodStatus =
  | "Upcoming"
  | "Open"
  | "Review"
  | "WinnerSelection"
  | "Closed";

export interface GrantPeriod {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  maximumGrantAmount: number;
  status: PeriodStatus;
}

/** Replace with Application Period API data when available. */
export const CURRENT_PERIOD: GrantPeriod = {
  id: "period-2027-summer",
  title: "Summer 2027 Grant Cycle",
  startDate: "2027-07-21",
  endDate: "2027-08-30",
  maximumGrantAmount: 1000,
  status: "Open",
};

export const PREVIOUS_PERIODS: GrantPeriod[] = [
  {
    id: "period-2026-spring",
    title: "Spring 2026 Grant Cycle",
    startDate: "2026-03-01",
    endDate: "2026-04-15",
    maximumGrantAmount: 1000,
    status: "Closed",
  },
  {
    id: "period-2025-winter",
    title: "Winter 2025 Grant Cycle",
    startDate: "2025-11-01",
    endDate: "2025-12-15",
    maximumGrantAmount: 1000,
    status: "Closed",
  },
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Apply",
    body: "Submit your idea and the required information during an open grant cycle.",
  },
  {
    step: "02",
    title: "Review",
    body: "The IFundAyiti team reviews applications for completeness, feasibility, and community impact.",
  },
  {
    step: "03",
    title: "Finalists",
    body: "Outstanding approved applicants become finalists for the current cycle.",
  },
  {
    step: "04",
    title: "Winner",
    body: "One finalist is selected as the winner and receives grant funding.",
  },
  {
    step: "05",
    title: "Impact",
    body: "Funding helps turn the idea into real-world impact in Haitian communities.",
  },
] as const;

export const ELIGIBILITY = [
  "Applicants should be based in Haiti and able to carry out the proposed project locally.",
  "Projects should serve a community need — livelihoods, food, energy, water, education, or similar.",
  "Requested amounts cannot exceed $1,000.",
  "Required identification and supporting documents must be provided.",
];

export const REQUIREMENTS = [
  "Government-issued ID",
  "Proof of address",
  "Project description and fund-use plan",
  "Expected community impact",
  "Business plan or supporting images (optional but recommended)",
];

/** Replaceable demo metrics — not official IFundAyiti statistics. */
export const DEMO_IMPACT_STATS = [
  { label: "Applications received", value: "148", note: "Demo figure" },
  { label: "Grants awarded", value: "12", note: "Demo figure" },
  { label: "Projects supported", value: "36", note: "Demo figure" },
  { label: "Funds awarded", value: "$11,400", note: "Demo figure" },
];

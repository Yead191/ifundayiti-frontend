export interface EventSpeaker {
  name: string;
  role: string;
  avatar: string;
}

export type EventCategory = "fundraiser" | "pitch-night" | "workshop" | "gala";
export type EventType = "physical" | "virtual" | "hybrid";

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  eventType: EventType;
  venueAddress?: string;
  virtualLink?: string;
  category: EventCategory;
  description: string;
  fundraisingGoal?: number;
  fundraisingRaised?: number;
  image: string;
  featured: boolean;
  speakers?: EventSpeaker[];
  rsvpCount: number;
}

export const EVENT_CATEGORIES: { id: EventCategory | "all"; label: string; color: string }[] = [
  { id: "all", label: "All Events", color: "bg-forest text-white" },
  { id: "fundraiser", label: "Fundraisers", color: "bg-amber-600 text-white" },
  { id: "pitch-night", label: "Pitch Nights", color: "bg-violet-600 text-white" },
  { id: "workshop", label: "Workshops", color: "bg-emerald-600 text-white" },
  { id: "gala", label: "Donor Galas", color: "bg-rose-600 text-white" },
];

export const MOCK_EVENTS: EventItem[] = [];

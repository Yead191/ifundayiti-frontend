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

/** Helper to generate relative ISO date strings (e.g. today + N days) */
function getRelativeDateStr(dayOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const MOCK_EVENTS: EventItem[] = [
  {
    id: "evt-001",
    slug: "annual-spring-grant-fundraiser",
    title: "Annual Micro-Grant Fundraiser & Launch Drive",
    date: getRelativeDateStr(2), // 2 days from today
    time: "6:00 PM – 9:00 PM EST",
    location: "Port-au-Prince & Live Zoom Stream",
    eventType: "hybrid",
    venueAddress: "Hotel Karibe, Room A, Pétion-Ville, Haiti",
    virtualLink: "https://zoom.us/j/demo-ifundayiti-spring",
    category: "fundraiser",
    description:
      "Join us live as we launch our Micro-Grant Drive! All contributions benefit the central IFundAyiti Program Fund, which awards equity-free grants to Haitian entrepreneurs.",
    fundraisingGoal: 25000,
    fundraisingRaised: 18450,
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200&h=800",
    featured: true,
    rsvpCount: 248,
    speakers: [
      {
        name: "Jean-Philippe Laurent",
        role: "IFundAyiti Executive Director",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Marie-Claire Desrosiers",
        role: "Past Grant Winner & Solèy Founder",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
  {
    id: "evt-001b",
    slug: "morning-creator-coffee",
    title: "Morning Haitian Creators & Innovators Meetup",
    date: getRelativeDateStr(2), // SAME DAY EVENT #2 (2 days from today)
    time: "10:00 AM – 11:30 AM EST",
    location: "Zoom Virtual Meeting",
    eventType: "virtual",
    virtualLink: "https://zoom.us/j/demo-ifundayiti-coffee",
    category: "workshop",
    description:
      "A morning virtual coffee & casual networking session for Haitian creators, developers, and micro-business founders to connect and share ideas.",
    fundraisingGoal: 2000,
    fundraisingRaised: 1500,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200&h=800",
    featured: false,
    rsvpCount: 94,
  },
  {
    id: "evt-002",
    slug: "q1-live-pitch-night",
    title: "Live Grant Finalist Pitch Night",
    date: getRelativeDateStr(7), // 7 days from today
    time: "7:00 PM – 9:30 PM EST",
    location: "Hotel Karibe, Pétion-Ville",
    eventType: "physical",
    venueAddress: "Hotel Karibe Main Auditorium, Pétion-Ville, Haiti",
    category: "pitch-night",
    description:
      "Top 10 Haitian startup finalists pitch their business ideas to our grant selection committee. Attendees watch live in person and vote to support entrepreneurs.",
    fundraisingGoal: 10000,
    fundraisingRaised: 9200,
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200&h=800",
    featured: true,
    rsvpCount: 312,
    speakers: [
      {
        name: "Daphney Joseph",
        role: "Lead Grant Reviewer",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
  {
    id: "evt-002b",
    slug: "virtual-pitch-qna",
    title: "Virtual Pitch Masterclass & Q&A",
    date: getRelativeDateStr(7), // SAME DAY EVENT #2 (7 days from today)
    time: "2:00 PM – 3:30 PM EST",
    location: "Zoom Virtual Meeting",
    eventType: "virtual",
    virtualLink: "https://zoom.us/j/demo-ifundayiti-pitchqna",
    category: "workshop",
    description:
      "An interactive Zoom Q&A session guiding applicants on pitching techniques, storytelling, and preparing 3-minute pitch decks.",
    fundraisingGoal: 3000,
    fundraisingRaised: 2800,
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200&h=800",
    featured: false,
    rsvpCount: 120,
  },
  {
    id: "evt-003",
    slug: "financial-literacy-workshop",
    title: "Financial Literacy & Business Planning Workshop",
    date: getRelativeDateStr(12), // 12 days from today
    time: "2:00 PM – 4:30 PM EST",
    location: "Zoom Virtual Masterclass",
    eventType: "virtual",
    virtualLink: "https://zoom.us/j/demo-ifundayiti-finance",
    category: "workshop",
    description:
      "An interactive Zoom workshop guiding micro-entrepreneurs on cash flow management, budgeting for growth, and preparing grant proposals.",
    fundraisingGoal: 2000,
    fundraisingRaised: 2000,
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200&h=800",
    featured: false,
    rsvpCount: 145,
    speakers: [
      {
        name: "Pierre-Richard Noel",
        role: "Financial Strategist",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
  {
    id: "evt-004",
    slug: "diaspora-donor-gala-miami",
    title: "Haitian Diaspora Leadership Gala & Fundraiser",
    date: getRelativeDateStr(18), // 18 days from today
    time: "6:30 PM – 10:00 PM EST",
    location: "Little Haiti Cultural Center, Miami, FL",
    eventType: "physical",
    venueAddress: "212 NE 59th Terrace, Miami, FL 33137",
    category: "gala",
    description:
      "An evening of Haitian art, cultural performances, and networking. All ticket proceeds and donations support the central IFundAyiti Program Fund.",
    fundraisingGoal: 50000,
    fundraisingRaised: 31200,
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200&h=800",
    featured: true,
    rsvpCount: 190,
    speakers: [
      {
        name: "Ambassador Michèle Pierre",
        role: "Guest Speaker",
        avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },
  {
    id: "evt-005",
    slug: "clean-energy-innovation-workshop",
    title: "Clean Energy & Solar Innovation Masterclass",
    date: getRelativeDateStr(24), // 24 days from today
    time: "10:00 AM – 1:00 PM EST",
    location: "Cap-Haïtien Tech Hub & Zoom Stream",
    eventType: "hybrid",
    venueAddress: "Cap-Haïtien Innovation Hub, Rue 18 B, Haiti",
    virtualLink: "https://zoom.us/j/demo-ifundayiti-solar",
    category: "workshop",
    description:
      "Specialized session focusing on green technology, solar installation micro-businesses, and sustainable agricultural techniques.",
    fundraisingGoal: 5000,
    fundraisingRaised: 3400,
    image:
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=1200&h=800",
    featured: false,
    rsvpCount: 88,
  },
];

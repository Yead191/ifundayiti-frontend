export type TeamCategory = "all" | "directors" | "members" | "volunteers";

export interface TeamMember {
  id: string;
  name: string;
  title?: string;
  role: string;
  category: "directors" | "members" | "volunteers";
  location: string;
  bio: string;
  photoUrl: string;
  focusAreas: string[];
  email?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  featured?: boolean;
}

export const TEAM_CATEGORIES: { id: TeamCategory; label: string; description: string }[] = [
  {
    id: "all",
    label: "All Team",
    description: "Every director, staff member, and volunteer driving community micro-grants across Ayiti.",
  },
  {
    id: "directors",
    label: "Board of Directors",
    description: "Stewardship leaders guiding policy, governance, and transparent fund management.",
  },
  {
    id: "members",
    label: "Core Members",
    description: "Full-time operations, grant review, verification, and tech infrastructure team.",
  },
  {
    id: "volunteers",
    label: "Volunteers & Ambassadors",
    description: "Ground-level community forces verifying projects, translating forms, and connecting local talent.",
  },
];

export const TEAM_STATS = [
  { label: "Board Directors", value: "5", suffix: "" },
  { label: "Core Operations", value: "6", suffix: "" },
  { label: "Active Volunteers", value: "50", suffix: "+" },
  { label: "Haiti Departments", value: "10", suffix: "/10" },
];

export const TEAM_VALUES = [
  {
    icon: "ShieldCheck",
    title: "Uncompromising Integrity",
    description: "Every dollar donated is tracked with open public records. Governance rests on clear standards, not secret handshakes.",
  },
  {
    icon: "MapPin",
    title: "Rooted in the Soil",
    description: "Our staff and volunteers live in Port-au-Prince, Cap-Haïtien, Jacmel, and Les Cayes. We understand local realities.",
  },
  {
    icon: "HeartHandshake",
    title: "Dignity Over Pity",
    description: "We fund Haitian micro-entrepreneurs as capable builders, providing equity-free capital to catalyze self-reliance.",
  },
  {
    icon: "Globe",
    title: "One Ayiti, Global Unity",
    description: "Bridging local innovators with the global diaspora to build sustainable, long-term economic infrastructure.",
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  // DIRECTORS
  {
    id: "dir-1",
    name: "Jean-Baptiste Casimir",
    role: "Executive Director & Co-Founder",
    category: "directors",
    location: "Port-au-Prince, Haiti",
    bio: "Jean-Baptiste has dedicated over 14 years to community development and micro-finance initiatives in Haiti. He co-founded IFundAyiti to replace slow bureaucracy with transparent, direct micro-grant capital.",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=700&h=800",
    focusAreas: ["Strategic Vision", "Grant Governance", "Community Relations"],
    email: "jb.casimir@ifundayiti.org",
    linkedin: "https://linkedin.com",
    featured: true,
  },
  {
    id: "dir-2",
    name: "Dr. Marie-Rose Célestin",
    role: "Chair of the Board",
    category: "directors",
    location: "Cap-Haïtien, Haiti",
    bio: "Educator and civic leader with 20+ years of public policy experience in Northern Haiti. Dr. Célestin ensures all grant selection procedures remain strictly objective, transparent, and dignified.",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=700&h=800",
    focusAreas: ["Governance", "Ethics & Oversight", "Education Grants"],
    email: "marie.celestin@ifundayiti.org",
    linkedin: "https://linkedin.com",
    featured: true,
  },
  {
    id: "dir-3",
    name: "Emmanuel 'Manno' Saint-Louis",
    role: "Director of Finance & Stewardship",
    category: "directors",
    location: "Miami, FL / Port-au-Prince",
    bio: "Certified public accountant specializing in non-profit compliance. Emmanuel oversees fund disbursement audit trails and ensures 100% payout accountability for every grant cycle.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=700&h=800",
    focusAreas: ["Financial Audit", "Payout Security", "Compliance"],
    email: "manno.stlouis@ifundayiti.org",
    twitter: "https://twitter.com",
    featured: true,
  },
  {
    id: "dir-4",
    name: "Fabienne Pierre-Louis",
    role: "Director of Diaspora Partnerships",
    category: "directors",
    location: "Montreal, QC, Canada",
    bio: "Community organizer and diaspora ambassador uniting Haitian diaspora associations across North America and Europe to fund micro-grants back home.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=700&h=800",
    focusAreas: ["Diaspora Engagement", "Strategic Alliances", "Fundraising"],
    email: "fabienne.pierrelouis@ifundayiti.org",
    linkedin: "https://linkedin.com",
  },
  {
    id: "dir-5",
    name: "Peterson Valcin",
    role: "Director of Legal & Compliance",
    category: "directors",
    location: "Port-au-Prince, Haiti",
    bio: "Human rights attorney and legal counsel ensuring IFundAyiti complies with national and international non-profit operating frameworks while protecting grant recipient rights.",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=700&h=800",
    focusAreas: ["Legal Compliance", "Contract Protection", "Risk Management"],
    email: "peterson.valcin@ifundayiti.org",
  },

  // CORE MEMBERS
  {
    id: "mem-1",
    name: "Yvenet Guerrier",
    role: "Senior Grant & Operations Manager",
    category: "members",
    location: "Port-au-Prince, Haiti",
    bio: "Manages day-to-day grant application workflows, coordinates vetting committee schedules, and ensures applicant communication stays clear and responsive.",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=700&h=800",
    focusAreas: ["Workflow Management", "Grant Review", "Applicant Relations"],
    email: "yvenet.guerrier@ifundayiti.org",
    featured: true,
  },
  {
    id: "mem-2",
    name: "Claudette Thermidor",
    role: "Lead Community Engagement Officer",
    category: "members",
    location: "Les Cayes, Haiti",
    bio: "Traverses local markets and agricultural hubs across Southern Haiti to help grass-root entrepreneurs format applications and submit proof of business identity.",
    photoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=700&h=800",
    focusAreas: ["Field Engagement", "Micro-enterprise", "Southern Haiti"],
    email: "claudette.thermidor@ifundayiti.org",
  },
  {
    id: "mem-3",
    name: "Reginal 'Reggie' Alexis",
    role: "Lead Platform & Tech Architect",
    category: "members",
    location: "Cap-Haïtien, Haiti",
    bio: "Full-stack engineer building IFundAyiti’s public transparency platform, real-time application tracker, and secure donor payment engine.",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=700&h=800",
    focusAreas: ["Platform Dev", "Security", "Public Data Verification"],
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "mem-4",
    name: "Nadège Charles",
    role: "Verification & Impact Officer",
    category: "members",
    location: "Gonaïves, Haiti",
    bio: "Performs post-payout site visits, verifies receipt of micro-grant funds, and compiles baseline impact data on job creation and inventory expansion.",
    photoUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=700&h=800",
    focusAreas: ["Impact Analytics", "On-site Verification", "Field Audits"],
    email: "nadege.charles@ifundayiti.org",
  },
  {
    id: "mem-5",
    name: "Michèle Saint-Surin",
    role: "Communications & Storytelling Lead",
    category: "members",
    location: "Jacmel, Haiti",
    bio: "Documentary photographer and digital storyteller capturing winner journeys, local artisan spotlights, and cultural project showcases across Haiti.",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=700&h=800",
    focusAreas: ["Visual Media", "Storytelling", "Social Channels"],
    twitter: "https://twitter.com",
  },
  {
    id: "mem-6",
    name: "Stanley Beauchamp",
    role: "Applicant Support Specialist",
    category: "members",
    location: "Hinche, Haiti",
    bio: "Provides hotline and messaging support to applicants, helping them track their application status and update missing document uploads.",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=700&h=800",
    focusAreas: ["Helpdesk", "Kreyòl Support", "User Guidance"],
  },

  // VOLUNTEERS
  {
    id: "vol-1",
    name: "Woodley Joseph",
    role: "Field Verification Volunteer",
    category: "volunteers",
    location: "Port-au-Prince (Carrefour), Haiti",
    bio: "Helps verify local business locations and assists neighborhood vendors who lack smartphone access to upload identity proof.",
    photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600&h=600",
    focusAreas: ["Local Verification", "Community Assistance"],
  },
  {
    id: "vol-2",
    name: "Rose-Merline Auguste",
    role: "Regional Outreach Ambassador",
    category: "volunteers",
    location: "Cap-Haïtien, Haiti",
    bio: "Organizes info sessions in northern communities to explain how IFundAyiti micro-grants work and encourage women entrepreneurs to apply.",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600&h=600",
    focusAreas: ["Women Entrepreneurs", "Regional Workshops"],
  },
  {
    id: "vol-3",
    name: "Ketsia Antoine",
    role: "Translation & Documentation Support",
    category: "volunteers",
    location: "Jacmel, Haiti",
    bio: "Translates grant guidelines, FAQs, and application prompts between Haitian Kreyòl, French, and English for total accessibility.",
    photoUrl: "https://images.unsplash.com/photo-1534751516642-a171e261f52c?auto=format&fit=crop&q=80&w=600&h=600",
    focusAreas: ["Kreyòl Translation", "Documentation"],
  },
  {
    id: "vol-4",
    name: "Frantzley Hyppolite",
    role: "Distribution & Event Logistics Volunteer",
    category: "volunteers",
    location: "Les Cayes, Haiti",
    bio: "Assists during winner announcement events and coordinates logistics for in-person check presentations in the Southern department.",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600&h=600",
    focusAreas: ["Event Support", "Winner Logistics"],
  },
  {
    id: "vol-5",
    name: "Stephanie Desrosiers",
    role: "Diaspora Youth & Ambassador Lead",
    category: "volunteers",
    location: "Boston, MA, USA",
    bio: "Coordinates university youth chapters in the diaspora to host awareness drives and fund micro-grants for Haitian youth projects.",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600&h=600",
    focusAreas: ["Youth Engagement", "Diaspora Campaigns"],
  },
  {
    id: "vol-6",
    name: "Junior Bellegarde",
    role: "Community Media & Video Volunteer",
    category: "volunteers",
    location: "Jérémie, Haiti",
    bio: "Captures video updates of grant winners in Grand'Anse, documenting their progress and sharing short updates with donors.",
    photoUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=600&h=600",
    focusAreas: ["Video Updates", "Grand'Anse Coverage"],
  },
];

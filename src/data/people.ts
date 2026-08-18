export interface PersonProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  isDemo: true;
}

/** Demo leadership — not actual IFundAyiti staff. Replace before launch. */
export const LEADERSHIP: PersonProfile[] = [
  {
    id: "president",
    name: "Demo President",
    role: "President",
    bio: "Placeholder profile for the IFundAyiti president. Replace with an official biography, portrait, and title.",
    photoUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=700",
    isDemo: true,
  },
  {
    id: "board-1",
    name: "Demo Board Member",
    role: "Board Chair",
    bio: "Placeholder board profile. Replace with a real director name, role, and short biography.",
    photoUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600&h=700",
    isDemo: true,
  },
  {
    id: "board-2",
    name: "Demo Board Member",
    role: "Treasurer",
    bio: "Placeholder board profile. Replace with a real director name, role, and short biography.",
    photoUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=700",
    isDemo: true,
  },
  {
    id: "board-3",
    name: "Demo Board Member",
    role: "Secretary",
    bio: "Placeholder board profile. Replace with a real director name, role, and short biography.",
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600&h=700",
    isDemo: true,
  },
];

/** Demo volunteers — not actual IFundAyiti volunteers. */
export const VOLUNTEERS: PersonProfile[] = [
  {
    id: "vol-1",
    name: "Demo Volunteer",
    role: "Application review support",
    bio: "Placeholder volunteer profile. Replace with a real volunteer name and contribution.",
    photoUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=500&h=500",
    isDemo: true,
  },
  {
    id: "vol-2",
    name: "Demo Volunteer",
    role: "Community outreach",
    bio: "Placeholder volunteer profile. Replace with a real volunteer name and contribution.",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500&h=500",
    isDemo: true,
  },
  {
    id: "vol-3",
    name: "Demo Volunteer",
    role: "Translation & documentation",
    bio: "Placeholder volunteer profile. Replace with a real volunteer name and contribution.",
    photoUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=500&h=500",
    isDemo: true,
  },
  {
    id: "vol-4",
    name: "Demo Volunteer",
    role: "Event coordination",
    bio: "Placeholder volunteer profile. Replace with a real volunteer name and contribution.",
    photoUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500&h=500",
    isDemo: true,
  },
];

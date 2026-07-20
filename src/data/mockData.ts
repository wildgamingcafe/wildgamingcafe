export interface Tournament {
  id: string;
  game: "Valorant" | "CS2" | "FC25" | "Mobile" | string;
  title: string;
  date: string;
  time: string;
  prizePool: string;
  entryFee: string;
  format: string;
  slotsRemaining: number;
  totalSlots: number;
  image: string;
  featured?: boolean;
  status: "Registration Open" | "Filling Fast" | "Almost Full" | "Live" | "Completed";
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  game: string;
}

export const tournamentsData: Tournament[] = [
  {
    id: "1",
    game: "Valorant",
    title: "Clash At Wild",
    date: "Completed",
    time: "TBA",
    prizePool: "TBA",
    entryFee: "Closed",
    format: "Tournament",
    slotsRemaining: 0,
    totalSlots: 16,
    image: "/images/clashatwild.jpg",
    featured: true,
    status: "Completed",
  }
];

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Blaze Reapers", points: 1000, game: "Valorant" }
];

export const galleryImages = [
  "/images/clashatwild/DSC09620.JPG",
  "/images/clashatwild/DSC09625.JPG",
  "/images/clashatwild/DSC09639.JPG",
  "/images/clashatwild/DSC09643.JPG",
  "/images/clashatwild/DSC09652.JPG",
  "/images/clashatwild/DSC09666.JPG"
];

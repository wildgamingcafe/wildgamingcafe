// Gaming Lounge data — uses real Wild Gaming Cafe assets

const SITE = "https://www.wildgamingcafe.com";

export const pcPricing = [
  { duration: "1 Hour", price: "₹120" },
  { duration: "2 Hours", price: "₹220" },
  { duration: "5 Hours", price: "₹500", popular: true },
  { duration: "8 Hours", price: "₹720" },
];

export const ps5Pricing = [
  { players: "1 Player", price: "₹180", note: "Solo" },
  { players: "1-2 Players", price: "₹250", popular: true, note: "Duo" },
  { players: "2-4 Players", price: "₹400", note: "Squad" },
];

export interface GameItem {
  title: string;
  cover: string;
}

// Official game covers from Wild Gaming's own asset CDN
export const popularGames: GameItem[] = [
  { title: "Valorant", cover: "/images/Valorant.jpg" },
  { title: "FC 26", cover: "/images/FC26.jpg" },
  { title: "Call of Duty", cover: "/images/COD.jpg" },
  { title: "GTA V", cover: "/images/GTA5.jpg" },
  { title: "PUBG", cover: "/images/PUBG.jpg" },
  { title: "Tekkan 8 ", cover: "/images/Tekkan8.jpg" },
  { title: "Mortal Combat ", cover: "/images/Mortal.jpg" },
  { title: "Cricket 24", cover: "/images/Cricket.jpg" },

];

export const PCGames: GameItem[] = [
  { title: "Valorant", cover: "/images/Valorant.jpg" },
  { title: "Counter strike 2 ", cover: "/images/CS2.jpg" },
  { title: "Apex Legends", cover: "/images/Apexlegends.jpg" },
  { title: "PUBG", cover: "/images/PUBG.jpg" },
  { title: "Call of Duty", cover: "/images/COD.jpg" },
  { title: "Dota 2", cover: "/images/Dota2.jpg" },
  { title: "GTA V", cover: "/images/GTA5.jpg" },
  { title: "fortnite", cover: "/images/fortnite.jpg" },

];

export const PS5Games: GameItem[] = [
  { title: "FC 26", cover: "/images/FC26.jpg" },
  { title: "Tekken 8", cover: "/images/Tekkan8.jpg" },
  { title: "GTA V", cover: "/images/GTA5.jpg" },
  { title: "WWE 2K25", cover: "/images/WWE2K25.jpg" },
  { title: "Mortal Combat ", cover: "/images/Mortal.jpg" },
  { title: "Cricket 24", cover: "/images/Cricket.jpg" },
  { title: "Godofwar", cover: "/images/Godofwar.jpg" },
  { title: "Spiderman", cover: "/images/Spiderman.jpg" },
];

// Real Wild Gaming venue photos
export const gamingZones = [
  {
    name: "PC Arena",
    description: "High-performance PCs for competitive gamers.",
    image: `${SITE}/assets/lounge1-yzOncpM3.jpg`,
  },
  {
    name: "PS5 Zone",
    description: "Next-gen console gaming on the big screen.",
    image: `${SITE}/assets/console-gaming-2-MX5zlaXE.jpg`,
  },
  {
    name: "Tournament Setup",
    description: "Built for LAN events, scrims and championships.",
    image: `${SITE}/assets/vpl-event-B3_eldN7.jpg`,
  },
  {
    name: "The Lounge",
    description: "The complete Wild Gaming experience.",
    image: `${SITE}/assets/lounge22-Bypi0MlJ.jpg`,
  },
];

export const hardwareSpecs = [
  { icon: "wifi", label: "1 Gbps", sublabel: "Fiber Internet" },
  { icon: "gpu", label: "RTX", sublabel: "Graphics" },
  { icon: "cpu", label: "Intel", sublabel: "Core i7" },
  { icon: "monitor", label: "144Hz / 240Hz", sublabel: "Monitors" },
  { icon: "keyboard", label: "Mechanical", sublabel: "Keyboards" },
  { icon: "chair", label: "Premium", sublabel: "Gaming Chairs" },
];

export const faqItems = [
  {
    question: "Do I need to book in advance?",
    answer: "Walk-ins are welcome, but booking in advance is recommended during weekends and peak hours.",
  },
  {
    question: "What games are available?",
    answer: "Wild Gaming offers a large library of popular titles including Valorant, CS2, FC, PUBG, GTA V, Apex Legends and many more.",
  },
  {
    question: "What internet speed is available?",
    answer: "The gaming lounge is powered by a 1 Gbps fiber internet connection for low-latency gaming.",
  },
  {
    question: "Are tournaments open to everyone?",
    answer: "Most tournaments and community events are open to all players. Event-specific requirements will be listed on the Events page.",
  },
  {
    question: "What platforms are available?",
    answer: "Wild Gaming offers high-performance gaming PCs and a dedicated PS5 gaming zone.",
  },
];

// Real Wild Gaming venue gallery images
export const galleryImages = [
  `${SITE}/assets/lounge1-yzOncpM3.jpg`,
  `${SITE}/assets/lounge22-Bypi0MlJ.jpg`,
  `${SITE}/assets/vpl-event-B3_eldN7.jpg`,
  `${SITE}/assets/console-gaming-2-MX5zlaXE.jpg`,
  `${SITE}/assets/multiplayer-2-B5t4fkH6.jpg`,
  `${SITE}/assets/singleplayer-3-EmjHTWmu.jpg`,
  `${SITE}/assets/featured-BkjSPUVf.jpg`,
  `${SITE}/assets/singleplayer4-C0PYTsPf.jpg`,
];

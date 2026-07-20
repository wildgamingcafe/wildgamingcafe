export interface Game {
  id: string;
  title: string;
  slug: string;
  platforms: ("PC" | "PS5")[];
  genres: string[];
  coverImage: string;
  available: boolean;
  featured?: boolean;
}

export const gamesData: Game[] = [
  // FPS
  {
    id: "g1",
    title: "Valorant",
    slug: "valorant",
    platforms: ["PC"],
    genres: ["FPS"],
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mvt.jpg",
    available: true,
    featured: true,
  },
  {
    id: "g2",
    title: "Counter-Strike 2",
    slug: "cs2",
    platforms: ["PC"],
    genres: ["FPS"],
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/library_600x900_2x.jpg",
    available: true,
  },
  {
    id: "g3",
    title: "Call of Duty",
    slug: "cod",
    platforms: ["PC", "PS5"],
    genres: ["FPS"],
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1938090/library_600x900_2x.jpg",
    available: true,
  },
  {
    id: "g4",
    title: "Apex Legends",
    slug: "apex",
    platforms: ["PC", "PS5"],
    genres: ["FPS"],
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/library_600x900_2x.jpg",
    available: true,
  },
  {
    id: "g5",
    title: "PUBG",
    slug: "pubg",
    platforms: ["PC"],
    genres: ["FPS"],
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/578080/library_600x900_2x.jpg",
    available: true,
  },

  // MOBA
  {
    id: "g6",
    title: "Dota 2",
    slug: "dota2",
    platforms: ["PC"],
    genres: ["MOBA"],
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/library_600x900_2x.jpg",
    available: true,
  },
  {
    id: "g7",
    title: "League of Legends",
    slug: "lol",
    platforms: ["PC"],
    genres: ["MOBA"],
    coverImage: "https://images.igdb.com/igdb/image/upload/t_cover_big/co49wj.jpg",
    available: true,
  },

  // Racing
  {
    id: "g8",
    title: "Forza Horizon 5",
    slug: "forza5",
    platforms: ["PC"],
    genres: ["Racing"],
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/library_600x900_2x.jpg",
    available: true,
  },
  {
    id: "g9",
    title: "Need for Speed",
    slug: "nfs",
    platforms: ["PC", "PS5"],
    genres: ["Racing"],
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1846380/library_600x900_2x.jpg",
    available: true,
  },
  {
    id: "g10",
    title: "Asphalt Legends",
    slug: "asphalt",
    platforms: ["PC"],
    genres: ["Racing"],
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1815780/library_600x900_2x.jpg",
    available: true,
  },

  // Sports
  {
    id: "g11",
    title: "EA FC 26",
    slug: "eafc26",
    platforms: ["PC", "PS5"],
    genres: ["Sports"],
    coverImage: "/images/FC26.jpg",
    available: true,
    featured: true,
  },
  {
    id: "g12",
    title: "Cricket 24",
    slug: "cricket24",
    platforms: ["PC", "PS5"],
    genres: ["Sports"],
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358260/library_600x900_2x.jpg",
    available: true,
  },

  // Fighting
  {
    id: "g13",
    title: "Tekken 8",
    slug: "tekken8",
    platforms: ["PC", "PS5"],
    genres: ["Fighting"],
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1778820/library_600x900_2x.jpg",
    available: true,
    featured: true,
  },
  {
    id: "g14",
    title: "Mortal Kombat 1",
    slug: "mk1",
    platforms: ["PC", "PS5"],
    genres: ["Fighting"],
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1971870/library_600x900_2x.jpg",
    available: true,
  },
  {
    id: "g15",
    title: "Street Fighter 6",
    slug: "sf6",
    platforms: ["PC", "PS5"],
    genres: ["Fighting"],
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1364780/library_600x900_2x.jpg",
    available: true,
  },

  // PS5 Exclusives
  {
    id: "g16",
    title: "GTA V",
    slug: "gtav",
    platforms: ["PS5"],
    genres: ["PS5 Exclusives"],
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    available: true,
    featured: true,
  },
  {
    id: "g17",
    title: "Assassin's Creed Valhalla",
    slug: "ac",
    platforms: ["PS5"],
    genres: ["PS5 Exclusives"],
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2208920/library_600x900_2x.jpg",
    available: true,
  },
  {
    id: "g18",
    title: "Spider-Man 2",
    slug: "spiderman2",
    platforms: ["PS5"],
    genres: ["PS5 Exclusives"],
    coverImage: "/images/Spiderman.jpg",
    available: true,
    featured: true,
  },
  {
    id: "g19",
    title: "God of War Ragnarok",
    slug: "gow",
    platforms: ["PS5"],
    genres: ["PS5 Exclusives"],
    coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2322010/library_600x900_2x.jpg",
    available: true,
  },
  {
    id: "g20",
    title: "Astro Bot",
    slug: "astrobot",
    platforms: ["PS5"],
    genres: ["PS5 Exclusives"],
    coverImage: "/images/astrobot.jpg",
    available: true,
  },
  {
    id: "g21",
    title: "Roblox",
    slug: "roblox",
    platforms: ["PC", "PS5"],
    genres: ["PS5 Exclusives"],
    coverImage: "/images/Roblox.jpg",
    available: true,
  }
];

// Helper functions for dynamic stats
export const getLibraryStats = () => {
  const totalGames = gamesData.length;
  const pcGames = gamesData.filter(g => g.platforms.includes("PC")).length;
  const ps5Games = gamesData.filter(g => g.platforms.includes("PS5")).length;
  const genresCount = Array.from(new Set(gamesData.flatMap(g => g.genres))).length;

  return { totalGames, pcGames, ps5Games, genresCount };
};

export const getAllGenres = () => {
  return Array.from(new Set(gamesData.flatMap(g => g.genres)));
};

export const getGamesByGenre = (genre: string) => {
  if (genre === "All") return gamesData;
  return gamesData.filter(g => g.genres.includes(genre));
};

export const getFeaturedGames = () => {
  return gamesData.filter(g => g.featured);
};

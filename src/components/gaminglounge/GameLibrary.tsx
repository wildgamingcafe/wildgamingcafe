"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface GameCardProps {
  game: {
    title: string;
    image_url: string;
    genre: string;
    platform: string;
  };
}

function GameCard({ game }: GameCardProps) {
  return (
    <div className="group relative overflow-hidden border border-[#262626] bg-[#0A0A0A] hover:border-accent/40 transition-colors duration-300">
      <div
        className="w-full aspect-[3/4] bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${game.image_url})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4 className="heading-style text-sm uppercase">{game.title}</h4>
      </div>
    </div>
  );
}

export default function GameLibrary({ games = [] }: { games?: any[] }) {
  const [activeTab, setActiveTab] = useState("popular");
  
  // Categorize games on the fly
  const popularGames = games.filter(g => g.is_featured);
  const PCGames = games.filter(g => g.platform?.includes("PC"));
  const PS5Games = games.filter(g => g.platform?.includes("PS5"));

  const tabs = [
    { id: "popular", label: "Featured Games", data: popularGames },
    { id: "PC", label: "PC Games", data: PCGames },
    { id: "PS5", label: "PS5 Games", data: PS5Games },
  ];

  const activeGames = tabs.find((t) => t.id === activeTab)?.data || popularGames;

  return (
    <section id="games" className="py-20 bg-[#0A0A0A] border-t border-b border-[#262626]">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="heading-style text-3xl md:text-4xl uppercase mb-4">
              Game <span className="text-accent">Library</span>
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-md">
              From FPS to racing, sports to RPG — we have something for every gamer.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center gap-3 border border-[#262626] p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors duration-200 ${activeTab === tab.id
                  ? "bg-accent text-black"
                  : "text-text-secondary hover:text-text-primary"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          className="flex overflow-x-auto no-scrollbar gap-4 sm:gap-6 pb-4 snap-x snap-mandatory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {activeGames.map((game) => (
            <div key={game.id || game.title} className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] snap-start">
              <GameCard game={game} />
            </div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Link
            href="/gamelibrary"
            className="inline-flex items-center gap-2 px-8 py-4 font-sans text-sm font-semibold uppercase tracking-wide bg-[#F4B000] text-black rounded-none transition duration-200 ease hover:bg-[#E0A300]"
          >
            EXPLORE FULL GAME LIBRARY
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import GameCard from "./GameCard";
import { Game } from "@/data/gameLibraryData";

interface InfiniteGameRowProps {
  title: string;
  games: any[];
  direction?: "left" | "right";
  id?: string;
}

export default function InfiniteGameRow({ title, games, id }: InfiniteGameRowProps) {
  return (
    <div id={id} className="py-10 border-b border-[#111111]">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-14 mb-8">
        <h3 className="heading-style text-2xl uppercase text-white flex items-center gap-3">
          <span className="w-1.5 h-6 bg-accent block"></span>
          {title}
        </h3>
      </div>

      <div className="w-full relative">
        <div className="flex overflow-x-auto no-scrollbar gap-4 sm:gap-6 px-4 md:px-10 lg:px-14 pb-4 snap-x snap-mandatory">
          {games.map((game) => (
            <div key={game.id} className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] snap-start">
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

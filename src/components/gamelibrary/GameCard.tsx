"use client";

import Image from "next/image";
import { Monitor, Gamepad2 } from "lucide-react";

interface GameCardProps {
  game: any;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <div className="group relative w-full h-full flex flex-col cursor-pointer overflow-hidden rounded-md border border-[#262626] bg-[#050505] transition-all duration-300 hover:border-accent hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(244,176,0,0.15)]">
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#111111]">
        <Image
          src={game.coverImage}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />
        {/* Overlay gradient for text readability at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
        
        {/* Platform Badges */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <h3 className="text-white font-sans font-bold text-sm md:text-base leading-tight uppercase truncate mr-2">
            {game.title}
          </h3>
          <div className="flex gap-1 flex-shrink-0">
            {game.platforms.includes("PC") && (
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-1.5 rounded-sm text-text-secondary group-hover:text-accent transition-colors" title="PC">
                <Monitor className="w-3.5 h-3.5" />
              </div>
            )}
            {game.platforms.includes("PS5") && (
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-1.5 rounded-sm text-text-secondary group-hover:text-accent transition-colors" title="PS5">
                <Gamepad2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

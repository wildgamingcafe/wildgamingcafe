"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Monitor, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function CoverFlowFeatured({ games }: { games: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!games || games.length === 0) return null;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden bg-[#050505] my-12" style={{ perspective: "1000px" }}>
      {/* Dynamic Background Blur */}
      <div className="absolute inset-0 opacity-20 blur-3xl transition-all duration-1000 ease-in-out">
         {games[activeIndex]?.coverImage && (
           <Image src={games[activeIndex].coverImage} alt="bg" fill className="object-cover" />
         )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />

      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {games.map((game, index) => {
          const isActive = index === activeIndex;
          const offset = index - activeIndex;
          
          return (
            <motion.div
              key={game.id || index}
              onClick={() => setActiveIndex(index)}
              animate={{
                scale: isActive ? 1.1 : 0.85,
                opacity: isActive ? 1 : 0.5,
                zIndex: isActive ? 50 : 40 - Math.abs(offset),
                rotateY: offset === 0 ? 0 : offset > 0 ? -25 : 25,
                x: offset * (typeof window !== 'undefined' && window.innerWidth < 768 ? 80 : 160),
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute w-[240px] md:w-[320px] aspect-[3/4] cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#262626] shadow-2xl group">
                <Image src={game.coverImage} alt={game.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 400px" />
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
                    <span className="text-accent text-xs font-bold uppercase tracking-wider mb-2">{game.genre}</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase text-white mb-2 leading-tight">{game.title}</h3>
                    <div className="flex flex-wrap gap-3 text-xs md:text-sm text-text-secondary mb-4">
                      {game.platforms?.map((p: string) => (
                         <span key={p} className="flex items-center gap-1 font-semibold uppercase">
                           {p.toLowerCase().includes('ps5') || p.toLowerCase().includes('playstation') ? <Gamepad2 className="w-4 h-4"/> : <Monitor className="w-4 h-4"/>}
                           {p}
                         </span>
                      ))}
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link href="#footer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-2 bg-accent text-black px-4 py-2 text-sm font-bold uppercase hover:bg-white transition-colors">
                        <CalendarDays className="w-4 h-4" /> Book Now
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 md:left-12 z-50 p-3 rounded-full bg-black/50 border border-[#262626] text-white hover:bg-accent hover:text-black transition-colors backdrop-blur-sm"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-4 md:right-12 z-50 p-3 rounded-full bg-black/50 border border-[#262626] text-white hover:bg-accent hover:text-black transition-colors backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}

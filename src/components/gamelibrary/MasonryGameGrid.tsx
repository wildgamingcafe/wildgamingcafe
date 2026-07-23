"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Gamepad2, Monitor } from "lucide-react";

export default function MasonryGameGrid({ games, genre }: { games: any[], genre: string }) {
  if (!games || games.length === 0) return null;

  return (
    <div className="mb-24">
      <h2 className="text-3xl md:text-4xl font-black uppercase mb-8 border-l-4 border-accent pl-4 text-white">
        {genre}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 grid-flow-dense">
        {games.map((game, i) => {
          // Make every 5th item large (span 2 cols and rows) to create the masonry/magazine feel
          const isFeatured = i % 5 === 0;

          return (
            <motion.div
              key={game.id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.1 }}
              className={`relative overflow-hidden rounded-xl border border-[#262626] group cursor-pointer ${isFeatured ? 'col-span-2 row-span-2 aspect-square md:aspect-[4/3]' : 'col-span-1 aspect-[3/4]'}`}
            >
              <Image 
                src={game.coverImage} 
                alt={game.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                 <h3 className={`font-black uppercase text-white ${isFeatured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'} transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300`}>
                   {game.title}
                 </h3>
                 <div className="flex gap-3 text-accent text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 mt-2">
                    {game.platforms?.map((p: string) => (
                         <span key={p} className="flex items-center gap-1">
                           {p.toLowerCase().includes('ps5') || p.toLowerCase().includes('playstation') ? <Gamepad2 className="w-4 h-4"/> : <Monitor className="w-4 h-4"/>}
                           {p}
                         </span>
                    ))}
                 </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}

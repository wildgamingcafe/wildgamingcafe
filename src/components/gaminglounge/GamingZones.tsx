"use client";

import { motion } from "framer-motion";
import { gamingZones } from "@/data/loungeData";

export default function GamingZones({ data }: { data?: any[] }) {
  const zones = data && data.length > 0 ? data : gamingZones;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-14">
        <h2 className="heading-style text-3xl md:text-4xl text-center uppercase mb-16">
          Gaming <span className="text-accent">Zones</span>
        </h2>

        <div className="flex overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 no-scrollbar pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0">
          {zones.map((zone, i) => (
            <motion.div
              key={zone.name}
              className="relative group overflow-hidden border border-[#262626] aspect-[4/5] w-[85vw] sm:w-auto flex-shrink-0 snap-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${zone.image_url || zone.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/30 to-[#050505]/80 group-hover:bg-[#050505]/70 transition-colors duration-300" />
              
              <div className="absolute top-0 left-0 right-0 p-6 z-10">
                <h3 className="heading-style text-xl uppercase font-bold tracking-wider">{zone.name}</h3>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end">
                <p className="text-text-secondary text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  {zone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

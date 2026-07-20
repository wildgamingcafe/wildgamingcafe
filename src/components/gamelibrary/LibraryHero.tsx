"use client";

import Image from "next/image";
import { getLibraryStats } from "@/data/gameLibraryData";
import { motion } from "framer-motion";
import { Gamepad2, Monitor, Trophy, Layers } from "lucide-react";
import BookingButton from "@/components/ui/BookingButton";

export default function LibraryHero({ mediaUrl, alignment = "center" }: { mediaUrl?: string, alignment?: string }) {
  const url = mediaUrl || "/hero-library.jpg";
  const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
  const stats = getLibraryStats();

  const statItems = [
    { icon: Gamepad2, value: `${stats.totalGames}+`, label: "GAMES" },
    { icon: Monitor, value: `${stats.pcGames}+`, label: "PC GAMES" },
    { icon: Trophy, value: `${stats.ps5Games}+`, label: "PS5 GAMES" },
    { icon: Layers, value: stats.genresCount, label: "GENRES" },
  ];

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] min-h-[600px] md:min-h-[400px] flex items-center justify-center overflow-hidden bg-black">
      {isVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 z-0 w-full h-full object-cover opacity-70"
          style={{ objectPosition: alignment }}
        >
          <source src={url} />
        </video>
      ) : (
        <div
          className="absolute inset-0 z-0 bg-cover bg-no-repeat opacity-70"
          style={{ backgroundImage: `url(${url})`, backgroundPosition: alignment }}
        />
      )}

      {/* Dark Overlay matching Home Page */}
      <div className="absolute inset-0 z-10 bg-[#050505]/75" />

      {/* Content */}
      <div className="container relative z-20 mx-auto px-4 text-center flex flex-col items-center mt-12 mb-32 md:mb-0">
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl uppercase mb-6 leading-none tracking-tight text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          GAME <br />
          <span className="text-accent">LIBRARY</span>
        </motion.h1>

        <motion.p
          className="text-sm md:text-base text-text-secondary max-w-lg mb-8 leading-relaxed font-semibold uppercase tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Explore every title available at Wild Gaming Cafe.<br />
          <span className="text-white mt-1 block">Competitive. Casual. Story Driven. Racing. Sports.</span>
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={() => {
              const el = document.getElementById("featured");
              if (el) {
                const headerOffset = 120;
                window.scrollTo({
                  top: el.getBoundingClientRect().top + window.pageYOffset - headerOffset,
                  behavior: "smooth"
                });
              }
            }}
            className="flex items-center justify-center px-12 py-4 font-sans text-sm font-bold uppercase tracking-wide bg-[#F4B000] text-black transition duration-200 ease hover:bg-[#E0A300]"
          >
            EXPLORE GAMES
          </button>
        </motion.div>
      </div>

      {/* Floating Statistics Card */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-[95%] md:w-[90%] max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="bg-[#0A0A0A]/90 backdrop-blur-md border border-[#262626] rounded-md py-4 md:py-6 px-4 md:px-12 grid grid-cols-2 md:flex md:justify-between items-center gap-y-6 gap-x-2 md:gap-0">
          {statItems.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3 md:gap-4 md:px-4">
              <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-accent flex-shrink-0" />
              <div className="text-left">
                <p className="heading-style text-xl md:text-2xl text-white leading-none">{stat.value}</p>
                <p className="text-[10px] md:text-xs text-text-secondary font-bold uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
